// Navegación entre vistas usando el hash de la URL (#/dashboard, #/proyectos, #/tareas)

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