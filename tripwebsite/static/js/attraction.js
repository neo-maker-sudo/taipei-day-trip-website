// deliver Button api 
const attrBtn = document.getElementById('attraction-section-button');
const morning = document.getElementById('attraction-section-morning');
const afternoon = document.getElementById('attraction-section-afternoon');
const price = document.getElementById('attraction-price');

// carousel 
const prev = document.querySelector('.attraction-prev-span');
const next = document.querySelector('.attraction-next-span');
const dotDiv = document.querySelector('.controls-visible');
const attrImg = document.getElementsByClassName('attraction-section-img');
const topDiv = document.querySelector('.attraction-section-topDiv');
const allLabel = document.getElementsByClassName('control-1');

// attraction info
const attrName = document.getElementById('attraction-name');
const description = document.getElementById('attraction-description');
const address = document.getElementById('attraction-address');
const transport = document.getElementById('attraction-transport')
const category = document.getElementById('attraction-category');
const mrt = document.getElementById('attraction-mrt');

class attraction {

    fetchDetailData(){
        let id = path.split('/').pop()
        const url = `${window.port}/api/attraction/${id}`
        fetch(url)
        .then(async(response)=>{
            const result = await response.json()
            return result.data
        })
        .then((filterItem)=>{
            this.displayDetail(filterItem)
        })
    }

    displayDetail(items){
        let filter = items.image[0].split(',')
        filter.map(async(image,i)=>{
            await this.createItem()
            this.blackLabel()
            attrImg[i].setAttribute('src', `${image}`)
        })
        allLabel[index].style.backgroundColor = "black"
        attrName.textContent = items.name ? items.name : "無"
        description.textContent = items.description ? items.description : "無"
        address.textContent = items.address ? items.address : "無"
        transport.textContent = items.transport ? items.transport : "無"
        category.textContent = items.category
        mrt.textContent = items.mrt ? items.mrt : "無"
    }


    createItem(){
        // create Element
        let img = document.createElement('img')
        let dot = document.createElement('label')

        // insert Element
        topDiv.appendChild(img)
        dotDiv.appendChild(dot)

        // Element Add Class
        img.classList.add('attraction-section-img')
        dot.classList.add('control-1')
    }

    next(){
        next.onclick = ()=>{
            if(index <= topDiv.childElementCount - 2){
                index += 1;
                topDiv.style.transform = `translatex(${-100*index + "%"})`
                this.labelColor()
            }
        }
    }

    prev(){
        prev.onclick = ()=>{
            if(index > 0){
                index = index - 1;
                topDiv.style.transform = `translatex(${-100*index + "%"})`
                this.labelColor()
            }
        }
    }

    morning(){
        morning.onclick = ()=>{
            morning.style.background = '#448899'
            afternoon.style.background = 'white'
            price.textContent = '2000'
        }
    }

    afternoon(){
        afternoon.onclick = ()=>{
            morning.style.background = 'white'
            afternoon.style.background = '#448899'
            price.textContent = '2500'
        }
    }

    blackLabel(){
        for(let i=0; i<allLabel.length; i++){
            allLabel[i].num = i
            allLabel[i].onclick = ()=>{
                index = allLabel[i].num;
                topDiv.style.transform = `translatex(${-100*index + "%"})`
                this.labelColor()
            }
        }
    }

    labelColor(){
        for(var i=0;i<allLabel.length;i++){
            allLabel[i].style.background = '';
        }
        allLabel[index].style.background = 'black'
    }

    btnDelever(){
        attrBtn.onclick = function(){
            const date = document.getElementById('attraction-section-input').value
            if(date == ''){
                alert('請選擇出發日期')
                return 
            }
            const morningCheck = morning.style.background
            const afternoonCheck = afternoon.style.background
            if(morningCheck == "rgb(68, 136, 153)" && afternoonCheck == "white"){
                const attractionId = path.split('/').pop()
                const price = document.getElementById('attraction-price').innerHTML
                const url = `${window.port}/api/booking`
                fetch(url,{
                    method: 'POST',
                    body : JSON.stringify({
                        attractionId: attractionId,
                        date: date,
                        time: 'morning',
                        price: price
                    }),
                    headers : {
                        "Content-Type": "application/json"
                    }
                })
                .then( async (response)=>{
                    return await response.json()
                })
                .then((result)=>{
                    if(result.ok === true){
                        alert('預定行程成功')
                    }
                    else if(result.message === 'same user booking double time'){
                        alert('行程已預訂，請勿重複預定')
                    }
                    else if(result.message === 'attraction id isn\'t exist'){
                        alert('無此行程，請確認頁面是否有問題，或F5重新整理再操作')
                    }
                    else if(result.message === 'establish booking error'){
                        alert('建立預定行程錯誤。')
                    }
                    else if(result.message === 'you are not allow to do this action'){
                        alert('請先登入再預定行程喔')
                    }
                    else if(result.message === 'server error'){
                        alert('伺服器錯誤，請聯繫相關網站人員。')
                    }
                })
            }
            else if(morningCheck == "white" && afternoonCheck == "rgb(68, 136, 153)"){
                const attractionId = path.split('/').pop()
                const price = document.getElementById('attraction-price').innerHTML
                const url = `${window.port}/api/booking`
                fetch(url,{
                    method: 'POST',
                    body : JSON.stringify({
                        attractionId: attractionId,
                        date: date,
                        time: 'afternoon',
                        price: price
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then( async (response)=>{
                    const data = await response.json()
                    return data
                })
                .then((result)=>{
                    if(result.ok === true){
                        alert('預定行程成功')
                    }
                    else if(result.message === 'same user booking double time'){
                        alert('行程已預訂，請勿重複預定')
                    }
                    else if(result.message === 'attraction id isn\'t exist'){
                        alert('無此行程，請確認頁面是否有問題，或F5重新整理再操作')
                    }
                    else if(result.message === 'establish booking error'){
                        alert('建立預定行程錯誤。')
                    }
                    else if(result.message === 'you are not allow to do this action'){
                        alert('請先登入再預定行程喔')
                    }
                    else if(result.message === 'server error'){
                        alert('伺服器錯誤，請聯繫相關網站人員。')
                    } 
                })
            }
            else {
                alert('請勾選上半天或是下半天的選項')
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async()=>{
    const attr = new attraction;
    let re = "\/attraction\/[0-9]+"
    if(path.match(re)){
        await attr.fetchDetailData()

        // 前後箭頭
        attr.next()
        attr.prev()

        // 時間點的切換
        attr.morning()
        attr.afternoon()

        // 點的顯示與切換
        attr.blackLabel()

        // 送 button api
        attr.btnDelever()
    }
})

