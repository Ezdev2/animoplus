// Utilitaires pour la gestion des avatars par défaut

// Couleurs pour les avatars par défaut
const AVATAR_COLORS = [
  { bg: '#E5E7EB', icon: '#9CA3AF' }, // Gris (par défaut)
  { bg: '#DBEAFE', icon: '#3B82F6' }, // Bleu
  { bg: '#D1FAE5', icon: '#10B981' }, // Vert
  { bg: '#FEE2E2', icon: '#EF4444' }, // Rouge
  { bg: '#FEF3C7', icon: '#F59E0B' }, // Jaune
  { bg: '#E0E7FF', icon: '#8B5CF6' }, // Violet
  { bg: '#FCE7F3', icon: '#EC4899' }, // Rose
  { bg: '#F0FDF4', icon: '#22C55E' }, // Vert clair
]

// Générer un avatar SVG par défaut avec couleur basée sur l'ID utilisateur
export const generateDefaultAvatar = (userId = null, size = 130) => {
  let colorIndex = 0
  
  // Si on a un ID utilisateur, utiliser un hash simple pour choisir la couleur
  if (userId) {
    const hash = userId.toString().split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    colorIndex = hash % AVATAR_COLORS.length
  }
  
  const colors = AVATAR_COLORS[colorIndex]
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cercle de fond -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${colors.bg}"/>
      
      <!-- Icône utilisateur -->
      <g transform="translate(${size*0.25}, ${size*0.19})">
        <!-- Tête -->
        <circle cx="${size*0.25}" cy="${size*0.19}" r="${size*0.14}" fill="${colors.icon}"/>
        
        <!-- Corps -->
        <path d="M${size*0.08} ${size*0.62} C${size*0.08} ${size*0.46}, ${size*0.15} ${size*0.38}, ${size*0.25} ${size*0.38} C${size*0.35} ${size*0.38}, ${size*0.42} ${size*0.46}, ${size*0.42} ${size*0.62} L${size*0.42} ${size*0.65} L${size*0.08} ${size*0.65} Z" fill="${colors.icon}"/>
      </g>
    </svg>
  `)}`
}

// Générer un avatar avec initiales
export const generateInitialsAvatar = (name = '', userId = null, size = 130) => {
  let colorIndex = 0
  
  // Si on a un ID utilisateur, utiliser un hash simple pour choisir la couleur
  if (userId) {
    const hash = userId.toString().split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)
    colorIndex = hash % AVATAR_COLORS.length
  }
  
  const colors = AVATAR_COLORS[colorIndex]
  
  // Extraire les initiales
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
  
  const fontSize = size * 0.4
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cercle de fond -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${colors.bg}"/>
      
      <!-- Initiales -->
      <text x="${size/2}" y="${size/2 + fontSize/3}" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="600" 
            text-anchor="middle" 
            fill="${colors.icon}">
        ${initials || '?'}
      </text>
    </svg>
  `)}`
}

// Fonction principale pour obtenir l'avatar d'un utilisateur
export const getUserAvatar = (user, size = 130) => {
  // Si l'utilisateur a un avatar personnalisé, l'utiliser
  if (user?.avatar && user.avatar.trim() !== '') {
    return user.avatar
  }
  
  // Sinon, générer un avatar avec initiales si on a un nom
  if (user?.name && user.name.trim() !== '') {
    return generateInitialsAvatar(user.name, user.id, size)
  }
  
  // En dernier recours, avatar par défaut
  return generateDefaultAvatar(user?.id, size)
}

// Vérifier si une URL d'avatar est valide
export const isValidAvatarUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  // Vérifier si c'est une URL data (avatar généré)
  if (url.startsWith('data:image/')) return true
  
  // Vérifier si c'est une URL HTTP/HTTPS valide
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export default {
  generateDefaultAvatar,
  generateInitialsAvatar,
  getUserAvatar,
  isValidAvatarUrl
}
