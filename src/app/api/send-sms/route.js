import { NextResponse } from "next/server";
import brevo from "@getbrevo/brevo";

// Initialize Brevo API instance
const apiInstance = new brevo.TransactionalSMSApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendSms = async (to, message) => {
  try {
    const sendSmsRequest = {
      sender: "Abubakar", // Sender name or phone number
      recipient: to, // Recipient phone number in international format
      content: message,
      type: "transactional", // Type of SMS
    };

    const response = await apiInstance.sendTransacSms(sendSmsRequest);
    return response;
  } catch (error) {
    throw error.response ? error.response.body : error;
  }
};

export async function POST(req) {
  const { to, message } = await req.json();

  if (!to || !message) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await sendSms(to, message);
    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send SMS", details: error },
      { status: 500 }
    );
  }
}
