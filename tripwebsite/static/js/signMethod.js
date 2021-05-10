// signup and login button and p
const loginBtn = document.querySelector('.login-button');
const signupBtn = document.querySelector('.signup-button');
const loginP = document.querySelector('.login-p');
const signupP = document.querySelector('.signup-p');


// switch function
const switchToSignup = document.getElementById('logintosignup');
const switchToLogin = document.getElementById('signuptologin');

// signup input
const usernameInputSignup = document.getElementById('signup-input_1');
const emailInputSignup = document.getElementById('signup-input_2');
const passwordInputSignup = document.getElementById('signup-input_3');

// login input
const emailInputLogin = document.getElementById('login-input_1');
const passwordInputLogin = document.getElementById('login-input_2');

switchToSignup.onclick = ()=>{
    modal_signup.style.display = "block";
    modal_login.style.display = "none";
}

switchToLogin.onclick = ()=>{
    modal_signup.style.display = "none";
    modal_login.style.display = "block";
}

loginBtn.onclick = ()=>{
    if(emailInputLogin.checkValidity() && passwordInputLogin.checkValidity()){
        url = 'http://127.0.0.1:3000/api/user';
        fetch(url,{
            method : 'PATCH',
            body : JSON.stringify({
                email: emailInputLogin.value,
                password: passwordInputLogin.value
            }),
            headers : {
                'Content-Type': 'application/json'
            }
        })
        .then( async (response)=>{
            data = await response.json()
            return data
        })
        .then((result)=>{
            if(result.ok === true){
                window.location.reload()
            }
            else if(result.message === 'password wrong'){
                if(!document.querySelector('.login-error')){
                    const error = document.createElement('p');
                    const errorLogin = loginBtn.parentNode.insertBefore(error, loginP);
                    errorLogin.textContent = '電子郵件或密碼錯誤';
                    errorLogin.classList.add('login-error');
                }

            }
            else if(result.message === 'none exist user'){
                alert('使用者不存在')
            }
        })
        .catch((err)=>{
            alert(err)
        })
    }
}

signupBtn.onclick = ()=>{
    if(usernameInputSignup.checkValidity() && emailInputSignup.checkValidity() && passwordInputSignup.checkValidity()){
        url = 'http://127.0.0.1:3000/api/user';
        fetch(url,{
            method : 'POST',
            body : JSON.stringify({
                name: usernameInputSignup.value,
                email: emailInputSignup.value,
                password: passwordInputSignup.value
            }),
            headers : {
                'Content-Type': 'application/json'
            }
        })
        .then(async(response)=>{
            data = await response.json()
            return data
        })
        .then((result)=>{
            if(result.ok === true){
                modal_signup.style.display = "none";
                modal_login.style.display = "block";
            }
            else if(result.message === 'email has already been taken, please use another one'){
                if(!document.querySelector('.signup-error')){
                    const error = document.createElement('p');
                    const errorSignup = signupBtn.parentNode.insertBefore(error, signupP);
                    errorSignup.textContent = 'email帳號已註冊過，請改用另一個帳號';
                    errorSignup.classList.add('signup-error');
                }
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

}

logout.onclick = ()=>{
    url = 'http://127.0.0.1:3000/api/user';
    fetch(url,{
        method: 'DELETE',
    })
    .then( async (response)=>{
        data = await response.json()
        return data
    })
    .then((reuslt)=>{
        if(reuslt.ok === true){
            window.location.reload()
        }
    })
    .catch((err)=>{
        alert(err)
    })
}