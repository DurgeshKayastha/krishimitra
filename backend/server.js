require('dotenv').config()
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const { isCacheFresh, refreshCache } = require('./services/priceCache')

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/prices', require('./routes/prices'))
app.use('/api/groq', require('./routes/groq'))
app.use('/api/disease', require('./routes/disease'))
app.use('/api/weather', require('./routes/weather'))
app.use('/api/report', require('./routes/reports'))

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'KrishiMitra API' }))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`KrishiMitra backend running on port ${PORT}`)

  if (!isCacheFresh()) {
    console.log('Cache is stale — fetching fresh price data...')
    refreshCache().catch(e => console.log('Cache refresh error:', e.message))
  } else {
    console.log('✅ Price cache is fresh — no fetch needed')
  }

  // schedule daily refresh at midnight IST (18:30 UTC)
  const now = new Date()
  const midnight = new Date()
  midnight.setUTCHours(18, 30, 0, 0)
  if (midnight < now) midnight.setDate(midnight.getDate() + 1)
  const msUntilMidnight = midnight - now

  setTimeout(() => {
    refreshCache()
    setInterval(() => refreshCache(), 24 * 60 * 60 * 1000)
  }, msUntilMidnight)

  console.log(`⏰ Next cache refresh scheduled in ${(msUntilMidnight / 1000 / 60).toFixed(0)} minutes`)
})
