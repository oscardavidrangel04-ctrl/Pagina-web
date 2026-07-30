
(() => {
  "use strict";

  const catalog = [
    {type:"calculator", title:"Calculadora de ISR", url:"calculadoras/isr.html", tags:["isr","impuestos","salario","nomina"]},
    {type:"calculator", title:"Calculadora de salario neto", url:"calculadoras/salario-neto.html", tags:["salario","neto","nomina","isr"]},
    {type:"calculator", title:"Calculadora de finiquito", url:"calculadoras/finiquito.html", tags:["finiquito","despido","laboral","prestaciones"]},
    {type:"calculator", title:"Calculadora de liquidación", url:"calculadoras/liquidacion.html", tags:["liquidacion","despido","laboral"]},
    {type:"calculator", title:"Calculadora de aguinaldo", url:"calculadoras/aguinaldo.html", tags:["aguinaldo","prestaciones","laboral"]},
    {type:"calculator", title:"Calculadora de vacaciones", url:"calculadoras/vacaciones.html", tags:["vacaciones","prestaciones","laboral"]},
    {type:"calculator", title:"Calculadora de prima vacacional", url:"calculadoras/prima-vacacional.html", tags:["vacaciones","prima","prestaciones"]},
    {type:"calculator", title:"Calculadora de IVA", url:"calculadoras/iva.html", tags:["iva","impuestos","precio"]},
    {type:"article", title:"Qué es el ISR", url:"articulos/que-es-el-isr.html", tags:["isr","impuestos","salario"]},
    {type:"article", title:"Cómo calcular ISR paso a paso", url:"articulos/como-calcular-isr-paso-a-paso.html", tags:["isr","impuestos","salario","nomina"]},
    {type:"article", title:"Salario bruto y salario neto", url:"articulos/salario-bruto-neto.html", tags:["salario","neto","bruto","nomina"]},
    {type:"article", title:"Qué es el finiquito", url:"articulos/que-es-el-finiquito.html", tags:["finiquito","laboral","despido"]},
    {type:"article", title:"Cómo calcular un finiquito", url:"articulos/como-calcular-finiquito.html", tags:["finiquito","laboral","prestaciones"]},
    {type:"article", title:"Finiquito vs liquidación", url:"articulos/finiquito-vs-liquidacion.html", tags:["finiquito","liquidacion","despido"]},
    {type:"article", title:"Qué es el aguinaldo", url:"articulos/que-es-el-aguinaldo.html", tags:["aguinaldo","prestaciones","laboral"]},
    {type:"article", title:"Cómo calcular el aguinaldo", url:"articulos/como-calcular-aguinaldo.html", tags:["aguinaldo","prestaciones"]},
    {type:"article", title:"Días de vacaciones en México", url:"articulos/dias-vacaciones-mexico.html", tags:["vacaciones","prestaciones","laboral"]},
    {type:"article", title:"Cómo calcular la prima vacacional", url:"articulos/como-calcular-prima-vacacional.html", tags:["vacaciones","prima","prestaciones"]},
    {type:"article", title:"Cómo calcular IVA", url:"articulos/como-calcular-iva.html", tags:["iva","impuestos","precio"]}
  ];

  const normalize = value => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const prefix = location.pathname.includes("/calculadoras/") ||
                 location.pathname.includes("/articulos/") ||
                 location.pathname.includes("/categorias/") ? "../" : "";

  const currentText = normalize([
    document.title,
    document.querySelector("h1")?.textContent,
    document.querySelector('meta[name="description"]')?.content,
    document.body.dataset.calc
  ].filter(Boolean).join(" "));

  const currentPath = location.pathname.replace(/^\//, "");

  const scoreItem = item => {
    let score = 0;
    item.tags.forEach(tag => {
      if (currentText.includes(normalize(tag))) score += 3;
    });
    if (item.type === "calculator" && currentPath.includes("articulos/")) score += 1;
    if (item.type === "article" && currentPath.includes("calculadoras/")) score += 1;
    return score;
  };

  const install = () => {
    const main = document.querySelector("main");
    if (!main || document.querySelector("[data-related-content]")) return;

    const items = catalog
      .filter(item => !currentPath.endsWith(item.url))
      .map(item => ({...item, score: scoreItem(item)}))
      .filter(item => item.score > 0)
      .sort((a,b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 4);

    if (items.length < 2) return;

    const section = document.createElement("section");
    section.className = "related-content container";
    section.dataset.relatedContent = "";
    section.setAttribute("aria-labelledby", "related-title");
    section.innerHTML = `
      <div class="related-head">
        <div>
          <span class="badge">Sigue aprendiendo</span>
          <h2 id="related-title">Contenido relacionado</h2>
          <p>Herramientas y guías conectadas con este tema.</p>
        </div>
      </div>
      <div class="related-grid">
        ${items.map(item => `
          <a class="related-card" href="${prefix}${item.url}">
            <span class="related-type">${item.type === "calculator" ? "Calculadora" : "Guía"}</span>
            <strong>${item.title}</strong>
            <b>Consultar →</b>
          </a>`).join("")}
      </div>`;

    const footerAd = main.querySelector(".ad-shell-footer");
    if (footerAd) footerAd.insertAdjacentElement("beforebegin", section);
    else main.appendChild(section);
  };

  document.addEventListener("DOMContentLoaded", install);
})();
