import {fetchJSON, renderProjects, renderProjCount} from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projTitleContainer = document.querySelector('.projects-title');

renderProjCount(projects.length, projTitleContainer);



function renderPieChart(projectsGiven) {
  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();

  let newLegend = d3.select('.legend');
  newLegend.selectAll('li').remove();

  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year }; // TODO
  });

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let newSliceGenerator  = d3.pie().value((d) => d.value);

  let newArcData  = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  newArcs.forEach((newArc, idx) => {
      d3.select('svg')
        .append('path')
        .attr('d', newArc)
        .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
  })

  let legend = d3.select('.legend');
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });
};

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = projects.filter((project) =>{
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    }
  );

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});