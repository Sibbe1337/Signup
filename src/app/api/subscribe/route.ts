import { NextResponse } from "next/server";
import { initMailchimp } from "@/lib/mailchimp";

type SubscribeRequest = {
  email: string;
  type: "newsletter" | "waitlist";
  marketingConsent?: boolean;
};

export async function POST(request: Request) {
  try {
    const body: SubscribeRequest = await request.json();
    const { email, type, marketingConsent } = body;
    
    const client = initMailchimp();
    const listId = process.env.MAILCHIMP_NEWSLETTER_LIST_ID!;

    try {
      const response = await client.lists.addListMember(listId, {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          SIGNUP_TYPE: type.toUpperCase(),
        },
        marketing_permissions: [{
          marketing_permission_id: "marketing_general",
          enabled: marketingConsent || false,
        }],
        tags: [type],
      });

      return NextResponse.json({
        success: true,
        message: type === "newsletter" 
          ? "Thank you for subscribing!" 
          : "You're now on the waitlist!",
        data: {
          id: response.id,
          email: response.email_address,
          status: response.status,
        },
      }, { status: 201 });

    } catch (error: any) {
      // Handle specific Mailchimp errors
      if (error.response?.body?.title === "Member Exists") {
        return NextResponse.json({
          success: false,
          error: "This email is already registered",
        }, { status: 400 });
      }

      console.error("Mailchimp API error:", error);
      throw error;
    }

  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Could not process your subscription. Please try again.",
    }, { status: 500 });
  }
} 