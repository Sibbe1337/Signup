import { NextResponse } from "next/server";
import { validateMailchimpConfig } from "@/lib/mailchimp";

export async function GET() {
  try {
    console.log("Health check påbörjad...");
    const isMailchimpConfigValid = await validateMailchimpConfig();
    console.log("Mailchimp validering resultat:", isMailchimpConfigValid);

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      mailchimp: {
        connected: isMailchimpConfigValid,
        config: {
          hasApiKey: !!process.env.MAILCHIMP_API_KEY,
          hasServer: !!process.env.MAILCHIMP_SERVER_PREFIX,
          hasListId: !!process.env.MAILCHIMP_NEWSLETTER_LIST_ID,
          server: process.env.MAILCHIMP_SERVER_PREFIX,
          listId: process.env.MAILCHIMP_NEWSLETTER_LIST_ID,
        },
      },
    });
  } catch (error: any) {
    console.error("Health check fel:", error);
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error.message,
      mailchimp: {
        connected: false,
        error: error.message,
      },
    }, { status: 500 });
  }
} 