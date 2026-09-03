# Auditoría del banco de preguntas PME 2026

**Fecha de inicio:** 4 de agosto de 2026  
**Última ampliación:** 4 de agosto de 2026  
**Versión publicada:** `2026.08.04.3`

## Resultado

El simulador utiliza un banco trazable formado por:

- **250 conceptos base revisados.**
- **1.500 formulaciones de pregunta.**
- **100 conceptos de parte común** y **150 de parte específica**.
- Cinco temas comunes y diez temas específicos, respetando la estructura de las bases.
- Seis formulaciones por cada concepto auditado.
- Cuatro alternativas por pregunta y una sola respuesta marcada como correcta.
- Explicación breve, comentario específico sobre las alternativas incorrectas, fuente oficial, referencia concreta y fecha de revisión.

La ampliación de 1.000 a 1.500 formulaciones no introduce hechos jurídicos nuevos sin verificar: crea formulaciones adicionales de los mismos 250 conceptos revisados. El modo estudio usa ahora conceptos independientes como límite real de cada sesión para evitar equivalencias repetidas.

## Cobertura mínima por tema

- Cada tema de la **parte común** dispone de **120 formulaciones**, basadas en 20 conceptos auditados.
- Cada tema de la **parte específica** dispone de **90 formulaciones**, basadas en 15 conceptos auditados.
- Las sesiones por tema quedan limitadas al número de conceptos independientes disponibles: 20 en temas comunes y 15 en temas específicos.
- Las sesiones amplias por parte o por todo el temario sí permiten 50 preguntas independientes cuando hay al menos 50 conceptos disponibles.
- En una misma sesión no se repite el mismo enunciado ni el mismo concepto auditado.
- Se evitan, cuando es posible, las preguntas utilizadas en las tres sesiones de estudio más recientes.

## Bloques completados

### Parte común

- [x] Tema 1. Constitución Española de 1978 — 20 conceptos independientes / 120 formulaciones
- [x] Tema 2. Gobierno y Administración — 20 conceptos independientes / 120 formulaciones
- [x] Tema 3. Régimen jurídico del personal público — 20 conceptos independientes / 120 formulaciones
- [x] Tema 4. Contrato de trabajo en la Administración — 20 conceptos independientes / 120 formulaciones
- [x] Tema 5. Igualdad, violencia de género, discapacidad, dependencia y no discriminación LGTBI — 20 conceptos independientes / 120 formulaciones

### Parte específica

- [x] Tema 1. Conductor, permisos, infracciones y sanciones — 15 conceptos independientes / 90 formulaciones
- [x] Tema 2. Vehículo, documentación, carga y personas — 15 conceptos independientes / 90 formulaciones
- [x] Tema 3. Seguridad activa y pasiva — 15 conceptos independientes / 90 formulaciones
- [x] Tema 4. La vía y su utilización — 15 conceptos independientes / 90 formulaciones
- [x] Tema 5. Velocidad y distancias — 15 conceptos independientes / 90 formulaciones
- [x] Tema 6. Maniobras — 15 conceptos independientes / 90 formulaciones
- [x] Tema 7. Conducción nocturna y condiciones adversas — 15 conceptos independientes / 90 formulaciones
- [x] Tema 8. Señalización — 15 conceptos independientes / 90 formulaciones
- [x] Tema 9. Accidentes, delitos, alcohol y drogas — 15 conceptos independientes / 90 formulaciones
- [x] Tema 10. Elementos y funcionamiento del vehículo — 15 conceptos independientes / 90 formulaciones

## Controles aplicados

- Encaje de cada concepto con un epígrafe de las bases oficiales.
- Consulta prioritaria de BOE, DGT, INSST y otros organismos públicos competentes.
- Referencia a artículo, anexo o apartado cuando la fuente lo permite.
- Revisión de las cuatro alternativas para reducir respuestas dobles o ambiguas.
- Exclusión del modo examen de cualquier registro sin estado `verificada`.
- Validaciones automáticas de estructura, identificadores, temas, cuatro opciones, única correcta, fuente, explicación y duplicados.
- Validación de que los quince temas exponen solo cantidades posibles sin repetir conceptos.
- Comprobación de que cada simulacro oficial contiene exactamente 40 preguntas comunes y 60 específicas, con 100 conceptos distintos.
- Comprobación de que las sesiones de estudio entregan identificadores, enunciados y conceptos únicos cuando la selección dispone de banco suficiente.
- Pruebas funcionales de puntuación, temporizador, histórico, corrección, estadísticas, repaso, cuaderno de errores y diseño móvil/escritorio.

## Funciones incorporadas

- Corrección razonada con respuesta elegida, respuesta correcta, explicación y fuente.
- Comentario de por qué la alternativa fallada no es válida.
- Modo examen oficial y modo estudio.
- Contador visible de preguntas disponibles y conceptos auditados para la selección elegida.
- Repaso de falladas y preguntas en blanco.
- Entrenamiento automático de puntos débiles.
- Estadísticas por tema y evolución de resultados.
- Marcado de respuesta segura, dudosa o desconocida.
- Cuaderno de errores con criterio de dominio tras tres aciertos posteriores.
- Tiempo empleado por pregunta.
- Botón de reporte con identificador único de la pregunta.
- Botón para reiniciar estadísticas de prueba.
- Control de versión y fecha de revisión del banco.

## Seguridad y mantenimiento

La versión inmediatamente anterior se conserva en la rama `backup-pre-study-pool-2026-08-04`, además de la copia previa a la auditoría. La web publicada comprueba la integridad del paquete base antes de abrirlo y valida después que el banco ampliado contenga 250 conceptos, 1.500 formulaciones y cobertura suficiente en todos los temas.

La revisión y trazabilidad reducen de forma importante el riesgo de errores, pero no constituyen una garantía jurídica absoluta. Ante una modificación normativa posterior, prevalecen siempre las bases, el BOE y la publicación oficial vigente.
