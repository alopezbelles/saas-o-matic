# Constitución

1. Mantener un monolito modular con dos apps en un repositorio; complejidad proporcional al reto.
2. Implementar solo requisitos y tareas aprobados; cambiar primero la spec cuando cambie el comportamiento.
3. Separar transporte, validación, orquestación, dominio y persistencia.
4. Validar cada frontera; backend autoritativo y consultas parametrizadas.
5. Dinero exacto, reglas versionadas e histórico inmutable.
6. Proteger datos: tests aislados, migraciones revisadas, ninguna operación destructiva implícita.
7. Cerrar requisitos con pruebas observables, no por confianza en el agente.
8. Justificar y autorizar dependencias; fijar versiones reproducibles en lockfile.
9. Mantener trazabilidad requisito → spec → tarea → test → evidencia.
10. No exponer secretos; datos ficticios en demo. Accesibilidad y errores recuperables forman parte del producto.
