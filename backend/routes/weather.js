const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { lat = 19.0748, lon = 74.748 } = req.query
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,relative_humidity_2m,windspeed_10m,uv_index',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
        timezone: 'Asia/Kolkata',
        forecast_days: 7,
      },
    })
    res.json(data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
