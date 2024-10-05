// app/api/createEvent/route.js
import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { generateRandomString } from "../../../lib/helpers";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

// The file token.json stores the user's access and refresh tokens.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

console.log("TOKEN_PATH", TOKEN_PATH);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, "utf8");
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.log(err);
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request authorization to call APIs.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Creates a new calendar event with a Google Meet link and sends invitations to participants.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {Object} eventDetails Details of the event to be created.
 */
async function createEvent(authClient, eventDetails) {
  const calendar = google.calendar({ version: "v3", auth: authClient });

  const { description, startTime, endTime, attendees, summary } = eventDetails;

  const event = {
    summary,
    description,
    start: {
      dateTime: startTime, // Use the provided start time
      timeZone: "Africa/Lagos", // Change to your time zone
    },
    end: {
      dateTime: endTime, // Use the provided end time
      timeZone: "Africa/Lagos", // Change to your time zone
    },
    attendees: attendees.map((email) => ({ email })), // Convert email array to attendee objects
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 }, // Send an email reminder 1 day before
        { method: "popup", minutes: 10 }, // Show a popup 10 minutes before
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: generateRandomString(8), // Unique identifier for the conference
        conferenceSolutionKey: {
          type: "hangoutsMeet", // Type of conference
        },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1, // Required to create a conference
      sendUpdates: "all", // Notify all attendees
    });
    return {
      success: true,
      link: response.data.htmlLink,
      meetLink: response.data.conferenceData.entryPoints[0].uri,
    };
  } catch (error) {
    console.error(`Error creating event: ${error}`);
    throw new Error("Error creating event");
  }
}

// The API route handler
export async function POST(req) {
  const { description, startTime, endTime, attendees, summary } =
    await req.json();

  if (!description || !startTime || !endTime || !Array.isArray(attendees)) {
    return new Response(JSON.stringify({ error: "Invalid input data" }), {
      status: 400,
    });
  }

  try {
    const authClient = await authorize();
    const eventResponse = await createEvent(authClient, {
      description,
      startTime,
      endTime,
      attendees,
      summary,
    });
    return new Response(JSON.stringify(eventResponse), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
