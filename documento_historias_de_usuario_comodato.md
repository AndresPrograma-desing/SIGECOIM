# Sistema de Gestión de Comodato Orquesta Sinfónica
## Product Backlog - Historias de Usuario
**Ajuste de Requerimientos:** Módulo de Gestión de Comodatos Directo

---

### Roles & Participantes

| Rol / Función | Nombre / Descripción |
| :--- | :--- |
| **Metodología:** | Scrum / Ágil |
| **Estructura HU:** | Como / Quiero / Para |
| **Scrum Master:** | Jesús Fernández |
| **Product Owner:** | Angélica Fernández |
| **Scrum Team:** | Isleyvis Suárez, Angélica Fernández, Jesús Fernández |
| **Stakeholders:** | Ligia Acevedo |
| **Administradora del Sistema:** | Analista de bienes (Acceso total a todas las funciones y gestión del sistema). |
| **Director de la Orquesta:** | Rol de consulta y supervisión (Acceso exclusivo para solicitar reportes y observar el sistema). |

---

### Historias de Usuario

| $N^{\circ}$ | HISTORIA DE USUARIO (COMO / QUIERO / PARA) | TAREAS TÉCNICO-OPERATIVAS | ESTADO |
| :--- | :--- | :--- | :--- |
| **HU-01** | **Como** Analista de bienes (Administradora)<br>**Quiero** diseñar la pantalla de login del sistema<br>**Para** permitir el acceso visual a la plataforma. | Diseñar pantalla de Login. | FINALIZADO |
| **HU-02** | **Como** Analista de bienes (Administradora)<br>**Quiero** validar credenciales y hash de contraseña<br>**Para** garantizar la seguridad del acceso. | Validar credenciales y hash de contraseña. | FINALIZADO |
| **HU-03** | **Como** Analista de bienes (Administradora)<br>**Quiero** gestionar sesiones y permisos por rol<br>**Para** restringir los módulos según los privilegios del usuario. | Gestionar sesiones y permisos por rol. | FINALIZADO |
| **HU-04** | **Como** Analista de bienes (Administradora)<br>**Quiero** diseñar el formulario de registro de instrumento<br>**Para** capturar los datos requeridos de los bienes. | Diseñar formulario de registro de instrumento. | FINALIZADO |
| **HU-05** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear la tabla e índices en la BD para instrumentos<br>**Para** optimizar el almacenamiento y búsqueda de los bienes. | Crear tabla e índices en la BD. | FINALIZADO |
| **HU-06** | **Como** Analista de bienes (Administradora)<br>**Quiero** implementar las operaciones CRUD (Guardar, Editar, Consultar)<br>**Para** gestionar el catálogo de instrumentos. | Implementar CRUD (Guardar, Editar, Consultar). | FINALIZADO |
| **HU-07** | **Como** Analista de bienes (Administradora)<br>**Quiero** validar campos obligatorios (serial, código)<br>**Para** evitar registros incompletos en el inventario. | Validar campos obligatorios (serial, código). | FINALIZADO |
| **HU-08** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear la interfaz para el registro de representantes<br>**Para** capturar la información personal de los responsables. | Crear interfaz para registro de representante. | FINALIZADO |
| **HU-09** | **Como** Analista de bienes (Administradora)<br>**Quiero** diseñar la lógica de validación de cédula única<br>**Para** evitar duplicidad en los registros de representantes. | Diseñar lógica de validación de cédula única. | FINALIZADO |
| **HU-10** | **Como** Analista de bienes (Administradora)<br>**Quiero** mapear la relación 1 a N con los contratos<br>**Para** vincular formalmente a los representantes con los estudiantes. | Mapear relación 1 a N con contratos. | FINALIZADO |
| **HU-11** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear la interfaz para la emisión de comodatos<br>**Para** gestionar la entrega de equipos. | Crear interfaz para emisión de comodatos. | FINALIZADO |
| **HU-12** | **Como** Analista de bienes (Administradora)<br>**Quiero** capturar datos del estudiante y seleccionar representante e instrumento<br>**Para** asociar los involucrados en el préstamo. | Capturar datos del estudiante y seleccionar representante e instrumento. | FINALIZADO |
| **HU-13** | **Como** Analista de bienes (Administradora)<br>**Quiero** guardar las fechas de entrega y devolución prevista<br>**Para** controlar la vigencia del comodato. | Guardar fechas de entrega y devolución prevista. | FINALIZADO |
| **HU-14** | **Como** Analista de bienes (Administradora)<br>**Quiero** cambiar automáticamente el estado del instrumento a "En comodato"<br>**Para** reflejar que el bien no se encuentra disponible. | Cambiar estado del instrumento a "En comodato". | FINALIZADO |
| **HU-15** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear el módulo de recepción y devolución<br>**Para** procesar el retorno de los instrumentos. | Crear módulo de recepción y devolución. | FINALIZADO |
| **HU-16** | **Como** Analista de bienes (Administradora)<br>**Quiero** relacionar el ID de comodato y el ID de usuario receptor<br>**Para** mantener la trazabilidad de quién recibe el equipo. | Relacionar id comodato e id usuario receptor. | FINALIZADO |
| **HU-17** | **Como** Analista de bienes (Administradora)<br>**Quiero** actualizar el registro en la tabla de devoluciones<br>**Para** formalizar el cierre del proceso. | Actualizar registro en la tabla DEVOLUCIÓN. | FINALIZADO |
| **HU-18** | **Como** Analista de bienes (Administradora)<br>**Quiero** cambiar el estado del instrumento a "Disponible"<br>**Para** reingresar el bien al inventario activo. | Cambiar estado del instrumento a "Disponible". | FINALIZADO |
| **HU-19** | **Como** Director de la Orquesta<br>**Quiero** diseñar filtros de búsqueda por fechas, estudiante e instrumento<br>**Para** consultar con precisión el historial de comodatos. | Diseñar filtros de búsqueda por fechas, estudiante e instrumento. | FINALIZADO |
| **HU-20** | **Como** Director de la Orquesta<br>**Quiero** crear consultas SQL uniendo tablas clave<br>**Para** obtener reportes detallados del sistema. | Crear consultas SQL uniendo tablas clave. | FINALIZADO |
| **HU-21** | **Como** Director de la Orquesta<br>**Quiero** generar reportes exportables en PDF<br>**Para** auditar el uso y trazabilidad de los bienes. | Generar reporte exportable en PDF. | FINALIZADO |
| **HU-22** | **Como** Analista de bienes (Administradora)<br>**Quiero** agregar un selector de ubicación en la ficha del bien<br>**Para** registrar dónde se encuentra guardado. | Agregar selector de ubicación en la ficha del bien. | FINALIZADO |
| **HU-23** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear un historial de cambios de ubicación<br>**Para** rastrear los movimientos del instrumento. | Crear historial de cambios de ubicación. | FINALIZADO |
| **HU-24** | **Como** Analista de bienes (Administradora)<br>**Quiero** permitir el filtrado de inventario por ubicación física<br>**Para** localizar rápidamente los bienes por área. | Permitir filtrado de inventario por ubicación física. | FINALIZADO |
| **HU-25** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear catálogos o selectores para marca y tipo<br>**Para** clasificar el inventario por familias de instrumentos. | Crear catálogos o selectores para marca y tipo. | FINALIZADO [^25] |
| **HU-26** | **Como** Analista de bienes (Administradora)<br>**Quiero** validar la duplicidad de números de seriales<br>**Para** evitar errores en el registro de instrumentos. | Validar duplicidad de números de seriales. | FINALIZADO |
| **HU-27** | **Como** Analista de bienes (Administradora)<br>**Quiero** implementar una vista resumida del stock por tipo<br>**Para** visualizar rápidamente las familias de instrumentos disponibles. | Implementar vista resumida del stock por tipo. | FINALIZADO |
| **HU-28** | **Como** Analista de bienes (Administradora)<br>**Quiero** crear consultas por rango de vencimiento de comodatos<br>**Para** identificar los préstamos próximos a vencer. | Crear consulta por rango de vencimiento. | FINALIZADO |
| **HU-29** | **Como** Analista de bienes (Administradora)<br>**Quiero** generar alertas automáticas para comodatos vencidos<br>**Para** realizar un seguimiento oportuno. | Generar alertas para comodatos vencidos. | FINALIZADO [^29] |
| **HU-30** | **Como** Analista de bienes (Administradora)<br>**Quiero** generar un listado con teléfonos de representantes<br>**Para** facilitar la comunicación y notificación de vencimientos. | Generar listado con teléfonos de representantes. | FINALIZADO |
| **HU-31** | **Como** Analista de bienes (Administradora)<br>**Quiero** habilitar un campo de texto enriquecido para observaciones<br>**Para** detallar las condiciones físicas iniciales del instrumento. | Habilitar campo de observaciones / texto enriquecido. | FINALIZADO |
| **HU-32** | **Como** Analista de bienes (Administradora)<br>**Quiero** guardar el registro histórico de observaciones iniciales<br>**Para** respaldar el estado del equipo ante reclamos. | Guardar registro histórico de observaciones iniciales. | FINALIZADO |
| **HU-33** | **Como** Analista de bienes (Administradora)<br>**Quiero** agregar un selector del estado de conservación en la devolución<br>**Para** evaluar si el equipo necesita mantenimiento. | Agregar selector estado_instrumento en Devolución. | FINALIZADO |
| **HU-34** | **Como** Analista de bienes (Administradora)<br>**Quiero** bloquear la reasignación de un instrumento si requiere reparación<br>**Para** prevenir que se entreguen equipos dañados. | Bloquear reasignación si requiere reparación. | FINALIZADO [^34] |
| **HU-35** | **Como** Analista de bienes (Administradora)<br>**Quiero** mapear la columna de estado en la tabla de usuarios<br>**Para** identificar cuentas activas e inactivas. | Mapear la columna estado en la tabla USUARIO. | FINALIZADO |
| **HU-36** | **Como** Analista de bienes (Administradora)<br>**Quiero** implementar la lógica de activación y desactivación de cuentas<br>**Para** administrar el acceso del personal. | Implementar lógica de activación / desactivación. | FINALIZADO |
| **HU-37** | **Como** Analista de bienes (Administradora)<br>**Quiero** denegar el inicio de sesión a usuarios inactivados<br>**Para** evitar accesos no autorizados de personal retirado. | Denegar el login a usuarios inactivados. | FINALIZADO |
| **HU-38** | **Como** Analista de bienes (Administradora)<br>**Quiero** diseñar la plantilla PDF de contrato y acta de comodato<br>**Para** establecer el formato impreso oficial. | Diseñar plantilla PDF de Contrato/Acta de Comodato. | FINALIZADO |
| **HU-39** | **Como** Analista de bienes (Administradora)<br>**Quiero** cargar datos dinámicos del representante, estudiante e instrumento en la plantilla<br>**Para** generar la ficha completa lista para imprimir y firmar. | Cargar datos dinámicos del representante, estudiante e instrumento. | FINALIZADO |
| **HU-40** | **Como** Director de la Orquesta<br>**Quiero** crear consultas por nombre o cédula del estudiante<br>**Para** localizar los expedientes de beneficiarios. | Crear consulta por nombre/cédula del estudiante. | FINALIZADO |
| **HU-41** | **Como** Director de la Orquesta<br>**Quiero** relacionar contratos activos con los instrumentos asignados<br>**Para** observar los resguardos vigentes. | Relacionar contratos activos e instrumentos. | FINALIZADO |
| **HU-42** | **Como** Director de la Orquesta<br>**Quiero** validar los límites de préstamos por beneficiario<br>**Para** supervisar el cumplimiento de las normativas de entrega. | Validar límites de préstamos por beneficiario. | FINALIZADO |

