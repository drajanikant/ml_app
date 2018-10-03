
// adding contents for the unsecure browser
location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('server.js', { insecure: true });

// Make connection
var socket = io.connect('https://192.168.10.144:8080',{secure: true});
var type = "base64/image";
// Query DOM
var btn = document.getElementById('snap');
//================================================================//


// Grab elements, create settings, etc.
//var video = document.getElementById('video');

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
var video = document.getElementById('video');

// Code for the provide the sleep time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Trigger photo take
document.getElementById("snap").addEventListener("click",async function () {

    // Disabling the button
    document.getElementById("snap").disabled = true;

    // Getting the user details
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var contact = document.getElementById("contact_no").value;
    var designation = document.getElementById("Organization").value;
    var organization = document.getElementById("designation").value;

    for (i = 0; i < 200; i++) {
        context.drawImage(video, 0, 0, 640, 480);
        var imageData = canvas.toDataURL('image/jpeg');

        // Sending images over the socket
        socket.emit('images', {
            image: imageData,
            type: type,
            user_name: name,
            name: 'image' + i
        });
        //Slipping function 100 ms
        await sleep(100);

        console.log("images sent");
    }

    // Sending the data over the socket
    socket.emit('person_info', {
        user_name: name,
        user_email: email,
        user_contact: contact,
        user_designation: designation,
        user_organization: organization
    });

    // Displaying the success message
    document.getElementById("success_message").hidden = false;
    window.location='success.html';


});