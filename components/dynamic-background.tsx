"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  baseSize: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Determine if dark mode is active
  const isDarkMode = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let mouseX = width / 2
    let mouseY = height / 2
    let particles: Particle[] = []
    const particleCount = isDarkMode ? 150 : 100 // More particles in dark mode

    // Colors based on theme
    const colors = isDarkMode
      ? ["#a78bfa", "#22d3ee", "#fb7185", "#34d399", "#fbbf24"] // Vibrant colors for dark mode
      : ["#8b5cf6", "#14b8a6", "#f43f5e"] // Standard colors for light mode

    function createParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseSize: Math.random() * (isDarkMode ? 6 : 5) + (isDarkMode ? 1.5 : 1),
        size: 1, // Start with a minimum size of 1 to avoid negative values
        speedX: (Math.random() - 0.5) * (isDarkMode ? 2.5 : 2),
        speedY: (Math.random() - 0.5) * (isDarkMode ? 2.5 : 2),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1, // Start with a minimum opacity
        life: 0,
        maxLife: Math.random() * 100 + 100,
      }
    }

    function updateParticle(particle: Particle) {
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.life++

      // Fade in
      if (particle.life < 20) {
        particle.size = Math.max(1, (particle.life / 20) * particle.baseSize)
        particle.opacity = Math.max(0.1, (particle.life / 20) * (isDarkMode ? 0.7 : 0.5))
      }
      // Fade out
      else if (particle.life > particle.maxLife - 20) {
        particle.size = Math.max(1, ((particle.maxLife - particle.life) / 20) * particle.baseSize)
        particle.opacity = Math.max(0.1, ((particle.maxLife - particle.life) / 20) * (isDarkMode ? 0.7 : 0.5))
      }
      // Maintain
      else {
        particle.size = particle.baseSize
        particle.opacity = isDarkMode ? 0.7 : 0.5
      }

      // Wrap around edges
      if (particle.x > width) particle.x = 0
      else if (particle.x < 0) particle.x = width
      if (particle.y > height) particle.y = 0
      else if (particle.y < 0) particle.y = height

      // Interact with mouse
      const dx = particle.x - mouseX
      const dy = particle.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = isDarkMode ? 250 : 200

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance
        particle.speedX -= dx * force * 0.02
        particle.speedY -= dy * force * 0.02
      }

      // Add some randomness to movement (reduced to prevent extreme values)
      particle.speedX += (Math.random() - 0.5) * 0.05
      particle.speedY += (Math.random() - 0.5) * 0.05

      // Limit speed
      const maxSpeed = isDarkMode ? 3 : 2
      const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
      if (speed > maxSpeed) {
        particle.speedX = (particle.speedX / speed) * maxSpeed
        particle.speedY = (particle.speedY / speed) * maxSpeed
      }
    }

    function drawParticle(particle: Particle) {
      if (!ctx || particle.size <= 0) return // Skip drawing if size is not positive

      // Draw particle with glow effect in dark mode
      if (isDarkMode) {
        ctx.shadowBlur = particle.size * 2
        ctx.shadowColor = particle.color
      }

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, Math.max(0.1, particle.size), 0, Math.PI * 2)
      ctx.fillStyle =
        particle.color +
        Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")
      ctx.fill()

      // Reset shadow
      if (isDarkMode) {
        ctx.shadowBlur = 0
      }
    }

    function drawConnections() {
      if (!ctx) return

      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
      ctx.lineWidth = isDarkMode ? 0.8 : 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < (isDarkMode ? 150 : 120)) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            if (isDarkMode) {
              const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
              gradient.addColorStop(0, particles[i].color + "40")
              gradient.addColorStop(1, particles[j].color + "40")
              ctx.strokeStyle = gradient
            }

            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        updateParticle(particles[i])

        // Remove dead particles
        if (particles[i].life > particles[i].maxLife) {
          particles.splice(i, 1)
          i--
          continue
        }

        drawParticle(particles[i])
      }

      // Add new particles if needed
      while (particles.length < particleCount) {
        particles.push(createParticle())
      }

      drawConnections()

      requestAnimationFrame(animate)
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function handleResize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height

      // Create new particles instead of resetting existing ones
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle())
      }
    }

    // Initialize
    handleResize()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [mounted, isDarkMode])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-40 dark:opacity-60" />
}

export default DynamicBackground
