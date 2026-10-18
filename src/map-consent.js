// Consent is deliberately limited to the current view; nothing is stored on the device.
export function handleMapClick(target) {
  if (!target.matches('.map-load,.map-remove')) return false;
  const map = target.closest('.map-consent');
  const allowed = target.matches('.map-load');
  const frame = map.querySelector('.map-frame');
  frame.replaceChildren();
  if (allowed) {
    const iframe = document.createElement('iframe');
    iframe.title = 'Mộc 83 · Steinweg 79, 06484 Quedlinburg';
    iframe.src = 'https://www.google.com/maps?q=Steinweg%2079%2C%2006484%20Quedlinburg%2C%20Germany&output=embed';
    iframe.width = '1184'; iframe.height = '360';
    iframe.referrerPolicy = 'no-referrer'; iframe.allowFullscreen = true;
    frame.append(iframe);
  }
  map.querySelector('.map-placeholder').hidden = allowed;
  map.querySelector('.map-remove').hidden = !allowed;
  map.querySelector(allowed ? '.map-remove' : '.map-load').focus({preventScroll: true});
  return true;
}
