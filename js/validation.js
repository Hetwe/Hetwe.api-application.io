const email = document.getElementById('email');

email.addEventListener('input', function (event) {
    if(email.validity.patternMismatch){
        console.log("hello");
    }
    else{
        console.log("Success");
    }
}, false)