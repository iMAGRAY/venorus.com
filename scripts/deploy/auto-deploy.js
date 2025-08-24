#!/usr/bin/env node

const { exec } = require('child_process')
const fs = require('fs').promises
const path = require('path')

// Логирование деплойментов
const DEPLOY_LOG_FILE = path.join(process.cwd(), 'logs', 'deploy.log')

async function log(message) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}\n`
  
  try {
    // Создаем директорию logs если не существует
    await fs.mkdir(path.dirname(DEPLOY_LOG_FILE), { recursive: true })
    await fs.appendFile(DEPLOY_LOG_FILE, logMessage)
  } catch (error) {
    console.error('Failed to write log:', error.message)
  }
  
  console.log(message)
}

function execAsync(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}

async function runCommand(command, description) {
  await log(`🔄 ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(command, { 
      cwd: process.cwd(),
      timeout: 120000 // 2 минуты на команду
    })
    
    if (stdout) await log(`✅ ${description} completed`)
    if (stderr) await log(`⚠️ ${description} stderr: ${stderr}`)
    
    return { success: true, stdout, stderr }
  } catch (error) {
    await log(`❌ ${description} failed: ${error.message}`)
    throw error
  }
}

async function deployApplication() {
  const startTime = Date.now()
  await log('🚀 ===== STARTING AUTOMATIC DEPLOYMENT =====')
  
  try {
    // 1. Останавливаем текущие процессы Node.js на порту 3010
    try {
      await runCommand('node scripts/kill-port.js 3010', 'Stopping processes on port 3010')
    } catch (error) {
      await log('⚠️ Port cleanup failed, continuing deployment')
    }

    // 2. Получаем последние изменения из Git
    await runCommand('git fetch origin', 'Fetching latest changes')
    await runCommand('git reset --hard origin/main', 'Resetting to latest main')
    
    // 3. Очищаем node_modules для предотвращения permission issues
    try {
      // Проверяем наличие rimraf, если нет - устанавливаем
      try {
        await runCommand('npx rimraf node_modules', 'Cleaning node_modules')
      } catch (rimrafError) {
        await log('⚠️ rimraf failed, trying manual removal')
        await runCommand('rm -rf node_modules', 'Manual node_modules removal')
      }
    } catch (error) {
      await log('⚠️ node_modules cleanup failed, continuing with npm install')
    }
    
    // 4. Устанавливаем зависимости с обходом permission issues
    try {
      await runCommand('npm install --no-optional --prefer-offline', 'Installing dependencies with optimizations')
    } catch (error) {
      await log('⚠️ Optimized npm install failed, trying fallback')
      await runCommand('npm install', 'Installing dependencies (fallback)')
    }
    
    // 5. Собираем проект
    await runCommand('npm run build', 'Building application')
    
    // 4. Проверяем линтинг (не критично для деплоя)
    try {
      await runCommand('npm run lint', 'Running linting')
    } catch (error) {
      await log('⚠️ Linting failed, but continuing deployment')
    }
    
    // 5. Перезапускаем PM2 процесс (если используется)
    try {
      await runCommand('pm2 restart venorus', 'Restarting PM2 process')
    } catch (error) {
      await log('⚠️ PM2 restart failed, process might not be managed by PM2')
    }
    
    // 6. Очищаем кеш Next.js
    try {
      await runCommand('npm run clean', 'Cleaning Next.js cache')
    } catch (error) {
      await log('⚠️ Cache cleaning failed, but continuing')
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    await log(`🎉 ===== DEPLOYMENT COMPLETED SUCCESSFULLY in ${duration}s =====`)
    
    return { success: true, duration }
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    await log(`💥 ===== DEPLOYMENT FAILED after ${duration}s =====`)
    await log(`Error: ${error.message}`)
    
    // Пытаемся откатиться назад
    try {
      await log('🔄 Attempting rollback...')
      await runCommand('git reset --hard HEAD~1', 'Rolling back to previous commit')
      await log('✅ Rollback completed')
    } catch (rollbackError) {
      await log(`❌ Rollback failed: ${rollbackError.message}`)
    }
    
    throw error
  }
}

// Запускаем деплойment
if (require.main === module) {
  deployApplication()
    .then((result) => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Deployment failed:', error.message)
      process.exit(1)
    })
}

module.exports = { deployApplication }