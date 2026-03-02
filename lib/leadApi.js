function getErrorMessage(payload) {
  if (payload && typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error.trim();
  }
  return 'Не удалось отправить заявку. Попробуйте ещё раз.';
}

export async function submitLead(payload) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let responseJson = null;
  try {
    responseJson = await response.json();
  } catch (_err) {
    responseJson = null;
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(responseJson));
  }

  return responseJson || { ok: true };
}
