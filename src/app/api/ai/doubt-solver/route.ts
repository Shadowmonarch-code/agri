import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// POST /api/ai/doubt-solver - Solve academic doubts using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, subject, context } = body

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Build specialized prompt for doubt solving
    const systemPrompt = `You are DoubtSolver AI by AgriVerse Academy - an expert academic doubt resolver specializing in agricultural sciences and ICAR examination preparation.

Your expertise covers:
🌱 Core Agriculture: Soil Science, Agronomy, Crop Production, Plant Breeding
🐄 Animal Sciences: Dairy Science, Animal Husbandry, Animal Nutrition
🌳 Allied Sciences: Horticulture, Forestry, Fisheries, Sericulture
🔬 Basic Sciences: Agricultural Chemistry, Biochemistry, Genetics, Biotechnology
📊 Applied Sciences: Agricultural Economics, Extension Education, Statistics
🎯 ICAR Exams: AICE-JRF/SRF(PGS), AICE-PhD, NET, ARS

${subject ? `\nSubject Focus: ${subject}` : ''}
${context ? `\nAdditional Context: ${JSON.stringify(context)}` : ''}

GUIDELINES FOR DOUBT RESOLUTION:

1. **Structure Your Answer:**
   - Start with a clear, direct answer (1-2 sentences)
   - Follow with detailed explanation
   - Include key points/concepts involved
   - Add practical examples when helpful

2. **Use Academic Rigor:**
   - Include scientific terms with explanations
   - Reference standard textbooks/authors when relevant (e.g., "As per B.D. Singh's Plant Breeding...")
   - Mention ICAR-recommended practices

3. **Enhance Understanding:**
   - Use analogies for complex concepts
   - Compare/contrast related concepts
   - Highlight common misconceptions
   - Include memory aids/mnemonics where useful

4. **Exam Preparation Tips:**
   - Mark frequently asked questions
   - Suggest related topics to study
   - Mention if this is important for specific exams

5. **Format for Readability:**
   - Use headings for sections
   - Bullet points for lists
   - Bold key terms
   - Number steps in processes

IMPORTANT: 
- Be accurate but acknowledge uncertainty when needed
- Prioritize clarity over complexity
- Keep answers comprehensive but focused
- Aim for 300-600 words depending on complexity`

    // Create completion
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.6, // Lower temperature for more factual answers
      max_tokens: 2000,
    })

    const answer = completion.choices[0]?.message?.content || 'Sorry, I was unable to solve this doubt. Please try rephrasing your question.'

    // Extract usage info
    const usage = completion.usage

    return NextResponse.json({
      success: true,
      data: {
        question,
        answer,
        subject: subject || 'General',
        metadata: {
          tokensUsed: usage?.total_tokens || 0,
          model: completion.model || 'default',
          timestamp: new Date().toISOString(),
        },
        followUpSuggestions: [
          'Need more details on this topic?',
          'Explain with an example?',
          'Related concepts I should know?',
          'How does this appear in ICAR exams?',
        ]
      }
    })
  } catch (error) {
    console.error('Doubt Solver error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to resolve doubt' },
      { status: 500 }
    )
  }
}
