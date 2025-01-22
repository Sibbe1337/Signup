export async function subscribeToNewsletter(email: string, marketingConsent: boolean) {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      type: "newsletter",
      marketingConsent,
    }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte prenumerera på nyhetsbrevet");
  }

  return response.json();
}

export async function joinWaitlist(email: string) {
  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      type: "waitlist",
    }),
  });

  if (!response.ok) {
    throw new Error("Kunde inte registrera dig på väntelistan");
  }

  return response.json();
} 