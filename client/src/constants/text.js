// Todos los textos visibles de la UI, centralizados para facilitar su edición
// y una futura internacionalización.

export const COMMON = {
  actions: 'Acciones',
  edit: 'Editar',
  delete: 'Eliminar',
  cancel: 'Cancelar',
  save: 'Guardar cambios',
  register: 'Registrar',
  all: 'Todos',
  notAvailable: '—',
};

export const LOGIN = {
  title: 'SIGECOIM',
  subtitle: 'Gestión de comodatos de instrumentos musicales',
  errorTitle: 'No se pudo iniciar sesión',
  genericError: 'No se pudo iniciar sesión.',
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  submit: 'Iniciar sesión',
};

export const NAV = {
  estudiantes: 'Estudiantes',
  instrumentos: 'Instrumentos',
  comodatos: 'Comodatos',
  usuarios: 'Usuarios',
  configuracion: 'Configuración',
  logout: 'Cerrar sesión',
  searchPlaceholder: 'Buscar...',
  notifications: 'Notificaciones',
  notificationsEmpty: 'No tenés notificaciones nuevas.',
  commandPaletteCategory: 'Ir a',
  commandPalettePlaceholder: 'Buscar una página...',
};

export const ESTUDIANTES = {
  pageTitle: 'Estudiantes',
  pageSubtitle: 'Censo de alumnos beneficiarios de préstamos.',
  newButton: 'Nuevo estudiante',
  editTitle: 'Editar estudiante',
  newTitle: 'Nuevo estudiante',
  minorDescription: 'Estudiante menor de edad: se requieren los datos del representante legal.',
  minorWarning: 'Estudiante menor de edad: representante legal obligatorio.',
  loadError: 'No se pudieron cargar los estudiantes.',
  saveError: 'No se pudo guardar el estudiante.',
  deleteError: 'No se pudo eliminar el estudiante.',
  futureBirthdateError: 'La fecha de nacimiento no puede ser una fecha futura.',
  emptyMessage: 'No hay estudiantes registrados.',
  deleteTitle: 'Eliminar estudiante',
  deleteConfirm: (nombre, apellido) => `¿Eliminar a ${nombre} ${apellido}? Esta acción no se puede deshacer.`,
  columns: {
    nombre: 'Nombre',
    cedula: 'Cédula',
    edad: 'Edad',
    representante: 'Representante',
    mayorDeEdad: 'Mayor de edad',
  },
  fields: {
    cedula: 'Cédula',
    nombre: 'Nombre',
    apellido: 'Apellido',
    fechaNacimiento: 'Fecha de nacimiento',
    telefono: 'Teléfono',
    direccion: 'Dirección',
    repCedula: 'Cédula del representante',
    repNombre: 'Nombre del representante',
    repApellido: 'Apellido del representante',
    repTelefono: 'Teléfono del representante',
    repEmail: 'Correo del representante',
    repDireccion: 'Dirección del representante',
  },
};

