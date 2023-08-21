const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 4000;

const mysql = require('mysql');

//Connect to Database
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Fan@rsenal20nam',
    database: 'users'
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

//Sign Up
app.post('/api', (req, res) => {
    const data = req.body;
    //console.log(res);

    db.query(`SELECT * FROM userInfo WHERE userEmail = '${data.userEmail}'`, (error, result) => {
        if (error) console.log(error);
        if (!result.length) {
            db.query("INSERT INTO userInfo SET?", data, (err, result) => {
                if (err) console.log(err);
                res.redirect("/SignIn");
            })    
        }else {
            res.redirect("/used-email");
        }
    })
})



//Sign In
app.post('/home', async(req, res) => {
    const logInData =  req.body, mail = logInData.userEmail,
        pass =  logInData.userPassword;
    console.log("req.body: "+logInData);
    console.log("current mail: "+mail);
    
    db.query(`SELECT * FROM userInfo WHERE userEmail = '${req.body.userEmail}'`, (error, result) => {
        if (error) console.log("mysql error: ", error);
        console.log(result);
        if (!result.length){
            //res.json("account does not exist!");
            res.redirect('/SignIn/user-not-found');
        }else{
            if (result[0].userPassword != req.body.userPassword){
                //res.json("wrong password");
                res.redirect('/SignIn/password-incorrect');
            }else{
                res.send("Welcome " + mail);
            }
        }
    })
})

app.listen(PORT, () => console.log(`running on port ${PORT}`));