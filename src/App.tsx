import { useState, useEffect } from 'react'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Progress } from './components/ui/progress'
import { Badge } from './components/ui/badge'
import { Heart, Book, Music, Users, ArrowLeft, X, Droplets, Apple } from 'lucide-react'
import { BabyLion } from './components/BabyLion'
import { getGrowthStage, getGrowthMessage } from './utils/petHelpers'

interface PetStats {
  faith: number
  joy: number
  love: number
  peace: number
  food: number
  water: number
}

interface DevotionalContent {
  title: string
  verse: string
  content: string
  image: string
}

const devotionals: DevotionalContent[] = [
  {
    title: "Light in Darkness",
    verse: "John 1:5",
    content: "The light shines in the darkness, and the darkness has not overcome it.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
  },
  {
    title: "God's Love",
    verse: "1 John 4:19",
    content: "We love because he first loved us. God's love fills our hearts with joy.",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop"
  },
  {
    title: "Be Kind",
    verse: "Ephesians 4:32",
    content: "Be kind to one another, tenderhearted, forgiving one another.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop"
  }
]

function App() {
  const [petStats, setPetStats] = useState<PetStats>({
    faith: 75,
    joy: 80,
    love: 85,
    peace: 70,
    food: 60,
    water: 50
  })
  
  const [currentDevotional, setCurrentDevotional] = useState(0)
  const [showDevotional, setShowDevotional] = useState(false)
  const [petName] = useState("Leo")
  const [streak, setStreak] = useState(3)
  const [petMood, setPetMood] = useState("happy")
  const [lastActivity, setLastActivity] = useState<Date>(new Date())
  const [petAnimation, setPetAnimation] = useState("idle")
  const [growthStage, setGrowthStage] = useState<'newborn' | 'playful' | 'growing' | 'flourishing' | 'mature'>('newborn')

  // Check if pet should be sad due to inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const now = new Date()
      const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastActivity > 24) {
        setPetMood("very-sad")
      } else if (hoursSinceLastActivity > 12) {
        setPetMood("sad")
      }
    }

    const interval = setInterval(checkInactivity, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [lastActivity])

  // Update pet mood and growth stage based on stats
  useEffect(() => {
    const avgStats = (petStats.faith + petStats.joy + petStats.love + petStats.peace) / 4
    const avgNeeds = (petStats.food + petStats.water) / 2
    const overallHealth = (avgStats + avgNeeds) / 2

    if (overallHealth > 85) setPetMood("very-happy")
    else if (overallHealth > 70) setPetMood("happy")
    else if (overallHealth > 50) setPetMood("neutral")
    else if (overallHealth > 30) setPetMood("sad")
    else setPetMood("very-sad")

    // Update growth stage based on faith level
    const newGrowthStage = getGrowthStage(petStats.faith)
    if (newGrowthStage !== growthStage) {
      setGrowthStage(newGrowthStage)
      // Celebrate growth!
      if (newGrowthStage !== 'newborn') {
        setPetAnimation("celebrate")
        setTimeout(() => setPetAnimation("idle"), 3000)
      }
    }
  }, [growthStage, petStats])

  // Decrease food and water over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPetStats(prev => ({
        ...prev,
        food: Math.max(0, prev.food - 1),
        water: Math.max(0, prev.water - 1)
      }))
    }, 30000) // Decrease every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleActivity = (activity: string) => {
    setPetStats(prev => {
      const newStats = { ...prev }
      switch (activity) {
        case 'pray':
          newStats.faith = Math.min(100, prev.faith + 10)
          newStats.peace = Math.min(100, prev.peace + 8)
          break
        case 'read':
          newStats.faith = Math.min(100, prev.faith + 8)
          newStats.joy = Math.min(100, prev.joy + 6)
          // Reading gives food and water
          newStats.food = Math.min(100, prev.food + 15)
          newStats.water = Math.min(100, prev.water + 10)
          break
        case 'sing':
          newStats.joy = Math.min(100, prev.joy + 12)
          newStats.love = Math.min(100, prev.love + 5)
          break
        case 'help':
          newStats.love = Math.min(100, prev.love + 10)
          newStats.peace = Math.min(100, prev.peace + 6)
          break
      }
      return newStats
    })
    
    setLastActivity(new Date())
    setPetAnimation("bounce")
    setTimeout(() => setPetAnimation("idle"), 1000)
  }

  const handleDevotionalComplete = () => {
    setShowDevotional(false)
    handleActivity('read')
    setStreak(prev => prev + 1)
    
    // Devotional completion gives extra food and water
    setPetStats(prev => ({
      ...prev,
      food: Math.min(100, prev.food + 25),
      water: Math.min(100, prev.water + 20)
    }))
    
    setPetAnimation("celebrate")
    setTimeout(() => setPetAnimation("idle"), 2000)
  }



  const getMoodMessage = () => {
    switch (petMood) {
      case "very-happy":
        return "Leo is glowing with joy! ✨"
      case "happy":
        return "Leo is happy and content! 😊"
      case "neutral":
        return "Leo is doing okay."
      case "sad":
        return "Leo misses you... 😔"
      case "very-sad":
        return "Leo is very sad and hungry... 😢"
      default:
        return "Leo is waiting for you!"
    }
  }

  const getContainerAnimation = () => {
    if (petMood === "very-sad" || petMood === "sad") {
      return "animate-pulse"
    }
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-300 via-orange-400 to-orange-500 relative overflow-hidden">
      {/* Background Savanna */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-orange-800 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-48 bg-orange-700 rounded-tr-full"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-56 bg-orange-700 rounded-tl-full"></div>
        {/* Acacia tree silhouette */}
        <div className="absolute bottom-16 right-8 w-16 h-32 bg-orange-800 opacity-50 rounded-full"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <h1 className="text-xl font-semibold">Bible Lion</h1>
          <div className="w-8"></div>
        </div>

        {/* Pet Display */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          {/* Pet Name Badge */}
          <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200 px-3 py-1">
            {petName} the Lion
          </Badge>

          {/* Pet Character */}
          <div className={`relative mb-4 ${getContainerAnimation()}`}>
            <div 
              className="w-40 h-40 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center shadow-lg mb-4 border-4 border-yellow-300 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => {
                if (petAnimation === "idle") {
                  setPetAnimation("play")
                  setTimeout(() => setPetAnimation("idle"), 2000)
                }
              }}
            >
              <BabyLion 
                mood={petMood as 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad'}
                animation={petAnimation}
                growthStage={growthStage}
                faithLevel={petStats.faith}
              />
            </div>
            {/* Bible Book */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-amber-800 text-white px-2 py-1 rounded text-xs font-medium">
                HOLY BIBLE
              </div>
            </div>
          </div>

          {/* Growth Stage Message */}
          <div className="text-white text-center mb-2 font-medium">
            {getGrowthMessage(growthStage)}
          </div>

          {/* Mood Message */}
          <div className="text-white text-center mb-4 font-medium text-sm opacity-90">
            {getMoodMessage()}
          </div>

          {/* Food and Water Meters */}
          <div className="w-full max-w-xs space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Apple className="w-4 h-4 text-red-300" />
                Food
              </span>
              <span className="text-white text-sm">{petStats.food}%</span>
            </div>
            <Progress value={petStats.food} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-300" />
                Water
              </span>
              <span className="text-white text-sm">{petStats.water}%</span>
            </div>
            <Progress value={petStats.water} className="h-2" />
          </div>

          {/* Stats Display */}
          <div className="w-full max-w-xs space-y-3 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-300" />
                Faith
              </span>
              <span className="text-white text-sm">{petStats.faith}%</span>
            </div>
            <Progress value={petStats.faith} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <span className="text-yellow-300">😊</span>
                Joy
              </span>
              <span className="text-white text-sm">{petStats.joy}%</span>
            </div>
            <Progress value={petStats.joy} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <span className="text-pink-300">💝</span>
                Love
              </span>
              <span className="text-white text-sm">{petStats.love}%</span>
            </div>
            <Progress value={petStats.love} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <span className="text-blue-300">🕊️</span>
                Peace
              </span>
              <span className="text-white text-sm">{petStats.peace}%</span>
            </div>
            <Progress value={petStats.peace} className="h-2" />
          </div>

          {/* Activity Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
            <Button 
              onClick={() => handleActivity('pray')}
              className="bg-white/90 text-orange-700 hover:bg-white flex flex-col items-center gap-1 h-16"
            >
              <span className="text-lg">🙏</span>
              <span className="text-xs">Pray</span>
            </Button>
            <Button 
              onClick={() => handleActivity('read')}
              className="bg-white/90 text-orange-700 hover:bg-white flex flex-col items-center gap-1 h-16"
            >
              <Book className="w-5 h-5" />
              <span className="text-xs">Read</span>
            </Button>
            <Button 
              onClick={() => handleActivity('sing')}
              className="bg-white/90 text-orange-700 hover:bg-white flex flex-col items-center gap-1 h-16"
            >
              <Music className="w-5 h-5" />
              <span className="text-xs">Sing</span>
            </Button>
            <Button 
              onClick={() => handleActivity('help')}
              className="bg-white/90 text-orange-700 hover:bg-white flex flex-col items-center gap-1 h-16"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Help</span>
            </Button>
          </div>

          {/* Daily Devotional Button */}
          <Button 
            onClick={() => setShowDevotional(true)}
            className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-3 rounded-xl font-medium shadow-lg"
          >
            📖 Feed Leo with God's Word
          </Button>

          {/* Streak Counter */}
          <div className="mt-4 text-center">
            <div className="text-white text-sm">
              🔥 {streak} day streak!
            </div>
            {streak > 7 && (
              <div className="text-yellow-300 text-xs mt-1">
                ⭐ Amazing dedication!
              </div>
            )}
          </div>
        </div>

        {/* Devotional Modal */}
        {showDevotional && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-50">
            <Card className="w-full rounded-t-3xl rounded-b-none max-h-[80vh] overflow-hidden">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-amber-800">
                    {devotionals[currentDevotional].title}
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDevotional(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="px-4 py-2">
                  <div className="w-full bg-amber-200 rounded-full h-1">
                    <div className="bg-amber-500 h-1 rounded-full w-1/3"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  <div 
                    className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-center p-4"
                    style={{
                      backgroundImage: `url(${devotionals[currentDevotional].image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="bg-black/30 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-sm font-medium">
                        {devotionals[currentDevotional].content}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      {devotionals[currentDevotional].verse}
                    </Badge>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-orange-800">
                      🦁 Leo is excited to hear God's Word! Reading will give him food and water.
                    </p>
                  </div>
                </div>

                {/* Bottom Button */}
                <div className="p-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 py-3 rounded-xl font-medium"
                    onClick={handleDevotionalComplete}
                  >
                    🍯 Feed Leo & Complete Reading
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default App