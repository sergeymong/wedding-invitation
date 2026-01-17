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

// Компонент Fireflies для экрана 1
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
      size: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    })

    const initFireflies = () => {
      fireflies = Array.from({ length: 20 }, createFirefly)
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
        gradient.addColorStop(0.3, `rgba(201, 162, 39, ${currentOpacity * 0.5})`)
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
    if (value >= 10) return '#5C6B4A'
    if (value >= 7) return '#7A8B5A'
    if (value >= 4) return '#C9A227'
    return '#722F37'
  }

  const getRatingLabel = (value) => {
    if (value >= 10) return 'Точно буду!'
    if (value >= 7) return 'Скорее да'
    if (value >= 4) return 'Надо подумать'
    if (value >= 1) return 'Скорее нет'
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
            className="h-full w-full relative flex flex-col justify-center px-6 md:px-16"
          >
            <Fireflies />
            <img 
              src="/images/frame.png" 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" 
            />
            <div className="relative z-20">
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
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-6 md:left-16 font-hand text-olive/70 text-lg md:text-xl z-20"
            >
              листай ↓
            </motion.p>
          </motion.div>
        )}

        {/* ========== ЭКРАН 2: STORY START ========== */}
        {currentScreen === 1 && (
          <motion.div
            key="story-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative overflow-hidden"
          >
            {/* Картинка справа */}
            <motion.img
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              src="/images/his-photo.png"
              alt=""
              className="absolute right-0 bottom-0 h-full w-auto max-w-[70%] object-contain object-right-bottom pointer-events-none md:max-w-[60%]"
            />
            
            {/* Контент слева */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-[65%] md:max-w-[50%]">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-hand text-marsala text-[clamp(1.25rem,4vw,1.75rem)] mb-10 md:mb-16"
              >
                февраль 2023
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 md:mb-12"
              >
                <p className="font-serif text-[clamp(1.5rem,5vw,3rem)] font-medium text-chocolate leading-tight">
                  Это история любви
                </p>
                <p className="font-serif text-[clamp(1.5rem,5vw,3rem)] font-medium text-chocolate leading-tight">
                  с первого взгляда
                </p>
                <p className="font-hand text-[clamp(1.25rem,4vw,2rem)] text-olive mt-2 italic">
                  Почти.
                </p>
              </motion.div>

              {!showStoryResult ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="font-serif text-[clamp(0.9rem,3vw,1.25rem)] text-chocolate/80 mb-4">
                    Она впервые увидела его фото и подумала:
                  </p>
                  <div className="flex flex-col gap-2">
                    {['Интересно...', 'Может быть', 'Точно нет'].map((answer, i) => (
                      <motion.button
                        key={answer}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        onClick={() => handleStoryAnswer(answer)}
                        disabled={storyAnswer !== null}
                        className={`text-left font-serif text-[clamp(0.95rem,3vw,1.2rem)] py-3 px-4 border-2 rounded-lg transition-all ${
                          storyAnswer === answer 
                            ? 'bg-marsala text-cream border-marsala' 
                            : 'border-chocolate text-chocolate hover:border-marsala'
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
                  <p className="font-serif text-[clamp(0.9rem,3vw,1.25rem)] text-chocolate/80 mb-4">
                    Она впервые увидела его фото и подумала:
                  </p>
                  <p className="font-serif text-[clamp(2rem,7vw,4.5rem)] font-semibold text-marsala italic">
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
            className="h-full w-full relative overflow-hidden"
          >
            {/* Картинка справа */}
            <motion.img
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              src="/images/first-meeting.png"
              alt=""
              className="absolute right-0 bottom-0 h-full w-auto max-w-[75%] object-contain object-right-bottom pointer-events-none md:max-w-[65%]"
            />
            
            {/* Контент слева */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-[60%] md:max-w-[50%]">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-hand text-marsala text-[clamp(1.25rem,4vw,1.75rem)] mb-12 md:mb-20"
              >
                9 декабря 2023
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-serif text-[clamp(1.25rem,4vw,2.5rem)] font-medium text-chocolate mb-2">
                  Он зашёл в квартиру
                </p>
                <p className="font-serif text-[clamp(1.5rem,5vw,3.5rem)] font-semibold text-chocolate leading-tight">
                  Ещё до приветствия
                </p>
                <p className="font-serif text-[clamp(1.5rem,5vw,3.5rem)] font-semibold text-marsala leading-tight">
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
            className="h-full w-full flex flex-col justify-center px-6 md:px-16"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-hand text-marsala text-[clamp(1.25rem,4vw,1.75rem)] mb-10 md:mb-16"
            >
              минуту спустя
            </motion.p>

            {!showHighfiveResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-serif text-[clamp(1.5rem,5vw,2.5rem)] font-medium text-chocolate mb-2">
                  Их первое взаимодействие
                </p>
                <p className="font-serif text-[clamp(1.1rem,3.5vw,1.5rem)] text-chocolate/80 mb-8">
                  Нужно поздороваться. Как они это сделали?
                </p>
                <div className="flex gap-4 md:gap-6 flex-wrap">
                  {[
                    { id: 'handshake', emoji: '🤝', label: 'Рукопожатие' },
                    { id: 'highfive', emoji: '✋', label: 'Дай пять' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleHighfiveAnswer(option.id)}
                      disabled={highfiveAnswer !== null}
                      className={`flex flex-col items-center gap-3 p-6 md:p-8 border-2 rounded-xl transition-all min-w-[120px] ${
                        highfiveAnswer === option.id
                          ? 'bg-marsala border-marsala'
                          : 'border-chocolate hover:border-marsala'
                      } ${highfiveAnswer && highfiveAnswer !== option.id ? 'opacity-40' : ''}`}
                    >
                      <span className="text-[clamp(2.5rem,8vw,4rem)]">{option.emoji}</span>
                      <span className={`font-serif text-[clamp(1rem,3vw,1.25rem)] ${
                        highfiveAnswer === option.id ? 'text-cream' : 'text-chocolate'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-serif text-[clamp(1.25rem,4vw,2rem)] text-chocolate mb-1">
                  Она протянула руку,
                </p>
                <p className="font-serif text-[clamp(1.25rem,4vw,2rem)] text-chocolate mb-6">
                  а он — хлопнул
                </p>
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  src="/images/highfive.png"
                  alt="Highfive"
                  className="w-full max-w-[400px] rounded-xl mb-6"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-hand text-[clamp(1.5rem,5vw,2.5rem)] text-olive"
                >
                  Вышло идеально
                </motion.p>
              </motion.div>
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
            className="h-full w-full flex flex-col"
          >
            {/* Текст сверху */}
            <div className="flex-shrink-0 pt-12 md:pt-20 px-6 md:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-serif text-[clamp(1.75rem,6vw,3.5rem)] font-medium text-chocolate mb-1">
                  В этот момент
                </p>
                <p className="font-serif text-[clamp(1.75rem,6vw,3.5rem)] font-medium text-chocolate">
                  они засмеялись
                </p>
                <div className="w-16 h-0.5 bg-gold my-6 md:my-8" />
                <p className="font-serif text-[clamp(1.25rem,4vw,2rem)] text-marsala italic">
                  и с этого всё началось
                </p>
              </motion.div>
            </div>
            
            {/* Картинка снизу */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex items-end justify-center overflow-hidden"
            >
              <img
                src="/images/laughter.png"
                alt=""
                className="max-h-[55vh] w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}

        {/* ========== ЭКРАН 6: TOGETHER ========== */}
        {currentScreen === 5 && (
          <motion.div
            key="together"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col"
          >
            {/* Контент сверху */}
            <div className="flex-shrink-0 pt-12 md:pt-16 px-6 md:px-16">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-[clamp(4rem,14vw,9rem)] font-semibold text-chocolate leading-none tracking-tight"
              >
                {displayDays}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-hand text-olive text-[clamp(1.25rem,4vw,2rem)] mt-1 mb-6"
              >
                дней
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-serif text-[clamp(1.25rem,4vw,2rem)] font-medium text-chocolate mb-1">
                  С того дня прошло 2 года
                </p>
                <p className="font-serif text-[clamp(1rem,3.5vw,1.5rem)] text-chocolate/80 mb-4">
                  Ни одного дня друг без друга
                </p>
                <p className="font-hand text-[clamp(1.5rem,5vw,2.5rem)] text-marsala italic">
                  И что дальше?
                </p>
              </motion.div>
            </div>
            
            {/* Картинка снизу */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex-1 flex items-end justify-center overflow-hidden"
            >
              <img
                src="/images/together.png"
                alt=""
                className="max-h-[50vh] w-auto object-contain"
              />
            </motion.div>
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
            {/* Dark overlay - градиент снизу */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
            
            <Snowfall />

            <div className="relative z-20 p-6 md:p-16 pb-12 md:pb-20">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-hand text-gold text-[clamp(1.25rem,4vw,1.75rem)] mb-6 md:mb-10"
              >
                декабрь 2025
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-[clamp(1.1rem,3.5vw,1.75rem)] text-white/85 mb-6 md:mb-8"
              >
                Загородный дом. Гирлянды. Танец.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="font-serif text-[clamp(2rem,7vw,5rem)] font-semibold text-white leading-tight drop-shadow-lg">
                  Она сказала
                </p>
                <p className="font-serif text-[clamp(3.5rem,12vw,9rem)] font-bold text-gold leading-none italic drop-shadow-xl">
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
            className="h-full w-full relative flex items-center justify-center"
          >
            {/* Рамка по центру */}
            <img 
              src="/images/background.png" 
              alt="" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 p-4 md:p-8" 
            />
            
            {/* Контент внутри рамки */}
            <div className="relative z-10 text-center px-12 md:px-24">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-[clamp(2.5rem,9vw,6rem)] font-semibold text-chocolate leading-none tracking-tight mb-6 md:mb-10"
              >
                30.08.2026
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10 md:mb-14"
              >
                <p className="font-serif text-[clamp(1.1rem,4vw,2rem)] font-medium text-chocolate mb-1">
                  Для нас наступает новый этап
                </p>
                <p className="font-serif text-[clamp(1.1rem,4vw,2rem)] font-medium text-marsala">
                  Хотим вступить в него с вами
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-hand text-[clamp(1.75rem,6vw,3.5rem)] text-olive italic"
              >
                Софья и Сергей
              </motion.p>
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
            {/* Background - новое красивое фото площадки */}
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
              src="/images/location.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 pb-12 md:pb-20 z-10">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-hand text-gold text-[clamp(1.25rem,4vw,1.75rem)] mb-4"
              >
                И мы уже знаем, где это случится
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-[clamp(2.5rem,10vw,7rem)] font-semibold text-white leading-none mb-6 md:mb-10 drop-shadow-lg"
              >
                Due To Love
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-serif text-[clamp(1rem,3vw,1.4rem)] text-white/90 max-w-lg mb-6 leading-relaxed"
              >
                Место, где природа встречается с уютом.<br/>
                Где можно выдохнуть и просто быть рядом.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-serif text-[clamp(0.9rem,3vw,1.1rem)] text-white/70"
              >
                18+ · можно с парой
              </motion.p>
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
            className="h-full w-full overflow-y-auto py-12 md:py-20 px-6 md:px-16"
          >
            {/* Countdown */}
            <div className="mb-12 md:mb-16">
              <p className="font-serif text-olive text-sm md:text-base uppercase tracking-widest mb-2">
                До встречи осталось
              </p>
              <p className="font-serif text-[clamp(4rem,14vw,9rem)] font-semibold text-chocolate leading-none">
                {getDaysUntilWedding()}
              </p>
              <p className="font-hand text-olive text-[clamp(1.25rem,4vw,1.75rem)] mt-1">дней</p>
            </div>

            {/* What to wear */}
            <section className="mb-10 md:mb-14">
              <h3 className="font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-semibold text-chocolate mb-4 md:mb-6">
                Что надеть
              </h3>
              <p className="font-serif text-[clamp(1.1rem,3.5vw,1.4rem)] text-chocolate mb-4">
                Приходите в этих оттенках:
              </p>
              <img src="/images/dresscode.png" alt="Палитра" className="max-w-[350px] w-full rounded-lg mb-4" />
              <p className="font-hand text-olive text-[clamp(1.1rem,3.5vw,1.4rem)] italic">
                Строгой проверки не будет, честно 😉
              </p>
            </section>

            {/* Gifts */}
            <section className="mb-10 md:mb-14">
              <h3 className="font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-semibold text-chocolate mb-4 md:mb-6">
                Подарки
              </h3>
              <p className="font-serif text-[clamp(1.1rem,3.5vw,1.4rem)] text-chocolate leading-relaxed">
                Мы мечтаем о своём жилье.<br/>
                Благодарны любому вкладу, который приблизит нас к этому.
              </p>
            </section>

            {/* What to bring */}
            <section>
              <h3 className="font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-semibold text-chocolate mb-4 md:mb-6">
                Что взять с собой
              </h3>
              <div className="font-serif text-[clamp(1.1rem,3.5vw,1.4rem)] text-chocolate space-y-2">
                <p>✓ Хорошее настроение</p>
                <p>✓ Сменную удобную обувь (танцы будут!)</p>
                <p>✓ Что-то тёплое на вечер</p>
              </div>
              <p className="font-hand text-olive text-[clamp(1.1rem,3.5vw,1.4rem)] italic mt-4">
                Зонты, аптечки и всё на случай «а вдруг» — у нас есть
              </p>
            </section>
          </motion.div>
        )}

        {/* ========== ЭКРАН 11: CHEATSHEET ========== */}
        {currentScreen === 10 && (
          <motion.div
            key="cheatsheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col"
          >
            <div className="pt-8 md:pt-12 px-6 md:px-16">
              <h2 className="font-hand text-marsala text-[clamp(2rem,7vw,3.5rem)]">Шпаргалка</h2>
            </div>

            {/* Cards */}
            <div className="flex-1 flex items-center px-6 md:px-16 overflow-x-auto snap-x snap-mandatory gap-5 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              
              {/* Card 1: When */}
              <div className="flex-shrink-0 w-[calc(100vw-80px)] max-w-[400px] min-h-[350px] bg-white rounded-2xl p-8 shadow-lg snap-center flex flex-col justify-center text-center">
                <p className="font-serif text-olive text-[clamp(1.1rem,3.5vw,1.4rem)] uppercase tracking-wide mb-4">Суббота</p>
                <p className="font-serif text-chocolate text-[clamp(2.5rem,10vw,5rem)] font-semibold leading-tight mb-6">
                  30 августа 2026
                </p>
                <p className="font-serif text-chocolate text-[clamp(1.5rem,5vw,2rem)]">14:30 — 22:30</p>
              </div>

              {/* Card 2: Where */}
              <div className="flex-shrink-0 w-[calc(100vw-80px)] max-w-[400px] min-h-[350px] bg-white rounded-2xl p-8 shadow-lg snap-center flex flex-col justify-center text-center">
                <p className="font-serif text-chocolate text-[clamp(2rem,8vw,4rem)] font-semibold mb-4">Due To Love</p>
                <p className="font-serif text-chocolate/70 text-[clamp(1rem,3.5vw,1.25rem)] mb-6">
                  [Адрес уточняется]
                </p>
                <a 
                  href="https://yandex.ru/maps/-/CLhzMN9F" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block font-serif text-cream bg-marsala py-4 px-8 rounded-lg text-[clamp(1rem,3.5vw,1.25rem)]"
                >
                  🗺️ Построить маршрут
                </a>
              </div>

              {/* Card 3: What */}
              <div className="flex-shrink-0 w-[calc(100vw-80px)] max-w-[400px] min-h-[350px] bg-white rounded-2xl p-8 shadow-lg snap-center flex flex-col justify-center">
                <div className="font-serif text-chocolate text-[clamp(1.1rem,3.5vw,1.4rem)] space-y-4">
                  <p>👔 Оттенки из палитры</p>
                  <p>👟 Сменка для танцев</p>
                  <p>🧥 Тёплое на вечер</p>
                </div>
              </div>

              {/* Card 4: Questions */}
              <div className="flex-shrink-0 w-[calc(100vw-80px)] max-w-[400px] min-h-[350px] bg-white rounded-2xl p-8 shadow-lg snap-center flex flex-col justify-center text-center">
                <p className="font-serif text-chocolate text-[clamp(1.25rem,4vw,1.75rem)] mb-6">
                  Что-то непонятно?<br/>Бот ответит на всё
                </p>
                <a 
                  href="https://t.me/wedding_bot" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-serif text-cream bg-olive py-4 px-8 rounded-lg text-[clamp(1rem,3.5vw,1.25rem)]"
                >
                  💬 Открыть бота
                </a>
              </div>
            </div>

            <p className="text-center font-hand text-olive/60 text-sm pb-6">← свайп →</p>
          </motion.div>
        )}

        {/* ========== ЭКРАН 12: RSVP ========== */}
        {currentScreen === 11 && (
          <motion.div
            key="rsvp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full overflow-y-auto py-12 md:py-20 px-6 md:px-16"
          >
            {!formSubmitted ? (
              <>
                <h2 className="font-serif text-[clamp(2.5rem,9vw,5rem)] font-semibold text-chocolate mb-8">
                  Придёте?
                </h2>

                {/* Scale 1-10 */}
                <div className="mb-8">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFormData({ ...formData, rating: num })}
                        style={{
                          backgroundColor: formData.rating === num ? getRatingColor(num) : 'transparent',
                        }}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 border-chocolate font-serif text-base md:text-lg font-semibold transition-all ${
                          formData.rating === num ? 'text-cream' : 'text-chocolate'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {/* Scale labels */}
                  <div className="flex justify-between text-xs md:text-sm text-chocolate/60 font-serif max-w-[420px]">
                    <span>Скорее нет</span>
                    <span>Надо подумать</span>
                    <span>Точно буду!</span>
                  </div>
                  {formData.rating && (
                    <p className="font-hand text-[clamp(1.1rem,3.5vw,1.4rem)] mt-3" style={{ color: getRatingColor(formData.rating) }}>
                      {getRatingLabel(formData.rating)}
                    </p>
                  )}
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                  {/* Name */}
                  <div>
                    <label className="block font-serif text-chocolate mb-2">Ваше имя</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Имя Фамилия"
                      className="w-full p-4 border-2 border-chocolate rounded-lg font-serif bg-transparent"
                    />
                  </div>

                  {/* With guest */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer font-serif text-chocolate">
                      <input
                        type="checkbox"
                        checked={formData.withGuest}
                        onChange={(e) => setFormData({ ...formData, withGuest: e.target.checked })}
                        className="w-5 h-5"
                      />
                      Приду с парой
                    </label>
                    {formData.withGuest && (
                      <input
                        type="text"
                        value={formData.guestName}
                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                        placeholder="Имя вашей пары"
                        className="w-full p-4 border-2 border-chocolate rounded-lg font-serif bg-transparent mt-3"
                      />
                    )}
                  </div>

                  {/* Food preferences */}
                  <div>
                    <label className="block font-serif text-chocolate mb-2">Предпочтения по еде</label>
                    <div className="flex flex-wrap gap-2">
                      {['Мясо', 'Рыба', 'Вегетарианское', 'Без ограничений'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            const food = formData.food.includes(option)
                              ? formData.food.filter(f => f !== option)
                              : [...formData.food, option]
                            setFormData({ ...formData, food })
                          }}
                          className={`px-4 py-2 border-2 border-chocolate rounded-lg font-serif transition-all ${
                            formData.food.includes(option) ? 'bg-marsala text-cream border-marsala' : ''
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alcohol */}
                  <div>
                    <label className="block font-serif text-chocolate mb-2">Алкоголь</label>
                    <div className="flex flex-wrap gap-2">
                      {['Вино', 'Шампанское', 'Крепкое', 'Коктейли', 'Не пью'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            const alcohol = formData.alcohol.includes(option)
                              ? formData.alcohol.filter(a => a !== option)
                              : [...formData.alcohol, option]
                            setFormData({ ...formData, alcohol })
                          }}
                          className={`px-4 py-2 border-2 border-chocolate rounded-lg font-serif transition-all ${
                            formData.alcohol.includes(option) ? 'bg-marsala text-cream border-marsala' : ''
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transport */}
                  <div>
                    <label className="block font-serif text-chocolate mb-2">Как планируете добираться?</label>
                    <div className="flex flex-wrap gap-2">
                      {['На машине', 'Такси', 'Нужен трансфер'].map((option) => (
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

                  {/* Accommodation */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer font-serif text-chocolate">
                      <input
                        type="checkbox"
                        checked={formData.accommodation}
                        onChange={(e) => setFormData({ ...formData, accommodation: e.target.checked })}
                        className="w-5 h-5"
                      />
                      Нужно размещение на ночь
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!formData.rating || !formData.name}
                    className="w-full py-4 bg-marsala text-cream font-serif text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отправить
                  </button>

                  <p className="font-hand text-olive text-center">
                    Если планы изменятся — возвращайтесь и обновите
                  </p>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-full flex flex-col justify-center"
              >
                <p className="font-serif text-[clamp(2.5rem,9vw,5rem)] font-semibold text-chocolate mb-6">
                  {formData.rating >= 7 ? 'Ждём вас!' : 'Спасибо за ответ'}
                </p>
                <p className="font-hand text-olive text-[clamp(1.25rem,4vw,1.75rem)]">
                  {formData.rating >= 7 
                    ? 'Если планы изменятся — возвращайтесь и обновите' 
                    : 'Если что-то изменится — мы всегда рады'
                  }
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
