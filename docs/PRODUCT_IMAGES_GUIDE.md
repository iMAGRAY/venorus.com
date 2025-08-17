# Система изображений товаров

## Обзор
Система поддерживает загрузку и управление множественными изображениями товаров (до 20 штук) с возможностью изменения порядка, установки главного изображения и drag-and-drop интерфейсом.

## Основные возможности

### 📸 Множественные изображения
- До 20 изображений на товар
- Автоматическая сортировка и нумерация
- Первое изображение автоматически становится главным

### 🎯 Управление порядком
- Drag-and-drop для изменения порядка
- Визуальные индикаторы порядка
- Автоматическое обновление главного изображения

### ⭐ Главное изображение
- Первое изображение в списке
- Используется в карточках товаров
- Автоматически обновляется при изменении порядка

### 🔧 Интеграция с формой товара
- Доступно при создании и редактировании
- Автоматическое сохранение при создании товара
- Синхронизация с основными данными товара

## Структура базы данных

### Таблица product_images

```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 1,
  is_main BOOLEAN DEFAULT FALSE,
  alt_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Индексы для оптимизации

```sql
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_order ON product_images(product_id, image_order);
CREATE INDEX idx_product_images_main ON product_images(product_id, is_main);
```

## API Endpoints

### GET /api/product-images
Получение изображений товара

**Параметры:**
- `productId` - ID товара (обязательный)

**Пример запроса:**
```bash
GET /api/product-images?productId=123
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 123,
      "image_url": "https://example.com/image1.jpg",
      "image_order": 1,
      "is_main": true,
      "alt_text": "Изображение товара 1",
      "created_at": "2025-06-19T21:50:34.715Z"
    }
  ]
}
```

### POST /api/product-images
Добавление изображений к товару

**Тело запроса:**
```json
{
  "productId": 123,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]
}
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 123,
      "image_url": "https://example.com/image1.jpg",
      "image_order": 1,
      "is_main": true,
      "alt_text": "Изображение товара 1"
    }
  ],
  "message": "Successfully added 3 images"
}
```

### PUT /api/product-images
Обновление порядка изображений

**Тело запроса:**
```json
{
  "productId": 123,
  "images": [
    "https://example.com/image3.jpg",
    "https://example.com/image1.jpg", 
    "https://example.com/image2.jpg"
  ]
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Images order updated successfully"
}
```

### DELETE /api/product-images
Удаление изображений

**Параметры:**
- `imageId` - ID конкретного изображения
- `productId` - ID товара (для удаления всех изображений)

**Примеры:**
```bash
DELETE /api/product-images?imageId=456
DELETE /api/product-images?productId=123
```

## Компоненты интерфейса

### ProductImageUploader
Основной компонент для загрузки и управления изображениями товара.

```tsx
import { ProductImageUploader } from '@/components/admin/product-image-uploader'

<ProductImageUploader
  productImages={productImages}
  onImagesChange={handleImagesChange}
  maxImages={20}
  isUploading={false}
/>
```

**Props:**
- `productImages`: string[] - массив URL изображений
- `onImagesChange`: (images: string[]) => void - обработчик изменений
- `maxImages`: number - максимальное количество изображений (по умолчанию 20)
- `isUploading`: boolean - состояние загрузки

### Возможности компонента

#### 🖼️ Отображение изображений
- Сетка с превью изображений
- Индикаторы порядка
- Бейдж главного изображения
- Hover-эффекты с действиями

#### 📤 Загрузка файлов
- Drag & drop область
- Выбор файлов через диалог
- Поддержка множественного выбора
- Прогресс загрузки

#### 🎛️ Управление
- Drag & drop для изменения порядка
- Кнопка "Сделать главным"
- Удаление изображений
- Автоматическое обновление счетчика

#### 🚨 Ограничения и валидация
- Максимум 20 изображений
- Только изображения (JPEG, PNG, WebP, GIF)
- Максимальный размер файла: 5 МБ
- Уведомления о достижении лимита

## Интеграция с формой товара

### ProductFormModern
Форма товара автоматически включает управление изображениями.

```tsx
// Состояние изображений
const [productImages, setProductImages] = useState<string[]>([])

