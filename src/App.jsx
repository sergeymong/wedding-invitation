import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Получаем имя гостя из URL
const getGuestFromURL = () => {
  const params = new URLSearchParams(window.location.search)
  const guest = params.get('guest')
  if (guest) {
    return guest.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }
  return ''
}

// Конфиг экранов
const screens = [
  'intro',           // 1
  'story-start',     // 2
  'first-meeting',   // 3
  'highfive',        // 4
  'laughter',        // 5
  'together',        // 6
  'proposal',        // 7
  'invitation',      // 8
  'venue',           // 9
  'preparation',     // 10
  'cheatsheet',      // 11
  'rsvp'             // 12
]

// Компонент Fireflies для экрана 1 — спокойные светлячки
function Fireflies() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let fireflies = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createFirefly = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.2,
      pulseSpeed: Math.random() * 0.008 + 0.004,
      pulseOffset: Math.random() * Math.PI * 2,
    })

    const initFireflies = () => {
      fireflies = Array.from({ length: 15 }, createFirefly)
    }

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      fireflies.forEach(f => {
        f.x += f.speedX
        f.y += f.speedY
        if (f.x < 0 || f.x > canvas.width) f.speedX *= -1
        if (f.y < 0 || f.y > canvas.height) f.speedY *= -1

        const pulse = Math.sin(time * f.pulseSpeed + f.pulseOffset) * 0.3 + 0.7
        const currentOpacity = f.opacity * pulse

        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4)
        gradient.addColorStop(0, `rgba(201, 162, 39, ${currentOpacity})`)
        gradient.addColorStop(0.4, `rgba(201, 162, 39, ${currentOpacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(201, 162, 39, 0)')

        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }

    resize()
    initFireflies()
    animate(0)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
}

// Компонент Snowfall для экрана 7
function Snowfall() {
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

    const createSnowflake = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 1 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.4,
    })

    const initSnowflakes = () => {
      snowflakes = Array.from({ length: 80 }, createSnowflake)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      snowflakes.forEach(f => {
        f.y += f.speedY
        f.x += f.speedX
        if (f.y > canvas.height) {
          f.y = -10
          f.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }

    resize()
    initSnowflakes()
    animate()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />
}

// Компонент Hearts для финального экрана
function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: '100vh', 
            x: `${15 + i * 15}vw`,
            opacity: 0,
            scale: 0.5
          }}
          animate={{ 
            y: '-20vh',
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.8]
          }}
          transition={{ 
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut"
          }}
          className="absolute text-marsala/40"
          style={{ fontSize: `${20 + i * 5}px` }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [guestName] = useState(getGuestFromURL)
  
  // Интерактив экран 2
  const [storyAnswer, setStoryAnswer] = useState(null)
  const [showStoryResult, setShowStoryResult] = useState(false)
  
  // Интерактив экран 4
  const [highfiveAnswer, setHighfiveAnswer] = useState(null)
  const [showHighfiveResult, setShowHighfiveResult] = useState(false)
  
  // Счётчик дней экран 6
  const [displayDays, setDisplayDays] = useState(0)
  
  // RSVP форма
  const [formData, setFormData] = useState({
    name: guestName,
    rating: null,
    withGuest: false,
    guestName: '',
    food: [],
    alcohol: [],
    transport: '',
    accommodation: false,
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const [touchStart, setTouchStart] = useState(0)

  // Анимация счётчика дней
  useEffect(() => {
    if (currentScreen === 5) {
      let current = 0
      const target = 730
      const increment = target / 60
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setDisplayDays(target)
          clearInterval(timer)
        } else {
          setDisplayDays(Math.floor(current))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [currentScreen])

  // Свайп навигация
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientY)
  
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1)
      } else if (diff < 0 && currentScreen > 0) {
        setCurrentScreen(prev => prev - 1)
      }
    }
  }

  // Scroll навигация
  useEffect(() => {
    let timeout
    const handleWheel = (e) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          if (e.deltaY > 30 && currentScreen < screens.length - 1) {
            setCurrentScreen(prev => prev + 1)
          } else if (e.deltaY < -30 && currentScreen > 0) {
            setCurrentScreen(prev => prev - 1)
          }
          timeout = null
        }, 600)
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentScreen])

  // Keyboard навигация
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' && currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1)
      } else if (e.key === 'ArrowUp' && currentScreen > 0) {
        setCurrentScreen(prev => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentScreen])

  const handleStoryAnswer = (answer) => {
    setStoryAnswer(answer)
    setTimeout(() => setShowStoryResult(true), 600)
  }

  const handleHighfiveAnswer = (answer) => {
    setHighfiveAnswer(answer)
    setTimeout(() => setShowHighfiveResult(true), 500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('RSVP:', formData)
    setFormSubmitted(true)
  }

  const getRatingColor = (value) => {
    if (value >= 6) return '#5C6B4A'
    if (value >= 3) return '#C9A227'
    return '#722F37'
  }

  const getRatingLabel = (value) => {
    if (value >= 6) return '🎉 Ура, ждём!'
    if (value >= 3) return '🤔 Понимаем, подумайте! Будем рады, если получится'
    if (value >= 1) return '😢 Эх, будем скучать... Но всё равно ждём, вдруг передумаете!'
    return ''
  }

  // Подсчёт дней до свадьбы
  const getDaysUntilWedding = () => {
    const wedding = new Date('2026-08-30')
    const today = new Date()
    const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cream touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Навигация точками */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {screens.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentScreen(i)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              currentScreen === i ? 'bg-marsala scale-125' : 'bg-chocolate/20 hover:bg-chocolate/40'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ========== ЭКРАН 1: INTRO ========== */}
        {currentScreen === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative flex flex-col justify-center"
          >
            {/* Пульсирующий фон */}
            <motion.div
              animate={{ 
                opacity: [0.85, 1, 0.85],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 z-0"
            >
              <img 
                src="/images/frame.png" 
                alt="" 
                className="w-full h-full object-cover pointer-events-none" 
              />
            </motion.div>
            
            <Fireflies />
            
            <div className="relative z-20 px-6 md:px-16">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-[clamp(1.5rem,5vw,2.5rem)] text-chocolate mb-6 md:mb-10"
              >
                Тут кое-что намечается
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-serif text-[clamp(4rem,15vw,10rem)] font-semibold text-chocolate leading-none tracking-tight"
              >
                30.08.2026
              </motion.p>
            </div>
            
            {/* Стрелка с тенью */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-6 md:left-16 z-20 flex flex-col items-start"
            >
              <motion.p
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="font-hand text-chocolate text-lg md:text-xl drop-shadow-[0_2px_4px_rgba(245,240,230,0.9)]"
              >
                листай ↓
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 2: STORY START ========== */}
        {currentScreen === 1 && (
          <motion.div
            key="story-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {/* Фоновая картинка на весь экран */}
            <img
              src="/images/story-start.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            />
            {/* Градиент слева для текста */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/70 to-transparent z-0" />
            
            {/* Контент слева */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-[70%] md:max-w-[55%]">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-hand text-marsala text-[clamp(1.5rem,5vw,2rem)] mb-8 md:mb-12"
              >
                февраль 2023
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 md:mb-10"
              >
                <p className="font-serif text-[clamp(2rem,6vw,4rem)] font-medium text-chocolate leading-tight">
                  Это история любви
                </p>
                <p className="font-serif text-[clamp(2rem,6vw,4rem)] font-medium text-chocolate leading-tight">
                  с первого взгляда
                </p>
                <p className="font-hand text-[clamp(1.5rem,5vw,2.5rem)] text-olive mt-3 italic">
                  Почти.
                </p>
              </motion.div>

              {!showStoryResult ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="font-serif text-[clamp(1.1rem,3.5vw,1.5rem)] text-chocolate/80 mb-5">
                    Она впервые увидела его фото и подумала:
                  </p>
                  <div className="flex flex-col gap-3">
                    {['Интересно...', 'Может быть', 'Точно нет'].map((answer, i) => (
                      <motion.button
                        key={answer}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        onClick={() => handleStoryAnswer(answer)}
                        disabled={storyAnswer !== null}
                        className={`text-left font-serif text-[clamp(1.1rem,3.5vw,1.4rem)] py-4 px-5 border-2 rounded-lg transition-all ${
                          storyAnswer === answer 
                            ? 'bg-marsala text-cream border-marsala' 
                            : 'border-chocolate text-chocolate hover:border-marsala bg-cream/80'
                        } ${storyAnswer && storyAnswer !== answer ? 'opacity-40' : ''}`}
                      >
                        {answer}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="font-serif text-[clamp(1.1rem,3.5vw,1.5rem)] text-chocolate/80 mb-4">
                    Она впервые увидела его фото и подумала:
                  </p>
                  <p className="font-serif text-[clamp(2.5rem,8vw,5rem)] font-semibold text-marsala italic">
                    «Точно нет»
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 3: FIRST MEETING ========== */}
        {currentScreen === 2 && (
          <motion.div
            key="first-meeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {/* Фоновая картинка на весь экран — смещена вниз */}
            <img
              src="/images/first-meeting.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none z-0"
            />
            {/* Градиент сверху для текста */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/70 to-transparent z-0" />
            
            {/* Контент сверху */}
            <div className="relative z-10 pt-16 md:pt-24 px-6 md:px-16">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-hand text-marsala text-[clamp(1.5rem,5vw,2rem)] mb-8 md:mb-12"
              >
                9 декабря 2023
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-serif text-[clamp(1.5rem,5vw,2.5rem)] font-medium text-chocolate mb-3">
                  Он зашёл в квартиру
                </p>
                <p className="font-serif text-[clamp(2rem,6vw,4rem)] font-semibold text-chocolate leading-tight">
                  Ещё до приветствия
                </p>
                <p className="font-serif text-[clamp(2rem,6vw,4rem)] font-semibold text-marsala leading-tight">
                  она всё поняла
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 4: HIGHFIVE ========== */}
        {currentScreen === 3 && (
          <motion.div
            key="highfive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {!showHighfiveResult ? (
              // До ответа — чистый фон
              <div className="h-full flex flex-col justify-center px-6 md:px-16">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-hand text-marsala text-[clamp(1.5rem,5vw,2rem)] mb-8 md:mb-12"
                >
                  минуту спустя
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="font-serif text-[clamp(1.75rem,6vw,3rem)] font-medium text-chocolate mb-3">
                    Их первое взаимодействие
                  </p>
                  <p className="font-serif text-[clamp(1.25rem,4vw,1.75rem)] text-chocolate/80 mb-8">
                    Нужно поздороваться. Как они это сделали?
                  </p>
                  <div className="flex gap-4 md:gap-6">
                    {[
                      { id: 'handshake', img: '/images/handshake-btn.png', label: 'Рукопожатие' },
                      { id: 'highfive', img: '/images/highfive-btn.png', label: 'Дай пять' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleHighfiveAnswer(option.id)}
                        disabled={highfiveAnswer !== null}
                        className={`flex flex-col items-center gap-2 border-2 rounded-xl transition-all overflow-hidden bg-cream ${
                          highfiveAnswer === option.id
                            ? 'border-marsala bg-marsala/10'
                            : 'border-chocolate hover:border-marsala'
                        } ${highfiveAnswer && highfiveAnswer !== option.id ? 'opacity-40' : ''}`}
                      >
                        <img 
                          src={option.img} 
                          alt={option.label}
                          className="w-32 h-28 md:w-40 md:h-32 object-cover"
                        />
                        <span className="font-serif text-[clamp(1rem,3vw,1.25rem)] text-chocolate pb-3 px-4">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              // После ответа — картинка на весь экран
              <>
                <img
                  src="/images/highfive-result.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-cream/90 via-transparent to-cream/90 z-0" />
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 h-full flex flex-col justify-between py-16 px-6 md:px-16"
                >
                  <div>
                    <p className="font-hand text-marsala text-[clamp(1.5rem,5vw,2rem)] mb-6">
                      минуту спустя
                    </p>
                    <p className="font-serif text-[clamp(1.5rem,5vw,2.5rem)] text-chocolate mb-2">
                      Она протянула руку,
                    </p>
                    <p className="font-serif text-[clamp(1.5rem,5vw,2.5rem)] text-chocolate">
                      а он — хлопнул
                    </p>
                  </div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-hand text-[clamp(2rem,6vw,3rem)] text-olive text-center"
                  >
                    Вышло идеально
                  </motion.p>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* ========== ЭКРАН 5: LAUGHTER ========== */}
        {currentScreen === 4 && (
          <motion.div
            key="laughter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {/* Фоновая картинка — смещена ещё ниже */}
            <img
              src="/images/laughter.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ objectPosition: 'center 70%' }}
            />
            {/* Градиент сверху для текста */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/50 to-transparent z-0" />
            
            {/* Текст сверху */}
            <div className="relative z-10 pt-16 md:pt-24 px-6 md:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-serif text-[clamp(2rem,7vw,4rem)] font-medium text-chocolate mb-1">
                  В этот момент
                </p>
                <p className="font-serif text-[clamp(2rem,7vw,4rem)] font-medium text-chocolate">
                  они засмеялись
                </p>
                <div className="w-16 h-0.5 bg-gold my-6 md:my-8" />
                <p className="font-serif text-[clamp(1.5rem,5vw,2.5rem)] text-marsala italic">
                  и с этого всё началось
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 6: TOGETHER ========== */}
        {currentScreen === 5 && (
          <motion.div
            key="together"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {/* Фоновая картинка — смещена ещё ниже */}
            <img
              src="/images/together.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ objectPosition: 'center 75%' }}
            />
            {/* Градиент сверху */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/60 to-transparent z-0" />
            
            {/* Контент сверху */}
            <div className="relative z-10 pt-12 md:pt-16 px-6 md:px-16">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-[clamp(5rem,16vw,10rem)] font-semibold text-chocolate leading-none tracking-tight"
              >
                {displayDays}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-hand text-olive text-[clamp(1.5rem,5vw,2.5rem)] mt-1 mb-6"
              >
                дней вместе
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-serif text-[clamp(1.25rem,4vw,2rem)] font-medium text-chocolate mb-1">
                  С того дня прошло 2 года
                </p>
                <p className="font-serif text-[clamp(1.1rem,3.5vw,1.5rem)] text-chocolate/80 mb-4">
                  Ни одного дня друг без друга
                </p>
                <p className="font-hand text-[clamp(1.75rem,6vw,3rem)] text-marsala italic">
                  И что дальше?
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 7: PROPOSAL (КУЛЬМИНАЦИЯ) ========== */}
        {currentScreen === 6 && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative flex flex-col justify-end"
          >
            {/* Background image */}
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              src="/images/proposal.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
            
            <Snowfall />

            <div className="relative z-20 p-6 md:p-16 pb-12 md:pb-20">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-hand text-gold text-[clamp(1.5rem,5vw,2rem)] mb-6 md:mb-10"
              >
                декабрь 2025
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-[clamp(1.25rem,4vw,2rem)] text-white/85 mb-6 md:mb-8"
              >
                Загородный дом. Гирлянды. Танец.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="font-serif text-[clamp(2.5rem,8vw,5rem)] font-semibold text-white leading-tight drop-shadow-lg">
                  Она сказала
                </p>
                <p className="font-serif text-[clamp(4rem,14vw,10rem)] font-bold text-gold leading-none italic drop-shadow-xl">
                  «да»
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 8: INVITATION ========== */}
        {currentScreen === 7 && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative flex items-center"
          >
            {/* Рамка на весь экран */}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              src="/images/invitation.png" 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" 
            />
            
            {/* Контент слева с последовательным появлением */}
            <div className="relative z-10 px-8 md:px-16 max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-hand text-marsala text-[clamp(1.5rem,5vw,2rem)] mb-4"
              >
                Это была история про нас
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="font-hand text-[clamp(2.5rem,8vw,4.5rem)] text-olive italic mb-4"
              >
                Софья и Сергей
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="font-serif text-[clamp(3.5rem,12vw,8rem)] font-semibold text-chocolate leading-none tracking-tight mb-6"
              >
                30.08.2026
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <p className="font-serif text-[clamp(1.25rem,4vw,1.75rem)] text-chocolate mb-1">
                  Для нас наступает новый этап
                </p>
                <p className="font-serif text-[clamp(1.25rem,4vw,1.75rem)] text-marsala">
                  Хотим вступить в него с вами
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 9: VENUE ========== */}
        {currentScreen === 8 && (
          <motion.div
            key="venue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative"
          >
            {/* Background */}
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
              src="/images/venue.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/95 via-chocolate/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-12 md:pb-20 z-10">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-hand text-gold text-[clamp(1.5rem,5vw,2rem)] mb-4"
              >
                И мы уже знаем, где это случится
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-[clamp(3rem,12vw,8rem)] font-semibold text-white leading-none mb-4 md:mb-6 drop-shadow-lg"
              >
                Due To Love
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-serif text-[clamp(1.25rem,4vw,1.75rem)] text-white/90 max-w-lg mb-4 leading-relaxed"
              >
                Место, где природа встречается с уютом.<br/>
                Где можно выдохнуть и просто быть рядом.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-1"
              >
                <p className="font-serif text-[clamp(1.5rem,5vw,2rem)] text-white font-semibold">
                  18+
                </p>
                <p className="font-serif text-[clamp(1rem,3.5vw,1.25rem)] text-white/70">
                  Москва, 15 км от МКАД · можно с парой
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 10: PREPARATION ========== */}
        {currentScreen === 9 && (
          <motion.div
            key="preparation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col justify-center px-6 md:px-16"
          >
            {/* Countdown */}
            <div className="mb-6">
              <p className="font-serif text-olive text-sm uppercase tracking-widest mb-1">
                До встречи осталось
              </p>
              <p className="font-serif text-[clamp(4rem,14vw,8rem)] font-semibold text-chocolate leading-none">
                {getDaysUntilWedding()}
              </p>
              <p className="font-hand text-olive text-[clamp(1.25rem,4vw,1.5rem)]">дней</p>
            </div>

            {/* Карточки — без фоновых картинок */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Что надеть */}
              <div className="bg-white/80 rounded-xl p-4">
                <p className="font-serif text-chocolate font-semibold text-[clamp(1rem,3.5vw,1.25rem)] mb-2">Что надеть</p>
                <p className="font-serif text-chocolate/80 text-[clamp(0.85rem,3vw,1rem)] mb-2">Приходите в этих оттенках:</p>
                <div className="flex gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#722F37] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#5C6B4A] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#F5F0E6] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#6B8E9F] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#3D2B1F] border-2 border-chocolate/30" />
                </div>
                <p className="font-hand text-olive text-[clamp(0.8rem,2.5vw,0.9rem)] mt-2">Строгой проверки не будет 😉</p>
              </div>
              
              {/* Подарки */}
              <div className="bg-white/80 rounded-xl p-4">
                <p className="font-serif text-chocolate font-semibold text-[clamp(1rem,3.5vw,1.25rem)] mb-2">Подарки</p>
                <p className="font-serif text-chocolate/80 text-[clamp(0.85rem,3vw,1rem)]">
                  Мы мечтаем о своём жилье. Благодарны любому вкладу, который приблизит нас к этому.
                </p>
              </div>
              
              {/* Что взять */}
              <div className="bg-white/80 rounded-xl p-4 col-span-2">
                <p className="font-serif text-chocolate font-semibold text-[clamp(1rem,3.5vw,1.25rem)] mb-2">Что взять с собой</p>
                <p className="font-serif text-chocolate/80 text-[clamp(0.85rem,3vw,1rem)]">
                  ✓ Хорошее настроение · ✓ Сменную обувь для танцев · ✓ Что-то тёплое на вечер
                </p>
                <p className="font-hand text-olive text-[clamp(0.8rem,2.5vw,0.9rem)] mt-2">Зонты, аптечки и всё на случай «а вдруг» — у нас есть</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 11: CHEATSHEET ========== */}
        {currentScreen === 10 && (
          <motion.div
            key="cheatsheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col justify-center px-6 md:px-16"
          >
            <h2 className="font-hand text-marsala text-[clamp(2.5rem,8vw,3.5rem)] mb-5 md:mb-6">Шпаргалка</h2>

            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {/* Когда */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-serif text-olive text-sm uppercase tracking-wide mb-2">Когда</p>
                <p className="font-serif text-chocolate text-[clamp(1.25rem,4.5vw,1.75rem)] font-semibold leading-tight">
                  30 августа
                </p>
                <p className="font-serif text-chocolate text-[clamp(1rem,3.5vw,1.25rem)]">суббота</p>
                <p className="font-serif text-chocolate/70 text-[clamp(0.9rem,3vw,1rem)] mt-2">14:30 — 22:30</p>
              </div>

              {/* Где */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-serif text-olive text-sm uppercase tracking-wide mb-2">Где</p>
                <p className="font-serif text-chocolate text-[clamp(1.25rem,4.5vw,1.75rem)] font-semibold">
                  Due To Love
                </p>
                <a 
                  href="https://yandex.ru/maps/-/CLhzMN9F" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block font-serif text-marsala text-[clamp(0.9rem,3vw,1rem)] mt-2 underline"
                >
                  Маршрут →
                </a>
              </div>

              {/* Что надеть */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-serif text-olive text-sm uppercase tracking-wide mb-3">Что надеть</p>
                <div className="flex gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#722F37] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#5C6B4A] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#F5F0E6] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#6B8E9F] border-2 border-chocolate/30" />
                  <span className="w-6 h-6 rounded-full bg-[#3D2B1F] border-2 border-chocolate/30" />
                </div>
              </div>

              {/* Что взять */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-serif text-olive text-sm uppercase tracking-wide mb-2">Что взять</p>
                <p className="font-serif text-chocolate/80 text-[clamp(0.9rem,3vw,1rem)]">
                  Настроение · Сменку · Тёплое
                </p>
              </div>

              {/* Вопросы */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-serif text-olive text-sm uppercase tracking-wide mb-3">Вопросы?</p>
                <a 
                  href="https://t.me/wedding_sofya_sergey" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-serif text-cream bg-olive py-2 px-4 rounded-lg text-[clamp(0.9rem,3vw,1rem)]"
                >
                  💬 Бот ответит
                </a>
              </div>

              {/* Контакт */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="font-serif text-olive text-sm uppercase tracking-wide mb-2">Контакт</p>
                <a 
                  href="tel:+79991621492"
                  className="font-serif text-chocolate text-[clamp(1rem,3.5vw,1.25rem)] font-medium"
                >
                  +7 999 162-14-92
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 12: RSVP ========== */}
        {currentScreen === 11 && (
          <motion.div
            key="rsvp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col justify-center px-6 md:px-16"
          >
            {!formSubmitted ? (
              <>
                <h2 className="font-serif text-[clamp(2.5rem,9vw,4rem)] font-semibold text-chocolate mb-2">
                  Придёте?
                </h2>
                
                {/* Дедлайн — крупный, стилизованный */}
                <p className="font-hand text-marsala text-[clamp(1.25rem,4vw,1.75rem)] mb-6 border-b-2 border-marsala/30 pb-2 inline-block">
                  Ждём ответа до 1 мая
                </p>

                {/* Scale 1-7 */}
                <div className="mb-5">
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData({ ...formData, rating: num })}
                        style={{
                          backgroundColor: formData.rating === num ? getRatingColor(num) : 'transparent',
                        }}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-lg border-2 border-chocolate font-serif text-base font-semibold transition-all ${
                          formData.rating === num ? 'text-cream' : 'text-chocolate'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-chocolate/60 font-serif">
                    <span>Нет</span>
                    <span>Думаю</span>
                    <span>Точно буду!</span>
                  </div>
                  {formData.rating && (
                    <p className="font-hand text-lg mt-2" style={{ color: getRatingColor(formData.rating) }}>
                      {getRatingLabel(formData.rating)}
                    </p>
                  )}
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Имя */}
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ваше имя"
                    className="w-full p-3 border-2 border-chocolate rounded-lg font-serif bg-transparent"
                  />

                  {/* Чекбоксы */}
                  <div className="flex gap-6 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer font-serif text-chocolate">
                      <input
                        type="checkbox"
                        checked={formData.withGuest}
                        onChange={(e) => setFormData({ ...formData, withGuest: e.target.checked })}
                        className="w-5 h-5"
                      />
                      С парой
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-serif text-chocolate">
                      <input
                        type="checkbox"
                        checked={formData.accommodation}
                        onChange={(e) => setFormData({ ...formData, accommodation: e.target.checked })}
                        className="w-5 h-5"
                      />
                      Нужно размещение
                    </label>
                  </div>

                  {formData.withGuest && (
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="Имя пары"
                      className="w-full p-3 border-2 border-chocolate rounded-lg font-serif bg-transparent"
                    />
                  )}

                  {/* Еда + Алкоголь */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-serif text-chocolate mb-2">Еда</p>
                      <div className="flex flex-wrap gap-2">
                        {['Мясо', 'Рыба', 'Вег'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              const food = formData.food.includes(option)
                                ? formData.food.filter(f => f !== option)
                                : [...formData.food, option]
                              setFormData({ ...formData, food })
                            }}
                            className={`px-3 py-2 border-2 border-chocolate rounded-lg font-serif transition-all ${
                              formData.food.includes(option) ? 'bg-marsala text-cream border-marsala' : ''
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-serif text-chocolate mb-2">Алкоголь</p>
                      <div className="flex flex-wrap gap-2">
                        {['Вино', 'Крепкое', 'Нет'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              const alcohol = formData.alcohol.includes(option)
                                ? formData.alcohol.filter(a => a !== option)
                                : [...formData.alcohol, option]
                              setFormData({ ...formData, alcohol })
                            }}
                            className={`px-3 py-2 border-2 border-chocolate rounded-lg font-serif transition-all ${
                              formData.alcohol.includes(option) ? 'bg-marsala text-cream border-marsala' : ''
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Как добираюсь */}
                  <div>
                    <p className="font-serif text-chocolate mb-2">Как добираюсь?</p>
                    <div className="flex gap-2 flex-wrap">
                      {['Машина', 'Такси', 'Трансфер'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({ ...formData, transport: option })}
                          className={`px-4 py-2 border-2 border-chocolate rounded-lg font-serif transition-all ${
                            formData.transport === option ? 'bg-marsala text-cream border-marsala' : ''
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!formData.rating || !formData.name}
                    className="w-full py-4 bg-marsala text-cream font-serif text-lg rounded-lg disabled:opacity-50"
                  >
                    Отправить
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center relative"
              >
                <FloatingHearts />
                
                <motion.p 
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="font-serif text-[clamp(3rem,10vw,6rem)] font-semibold text-chocolate mb-4"
                >
                  {formData.rating >= 5 ? '💕 Ждём вас!' : '💌 Спасибо!'}
                </motion.p>
                <p className="font-hand text-olive text-[clamp(1.5rem,5vw,2rem)] mb-6">
                  {formData.rating >= 5 
                    ? 'Будет здорово увидеться!' 
                    : 'Если планы изменятся — возвращайтесь'}
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-hand text-marsala text-[clamp(1.25rem,4vw,1.5rem)]"
                >
                  Софья и Сергей ♥
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
