import { useEffect, useRef, useState } from 'react'

export default function CanvasPOC() {
  const [activeScreen, setActiveScreen] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2
      const screens = document.querySelectorAll('.screen')
      
      screens.forEach((screen, i) => {
        const top = screen.offsetTop
        const height = screen.offsetHeight
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveScreen(i)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (index) => {
    document.querySelectorAll('.screen')[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      {/* Navigation dots */}
      <nav className="nav-dots">
        {[0, 1].map(i => (
          <button
            key={i}
            className={`nav-dot ${activeScreen === i ? 'active' : ''}`}
            onClick={() => scrollTo(i)}
            aria-label={`Screen ${i + 1}`}
          />
        ))}
      </nav>

      {/* Screen 1: Intro */}
      <IntroScreen />

      {/* Screen 2: Proposal */}
      <ProposalScreen />
    </main>
  )
}

// ============================================
// Screen 1: Intro with botanical frame
// ============================================
function IntroScreen() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Создаём золотые огоньки
    const createParticles = () => {
      particles = []
      const count = Math.min(40, Math.floor(canvas.width * canvas.height / 20000))
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseSize: Math.random() * 3 + 2,
          speed: Math.random() * 0.3 + 0.1,
          offset: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.5 - 0.25,
        })
      }
    }
    createParticles()

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        // Движение
        p.y -= p.speed
        p.x += Math.sin(time * 0.001 + p.offset) * p.drift
        
        // Перезапуск снизу
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
        }

        // Пульсация размера
        const pulse = Math.sin(time * 0.002 + p.offset) * 0.3 + 0.7
        const size = p.baseSize * pulse

        // Рисуем с glow эффектом
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4)
        gradient.addColorStop(0, 'rgba(201, 162, 39, 0.9)')
        gradient.addColorStop(0.3, 'rgba(201, 162, 39, 0.4)')
        gradient.addColorStop(0.6, 'rgba(201, 162, 39, 0.1)')
        gradient.addColorStop(1, 'rgba(201, 162, 39, 0)')

        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Яркое ядро
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 230, 150, 0.9)'
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw(0)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="screen bg-cream">
      {/* Рамка из веток */}
      <img 
        src="/images/frame_clean.png" 
        alt="" 
        className="absolute inset-0 w-full h-full object-contain p-4 md:p-12"
      />

      {/* Canvas огоньки */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* Текст */}
      <div className="text-layer text-center">
        <p className="hand text-xl md:text-2xl text-olive mb-1 animate-fade-in delay-1">
          Эй,
        </p>
        <p className="hand text-lg md:text-xl text-chocolate/60 mb-8 md:mb-12 animate-fade-in delay-2">
          у нас тут кое-что намечается...
        </p>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-chocolate leading-none animate-fade-in delay-2">
          Сергей
        </h1>
        <p className="text-2xl md:text-3xl text-marsala my-2 md:my-4 animate-fade-in delay-3">
          &
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-chocolate leading-none animate-fade-in delay-3">
          Софья
        </h1>

        <p className="hand text-lg md:text-xl text-chocolate/50 mt-8 md:mt-12 animate-fade-in delay-4">
          30.08.2026
        </p>

        {/* Scroll indicator */}
        <div className="scroll-indicator animate-bounce-slow">
          <p className="hand text-sm text-chocolate/40 mb-2">листай</p>
          <svg className="w-5 h-5 mx-auto text-chocolate/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// ============================================
// Screen 2: Proposal
// ============================================
function ProposalScreen() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let snowflakes = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Создаём снежинки
    const createSnow = () => {
      snowflakes = []
      const count = Math.min(150, Math.floor(canvas.width * canvas.height / 8000))
      
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }
    createSnow()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakes.forEach(s => {
        // Падение
        s.y += s.speed
        s.wobble += s.wobbleSpeed
        s.x += Math.sin(s.wobble) * 0.5

        // Перезапуск сверху
        if (s.y > canvas.height + 10) {
          s.y = -10
          s.x = Math.random() * canvas.width
        }

        // Рисуем с мягким glow
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${s.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="screen">
      {/* Fullscreen картинка */}
      <img 
        src="/images/proposal.png" 
        alt="Предложение" 
        className="fullscreen-image"
      />

      {/* Виньетка */}
      <div className="vignette" />

      {/* Градиент для текста */}
      <div className="gradient-overlay" />

      {/* Canvas снег */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* Текст */}
      <div className="text-layer justify-end pb-16 md:pb-20 items-start">
        <p className="hand text-base md:text-lg text-white/70 mb-2 text-glow">
          декабрь 2024
        </p>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-2 text-glow">
          Она сказала «да»
        </h2>
        <p className="hand text-lg md:text-xl text-white/80 text-glow">
          после двух лет они решились на эту авантюру
        </p>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <p className="hand text-sm text-white/40 mb-2">листай</p>
          <svg className="w-5 h-5 mx-auto text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
