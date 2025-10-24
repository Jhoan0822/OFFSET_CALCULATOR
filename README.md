<div align="center">
<img width="1200" height="475" alt="Banner del Cotizador de Impresión Offset" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cotizador de Impresión Offset

Una herramienta web avanzada para la planificación y cotización de trabajos de impresión offset. Permite calcular con precisión el uso de materiales, los costos asociados y visualizar la disposición de los trabajos en un pliego de papel estándar.

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-blue?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🎯 Descripción del Proyecto

Este cotizador es una aplicación de página única (SPA) diseñada para simplificar y agilizar el proceso de cotización en la industria de las artes gráficas. Los usuarios pueden introducir las especificaciones de un trabajo de impresión (dimensiones, cantidad, tipo de papel, tintas, acabados) y obtener instantáneamente un desglose detallado de los costos y los materiales necesarios.

La herramienta está construida con tecnologías modernas para ofrecer una experiencia de usuario rápida, reactiva y amigable.

## ✨ Características Principales

-   **Cálculo Detallado de Costos:** Calcula costos de papel, planchas, tintas, y procesos de acabado.
-   **Optimización de Materiales:** Determina la cantidad óptima de pliegos necesarios, minimizando el desperdicio.
-   **Interfaz Reactiva e Intuitiva:** Los resultados se actualizan en tiempo real a medida que se modifican los parámetros del trabajo.
-   **Generación de Órdenes de Producción:** Genera un número de orden de producción único para cada cotización.
-   **Exportación a PDF:** Permite descargar un resumen de la cotización en formato PDF para compartirla fácilmente con clientes o para registros internos.
-   **Diseño Imprimible:** La vista de resultados está optimizada para ser impresa directamente desde el navegador, mostrando solo la información relevante.
-   **Diseño Responsivo:** Totalmente funcional en dispositivos de escritorio y tabletas gracias a Tailwind CSS.

## ⚙️ Anatomía de una Cotización: ¿Cómo se calculan los costos?

La lógica de la aplicación descompone el costo total en varios componentes clave, reflejando el proceso de producción real en una imprenta.

### 1. Costo de Papel (Optimización del Pliego)
Es el punto de partida y uno de los costos más significativos.
-   **¿Qué hace?:** Calcula cuántas piezas del tamaño final del trabajo (`medidaTrabajo`) caben en un pliego de papel de tamaño estándar (`medidaPliego`). La aplicación prueba orientaciones horizontales y verticales para maximizar el número de piezas por pliego.
-   **¿Cómo funciona?:**
    1.  Calcula las `piezasPorPliego` óptimas.
    2.  Determina el total de `pliegosNecesarios` dividiendo la `cantidad` solicitada entre las `piezasPorPliego`.
    3.  Añade un porcentaje de **demasía** (papel extra para pruebas, calibración y mermas) a los pliegos necesarios.
    4.  El costo se obtiene multiplicando los pliegos totales (incluida la demasía) por el `costoPorPliego` definido.

### 2. Costo de Planchas (Pre-impresión)
Cada color utilizado en la impresión requiere una plancha metálica distinta.
-   **¿Qué hace?:** Determina el número total de planchas necesarias para el trabajo.
-   **¿Cómo funciona?:**
    1.  Suma el número de `tintasFrente` y `tintasDorso`. Por ejemplo, una impresión 4x1 (CMYK al frente, Negro al dorso) requiere 5 planchas.
    2.  El costo se calcula multiplicando el `númeroTotalDePlanchas` por el `costoPorPlancha`.

### 3. Costo de Impresión (Tiraje)
Representa el costo de operar la máquina de impresión.
-   **¿Qué hace?:** Estima el costo del tiempo de máquina y la tinta en función del número de pliegos a imprimir.
-   **¿Cómo funciona?:**
    1.  Se basa en el número de `pliegosNecesarios` calculados en el primer paso.
    2.  Generalmente, se aplica una tarifa base para el "primer millar" de impresiones (que cubre la configuración inicial de la máquina) y una tarifa reducida para cada "millar adicional".
    3.  El costo se calcula en base a esta estructura de precios por millar de pliegos impresos.

