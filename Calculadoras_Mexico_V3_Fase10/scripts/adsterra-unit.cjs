'use strict';
// Exact unit supplied by the site owner. One occurrence per selected document.
const id='409e3950cb7b10082bb628969be6611a';
const script=`<script async="async" data-cfasync="false" src="https://bauval.org/21/${id}"></script>`;
const placements=['index.html','calculadoras/prestamo.html','articulos/costo-total-prestamo-como-calcular.html'];
const markup=`<!-- adsterra-unit:start -->
<aside class="adsterra-unit" aria-label="Publicidad de Adsterra">
  <p class="adsterra-unit__label">Publicidad · Adsterra</p>
  ${script}
  <div id="container-${id}" class="adsterra-unit__container"></div>
</aside>
<!-- adsterra-unit:end -->`;
module.exports={id,script,placements,markup};
