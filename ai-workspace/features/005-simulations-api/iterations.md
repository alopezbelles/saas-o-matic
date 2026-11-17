# 005 Simulations API — Iteraciones del trabajo con IA

## Adaptación y contratos reutilizables

La propuesta inicial incluía paquetes y rutas de pruebas inexistentes, límites antiguos y decisiones ya resueltas. Codex adaptó los cinco documentos y planteó las cuestiones pendientes: configuración pública, resultado e histórico y semántica de errores. Las confirmaciones constan en las [aclaraciones](../../../specs/005-simulations-api/clarifications.md).

La implementación comenzó por contratos y parsers. Se reutilizaron UUID y consumos; la extracción limitada de paginación e InputError evitó duplicación y dependencias circulares, preservando compatibilidad con clientes. Los endpoints continuaron pendientes hasta sus tareas correspondientes. El registro inicial de preparación y T01 se incorporó tras autorización posterior; las siguientes tareas conservaron instrucciones previas en el registro existente.

## Cálculo y persistencia antes de HTTP

Codex integró el motor con un servicio y un repositorio transaccional. La lectura del cliente, cálculo y snapshots quedaron alineados; se reutilizó la inserción existente mediante savepoints y se validó el DTO antes del commit.

Las pruebas aisladas comprobaron rollback tras inserción, transacción exterior, reapertura y conservación del histórico frente a cambios de cliente o política. Después se añadió el alta HTTP, compartiendo el protocolo JSON con clientes y traduciendo errores sin exponer información interna. Los casos negativos fueron pruebas deliberadas, no fallos funcionales detectados en producción.

## Lecturas e incidencia real de pruebas

El histórico se implementó como consulta paginada de datos guardados, sin volver a invocar el motor. La configuración se obtuvo de reglas y versiones reales, sin DB y con copias que no permitieran alterar las fuentes.

La primera ejecución focalizada falló porque un fixture lanzaba Error genérico mientras esperaba una respuesta de indisponibilidad. El manejador devolvía correctamente un error interno. Se corrigió únicamente el fixture para lanzar HttpError de indisponibilidad; la repetición y regresiones pasaron. La [evidencia T04](../../testing/005-simulations-api-t04.md) y su [salida](../../testing/005-simulations-api-t04.txt) conservan ambos resultados.

## Revisión y cierre técnico

Los controles globales pasaron en T05. La revisión también corrigió referencias documentales que aún presentaban endpoints como pendientes, conservando los estados históricos de tareas anteriores. La [evidencia final](../../testing/005-simulations-api-t05.md) y la [revisión](../../reviews/005-simulations-api-t05.md) respaldan el cierre sin cambios de esquema, dependencias, frontend o datos reales. No consta aceptación humana final ni se atribuyen a 005 funcionalidades posteriores de divisas o interfaz.
