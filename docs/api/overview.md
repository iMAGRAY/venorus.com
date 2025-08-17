# 🌐 API Обзор - MedSIP Prosthetics System

Система предоставляет RESTful API для управления производителями, модельными рядами и продуктами.

## 🏗️ Базовая информация

- **Base URL**: `http://localhost:3000/api`
- **Формат данных**: JSON
- **Аутентификация**: Не требуется (внутренний API)
- **Кодировка**: UTF-8

## 📋 Список эндпоинтов

### 🏭 Производители
- `GET /api/manufacturers` - Получить всех производителей
- `POST /api/manufacturers` - Создать производителя
- `GET /api/manufacturers/{id}` - Получить производителя по ID
- `PUT /api/manufacturers/{id}` - Обновить производителя
- `DELETE /api/manufacturers/{id}` - Удалить производителя

### 📋 Модельные ряды
- `GET /api/model-lines` - Получить все модельные ряды
- `POST /api/model-lines` - Создать модельный ряд
- `GET /api/model-lines/{id}` - Получить модельный ряд по ID
- `PUT /api/model-lines/{id}` - Обновить модельный ряд
- `DELETE /api/model-lines/{id}` - Удалить модельный ряд

### 🛍️ Продукты
- `GET /api/products` - Получить все продукты
- `POST /api/products` - Создать продукт
- `GET /api/products/{id}` - Получить продукт по ID
- `PUT /api/products/{id}` - Обновить продукт
- `DELETE /api/products/{id}` - Удалить продукт

### 📂 Категории
- `GET /api/categories` - Получить все категории
- `POST /api/categories` - Создать категорию
- `GET /api/categories/{id}` - Получить категорию по ID
- `PUT /api/categories/{id}` - Обновить категорию
- `DELETE /api/categories/{id}` - Удалить категорию

### 🧱 Материалы
- `GET /api/materials` - Получить все материалы
- `POST /api/materials` - Создать материал

### ⚡ Особенности
- `GET /api/features` - Получить все особенности
- `POST /api/features` - Создать особенность

## 🔄 Стандартные ответы

### Успешный ответ (200 OK)
```json
{
  "id": 1,
  "name": "МедСИП",
  "country": "Россия",
  "foundedYear": 2015,
  "isActive": true
}
```

### Ошибка (400 Bad Request)
```json
{
  "error": "Validation failed",
  "details": "Name is required"
}
```

### Ошибка сервера (500 Internal Server Error)
```json
{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

## 🔗 Связи между объектами

```
Manufacturer (1) ←→ (N) ModelLine ←→ (N) Product
Category (1) ←→ (N) ModelLine
```

## 📝 Примеры использования

### Получение иерархии
```javascript
// 1. Получить производителей
const manufacturers = await fetch('/api/manufacturers').then(r => r.json())

// 2. Получить модельные ряды
const modelLines = await fetch('/api/model-lines').then(r => r.json())

// 3. Группировка по производителям
const hierarchy = manufacturers.map(manufacturer => ({
  manufacturer,
  modelLines: modelLines.filter(ml => ml.manufacturerId === manufacturer.id)
}))
```

### Создание нового продукта
```javascript
const newProduct = {
  name: "Новый протез",
  description: "Описание продукта",
  modelLineId: 1,
  price: 50000,
  isActive: true
}

const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newProduct)
})
```

## 🛠️ Утилиты для разработки

- `GET /api/db-status` - Статус подключения к БД
- `POST /api/db-reset` - Сброс БД (только для разработки)

## 📊 Поля возвращаемых объектов

Подробное описание полей смотрите в соответствующих разделах:
- [Производители API](./manufacturers.md)
- [Модельные ряды API](./model-lines.md)
- [Продукты API](./products.md) 