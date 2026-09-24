// DevFlow: navegación entre vistas y pintado de la interfaz a partir de los datos
// Vistas: #/panel, #/proyectos, #/tareas

import {
  proyectos as proyectosIniciales,
  tareas as tareasIniciales
} from "./datos.js";


// ==========================================================
// Datos y localStorage
// ==========================================================

const CLAVE_GUARDADO = "devflow-datos";

function cargarDatos() {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADO);
    if (guardado) return JSON.parse(guardado);
  } catch (error) {
    console.error("No se pudieron leer los datos guardados", error);
  }

  // Primera vez (o datos ilegibles): partimos de los datos de ejemplo
  return {
    proyectos: structuredClone(proyectosIniciales),
    tareas: structuredClone(tareasIniciales)
  };
}

function guardarDatos() {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({ proyectos, tareas }));
  } catch (error) {
    console.error("No se pudieron guardar los datos", error);
  }
}

let { proyectos, tareas } = cargarDatos();


// Elementos del HTML que vamos a utilizar
const vistas = document.querySelectorAll(".vista");
const enlacesNavegacion = document.querySelectorAll(".enlace-navegacion");


// ==========================================================
// Navegación
// ==========================================================

function mostrarVista() {

  // "#/tareas" -> "tareas"
  let nombreVista = location.hash.replace("#/", "");

  // Si la vista no existe, mostramos el panel
  if (!document.getElementById(`vista-${nombreVista}`)) {
    nombreVista = "panel";
  }

  // Ocultamos todas las vistas excepto la que corresponde
  vistas.forEach((vista) => {
    vista.hidden = vista.id !== `vista-${nombreVista}`;
  });

  // Marcamos como activa la opción correspondiente del menú
  enlacesNavegacion.forEach((enlace) => {
    const estaActivo = enlace.getAttribute("href") === `#/${nombreVista}`;

    enlace.classList.toggle("activo", estaActivo);

    if (estaActivo) {
      enlace.setAttribute("aria-current", "page");
    } else {
      enlace.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", mostrarVista);
mostrarVista();


// ==========================================================
// Etiquetas
// ==========================================================

const etiquetas = {
  "en-desarrollo": "En desarrollo",
  "en-revision": "En revisión",

  alta: "Alta",
  media: "Media",
  baja: "Baja",

  pendiente: "Pendiente",
  "en-curso": "En curso",
  completada: "Completada"
};

// Clases CSS asociadas a cada estado o prioridad
const clasesEtiqueta = {
  "en-desarrollo": "etiqueta--acento",
  "en-curso": "etiqueta--acento",
  completada: "etiqueta--correcto",

  alta: "etiqueta--peligro",
  media: "etiqueta--advertencia"
};


// ==========================================================
// Cálculos y formato
// ==========================================================

function calcularProgreso(idProyecto) {

  const tareasProyecto = tareas.filter(
    (tarea) => tarea.proyectoId === idProyecto
  );

  const tareasCompletadas = tareasProyecto.filter(
    (tarea) => tarea.estado === "completada"
  );

  const porcentaje = tareasProyecto.length
    ? Math.round((tareasCompletadas.length / tareasProyecto.length) * 100)
    : 0;

  return {
    total: tareasProyecto.length,
    completadas: tareasCompletadas.length,
    porcentaje: porcentaje
  };
}

function formatearFecha(fecha) {
  // AAAA-MM-DD -> DD/MM/AAAA
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}


function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


// ==========================================================
// Plantillas HTML
// ==========================================================

function crearTarjeta(proyecto) {

  const { total, completadas, porcentaje } = calcularProgreso(proyecto.id);

  return `
    <article class="tarjeta proyecto">

      <div class="cabecera-proyecto">

        <div>
          <h3>${escaparHTML(proyecto.nombre)}</h3>
          <p class="texto-secundario">${escaparHTML(proyecto.descripcion)}</p>
        </div>

        <div class="etiquetas">
          <span class="etiqueta ${clasesEtiqueta[proyecto.estado] ?? ""}">
            ${etiquetas[proyecto.estado]}
          </span>
          <span class="etiqueta ${clasesEtiqueta[proyecto.prioridad] ?? ""}">
            ${etiquetas[proyecto.prioridad]}
          </span>
        </div>

      </div>

      <div class="progreso-proyecto">

        <div
          class="barra-progreso"
          role="progressbar"
          aria-label="Progreso de ${escaparHTML(proyecto.nombre)}"
          aria-valuenow="${porcentaje}"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="barra-progreso__relleno" style="--valor: ${porcentaje}%"></div>
        </div>

        <span class="monoespaciado">${porcentaje}%</span>

      </div>

      <p class="informacion-proyecto">
        <span>${completadas} de ${total} tareas</span>
        <span>Vence el ${formatearFecha(proyecto.fechaLimite)}</span>
      </p>

    </article>
  `;
}

function crearFilaTarea(tarea) {

  const proyecto = proyectos.find((p) => p.id === tarea.proyectoId);
  const marcada = tarea.estado === "completada" ? "checked" : "";

  return `
    <li class="tarea">

      <label class="contenido-tarea">
        <input type="checkbox" data-id="${tarea.id}" ${marcada}>
        <span class="titulo-tarea">${escaparHTML(tarea.titulo)}</span>
      </label>

      <span class="texto-secundario">${escaparHTML(proyecto.nombre)}</span>

      <span class="etiqueta ${clasesEtiqueta[tarea.prioridad] ?? ""}">
        ${etiquetas[tarea.prioridad]}
      </span>

      <span class="etiqueta ${clasesEtiqueta[tarea.estado] ?? ""}">
        ${etiquetas[tarea.estado]}
      </span>

      <div class="acciones-tarea">
        <button
          class="boton-texto"
          type="button"
          data-accion="editar"
          data-id="${tarea.id}"
          aria-label="Editar tarea ${escaparHTML(tarea.titulo)}"
        >Editar</button>

        <button
          class="boton-texto boton-texto--peligro"
          type="button"
          data-accion="borrar"
          data-id="${tarea.id}"
          aria-label="Borrar tarea ${escaparHTML(tarea.titulo)}"
        >Borrar</button>
      </div>

    </li>
  `;
}


// ==========================================================
// Pintar la interfaz a partir de los datos
// ==========================================================

function pintarPanel() {

  const pendientes = tareas.filter((tarea) => tarea.estado !== "completada");

  document.getElementById("total-proyectos").textContent = proyectos.length;
  document.getElementById("total-tareas").textContent = tareas.length;
  document.getElementById("total-pendientes").textContent = pendientes.length;

  document.getElementById("lista-proyectos-activos").innerHTML = proyectos
    .map(crearTarjeta)
    .join("");
}

function pintarProyectos() {
  document.getElementById("lista-proyectos").innerHTML = proyectos
    .map(crearTarjeta)
    .join("");
}

// Estado de los filtros de la vista Tareas
let filtroEstado = "todas";
let textoBusqueda = "";

// Minúsculas y sin acentos, para que "catalogo" encuentre "Catálogo"
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Devuelve solo las tareas que cumplen el filtro y la búsqueda
function obtenerTareasVisibles() {

  const busqueda = normalizar(textoBusqueda.trim());

  return tareas.filter((tarea) => {

    const proyecto = proyectos.find((p) => p.id === tarea.proyectoId);

    const coincideEstado =
      filtroEstado === "todas" || tarea.estado === filtroEstado;

    const coincideTexto = normalizar(
      `${tarea.titulo} ${proyecto ? proyecto.nombre : ""}`
    ).includes(busqueda);

    return coincideEstado && coincideTexto;
  });
}

function pintarTareas() {

  const lista = document.getElementById("lista-tareas");

  // Las completadas van al final (sort es estable: mantiene el orden dentro de cada grupo)
  const visibles = obtenerTareasVisibles().sort((a, b) => {
    const aHecha = a.estado === "completada" ? 1 : 0;
    const bHecha = b.estado === "completada" ? 1 : 0;
    return aHecha - bHecha;
  });

  if (visibles.length === 0) {
    const mensaje = tareas.length === 0
      ? "Aún no tienes tareas. Crea la primera con «Nueva tarea»."
      : "No hay tareas que coincidan con la búsqueda o el filtro.";

    lista.innerHTML = `<li class="lista-vacia">${mensaje}</li>`;
    return;
  }

  lista.innerHTML = visibles.map(crearFilaTarea).join("");
}

function pintarTodo() {
  pintarPanel();
  pintarProyectos();
  pintarTareas();
}


// ==========================================================
// Eventos
// ==========================================================

// Un solo escuchador para toda la lista de tareas
document.getElementById("lista-tareas").addEventListener("change", (evento) => {

  if (!evento.target.matches("input[type='checkbox']")) return;

  const tarea = tareas.find((t) => t.id === evento.target.dataset.id);

  tarea.estado = evento.target.checked ? "completada" : "pendiente";

  guardarDatos();
  pintarTodo();
});


// ==========================================================
// Modal: crear y editar tareas
// ==========================================================

const modalTarea = document.getElementById("modal-tarea");
const formularioTarea = document.getElementById("formulario-tarea");

// null = estamos creando; con un id = estamos editando esa tarea
let idTareaEnEdicion = null;

function abrirModalTarea(tarea = null) {

  idTareaEnEdicion = tarea ? tarea.id : null;

  // Rellenamos el desplegable con los proyectos actuales
  formularioTarea.elements.proyectoId.innerHTML = proyectos
    .map((p) => `<option value="${p.id}">${escaparHTML(p.nombre)}</option>`)
    .join("");

  formularioTarea.reset();

  // Si editamos, cargamos los datos de la tarea en el formulario
  if (tarea) {
    formularioTarea.elements.titulo.value = tarea.titulo;
    formularioTarea.elements.proyectoId.value = tarea.proyectoId;
    formularioTarea.elements.prioridad.value = tarea.prioridad;
    formularioTarea.elements.estado.value = tarea.estado;
  }

  document.getElementById("titulo-modal-tarea").textContent =
    tarea ? "Editar tarea" : "Nueva tarea";

  document.getElementById("boton-guardar-tarea").textContent =
    tarea ? "Guardar cambios" : "Crear tarea";

  modalTarea.showModal();
}

document.getElementById("abrir-modal-tarea").addEventListener("click", () => {
  abrirModalTarea();
});

document.getElementById("cancelar-tarea").addEventListener("click", () => {
  modalTarea.close();
});

formularioTarea.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datosFormulario = new FormData(formularioTarea);
  const titulo = datosFormulario.get("titulo").trim();
  if (!titulo) return;

  const valores = {
    proyectoId: datosFormulario.get("proyectoId"),
    titulo: titulo,
    estado: datosFormulario.get("estado"),
    prioridad: datosFormulario.get("prioridad")
  };

  if (idTareaEnEdicion) {
    // Editar: actualizamos la tarea existente
    const tarea = tareas.find((t) => t.id === idTareaEnEdicion);
    Object.assign(tarea, valores);
  } else {
    // Crear: añadimos una tarea nueva
    tareas.push({ id: crypto.randomUUID(), ...valores });
  }

  guardarDatos();
  pintarTodo();
  modalTarea.close();
});


// ==========================================================
// Botones Editar y Borrar de cada tarea
// ==========================================================

document.getElementById("lista-tareas").addEventListener("click", (evento) => {

  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const tarea = tareas.find((t) => t.id === boton.dataset.id);

  if (boton.dataset.accion === "editar") {
    abrirModalTarea(tarea);
  }

  if (boton.dataset.accion === "borrar") {
    pedirConfirmacionBorrado(tarea);
  }
});


// ==========================================================
// Modal: confirmar borrado
// ==========================================================

const modalBorrar = document.getElementById("modal-borrar");
let idTareaPorBorrar = null;

function pedirConfirmacionBorrado(tarea) {
  idTareaPorBorrar = tarea.id;

  document.getElementById("texto-borrar").textContent =
    `Se borrará «${tarea.titulo}». Esta acción no se puede deshacer.`;

  modalBorrar.showModal();
}

document.getElementById("cancelar-borrar").addEventListener("click", () => {
  modalBorrar.close();
});

document.getElementById("confirmar-borrar").addEventListener("click", () => {
  tareas = tareas.filter((t) => t.id !== idTareaPorBorrar);
  idTareaPorBorrar = null;

  guardarDatos();
  pintarTodo();
  modalBorrar.close();
});


// ==========================================================
// Buscador y pestañas de filtro
// ==========================================================

document.getElementById("buscador-tareas").addEventListener("input", (evento) => {
  textoBusqueda = evento.target.value;
  pintarTareas();
});

document.querySelector(".pestanas").addEventListener("click", (evento) => {

  const pestanaPulsada = evento.target.closest(".pestana");
  if (!pestanaPulsada) return;

  filtroEstado = pestanaPulsada.dataset.filtro;

  document.querySelectorAll(".pestana").forEach((pestana) => {
    const activa = pestana === pestanaPulsada;
    pestana.classList.toggle("activa", activa);
    pestana.setAttribute("aria-pressed", activa);
  });

  pintarTareas();
});


// Pintado inicial
pintarTodo();