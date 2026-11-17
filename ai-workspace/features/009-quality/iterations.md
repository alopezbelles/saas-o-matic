# 009 Quality — Iteraciones del trabajo con IA

## Inventario y cobertura antes de ampliar las suites

Codex inventarió scripts, casos descubiertos y aislamiento, contrastando el enunciado aportado con implementación y pruebas. Un flujo representativo verificó el entorno; ese resultado parcial no se presentó como validación completa. La matriz separó pruebas reutilizadas, huecos pendientes y actividades de entrega asignadas a 010.

## Resiliencia, seguridad y proveedor real

La revisión reutilizó suites de dominio, API y frontend, y añadió cobertura de markup persistido y búsqueda literal. El caso comprobó que contenido con apariencia de HTML o SQL permanecía como datos, sin sustituir la inspección de validaciones, consultas, límites y errores.

El primer smoke FX recibió ERR_NETWORK_ACCESS_DENIED del sandbox y conservó EUR con reintento. La repetición con acceso de red autorizado respondió correctamente y permitió observar CORS y conversiones. La [comprobación real](../../../specs/009-quality/validation.md#qa-fx-live-009) conserva ambos resultados; no se confundió el bloqueo del entorno con un fallo del proveedor ni se dedujo éxito externo de fixtures.

## Detección y reproducción de 009-QA-01

La ampliación de estados encontró primero un problema del interceptor de pruebas ante peticiones iniciales de StrictMode. Se corrigió su control antes de interpretar resultados de producto. Después se reprodujo un defecto real: un nombre válido de 200 caracteres sin cortes expandía el grid del simulador.

Los cuatro casos mantuvieron fallos esperados en la aserción geométrica. Aunque el runner pudiera devolver código cero, el requisito de reflujo permaneció con cambios necesarios. La [revisión T03](../../../specs/009-quality/validation.md#t03--accesibilidad-y-responsive) distingue casos implementados, ejecuciones fallidas y comportamiento esperado.

## Corrección y regresión sobre el mismo contenido

Codex aplicó estilos locales para permitir ajuste de texto y evitar que el contenido ensanchara el grid, conservando el nombre completo. Extendió el mismo cliente largo al guardado, confirmación e historial; retiró test.fail cuando pasaron los cuatro anchos y comprobó las regresiones visuales existentes.

La [evidencia T04](../../../specs/009-quality/validation.md#t04--corrección-y-regresiones) conserva el antes y el después. La solución no cambió contratos, motor o persistencia ni ocultó el problema truncando datos válidos.

## Cierre y límites

Los controles globales y E2E del código de cierre pasaron. Una comparación inicial del inventario de datos tuvo un error de estructura de arrays; se corrigió la lectura y se comprobó la igualdad de rutas y hashes sin conectarse a la base existente. El [cierre T05](../../../specs/009-quality/validation.md#t05--verificación-final-y-cierre-técnico) respalda conformidad dentro del alcance revisado.

Persisten límites explícitos: Chromium, contraste representativo y ampliación CSS/reflujo equivalente, sin zoom nativo, lector de pantalla o auditoría exhaustiva. El [índice de evidencias](../../testing/008-010-evidence-index.md) identifica artefactos temporales sobrescribibles. La comprobación FX es puntual y no garantiza producción; la aceptación humana final no consta.
