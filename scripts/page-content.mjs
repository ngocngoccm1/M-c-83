import {readFile} from 'node:fs/promises';

export const siteURL = (process.env.SITE_URL || 'https://ngocngoccm1.github.io/M-c-83/').replace(/\/?$/, '/');
export const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export function metadata({title, description, path='', noindex=false, baseURL=siteURL}) {
  const url = new URL(path, baseURL).href;
  return `<meta name="description" content="${esc(description)}"><title>${esc(title)}</title>
    <link rel="canonical" href="${url}">${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
    <meta property="og:type" content="website"><meta property="og:site_name" content="Mộc 83 (Moc 83)">
    <meta property="og:locale" content="de_DE"><meta property="og:locale:alternate" content="en_GB">
    <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}">
    <meta property="og:image" content="${new URL('assets/moc83-sushi-social.jpg', siteURL).href}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Sushi-Platte mit Lachs, Nigiri und Maki bei Mộc 83 in Quedlinburg">
    <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${new URL('assets/moc83-sushi-social.jpg', siteURL).href}">`;
}

export const restaurantSchema = {
  '@context':'https://schema.org', '@type':'Restaurant', '@id':`${siteURL}#restaurant`,
  name:'Mộc 83', alternateName:'Moc 83', url:siteURL,
  image:new URL('assets/moc83-sushi-social.jpg', siteURL).href,
  description:'Vietnamesische Küche und Sushi in Quedlinburg.',
  telephone:'+49 3946 4159682', email:'legiahan0102@gmail.com',
  address:{'@type':'PostalAddress',streetAddress:'Steinweg 79',postalCode:'06484',addressLocality:'Quedlinburg',addressRegion:'Sachsen-Anhalt',addressCountry:'DE'},
  servesCuisine:['Vietnamesisch','Japanisch','Sushi'], priceRange:'€€', acceptsReservations:true,
  hasMenu:new URL('menu.html', siteURL).href,
  openingHoursSpecification:[
    {'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday'],opens:'11:00',closes:'21:00'},
    {'@type':'OpeningHoursSpecification',dayOfWeek:['Saturday','Sunday'],opens:'11:00',closes:'22:00'}
  ], sameAs:['https://www.facebook.com/tastyinyourlifr']
};

export const allergens = [
  ['A', 'Glutenhaltiges Getreide', 'Cereals containing gluten', 'A1: Weizen / wheat; A2: Gerste / barley. Dazu gehören auch Roggen, Hafer, Dinkel und Kamut / also rye, oats, spelt and khorasan wheat.'],
  ['B', 'Krebstiere', 'Crustaceans'], ['C', 'Eier', 'Eggs'], ['D', 'Fisch', 'Fish'], ['E', 'Erdnüsse', 'Peanuts'], ['F', 'Soja', 'Soybeans'],
  ['G', 'Milch (einschließlich Laktose)', 'Milk (including lactose)', 'G1: Milch / milk; G2: Laktose / lactose.'],
  ['H', 'Schalenfrüchte', 'Nuts', 'H1: Kaschunüsse / cashews. Dazu gehören auch Mandeln, Hasel-, Wal-, Pekan-, Para-, Macadamianüsse und Pistazien / also almonds, hazelnuts, walnuts, pecans, Brazil nuts, macadamias and pistachios.'],
  ['I', 'Sellerie', 'Celery'], ['J', 'Senf', 'Mustard'], ['K', 'Sesam', 'Sesame'],
  ['L', 'Schwefeldioxid und Sulfite', 'Sulphur dioxide and sulphites', 'Bei mehr als 10 mg/kg bzw. 10 mg/l / above 10 mg/kg or 10 mg/l.'],
  ['M', 'Lupinen', 'Lupin'], ['N', 'Weichtiere', 'Molluscs']
];
export function allergenLegend() {
  return `<section class="menu-section allergen-legend" id="allergene"><h2>Allergene &amp; Zusatzstoffe / Allergens &amp; additives</h2>
    <p>Die hochgestellten Buchstaben an den Gerichten entsprechen der Originalkarte. Varianten und Saucen können unterschiedliche Allergene enthalten. Bitte sprechen Sie vor der Bestellung mit unserem Team. / Superscript codes follow the original menu. Allergens vary by option and sauce. Please ask our team before ordering.</p>
    <dl>${allergens.map(([code,de,en,note])=>`<div><dt>${code}</dt><dd><strong>${de}</strong> / ${en}${note?`<small>${note}</small>`:''}</dd></div>`).join('')}</dl>
    <p>Zusatzstoffe / Additives: 1 Koffein / caffeine; 2 Farbstoff / colouring; 3 Antioxidationsmittel / antioxidant; 4 Chinin / quinine; 5 Phenylalaninquelle / source of phenylalanine; 6 Süßungsmittel / sweetener; 7 Stabilisatoren / stabilisers; 8 Konservierungsstoff / preservative; 9 Geschmacksverstärker / flavour enhancer.</p></section>`;
}
export const sectionTitlesEN = ['Small soups','Salads','Starters','Main courses',"Kids’ menu",'Desserts','Side dishes','Nigiri (1 piece)','Vegetarian maki (6 pieces)','Maki (6 pieces)','Inside-out rolls (8 pieces)','Special sushi rolls (4 pieces)','Futo maki (5 pieces)','Sashimi','Baked rolls (6 pieces)','Sushi sets','Soft drinks','Juices','Homemade drinks','Lassi','Tea','Coffee','Non-alcoholic drinks','Alcoholic drinks','Cocktails','Spirits (2 cl)','Beer','White wine','Rosé wine','Red wine'];
export function menuMarkup(menu) {
  const lineHTML = line => `<p class="menu-line ${line.price?'priced-line':''}"><span>${(line.parts||[{text:line.body||line.text}]).map(part=>part.sup?`<sup class="allergen"><a href="#allergene" aria-label="Allergene / Allergens ${esc(part.text)}">${esc(part.text)}</a></sup>`:esc(part.text)).join('')}</span>${line.price?`<span class="menu-price">${esc(line.price)} €</span>`:''}</p>`;
  return menu.slice(0,-1).map((section,index)=>`<section class="menu-section" data-menu-section="${index}"><h2 data-de="${esc(section.title)}" data-en="${esc(sectionTitlesEN[index])}">${esc(section.title)}</h2>${section.blocks.map(block=>`<article class="dish">${block.map(lineHTML).join('')}</article>`).join('')}</section>`).join('');
}

