require('dotenv').config();
const { response } = require('express');
const express = require('express');
const https = require('https');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/SusCoin.html");
})

app.post("/", (req,res) =>{
    const vEmail = req.body.email;
    const FName = req.body.fname;
    const LName = req.body.lname;
    const url = process.env.URL;
    const options = {
        method: "POST",
        auth: process.env.AUTH
        //username can be any text string but apiKey should be unique
    }
    //Mailchimp expects data in JSON format
    const data = {
        members: [
            {
                email_address: vEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: FName,
                    LNAME: LName
                }            
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, (response) =>{
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data)=>{
            console.log(res.statusCode);
        })
    })
    
    request.write(jsonData);
    request.end();
});

app.post("/tryagain", (req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 4000, () =>{
    console.log("Server running at port 4000");
})