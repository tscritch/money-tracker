import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

export async function createClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  return client;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function getEnvelopeAmounts(auth: any): Promise<Record<string, number>> {
  const sheets = google.sheets({ version: "v4", auth });
  const month = dateFormat.format(new Date());
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${month}!A1:W1`,
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        if (!res) return console.log("The API did not return anything.");
        const rows = res.data.values;
        if (rows && rows.length && rows[0]) {
          const cleanRows = rows[0].filter((col) => col && col !== "");
          const envelopes = cleanRows.reduce((acc, col, i) => {
            if (i % 2 === 0) {
              const amount = cleanRows[i + 1];
              return { ...acc, [col]: amount };
            }
            return acc;
          }, {});
          resolve(envelopes);
        } else {
          console.log("No data found.");
          reject("No data found.");
        }
      }
    );
  });
}
