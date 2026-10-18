import React, {useState} from 'react';

export const mapURL = 'https://www.google.com/maps?q=Steinweg%2079%2C%2006484%20Quedlinburg%2C%20Germany&output=embed';

export function MapConsent({lang}) {
  const [allowed, setAllowed] = useState(false);
  const de = lang === 'de';
  return <section className="map-section wrap" aria-labelledby="map-title">
    <div className="map-heading"><div><p className="eyebrow">QUEDLINBURG · STEINWEG 79</p><h2 id="map-title">{de ? 'Ihr Weg zu Mộc 83.' : 'Find your way to Mộc 83.'}</h2></div><p>Steinweg 79, 06484 Quedlinburg</p></div>
    <div className="map-consent"><div className="map-placeholder" hidden={allowed}>
      <p>{de ? 'Google Maps wird erst mit Ihrer Zustimmung geladen. Dabei werden Ihre IP-Adresse und Browserdaten an Google übermittelt; eine Verarbeitung in den USA und Cookies durch Google sind möglich.' : 'Google Maps loads only with your consent. Your IP address and browser data will be sent to Google; processing in the US and cookies set by Google are possible.'}</p>
      <button className="button gold map-load" onClick={() => setAllowed(true)}>{de ? 'Zustimmen & Karte laden' : 'Agree & load map'}</button>
      <a className="underlined-link" href="datenschutz.html#google-maps">{de ? 'Datenschutzhinweise' : 'Privacy information'}</a>
      <noscript><p>{de ? 'Nutzen Sie ohne JavaScript den Link „Route planen“ oben.' : 'Without JavaScript, use the directions link above.'}</p></noscript>
    </div><div className="map-frame">{allowed && <iframe title="Mộc 83 · Steinweg 79, 06484 Quedlinburg" src={mapURL} width="1184" height="360" referrerPolicy="no-referrer" allowFullScreen/>}</div>
    <button className="underlined-link map-remove" hidden={!allowed} onClick={() => setAllowed(false)}>{de ? 'Karte schließen & Einwilligung widerrufen' : 'Close map & withdraw consent'}</button></div>
  </section>;
}
