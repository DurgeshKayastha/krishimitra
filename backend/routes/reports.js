const express = require('express')
const router = express.Router()
const fs = require('fs')

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
  } catch {
    return null
  }
}

router.post('/', async (req, res, next) => {
  try {
    const firestore = getDb()
    if (!firestore) {
      return res.json({ success: true, message: 'Report received (Firebase not configured yet)', id: 'mock-' + Date.now() })
    }
    const ref = await firestore.collection('diseaseReports').add({
      ...req.body,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    res.json({ success: true, id: ref.id })
  } catch (err) {
    next(err)
  }
})

module.exports = router
