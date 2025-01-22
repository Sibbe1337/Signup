import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Visa konfigurationen (utan att visa hela API-nyckeln)
    const apiKey = process.env.MAILCHIMP_API_KEY || '';
    const maskedKey = apiKey.slice(0, 6) + '...' + apiKey.slice(-6);
    const server = process.env.MAILCHIMP_SERVER_PREFIX;
    const listId = process.env.MAILCHIMP_NEWSLETTER_LIST_ID;
    
    // Testa direkt HTTP-anrop till Mailchimp API
    const baseUrl = `https://${server}.api.mailchimp.com/3.0`;
    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');
    
    console.log("Testar Mailchimp anslutning:", {
      baseUrl,
      maskedKey,
      server,
      listId,
    });

    // Testa ping först
    const pingResponse = await fetch(`${baseUrl}/ping`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
    const pingData = await pingResponse.json();

    // Hämta audience-information
    const listsResponse = await fetch(`${baseUrl}/lists/${listId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
    const listsData = await listsResponse.json();
    
    return NextResponse.json({
      success: pingResponse.ok && listsResponse.ok,
      ping: {
        status: pingResponse.status,
        data: pingData,
      },
      audience: {
        status: listsResponse.status,
        data: listsData,
      },
      configuration: {
        server,
        maskedApiKey: maskedKey,
        listId,
      },
    });

  } catch (error: any) {
    console.error("Debug endpoint fel:", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }
    }, { status: 500 });
  }
} 