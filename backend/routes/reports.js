const express = require('express')
const fs = require('fs')
const router = express.Router()

const REQUIRED_FIELDS = ['cropType', 'diseaseName']
const MAX_STRING_LENGTH = 500

let db = null

function getDb() {
  if (db) return db
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json'
  if (!fs.existsSync(keyPath)) return null
  try {
    const admin = require('firebase-admin')
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) })
    }
    db = admin.firestore()
    return db
  } catch (e) {
    console.error('[Reports] Firebase init error:', e.message)
    return null
  }
}

function sanitize(obj) {
  const clean = {}
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') clean[key] = val.slice(0, MAX_STRING_LENGTH)
    else if (typeof val === 'number') clean[key] = val
    else if (typeof val === 'boolean') clean[key] = val
    // skip objects/arrays except known safe ones
  }
  return clean
}

router.post('/', async (req, res, next) => {
  try {
    // validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` })
      }
    }

    // validate severity
    const validSeverities = ['low', 'medium', 'high']
    if (req.body.severity && !validSeverities.includes(req.body.severity)) {
      return res.status(400).json({ error: 'Invalid severity value' })
    }

    // validate coordinates
    const lat = parseFloat(req.body.lat)
    const lon = parseFloat(req.body.lon)
    if ((req.body.lat && isNaN(lat)) || (req.body.lon && isNaN(lon))) {
      return res.status(400).json({ error: 'Invalid coordinates' })
    }

    const sanitized = sanitize(req.body)
    const report = {
      ...sanitized,
      lat: lat || 0,
      lon: lon || 0,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const firestore = getDb()
    if (!firestore) {
      console.warn('[Reports] Firebase not configured — report not persisted')
      return res.json({ success: true, message: 'Report received', id: `mock-${Date.now()}` })
    }

    const ref = await firestore.collection('diseaseReports').add(report)
    res.status(201).json({ success: true, id: ref.id })
  } catch (err) {
    next(err)
  }
})

module.exports = router
