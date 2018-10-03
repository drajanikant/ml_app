
// adding contents for the unsecure browser
location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('server.js', { insecure: true });

// Make connection

var socket = io.connect('https://192.168.10.144:8080',{secure: true});
var type = "base64/image";
// Query DOM
//var btn = document.getElementById('submit');
//================================================================//

var date = new Date();
var date_tag = date.getMonth().toString()+date.getDate().toString()+date.getFullYear().toString()+ date.getHours().toString()+date.getMinutes().toString();


// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}


// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
//var video = document.getElementById('video');

// Code for the provide the sleep time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Trigger photo take
document.getElementById("submit").addEventListener("click",async function () {

    // Disabling the button
    document.getElementById("submit").disabled = true;

    // Getting the user details
    // var email = document.getElementById("email").value;
    for (i = 0; i < 20; i++) {
        context.drawImage(video, 0, 0, 640, 480);
        var imageData = canvas.toDataURL('image/jpeg');

        // Sending images over the socket
        socket.emit('login', {
            image: imageData,
            type: type,
            tag_name: date_tag,
            name: 'image' + i
        });
        //Slipping function 100 ms
        await sleep(100);

        console.log("images sent");


    }

    await sleep(15000);
    // Sending images over the socket
    socket.emit('login_command', {
        tag_name: date_tag
    });



});
var user;
socket.on('user_info',function (user_data) {
    console.log(user_data.user_name);

    if (user_data.detected >= 5){

       // document.getElementById("user_name").innerText = "Hello! "+ user_data.user_name+" welcome to prodevans...";
        window.location = "/"+user_data.user_name;
    }else{
        document.getElementById("user_name").innerText = "Sorry! We are not able to recognize your face please provide the email address to detect your face...";
    }
});


// function getuserdetails() {
//     socket.on('help',function (user_data) {
//         console.log(user_data.user_name);
//         document.getElementById("user_name").innerText = "Hello! "+ user_data.user_name+" welcome to prodevans...";
//         user = user_data;
//         console.log(user);
//     console.log(user);
//     document.getElementById("Name").innerText = "Name : " + user.user_name;
// })  ;
// }

