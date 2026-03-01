export function track(eventName, payload = {}) {
  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Replace with GA/Segment/Meta integrations when available.
  console.log('[track]', eventPayload);
}
