import { buildSystemPrompt, buildUserPrompt } from './prompts'
import type { CompanyFinancials, GptAnalysis } from '../../types/financial'

function parseAnalysis(content: string): GptAnalysis {
  const parsed = JSON.parse(content) as GptAnalysis

  if (!parsed.summary || !parsed.comparison || !Array.isArray(parsed.companies)) {
    throw new Error('Invalid analysis response structure')
  }

  return parsed
}

export async function generateAnalysis(
  companies: CompanyFinancials[],
  apiKey: string,
): Promise<GptAnalysis> {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(companies) },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${errorBody}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>
  }

  const content = data.choices[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from OpenAI')
  }

  return parseAnalysis(content)
}
