import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { steps } from './data/steps'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState('steps') // 'steps' | 'loading' | 'message'

  const handleOptionClick = useCallback(async (stepId, optionLabel) => {
    const newAnswers = { ...answers, [stepId]: optionLabel }
    setAnswers(newAnswers)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 마지막 스텝 - API 호출
      setView('loading')
      setIsLoading(true)

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emotion: newAnswers.emotion,
            situation: newAnswers.situation,
            desire: newAnswers.desire,
          }),
        })

        if (!response.ok) throw new Error('API error')

        const data = await response.json()
        setMessage(data.message)
        setView('message')
      } catch (error) {
        console.error('Error:', error)
        setMessage('지금은 말이 잘 안 떠올라.\n그래도 네가 여기 온 건 알아.')
        setView('message')
      } finally {
        setIsLoading(false)
      }
    }
  }, [answers, currentStep])

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setMessage('')
    setView('steps')
  }, [])

  const step = steps[currentStep]
  const progress = ((currentStep) / steps.length) * 100

  return (
    <main className="container">
      <AnimatePresence mode="wait">
        {view === 'steps' && (
          <motion.section
            key={`step-${currentStep}`}
            className="section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <h1 className="question">{step.question}</h1>

            <div className="buttons">
              {step.options.map((option) => (
                <motion.button
                  key={option.id}
                  className="emotion-btn"
                  onClick={() => handleOptionClick(step.id, option.label)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            {currentStep > 0 && (
              <motion.button
                className="back-btn"
                onClick={handleBack}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                이전으로
              </motion.button>
            )}
          </motion.section>
        )}

        {view === 'loading' && (
          <motion.section
            key="loading"
            className="section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading">
              <motion.div
                className="loading-dot"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <p className="loading-text">잠깐만</p>
            </div>
          </motion.section>
        )}

        {view === 'message' && (
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
              {message}
            </motion.p>
            <motion.button
              className="back-btn"
              onClick={handleReset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              처음으로
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
