Prueba Técnica QA – Automatización E2E con Playwright (JavaScript)

Este repositorio contiene la automatización end-to-end de los flujos críticos de la tienda OpenCart: https://opencart.abstracta.us.
Se implementó con Playwright + JavaScript, aplicando Page Object Model (POM), buenas prácticas de QA y generación de reportes, videos, screenshots y traces.

Alcance y funcionalidades automatizadas

Como administrador, se automatizaron los siguientes flujos (requeridos en la prueba):

Registro de usuario

Completa el formulario.

Valida el registro exitoso.

Cierra sesión.

Inicia sesión con las credenciales recién creadas.

Restablecimiento de contraseña

Navega a Forgotten Password.

Solicita el reset para un correo y valida la confirmación.

Flujo de compra (E2E)

Laptops & Notebooks → Show all.

Agrega MacBook Pro al carrito.

Busca Samsung Galaxy Tab 10.1 y la agrega al carrito.

Elimina MacBook Pro del carrito.

Incrementa la cantidad de la Samsung a 2.

Realiza checkout como invitado y confirma la orden.

Arquitectura y patrón de diseño

Se aplicó Page Object Model para aislar la lógica de UI en clases reutilizables:

AutomatizacionE2E/
├─ pages/
│  ├─ header.page.js          // navegación global (menú, búsqueda, carrito, login/register/logout)
│  ├─ category.page.js        // acciones/validaciones en listados de productos
│  ├─ product.page.js         // ficha del producto (add to cart)
│  ├─ cart.page.js            // view cart (remover, actualizar cantidades, ir a checkout)
│  ├─ checkout.page.js        // flujo de guest checkout hasta confirmación
│  ├─ register.page.js        // registro de cuenta
│  ├─ login.page.js           // login y aserciones de sesión
│  └─ forgot.page.js          // “Forgotten Password”
├─ tests/
│  ├─ e2e.registration.spec.js  // registro + login
│  ├─ e2e.password-reset.spec.js // reset de contraseña
│  └─ e2e.shop-flow.spec.js      // compra E2E completa
├─ utils/
│  ├─ data.js                 // datos de prueba (usuario, dirección, productos)
│  └─ helpers.js              // utilidades (p.ej., uniqueEmail(prefix))
├─ playwright.config.js
└─ package.json


Buenas prácticas aplicadas:

Selectores robustos (IDs, product_id en links) y getByRole accesible.

Re-localización tras refresh (carrito actualiza la tabla).

Manejo de SSL inválido del demo: ignoreHTTPSErrors: true y preferencia por http://.

Aserciones puntuales y “pasos” claros en el flujo (opcionalmente con test.step).

Generación de evidencia: reporte HTML, video, screenshots, trace.

Herramientas y versiones

Node.js ≥ 16 (recomendado 18+)

Playwright Test (bundled con @playwright/test)

JavaScript (CommonJS)

Windows/PowerShell: si npm marca error de ejecución de scripts, habilita:

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

Configuración clave (playwright.config.js)
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://opencart.abstracta.us', // ← usar http por certificado vencido en https
    ignoreHTTPSErrors: true,                  // ← por si el sitio redirige a https
    headless: true,                           // usa --headed para ver el navegador
    video: 'on',                              // graba video de todos los tests
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ]
};
module.exports = config;

Instalación y ejecución (paso a paso)
1) Clonar el repositorio
git clone <URL_DE_TU_REPO>.git
cd PruebaTecnica/AutomatizacionE2E

2) Instalar dependencias
npm install

3) Instalar navegadores de Playwright
npx playwright install --with-deps

4) Ejecutar todas las pruebas
npx playwright test

5) Ver ejecución en vivo (opcional)
npx playwright test --headed

6) Ejecutar un test específico
npx playwright test tests/e2e.shop-flow.spec.js
npx playwright test tests/e2e.registration.spec.js
npx playwright test tests/e2e.password-reset.spec.js

7) Abrir el reporte HTML
npx playwright show-report

Scripts recomendados en package.json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report"
  }
}


Uso:

npm run test
npm run test:headed
npm run report

Artefactos de ejecución

Reporte HTML: playwright-report/

Resultados crudos: test-results/<spec>/<project>/

video.webm → video de la ejecución

trace.zip → traza navegable (DOM, red, consola)

*.png → screenshots (solo en fallos, salvo cambio de config)

Para abrir un trace puntual:

npx playwright show-trace test-results/<ruta>/<a-tu-trace>.zip

Metodología y enfoque de QA

Smoke E2E del “happy path” + validaciones críticas (títulos, cantidades, confirmaciones).

Aislamiento por POM: mantenibilidad y reuso (selectors y acciones encapsulados).

Robustez de selectores:

Preferencia por IDs y/o href*="product_id=XX".

getByRole con nombres accesibles.

Sincronización explícita donde es necesario:

waitForLoadState('networkidle') en acciones que provocan refresh.

Re-localización de elementos después de actualizar cantidades.

Mitigación de flakiness del demo:

Uso de baseURL en http.

ignoreHTTPSErrors: true por redirecciones inesperadas a https.

Evidencia reproducible:

Video siempre activo.

Trace retenido en fallos.

Reporte HTML para inspección post-ejecución.

Mapeo requisitos ↔️ pruebas

Registro → tests/e2e.registration.spec.js

Login (validación) → en el mismo spec tras logout.

Reset de contraseña → tests/e2e.password-reset.spec.js

Laptops & Notebooks → Show all → Header.openLaptopsAndNotebooksAll() (usado en e2e.shop-flow.spec.js)

Agregar MacBook Pro → e2e.shop-flow.spec.js

Buscar Samsung y agregar → e2e.shop-flow.spec.js

Eliminar MacBook Pro → CartPage.removeProductByName(...)

Incrementar cantidad de Samsung a 2 → CartPage.setQtyByProductId('49', 2)

Checkout y confirmación → CheckoutPage.guestCheckoutFlow() + expectOrderConfirmed()

Solución de problemas comunes

Pantalla “sitio no seguro” (certificado vencido)
Usa baseURL http y ignoreHTTPSErrors: true en la config.
En acciones de carrito, el código normaliza a http:// si el sitio redirige a https://.

El buscador no clickea “Search”
Se usa #search button[type="button"] y getByPlaceholder('Search').
Si cambia el tema, ajusta Header.search().

No encuentro el producto en el carrito
Usa métodos con product_id (p. ej., Samsung = 49, MacBook Pro = 45 en el demo).

Estructura sugerida del repositorio (para la entrega)
PruebaTecnica/
├─ Punto1_ApiTesting/          # (si aplica la otra parte del desafío)
│  └─ ...
└─ AutomatizacionE2E/          # este proyecto
   ├─ pages/
   ├─ tests/
   ├─ utils/
   ├─ playwright.config.js
   ├─ package.json
   └─ README.md 