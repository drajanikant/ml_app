const mysql = require('mysql');


const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "redhat@123",
    database: "ml_face_detection"
});


database.connect(function (err) {
    if (err) throw err;
    console.log("Application connected with database...");
});

//function to set the value of goodies into the database also change the value of goodies into the inventory

function setgoodies(user_name, callback) {

    var goodies;

    getgoodies(user_name, function (goodies_n) {
        goodies = goodies_n;
    });

    if (!goodies) {
        goodies_random((choice) => {
            goodies = choice;
        });


        setreceived(user_name, "no", function (msg) {

            console.log("This is from setgoodies() line 37 " + msg);

        });


        //Updating the inventory for the respective goodies
        setinventory(goodies, () => {


            var sql = "UPDATE user SET goodies_name ='" + goodies + "'  WHERE user_name ='" + user_name + "'";
            database.query(sql, function (err, result) {
                if (err) throw err;

                console.log("this is form setgoodies line 50 The user:" + user_name + " Goodies:" + goodies);
            });


        });


    }
    if (!goodies) {
        return callback("goodies not alloted please check")
    } else {
        return callback("goodies not alloted please check");
    }


}

//Function to Change the Status of the goodies
function setreceived(user_name, status, callback) {

    var sql = "UPDATE user set goodies_status =\'" + status + "\' WHERE user_name = ? ";
    database.query(sql, [user_name], function (err, result) {
        if (err)
            return callback(err);
        else
            return callback("Status update to:" + status + " for the Username:" + user_name)
    });


}

//Getgoodies is to get the name of the Goodies from the database

function getgoodies(user_name, callback) {

    var sql = "SELECT  goodies_name,goodies_status FROM user where user_name =\'" + user_name + "\'";
    database.query(sql, function (err, result) {
        if (err) throw err;
        //console.log(result);
        if (result !== "") {

            try {
                if (result[0].goodies_status === 'no') {
                    console.log("From goodies.js Name of the Goodies:" + result[0].goodies_name);
                    setreceived(user_name, 'yes', function (msg) {
                        console.log(msg);
                    });
                    return callback(result[0].goodies_name);

                }
                else {
                    return callback("\" " + result[0].goodies_name + "\" But You Have Already Collected It Please ! Contact the Goodies Person");
                }
            } catch (e) {

                console.log("From goodies page #61");
            }
        }
    });
}


//Get the random goodies name

function goodies_random(callback) {
    var choice;
    getRandomInt(2, function (res) {

        console.log("This is from goodies_random the random number is :" + res);


        switch (res + 1) {

            case 1 :
                choice = "T-shirt";
                break;
            // case 2 :
            //     choice = "mouse pad";
            //     break;
            case 2 :
                choice = "mug";
                break;
            // case 4 :
            //     choice = "key ring";
            //     break;
            // case 5 :
            //     choice = "calender";
            //     break;
            default :
                choice = "none";
        }
    });

    return callback(choice);
}

//function to decrease the inventory item

function setinventory(goodies_name, callback) {

    var sql = "UPDATE goodies set quantity = quantity-1  WHERE goodie_name = \'" + goodies_name + "\'",
        res;
    database.query(sql, function (err, result) {
        if (err)
            console.log(err);

        res = result;
    });

    if (res !== "")
        return callback("Inventory Updated");


}


function getRandomInt(max, callback) {
    return callback(Math.floor(Math.random() * Math.floor(max)));
}


module.exports = {
    getgoodies,
    setgoodies,

};