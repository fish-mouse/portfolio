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
  { url: 'resume.html', title: 'Resume' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "fish-mouse.github.io/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('fish') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  console.log("a.host: ", a.host);
  console.log("location.host: ", location.host);
  console.log("a.pathname: ", a.pathname);
  console.log("location.pathname: ", location.pathname);
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
}


