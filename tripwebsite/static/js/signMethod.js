const logout = document.getElementById('logout');
const loginBtn = document.querySelector('.login-button');
const signupBtn = document.querySelector('.signup-button');

loginBtn.onclick = ()=>{
    email = document.getElementById('login-input_1').value
    password = document.getElementById('login-input_2').value
    url = 'http://127.0.0.1:3000/api/user';
    fetch(url,{
        method : 'PATCH',
        body : JSON.stringify({
            email: email,
            password: password
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
            modal_1.style.display = "none";
            login.style.display = 'none';
            signup.style.display = 'none';
            logout.style.display = 'block';
        }
        else if(result.message === 'password wrong'){
            alert('密碼錯誤')
        }
    })
    .catch((err)=>{
        alert(err)
    })
}

signupBtn.onclick = ()=>{
    username = document.getElementById('signup-input_1').value;
    email = document.getElementById('signup-input_2').value;
    password = document.getElementById('signup-input_3').value;
    url = 'http://127.0.0.1:3000/api/user';
    fetch(url,{
        method : 'POST',
        body : JSON.stringify({
            name: username,
            email: email,
            password: password
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
            modal_2.style.display = "none";
            modal_1.style.display = "block"
        }
        else if(result.message === 'email has already been taken, please use another one'){
            alert('email帳號已註冊過，請改用另一個帳號')
        }
    })
    .catch((err)=>{
        console.log(err)
    })
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
            login.style.display = 'block';
            signup.style.display = 'block';
            logout.style.display = 'none';
        }
    })
    .catch((err)=>{
        alert(err)
    })

}