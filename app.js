const express = require("express");
const https = require("https"); // no need to install this with npm. It comes bundled together 
const bodyParser = require("body-parser"); // body-parser is used to get the data from html form (input)

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    console.log(req.body.cityName);
    const query = req.body.cityName;
    const apiKey = "6e776c863b18727b07d480ace43495e8";
    const unit = req.body.unitSelect;
    const lang = req.body.langSelect;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit + "&lang=" + lang;
    https.get(url, function (response) {
        console.log(response.statusCode);

        //data here itself is a buffer (bunch of hexadecimal values)
        response.on("data", function (data) {
            const weatherData = JSON.parse(data); //parse data to json format
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            const windSpeed = weatherData.wind.speed;
            console.log(temp); //print weather temperature to console window
            console.log(weatherDescription);
            //console.log(weatherData);
            /* const object = {
                 name: "Ali",
                 surname: "Abbasov"
             }*/
            // console.log(JSON.stringify(object));  //return object in minimum string format (straight lines)

            //LECTURE 245 (243 and 244 are all the things before this)
            //use res.write instead of directly using res.send()  
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
            res.write("<h3>The wind speed is " + windSpeed + "</h3>")
            res.write("<img src =" + imageURL + ">");
            res.send();            
        })
    });
});




app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});