export const INSTRUMENTOS = {
  pageTitle: 'Instrumentos',
  pageSubtitle: 'Inventario de instrumentos musicales.',
  newButton: 'Nuevo instrumento',
  editTitle: 'Editar instrumento',
  newTitle: 'Nuevo instrumento',
  loadError: 'No se pudieron cargar los instrumentos.',
  saveError: 'No se pudo guardar el instrumento.',
  deleteError: 'No se pudo eliminar el instrumento.',
  emptyMessage: 'No hay instrumentos registrados.',
  deleteTitle: 'Eliminar instrumento',
  deleteConfirm: (nombre) => `¿Eliminar "${nombre}" del inventario? Esta acción no se puede deshacer.`,
  columns: {
    codigo: 'Código',
    instrumento: 'Instrumento',
    medida: 'Medida',
    conservacion: 'Conservación',
    disponibilidad: 'Disponibilidad',
  },
  fields: {
    codigoInventario: 'Código de inventario',
    familia: 'Familia',
    subfamilia: 'Subfamilia',
    nombre: 'Nombre del instrumento',
    marca: 'Marca',
    modelo: 'Modelo',
    numeroSerie: 'Número de serie',
    medida: 'Medida',
    medidaPlaceholder: 'Ej: 4/4, 3/4, 1/2',
    color: 'Color',
    accesorios: 'Accesorios',
    accesoriosPlaceholder: 'Estuche, arco, boquilla...',
    estadoConservacion: 'Estado de conservación',
    disponibilidad: 'Disponibilidad',
  },
  estadosConservacion: [
    { value: 'NUEVO', label: 'Nuevo' },
    { value: 'BUENO', label: 'Bueno' },
    { value: 'REGULAR', label: 'Regular' },
    { value: 'MALO', label: 'Malo' },
  ],
  estadosDisponibilidad: [
    { value: 'DISPONIBLE', label: 'Disponible' },
    { value: 'PRESTADO', label: 'Prestado' },
    { value: 'MANTENIMIENTO', label: 'En mantenimiento' },
  ],
  // Estructura jerárquica por familias: Familia -> Subfamilia -> Instrumentos típicos.
  familias: [
    {
      value: 'CUERDAS',
      label: 'Cuerdas',
      subfamilias: [
        {
          value: 'FROTADAS',
          label: 'Frotadas',
          instrumentos: ['Violín', 'Viola', 'Violonchelo', 'Contrabajo'],
        },
        {
          value: 'PULSADAS',
          label: 'Pulsadas',
          instrumentos: ['Arpa', 'Guitarra'],
        },
      ],
    },
    {
      value: 'VIENTO_MADERA',
      label: 'Viento-Madera',
      subfamilias: [
        {
          value: 'VIENTO_MADERA',
          label: 'Viento-Madera',
          instrumentos: ['Flauta traversa', 'Oboe', 'Clarinete', 'Fagot'],
        },
      ],
    },
    {
      value: 'VIENTO_METAL',
      label: 'Viento-Metal',
      subfamilias: [
        {
          value: 'VIENTO_METAL',
          label: 'Viento-Metal',
          instrumentos: ['Trompeta', 'Corno francés', 'Trombón', 'Tuba'],
        },
      ],
    },
    {
      value: 'PERCUSION',
      label: 'Percusión',
      subfamilias: [
        {
          value: 'AFINACION_DETERMINADA',
          label: 'De afinación determinada',
          instrumentos: ['Timbales', 'Xilófono'],
        },
        {
          value: 'AFINACION_INDETERMINADA',
          label: 'De afinación indeterminada',
          instrumentos: ['Redoblante', 'Platillos', 'Triángulo'],
        },
      ],
    },
  ],
};

export const COMODATOS = {
  pageTitle: 'Comodatos',
  pageSubtitle: 'Préstamos de instrumentos musicales.',
  newButton: 'Nuevo comodato',
  editTitle: 'Editar comodato',
  newTitle: 'Nuevo comodato',
  loadError: 'No se pudieron cargar los comodatos.',
  saveError: 'No se pudo guardar el comodato.',
  deleteError: 'No se pudo eliminar el comodato.',
  devolucionError: 'No se pudo registrar la devolución.',
  emptyMessage: 'No hay comodatos registrados.',
  deleteTitle: 'Eliminar comodato',
  deleteConfirm: (folio, esActivo) =>
    `¿Eliminar el comodato "${folio}"? ${esActivo ? 'El instrumento asociado volverá a estar disponible.' : ''}`,
  registrarDevolucion: 'Devolución',
  devolucionTitle: 'Registrar devolución',
  devolucionDescription: (folio, instrumento) => `Comodato ${folio} — ${instrumento ?? ''}`,
  devolucionConfirm: 'Confirmar devolución',
  menorConRepresentante: (nombre, apellido) => `Menor de edad — representante: ${nombre ?? ''} ${apellido ?? ''}`,
  mayorDeEdad: 'Estudiante mayor de edad, firma bajo su propia responsabilidad.',
  columns: {
    correlativo: 'Correlativo',
    estudiante: 'Estudiante',
    instrumento: 'Instrumento',
    devolucionPrevista: 'Devolución prevista',
    estado: 'Estado',
  },
  fields: {
    folioContrato: 'Correlativo de contrato',
    folioPlaceholder: 'COM-2026-001',
    estudiante: 'Estudiante',
    instrumento: 'Instrumento',
    fechaInicio: 'Fecha de inicio',
    fechaDevolucionPrevista: 'Fecha de devolución prevista',
    estadoInstrumentoRecibido: 'Estado del instrumento recibido',
    observaciones: 'Observaciones',
  },
  estados: [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'FINALIZADO', label: 'Finalizado' },
    { value: 'VENCIDO', label: 'Vencido' },
  ],
};

