import { useState, useEffect } from 'react'
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
  return 'Дорогой гость'
}

// Конфиг экранов
const screens = ['intro', 'contrast', 'highfive', 'invitation', 'details', 'rsvp']

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [guestName] = useState(getGuestFromURL)
  const [highFiveTriggered, setHighFiveTriggered] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [formData, setFormData] = useState({
    attending: null,
    meal: '',
    drinks: [],
    dietary: '',
    transfer: false,
    accommodation: false,
    comment: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

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

  // Scroll навигация для десктопа
  useEffect(() => {
    const handleWheel = (e) => {
      if (expandedCard) return
      if (e.deltaY > 30 && currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1)
      } else if (e.deltaY < -30 && currentScreen > 0) {
        setCurrentScreen(prev => prev - 1)
      }
    }
    let timeout
    const throttledWheel = (e) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleWheel(e)
          timeout = null
        }, 800)
      }
    }
    window.addEventListener('wheel', throttledWheel, { passive: true })
    return () => window.removeEventListener('wheel', throttledWheel)
  }, [currentScreen, expandedCard])

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

  const goToScreen = (index) => setCurrentScreen(index)
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('RSVP Data:', { guestName, ...formData })
    setFormSubmitted(true)
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cream touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Навигация точками */}
      <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {screens.map((name, i) => (
          <button
            key={i}
            onClick={() => goToScreen(i)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
              currentScreen === i ? 'bg-marsala scale-125' : 'bg-olive/30 hover:bg-olive/50'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Экран 1: Intro */}
        {currentScreen === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center p-6 md:p-12"
          >
            <div className="relative w-full max-w-sm md:max-w-lg lg:max-w-xl">
              <img src="/images/frame.png" alt="" className="w-full h-auto" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-chocolate/60 text-sm md:text-base font-sans tracking-[0.3em] mb-4 md:mb-6"
                >
                  СВАДЬБА
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-serif text-5xl md:text-6xl lg:text-7xl text-chocolate text-center leading-tight"
                >
                  Сергей<br/>
                  <span className="text-3xl md:text-4xl text-marsala">&amp;</span><br/>
                  Софья
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 md:mt-8 text-xl md:text-2xl text-olive font-serif"
                >
                  30 августа 2026
                </motion.p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center mt-6 text-chocolate/50 text-base md:text-lg font-sans animate-bounce"
              >
                Листайте вниз ↓
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Экран 2: Контраст — история знакомства */}
        {currentScreen === 1 && (
          <motion.div
            key="contrast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="h-full w-full flex flex-col items-center justify-center p-6 md:p-12"
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-chocolate/60 text-sm md:text-base font-sans tracking-widest mb-4"
            >
              ЭТА ИСТОРИЯ НАЧИНАЛАСЬ НЕ ТАК, КАК ОБЫЧНО...
            </motion.p>
            <motion.img 
              src="/images/story.png" 
              alt="История знакомства" 
              className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-center max-w-lg"
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-chocolate font-serif leading-relaxed">
                Она посмотрела на фото — <span className="text-marsala italic">«точно нет»</span>
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-chocolate font-serif leading-relaxed mt-4">
                Он зашёл — она передумала до <span className="text-olive italic">«привет»</span>
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Экран 3: Пятюня */}
        {currentScreen === 2 && (
          <motion.div
            key="highfive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col items-center justify-center p-6 md:p-12"
          >
            <motion.div 
              className="relative cursor-pointer"
              onClick={() => setHighFiveTriggered(true)}
              whileTap={{ scale: 1.02 }}
            >
              <motion.img 
                src="/images/highfive.png" 
                alt="Пятюня встретила ладонь" 
                className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-xl"
                animate={highFiveTriggered ? { scale: [1, 1.03, 1], rotate: [0, -1, 1, 0] } : {}}
                transition={{ duration: 0.5 }}
              />
              {highFiveTriggered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1.5, 0],
                        x: Math.cos(i * 30 * Math.PI / 180) * 120,
                        y: Math.sin(i * 30 * Math.PI / 180) * 120,
                        opacity: [1, 1, 0]
                      }}
                      transition={{ duration: 1.2, delay: i * 0.05 }}
                      className="absolute text-3xl md:text-4xl"
                    >
                      ✨
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center max-w-lg"
            >
              {!highFiveTriggered ? (
                <>
                  <p className="text-xl md:text-2xl lg:text-3xl text-chocolate font-serif">
                    Пятюня встретила ладонь
                  </p>
                  <p className="mt-3 text-olive text-base md:text-lg font-sans">
                    Нажмите на картинку ✋
                  </p>
                </>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl md:text-2xl lg:text-3xl text-chocolate font-serif"
                >
                  С тех пор — <span className="text-marsala">ни дня без общения</span>
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Экран 4: Приглашение */}
        {currentScreen === 3 && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center p-6 md:p-12"
            style={{ backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="bg-cream/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-16 max-w-md md:max-w-lg text-center shadow-2xl">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-olive font-sans text-sm md:text-base tracking-[0.3em] mb-4">ПРИГЛАШЕНИЕ</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="font-serif text-3xl md:text-4xl lg:text-5xl text-chocolate mb-6 md:mb-8">{guestName}!</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="text-chocolate/80 font-serif text-lg md:text-xl lg:text-2xl leading-relaxed">
                Мы хотим разделить с тобой<br/>один из самых важных дней<br/>в нашей жизни.
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                className="text-marsala font-serif text-lg md:text-xl mt-6 italic">
                «Мы затеяли хорошую авантюру —<br/>спасибо, что вписались!»
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                className="mt-8 pt-8 border-t border-olive/20">
                <p className="text-chocolate font-serif text-2xl md:text-3xl">30 августа 2026</p>
                <p className="text-olive font-sans text-base md:text-lg mt-2">Сбор гостей в 14:30</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Экран 5: Детали */}
        {currentScreen === 4 && (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-chocolate mb-8">Детали</h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg md:max-w-2xl">
              {/* Тайминг */}
              <motion.div className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer ${expandedCard === 'timing' ? 'col-span-2' : ''}`}
                onClick={() => setExpandedCard(expandedCard === 'timing' ? null : 'timing')} layout>
                <img src="/images/timing.png" alt="Тайминг" className="w-full h-36 md:h-44 object-cover" />
                <div className="p-4 md:p-5">
                  <h3 className="font-serif text-xl md:text-2xl text-chocolate">Тайминг</h3>
                  <AnimatePresence>
                    {expandedCard === 'timing' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="text-base md:text-lg text-chocolate/70 mt-3 space-y-2">
                        <p><span className="font-medium">14:30</span> — Сбор гостей</p>
                        <p><span className="font-medium">15:15</span> — Церемония</p>
                        <p><span className="font-medium">16:00</span> — Фуршет</p>
                        <p><span className="font-medium">18:00</span> — Банкет</p>
                        <p><span className="font-medium">22:30</span> — Окончание</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {/* Дресс-код */}
              <motion.div className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer ${expandedCard === 'dresscode' ? 'col-span-2' : ''}`}
                onClick={() => setExpandedCard(expandedCard === 'dresscode' ? null : 'dresscode')} layout>
                <img src="/images/dresscode.png" alt="Дресс-код" className="w-full h-36 md:h-44 object-cover" />
                <div className="p-4 md:p-5">
                  <h3 className="font-serif text-xl md:text-2xl text-chocolate">Дресс-код</h3>
                  <AnimatePresence>
                    {expandedCard === 'dresscode' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="text-base md:text-lg text-chocolate/70 mt-3">
                        <p className="font-medium">Коктейльный / Нарядный casual</p>
                        <p className="mt-2">Палитра: марсала, оливковый, крем, пыльный голубой, шоколадный</p>
                        <div className="flex gap-2 mt-3">
                          <span className="w-6 h-6 rounded-full bg-marsala"></span>
                          <span className="w-6 h-6 rounded-full bg-olive"></span>
                          <span className="w-6 h-6 rounded-full bg-cream border border-chocolate/20"></span>
                          <span className="w-6 h-6 rounded-full bg-sky-200"></span>
                          <span className="w-6 h-6 rounded-full bg-chocolate"></span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {/* Локация */}
              <motion.div className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer ${expandedCard === 'location' ? 'col-span-2' : ''}`}
                onClick={() => setExpandedCard(expandedCard === 'location' ? null : 'location')} layout>
                <img src="/images/location.png" alt="Локация" className="w-full h-36 md:h-44 object-cover object-top" />
                <div className="p-4 md:p-5">
                  <h3 className="font-serif text-xl md:text-2xl text-chocolate">Локация</h3>
                  <AnimatePresence>
                    {expandedCard === 'location' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="text-base md:text-lg text-chocolate/70 mt-3">
                        <p className="font-medium text-chocolate">Лесная Роса</p>
                        <p className="mt-1">Московская область, ~15 км от МКАД</p>
                        <a href="https://yandex.ru/maps/-/CLhbvDMr" target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-4 px-5 py-2 bg-olive text-white rounded-lg text-base font-medium hover:bg-olive/90"
                          onClick={(e) => e.stopPropagation()}>Открыть карту →</a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              {/* Погода */}
              <motion.div className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer ${expandedCard === 'weather' ? 'col-span-2' : ''}`}
                onClick={() => setExpandedCard(expandedCard === 'weather' ? null : 'weather')} layout>
                <img src="/images/weather.png" alt="Погода" className="w-full h-36 md:h-44 object-cover" />
                <div className="p-4 md:p-5">
                  <h3 className="font-serif text-xl md:text-2xl text-chocolate">Погода</h3>
                  <AnimatePresence>
                    {expandedCard === 'weather' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="text-base md:text-lg text-chocolate/70 mt-3">
                        <p>Конец августа под Москвой</p>
                        <p className="mt-1 font-medium">Обычно +18...+24°C</p>
                        <p className="mt-2 text-olive italic">Возьмите что-то тёплое на вечер</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Экран 6: RSVP */}
        {currentScreen === 5 && (
          <motion.div key="rsvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md md:max-w-lg my-8">
              {!formSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <img src="/images/rsvp.png" alt="" className="w-36 md:w-44 mx-auto mb-6" />
                    <h2 className="font-serif text-3xl md:text-4xl text-chocolate">Ждём ответ</h2>
                    <p className="text-olive text-base md:text-lg mt-2">до 1 мая 2026</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <p className="text-chocolate font-serif text-lg md:text-xl mb-3">{guestName}, вы придёте?</p>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setFormData({...formData, attending: true})}
                          className={`flex-1 py-4 rounded-xl border-2 text-lg font-medium transition-all ${
                            formData.attending === true ? 'border-olive bg-olive/10 text-olive' : 'border-cream hover:border-olive/50'}`}>
                          С радостью!
                        </button>
                        <button type="button" onClick={() => setFormData({...formData, attending: false})}
                          className={`flex-1 py-4 rounded-xl border-2 text-lg font-medium transition-all ${
                            formData.attending === false ? 'border-marsala bg-marsala/10 text-marsala' : 'border-cream hover:border-marsala/50'}`}>
                          Не смогу
                        </button>
                      </div>
                    </div>
                    {formData.attending && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-5">
                        <div>
                          <label className="text-chocolate font-medium text-lg block mb-2">Предпочтения по еде</label>
                          <select value={formData.meal} onChange={(e) => setFormData({...formData, meal: e.target.value})}
                            className="w-full p-4 border-2 border-cream rounded-xl bg-white focus:border-olive outline-none text-lg">
                            <option value="">Выберите...</option>
                            <option value="meat">Мясо</option>
                            <option value="fish">Рыба</option>
                            <option value="veg">Вегетарианское</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-chocolate font-medium text-lg block mb-2">Что будете пить?</label>
                          <div className="flex flex-wrap gap-3">
                            {['Вино', 'Шампанское', 'Крепкое', 'Безалкогольное'].map(drink => (
                              <button key={drink} type="button"
                                onClick={() => {
                                  const drinks = formData.drinks.includes(drink) ? formData.drinks.filter(d => d !== drink) : [...formData.drinks, drink]
                                  setFormData({...formData, drinks})
                                }}
                                className={`px-4 py-2 rounded-full text-base border-2 transition-all ${
                                  formData.drinks.includes(drink) ? 'bg-olive text-white border-olive' : 'border-cream hover:border-olive'}`}>
                                {drink}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-chocolate font-medium text-lg block mb-2">Аллергии / ограничения</label>
                          <input type="text" value={formData.dietary} onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                            placeholder="Если есть, напишите" className="w-full p-4 border-2 border-cream rounded-xl focus:border-olive outline-none text-lg" />
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.transfer} onChange={(e) => setFormData({...formData, transfer: e.target.checked})} className="w-5 h-5 text-olive rounded" />
                            <span className="text-chocolate text-lg">Нужен трансфер</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.accommodation} onChange={(e) => setFormData({...formData, accommodation: e.target.checked})} className="w-5 h-5 text-olive rounded" />
                            <span className="text-chocolate text-lg">Нужно размещение</span>
                          </label>
                        </div>
                        <div>
                          <label className="text-chocolate font-medium text-lg block mb-2">Хотите что-то добавить?</label>
                          <textarea value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})}
                            placeholder="Любые пожелания" rows={3} className="w-full p-4 border-2 border-cream rounded-xl focus:border-olive outline-none resize-none text-lg" />
                        </div>
                      </motion.div>
                    )}
                    <button type="submit" disabled={formData.attending === null}
                      className="w-full py-4 bg-marsala text-white rounded-xl text-xl font-medium hover:bg-marsala/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Отправить
                    </button>
                  </form>
                </>
              ) : (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                  <div className="text-6xl mb-6">{formData.attending ? '💚' : '💔'}</div>
                  <h2 className="font-serif text-3xl md:text-4xl text-chocolate mb-4">{formData.attending ? 'Спасибо!' : 'Жаль...'}</h2>
                  <p className="text-chocolate/70 text-lg md:text-xl">
                    {formData.attending ? 'Мы очень рады, что вы будете с нами!' : 'Будем скучать. Может ещё передумаете?'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
