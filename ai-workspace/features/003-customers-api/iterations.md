# 003 Customers API — Iteraciones del trabajo con IA

## Ajuste del contrato y compatibilidad con 002

El contraste con el enunciado detectó que la preparación exigía un campo de contacto adicional. Se corrigió el alta a cinco campos y Codex mantuvo la columna histórica como opcional mediante una migración nueva. Así se reutilizó la persistencia sin inventar contactos, eliminar valores previos o modificar la migración ya aplicada.

La decisión y sus alternativas están documentadas en el [ADR de compatibilidad](../../decisions/ADR-004-customers-api.md); la autorización de ejecución siguió al ajuste del alcance.

## Contraste fiscal antes de codificar

Codex contrastó fuentes para separar las familias de identificadores y preparar fixtures independientes. Se identificó una discrepancia sobre K/L/M y se priorizó la nota del organismo emisor adoptada en la spec, dejando los límites de formatos cubiertos explícitos.

El resultado fue una referencia previa al código fiscal, evitando usar la propia función como oráculo o presentar una coincidencia de control como verificación censal. La [tabla y fuentes](../../../specs/003-customers-api/fiscal-rules.md) conservan el detalle sin repetir los algoritmos aquí.

## Corrección de la migración con relaciones existentes

Las primeras pruebas HTTP pasaron, pero la prueba de migración detectó un fallo de clave foránea al reconstruir la tabla de clientes con simulaciones relacionadas. Codex identificó la persistencia de contadores diferidos durante la reconstrucción y ajustó la secuencia de comprobación del grafo e integridad antes del commit, manteniendo activas las FK.

El caso se amplió para exigir rollback cuando el grafo final es inválido. La corrección preservó las garantías de datos en vez de desactivarlas para superar la prueba.

## Revisión de entradas, apertura y cierre

La iteración incorporó rechazos adicionales de identificadores normalizados demasiado largos y dominios IP, además de comprobar el esquema vigente al abrir la conexión lazy. Se verificaron errores sanitizados, búsquedas literales, conflictos concurrentes y recuperación sin inicialización implícita.

El cierre técnico y los [resultados y límites](../../../specs/003-customers-api/validation.md) permanecen en la validación: incluye las restricciones del control fiscal y que la prueba de cierre simula un evento dentro del proceso hijo. No se acredita una señal real del sistema, UI o nuevas ejecuciones mediante esta memoria. No consta aceptación humana final.
