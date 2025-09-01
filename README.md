# Prueba Técnica QA

Este repositorio reúne el trabajo realizado en la **Prueba Técnica QA**, cuyo objetivo fue **validar la calidad de una aplicación en diferentes niveles**:

- **Pruebas funcionales de API** con **Postman + Newman**
- **Pruebas de Carga y Rendimiento** con **Apache JMeter**
- **Pruebas End-to-End (E2E)** con **Playwright**

De esta forma, se demuestra un enfoque integral de QA que combina **pruebas funcionales, de rendimiento y de experiencia de usuario**, garantizando cobertura en los aspectos más relevantes del sistema.

---

## Índice

1. [Pruebas con Postman + Newman (APIs)](#-1-pruebas-con-postman--newman-apis)  
2. [Pruebas con JMeter (Carga y Rendimiento)](#-2-pruebas-con-jmeter-carga-y-rendimiento)  
3. [Pruebas con Playwright (E2E)](#-3-pruebas-con-playwright-e2e)  

---

## 1. Pruebas con Postman + Newman (APIs)

### Resumen
Colección de pruebas automatizadas en **Postman** para la API de [FakeStore](https://fakestoreapi.com).  
Se validaron los principales flujos de negocio para la gestión de productos, incluyendo ejecución con **Newman** y reportes en **HTML**.

- Herramienta: **Postman v10**
- Runner: **Newman CLI**
- Colección: `postman/FakeStore.postman_collection.json`
- Entorno: `postman/FakeStore.postman_environment.json`

### Escenarios probados
- **GET /products** – Listar productos y filtrar categoría `electronics`.  
- **GET /products/category/electronics** – Validar que todos los productos sean de esa categoría.  
- **GET /products/:id** – Consultar un producto específico.  
- **POST /products** – Crear producto dinámico con datos aleatorios.  
- **PUT /products/:id** – Actualizar imagen del producto creado y validar cambio.  

Los tests validan:
- Status code y headers.
- Tiempo de respuesta (< 1500 ms).
- Contrato JSON.
- Reglas de negocio (price > 0, id válido, URL de imagen válida, etc.).
- Encadenamiento de variables (`productId`, `updatedImageUrl`).

### Ejecución con Newman
Instalar dependencias:

bash
npm i -g newman newman-reporter-htmlextra

### Ejecutar colección:
newman run postman/FakeStore.postman_collection.json \
  -e postman/FakeStore.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export postman/reports/fakestore-report.html

### Reporte generado:
postman/reports/fakestore-report.html

---

## 2. Pruebas con JMeter (Carga y Rendimiento)

### Resumen
Pruebas de API realizadas con **Apache JMeter 5.6.3** sobre la [FakeStore API](https://fakestoreapi.com).  
Se generaron reportes en **HTML** y resúmenes en **Markdown/CSV**.

**Endpoints probados:**
- `GET /products`
- `POST /products`

### Escenarios
- **Carga constante:** 150 usuarios concurrentes durante 2 minutos.  
- **Carga escalada:** incremento progresivo de 100 a 1000 usuarios en intervalos de 150.

### Configuración
- Herramienta: **Apache JMeter 5.6.3**  
- JDK: **OpenJDK 21**  
- Planes de prueba:
  - `TestPlan_150users.jmx`
  - `TestPlan_Scaling.jmx`

### Ejecución

**1 Clonar el repositorio:**
git clone https://github.com/Cesar9810/PruebaTecnica
cd PruebaTecnica/ApiTesting

**2 Habilitar scripts en PowerShell (si aplica):**
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

**3 Ejecutar escenarios:**
Punto 5 – 150 usuarios:
.\run_point5.ps1 -JMeterBat "..\apache-jmeter-5.6.3\bin\jmeter.bat"
-Jmx "..\TestPlan_150users.jmx" `
-OutDir "..\results"

Genera:  
- `results\150users.jtl`  
- `results\report_150users\index.html`

Punto 6 – Escalado 100 a 1000 usuarios:
.\run_point6.ps1 -JMeterBat "..\apache-jmeter-5.6.3\bin\jmeter.bat"
-Jmx "..\TestPlan_Scaling.jmx" `
-OutDir "..\results"

Genera:  
- `.jtl` por cada nivel  
- Reportes para (100, 250, 400, 550, 700, 850, 1000 usuarios)

Resumen consolidado:
.\summarize_from_jtl.ps1

Genera:  
- `results\summary.md` (tabla Markdown con métricas p95, throughput y errores)  
- `results\summary.csv` (datos para Excel/Sheets)

Ejecutar todo junto (punto 5 + punto 6 + resumen):
.\run_all.ps1

### Resultados
- **Reportes HTML**:  
  Cada escenario genera un dashboard navegable con métricas de rendimiento:  
  - `results\report_150users\index.html`  
  - `results\report_<Nusers>\index.html` (para 100, 250, 400, 550, 700, 850 y 1000 usuarios).  

- **Resúmenes consolidados**:  
  - `results\summary.md` → tabla en Markdown con métricas p95, throughput y tasa de errores.  
  - `results\summary.csv` → archivo compatible con Excel/Google Sheets para análisis adicional.
  
---
## 3. Pruebas con Playwright (E2E)

### Resumen
Automatización de flujos críticos en la tienda [OpenCart](https://opencart.abstracta.us) utilizando **Playwright + JavaScript** bajo el patrón **Page Object Model (POM)**.  
Se generaron **reportes HTML, videos, screenshots y traces** para evidenciar los resultados.

### Escenarios probados
1. **Registro de usuario**
   - Completar el formulario.
   - Validar el registro exitoso.
   - Cerrar sesión e iniciar sesión con las credenciales creadas.

2. **Restablecimiento de contraseña**
   - Navegar a *Forgotten Password*.
   - Solicitar el reset y validar la confirmación.

3. **Flujo de compra completo**
   - Navegar a **Laptops & Notebooks → Show all**.  
   - Agregar **MacBook Pro** y **Samsung Galaxy Tab 10.1** al carrito.  
   - Eliminar el **MacBook Pro**.  
   - Incrementar la cantidad de la **Samsung Galaxy Tab** a **2**.  
   - Realizar checkout como invitado y confirmar la orden.

### Configuración
- Herramienta: **Playwright**  
- Lenguaje: **JavaScript (Node.js)**  
- Estrategia: **Page Object Model (POM)**  

### Ejecución

**1 Clonar el repositorio:**
git clone https://github.com/Cesar9810/PruebaTecnica
cd PruebaTecnica/AutomatizacionE2E

**2 Instalar dependencias:**
npm install

**3 Instalar navegadores de Playwright:**
npx playwright install --with-deps

**4 Ejecutar pruebas:**
Todas las pruebas:
npx playwright test

Con interfaz visible:
npx playwright test --headed

Ejecutar un test específico:
npx playwright test tests/e2e.shop-flow.spec.js
npx playwright test tests/e2e.registration.spec.js
npx playwright test tests/e2e.password-reset.spec.js

**5 Abrir reporte HTML:**
npx playwright show-report

### Resultados
- Reporte HTML con métricas y evidencias.  
- Videos de ejecución.  
- Screenshots de fallos.  
- Archivos *trace* para depuración detallada.  

---