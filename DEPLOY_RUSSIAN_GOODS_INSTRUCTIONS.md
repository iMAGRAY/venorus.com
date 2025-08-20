# 🇷🇺 Инструкции по развертыванию российских товаров на venorus.net

## 📋 Статус

✅ **Код готов**: Российские товары созданы и протестированы локально  
✅ **Скрипты готовы**: Скрипты обновления и очистки базы созданы  
❓ **Сервер**: Nginx работает, но приложение на порту 3000 недоступно (502 Bad Gateway)  
🎯 **Цель**: Запустить обновленное приложение с российскими товарами  

## 🚀 Быстрое развертывание

### SSH доступ к серверу
```bash
ssh root@109.73.195.215
```

### Автоматическое обновление (рекомендуется)
```bash
cd /opt/medsip

# Получить последние изменения
git pull origin main

# Очистить базу и добавить российские товары
node scripts/seed/clear-database.js
node scripts/seed/russian-consumer-goods.js

# Установить зависимости и пересобрать
npm ci --production
npm run build

# Перезапустить приложение
systemctl restart medsip
systemctl status medsip
```

### Проверка результата
```bash
# Проверить статус сервиса
systemctl status medsip

# Проверить логи
journalctl -u medsip -f

# Тест API
curl http://localhost:3000/api/health

# Проверить товары в базе
node -e "
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(process.env.POSTGRESQL_PORT),
  database: process.env.POSTGRESQL_DBNAME,
  user: process.env.POSTGRESQL_USER,
  password: decodeURIComponent(process.env.POSTGRESQL_PASSWORD),
  ssl: { rejectUnauthorized: false }
});

(async () => {
  const result = await pool.query('SELECT COUNT(*) as count FROM products');
  console.log('Товаров в базе:', result.rows[0].count);
  
  const manufacturers = await pool.query('SELECT name FROM manufacturers');
  console.log('Производители:', manufacturers.rows.map(r => r.name));
  
  await pool.end();
})();
"
```

## 📦 Созданные российские товары

### 🏭 Производители (6 компаний)
- **Калашников** - спортивное и охотничье снаряжение
- **Ростех** - высокотехнологичная продукция
- **Спектр** - электроника и бытовая техника  
- **Русские самоцветы** - ювелирные изделия
- **Сибирские промыслы** - традиционные товары
- **МегаТех** - современная электроника

### 📂 Категории (14 категорий)
- **Электроника**: Смартфоны, планшеты, аудиотехника
- **Одежда и обувь**: Мужская, женская одежда, обувь  
- **Дом и быт**: Кухня, текстиль для дома
- **Спорт и отдых**: Туризм, кемпинг, фитнес
- **Красота и здоровье**: Косметика, парфюмерия

### 🛍️ Товары (11 позиций)
1. **Смартфон YotaPhone 3 Pro** (39,900₽) - двойной экран
2. **Наушники Marshal Major IV** (12,000₽) - 80 часов работы
3. **Планшет RITMIX RMD-1121** (15,300₽) - Android планшет  
4. **Пуховик мужской "Сибирь"** (8,500₽) - для суровых зим
5. **Платье "Русские узоры"** (5,850₽) - традиционные орнаменты
6. **Сапоги "Валенки Премиум"** (4,200₽) - современные валенки
7. **Набор посуды "Гжель Люкс"** (13,500₽) - фарфор с росписью
8. **Постельное белье "Павловопосадские мотивы"** (5,500₽) - сатин
9. **Палатка "Таймень 3"** (12,500₽) - трехместная туристическая
10. **Гантели "Сила России"** (4,320₽) - разборные 2x10кг  
11. **Крем "Сибирские травы"** (1,850₽) - натуральный антивозрастной

## ⚙️ Система характеристик

### Группы характеристик:
- **Основные характеристики** - страна производства, качество
- **Материалы и качество** - алюминий, натуральные материалы, пластик, текстиль
- **Размеры и упаковка** - габариты и вес
- **Гарантия** - 12, 24, 36 месяцев

## 🔧 Диагностика проблем

### Если приложение не запускается:
```bash
# Проверить порт 3000
netstat -tlnp | grep :3000

# Убить процесс если завис
pkill -f "node.*next"

# Проверить ошибки в логах
journalctl -u medsip -n 50

# Запустить вручную для диагностики
cd /opt/medsip
npm start
```

### Если база данных недоступна:
```bash
# Проверить переменные окружения
cat .env | grep POSTGRESQL

# Тест подключения к базе
node -e "
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(process.env.POSTGRESQL_PORT),  
  database: process.env.POSTGRESQL_DBNAME,
  user: process.env.POSTGRESQL_USER,
  password: decodeURIComponent(process.env.POSTGRESQL_PASSWORD),
  ssl: { rejectUnauthorized: false }
});
pool.query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0])).catch(e => console.error('DB Error:', e.message));
"
```

### Если Nginx показывает 502:
```bash
# Проверить статус Nginx
systemctl status nginx

# Перезапустить Nginx
systemctl restart nginx

# Проверить конфигурацию
nginx -t

# Проверить что приложение слушает порт 3000
curl http://localhost:3000/api/health
```

## 📊 Ожидаемые результаты

После успешного развертывания:

✅ **Сервис работает**: `systemctl status medsip` показывает "active (running)"  
✅ **API отвечает**: `curl http://localhost:3000/api/health` возвращает статус  
✅ **Товары созданы**: 11 российских товаров в базе данных  
✅ **Сайт доступен**: https://venorus.net отображает российские товары  
✅ **Админ панель**: https://venorus.net/admin показывает новые данные  

## 🔗 Полезные ссылки

- **Сервер**: https://venorus.net
- **API Health**: https://venorus.net/api/health  
- **Админ панель**: https://venorus.net/admin
- **IP адрес**: 109.73.195.215
- **SSH**: `ssh root@109.73.195.215`

## 📞 Поддержка

Если возникли проблемы:

1. Проверить статус сервисов: `systemctl status medsip nginx`
2. Посмотреть логи: `journalctl -u medsip -f`  
3. Убедиться что база данных доступна
4. Перезапустить приложение: `systemctl restart medsip`

---

**Создано Claude Code Assistant** 🤖  
**Дата**: 2025-08-19  
**Статус**: Готово к развертыванию ✅