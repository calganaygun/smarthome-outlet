/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes the SmartHome.
function SmartHome() {
  document.addEventListener('DOMContentLoaded', function () {
    // Shortcuts to DOM Elements.
    this.denyButton = document.getElementById('demo-deny-button');
    this.userWelcome = document.getElementById('user-welcome');

    // Bind events.
    this.updateButton = document.getElementById('demo-outlet-update');
    this.updateButton.addEventListener('click', this.updateState.bind(this));
    this.outlet = document.getElementById('demo-outlet');
    this.requestSync = document.getElementById('request-sync');
    this.requestSync.addEventListener('click', async () => {
      try {
        const response = await fetch('/requestsync');
        console.log(response.status == 200 ?
          'Request SYNC success!' : `Request SYNC unexpected status: ${response.status}`);
      } catch (err) {
        console.error('Request SYNC error', err);
      }
    });

    this.initFirebase();
    this.initoutlet();
  }.bind(this));
}

SmartHome.prototype.initFirebase = () => {
  // Initiates Firebase.
  console.log("Initialized Firebase");
};

SmartHome.prototype.initoutlet = () => {
  console.log("Logged in as default user");
  this.uid = "123";
  this.smarthome.userWelcome.innerHTML = "Welcome user 123!";

  this.smarthome.handleData();
  this.smarthome.outlet.style.display = "block";
}

SmartHome.prototype.setToken = (token) => {
  document.cookie = '__session=' + token + ';max-age=3600';
};

SmartHome.prototype.handleData = () => {
  const uid = this.uid;
  const elOnOff = document.getElementById('demo-outlet-onOff');

  firebase.database().ref('/').child('outlet').on("value", (snapshot) => {
    if (snapshot.exists()) {
      const outletState = snapshot.val();
      console.log(outletState)

      if (outletState.OnOff.on) elOnOff.MaterialSwitch.on();
      else elOnOff.MaterialSwitch.off();
    }
  })
}

SmartHome.prototype.updateState = () => {
  const elOnOff = document.getElementById('demo-outlet-onOff');

  const pkg = {
    OnOff: { on: elOnOff.classList.contains('is-checked') },
  };


  console.log(pkg);
  firebase.database().ref('/').child('outlet').set(pkg);
}

// Load the SmartHome.
window.smarthome = new SmartHome();
