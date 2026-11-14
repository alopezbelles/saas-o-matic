# Contratos API implementados

## GET /health

- Sin cuerpo, autenticación ni dependencias externas.
- Respuesta HTTP 200, Content-Type application/json.
- Cuerpo: `{"status":"ok"}`.
- Indica que el proceso HTTP responde; no certifica base de datos ni servicios externos.

Las rutas desconocidas y POST /health responden 404.
No hay endpoints de clientes, simulaciones, configuración fiscal ni persistencia.
El formato de errores de negocio se definirá en su spec; no se atribuye al 404 por defecto de Express.

API local: http://127.0.0.1:3000. PORT permite cambiar el puerto.

002 añade persistencia interna y comandos DB, sin rutas HTTP nuevas. /health no requiere una base inicializada.
