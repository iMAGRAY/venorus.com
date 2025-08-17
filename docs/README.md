# 📚 MedSIP Prosthetics System - Документация

Добро пожаловать в документацию системы MedSIP для управления протезами и ортезами.

## 🏗️ Архитектура системы

Система построена на основе иерархии:
```
🏭 Производители (Manufacturers)
    ↓ manufacturer_id
📋 Модельные ряды (Model Lines)
    ↓ model_line_id
🛍️ Продукты (Products)
```

## 📁 Структура документации

### 🔧 [Настройка и установка](./setup/)
- [Первоначальная настройка](./setup/installation.md)
- [Настройка базы данных](./setup/database-setup.md)
- [Переменные окружения](./setup/environment.md)

### 🗄️ [База данных](./database/)
- [Схема базы данных](./database/schema.md)
- [Миграции](./database/migrations.md)
- [Связи между таблицами](./database/relationships.md)

### 🌐 [API документация](./api/)
- [Обзор API](./api/overview.md)
- [Производители API](./api/manufacturers.md)
- [Модельные ряды API](./api/model-lines.md)
- [Продукты API](./api/products.md)
- [Категории API](./api/categories.md)

### 🧪 [Тестирование](./testing/)
- [Обзор тестов](./testing/overview.md)
- [Запуск тестов](./testing/running-tests.md)
- [Написание новых тестов](./testing/writing-tests.md)

## 🚀 Быстрый старт

1. **Клонирование и установка:**
   ```bash
   git clone <repository>
   cd medsip-prosthetics
   npm install
   ```

2. **Настройка базы данных:**
   ```bash
   npm run db:init
   npm run db:seed
   ```

3. **Запуск разработческого сервера:**
   ```bash
   npm run dev
   ```

4. **Запуск тестов:**
   ```bash
   npm test
   ```

## 🛠️ Основные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Сборка проекта |
| `npm run test` | Запуск всех тестов |
| `npm run test:hierarchy` | Тест иерархии |
| `npm run db:init` | Инициализация БД |
| `npm run db:seed` | Заполнение тестовыми данными |

## 📊 Статус системы

- ✅ База данных настроена
- ✅ API эндпоинты работают
- ✅ Иерархический интерфейс реализован
- ✅ Тесты написаны и проходят
- ✅ Документация структурирована

## 🔗 Полезные ссылки

- [Админ панель](http://localhost:3000/admin)
- [API документация](http://localhost:3000/api)
- [Модельные ряды](http://localhost:3000/model-lines)

## 📞 Поддержка

Если у вас возникли вопросы или проблемы, обратитесь к соответствующему разделу документации или создайте issue в репозитории.

---

*Последнее обновление: 16 июня 2025* 