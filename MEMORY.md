# Estado del proyecto

- Spec activa: [002-persistence](specs/002-persistence/spec.md).
- Autorización: Alex indicó «perfecto, desarrolla la spec», tras concretar decisiones y modelo.
- Base: pnpm 10.33.4, Node 22, React/Vite, Express/tsx; [001](specs/001-foundation/validation.md) conserva su evidencia.
- 002 implementa SQLite/Drizzle, migraciones, seed demo, snapshots y backup; sin nuevos endpoints ni motor monetario.
- Datos de validación exclusivamente temporales bajo .cache/002-tests; no se inicializa la base de desarrollo del usuario.
- T01–T06 completadas técnicamente; 21 pruebas pasan. La aceptación humana de la entrega no está registrada.
- [Validación 002](specs/002-persistence/validation.md) registra controles y límites.
- No hay commits/pushes, cambios de remoto ni aceptación humana de la entrega registrados por el agente.
