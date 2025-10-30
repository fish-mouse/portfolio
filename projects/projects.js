import {fetchJSON, renderProjects, renderProjCount} from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let projects = await fetchJSON('../lib/projects.json');
let activeProjects = projects.slice()

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projTitleContainer = document.querySelector('.projects-title');

renderProjCount(projects.length, projTitleContainer);

let selectedIndex = -1;
let selectedYear = null;

function renderPieChart(projectsGiven) {
  // selectedIndex = -1;
  // selectedYear = null;

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

  let svg = d3.select('svg');

  svg.selectAll('path').remove();
  newArcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        selectedYear = selectedIndex === -1 ? null : newData[i].label;

        svg.selectAll('path').attr('class', (_, idx) => (
          idx === selectedIndex ? 'selected' : null
        ));
        legend.selectAll('li').attr('class', (_, idx) => (
          idx === selectedIndex ? 'selected' : null
        ));

        let filtered = activeProjects.filter(p => selectedYear ? p.year === selectedYear : true);
        renderProjects(filtered, projectsContainer, 'h2');
      });
  });
  return selectedYear;
};

selectedYear = renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  query = event.target.value;
  if (query.length > 0){
      activeProjects = projects.filter((project) =>{
        let values = Object.values(project).join('\n').toLowerCase();
        let matchesSearch = values.includes(query.toLowerCase())
        let matchesYear = selectedYear === null || project.year === selectedYear;
        return matchesSearch && matchesYear;
      }
    );
    renderProjects(activeProjects, projectsContainer, 'h2');
    // renderPieChart(activeProjects);
  }
  else {
    // query = '';
    // selectedYear = null;
    activeProjects = projects.slice()
    renderProjects(projects, projectsContainer, 'h2');
    renderPieChart(projects);
  }
});

