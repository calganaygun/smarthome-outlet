"use strict";
const admin = require("firebase-admin");
const Gpio = require('onoff').Gpio; // Include onoff to interact with GPIO
// Use GPIO pin 4, and specify that it is output
const relay = new Gpio(4, 'out');

// Fetch the service account key JSON file contents
const serviceAccount = require("./adminsdk.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://appid.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const ref = db.ref('/').child('outlet');
ref.on("value", function (snapshot) {
  let isOn = snapshot.val().OnOff.on // Get outlet's on/off value
  relay.writeSync(+isOn) // Write relay's pin to integer value of isOn (1 if true, 0 if false)
  console.log("Pin 4 changed to " + +isOn) // Log relay's value to console
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

/*
This JS script changes value of a GPIO output pin
according to a Firebase RealTime database.
*/