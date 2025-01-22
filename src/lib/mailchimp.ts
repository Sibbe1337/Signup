import mailchimp from "@mailchimp/mailchimp_marketing";

export function initMailchimp() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !server) {
    console.error("Mailchimp-konfiguration saknas");
    throw new Error("Mailchimp-konfiguration saknas");
  }

  // Verifiera att API-nyckeln har rätt format
  if (!apiKey.includes("-")) {
    throw new Error("Mailchimp API-nyckel måste innehålla datacenter (t.ex. api-key-us21)");
  }

  // Verifiera att datacenter matchar
  const [, datacenter] = apiKey.split("-");
  if (datacenter !== server) {
    throw new Error(`Datacenter mismatch: ${datacenter} vs ${server}`);
  }

  console.log("Konfigurerar Mailchimp med:", {
    server,
    datacenter,
    apiKeyFormat: "valid",
  });

  mailchimp.setConfig({
    apiKey,
    server,
  });

  return mailchimp;
}

export async function validateMailchimpConfig() {
  try {
    console.log("Testar Mailchimp-anslutning...");
    const client = initMailchimp();
    
    // Testa ping först
    try {
      console.log("Försöker pinga Mailchimp...");
      const pingResponse = await client.ping.get();
      console.log("Ping lyckades:", pingResponse);
    } catch (pingError: any) {
      console.error("Ping misslyckades:", {
        error: pingError.message,
        status: pingError.status,
        response: pingError.response?.body,
        stack: pingError.stack,
      });
      return false;
    }
    
    // Testa audience-anslutning
    try {
      const listId = process.env.MAILCHIMP_NEWSLETTER_LIST_ID;
      console.log("Försöker hämta lista med ID:", listId);
      
      const audienceResponse = await client.lists.getList(listId!);
      console.log("Lista hittad:", {
        id: audienceResponse.id,
        name: audienceResponse.name,
      });
    } catch (audienceError: any) {
      console.error("Kunde inte hämta lista:", {
        error: audienceError.message,
        status: audienceError.status,
        response: audienceError.response?.body,
        stack: audienceError.stack,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Oväntat fel vid Mailchimp-validering:", {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name,
    });
    return false;
  }
} 