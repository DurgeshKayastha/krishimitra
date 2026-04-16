const express = require('express')
const axios = require('axios')
const multer = require('multer')
const router = express.Router()

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { cropType } = req.body
    const imageBuffer = req.file?.buffer
    if (!imageBuffer) return res.status(400).json({ error: 'No image provided' })

    const base64Image = imageBuffer.toString('base64')
    const apiKey = process.env.CROP_HEALTH_API_KEY

    if (apiKey && apiKey !== 'your_crop_health_key') {
      const { data } = await axios.post(
        'https://crop.health/api/v1/identification',
        { images: [`data:image/jpeg;base64,${base64Image}`], crop: cropType },
        { headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' } }
      )
      return res.json({ result: data, source: 'crop.health' })
    }

    // Groq vision fallback
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key') {
      return res.json({
        result: { disease: 'API keys not configured', confidence: 0, description: 'Please configure GROQ_API_KEY or CROP_HEALTH_API_KEY in backend .env' },
        source: 'mock',
      })
    }

    const Groq = require('groq-sdk')
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `Identify the plant disease in this image${cropType ? ` (crop: ${cropType})` : ''}. Give: disease name, confidence percentage, symptoms visible, immediate treatment.` },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      max_tokens: 512,
    })
    res.json({ result: { raw: completion.choices[0]?.message?.content }, source: 'groq-vision' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
