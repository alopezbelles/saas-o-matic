# 009 Quality — Prompts consolidados

## 1. Contrastar requisitos y cobertura disponible

**Contexto y objetivo.** El recorrido funcional existe. Identifica qué está cubierto y qué necesita revisión antes de ampliar las pruebas.

**Instrucciones.** Inspecciona scripts, descubrimiento de suites, fixtures y aislamiento. Vincula los requisitos del enunciado con código, pruebas y resultados, distinguiendo evidencia anterior de comprobación actual. Reutiliza los casos pertinentes y reserva instalación limpia y paquete de entrega para 010.

**Criterio de aceptación.** La matriz debe identificar huecos y límites reales. Diferencia pruebas previstas, implementadas, ejecutadas y superadas; no declares éxito por encontrar un archivo de test.

## 2. Revisar resiliencia, seguridad básica y FX real

**Contexto y objetivo.** Comprueba los límites de las operaciones integradas y completa únicamente huecos relevantes.

**Instrucciones.** Reejecuta casos críticos de dominio, contratos, persistencia y recuperación con datos temporales. Revisa entradas, SQL parametrizado, límites de petición, errores, logs y privacidad del proveedor. Añade un caso de contenido persistido y búsqueda literal cuando lo justifique la cobertura. Mantén FX determinista en suites y realiza su comprobación real por separado.

**Criterio de aceptación.** Conserva resultados e incidencias de conectividad sin confundirlos con defectos de aplicación. No atribuyas a la revisión básica un pentest, escaneo exhaustivo o garantía futura de disponibilidad.

## 3. Detectar y corregir defectos de interacción

**Contexto y objetivo.** Amplía la revisión visual a estados y contenido límite, sin asumir que las pantallas normales cubren todos los casos.

**Instrucciones.** Comprueba carga, error, vacío, confirmación, teclado y asociaciones accesibles en los cuatro anchos acordados. Utiliza contenido largo válido y mide geometría. Si detectas un defecto, conserva su reproducción y el requisito como no conforme; distingue errores del interceptor o harness de problemas de producto. Corrige con alcance local y conserva el texto completo.

**Criterio de aceptación.** Retira expectativas de fallo únicamente cuando la misma regresión pase. Extiende la comprobación a guardado, confirmación e historial sin cambiar contratos o reglas de negocio.

## 4. Cerrar con resultados verificables

**Contexto y objetivo.** Comprueba el código resultante de las correcciones y prepara el veredicto técnico.

**Instrucciones.** Ejecuta los controles globales secuencialmente, sin gates concurrentes, y repite E2E con aislamiento. Contrasta cada requisito con su resultado, revisa limpieza y preservación de datos sin abrir bases de desarrollo. Conserva las ejecuciones fallidas y diferencia artefactos efímeros de evidencia canónica.

**Criterio de aceptación.** No cierres requisitos bloqueados por defectos ni equipares código cero con ausencia de fallos esperados. Declara límites de navegador, ampliación, contraste y proveedor; separa cierre técnico, aceptación humana y entrega posterior.
