const express = require('express')
const Groq = require('groq-sdk')
const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { messages, systemPrompt } = req.body

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key') {
      return res.json({ text: 'AI insights will appear here once the Groq API key is configured.' })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are KrishiMitra, an AI assistant for Indian farmers. Always be helpful, practical, and specific to India. Keep responses concise and easy to understand.',
        },
        ...messages,
      ],
      max_tokens: 1024,
    })

    res.json({ text: completion.choices[0]?.message?.content || '' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