// Обработчик изменений
const handleImagesChange = (images: string[]) => {
  setProductImages(images)
  // Устанавливаем первое изображение как главное
  if (images.length > 0) {
    setFormData(prev => ({ ...prev, image_url: images[0] }))
  }
}

// Сохранение изображений при создании/обновлении товара
const saveProductImages = async (productId: string, images: string[]) => {
  if (images.length === 0) return

  const response = await fetch('/api/product-images', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: parseInt(productId), images })
  })

  if (!response.ok) {
    throw new Error('Failed to save product images')
  }
}
```

### Автоматическая загрузка изображений
При редактировании товара изображения загружаются автоматически:

```tsx
const loadProductImages = async (productId: string) => {
  const response = await fetch(`/api/product-images?productId=${productId}`)
  if (response.ok) {
    const data = await response.json()
    if (data.success && Array.isArray(data.data)) {
      const imageUrls = data.data.map((img: any) => img.image_url)
      setProductImages(imageUrls)
    }
  }
}
```

## Обновления API товаров

### Включение изображений в ответы
API товаров автоматически включает массив изображений:

```typescript
// GET /api/products
// GET /api/products/[id]

// Возвращает:
{
  "id": 123,
  "name": "Товар",
  "image_url": "https://example.com/main.jpg", // Главное изображение
  "images": [                                    // Все изображения в порядке
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  // ... другие поля
}
```

## Примеры использования

### Создание товара с изображениями

```javascript
// 1. Создаем товар
const product = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Новый товар',
    category_id: 1
  })
})

const productData = await product.json()

// 2. Добавляем изображения
await fetch('/api/product-images', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: productData.data.id,
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ]
  })
})
```

### Изменение порядка изображений

```javascript
// Получаем текущие изображения
const response = await fetch(`/api/product-images?productId=123`)
const data = await response.json()

// Меняем порядок
const reorderedImages = data.data.map(img => img.image_url).reverse()

// Сохраняем новый порядок
await fetch('/api/product-images', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 123,
    images: reorderedImages
  })
})
```

## Производительность

### Оптимизации
- Индексы для быстрого поиска изображений по товару
- Каскадное удаление при удалении товара
- Батчевая обработка при обновлении порядка
- Lazy loading изображений в интерфейсе

### Мониторинг
- Логирование операций с изображениями
- Обработка ошибок загрузки
- Fallback на заглушки при недоступности изображений

## Безопасность

### Валидация
- Проверка типов файлов
- Ограничение размера файлов
- Санитизация URL изображений
- Проверка прав доступа к товарам

### Хранение
- Интеграция с S3-совместимым хранилищем
- Автоматическая генерация превью
- CDN для быстрой доставки
- Резервное копирование

## Тестирование

Система включает автоматические тесты:

```bash
# Тест API изображений
node test-images-simple.js

# Тест изменения порядка
node test-image-reorder.js

# Полный тест системы
node test-product-images-system.js
```

## Мигрируемость

### Миграция базы данных
```sql
-- Создание таблицы и индексов
\i create-product-images-table.sql

-- Миграция существующих изображений
INSERT INTO product_images (product_id, image_url, image_order, is_main, alt_text)
SELECT id, image_url, 1, true, 'Основное изображение'
FROM products 
WHERE image_url IS NOT NULL;
```

### Обратная совместимость
- Поле `image_url` в таблице `products` сохраняется
- Автоматическая синхронизация главного изображения
- Fallback на `image_url` если изображений нет

## Планы развития

### Ближайшие улучшения
- [ ] Автоматическая генерация превью
- [ ] Поддержка ALT-текстов для изображений
- [ ] Массовые операции (выбор нескольких изображений)
- [ ] История изменений порядка изображений

### Долгосрочные планы
- [ ] Интеграция с CDN
- [ ] Автоматическая оптимизация изображений
- [ ] Поддержка видео и 3D-моделей
- [ ] AI-генерация описаний изображений 