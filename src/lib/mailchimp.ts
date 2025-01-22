import mailchimp from "@mailchimp/mailchimp_marketing";

interface ListsSuccessResponse {
  lists: Array<{
    id: string;
    name: string;
  }>;
}

interface ErrorResponse {
  status: number;
  detail: string;
}

export function initMailchimp() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !server) {
    console.error("Mailchimp configuration missing");
    throw new Error("Mailchimp configuration missing");
  }

  // Verify API key format
  if (!apiKey.includes("-")) {
    throw new Error("Mailchimp API key must include datacenter (e.g. api-key-us21)");
  }

  // Verify datacenter matches
  const [, datacenter] = apiKey.split("-");
  if (datacenter !== server) {
    throw new Error(`Datacenter mismatch: ${datacenter} vs ${server}`);
  }

  console.log("Configuring Mailchimp with:", {
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
    console.log("Testing Mailchimp connection...");
    const client = initMailchimp();
    
    // Test ping first
    try {
      console.log("Attempting to ping Mailchimp...");
      const pingResponse = await client.ping.get();
      console.log("Ping successful:", pingResponse);
    } catch (pingError: any) {
      console.error("Ping failed:", {
        error: pingError.message,
        status: pingError.status,
        response: pingError.response?.body,
      });
      return false;
    }
    
    // Test audience connection
    try {
      const listId = process.env.MAILCHIMP_NEWSLETTER_LIST_ID;
      console.log("Attempting to fetch list with ID:", listId);
      
      const response = await client.lists.getAllLists();
      const listsResponse = response as ListsSuccessResponse;
      
      if (!listsResponse.lists) {
        console.error("Invalid response format from Mailchimp");
        return false;
      }

      const audience = listsResponse.lists.find(list => list.id === listId);
      
      if (audience) {
        console.log("List found:", {
          id: audience.id,
          name: audience.name,
        });
      } else {
        console.error("List not found with ID:", listId);
        return false;
      }
    } catch (audienceError: any) {
      console.error("Could not fetch list:", {
        error: audienceError.message,
        status: audienceError.status,
        response: audienceError.response?.body,
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error("Unexpected error during Mailchimp validation:", {
      message: error.message,
      stack: error.stack,
    });
    return false;
  }
} 