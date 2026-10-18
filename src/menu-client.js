// All menu text is already in HTML. JavaScript only adds filtering and UI language.
const search = document.getElementById('search');
const categories = document.getElementById('sections');
const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
const sections = [...document.querySelectorAll('[data-menu-section]')].map(section => ({
  section, title: section.querySelector('h2'),
  dishes: [...section.querySelectorAll('.dish')].map(dish => ({dish, text:normalize(dish.textContent)}))
}));
const copy = {
  de:{back:'← Zum Restaurant',title:'Unsere\nSpeisekarte.',intro:'Alle Gerichte, Getränke und Allergiehinweise aus unserer aktuellen Speisekarte. Deutsche und englische Beschreibungen. Suchen Sie nach einem Gericht oder wählen Sie eine Kategorie.',allergens:'Allergene & Zusatzstoffe (A–N)',booking:'Tisch reservieren',all:'Alle Kategorien',empty:'Keine Gerichte gefunden.',download:'Originale Speisekarte herunterladen (DOCX)',note:'Alle Preise in Euro inklusive Mehrwertsteuer. Allergencodes entsprechen der Originalkarte. Bei Allergien oder Unverträglichkeiten sprechen Sie bitte vor der Bestellung mit unserem Team.',privacy:'Datenschutzerklärung',call:'Anrufen',route:'Route',search:'Gericht suchen …',category:'Kategorie auswählen'},
  en:{back:'← Back to restaurant',title:'Our\nmenu.',intro:'All dishes, drinks and allergy information from our current menu, with German and English descriptions. Search for a dish or choose a category.',allergens:'Allergens & additives (A–N)',booking:'Book a table',all:'All categories',empty:'No dishes found.',download:'Download original menu (DOCX)',note:'All prices in euros, including VAT. Allergen codes follow the original menu. Please discuss allergies or intolerances with our team before ordering.',privacy:'Privacy policy',call:'Call us',route:'Directions',search:'Search for a dish …',category:'Choose a category'}
};
function filter() {
  const term = normalize(search.value.trim());
  let visible = 0;
  for (const {section,title,dishes} of sections) {
    const selected = !categories.value || categories.value === section.dataset.menuSection;
    const titleMatch = normalize(`${title.dataset.de} ${title.dataset.en}`).includes(term);
    let count = 0;
    for (const {dish,text} of dishes) { dish.hidden = !(selected && (!term || titleMatch || text.includes(term))); if (!dish.hidden) count++; }
    section.hidden = !count; visible += count;
  }
  document.getElementById('no-results').hidden = visible > 0;
}
function setLanguage(lang) {
  document.documentElement.lang = lang;
  const t=copy[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent=t[el.dataset.i18n]; });
  document.querySelector('.title').style.whiteSpace='pre-line';
  document.querySelectorAll('[data-de][data-en]').forEach(el => { el.textContent=el.dataset[lang]; });
  document.querySelectorAll('.language button').forEach(el => el.setAttribute('aria-pressed',String(el.lang===lang)));
  document.querySelector('.back').href = lang==='en' ? './?lang=en' : './';
  document.querySelectorAll('a[href*="booking=1"]').forEach(el => {el.href=lang==='en'?'./?lang=en&booking=1#contact':'./?booking=1#contact';});
  search.placeholder=t.search; search.setAttribute('aria-label',t.search); categories.setAttribute('aria-label',t.category);
  document.querySelector('.quick-contact').setAttribute('aria-label',lang==='de'?'Schnellkontakt':'Quick contact');
  document.title=lang==='de'?'Speisekarte | Mộc 83 (Moc 83), Quedlinburg':'Menu | Mộc 83 (Moc 83), Quedlinburg';
  filter();
}
search.addEventListener('input',filter); categories.addEventListener('change',filter);
document.querySelectorAll('.language button').forEach(button=>button.addEventListener('click',()=>setLanguage(button.lang)));
if(new URLSearchParams(location.search).get('lang')==='en') setLanguage('en');
