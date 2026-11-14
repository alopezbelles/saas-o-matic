# Producto y alcance

SaaS-O-Matic ayuda al comercial a registrar una empresa, encontrarla y presupuestar consumo mensual transparente. No es un sistema de cobros ni una asesoría tributaria.

## MVP

Alta con empresa, identificador fiscal, contacto, país y plan. Búsqueda por nombre o identificador. Ficha responsive e historial. Simulador con usuarios, almacenamiento y llamadas; desglose acumulativo, impuesto según configuración aprobada y cambio de moneda de visualización. Guardado recuperable desde SQLite.

## Flujos

1. Clientes → nuevo cliente → errores o confirmación → ficha.
2. Búsqueda → ficha → nueva simulación → cambiar consumo/divisa → guardar → historial.
3. Fallo externo → mantener formulario y EUR → reintentar.
4. Recarga → recuperar datos persistidos; no recalcular precios históricos con reglas nuevas.

## Éxito

Todos los requisitos S1 trazados, cálculo determinista, datos conservados tras reinicio, onboarding local reproducible, revisión humana documentada y estados UI comprobados. No inventar métricas de producto no medidas.

## Fuera del MVP

Login/RBAC, pagos, facturas legales, suscripciones recurrentes, CRUD completo de planes, edición/borrado de clientes, descuentos, coste de almacenamiento/API, optimización automática, dashboards KPI inventados, exportaciones y multi-tenant. El título “Optimizer” no exige un motor adicional.
Despliegue público: opcional hasta aclarar entrega; instrucciones locales sí exigidas. Si se publica sin autenticación, exclusivamente demo ficticia aislada.
