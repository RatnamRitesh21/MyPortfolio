"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ChevronDown,
  ArrowUp,
  Code,
  Search,
  FileJson,
  Blocks,
  FileCode,
  Coffee,
  Network,
  Database,
  Brain,
  GitBranch,
  Cloud,
  Server,
  Layers,
  Lock,
  Repeat,
  Send,
  Activity,
  Bot,
  Plug,
  Camera,
  CheckCircle2,
  Boxes,
} from "lucide-react"
import Link from "next/link"
import AnimatedDevBackground from "@/components/animated-dev-background"
import { ProjectCard } from "@/components/project-card"
import { SkillCardWithRating } from "@/components/skill-card-with-rating"
import { useTheme } from "next-themes"
import { projects } from "@/data/projects"
import { TypewriterEffect } from "@/components/typewriter-effect"

const skills = [
  // Languages
  { name: "Python", icon: FileCode, color: "#3776AB", rating: 4 },
  { name: "Java", icon: Coffee, color: "#007396", rating: 5 },
  { name: "JavaScript", icon: FileJson, color: "#F7DF1E", rating: 5 },
  { name: "TypeScript", icon: FileJson, color: "#3178C6", rating: 4 },
  { name: "SQL", icon: Database, color: "#6B7280", rating: 5 },
  { name: "C#", icon: FileCode, color: "#239120", rating: 3 },

  // Frontend
  { name: "React", icon: Blocks, color: "#61DAFB", rating: 5 },
  { name: "Redux", icon: Layers, color: "#764ABC", rating: 3 },
  { name: "Angular", icon: Code, color: "#DD0031", rating: 3 },
  { name: "HTML/CSS", icon: FileCode, color: "#E34F26", rating: 4 },

  // Backend & APIs
  { name: "Spring Boot", icon: Layers, color: "#6DB33F", rating: 5 },
  { name: "Node.js", icon: Server, color: "#339933", rating: 4 },
  { name: "Express", icon: Server, color: "#111827", rating: 4 },
  { name: "REST APIs", icon: Network, color: "#FF6C37", rating: 5 },
  { name: "JWT Auth", icon: Lock, color: "#F59E0B", rating: 4 },

  // Databases & Query
  { name: "SQL Server", icon: Database, color: "#CC2927", rating: 5 },
  { name: "MySQL", icon: Database, color: "#4479A1", rating: 4 },
  { name: "MongoDB", icon: Database, color: "#47A248", rating: 4 },
  { name: "KQL", icon: Search, color: "#2563EB", rating: 4 },

  // Cloud, DevOps, Tools
  { name: "Azure DevOps", icon: Cloud, color: "#0078D4", rating: 5 },
  { name: "CI/CD", icon: Repeat, color: "#22C55E", rating: 4 },
  { name: "Git/GitHub", icon: GitBranch, color: "#F05032", rating: 5 },
  { name: "Postman", icon: Send, color: "#FF6C37", rating: 4 },
  { name: "Azure Monitor", icon: Activity, color: "#38BDF8", rating: 4 },
  { name: "GCP", icon: Cloud, color: "#4285F4", rating: 3 },
  { name: "AWS", icon: Cloud, color: "#FF9900", rating: 3 },

  // AI / Agentic
  { name: "LLM APIs", icon: Brain, color: "#A855F7", rating: 4 },
  { name: "AI Agents (ADK)", icon: Bot, color: "#EAB308", rating: 4 },
  { name: "MCP", icon: Plug, color: "#F97316", rating: 3 },
  { name: "Vertex AI", icon: Cloud, color: "#34A853", rating: 3 },
  { name: "OpenCV", icon: Camera, color: "#22C55E", rating: 3 },

  // SDLC / Engineering
  { name: "Unit Testing", icon: CheckCircle2, color: "#10B981", rating: 4 },
  { name: "System Design", icon: Boxes, color: "#60A5FA", rating: 3 },
]

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<number | null>(null)
  const [selectedContact, setSelectedContact] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [formError, setFormError] = useState<string | null>(null)

  const { theme, systemTheme } = useTheme()

  const isDarkMode = mounted && (theme === "dark" || (theme === "system" && systemTheme === "dark"))

  const aboutRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const experienceRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowScrollTop(window.scrollY > 500)

      const sections = [
        { ref: aboutRef, id: "about" },
        { ref: skillsRef, id: "skills" },
        { ref: projectsRef, id: "projects" },
        { ref: experienceRef, id: "experience" },
        { ref: contactRef, id: "contact" },
      ]

      for (const section of sections) {
        if (!section.ref.current) continue

        const rect = section.ref.current.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (ref: React.RefObject<HTMLElement>, id: string) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
      setActiveSection(id)
    }
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDarkMode ? "bg-dots" : "bg-grid"}`}>
      <AnimatedDevBackground />

      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
          scrollY > 50 ? "shadow-md" : ""
        } navbar-gradient`}
      >
        <div className="container flex h-16 items-center justify-between">
          <motion.div
            className="font-bold text-xl bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent glow-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            RR
          </motion.div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-6">
              {[
                { id: "about", label: "About", ref: aboutRef },
                { id: "skills", label: "Skills", ref: skillsRef },
                { id: "projects", label: "Projects", ref: projectsRef },
                { id: "experience", label: "Experience", ref: experienceRef },
                { id: "contact", label: "Contact", ref: contactRef },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.ref, item.id)}
                  className={`transition-colors relative animated-underline ${
                    activeSection === item.id ? "navbar-active" : "navbar-text"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary dark:bg-white"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>
            <ModeToggle />
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex flex-col">
        <main className="container flex-1 flex items-center pt-16">
          {/* Hero Section */}
          <motion.div className="flex flex-col md:flex-row items-center gap-8 w-full" style={{ opacity, scale, y }}>
            <motion.div
              className="flex-shrink-0 relative order-1 md:order-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-3xl ${
                  isDarkMode ? "opacity-50" : "opacity-40"
                }`}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: isDarkMode ? [0.5, 0.7, 0.5] : [0.4, 0.5, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <Avatar
                className={`h-64 w-64 md:h-80 md:w-80 border-4 border-background ${
                  isDarkMode ? "dark:border-primary/20" : "border-primary/20"
                }`}
              >
                <AvatarImage src="/images/profile.jpeg" alt="Ritesh Goud Ratnam" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                  RR
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 space-y-4 order-2 md:order-2 md:pl-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold tracking-tight text-foreground dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Hi, I'm Ritesh Goud Ratnam
                </motion.h1>
                <motion.div
                  className="text-2xl md:text-4xl font-bold mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <TypewriterEffect
                    titles={[
                      "Software Engineer",
                      "Full Stack Developer",
                      "Java Developer",
                      "FrontEnd Developer",
                      "AI Engineer",
                    ]}
                    className="min-h-[2rem]"
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="flex gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  className={`bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 glow-on-hover btn-glow`}
                  onClick={() => scrollToSection(contactRef, "contact")}
                >
                  Get in touch
                </Button>
                <Button
                  variant="outline"
                  className={`border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 ${isDarkMode ? "dark:border-primary/50 dark:hover:border-primary" : "border-2"}`}
                  onClick={() => scrollToSection(projectsRef, "projects")}
                >
                  View my work
                </Button>
              </motion.div>
              <motion.div
                className="flex gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link href="https://www.linkedin.com/in/riteshratnam/" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 ${isDarkMode ? "dark:hover:neon-text" : "hover:scale-110"}`}
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="https://github.com/RatnamRitesh21" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 ${isDarkMode ? "dark:hover:neon-text" : "hover:scale-110"}`}
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="mailto:rriteshgoud21@gmail.com">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 ${isDarkMode ? "dark:hover:neon-text" : "hover:scale-110"}`}
                  >
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </main>

        <motion.button
          className="absolute left-1/2 -translate-x-1/2 bottom-8 md:bottom-12 z-20 flex flex-col items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-lg px-4 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={() => scrollToSection(aboutRef, "about")}
          aria-label="Scroll to About"
        >
          <span className="text-xl md:text-2xl font-semibold text-foreground dark:text-white transition-colors">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ChevronDown className="h-8 w-8 text-foreground dark:text-white transition-colors" />
          </motion.div>
        </motion.button>
      </section>

      <main className="container py-10 md:py-16">
        {/* About Section */}
        <motion.section
          id="about"
          className={`py-12 md:py-20 scroll-mt-16 section-bg animated-bg ${isDarkMode ? "dark:bg-grid" : "bg-dots"}`}
          ref={aboutRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">About Me</h2>
          <div className="space-y-6">
            <motion.p
              className="text-lg text-foreground"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              I'm a <strong>Software Engineer</strong> who enjoys building end-to-end products that are easy to use and
              reliable in production. I have <strong>2+ years of experience</strong> at <strong>Accenture</strong>{" "}
              working on enterprise applications, where I delivered features across APIs, databases, and UI flows and
              learned to write code that stays maintainable as systems grow.
            </motion.p>

            <motion.p
              className="text-lg text-foreground"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              A big part of my work has been production support and reliability. I handled on-call rotations, used
              telemetry to debug issues quickly, and helped improve monitoring and release workflows so changes move
              safely through environments. I also completed my <strong>Master's in Computer Science</strong> at the{" "}
              <strong>University of Central Florida</strong>, where I strengthened my fundamentals through hands-on
              projects and problem solving.
            </motion.p>

            <motion.p
              className="text-lg text-foreground"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              My recent projects include <strong>ParkPal</strong>, an AI agent that answers national park questions
              using real data and produces structured itineraries, along with <strong>ReaX</strong> and{" "}
              <strong>BrewBasket</strong>, two full-stack applications focused on form workflows and ordering
              experiences. Right now, I'm deepening my knowledge in <strong>agentic AI</strong> by studying multi-agent
              patterns, tool use, and evaluation, and when I'm not coding you will usually find me planning a hike,
              exploring national parks, following <strong>F1</strong>, or unwinding with esports and PC games.
            </motion.p>

            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outline"
                className={`gap-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 glow-on-hover ${
                  isDarkMode ? "dark:border-primary/50 dark:hover:border-primary" : ""
                }`}
                asChild
              >
                <Link
                  href="https://drive.google.com/file/d/1k56yCZWlRkK8Ut7oqg1aDVRfGjXTb9Bu/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          className={`py-12 md:py-20 scroll-mt-16 section-bg ${isDarkMode ? "dark:bg-dots" : "bg-grid"}`}
          ref={skillsRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Skills & Expertise</h2>
          <motion.p
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Proficiency ratings based on hands-on experience and project implementations
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {skills.map((skill, index) => (
              <SkillCardWithRating
                key={skill.name}
                name={skill.name}
                icon={skill.icon}
                color={skill.color}
                rating={skill.rating}
                delay={index}
              />
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          className={`py-12 md:py-20 scroll-mt-16 section-bg animated-bg ${isDarkMode ? "dark:bg-dots" : "bg-grid"}`}
          ref={projectsRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
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
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="experience"
          className={`py-12 md:py-20 scroll-mt-16 section-bg ${isDarkMode ? "dark:bg-dots" : "bg-grid"}`}
          ref={experienceRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Work Experience</h2>

          {/* Timeline Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center Timeline Line - Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 -translate-x-1/2" />

            {/* Mobile Timeline Line - Left side */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-1 bg-primary/30" />

            {/* Experience Items */}
            <div className="space-y-12 md:space-y-16">
              {/* Experience 0: Software Engineer - RIGHT side on desktop */}
              <motion.div
                className="relative flex flex-col md:flex-row md:items-start"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Empty left side on desktop */}
                <div className="hidden md:block md:w-1/2" />

                {/* Timeline Dot - Center on desktop, left on mobile */}
                <motion.div
                  className={`absolute ${
                    selectedExperience === 0 ? "w-5 h-5" : "w-4 h-4"
                  } bg-primary rounded-full transition-all duration-300 cursor-pointer z-10
                    left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-2`}
                  onClick={() => setSelectedExperience(selectedExperience === 0 ? null : 0)}
                  whileInView={{
                    boxShadow:
                      selectedExperience === 0
                        ? [
                            "0 0 0 rgba(234, 179, 8, 0)",
                            "0 0 20px rgba(234, 179, 8, 0.8)",
                            "0 0 0 rgba(234, 179, 8, 0)",
                          ]
                        : [
                            "0 0 0 rgba(234, 179, 8, 0)",
                            "0 0 15px rgba(234, 179, 8, 0.5)",
                            "0 0 0 rgba(234, 179, 8, 0)",
                          ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />

                {/* Card - Right side on desktop, full width with left padding on mobile */}
                <div
                  className={`ml-10 md:ml-8 md:w-1/2 cursor-pointer rounded-lg border border-border/50 p-5 transition-all duration-300 hover:border-primary/50 ${
                    selectedExperience === 0 ? "bg-primary/10 border-primary" : "bg-card/50"
                  }`}
                  onClick={() => setSelectedExperience(selectedExperience === 0 ? null : 0)}
                >
                  <h3 className="text-xl font-semibold text-foreground">Software Engineer</h3>
                  <p className="text-primary font-medium">ACCENTURE SOLUTIONS PVT LTD</p>
                  <p className="text-sm text-muted-foreground mb-3">Jan 2021 - July 2023</p>
                  <ul className="list-disc pl-5 space-y-2 text-foreground text-sm">
                    <li>
                      Delivered React and JavaScript UI enhancements for enterprise workflows, improving responsiveness
                      and standardizing reusable components used across multiple screens.
                    </li>
                    <li>
                      Integrated frontend flows with REST APIs and consistent error handling, reducing manual testing
                      effort by <strong>40%</strong> through clearer validation and predictable responses.
                    </li>
                    <li>
                      Supported backend services in Java, Spring Boot, and SQL Server within Azure DevOps, ensuring
                      stable releases across multiple environments.
                    </li>
                    <li>
                      Investigated production issues impacting user-facing features using telemetry queries (SQL, KQL),
                      reducing root-cause identification time by <strong>25%</strong>.
                    </li>
                    <li>
                      Improved observability by tuning Azure Monitor dashboards and alert thresholds, reducing incident
                      response time by <strong>35%</strong> and supporting on-call effectiveness.
                    </li>
                    <li>
                      Automated build and deployment steps through Git and Azure DevOps CI/CD pipelines, reducing manual
                      steps and configuration drift across environments.
                    </li>
                    <li>
                      Participated in on-call rotations and authored troubleshooting guides, improving team productivity
                      by <strong>15%</strong> through repeatable incident workflows and onboarding support.
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Experience 1: Graduate Student - LEFT side on desktop */}
              <motion.div
                className="relative flex flex-col md:flex-row md:items-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Card - Left side on desktop */}
                <div
                  className={`ml-10 md:ml-0 md:mr-8 md:w-1/2 md:text-right cursor-pointer rounded-lg border border-border/50 p-5 transition-all duration-300 hover:border-primary/50 ${
                    selectedExperience === 1 ? "bg-primary/10 border-primary" : "bg-card/50"
                  }`}
                  onClick={() => setSelectedExperience(selectedExperience === 1 ? null : 1)}
                >
                  <h3 className="text-xl font-semibold text-foreground">Graduate Student, Computer Science</h3>
                  <p className="text-primary font-medium">University of Central Florida</p>
                  <p className="text-sm text-muted-foreground mb-3">Orlando, FL | Aug 2023 - May 2025</p>
                  <ul className="list-disc pl-5 md:pl-0 md:pr-5 space-y-2 text-left text-sm md:list-inside">
                    <li>
                      Applied data structures, algorithms, and systems design to solve problems with focus on
                      correctness, time/space tradeoffs, and edge cases.
                    </li>
                    <li>
                      Built and evaluated ML and computer vision pipelines in Python, covering data prep, feature
                      extraction, model training, and metric-based evaluation.
                    </li>
                    <li>
                      Studied computer architecture and distributed systems fundamentals, including concurrency, memory
                      hierarchy, and performance bottlenecks.
                    </li>
                    <li>
                      Delivered end-to-end course projects with clear documentation, design rationale, and reproducible
                      results.
                    </li>
                  </ul>
                </div>

                {/* Timeline Dot - Center on desktop, left on mobile */}
                <motion.div
                  className={`absolute ${
                    selectedExperience === 1 ? "w-5 h-5" : "w-4 h-4"
                  } bg-primary rounded-full transition-all duration-300 cursor-pointer z-10
                    left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-2`}
                  onClick={() => setSelectedExperience(selectedExperience === 1 ? null : 1)}
                  whileInView={{
                    boxShadow:
                      selectedExperience === 1
                        ? [
                            "0 0 0 rgba(234, 179, 8, 0)",
                            "0 0 20px rgba(234, 179, 8, 0.8)",
                            "0 0 0 rgba(234, 179, 8, 0)",
                          ]
                        : [
                            "0 0 0 rgba(234, 179, 8, 0)",
                            "0 0 15px rgba(234, 179, 8, 0.5)",
                            "0 0 0 rgba(234, 179, 8, 0)",
                          ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                />

                {/* Empty right side on desktop */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className={`py-12 md:py-20 scroll-mt-16 section-bg animated-bg ${isDarkMode ? "dark:bg-grid" : "bg-dots"}`}
          ref={contactRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <motion.p
                className="text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                I'm currently open to new opportunities and collaborations. If you have a project in mind or just want
                to say hi, feel free to reach out!
              </motion.p>
              <div className="space-y-4 mt-8">
                <motion.div
                  className={`flex items-center gap-4 p-4 rounded-lg border ${selectedContact === 0 ? "border-primary" : "border-primary/20 hover:border-primary/50"} transition-all duration-300 ${selectedContact === 0 ? (isDarkMode ? "bg-primary/15 card-glow-primary" : "bg-primary/10") : isDarkMode ? "bg-primary/5" : "bg-primary/5"} card-hover cursor-pointer`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedContact(selectedContact === 0 ? null : 0)}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${selectedContact === 0 ? (isDarkMode ? "bg-primary/30" : "bg-primary/20") : isDarkMode ? "bg-primary/20" : "bg-primary/10"} flex items-center justify-center transition-all duration-300`}
                  >
                    <Mail
                      className={`h-6 w-6 ${isDarkMode ? "text-primary dark:neon-glow" : "text-primary"} ${selectedContact === 0 ? "scale-110" : ""} transition-all duration-300`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <a
                      href="mailto:rriteshgoud21@gmail.com"
                      className={`${isDarkMode ? "text-primary dark:neon-text" : "text-primary"} hover:underline`}
                    >
                      rriteshgoud21@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-center gap-4 p-4 rounded-lg border ${selectedContact === 1 ? "border-primary" : "border-primary/20 hover:border-primary/50"} transition-all duration-300 ${selectedContact === 1 ? (isDarkMode ? "bg-primary/15 card-glow-primary" : "bg-primary/10") : isDarkMode ? "bg-primary/5" : "bg-primary/5"} card-hover cursor-pointer`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedContact(selectedContact === 1 ? null : 1)}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${selectedContact === 1 ? (isDarkMode ? "bg-primary/30" : "bg-primary/20") : isDarkMode ? "bg-primary/20" : "bg-primary/10"} flex items-center justify-center transition-all duration-300`}
                  >
                    <Linkedin
                      className={`h-6 w-6 ${isDarkMode ? "text-primary dark:neon-glow" : "text-primary"} ${selectedContact === 1 ? "scale-110" : ""} transition-all duration-300`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">LinkedIn</h3>
                    <a
                      href="https://www.linkedin.com/in/riteshratnam/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isDarkMode ? "text-primary dark:neon-text" : "text-primary"} hover:underline`}
                    >
                      linkedin.com/in/riteshratnam
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className={`flex items-center gap-4 p-4 rounded-lg border ${selectedContact === 2 ? "border-primary" : "border-primary/20 hover:border-primary/50"} transition-all duration-300 ${selectedContact === 2 ? (isDarkMode ? "bg-primary/15 card-glow-primary" : "bg-primary/10") : isDarkMode ? "bg-primary/5" : "bg-primary/5"} card-hover cursor-pointer`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedContact(selectedContact === 2 ? null : 2)}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${selectedContact === 2 ? (isDarkMode ? "bg-primary/30" : "bg-primary/20") : isDarkMode ? "bg-primary/20" : "bg-primary/10"} flex items-center justify-center transition-all duration-300`}
                  >
                    <Github
                      className={`h-6 w-6 ${isDarkMode ? "text-primary dark:neon-glow" : "text-primary"} ${selectedContact === 2 ? "scale-110" : ""} transition-all duration-300`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">GitHub</h3>
                    <a
                      href="https://github.com/RatnamRitesh21"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${isDarkMode ? "text-primary dark:neon-text" : "text-primary"} hover:underline`}
                    >
                      github.com/RatnamRitesh21
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
            <div>
              <motion.div
                className={`p-6 rounded-lg border bg-card text-card-foreground shadow-lg transition-all duration-300 hover:shadow-xl card-hover ${isDarkMode ? "dark:border-primary/20 dark:bg-gray-900/60" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {formStatus === "success" ? (
                  <div className="text-center py-8" aria-live="polite">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">Thank you for reaching out. I'll get back to you soon.</p>
                    <Button
                      onClick={() => setFormStatus("idle")}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    // TODO: Replace REPLACE_ME with your Formspree form ID from https://formspree.io
                    action="https://formspree.io/f/maqqqewv"
                    method="POST"
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setFormStatus("submitting")
                      setFormError(null)

                      const form = e.currentTarget
                      const formData = new FormData(form)

                      try {
                        const response = await fetch(form.action, {
                          method: "POST",
                          body: formData,
                          headers: {
                            Accept: "application/json",
                          },
                        })

                        if (response.ok) {
                          setFormStatus("success")
                          form.reset()
                        } else {
                          const data = await response.json()
                          setFormError(data.error || "Something went wrong. Please try again.")
                          setFormStatus("error")
                        }
                      } catch (error) {
                        setFormError("Network error. Please check your connection and try again.")
                        setFormStatus("error")
                      }
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          disabled={formStatus === "submitting"}
                          className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "dark:border-primary/30 dark:focus:border-primary dark:focus:ring-primary/70" : ""}`}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          disabled={formStatus === "submitting"}
                          className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "dark:border-primary/30 dark:focus:border-primary dark:focus:ring-primary/70" : ""}`}
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        required
                        disabled={formStatus === "submitting"}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "dark:border-primary/30 dark:focus:border-primary dark:focus:ring-primary/70" : ""}`}
                        placeholder="Subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        disabled={formStatus === "submitting"}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-foreground min-h-[120px] focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "dark:border-primary/30 dark:focus:border-primary dark:focus:ring-primary/70" : ""}`}
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    {/* Error message display */}
                    {formStatus === "error" && formError && (
                      <div className="text-red-500 text-sm" aria-live="polite">
                        {formError}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className={`w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] glow-on-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isDarkMode ? "btn-glow" : ""}`}
                    >
                      {formStatus === "submitting" ? "Sending…" : "Send Message"}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t py-6 md:py-8 bg-primary">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-primary-foreground font-medium">
            © {new Date().getFullYear()} Ritesh Goud Ratnam. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="https://github.com/RatnamRitesh21" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/riteshratnam/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link href="mailto:rriteshgoud21@gmail.com">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              className={`rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 transform hover:scale-110 glow-on-hover ${isDarkMode ? "dark:bg-[#a78bfa] dark:hover:bg-[#a78bfa]/90 dark:neon-glow animate-pulse-glow" : ""}`}
              size="icon"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
