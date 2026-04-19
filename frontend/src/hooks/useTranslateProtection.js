import { useState, useEffect, useRef } from 'react'

export function useTranslateProtection() {
  const [remountKey, setRemountKey] = useState(0)
  const containerRef = useRef()
  const lastRemountRef = useRef(0)
  const observerRef = useRef(null)

  useEffect(() => {
    const forceRemount = () => {
      const now = Date.now()
      if (now - lastRemountRef.current < 1000) return
      lastRemountRef.current = now
      setRemountKey(k => k + 1)
    }

    // Detect when Google Translate injects <font> tags (sign of translation)
    const checkForTranslation = () => {
      if (containerRef.current) {
        const hasFontTags = containerRef.current.querySelector('font')
        if (hasFontTags) {
          forceRemount()
        }
      }
    }

    // Watch for DOM mutations inside our container
    if (containerRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          // Check if Google Translate added <font> tags
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeName === 'FONT' || (node.querySelector && node.querySelector('font'))) {
                forceRemount()
              }
            })
          }
        }
      })

      observerRef.current.observe(containerRef.current, {
        childList: true,
        subtree: true
      })
    }

    // Also check periodically
    const interval = setInterval(checkForTranslation, 500)

    return () => {
      clearInterval(interval)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [remountKey])

  return { remountKey, containerRef }
}
