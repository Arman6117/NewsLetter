const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { json } = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// To access the static folders we need to use express.static function

app.use(express.static("public")); // app.use(express.static("name of the folder")) After putting all our local files inside the static folder we can use them

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  // Post data
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    // Javascript object to hold all the data
    members: [
      {
        // Members object to hold the info about a single member
        email_address: email,
        status: "subscribed", // When user hits the sign up button it means they are subscribing to our mail service
        merge_fields: {
          // Provided by mailchimp default
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsondata = JSON.stringify(data); // To convert all the data into a JSON object

  const url = "https://us21.api.mailchimp.com/3.0/lists/2fe10468d0"; // Url of the server with list id at the end

  const options = {
    // options for https request
    method: "POST", // To post our request **IMP Option**
    auth: "arman1:299a381ea3c648ec242354a455a0e6c8-us21",
  };

  const request = https.request(url, options, function (response) {
    // Sending request to mailchimps server to get the data
    response.on("data", function (data) {
      const status = response.statusCode;
      if (status === 200){
        res.sendFile(__dirname + "/sucess.html")
      }
      else {
        res.sendFile(__dirname + "/failure.html")
      }
      
      console.log(JSON.parse(data));
    });
  });

  request.write(jsondata);
  request.end();
});

// Post route for the failure button it will take us back on the homepage

app.post("/failure",function(req,res){
    res.redirect("/")
})


app.listen(process.env.PORT ||3000, function () {
  console.log("Server is running");
});

// API key

//299a381ea3c648ec242354a455a0e6c8-us21

//List Id
// 2fe10468d0
