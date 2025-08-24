#!/usr/bin/env node

/**
 * Скрипт для ручного триггера развертывания через webhook
 * Использует HMAC-SHA256 подпись как GitHub
 */

const crypto = require('crypto')
const https = require('https')

// Конфигурация
const WEBHOOK_URL = 'https://venorus.net/api/webhook/github'
const WEBHOOK_SECRET = 'your-webhook-secret'

// Создаем тестовую payload как от GitHub
const payload = JSON.stringify({
  ref: 'refs/heads/main',
  after: '31e8920', // Исправленная сборка webpack
  head_commit: {
    id: '31e8920',
    message: 'Исправить ошибки сборки webpack для успешного развертывания',
    author: {
      name: 'Claude Code',
      email: 'noreply@anthropic.com'
    }
  },
  repository: {
    name: 'venorus.com',
    full_name: 'iMAGRAY/venorus.com'
  }
})

// Генерируем HMAC подпись
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payload)
  .digest('hex')

// Настройки запроса
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'X-Hub-Signature-256': `sha256=${signature}`,
    'X-GitHub-Event': 'push',
    'User-Agent': 'GitHub-Hookshot/webhook-trigger'
  }
}

console.log('🚀 Отправляем webhook запрос на развертывание...')
console.log(`URL: ${WEBHOOK_URL}`)
console.log(`Payload size: ${Buffer.byteLength(payload)} bytes`)
console.log(`Signature: sha256=${signature}`)

// Отправляем запрос
const req = https.request(WEBHOOK_URL, options, (res) => {
  console.log(`\n✅ Ответ получен: ${res.statusCode} ${res.statusMessage}`)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data)
      console.log('📦 Ответ сервера:', JSON.stringify(response, null, 2))
      
      if (res.statusCode === 200) {
        console.log('🎉 Развертывание успешно запущено!')
        console.log('⏳ Подождите несколько минут для завершения процесса...')
      } else {
        console.log('❌ Ошибка при запуске развертывания')
      }
    } catch (e) {
      console.log('📄 Ответ сервера (raw):', data)
    }
  })
})

req.on('error', (e) => {
  console.error('❌ Ошибка запроса:', e.message)
})

// Отправляем payload
req.write(payload)
req.end()

console.log('⏳ Ожидаем ответ сервера...')