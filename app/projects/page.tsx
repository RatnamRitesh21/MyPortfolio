"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Import your projects data
import { projects } from "@/data/projects"

export default function AllProjects() {
  const [visibleProjects, setVisibleProjects] = useState(6)

  const loadMoreProjects = () => {
    setVisibleProjects((prev) => Math.min(prev + 6, projects.length))
  }

  return (
    <div className="container py-12 md:py-20">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        All Projects
      </motion.h1>
      <Link href="/" className="inline-block mb-8">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, visibleProjects).map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            tags={project.tags}
            githubUrl={project.githubUrl}
            demoUrl={project.demoUrl}
            color={project.color}
            index={index}
          />
        ))}
      </div>
      {visibleProjects < projects.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMoreProjects}>Load More Projects</Button>
        </div>
      )}
    </div>
  )
}
