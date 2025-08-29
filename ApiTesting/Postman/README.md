Prueba Técnica – FakeStore API (Postman)

Este módulo contiene la colección de pruebas automatizadas en Postman para la API de FakeStore
. Se validan los principales flujos de negocio para la gestión de productos, incluyendo ejecución con Newman y generación de reportes en HTML.

Requerimientos validados

GET /products – Consultar todos los productos y filtrar los que pertenecen a la categoría electronics.

GET /products/category/electronics – Validar que todos los productos del resultado sean de esa categoría.

GET /products/:id – Consultar un producto específico (usando el productId obtenido en pasos anteriores).

POST /products – Crear un producto con datos dinámicos (título, descripción, precio, imagen).

PUT /products/:id – Actualizar la imagen del producto recién creado y validar que el cambio se refleje.

Cada request incluye tests automáticos que verifican:

Status code, headers y performance (< 1500 ms).

Contrato JSON (con tv4).

Reglas de negocio (id válido, price > 0, URL de imagen válida, categoría correcta).

Encadenamiento de variables (productId, newProductId, updatedImageUrl).

Estructura
PruebaTecnica/
└─ postman/
   ├─ FakeStore.postman_collection.json
   ├─ FakeStore.postman_environment.json
   ├─ README.md
   └─ reports/
       └─ fakestore-report.html   (se genera al ejecutar con Newman)

Uso en Postman

Abrir Postman → Importar la colección:

FakeStore.postman_collection.json

FakeStore.postman_environment.json

Seleccionar el environment FakeStore.

Ejecutar en orden:

GET Products

GET Product Category

GET Product Id

POST Product Create

PUT Product Edit Image

Los tests encadenan automáticamente los IDs e imágenes entre requests.

Ejecución con Newman (CLI)

Instalar Newman y el reporter HTML Extra:

npm i -g newman newman-reporter-htmlextra


Ejecutar la colección:

newman run postman/FakeStore.postman_collection.json \
  -e postman/FakeStore.postman_environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export postman/reports/fakestore-report.html


En Windows PowerShell, usar en una sola línea:

newman run ".\postman\FakeStore.postman_collection.json" -e ".\postman\FakeStore.postman_environment.json" --reporters cli,htmlextra --reporter-htmlextra-export ".\postman\reports\fakestore-report.html"

Reporte HTML

Al ejecutar con Newman se genera un archivo en:

postman/reports/fakestore-report.html


Este reporte muestra:

Resultados de cada request.

Tests pasados y fallidos.

Tiempo de respuesta y estadísticas.

Abrir en navegador con:

start .\postman\reports\fakestore-report.html

Prácticas aplicadas

Validación de contrato JSON y reglas de negocio.

Datos dinámicos en creación de producto (Pre-request Script).

Encadenamiento de variables para requests dependientes.

Validaciones de performance (< 1500 ms).

Reporte HTML con Newman + htmlextra.

Documentación clara para reproducir el flujo.