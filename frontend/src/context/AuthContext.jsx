import { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

const AuthContext = createContext(null)

function destroyRecaptcha() {
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
  } catch {}
  // remove and recreate the container div so Firebase can render fresh
  const old = document.getElementById('recaptcha-container')
  if (old) {
    const parent = old.parentNode
    parent.removeChild(old)
    const fresh = document.createElement('div')
    fresh.id = 'recaptcha-container'
    parent.appendChild(fresh)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(ref)
          if (!snap.exists()) {
            await setDoc(ref, {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              role: 'farmer',
              language: 'en',
              bookmarkedSchemes: [],
              priceAlerts: [],
              createdAt: serverTimestamp(),
            })
          }
          setUser({ ...firebaseUser, profile: snap.data() || {} })
        } catch {
          setUser(firebaseUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const sendOTP = async (phoneNumber) => {
    destroyRecaptcha()
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })
    window.recaptchaVerifier = verifier
    return signInWithPhoneNumber(auth, phoneNumber, verifier)
  }

  const logout = () => {
    destroyRecaptcha()
    return signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, sendOTP, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
