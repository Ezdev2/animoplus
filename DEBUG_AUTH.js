// Script de debug pour l'authentification
console.log('🔍 DEBUG AUTHENTIFICATION')

// 1. Vérifier localStorage
console.log('\n1️⃣ localStorage:')
const data = localStorage.getItem('data')
console.log('data:', data)

if (data) {
  try {
    const parsed = JSON.parse(data)
    console.log('parsed:', {
      hasToken: !!parsed.token,
      hasUser: !!parsed.user,
      userName: parsed.user?.name,
      userType: parsed.user?.user_type,
      userRole: parsed.user?.role
    })
  } catch (error) {
    console.error('Erreur parsing:', error)
  }
}

// 2. Vérifier les anciennes clés
console.log('\n2️⃣ Anciennes clés:')
const oldKeys = ['token', 'refresh_token', 'user_data', 'animoplus_user_data']
oldKeys.forEach(key => {
  const value = localStorage.getItem(key)
  if (value) {
    console.log(`${key}:`, value.substring(0, 50) + '...')
  }
})

// 3. Vérifier la route actuelle
console.log('\n3️⃣ Route actuelle:', window.location.pathname)

// 4. Simuler le guard
console.log('\n4️⃣ Simulation du guard:')
const currentPath = window.location.pathname
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']
const PROTECTED_ROUTES = ['/dashboard', '/profil', '/profile', '/animals', '/appointments']

const isPublicRoute = PUBLIC_ROUTES.some(route => currentPath.startsWith(route))
const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route))

console.log({
  currentPath,
  isPublicRoute,
  isProtectedRoute,
  hasAuthData: !!data
})

if (data) {
  const parsed = JSON.parse(data)
  const isAuth = !!(parsed.token && parsed.user && parsed.user.id)
  
  console.log('Logique du guard:')
  if (isAuth && isPublicRoute) {
    console.log('✅ Connecté sur page publique → Devrait rediriger vers /dashboard')
  } else if (!isAuth && isProtectedRoute) {
    console.log('❌ Non connecté sur page protégée → Devrait rediriger vers /login')
  } else {
    console.log('✅ Accès autorisé')
  }
}
