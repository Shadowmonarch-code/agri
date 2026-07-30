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

// GET /api/quiz/daily - Get today's daily quiz questions
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)
    
    // Check if user already completed today's quiz
    let completedToday = false
    if (userId) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const existingResult = await db.quizResult.findFirst({
        where: {
          userId,
          quizType: 'DAILY',
          date: { gte: today },
        }
      })
      
      if (existingResult) {
        completedToday = true
      }
    }

    // Get random questions for daily quiz (10 questions)
    // In production, you'd have a dedicated daily quiz table
    const questions = await db.question.findMany({
      where: { isActive: true },
      include: {
        test: {
          select: { id: true, title: true, subject: true }
        }
      },
      orderBy: { id: 'asc' }, // Will be randomized in application logic or use raw query
      take: 50, // Get more to allow randomization
    })

    // Simple randomization (Fisher-Yates would be better)
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10)

    // Format questions without correct answers
    const formattedQuestions = shuffled.map((q, index) => ({
      id: q.id,
      questionNumber: index + 1,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      subject: q.subject || q.test?.subject,
      difficulty: q.difficulty,
      hint: q.hint,
    }))

    return NextResponse.json({
      success: true,
      data: {
        date: new Date().toISOString().split('T')[0],
        totalQuestions: formattedQuestions.length,
        timeLimit: 600, // 10 minutes in seconds
        completedToday,
        questions: formattedQuestions,
      }
    })
  } catch (error) {
    console.error('Get daily quiz error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch daily quiz' },
      { status: 500 }
    )
  }
}

// POST /api/quiz/daily/submit - Submit daily quiz answers
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { answers } = body as { answers: Array<{ questionId: string; selectedOption: string }> }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, error: 'Answers array is required' },
        { status: 400 }
      )
    }

    // Check if already completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingResult = await db.quizResult.findFirst({
      where: {
        userId,
        quizType: 'DAILY',
        date: { gte: today },
      }
    })

    if (existingResult) {
      return NextResponse.json(
        { success: false, error: 'Daily quiz already completed for today' },
        { status: 409 }
      )
    }

    // Get correct answers
    const questionIds = answers.map(a => a.questionId)
    const questions = await db.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, correctOption: true, explanation: true, marks: true }
    })

    const questionMap = new Map(questions.map(q => [q.id, q]))

    // Calculate score
    let correctCount = 0
    let wrongCount = 0
    const results = answers.map(answer => {
      const question = questionMap.get(answer.questionId)
      const isCorrect = question?.correctOption === answer.selectedOption
      
      if (isCorrect) correctCount++
      else wrongCount++

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        correctOption: question?.correctOption || '',
        isCorrect,
        explanation: question?.explanation || null,
      }
    })

    const totalQuestions = answers.length
    const percentage = (correctCount / totalQuestions) * 100

    // Save result
    const result = await db.quizResult.create({
      data: {
        userId,
        quizType: 'DAILY',
        score: correctCount,
        totalQuestions,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        timeTaken: 0, // Would be calculated on frontend
      }
    })

    // Award XP and coins
    const xpEarned = Math.floor(percentage * 3) + (correctCount * 10)
    const coinsEarned = correctCount * 5

    await db.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpEarned },
        coins: { increment: coinsEarned },
        streak: { increment: 1 }, // Simplified streak logic
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        resultId: result.id,
        score: {
          correct: correctCount,
          wrong: wrongCount,
          total: totalQuestions,
          percentage: Math.round(percentage * 100) / 100,
        },
        rewards: {
          xp: xpEarned,
          coins: coinsEarned,
        },
        results,
      },
      message: 'Daily quiz submitted successfully!'
    })
  } catch (error) {
    console.error('Submit daily quiz error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit daily quiz' },
      { status: 500 }
    )
  }
}