export const USUARIOS = {
  pageTitle: 'Usuarios',
  pageSubtitle: 'Cuentas de acceso del personal administrativo.',
  newButton: 'Nuevo usuario',
  editTitle: 'Editar usuario',
  newTitle: 'Nuevo usuario',
  loadError: 'No se pudieron cargar los usuarios.',
  saveError: 'No se pudo guardar el usuario.',
  deleteError: 'No se pudo eliminar el usuario.',
  toggleError: 'No se pudo cambiar el estado del usuario.',
  emptyMessage: 'No hay usuarios registrados.',
  deleteTitle: 'Eliminar usuario',
  deleteConfirm: (nombre) => `¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`,
  cannotDeleteAdmin: 'No se puede eliminar al administrador principal del sistema.',
  columns: {
    nombre: 'Nombre',
    email: 'Correo',
    rol: 'Rol',
    estado: 'Estado',
  },
  fields: {
    nombre: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    passwordEditHint: 'Dejar en blanco para no cambiar',
    rol: 'Rol',
  },
  estados: {
    activo: 'Activo',
    inactivo: 'Inactivo',
  },
  roles: [
    { value: 'ADMINISTRADOR', label: 'Administrador' },
    { value: 'ANALISTA_BIENES', label: 'Analista de Bienes' },
    { value: 'COORDINADOR', label: 'Coordinador' },
  ],
};

export const CONFIGURACION = {
  pageTitle: 'Configuración',
  pageSubtitle: 'Ajustes generales e integraciones del sistema.',
  contextHubTitle: 'ContextHub',
  contextHubLinkLabel: 'Abrir ContextHub',
  contextHubLinkUrl: 'https://context-hub-memory.vercel.app/',
  contextHubMarkdown: `### ¿Qué es ContextHub?

ContextHub es el proveedor de autenticación externo que SIGECOIM usa para el inicio de sesión. En vez de validar las credenciales únicamente contra esta base de datos local, el login de SIGECOIM se integra mediante el SDK de ContextHub, que mantiene su propio registro de usuarios y contraseñas.

### ¿Para qué sirve en este sistema?

Cada usuario de SIGECOIM (email y contraseña) tiene una cuenta espejo en ContextHub. Cuando creás un usuario nuevo desde "Usuarios", SIGECOIM lo registra automáticamente también en ContextHub. El riesgo aparece al editar: si cambiás el correo o la contraseña de un usuario desde SIGECOIM, ese cambio puede no reflejarse en ContextHub si la cuenta no quedó vinculada correctamente, dejando al usuario con credenciales distintas en cada lado.

### ¿Por qué usar ContextHub como proveedor de login?

En vez de que SIGECOIM valide usuario y contraseña directamente contra su propia base de datos, delega esa validación en ContextHub a través de su SDK de login embebido. Esto trae ventajas de seguridad y mantenimiento que sería costoso reimplementar en este proyecto:

- **El navegador nunca recibe un token de sesión real** — Al iniciar sesión, ContextHub entrega un ticket de un solo uso válido por 2 minutos. Ese ticket solo sirve si el backend de SIGECOIM lo canjea con su client secret, que nunca se expone al navegador.
- **Protección contra ataques de fuerza bruta incluida** — El login y la recuperación de contraseña están limitados por integración (rate limiting), y un intento fallido no revela si fue el correo o la contraseña lo que falló, evitando enumerar usuarios.
- **Recuperación de contraseña lista para usar** — El flujo de "olvidé mi contraseña" (código de verificación por correo) ya viene resuelto por ContextHub, sin que SIGECOIM tenga que operar su propio sistema de envío de correos ni de códigos temporales.
- **Pool de usuarios cerrado por integración** — Una cuenta de ContextHub solo puede iniciar sesión en SIGECOIM si fue vinculada explícitamente a esta integración.

### Sincronización manual

Usá el botón de abajo para emparejar por correo electrónico los usuarios locales con sus cuentas en ContextHub. Es útil si editaste el correo o la contraseña de un usuario y la integración quedó desactualizada, o si un usuario no puede iniciar sesión pese a tener credenciales válidas en SIGECOIM.`,
  syncButton: 'Sincronizar con ContextHub',
  syncing: 'Sincronizando...',
  syncError: 'No se pudo sincronizar con ContextHub.',
  syncSuccess: (actualizados) =>
    actualizados === 0
      ? 'Sincronización completa. No había usuarios por actualizar.'
      : `Sincronización completa. ${actualizados} usuario(s) actualizado(s).`,
  syncSummary: {
    totalContextHub: 'Usuarios en ContextHub',
    totalLocal: 'Usuarios locales',
    actualizados: 'Vinculados en esta sincronización',
    sinCoincidencia: 'Sin cuenta en ContextHub',
  },
};
