export function track(eventName, payload = {}) {
  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (typeof window !== 'undefined') {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(eventPayload);
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }

  console.log('[track]', eventPayload);
}
