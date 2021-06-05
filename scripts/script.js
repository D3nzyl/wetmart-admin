/* Login */
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log(email,password)
    fetch(`https://wetmart-backend.herokuapp.com/admin/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"email": email, "password": password})
      })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if(response.status >= 400 && response.status <= 499) {
            alert(response.message)
        }
        else{
            console.log(response)
          //document.location.href = "homepage.html";
        }
      })
      .catch(error => {
        alert(error.message)
        console.log(error.message)
        console.log(error);
    });
}
