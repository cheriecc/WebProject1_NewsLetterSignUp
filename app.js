const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.Email;
  console.log(firstName);
  console.log(lastName);
  console.log(email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/8a151fd481";
  const options = {
    method: "POST",
    auth: "Chane:7423b3749a44e33ececb326d82886aca-us10"
  };
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/");
})

// APIKEY:
// 7423b3749a44e33ececb326d82886aca-us10



app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
