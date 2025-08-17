# Автоматический деплойментt через GitHub Webhook

## Настройка GitHub Webhook

### 1. Настройка Webhook в GitHub

1. Перейдите в настройки репозитория GitHub
2. Выберите "Webhooks" в боковом меню
3. Нажмите "Add webhook"
4. Заполните поля:
   - **Payload URL**: `https://your-domain.com/api/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: `venorus_webhook_secret_2025` (из .env.local)
   - **Events**: Выберите "Just the push event"
   - **Active**: Включено

### 2. Переменные окружения

Убедитесь, что в `.env.local` установлен правильный секрет:

```env
GITHUB_WEBHOOK_SECRET="venorus_webhook_secret_2025"
```

### 3. Как это работает

1. При push в ветку `main`/`master` GitHub отправляет webhook
2. Эндпоинт `/api/webhook/github` получает уведомление
3. Проверяется подпись запроса для безопасности
4. Запускается скрипт автоматического деплойментa
5. Выполняются следующие шаги:
   - `git fetch origin` - получение изменений
   - `git reset --hard origin/main` - обновление кода
   - `npm ci` - установка зависимостей
   - `npm run build` - сборка проекта
   - `npm run lint` - проверка линтинга (не критично)
   - `pm2 restart venorus` - перезапуск PM2 процесса
   - Очистка кеша Next.js

### 4. Логирование

Все деплойменты логируются в файл `logs/deploy.log`:

```
[2025-08-17T12:00:00.000Z] 🚀 ===== STARTING AUTOMATIC DEPLOYMENT =====
[2025-08-17T12:00:01.000Z] 🔄 Fetching latest changes...
[2025-08-17T12:00:02.000Z] ✅ Fetching latest changes completed
...
[2025-08-17T12:00:30.000Z] 🎉 ===== DEPLOYMENT COMPLETED SUCCESSFULLY in 30.00s =====
```

### 5. Безопасность

- Webhook защищен секретным ключом
- Проверяется подпись HMAC SHA256
- Обрабатываются только push в main/master ветку
- При ошибке выполняется автоматический откат

### 6. Ручной деплойментt

Если нужно запустить деплойментt вручную:

```bash
# Автоматический деплойментt
npm run deploy:auto

# Или просто сборка и запуск
npm run deploy:manual
```

### 7. Мониторинг

Проверить статус webhook endpoint:

```bash
curl https://your-domain.com/api/webhook/github
```

Ответ:
```json
{
  "message": "GitHub Webhook Endpoint",
  "status": "active",
  "timestamp": "2025-08-17T12:00:00.000Z"
}
```

### 8. Настройка PM2 (если используется)

Если ваш сервер использует PM2, создайте файл `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'venorus',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Запуск с PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 9. Устранение неполадок

**Webhook не срабатывает:**
- Проверьте URL и секрет в настройках GitHub
- Убедитесь, что сервер доступен по HTTPS
- Проверьте логи в `logs/deploy.log`

**Деплойментt падает:**
- Проверьте права доступа к git репозиторию
- Убедитесь, что все зависимости установлены
- Проверьте логи процесса в `logs/deploy.log`

**Откат не работает:**
- Убедитесь, что git репозиторий чистый
- Проверьте права на запись в директорию проекта

### 10. Альтернативы для Windows

Если скрипт не работает на Windows, замените команды в `auto-deploy.js`:

```javascript
// Заменить
await runCommand('pm2 restart venorus', 'Restarting PM2 process')

// На (для Windows с IIS или другим веб-сервером)
await runCommand('iisreset', 'Restarting IIS')
```