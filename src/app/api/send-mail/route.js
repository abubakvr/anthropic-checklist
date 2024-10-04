import brevo from "@getbrevo/brevo";
import { NextResponse } from "next/server";

// Helper function to send an email
const sendEmail = async (to, subject, htmlContent, params = {}) => {
  let apiInstance = new brevo.TransactionalEmailsApi();

  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = {
    name: "Zerosoft",
    email: "hello@abubakar.life",
  };
  sendSmtpEmail.to = [{ email: to.email, name: to.name }];
  sendSmtpEmail.replyTo = {
    email: "hello@abubakar.life",
    name: "Abubakar Ibrahim",
  };
  sendSmtpEmail.headers = { "X-Mailer": "Zerosoft Mailer" };
  sendSmtpEmail.params = params;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// API route handler for POST requests
export async function POST(req) {
  const body = await req.json();
  const { to, subject, htmlContent, params } = body;
  if (!to || !subject || !htmlContent) {
    return NextResponse.json(
      { message: "Missing required fields: to, subject, or htmlContent" },
      { status: 400 }
    );
  }

  try {
    const emailResponse = await sendEmail(to, subject, htmlContent, params);
    return NextResponse.json(
      { message: "Email sent successfully", data: emailResponse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}
