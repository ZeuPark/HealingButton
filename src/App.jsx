import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { messages, emotions } from './data/messages'
import './App.css'

function App() {
  const [view, setView] = useState('question')
  const [currentMessage, setCurrentMessage] = useState('')

  const getRandomMessage = useCallback((emotionId) => {
    const emotionMessages = messages[emotionId]
    const randomIndex = Math.floor(Math.random() * emotionMessages.length)
    return emotionMessages[randomIndex]
  }, [])

  const handleEmotionClick = useCallback((emotionId) => {
    const message = getRandomMessage(emotionId)
    setCurrentMessage(message)
    setView('message')
  }, [getRandomMessage])

  const handleBack = useCallback(() => {
    setView('question')
  }, [])

  return (
    <main className="container">
      <AnimatePresence mode="wait">
        {view === 'question' ? (
          <motion.section
            key="question"
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className="question">지금 무슨 느낌이야?</h1>
            <div className="buttons">
              {emotions.map((emotion) => (
                <motion.button
                  key={emotion.id}
                  className="emotion-btn"
                  onClick={() => handleEmotionClick(emotion.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {emotion.label}
                </motion.button>
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="message"
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.p
              className="comfort-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {currentMessage}
            </motion.p>
            <motion.button
              className="back-btn"
              onClick={handleBack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              돌아가기
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
