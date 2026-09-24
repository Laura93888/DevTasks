// Navegación entre vistas usando el hash de la URL (#/dashboard, #/proyectos, #/tareas)

import { proyectos, tareas } from "datos.js";

 console.log(proyectos, tareas);

const views = document.querySelectorAll(".view");
const links = document.querySelectorAll(".nav__link");

function showView() {
  // "#/tareas" -> "tareas". Si no hay hash o no existe esa vista, dashboard.
  let name = location.hash.replace("#/", "");
  if (!document.getElementById(`view-${name}`)) name = "dashboard";

  views.forEach((view) => {
    view.hidden = view.id !== `view-${name}`;
  });

  links.forEach((link) => {
    const isActive = link.getAttribute("href") === `#/${name}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("hashchange", showView);
showView();

const etiquetas = {
  "en-desarrollo": "En desarrollo",
  "en-revision": "En revisión",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const clasesBadge = {
  "en-desarrollo": "badge--accent",
  alta: "badge--danger",
  media: "badge--warning",
};

function calcularProgreso(proyectoId) {
  const suyas = tareas.filter((t) => t.proyectoId === proyectoId);
  const hechas = suyas.filter((t) => t.estado === "completada");
  const porcentaje = suyas.length ? Math.round((hechas.length / suyas.length) * 100) : 0;
  return { total: suyas.length, hechas: hechas.length, porcentaje };
}

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

function crearTarjeta(p) {
  const { total, hechas, porcentaje } = calcularProgreso(p.id);
  return `
    <article class="card project">
      <div class="project__head">
        <div>
          <h3>${p.nombre}</h3>
          <p class="muted">${p.descripcion}</p>
        </div>
        <div class="badges">
          <span class="badge ${clasesBadge[p.estado] ?? ""}">${etiquetas[p.estado]}</span>
          <span class="badge ${clasesBadge[p.prioridad] ?? ""}">${etiquetas[p.prioridad]}</span>
        </div>
      </div>
      <div class="project__progress">
        <div class="progress" role="progressbar" aria-label="Progreso de ${p.nombre}" aria-valuenow="${porcentaje}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress__bar" style="--value: ${porcentaje}%"></div>
        </div>
        <span class="mono">${porcentaje}%</span>
      </div>
      <p class="project__meta">
        <span>${hechas} de ${total} tareas</span>
        <span>Vence el ${formatearFecha(p.fechaLimite)}</span>
      </p>
    </article>`;
}

const lista = document.getElementById("projects-list");
lista.innerHTML = proyectos.map(crearTarjeta).join("");