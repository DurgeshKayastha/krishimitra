const express = require('express')
const axios = require('axios')
const router = express.Router()

const DEFAULT_LAT = 19.0748 // Kopargaon
const DEFAULT_LON = 74.748

router.get('/', async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || DEFAULT_LAT
    const lon = parseFloat(req.query.lon) || DEFAULT_LON

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' })
    }

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat.toFixed(4),
        longitude: lon.toFixed(4),
        hourly: 'temperature_2m,relative_humidity_2m,windspeed_10m,uv_index',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
        timezone: 'Asia/Kolkata',
        forecast_days: 7,
      },
      timeout: 10000,
    })

    // cache for 30 minutes
    res.set('Cache-Control', 'public, max-age=1800')
    res.json(data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
