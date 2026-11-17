# 002 Persistence — Prompts consolidados

## 1. Concretar el modelo antes de implementar

**Contexto y objetivo.** La base de infraestructura está disponible, pero la propuesta de persistencia contiene decisiones abiertas y referencias a un diccionario ausente. Define un alcance ejecutable antes de modificar el proyecto.

**Instrucciones.** Revisa las fuentes existentes y propón tecnología, modelo y guardas de consumo proporcionados al ejercicio. Conserva el histórico en EUR y evita duplicados fiscales por país. Explica las elecciones y deja un único modelo canónico; no inventes precios, tasas fiscales o funcionalidades de siguientes specs. No instales dependencias ni crees bases durante esta preparación.

**Criterio de aceptación.** Las decisiones deben quedar explícitas y revisables, distinguiendo propuestas, acuerdos y autorización posterior de implementar.

## 2. Implementar esquema y migraciones con garantías

**Contexto y objetivo.** El modelo se ha concretado y su implementación está autorizada. Añade SQLite, Drizzle y el driver manteniendo el stack existente.

**Instrucciones.** Comprueba compatibilidad y binario nativo antes de instalar. Implementa el modelo acordado, conexión y migraciones explícitas. Revisa el SQL generado para asegurar las restricciones requeridas y aplica cambios e historial de forma transaccional, detectando deriva. No migres archivos desconocidos ni ejecutes inicialización desde health o el arranque de la API.

**Criterio de aceptación.** La reaplicación debe conservar datos y las migraciones fallidas no dejar cambios parciales. Mantén contratos compartidos independientes del ORM.

## 3. Conservar históricos y preparar una demo segura

**Contexto y objetivo.** La persistencia debe guardar y recuperar el resultado recibido sin introducir lógica tarifaria.

**Instrucciones.** Valida el payload técnico y toma los snapshots del cliente dentro de la transacción de guardado. Conserva el histórico sin recálculo ni consultas externas. Implementa el seed solo para una base demo reconocida, con clientes ficticios y sin simulaciones que inventen impuestos. Su repetición debe conservar datos; los conflictos deben fallar sin sobrescribir ni borrar.

**Criterio de aceptación.** Comprueba aislamiento del histórico y reejecución/conflicto del seed sobre archivos propios, sin usar datos de desarrollo.

## 4. Verificar integridad y recuperación

**Contexto y objetivo.** El cierre necesita evidencia del comportamiento real de SQLite y de sus operaciones, además de compilación correcta.

**Instrucciones.** Prueba reapertura, restricciones, migraciones, bloqueos y rutas inseguras con bases temporales. Verifica backup consistente hacia un archivo nuevo y lectura posterior, sin modificar el origen. Reutiliza las suites existentes, conserva las regresiones de 001 y cierra recursos propios. Registra fallos, correcciones y límites de lo ejecutado.

**Criterio de aceptación.** Los rechazos y la recuperación deben observarse con resultados reales, sin adoptar archivos ajenos, reintentos indefinidos o afirmar validaciones de otras plataformas.
