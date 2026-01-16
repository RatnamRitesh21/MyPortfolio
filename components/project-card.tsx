"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect } from "react"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl: string
  demoUrl: string
  color: string
  index?: number
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  githubUrl,
  demoUrl,
  color,
  index = 0,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if dark mode is active
  const isDarkMode = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"))

  // Enhance color for dark mode
  const enhancedColor = isDarkMode
    ? color === "#8b5cf6"
      ? "#a78bfa"
      : color === "#14b8a6"
        ? "#22d3ee"
        : color === "#f43f5e"
          ? "#fb7185"
          : color
    : color

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card
        className={`overflow-hidden transition-all duration-500 hover:shadow-lg border-t-4 h-full card-hover ${
          isDarkMode
            ? "dark:bg-gray-900/60 dark:hover:shadow-xl dark:hover:shadow-" + enhancedColor.substring(1) + "/20"
            : ""
        }`}
        style={{ borderTopColor: enhancedColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="aspect-video rounded-md mb-4 bg-cover bg-center transition-all duration-500 ease-in-out overflow-hidden"
            style={{
              backgroundImage: `url(${image})`,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0 }}
              whileHover={{
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              style={{
                background: `linear-gradient(to bottom, transparent, ${enhancedColor}80)`,
              }}
            />
          </motion.div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200 border border-" + enhancedColor.substring(1) + "/30"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            asChild
            className={`hover:bg-primary/10 hover:text-primary transition-all duration-300 ${
              isDarkMode
                ? "dark:border-gray-700 dark:hover:border-" +
                  enhancedColor.substring(1) +
                  " dark:hover:text-" +
                  enhancedColor.substring(1)
                : ""
            }`}
          >
            <Link href={githubUrl} className="flex items-center gap-1" target="_blank">
              <Github className="h-4 w-4" />
              Code
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className={`transition-all duration-300 ${
              isDarkMode
                ? "bg-" + enhancedColor.substring(1) + " hover:bg-" + enhancedColor.substring(1) + "/90 dark:neon-glow"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
