// header & section 1
const login = document.getElementById('login');
const signup = document.getElementById('signup');
const logout = document.getElementById('logout');
const modal_login = document.getElementById('modal-login');
const modal_signup = document.getElementById('modal-signup');
const mainSwitch_1 = document.getElementsByClassName("close")[0];
const mainSwitch_2 = document.getElementsByClassName("close")[1];
const search = document.querySelector('.section-1-searchBox');
const bookingBtn = document.querySelector('.navbar-brand-2');


// section 2
const section_2 = document.getElementById('section-2');
const allImgDiv = document.getElementsByClassName('img-div');

// attraction info
const placeDiv = document.getElementsByClassName('img');
const placeName = document.getElementsByClassName('pName');
const placeCategory = document.getElementsByClassName('pMrt');
const placeMrt = document.getElementsByClassName('pCategory');

// footer
const footer = document.getElementById('footer');

var page = 0;
var index = 0;
let username;
let email;
let password;
let arrInfo = [];
var post_flag = false;
let path = window.location.pathname;

class Main {

    checkStatus(){
        const url = `${window.port}/api/user`
        fetch(url)
        .then(async(response)=>{
            return await response.json()
        })
        .then((result)=>{
            if(result.message === null){
                login.style.display = 'block';
                signup.style.display = 'block';
                logout.style.display = 'none';
            }
            else{
                login.style.display = 'none';
                signup.style.display = 'none';
                logout.style.display = 'block';
                if(document.getElementById('booking-section-1-titleSpan')){
                    document.getElementById('booking-section-1-titleSpan').textContent = result.data.name
                    document.getElementById('booking-section-2-name').value = result.data.name
                    document.getElementById('booking-section-2-email').value = result.data.email
                } 
            }
        })
    }

    displayLogin(){
        login.onclick =()=>{
            modal_login.style.display = "block";
            this.close()
        }
    }
    displaySignup(){
        signup.onclick = ()=>{
            modal_signup.style.display = "block"
            this.close()
        }
    }

    close(){
        mainSwitch_1.onclick = ()=>{
            modal_login.style.display = "none"
        }
        mainSwitch_2.onclick = ()=>{
            modal_signup.style.display = "none"
        }
    }

    removeAttraction(){
        while(section_2.hasChildNodes()){
            section_2.removeChild(section_2.firstChild)
        }
    }

    specificAttraction(items){
        arrInfo = []
        this.removeAttraction()
        for(let i=0; i<items.length; i++){
            arrInfo.push(items[i])
        }
        this.getData(arrInfo)
    }

    displayAttraction(items){
        for(let i=0; i<items.length; i++){
            arrInfo.push(items[i])
        }
        this.getData(arrInfo)
    }

    async getData(arrInfo){
        arrInfo.map( async (item,i)=>{
            await this.removeAttraction()
            await this.createItem()
            this.intoDetail()
            allImgDiv[i].setAttribute('id',`${item.id}`)
            placeDiv[i].style.backgroundImage = `url(${item.images[0]})`
            placeName[i].textContent = `${item.name}`
            placeMrt[i].textContent = `${item.mrt}`
            placeCategory[i].textContent = `${item.category}`
        })
        footer.style.display = 'block';
    }

    createItem(){
        // create Element
        let firstDiv = document.createElement("div");
        let secondDiv = document.createElement("div");
        let thirdDiv = document.createElement("div");
        let fourthDiv = document.createElement("div");
        let paragraph_name = document.createElement("p");
        let paragraph_mrt = document.createElement("p");
        let paragraph_category = document.createElement("p");
        
        // insert Element
        section_2.appendChild(firstDiv);
        firstDiv.appendChild(secondDiv);
        firstDiv.appendChild(thirdDiv);
        thirdDiv.appendChild(paragraph_name);
        thirdDiv.appendChild(fourthDiv);
        fourthDiv.appendChild(paragraph_mrt);
        fourthDiv.appendChild(paragraph_category);

        // Element Add Class
        firstDiv.classList.add('img-div');
        secondDiv.classList.add('img');
        thirdDiv.classList.add('img-div-3');
        fourthDiv.classList.add('img-div-4');
        paragraph_name.classList.add('pName');
        paragraph_mrt.classList.add('pMrt');
        paragraph_category.classList.add('pCategory');

    }

    // display result DOM
    noResult(){
        let noResult = document.createElement("h3");
        section_2.appendChild(noResult);
        noResult.textContent = '查無結果';
    }

