# 🚀 Автоматический деплойментt Venorus

## ✅ Что сделано

Создана система автоматического деплойментa при push в main ветку:

### 🔧 Компоненты системы:

1. **Webhook endpoint**: `/api/webhook/github`
2. **Скрипт автодеплоя**: `scripts/deploy/auto-deploy.js`
3. **Мониторинг**: `/api/deploy/status`
4. **Логирование**: `logs/deploy.log`

### 📋 Быстрая настройка

#### 1. В GitHub репозитории:
```
Settings → Webhooks → Add webhook
• Payload URL: https://your-domain.com/api/webhook/github
• Content type: application/json
• Secret: venorus_webhook_secret_2025
• Events: Just the push event
```

#### 2. На сервере убедитесь:
```bash
# Webhook secret установлен
echo $GITHUB_WEBHOOK_SECRET

# Права на выполнение git команд
git fetch origin

# PM2 процесс настроен (опционально)
pm2 list
```

### 🔄 Как работает:

1. **Push в main** → GitHub отправляет webhook
2. **Проверка безопасности** → HMAC подпись валидируется
3. **Автоматический деплойментt**:
   ```bash
   git fetch origin
   git reset --hard origin/main
   npm ci
   npm run build
   pm2 restart venorus  # если используется
   ```
4. **Логирование** → Все действия записываются в `logs/deploy.log`

### 📊 Мониторинг

**Проверить статус webhook:**
```bash
curl https://your-domain.com/api/webhook/github
```

**Проверить статус деплойментa:**
```bash
curl https://your-domain.com/api/deploy/status
```

**Посмотреть логи:**
```bash
tail -f logs/deploy.log
```

### 🛠️ Ручной деплойментt

```bash
# Автоматический
npm run deploy:auto

# Ручной
npm run deploy:manual

# Очистка кеша
npm run clean
```

### 🔒 Безопасность

- ✅ HMAC SHA256 подпись проверяется
- ✅ Только main/master ветка обрабатывается  
- ✅ Автоматический откат при ошибках
- ✅ Таймауты для предотвращения зависания

### 🚨 Устранение неполадок

**Webhook не работает:**
```bash
# Проверить endpoint
curl -X GET https://your-domain.com/api/webhook/github

# Проверить секрет
echo $GITHUB_WEBHOOK_SECRET
```

**Деплойментt падает:**
```bash
# Посмотреть логи
cat logs/deploy.log

# Проверить права git
git status
git pull origin main
```

### 📝 Следующие шаги:

1. **Настройте GitHub webhook** по инструкции выше
2. **Протестируйте** сделав test commit в main
3. **Мониторьте** логи первых деплойментов
4. **Настройте PM2** если планируете использовать

---

## 🔄 Пример использования:

```bash
# Делаете изменения в коде
git add .
git commit -m "Update feature X"
git push origin main

# Автоматически произойдет:
# 1. GitHub отправит webhook
# 2. Сервер получит уведомление
# 3. Код обновится автоматически
# 4. Сайт будет доступен с новыми изменениями
```

**Готово к использованию! 🎉**