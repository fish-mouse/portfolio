console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// navLinks = $$("nav a")
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');

let pages = [
  { url: '', title: 'Home' },
  { url: 'https://github.com/fish-mouse', title: 'Profile' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'meta/', title: 'Meta' },
  { url: 'resume.html', title: 'Resume' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host === location.host && location.pathname === '/index.html' && a.pathname === '/' ) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
};

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
      <option value="light dark" selected>Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`
);

const select = document.querySelector('select');

if (localStorage.colorScheme) {
  select.value = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}


select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);

  localStorage.colorScheme = event.target.value;
});


function isValidDOMElement(obj) {
  return obj instanceof Element;
}

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched JSON data:', data);

    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for(let i = 0; i < projects.length; i++) {
    let project = projects[i];
    const article = document.createElement('article');
    project
    article.innerHTML = `
      <h3><a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.title}</a></h3>
      <img src="${project.image}" alt="${project.title}" style="max-width: auto; height: 150px;">
      <div>
        <p>${project.description}</p>
        <p>c. ${project.year}</p>
      </div>
      
    `;
    containerElement.appendChild(article);
  }
  
}

export function renderProjCount(count, containerElement) {
  containerElement.innerHTML = ` ${count} ` + containerElement.innerHTML;
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
