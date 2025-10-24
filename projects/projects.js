import {fetchJSON, renderProjects, renderProjCount} from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projTitleContainer = document.querySelector('.projects-title');

renderProjCount(projects.length, projTitleContainer);