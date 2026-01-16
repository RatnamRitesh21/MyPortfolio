"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function AnimatedDevBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark")

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particles for floating code elements
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      text: string
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 20 + 10
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.3 + 0.1

        const codeSymbols = [
          "{}",
          "[]",
          "</>",
          "( )",
          "=>",
          "&&",
          "||",
          "!=",
          "==",
          "++",
          "--",
          "fn",
          "var",
          "let",
          "if",
          "for",
          "0x",
          "1",
          "0",
          "//",
          "/*",
          "*/",
          "class",
          "def",
          "import",
          "return",
          "async",
          "await",
        ]
        this.text = codeSymbols[Math.floor(Math.random() * codeSymbols.length)]

        // Different colors for light and dark mode
        if (isDark) {
          const goldColors = ["#FFD700", "#FDB931", "#C5A028", "#D4AF37"]
          this.color = goldColors[Math.floor(Math.random() * goldColors.length)]
        } else {
          const lightColors = ["#8B5CF6", "#06B6D4", "#EC4899", "#F59E0B"]
          this.color = lightColors[Math.floor(Math.random() * lightColors.length)]
        }
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.font = `${this.size}px monospace`
        ctx.fillText(this.text, this.x, this.y)
        ctx.globalAlpha = 1
      }
    }

    // Binary rain effect
    class BinaryDrop {
      x: number
      y: number
      speed: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.speed = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.2 + 0.05

        if (isDark) {
          this.color = "#FFD700"
        } else {
          this.color = "#8B5CF6"
        }
      }

      update() {
        this.y += this.speed
        if (this.y > canvas.height) {
          this.y = -20
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.font = "14px monospace"
        ctx.fillText(Math.random() > 0.5 ? "1" : "0", this.x, this.y)
        ctx.globalAlpha = 1
      }
    }

    // Create particles
    const particles: Particle[] = []
    const binaryDrops: BinaryDrop[] = []

    for (let i = 0; i < 30; i++) {
      particles.push(new Particle())
    }

    for (let i = 0; i < 50; i++) {
      binaryDrops.push(new BinaryDrop())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw binary rain
      binaryDrops.forEach((drop) => {
        drop.update()
        drop.draw()
      })

      // Draw code particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme, systemTheme])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
}