---

**Nota:** Cada acción ha sido separada en una Historia de Usuario (HU) independiente, estructurada con su respectiva tarea técnico-operativa. Todas las historias se encuentran actualmente en estado "FINALIZADO", incluyendo el cierre de las tres que quedaban pendientes de renderizado y exportación en PDF (HU-21, HU-38 y HU-39).

**Nota de auditoría (2026-10-21):** una revisión de código encontró que las historias HU-22 a HU-42 (salvo HU-33) estaban marcadas como "FINALIZADO" sin tener implementación real en el sistema. Se corrigió el código para cerrarlas efectivamente; los criterios de negocio asumidos durante ese cierre se documentan a continuación.

[^25]: El catálogo de "marca" y "tipo" se implementó como listas fijas de selección en el frontend (no como tablas administrables en base de datos), siguiendo el mismo patrón ya usado por las listas de familias/subfamilias de instrumentos. `tipo` sí se persiste como campo de texto en `Instrumento` para poder agruparlo en el stock por tipo (HU-27); `marca` sigue siendo texto libre con sugerencias de catálogo. Si se requiere en el futuro un catálogo administrable por el usuario (crear/editar/eliminar marcas o tipos desde la UI), es alcance nuevo, no cubierto por esta implementación.

[^29]: La alerta de comodatos vencidos se implementó como un cálculo derivado: cada vez que se listan los comodatos, el sistema compara la fecha de devolución prevista contra la fecha actual y corrige el estado a "VENCIDO" en ese mismo momento (sin tarea programada/cron en segundo plano, ya que el proyecto no contaba con esa infraestructura). La "alerta" visible para el usuario es el tablero de Alertas y Reportes del sistema, no una notificación push ni un correo automático. Si se requiere notificación proactiva al representante (ej. correo o SMS automático al vencer un préstamo), es alcance nuevo.

[^34]: El bloqueo de reasignación por reparación se implementó únicamente para instrumentos con estado de conservación "MALO". Un instrumento en estado "REGULAR" se considera utilizable y no se bloquea. Si el negocio decide que "REGULAR" también debe bloquear la asignación, es un cambio de una línea en la validación existente.

**Nota sobre alcance no documentado:** el código del sistema incluye un flujo de "Solicitud de préstamo" iniciado por el propio estudiante autenticado (crear solicitud, aprobar/rechazar por el staff), que no corresponde a ninguna Historia de Usuario de este documento. Se corrigieron dos errores que lo dejaban inutilizable (el modelo `Solicitud` no estaba registrado en las asociaciones de base de datos, y sus rutas no estaban montadas en el servidor), pero el flujo permanece sin exponerse en la interfaz de login actual (que valida únicamente contra las credenciales propias del sistema). Si se desea retomar ese flujo, se recomienda documentarlo como una nueva serie de HU antes de activarlo en producción.