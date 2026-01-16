"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterEffectProps {
  titles: string[]
  className?: string
}

export function TypewriterEffect({ titles, className = "" }: TypewriterEffectProps) {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(pauseTimer)
    }

    if (!isDeleting && displayedText === currentTitle) {
      setIsPaused(true)
      return
    }

    if (isDeleting && displayedText === "") {
      setIsDeleting(false)
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length)
      return
    }

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setDisplayedText(currentTitle.substring(0, displayedText.length - 1))
        } else {
          setDisplayedText(currentTitle.substring(0, displayedText.length + 1))
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, isPaused, currentTitleIndex, titles])

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent glow-text">
        {displayedText}
      </span>
      <motion.span
        className="inline-block w-0.5 h-6 bg-primary ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
    </div>
  )
}
