import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BabyLionProps {
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad'
  animation: 'idle' | 'bounce' | 'celebrate' | 'sleep' | 'play'
  growthStage: 'newborn' | 'playful' | 'growing' | 'flourishing' | 'mature'
  faithLevel: number
}

export function BabyLion({ mood, animation, growthStage }: BabyLionProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(blinkInterval)
  }, [])

  // Sparkle effects for very happy mood
  useEffect(() => {
    if (mood === 'very-happy' || animation === 'celebrate') {
      const sparkleInterval = setInterval(() => {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100
        }
        setSparkles(prev => [...prev.slice(-4), newSparkle])
      }, 300)

      return () => clearInterval(sparkleInterval)
    } else {
      setSparkles([])
    }
  }, [mood, animation])

  // Remove old sparkles
  useEffect(() => {
    if (sparkles.length > 0) {
      const cleanup = setTimeout(() => {
        setSparkles(prev => prev.slice(1))
      }, 1000)
      return () => clearTimeout(cleanup)
    }
  }, [sparkles])

  const getSize = () => {
    switch (growthStage) {
      case 'newborn': return { body: 'w-12 h-12', head: 'w-10 h-10' }
      case 'playful': return { body: 'w-16 h-16', head: 'w-12 h-12' }
      case 'growing': return { body: 'w-20 h-20', head: 'w-16 h-16' }
      case 'flourishing': return { body: 'w-24 h-24', head: 'w-18 h-18' }
      case 'mature': return { body: 'w-28 h-28', head: 'w-20 h-20' }
    }
  }

  const getBodyColor = () => {
    if (mood === 'very-sad') return 'from-amber-300 to-amber-400'
    if (mood === 'sad') return 'from-amber-400 to-amber-500'
    return 'from-amber-500 to-orange-400'
  }

  const getHeadColor = () => {
    if (mood === 'very-sad') return 'from-amber-400 to-amber-500'
    if (mood === 'sad') return 'from-amber-500 to-amber-600'
    return 'from-amber-600 to-orange-500'
  }

  const getContainerAnimation = () => {
    switch (animation) {
      case 'bounce':
        return { y: [-5, 5, -5], transition: { duration: 0.6, repeat: 3 } }
      case 'celebrate':
        return { 
          scale: [1, 1.1, 1], 
          rotate: [0, -5, 5, 0], 
          transition: { duration: 0.8, repeat: 2 } 
        }
      case 'play':
        return { x: [-2, 2, -2], transition: { duration: 0.8, repeat: Infinity } }
      default:
        return {}
    }
  }

  const sizes = getSize()

  return (
    <div className="relative">
      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute text-yellow-300 text-xs pointer-events-none z-20"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main lion container */}
      <motion.div
        className="relative flex flex-col items-center"
        animate={getContainerAnimation()}
      >
        {/* Body */}
        <motion.div
          className={`${sizes.body} bg-gradient-to-br ${getBodyColor()} rounded-full relative overflow-hidden shadow-lg`}
          animate={{
            scale: [1, 1.02, 1],
            rotate: animation === 'celebrate' ? [0, -5, 5, -5, 0] : 0
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 0.5, repeat: animation === 'celebrate' ? 3 : 0 }
          }}
        >
          {/* Body texture */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
          {/* Belly spot */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-amber-200 rounded-full opacity-60" />
        </motion.div>
        
        {/* Head */}
        <motion.div
          className={`${sizes.head} bg-gradient-to-br ${getHeadColor()} rounded-full relative -mt-4 mx-auto shadow-md z-10`}
          animate={{
            y: animation === 'bounce' ? [-2, 2, -2] : 0,
            rotate: animation === 'play' ? [0, -10, 10, 0] : 0
          }}
          transition={{
            y: { duration: 0.6, repeat: animation === 'bounce' ? Infinity : 0 },
            rotate: { duration: 1, repeat: animation === 'play' ? Infinity : 0 }
          }}
        >
          {/* Mane for growing stages */}
          {(growthStage === 'growing' || growthStage === 'flourishing' || growthStage === 'mature') && (
            <motion.div
              className={`absolute -inset-1 bg-gradient-to-br from-amber-700 to-orange-600 rounded-full -z-10 ${
                growthStage === 'growing' ? 'opacity-30' :
                growthStage === 'flourishing' ? 'opacity-60' : 'opacity-80'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}

          {/* Full mane for mature lion */}
          {growthStage === 'mature' && (
            <motion.div
              className="absolute -inset-2 bg-gradient-to-br from-amber-800 to-orange-700 rounded-full -z-20 opacity-40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          )}

          {/* Face features */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-1 mb-1">
              <motion.div
                className="w-1.5 h-1.5 bg-black rounded-full"
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
                  y: mood === 'sad' || mood === 'very-sad' ? 1 : 0
                }}
                transition={{ duration: 0.1 }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-black rounded-full"
                animate={{
                  scaleY: isBlinking ? 0.1 : 1,
                  y: mood === 'sad' || mood === 'very-sad' ? 1 : 0
                }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Nose */}
            <div className="w-1 h-0.5 bg-pink-400 rounded-full mb-0.5" />

            {/* Mouth */}
            <motion.div
              className={`w-2 h-0.5 border-b border-black ${
                mood === 'very-happy' || mood === 'happy' ? 'rounded-b-full' :
                mood === 'sad' || mood === 'very-sad' ? 'rounded-t-full rotate-180' : ''
              }`}
              animate={{
                scaleX: mood === 'very-happy' ? 1.2 : 1
              }}
            />
          </div>

          {/* Ears */}
          <div className="absolute -top-0.5 left-0.5 w-2 h-2 bg-amber-600 rounded-full transform -rotate-45" />
          <div className="absolute -top-0.5 right-0.5 w-2 h-2 bg-amber-600 rounded-full transform rotate-45" />
          
          {/* Inner ears */}
          <div className="absolute -top-0.5 left-1 w-1 h-1 bg-pink-300 rounded-full transform -rotate-45" />
          <div className="absolute -top-0.5 right-1 w-1 h-1 bg-pink-300 rounded-full transform rotate-45" />
        </motion.div>
        
        {/* Paws */}
        <div className="flex justify-between w-full px-1 -mt-1">
          <motion.div
            className="w-2 h-1.5 bg-amber-700 rounded-full"
            animate={{
              rotate: animation === 'play' ? [-10, 10, -10] : 0
            }}
            transition={{ duration: 0.8, repeat: animation === 'play' ? Infinity : 0 }}
          />
          <motion.div
            className="w-2 h-1.5 bg-amber-700 rounded-full"
            animate={{
              rotate: animation === 'play' ? [10, -10, 10] : 0
            }}
            transition={{ duration: 0.8, repeat: animation === 'play' ? Infinity : 0, delay: 0.2 }}
          />
        </div>
        
        {/* Tail */}
        <motion.div
          className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-gradient-to-t from-amber-600 to-amber-500 rounded-full origin-bottom"
          animate={{
            rotate: animation === 'play' ? [0, 30, -30, 0] : [0, 5, -5, 0],
            scale: animation === 'celebrate' ? [1, 1.1, 1] : 1
          }}
          transition={{
            rotate: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.3, repeat: animation === 'celebrate' ? 3 : 0 }
          }}
        >
          {/* Tail tuft for older lions */}
          {(growthStage === 'flourishing' || growthStage === 'mature') && (
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-800 rounded-full" />
          )}
        </motion.div>

        {/* Shadow */}
        <motion.div
          className="absolute -bottom-1 w-12 h-3 bg-black/20 rounded-full blur-sm"
          animate={{
            scaleX: animation === 'bounce' ? [1, 1.2, 1] : 1,
            opacity: animation === 'bounce' ? [0.2, 0.3, 0.2] : 0.2
          }}
          transition={{ duration: 0.6, repeat: animation === 'bounce' ? 3 : 0 }}
        />
      </motion.div>

      {/* Growth stage indicator */}
      {growthStage === 'mature' && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          👑
        </motion.div>
      )}
    </div>
  )
}

