// Datos de ejemplo con los que arranca la app la primera vez.
// estado (proyecto): "en-desarrollo" | "en-revision"
// estado (tarea):    "pendiente" | "en-curso" | "completada"
// prioridad:         "alta" | "media" | "baja"
// fechaLimite:       "AAAA-MM-DD"

export const proyectos = [
  {
    id: "p1",
    nombre: "Nuvia",
    descripcion: "Tienda online",
    cliente: "Nuvia",
    estado: "en-desarrollo",
    prioridad: "alta",
    fechaLimite: "2026-10-15",
  },
  {
    id: "p2",
    nombre: "Body & Soul",
    descripcion: "Plataforma de reservas",
    cliente: "Body & Soul",
    estado: "en-revision",
    prioridad: "media",
    fechaLimite: "2026-10-30",
  },
  {
    id: "p3",
    nombre: "Portfolio",
    descripcion: "Web personal",
    cliente: "Personal",
    estado: "en-desarrollo",
    prioridad: "baja",
    fechaLimite: "2026-11-20",
  },
];

export const tareas = [
  // Nuvia (8 tareas, 6 completadas)
  { id: "t1", proyectoId: "p1", titulo: "Definir estructura de productos", estado: "completada", prioridad: "alta" },
  { id: "t2", proyectoId: "p1", titulo: "Configurar base de datos", estado: "completada", prioridad: "alta" },
  { id: "t3", proyectoId: "p1", titulo: "Crear catálogo", estado: "completada", prioridad: "alta" },
  { id: "t4", proyectoId: "p1", titulo: "Crear página de producto", estado: "completada", prioridad: "alta" },
  { id: "t5", proyectoId: "p1", titulo: "Crear formulario de registro", estado: "completada", prioridad: "media" },
  { id: "t6", proyectoId: "p1", titulo: "Añadir buscador de productos", estado: "completada", prioridad: "media" },
  { id: "t7", proyectoId: "p1", titulo: "Crear carrito", estado: "en-curso", prioridad: "alta" },
  { id: "t8", proyectoId: "p1", titulo: "Panel de administración", estado: "pendiente", prioridad: "alta" },

  // Body & Soul (7 tareas, 6 completadas)
  { id: "t9", proyectoId: "p2", titulo: "Diseñar el calendario de reservas", estado: "completada", prioridad: "alta" },
  { id: "t10", proyectoId: "p2", titulo: "Modelar los datos de reservas", estado: "completada", prioridad: "alta" },
  { id: "t11", proyectoId: "p2", titulo: "Crear formulario de reserva", estado: "completada", prioridad: "alta" },
  { id: "t12", proyectoId: "p2", titulo: "Listado de servicios", estado: "completada", prioridad: "media" },
  { id: "t13", proyectoId: "p2", titulo: "Confirmación por email", estado: "completada", prioridad: "media" },
  { id: "t14", proyectoId: "p2", titulo: "Página de contacto", estado: "completada", prioridad: "baja" },
  { id: "t15", proyectoId: "p2", titulo: "Integrar pasarela de pago", estado: "en-curso", prioridad: "media" },

  // Portfolio (9 tareas, 5 completadas)
  { id: "t16", proyectoId: "p3", titulo: "Elegir paleta y tipografía", estado: "completada", prioridad: "media" },
  { id: "t17", proyectoId: "p3", titulo: "Diseñar la cabecera", estado: "completada", prioridad: "media" },
  { id: "t18", proyectoId: "p3", titulo: "Escribir la sección Sobre mí", estado: "completada", prioridad: "baja" },
  { id: "t19", proyectoId: "p3", titulo: "Crear la galería de proyectos", estado: "completada", prioridad: "alta" },
  { id: "t20", proyectoId: "p3", titulo: "Añadir enlaces a redes", estado: "completada", prioridad: "baja" },
  { id: "t21", proyectoId: "p3", titulo: "Redactar descripciones de proyectos", estado: "en-curso", prioridad: "media" },
  { id: "t22", proyectoId: "p3", titulo: "Crear sección de contacto", estado: "pendiente", prioridad: "media" },
  { id: "t23", proyectoId: "p3", titulo: "Optimizar imágenes", estado: "pendiente", prioridad: "baja" },
  { id: "t24", proyectoId: "p3", titulo: "Publicar en un servidor", estado: "pendiente", prioridad: "alta" },
];