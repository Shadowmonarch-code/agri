import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to get user ID from token
function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  
  try {
    const payload = JSON.parse(Buffer.from(authHeader.substring(7), 'base64url').toString())
    if (payload.exp && payload.exp < Date.now()) return null
    return payload.userId
  } catch {
    return null
  }
}

interface Answer {
  questionId: string
  selectedOption: string
}

// POST /api/tests/[id]/submit - Submit test answers and calculate score
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { attemptId, answers, timeTaken } = body as { 
      attemptId: string; 
      answers: Answer[]; 
      timeTaken?: number 
    }

    if (!attemptId || !answers) {
      return NextResponse.json(
        { success: false, error: 'Attempt ID and answers are required' },
        { status: 400 }
      )
    }

    // Verify attempt belongs to this user and test
    const attempt = await db.testAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
        testId: id,
        status: 'IN_PROGRESS',
      },
      include: {
        test: {
          include: {
            questions: {
              where: { isActive: true },
              select: {
                id: true,
                correctOption: true,
                marks: true,
                explanation: true,
                questionText: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
              }
            }
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired attempt' },
        { status: 404 }
      )
    }

    // Calculate score
    let obtainedScore = 0
    let correctCount = 0
    let wrongCount = 0
    const answerDetails: Array<{
      questionId: string
      selectedOption: string
      correctOption: string
      isCorrect: boolean
      marksObtained: number
      explanation: string | null
    }> = []

    // Create a map of answers for quick lookup
    const answersMap = new Map(answers.map((a: Answer) => [a.questionId, a.selectedOption]))

    // Process each question
    for (const question of attempt.test.questions) {
      const selectedOption = answersMap.get(question.id) || ''
      const isCorrect = selectedOption === question.correctOption
      
      if (isCorrect) {
        obtainedScore += question.marks
        correctCount++
      } else if (selectedOption && attempt.test.negativeMarking > 0) {
        obtainedScore -= attempt.test.negativeMarking
        wrongCount++
      } else if (selectedOption) {
        wrongCount++
      }

      answerDetails.push({
        questionId: question.id,
        selectedOption,
        correctOption: question.correctOption,
        isCorrect,
        marksObtained: isCorrect ? question.marks : (selectedOption ? -attempt.test.negativeMarking : 0),
        explanation: question.explanation,
      })
    }

    const totalQuestions = attempt.test.questions.length
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0

    // Update attempt with results
    const updatedAttempt = await db.testAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        timeTaken: timeTaken || Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000),
        obtainedScore: Math.max(0, obtainedScore),
        totalScore: attempt.test.totalMarks,
        percentage,
        answers: JSON.stringify(answers),
      }
    })

    // Update user XP and coins
    const xpEarned = Math.floor(percentage * 2) + (correctCount * 5)
    const coinsEarned = correctCount * 2

    await db.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpEarned },
        coins: { increment: coinsEarned },
      }
    })

    // Record quiz result for history
    await db.quizResult.create({
      data: {
        userId,
        quizType: 'SUBJECT',
        score: correctCount,
        totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        timeTaken: timeTaken || 0,
      }
    })

    // Determine rank (simplified - just count better scores)
    const rankWhere: any = {
      testId: id,
      status: 'COMPLETED',
      OR: [
        { percentage: { gt: percentage } },
      ]
    }
    
    if (updatedAttempt.completedAt) {
      rankWhere.OR.push({ percentage, completedAt: { lt: updatedAttempt.completedAt } })
    }
    
    const rank = await db.testAttempt.count({
      where: rankWhere
    }) + 1

    // Update rank on attempt
    await db.testAttempt.update({
      where: { id: attemptId },
      data: { rank }
    })

    return NextResponse.json({
      success: true,
      data: {
        attemptId: updatedAttempt.id,
        score: {
          obtained: Math.max(0, obtainedScore),
          total: attempt.test.totalMarks,
          percentage: Math.round(percentage * 100) / 100,
        },
        answers: {
          correct: correctCount,
          wrong: wrongCount,
          total: totalQuestions,
          skipped: totalQuestions - answers.length,
        },
        timeTaken: updatedAttempt.timeTaken,
        rank,
        rewards: {
          xp: xpEarned,
          coins: coinsEarned,
        },
        answerDetails,
      },
      message: 'Test submitted successfully!'
    })
  } catch (error) {
    console.error('Submit test error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit test' },
      { status: 500 }
    )
  }
}
