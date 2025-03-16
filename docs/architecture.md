# Arquitectura LFD

Esta aplicación utiliza una adaptación práctica de estructura que combina:

-   **Clean Architecture**: Separación clara de capas y responsabilidades.
-   **Screaming Architecture**: Estructura que "grita" las funcionalidades del negocio.
-   **Feature-Driven Development**: Los features impulsan el diseño.

Está organizado en una jerarquía de 4 capas clave: `app`, `pages`, `features` y `shared`.  
Los `features` son el eje central que impulsa la lógica de negocio y las funcionalidades de la aplicación.

A este enfoque lo llamo **Layered Feature-Driven Architecture (LFD)** (Arquitectura en Capas Orientada a Features).

## Capas

### 1. **`app`**

-   Núcleo de infraestructura y configuración global.
-   Gestión de rutas, estados globales (Redux, Context), temas, etc.

### 2. **`pages`**

-   Vistas presentacionales que integran múltiples _features_.
-   Actúan como contenedores de composición.
-   No contienen lógica de negocio directa.
-   Pueden acceder directamente a la capa `app` (ej: consumir el store de Redux).

### 3. **`features`**

-   Encapsulan funcionalidades específicas del negocio.
-   Cada _feature_ es autónomo y puede combinarse con otros features.

### 4. **`shared`**

-   Recursos técnicos reutilizables y compartidos.
-   Componentes genéricos (botones, modales, grids), hooks, servicios, tipos y constantes.

## Jerarquía

Las capas superiores **pueden** acceder a las inferiores, pero **no en viceversa**. A excepción de la capa `pages` que **tiene** acceso a la infrastructura de la capa `app`.

```plaintext
app <-> pages -> features -> shared
```

## Estructura

Ejemplo de una estructura de carpetas con este enfoque.

```plaintext
/src
├── /app
│   ├── /states         # Estados globales
│   │   ├── /redux      # Store, providers...
│   │   └── /context    # Contextos de React
│   ├── /routing
│   ├── App.tsx
│   └── main.tsx
│
├── /pages
│   ├── /example
│   │   └── ExamplePage.tsx
│   └── /auth
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       └── ResetPasswordPage.tsx
│
├── /features
│   ├── /auth
│   │   ├── /components
│   │   ├── /hooks
│   │   ├── /services
│   │   ├── /types
│   │   └── /states     # slices, reducers, contextos...
│   └── /another-feature
│
└── /shared
    ├── /assets
    ├── /components
    ├── /hooks
    ├── /utils
    ├── /services
    └── /types
```
