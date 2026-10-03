import './fonts.css';
import './style.css';

// React is used to author/build the HTML; visitors only download this small enhancer.
if (import.meta.env.DEV && !document.getElementById('root').hasChildNodes()) {
  await import('./main.jsx');
} else {
  let lang = 'de', category = 0, observer;
  const root = document.getElementById('root');
  const germanMarkup = root.innerHTML;
  const menuIcon = root.querySelector('.hamburger').innerHTML;
  const sunIcon = root.querySelector('.theme-toggle').innerHTML;
  const closeIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>';
  const cache = new Map();
  const load = path => {
    if (!cache.has(path)) cache.set(path, fetch(`${path}?v=${root.dataset.contentVersion}`).then(response => {
      if (!response.ok) throw new Error(`Could not load ${path}`);
      return path.endsWith('.json') ? response.json() : response.text();
    }).catch(error => { cache.delete(path); throw error; }));
    return cache.get(path);
  };
  const dialog = () => root.querySelector('dialog');
  const closeBooking = () => { dialog().close(); document.body.style.overflow = ''; };
  const openBooking = () => {
    setNavigation(false);
    dialog().showModal();
    document.body.style.overflow = 'hidden';
  };
  const setNavigation = open => {
    root.querySelector('#navigation').classList.toggle('open', open);
    const button = root.querySelector('.hamburger');
    button.setAttribute('aria-expanded', String(open));
    button.innerHTML = open ? closeIcon : menuIcon;
    button.setAttribute('aria-label', open ? (lang === 'de' ? 'Schließen' : 'Close') : (lang === 'de' ? 'Navigation öffnen' : 'Open navigation'));
  };
  const prepare = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), {threshold: .09});
    root.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    dialog().addEventListener('cancel', () => { document.body.style.overflow = ''; });
    root.querySelector('.theme-toggle').innerHTML = document.documentElement.dataset.theme === 'light' ? moonIcon : sunIcon;
    document.documentElement.dataset.enhanced = 'true';
  };
  let panelRequest = 0;
  const setCategory = async next => {
    const request = ++panelRequest;
    const panels = await load('assets/menu-panels.json');
    if (request !== panelRequest) return;
    category = next;
    root.querySelector('#dish-panel').outerHTML = panels[lang][category];
    root.querySelectorAll('[role="tab"]').forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === category));
      tab.tabIndex = index === category ? 0 : -1;
    });
  };
  let languageRequest = 0;
  const setLanguage = async next => {
    if (lang === next) return;
    const request = ++languageRequest;
    const markup = next === 'de' ? germanMarkup : await load('assets/content-en.html');
    if (request !== languageRequest) return;
    if (dialog().open) closeBooking();
    const scrollPosition = window.scrollY;
    lang = next;
    root.innerHTML = markup;
    document.documentElement.lang = lang;
    document.title = lang === 'de' ? 'Mộc 83 | Vietnamesische Küche & Sushi in Quedlinburg' : 'Mộc 83 | Vietnamese Kitchen & Sushi in Quedlinburg';
    document.querySelector('meta[name="description"]').content = lang === 'de' ? 'Vietnamesische Küche und Sushi bei Mộc 83, Steinweg 79, Quedlinburg. Tisch reservieren: 03946 4159682.' : 'Vietnamese food and sushi at Mộc 83, Steinweg 79, Quedlinburg. Book a table: 03946 4159682.';
    prepare();
    await setCategory(category);
    root.querySelector(`.language button[lang="${lang}"]`).focus({preventScroll: true});
    window.scrollTo({top: scrollPosition, behavior: 'instant'});
  };
  root.addEventListener('click', async event => {
    const target = event.target.closest('a,button');
    if (!target) { if (event.target === dialog()) closeBooking(); return; }
    try {
      if (target.matches('.language button')) { await setLanguage(target.lang); return; }
      if (target.matches('.hamburger')) { setNavigation(target.getAttribute('aria-expanded') !== 'true'); return; }
      if (target.matches('.nav a')) { setNavigation(false); return; }
      if (target.matches('.nav-book,.hero-actions .text-button,.moment button,.mobile-bar>:last-child')) { event.preventDefault(); openBooking(); return; }
      if (target.matches('.dialog-close')) { closeBooking(); return; }
      if (target.matches('[role="tab"]')) { await setCategory(Number(target.id.split('-')[1])); return; }
      if (target.matches('.menu-bottom button,.dish-list>.underlined-link')) { window.location.href = 'menu.html'; return; }
      if (target.matches('.drinks-copy>.underlined-link')) { await setCategory(3); return; }
      if (target.matches('.theme-toggle')) {
        const light = document.documentElement.dataset.theme !== 'light';
        document.documentElement.dataset.theme = light ? 'light' : 'dark';
        target.innerHTML = light ? moonIcon : sunIcon;
      }
    } catch (error) {
      console.error(error);
      // Keep navigation useful if a connection drops during an optional download.
      if (target.matches('[role="tab"],.drinks-copy>.underlined-link')) window.location.href = 'menu.html';
    }
  });
  root.addEventListener('keydown', async event => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;
    const index = Number(tab.id.split('-')[1]);
    const next = {ArrowRight: (index + 1) % 4, ArrowLeft: (index + 3) % 4, Home: 0, End: 3}[event.key];
    if (next === undefined) return;
    event.preventDefault();
    await setCategory(next);
    root.querySelector(`#tab-${next}`).focus();
  });
  prepare();
  if (new URLSearchParams(window.location.search).get('booking') === '1') openBooking();
}
