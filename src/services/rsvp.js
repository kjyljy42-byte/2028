// Deliberately local: swap this adapter for a backend when one is authorized.
let responses = [];
export async function submitRsvp(response) {
  const saved = {
    ...response,
    drinks: [...response.drinks],
    customDrink: response.drinks.includes("Другое")
      ? response.customDrink.trim()
      : "",
    guestName: response.guestName.trim(),
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  responses.push(saved);
  return saved;
}
export function getLocalResponses() {
  return responses.map((r) => ({ ...r, drinks: [...r.drinks] }));
}
