import { NextResponse } from "next/server";

type SubscribeRequest = {
  email: string;
  type: "newsletter" | "waitlist";
  marketingConsent?: boolean;
};

export async function POST(request: Request) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, type, marketingConsent } = body;
    
    const apiKey = process.env.MAILCHIMP_API_KEY!;
    const server = process.env.MAILCHIMP_SERVER_PREFIX!;
    const listId = process.env.MAILCHIMP_NEWSLETTER_LIST_ID!;
    
    const baseUrl = `https://${server}.api.mailchimp.com/3.0`;
    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

    // Lägg till prenumerant i Mailchimp
    const response = await fetch(`${baseUrl}/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          SIGNUP_TYPE: type.toUpperCase(),
        },
        marketing_permissions: [{
          marketing_permission_id: "marketing_general",
          enabled: marketingConsent || false,
        }],
        tags: [type], // Tagga prenumeranten baserat på typ
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Hantera specifika fel
      if (data.title === "Member Exists") {
        return NextResponse.json({
          error: "Email address is already registered",
        }, { status: 400 });
      }

      throw new Error(data.detail || "Could not process the subscription");
    }

    return NextResponse.json({
      success: true,
      message: type === "newsletter" 
        ? "Thank you for subscribing!" 
        : "You're now on the waitlist!",
      data: {
        id: data.id,
        email: data.email_address,
        status: data.status,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json({
      error: "Could not process the subscription",
      details: error.message,
    }, { status: 500 });
  }
} 