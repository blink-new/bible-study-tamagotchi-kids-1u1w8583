// Helper function to determine growth stage based on faith level
export function getGrowthStage(faithLevel: number): 'newborn' | 'playful' | 'growing' | 'flourishing' | 'mature' {
  if (faithLevel < 20) return 'newborn'
  if (faithLevel < 40) return 'playful'
  if (faithLevel < 60) return 'growing'
  if (faithLevel < 80) return 'flourishing'
  return 'mature'
}

// Helper function to get encouraging messages based on growth stage
export function getGrowthMessage(stage: 'newborn' | 'playful' | 'growing' | 'flourishing' | 'mature'): string {
  switch (stage) {
    case 'newborn':
      return "Your little lion is just beginning their faith journey! 🍼"
    case 'playful':
      return "Leo is getting more playful and curious about God's word! 🎾"
    case 'growing':
      return "Look! Leo is growing stronger in faith! 🌱"
    case 'flourishing':
      return "Leo is flourishing with joy and wisdom! 🌟"
    case 'mature':
      return "Leo has become a wise and gentle lion of faith! 👑"
  }
}