"use client"

import { motion, useInView } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"

interface SkillCardWithRatingProps {
  name: string
  icon: LucideIcon
  color: string
  rating: number
  delay?: number
}

export function SkillCardWithRating({ name, icon: Icon, color, rating, delay = 0 }: SkillCardWithRatingProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"))

  const segments = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-3 group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay * 0.05,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="p-3 rounded-full transition-all duration-300"
        style={{
          backgroundColor: `${color}20`,
          boxShadow: isDarkMode ? `0 0 15px ${color}40` : `0 2px 8px ${color}30, 0 0 0 1px ${color}20`,
        }}
        whileHover={{
          backgroundColor: `${color}40`,
          boxShadow: isDarkMode
            ? `0 0 25px ${color}60, 0 0 50px ${color}30`
            : `0 4px 16px ${color}50, 0 0 0 2px ${color}40`,
        }}
      >
        {isDarkMode && (
          <div
            className="absolute inset-[-50%] w-[200%] h-[200%] opacity-15 animate-spin-slow"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${color}, transparent)`,
              borderRadius: "50%",
            }}
          />
        )}
        <Icon
          className={`w-6 h-6 relative z-10 ${isDarkMode ? "neon-glow" : ""}`}
          style={{
            color,
            filter: !isDarkMode ? `drop-shadow(0 1px 2px ${color}40)` : undefined,
          }}
        />
      </motion.div>

      <div className="flex flex-col gap-1">
        <span
          className={`text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 ${isDarkMode ? "dark:group-hover:neon-text" : ""}`}
        >
          {name}
        </span>
      </div>

      <div className="flex flex-col gap-1 ml-auto">
        {segments.reverse().map((segment) => {
          const isFilled = segment <= rating
          return (
            <motion.div
              key={segment}
              className="w-8 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isFilled ? color : isDarkMode ? "#333" : "#e5e7eb",
                boxShadow: isFilled ? (isDarkMode ? `0 0 8px ${color}80` : `0 1px 3px ${color}60`) : "none",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: isFilled ? 1 : 0.3, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: delay * 0.05 + 0.3 + (5 - segment) * 0.08,
                ease: "easeOut",
              }}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
