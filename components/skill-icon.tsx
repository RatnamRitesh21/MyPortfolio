"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface SkillIconProps {
  name: string
  icon: LucideIcon
  color: string
  delay?: number
}

export function SkillIcon({ name, icon: Icon, color, delay = 0 }: SkillIconProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if dark mode is active
  const isDarkMode = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"))

  // Enhance color for dark mode
  const enhancedColor = isDarkMode ? color : color

  return (
    <motion.div
      className="flex flex-col items-center gap-2 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay * 0.1,
      }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="p-3 rounded-full transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: `${enhancedColor}20`,
          boxShadow: isDarkMode ? `0 0 10px ${enhancedColor}40` : "none",
        }}
        whileHover={{
          backgroundColor: `${enhancedColor}40`,
          boxShadow: isDarkMode
            ? `0 0 20px ${enhancedColor}60, 0 0 40px ${enhancedColor}30`
            : `0 0 20px ${enhancedColor}60`,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-white dark:bg-white opacity-0 rounded-full"
          initial={{ scale: 0 }}
          whileHover={{
            scale: 1.5,
            opacity: isDarkMode ? 0.3 : 0.2,
            transition: { duration: 0.5 },
          }}
        />
        {isDarkMode ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ position: "absolute", inset: "-50%", width: "200%", height: "200%", opacity: 0.1 }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `conic-gradient(from 0deg, transparent, ${enhancedColor}, transparent)`,
                borderRadius: "50%",
              }}
            />
          </motion.div>
        ) : null}
        <Icon className={`w-6 h-6 ${isDarkMode ? "neon-glow" : ""}`} style={{ color: enhancedColor }} />
      </motion.div>
      <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors duration-300 dark:group-hover:neon-text">
        {name}
      </span>
    </motion.div>
  )
}
