# Prueba Técnica QA – Automatización y API Testing

Este repositorio contiene el desarrollo de la prueba técnica orientada a **QA Analyst / QA Automation**, incluyendo pruebas manuales, automatización con Playwright, JMeter y Postman.  

El objetivo es mostrar buenas prácticas en la organización, documentación y ejecución de pruebas.

---

## Documentación
Toda la documentación detallada se encuentra centralizada en Notion:  

---

## Herramientas utilizadas
- **Java JDK** (para ejecutar JMeter)
- **Apache JMeter** (pruebas de carga / rendimiento)
- **Postman + Newman** (pruebas de APIs y reportes HTML)
- **Playwright** (automatización E2E de frontend)
- **Git + GitHub** (control de versiones)
- **PowerShell / Bash** (scripts de ejecución)

---

## Estructura del repositorio
├── jmeter/ # Planes de prueba (.jmx), resultados (.jtl), reportes
├── postman/ # Colecciones de pruebas y reportes con Newman
├── playwright/ # Automatización E2E (Page Objects, tests, fixtures)
├── scripts/ # Scripts auxiliares (ejecución y generación de reportes)
├── .gitignore # Archivos/carpetas excluidas (jdk, jmeter, binarios)
└── README.md # Documentación principal

---

## Ejecución de pruebas

### 1. Requisitos previos
Asegúrate de tener instalado:
- **Java JDK** (21+ recomendado) → [Descargar](https://adoptium.net/)
- **Apache JMeter** (5.6+) → [Descargar](https://jmeter.apache.org/download_jmeter.cgi)
- **Node.js** (para Playwright) → [Descargar](https://nodejs.org/)
- **Postman** o **Newman CLI** (para pruebas de API)

### 2. Clonar el repositorio
bash
git clone https://github.com/Cesar9810/PruebaTecnica
cd tu-repo

### 3. Pruebas con JMeter

Modo no-GUI:

jmeter -n -t ./jmeter/test-plan.jmx -l ./jmeter/results/result.jtl -e -o ./jmeter/results/report

### 4. Pruebas con Postman + Newman
newman run ./postman/collection.json -r cli,html --reporter-html-export ./postman/report.html

### 5. Pruebas con Playwright

Instalar dependencias:

cd playwright
npm install


Ejecutar todas las pruebas con reporte HTML:

npx playwright test --reporter=html


Abrir reporte:

npx playwright show-report

## Buenas prácticas aplicadas

Organización modular del repo (carpetas separadas por herramienta).

Exclusión de binarios (JDK, JMeter) mediante .gitignore.

Scripts para ejecución reproducible en cualquier entorno.

Documentación centralizada (README + Notion).