### 4. Costos de Acabados
Son todos los procesos post-impresión que dan el toque final al producto.
-   **¿Qué hace?:** Suma el costo de todos los acabados seleccionados por el usuario.
-   **¿Cómo funciona?:**
    1.  Cada acabado (laminado, barniz UV, corte, doblado, etc.) tiene su propio método de cálculo.
    2.  Algunos se cotizan por pliego (ej. laminado), otros por unidad final (ej. doblado), y otros pueden tener un costo fijo (ej. suajado).
    3.  La aplicación suma los costos individuales de cada acabado activado para obtener un subtotal de acabados.

### 5. Costo Total y Precio Final
Finalmente, se consolidan todos los costos y se añade el margen de ganancia.
-   **¿Qué hace?:** Consolida todos los subtotales, aplica el margen de utilidad y los impuestos para generar el precio final para el cliente.
-   **¿Cómo funciona?:**
    1.  **Subtotal:** `Costo de Papel` + `Costo de Planchas` + `Costo de Tiraje` + `Costo de Acabados`.
    2.  **Utilidad:** Se aplica un `margenDeUtilidad` porcentual sobre el subtotal.
    3.  **Precio de Venta:** `Subtotal` + `Utilidad`.
    4.  **Precio Unitario:** `Precio de Venta` / `cantidad`.

## 🛠️ Tecnologías Utilizadas

-   **Frontend:** [React](https://react.dev/) 19, [TypeScript](https://www.typescriptlang.org/)
-   **Entorno de Desarrollo:** [Vite](https://vitejs.dev/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Generación de PDF:** [jsPDF](https://github.com/parallax/jsPDF) y [html2canvas](https://html2canvas.hertzen.com/)

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Pre-requisitos

-   [Node.js](https://nodejs.org/) (se recomienda v18 o superior)
-   [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd cotizador-de-impresion-offset
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

## 🏃‍♂️ Uso

Una vez instaladas las dependencias, puedes usar los siguientes scripts de `package.json`:

-   **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Esto iniciará la aplicación en modo de desarrollo con Hot-Reload. Abre tu navegador y visita `http://localhost:5173` (o el puerto que indique la terminal).

-   **Construir para producción:**
    ```bash
    npm run build
    ```
    Esto compilará y empaquetará la aplicación en el directorio `dist/` para su despliegue.

-   **Previsualizar la build de producción:**
    ```bash
    npm run preview
    ```
    Este comando inicia un servidor local simple para servir los archivos del directorio `dist/`, permitiéndote verificar la versión de producción antes de desplegarla.

## 📁 Estructura del Proyecto
    /
    ├── public/ # Archivos estáticos (íconos, etc.)
    ├── src/
    │ ├── components/ # Componentes de React (UI)
    │ │ ├── CalculatorForm.tsx
    │ │ └── ResultsDisplay.tsx
    │ ├── utils/ # Lógica y funciones de utilidad
    │ │ ├── quoteCalculator.ts
    │ │ └── generateOrderNumber.ts
    │ ├── App.tsx # Componente principal de la aplicación
    │ ├── constants.ts # Constantes y estado inicial del formulario
    │ ├── index.css # Estilos globales (referenciado en index.html)
    │ ├── index.tsx # Punto de entrada de la aplicación React
    │ └── types.ts # Definiciones de tipos de TypeScript
    ├── .gitignore # Archivos y carpetas ignorados por Git
    ├── index.html # Plantilla HTML principal
    ├── metadata.json # Metadatos para AI Studio
    ├── package.json # Dependencias y scripts del proyecto
    ├── README.md # Este archivo
    └── tsconfig.json # Configuración de TypeScript
## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles. (Nota: Se recomienda añadir un archivo `LICENSE` al repositorio).