    // first fetch data and new page
    async fetchData(page){
        if(post_flag) {
            return;
        };
        const url = `${window.port}/api/attractions?page=${page}`;
        post_flag = true;

        if(arrInfo.length === 0){
            const loading = document.createElement("div")
            section_2.appendChild(loading)
            loading.classList.add("loading")
        }
        
        await fetch(url)
        .then( async (response)=>{
            const result = await response.json()
            let nextPage = result.nextPage
            const data = await result.data
            const filterItem = data.map((item)=>{
                const id = item.id
                const name = item.name
                const mrt = item.mrt
                const category = item.category
                const images = item.images
                return { id, name, mrt, category, images } 
            })
            post_flag =false
            return {filterItem, nextPage}
        })
        .then((filterItem)=>{
            this.displayAttraction(filterItem.filterItem)
            window.onscroll = () => {
                if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100){
                    this.fetchData(filterItem.nextPage)
                } 
            }
        })
        .catch((err)=>{
            post_flag =false
            console.log(err)
        })
    }

    // first keyword submit
    submitKeyword(page){
        search.addEventListener('submit',(e)=>{
            if(post_flag) {
                return;
            };
            e.preventDefault()
            const searchInput = document.getElementById('section-1-input').value;
            const url = `${window.port}/api/attractions?page=${page}&keyword=${searchInput}`;
            post_flag = true;
            fetch(url)
            .then(async(response)=>{
                const result = await response.json()
                var nextPage = result.nextPage
                const data = await result.data
                if(result.nextPage == null){
                    this.removeAttraction()
                    this.noResult()
                    return result
                }else{
                    data.map((item)=>{
                        const id = item.id
                        const name = item.name
                        const mrt = item.mrt
                        const category = item.category
                        const images = item.images
                        return { id, name, mrt, category, images } 
                    })
                    post_flag =false
                    return {data, nextPage}
                }
            })
            .then((filterItem)=>{
                if(filterItem.data.length > 0){
                    this.specificAttraction(filterItem.data)
                }
                window.onscroll = () => {
                    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100){
                        const searchInputSecond = document.getElementById('section-1-input').value
                        this.nextPageKeyword(filterItem.nextPage, searchInputSecond)
                    }
                }
            })
            .catch((err)=>{
                post_flag =false
                console.log(err)
            })
        })
    }

    // next keyword submit
    async nextPageKeyword(nextPage, searchInputSecond){
        if(post_flag) {
            return;
        };
        if(nextPage == null){
            return
        }
        const url = `${window.port}/api/attractions?page=${nextPage}&keyword=${searchInputSecond}`;
        post_flag = true;
        await fetch(url)
        .then(async(response)=>{
            const result = await response.json()
            var nextPage = result.nextPage
            const data = await result.data
            const filterItem = data.map((item)=>{
                const id = item.id
                const name = item.name
                const mrt = item.mrt
                const category = item.category
                const images = item.images
                return { id, name, mrt, category, images } 
            })
            post_flag =false
            return {filterItem, nextPage}
            
        })
        .then((filterItem)=>{
            this.displayAttraction(filterItem.filterItem)
            window.onscroll = () => {
                if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100){
                    const searchInputSecond = document.getElementById('section-1-input').value
                    this.nextPageKeyword(filterItem.nextPage,searchInputSecond)
                } 
            }
        })
        .catch((err)=>{
            post_flag =false
            console.log(err)
        })
    }

    intoDetail(){
        for(var i=0;i<allImgDiv.length;i++){
            allImgDiv[i].onclick = function(){
                location.href = `${window.port}` + location.pathname + `attraction/${this.id}`            
            }
        }
    }

    displayBkPage(){
        bookingBtn.onclick = ()=>{
            const url = `${window.port}/api/booking`
            fetch(url)
            .then(async(response)=>{
                return await response.json()
            })
            .then((result)=>{
                if(result.message === 'you are not allow to do this action'){
                    modal_login.style.display = "block";
                    this.close()
                }
                else {
                    console.log(location.href)
                    if(location.href == `${window.port}/booking` ){
                        window.location.reload()
                    }
                    else {
                        location.href = `${window.port}` +  `/booking`
                    }
                }
            })
        }
    }
}

document.addEventListener('DOMContentLoaded',async()=>{
    const main = new Main;
    main.displayLogin()
    main.displaySignup()
    main.checkStatus()
    main.displayBkPage()
    if(path == "/"){
        await main.fetchData(page)
        await main.submitKeyword(page)
        main.intoDetail()
        const searchBtn = document.getElementById('mag-btn');
        searchBtn.onclick = ()=>{
            main.submitKeyword(page)
        }
    }  
})