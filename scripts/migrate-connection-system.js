#!/usr/bin/env node

/**
 * Script de migration automatique pour le nouveau système de gestion de connexion
 * Usage: node scripts/migrate-connection-system.js
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Début de la migration du système de connexion...\n')

// Configuration
const srcDir = path.join(__dirname, '..', 'src')
const backupDir = path.join(__dirname, '..', 'backup-' + Date.now())

// Étape 1: Créer une sauvegarde
console.log('📦 Création d\'une sauvegarde...')
try {
  fs.mkdirSync(backupDir, { recursive: true })
  execSync(`cp -r ${srcDir} ${backupDir}/`, { stdio: 'inherit' })
  console.log('✅ Sauvegarde créée dans:', backupDir)
} catch (error) {
  console.error('❌ Erreur lors de la sauvegarde:', error.message)
  process.exit(1)
}

// Étape 2: Rechercher et remplacer les imports
console.log('\n🔍 Recherche des fichiers à migrer...')

const findFiles = (dir, extensions = ['.js', '.vue', '.ts']) => {
  const files = []
  
  const scanDir = (currentDir) => {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDir(fullPath)
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  }
  
  scanDir(dir)
  return files
}

const filesToMigrate = findFiles(srcDir)
console.log(`📄 ${filesToMigrate.length} fichiers trouvés`)

// Étape 3: Effectuer les remplacements
console.log('\n🔄 Migration des imports...')

let migratedFiles = 0
const migrations = [
  {
    from: /from\s+['"]@\/services\/api\/config\.js['"]/g,
    to: "from '@/services/api/configImproved.js'",
    description: 'Configuration API améliorée'
  },
  {
    from: /import\s+{\s*apiClient\s*}\s+from\s+['"]@\/services\/api\/config\.js['"]/g,
    to: "import { apiClient } from '@/services/api/configImproved.js'",
    description: 'Import apiClient'
  }
]

for (const file of filesToMigrate) {
  try {
    let content = fs.readFileSync(file, 'utf8')
    let hasChanges = false
    
    for (const migration of migrations) {
      if (migration.from.test(content)) {
        content = content.replace(migration.from, migration.to)
        hasChanges = true
        console.log(`  ✅ ${path.relative(srcDir, file)}: ${migration.description}`)
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content, 'utf8')
      migratedFiles++
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la migration de ${file}:`, error.message)
  }
}

console.log(`\n📊 ${migratedFiles} fichiers migrés`)

// Étape 4: Vérifier les fichiers critiques
console.log('\n🔍 Vérification des fichiers critiques...')

const criticalFiles = [
  'src/main.js',
  'src/App.vue',
  'src/stores/authPinia.js'
]

const checkCriticalFile = (filePath) => {
  const fullPath = path.join(__dirname, '..', filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${filePath} n'existe pas`)
    return false
  }
  
  const content = fs.readFileSync(fullPath, 'utf8')
  
  // Vérifications spécifiques
  if (filePath === 'src/main.js') {
    if (!content.includes('connectionManager')) {
      console.log(`⚠️  ${filePath}: Plugin connectionManager non intégré`)
      return false
    }
  }
  
  if (filePath === 'src/App.vue') {
    if (!content.includes('ConnectionStatusBanner') && !content.includes('ConnectionToast')) {
      console.log(`⚠️  ${filePath}: Composants de connexion non intégrés`)
      return false
    }
  }
  
  console.log(`✅ ${filePath}: OK`)
  return true
}

let allCriticalOk = true
for (const file of criticalFiles) {
  if (!checkCriticalFile(file)) {
    allCriticalOk = false
  }
}

// Étape 5: Générer un rapport de migration
console.log('\n📋 Génération du rapport de migration...')

const report = {
  timestamp: new Date().toISOString(),
  backupLocation: backupDir,
  migratedFiles: migratedFiles,
  totalFiles: filesToMigrate.length,
  criticalFilesOk: allCriticalOk,
  nextSteps: [
    'Vérifier que l\'application se compile sans erreurs',
    'Tester les fonctionnalités de connexion',
    'Vérifier l\'affichage des notifications',
    'Tester les scénarios de déconnexion',
    'Supprimer la sauvegarde si tout fonctionne'
  ]
}

const reportPath = path.join(__dirname, '..', 'migration-report.json')
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

console.log('📄 Rapport de migration généré:', reportPath)

// Étape 6: Instructions finales
console.log('\n🎯 Migration terminée!')
console.log('\n📋 Prochaines étapes:')
console.log('1. Vérifiez que l\'application se compile: npm run dev')
console.log('2. Testez les fonctionnalités de connexion')
console.log('3. Vérifiez l\'affichage des notifications')
console.log('4. Consultez le guide d\'intégration: INTEGRATION_GUIDE.md')

if (!allCriticalOk) {
  console.log('\n⚠️  ATTENTION: Certains fichiers critiques nécessitent une attention manuelle')
  console.log('Consultez le guide d\'intégration pour les étapes manuelles')
}

console.log('\n💾 Sauvegarde disponible dans:', backupDir)
console.log('Supprimez-la une fois que tout fonctionne correctement')

console.log('\n✨ Migration terminée avec succès!')
