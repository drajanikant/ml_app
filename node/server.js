var express = require('express');
var socket = require('socket.io');
var fs = require('file-system');
var https = require('https');
var http = require('http');
var zerorpc = require('zerorpc');
var path = require('path');


const getgoodies = require('./public/js/goodies').getgoodies,
    setgoodies = require('./public/js/goodies').setgoodies;


var user = undefined;
// connecting the zerorpc server
var client = new zerorpc.Client({heartbeatInterval: 100000, timeout: 100});
client.connect("tcp://localhost:4242");

client.on("error", function (error) {
    console.log("RPC client error:", error);
});

// App setup
var app = express();
// var server = app.listen(4000, function(){

const mysql = require('mysql');

// DB Connection information
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "redhat@123",
    database: "ml_face_detection"
});

// Connecting the database and checking the error if present
con.connect(function (err) {
    if (err) throw err;
    console.log("Application connected with database...");
});

var key = fs.readFileSync('keys/mockserver.key');
var cert = fs.readFileSync('keys/mockserver.crt');
var options = {
    key: key,
    cert: cert
};

var server = https.createServer(options, app).listen(8080);

http.createServer(app).listen(8081);

app.use(function (req, res, next) {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

//For goddies api

//Setting for templating the webpage 
app.set('view engine', 'vash');
//Setting the views folder
app.set('views', path.join(__dirname, '/public/views'));

app.set('goodies', path.join(__dirname, '/'));


//Serves all the request which includes /images in the url from Images folder
app.use(express.static('public'));


//Api Defination of the goodies page
app.get('/:user', (req, res) => {

    console.log(req.params)
    //window.location="goodies.html"


    var user = req.params.user,
        uname, goodiesname;
    console.log(user);
    if (!user) {
        res
            .status(404)
            .send('User is not valid');
    } else {
        //Feting the user details from the server for tranfer. ////

        var sql = "SELECT  user_name,goodies_name,goodies_status FROM user where user_name =\'" + user + "\'";

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
            else if (result !== "") {
                //Needed to handle the Exception throw by SQL
                try {
                    // the synchronous code that we want to catch thrown errors on
                    uname = result;

                    console.log("This is From server.js the username is " + result[0].user_name);

                    //console.log(user);
                    getgoodies(result[0].user_name, function (goodies_name) {
                        console.log("This is from Server.js line 107 The name of the goodies is" + goodies_name)
                        console.log("this is the line #113 goodies" + goodies_name);
                        res.render('goodies', {
                            user_name: result[0].user_name,
                            goodies: goodies_name
                        });
                    })

                } catch (err) {
                    // handle the error safely
                    console.log("Everything is working fine line 120")
                }

            }

        });

    }
// Static files
    app.use(express.static('public'));

// Socket setup & pass server
    var io = socket(server);
    io.on('connection', (socket) => {

        console.info('made socket connection', socket.id);

        // Handle images sending event
        socket.on('images', function (data) {


            // Get the image form the socket in the base64 format
            var img = data.image;

            // Getting the user details for the socket
            var user_name = data.user_name;

            // Image name
            var image_name = data.name;

            // console.log("Image name:",data.name);

            //Removing the unwanted information from the image
            var user_image_raw = img.replace(/^data:image\/\w+;base64,/, "");
            // Converting the base64 to image format
            var user_image = new Buffer(user_image_raw, 'base64');

            console.log("Image data found : ", user_image_raw);

            fs.writeFile('resources/images/' + user_name + '/' + image_name + ".jpeg", user_image, function (err) {
                if (err) console.log(err);
            });
            // console.log("==================================This is the images meta deta=============================");


        });

        socket.on('person_info', function (data) {
            // Getting the user details for the socket
            var user_name = data.user_name;
            var user_email = data.user_email;
            var user_contact = data.user_contact;
            var user_designation = data.user_designation;
            var user_organization = data.user_organization;

            console.info("User information :", data);

            // sql for insert user
            var sql = "INSERT INTO user (user_name, user_email, user_mobile, user_designation, user_organization) VALUES ?";
            var values = [
                [user_name, user_email, user_contact, user_designation, user_organization]
            ];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
        });


        var detected_items = []
        // Handle images sending event
        socket.on('login', function (data) {

            // Get the image form the socket in the base64 format
            var img = data.image;

            // Getting the user details for the socket
            var tag_name = data.tag_name;

            // Image name
            var image_name = data.name;

            // console.log("Image name:",data.name);

            //Removing the unwanted information from the image
            var user_image_raw = img.replace(/^data:image\/\w+;base64,/, "");
            // Converting the base64 to image format
            var user_image = new Buffer(user_image_raw, 'base64');

            // Invoking the client method
            client.invoke("imageDetect", user_image_raw, function (error, res, more) {
                if (error) {
                    console.error(error);
                } else {
                    console.log("Send data :", res);
                    response = JSON.parse(res);
                    if (response[0] != undefined) {
                        detected_items.push(response[0]);
                    }
                }
            });

        });

        // Receiving the login command
        // Handle images sending event
        socket.on('login_command', function (data) {


            // Getting the tag name
            var tag_name = data.tag_name;

            var response = "user2";

            console.log('Number of lables : ', detected_items);

            var newArray = mode(detected_items);

            console.log("Removed the duplicates : ", newArray);

            // Sending the date to front end
            socket.emit("user_info", {
                user_name: newArray.value,
                detected: newArray.count
            });
        });
    });

    function compressArray(array_elements) {

        array_elements.sort();

        var current = null;
        var cnt = 0;
        for (var i = 0; i < array_elements.length; i++) {
            if (array_elements[i] != current) {
                if (cnt > 0) {
                    console.log(current + ' comes --> ' + cnt + ' times<br>');
                }
                current = array_elements[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            console.log(current + ' comes --> ' + cnt + ' times');
        }

    }

    function mode(array) {
        if (array.length == 0)
            return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for (var i = 0; i < array.length; i++) {
            var el = array[i];
            if (modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        var ele = new Object();
        ele.value = maxEl;
        ele.count = maxCount;
        return ele;
    }


});