export async function legalPages() {
  const data=JSON.parse(await readFile('src/legal-data.json','utf8'));
  const contact=`<p><strong>${esc(data.businessName)}</strong><br>${esc(data.street)}<br>${esc(data.postalCode)} ${esc(data.city)}<br>Deutschland</p><p>Telefon: <a href="tel:039464159682">${esc(data.phone)}</a><br>E-Mail: <a href="mailto:${esc(data.email)}">${esc(data.email)}</a></p>`;
  const incomplete=!data.operatorDetailsConfirmed || !data.operatorName;
  const notice=incomplete?'<aside class="legal-notice"><strong>Hinweis zur Vollständigkeit / Completeness notice</strong><p>Die rechtlichen Angaben zum Betreiber sind noch nicht vollständig bestätigt. Diese Seite wird nach Bestätigung ergänzt. / The legal operator details are awaiting confirmation and will be completed once supplied.</p></aside>':'';
  const operator=data.operatorName?`<p>Betreiber: ${esc(data.operatorName)}${data.legalForm?` (${esc(data.legalForm)})`:''}${data.representative?`<br>Vertreten durch: ${esc(data.representative)}`:''}</p>`:'';
  const impressum=`${notice}<h2>Angaben gemäß § 5 DDG</h2>${operator}${contact}${data.registerNumber?`<h2>Registereintrag</h2><p>${esc(data.registerCourt||'')}<br>${esc(data.registerNumber)}</p>`:''}${data.vatId?`<h2>Umsatzsteuer-Identifikationsnummer</h2><p>${esc(data.vatId)}</p>`:''}${data.supervisoryAuthority?`<h2>Zuständige Aufsichtsbehörde</h2><p>${esc(data.supervisoryAuthority)}</p>`:''}<h2>Kontakt zum Restaurant</h2><p>Reservierungen nehmen wir telefonisch oder als Anfrage per E-Mail entgegen. Eine Reservierung ist erst nach unserer Bestätigung verbindlich.</p>`;
  const privacy=`${notice}<h2>1. Verantwortlicher und Kontakt</h2>${operator}${contact}
    <p>Diese Hinweise beschreiben die Datenverarbeitung dieser Website und die Kontaktaufnahme mit dem Restaurant.</p>
    <h2>2. Bereitstellung der Website über GitHub Pages</h2><p>Diese statische Website wird über GitHub Pages bereitgestellt. Beim Aufruf erhält der Hostinganbieter technisch erforderliche Daten, insbesondere IP-Adresse, Datum und Uhrzeit, aufgerufene URL sowie Browser- und Geräteinformationen. Dies dient der Auslieferung und Sicherheit der Website. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren und erreichbaren Website).</p><p>GitHub kann technische Daten in Serverprotokollen verarbeiten. Die Speicherdauer und eine mögliche Verarbeitung außerhalb der EU richten sich nach den Angaben des Anbieters. Informationen zu Empfängern, Übermittlungen, Schutzmaßnahmen und Speicherfristen: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noreferrer">GitHub-Datenschutzerklärung</a>.</p>
    <h2>3. Cookies, Tracking und lokale Dateien</h2><p>Der eigene Website-Code setzt keine Cookies und verwendet weder Analysewerkzeuge noch Werbepixel. Schriftarten und Bilder werden vom eigenen Website-Host geladen. Sprach- und Farbauswahl bleiben nur im aktuellen Seitenaufruf erhalten; sie werden nicht im Browser gespeichert. Optionale externe Inhalte werden erst nach Ihrer aktiven Zustimmung geladen.</p>
    <h2 id="google-maps">4. Google Maps – nur mit Einwilligung</h2><p>Die eingebettete Karte ist zunächst deaktiviert. Erst mit „Zustimmen &amp; Karte laden“ wird eine Verbindung zu Google hergestellt. Anbieter im Europäischen Wirtschaftsraum ist Google Ireland Limited. Google erhält dabei unter anderem Ihre IP-Adresse, Browserinformationen und die angefragte Kartenadresse. Google kann Cookies verwenden und Daten auch in den USA verarbeiten. Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO; soweit Informationen auf Ihrem Endgerät gespeichert oder ausgelesen werden, § 25 Abs. 1 TDDDG.</p><p>Die Zustimmung wird nicht dauerhaft gespeichert. Mit „Karte schließen &amp; Einwilligung widerrufen“ entfernen Sie die Einbettung für den weiteren Seitenaufruf. Bereits an Google übermittelte Daten und von Google gesetzte Cookies werden dadurch nicht rückwirkend gelöscht. Sie können Cookies in Ihren Browsereinstellungen entfernen. Weitere Angaben zu Datenverarbeitung, Speicherfristen und internationalen Übermittlungen finden Sie in der <a href="https://policies.google.com/privacy?hl=de" rel="noreferrer">Google-Datenschutzerklärung</a>. Der separate Link „Route planen“ öffnet Google Maps erst nach Ihrem Klick als externe Website.</p>
    <h2>5. Kontakt und Reservierungen</h2><p>Diese Website übermittelt keine Formulare. Telefon- und E-Mail-Links öffnen die entsprechende Anwendung auf Ihrem Gerät. Wenn Sie uns kontaktieren, verarbeiten wir die mitgeteilten Kontaktdaten und Reservierungsangaben zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vorvertraglichen bzw. vertraglichen Anfragen, ansonsten Art. 6 Abs. 1 lit. f DSGVO (Beantwortung von Anfragen).</p><p>Der E-Mail-Empfang erfolgt über die angegebene Gmail-Adresse. Dabei verarbeitet Google als E-Mail-Dienstleister die übermittelten Nachrichten; eine Verarbeitung außerhalb der EU ist möglich. Die <a href="https://policies.google.com/privacy?hl=de" rel="noreferrer">Datenschutzhinweise von Google</a> erläutern die Datenverarbeitung und Übermittlungsmechanismen. Bitte übermitteln Sie per E-Mail keine sensiblen Gesundheitsdaten. Wir löschen Anfragen nach abgeschlossener Bearbeitung, sobald keine gesetzlichen Aufbewahrungspflichten oder berechtigten Nachweisinteressen entgegenstehen.</p>
    <h2>6. Externe Links</h2><p>Facebook und Google Maps sind zusätzlich als normale Links eingebunden. Ohne Klick auf den Link oder Freigabe der Karte baut diese Website keine Verbindung zu diesen Anbietern auf. Auf der aufgerufenen externen Seite gelten die Datenschutzhinweise des jeweiligen Anbieters.</p>
    <h2>7. Ihre Rechte</h2><p>Unter den gesetzlichen Voraussetzungen haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit (Art. 15–20 DSGVO). Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).</p><p><strong>Widerspruch:</strong> Gegen eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, Widerspruch einlegen (Art. 21 DSGVO). Wenden Sie sich dazu an die oben genannte Kontaktadresse.</p><p>Sie haben außerdem ein Beschwerderecht bei einer Datenschutzaufsichtsbehörde (Art. 77 DSGVO), insbesondere beim <a href="https://datenschutz.sachsen-anhalt.de/" rel="noreferrer">Landesbeauftragten für den Datenschutz Sachsen-Anhalt</a>.</p>
    <h2 lang="en">English summary</h2><p lang="en">The German sections above describe how this website processes data. GitHub Pages receives technical access data to serve the site. We use no analytics or advertising trackers. Google Maps remains blocked until you agree; you can close the map to withdraw consent. Phone and email links open your own apps. Reservation enquiries are handled via the contact details above; email is received using Gmail. You may exercise your GDPR rights or complain to a supervisory authority. Legal operator details are still awaiting confirmation where indicated above.</p>`;
  return [{path:'impressum.html',title:'Impressum',content:impressum,noindex:incomplete},{path:'datenschutz.html',title:'Datenschutzerklärung',content:privacy,noindex:incomplete}];
}
