const { google } = require('googleapis');
const sheets = google.sheets('v4');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = 8000;
const io = require('socket.io');
const credentials = require('./google-sheet-api.json');

// // Load credentials from the JSON file
// const credentials = require('./google-sheet-api.json');

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
// });

// let data;

// async function getData() {
//   const authClient = await auth.getClient();

//   const spreadsheetId = '1qhjZpUlGwoLUKLePC_algs1vwh_2VZbozsE9RCt4Pmo';
//   const range = 'Sheet1!A1:D5'; // Change to the desired range

//   const response = await sheets.spreadsheets.values.get({
//     auth: authClient,
//     spreadsheetId,
//     range,
//   });

//   const values = response.data.values;
//   data = values;
//   console.log('Data:', values);
// };

// getData().catch(console.error);\

app.get("/",  (req, res) => {
    res.send("Hello Server");
});




const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const spreadsheetId = '1qhjZpUlGwoLUKLePC_algs1vwh_2VZbozsE9RCt4Pmo';
const range = 'Sheet1!A1:D5'; // Change to the desired range

async function checkForUpdates() {
  try {
    const authClient = await auth.getClient();

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    if (response.data && response.data.values) {
      const currentData = response.data.values;

      var previousData;

      if (!previousData) {
        previousData = currentData;
        console.log('updated', currentData);
      } else if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
        console.log('Data has been updated:', currentData);
        // Take your desired action here
        previousData = currentData;
      }
    } else {
      console.log('No data found in the response.');
    }

    setTimeout(checkForUpdates, 60000); // Poll every 1 minute
  } catch (error) {
    console.error('An error occurred:', error);
    setTimeout(checkForUpdates, 60000); // Retry after an error
  }
}

checkForUpdates().catch(console.error);

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});