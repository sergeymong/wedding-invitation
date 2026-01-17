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
const screens = ['intro', 'story', 'highfive', 'invitation', 'details', 'rsvp']

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

  const goToScreen = (index) => setCurrentScreen(index)

  // Обработка формы RSVP
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Здесь будет отправка в Google Sheets
    console.log('RSVP Data:', { guestName, ...formData })
    
    // TODO: Отправка в Google Sheets API
    // const response = await fetch('YOUR_GOOGLE_SCRIPT_URL', {
    //   method: 'POST',
    //   body: JSON.stringify({ guestName, ...formData })
    // })
    
    setFormSubmitted(true)
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cream touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Навигация точками */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {screens.map((_, i) => (
          <button
            key={i}
            onClick={() => goToScreen(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentScreen === i 
                ? 'bg-marsala scale-150' 
                : 'bg-olive/30 hover:bg-olive/50'
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
            className="h-full w-full flex items-center justify-center p-4"
          >
            <div className="relative max-w-md w-full">
              <img 
                src="/images/frame.png" 
                alt="" 
                className="w-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-chocolate/70 text-sm font-sans tracking-widest mb-4"
                >
                  СВАДЬБА
                </motion.p>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-serif text-4xl md:text-5xl text-chocolate text-center leading-tight"
                >
                  Сергей<br/>
                  <span className="text-2xl md:text-3xl text-marsala">&amp;</span><br/>
                  Софья
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-xl text-olive font-serif"
                >
                  30 августа 2026
                </motion.p>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center mt-4 text-chocolate/50 text-sm font-sans animate-bounce"
              >
                Листайте вниз ↓
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Экран 2: Story */}
        {currentScreen === 1 && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="h-full w-full flex flex-col items-center justify-center p-6"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-chocolate mb-6 text-center">
              5 раз мимо...
            </h2>
            <motion.img 
              src="/images/story.png" 
              alt="История" 
              className="max-w-lg w-full rounded-lg shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-lg text-chocolate/80 font-serif text-center max-w-md"
            >
              Она удалила профиль на сайте знакомств...<br/>
              А он пришёл на её день рождения
            </motion.p>
          </motion.div>
        )}

        {/* Экран 3: HighFive */}
        {currentScreen === 2 && (
          <motion.div
            key="highfive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col items-center justify-center p-6"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-chocolate mb-4 text-center">
              ...на 6-й — навсегда
            </h2>
            <motion.div 
              className="relative cursor-pointer"
              onClick={() => setHighFiveTriggered(true)}
              whileTap={{ scale: 1.05 }}
            >
              <motion.img 
                src="/images/highfive.png" 
                alt="Пятюня" 
                className="max-w-lg w-full rounded-lg shadow-lg"
                animate={highFiveTriggered ? {
                  scale: [1, 1.05, 1],
                  rotate: [0, -2, 2, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              />
              {highFiveTriggered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        x: Math.cos(i * 30 * Math.PI / 180) * 100,
                        y: Math.sin(i * 30 * Math.PI / 180) * 100,
                        opacity: [1, 1, 0]
                      }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className="absolute text-2xl"
                    >
                      ✨
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
            {!highFiveTriggered ? (
              <p className="mt-4 text-olive text-sm font-sans">
                Нажмите на картинку
              </p>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-lg text-marsala font-serif italic"
              >
                "A funny moment"
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Экран 4: Invitation */}
        {currentScreen === 3 && (
          <motion.div
            key="invitation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center p-4"
            style={{
              backgroundImage: 'url(/images/background.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="bg-cream/90 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center shadow-xl">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-olive font-sans text-sm tracking-widest mb-4"
              >
                ПРИГЛАШЕНИЕ
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-3xl text-chocolate mb-6"
              >
                {guestName}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-chocolate/80 font-serif text-lg leading-relaxed"
              >
                Мы хотим разделить с тобой<br/>
                один из самых важных дней в нашей жизни.<br/><br/>
                <span className="text-marsala font-medium">
                  Хорошая авантюра — спасибо, что вписались!
                </span>
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 pt-6 border-t border-olive/20"
              >
                <p className="text-chocolate font-serif text-xl">30 августа 2026</p>
                <p className="text-olive font-sans text-sm mt-1">Сбор гостей в 14:30</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Экран 5: Details */}
        {currentScreen === 4 && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col items-center justify-center p-4 overflow-y-auto"
          >
            <h2 className="font-serif text-2xl text-chocolate mb-6">Детали</h2>
            
            <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
              {/* Тайминг */}
              <motion.div
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all ${
                  expandedCard === 'timing' ? 'col-span-2' : ''
                }`}
                onClick={() => setExpandedCard(expandedCard === 'timing' ? null : 'timing')}
                layout
              >
                <img src="/images/timing.png" alt="Тайминг" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-serif text-lg text-chocolate">Тайминг</h3>
                  <AnimatePresence>
                    {expandedCard === 'timing' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm text-chocolate/70 mt-2 space-y-1"
                      >
                        <p>14:30 — Сбор гостей</p>
                        <p>15:15 — Церемония</p>
                        <p>16:00 — Фуршет</p>
                        <p>18:00 — Банкет</p>
                        <p>22:30 — Окончание</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Дресс-код */}
              <motion.div
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all ${
                  expandedCard === 'dresscode' ? 'col-span-2' : ''
                }`}
                onClick={() => setExpandedCard(expandedCard === 'dresscode' ? null : 'dresscode')}
                layout
              >
                <img src="/images/dresscode.png" alt="Дресс-код" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-serif text-lg text-chocolate">Дресс-код</h3>
                  <AnimatePresence>
                    {expandedCard === 'dresscode' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm text-chocolate/70 mt-2"
                      >
                        <p>Коктейльный / Нарядный casual</p>
                        <p className="mt-1">Палитра: бургундия, оливковый, крем, пыльный голубой, шоколадный</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Локация */}
              <motion.div
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all ${
                  expandedCard === 'location' ? 'col-span-2' : ''
                }`}
                onClick={() => setExpandedCard(expandedCard === 'location' ? null : 'location')}
                layout
              >
                <img src="/images/location.png" alt="Локация" className="w-full h-32 object-cover object-top" />
                <div className="p-3">
                  <h3 className="font-serif text-lg text-chocolate">Локация</h3>
                  <AnimatePresence>
                    {expandedCard === 'location' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm text-chocolate/70 mt-2"
                      >
                        <p className="font-medium">Лесная Роса (Due to Love)</p>
                        <p className="mt-1">Московская область</p>
                        <a 
                          href="https://yandex.ru/maps/-/placeholder" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 px-3 py-1 bg-olive text-white rounded text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Открыть карту
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Погода */}
              <motion.div
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all ${
                  expandedCard === 'weather' ? 'col-span-2' : ''
                }`}
                onClick={() => setExpandedCard(expandedCard === 'weather' ? null : 'weather')}
                layout
              >
                <img src="/images/weather.png" alt="Погода" className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-serif text-lg text-chocolate">Погода</h3>
                  <AnimatePresence>
                    {expandedCard === 'weather' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm text-chocolate/70 mt-2"
                      >
                        <p>Конец августа под Москвой</p>
                        <p className="mt-1">Обычно +18...+24°C</p>
                        <p className="mt-1 text-olive">Возьмите что-то тёплое на вечер</p>
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
          <motion.div
            key="rsvp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full my-8">
              {!formSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <img src="/images/rsvp.png" alt="" className="w-32 mx-auto mb-4" />
                    <h2 className="font-serif text-2xl text-chocolate">Ждём ответ</h2>
                    <p className="text-olive text-sm mt-1">до 1 мая 2026</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Придёте? */}
                    <div>
                      <p className="text-chocolate font-medium mb-2">{guestName}, вы придёте?</p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, attending: true})}
                          className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                            formData.attending === true 
                              ? 'border-olive bg-olive/10 text-olive' 
                              : 'border-cream hover:border-olive/50'
                          }`}
                        >
                          С радостью!
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, attending: false})}
                          className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                            formData.attending === false 
                              ? 'border-marsala bg-marsala/10 text-marsala' 
                              : 'border-cream hover:border-marsala/50'
                          }`}
                        >
                          Не смогу
                        </button>
                      </div>
                    </div>

                    {formData.attending && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* Блюдо */}
                        <div>
                          <label className="text-chocolate font-medium block mb-2">
                            Предпочтения по еде
                          </label>
                          <select
                            value={formData.meal}
                            onChange={(e) => setFormData({...formData, meal: e.target.value})}
                            className="w-full p-3 border border-cream rounded-lg bg-white focus:border-olive outline-none"
                          >
                            <option value="">Выберите...</option>
                            <option value="meat">Мясо</option>
                            <option value="fish">Рыба</option>
                            <option value="veg">Вегетарианское</option>
                          </select>
                        </div>

                        {/* Напитки */}
                        <div>
                          <label className="text-chocolate font-medium block mb-2">
                            Что будете пить?
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Вино', 'Шампанское', 'Крепкое', 'Безалкогольное'].map(drink => (
                              <button
                                key={drink}
                                type="button"
                                onClick={() => {
                                  const drinks = formData.drinks.includes(drink)
                                    ? formData.drinks.filter(d => d !== drink)
                                    : [...formData.drinks, drink]
                                  setFormData({...formData, drinks})
                                }}
                                className={`px-3 py-1 rounded-full text-sm border transition-all ${
                                  formData.drinks.includes(drink)
                                    ? 'bg-olive text-white border-olive'
                                    : 'border-cream hover:border-olive'
                                }`}
                              >
                                {drink}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Аллергии */}
                        <div>
                          <label className="text-chocolate font-medium block mb-2">
                            Аллергии / ограничения
                          </label>
                          <input
                            type="text"
                            value={formData.dietary}
                            onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                            placeholder="Если есть, напишите"
                            className="w-full p-3 border border-cream rounded-lg focus:border-olive outline-none"
                          />
                        </div>

                        {/* Трансфер и размещение */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.transfer}
                              onChange={(e) => setFormData({...formData, transfer: e.target.checked})}
                              className="w-4 h-4 text-olive"
                            />
                            <span className="text-chocolate">Нужен трансфер</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.accommodation}
                              onChange={(e) => setFormData({...formData, accommodation: e.target.checked})}
                              className="w-4 h-4 text-olive"
                            />
                            <span className="text-chocolate">Нужно размещение</span>
                          </label>
                        </div>

                        {/* Комментарий */}
                        <div>
                          <label className="text-chocolate font-medium block mb-2">
                            Хотите что-то добавить?
                          </label>
                          <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({...formData, comment: e.target.value})}
                            placeholder="Любые пожелания"
                            rows={2}
                            className="w-full p-3 border border-cream rounded-lg focus:border-olive outline-none resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={formData.attending === null}
                      className="w-full py-3 bg-marsala text-white rounded-lg font-medium hover:bg-marsala/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Отправить
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-5xl mb-4">
                    {formData.attending ? '💚' : '💔'}
                  </div>
                  <h2 className="font-serif text-2xl text-chocolate mb-2">
                    {formData.attending ? 'Спасибо!' : 'Жаль...'}
                  </h2>
                  <p className="text-chocolate/70">
                    {formData.attending 
                      ? 'Мы очень рады, что вы будете с нами!'
                      : 'Будем скучать. Может ещё передумаете?'
                    }
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