document.querySelector('.login_form').addEventListener('submit', e => {
    e.preventDefault();
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    const tosend = {
        firstName: first_name,
        lastName: last_name,
        username: email,
        password: password
    }
    const jsonString = JSON.stringify(tosend);
    login(jsonString);
});

function login(jsonString) {
    const xhr = new XMLHttpRequest;
    xhr.open("POST", "/users/register");
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(jsonString);
    xhr.onload = function() {
        console.log(this.responseText);
        var res = JSON.parse(this.responseText);
        if (res.message) {
            console.log(this.responseText);
            window.location.href = "/login";
        } else {
            window.location.href = "/register";
        }
    }
}