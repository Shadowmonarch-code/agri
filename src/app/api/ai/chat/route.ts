import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// POST /api/ai/chat - AI chat for agriculture/ICAR topics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Build system prompt with context
    const systemPrompt = `You are AgriVerse AI Assistant - an expert in Indian agriculture education and ICAR (Indian Council of Agricultural Research) examinations.

Your role is to help students with:
1. Agriculture and allied sciences concepts
2. ICAR exam preparation (AICE-JRF/SRF, AICE-PhD, etc.)
3. Agricultural universities and courses
4. Farming techniques and modern agriculture
5. Horticulture, dairy science, fisheries, forestry
6. Agricultural economics and extension

${context ? `\nCurrent context: ${context.department || ''} ${context.subject || ''}` : ''}

Guidelines:
- Provide accurate, educational information relevant to Indian agriculture
- Explain concepts clearly with examples where helpful
- Reference ICAR syllabus topics when relevant
- Suggest study materials or topics when appropriate
- Be encouraging and supportive to students
- If you're unsure about something, say so honestly
- Keep responses concise but comprehensive
- Use formatting (bullet points, bold text) to improve readability`

    // Create chat completion
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.'

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse,
        context,
        timestamp: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
