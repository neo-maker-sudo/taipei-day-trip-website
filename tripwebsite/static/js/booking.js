// section 1
const bkIcon = document.getElementById('booking-section-1-icon');
const bkAttrName = document.getElementById('booking-name');
const bkAttrDate = document.getElementById('booking-date');
const bkAttrTime = document.getElementById('booking-time');
const bkAttrPrice = document.getElementById('booking-price');
const bkAttrAddress = document.getElementById('booking-address');

// section 2
const bkName = document.getElementById('booking-section-2-name');
const bkEmail = document.getElementById('booking-section-2-email');
const bkPhone = document.getElementById('booking-section-2-phone');
const bkNameDiv = document.getElementById('booking-section-2-nameDiv');
const bkEmailDiv = document.getElementById('booking-section-2-emailDiv');
const bkPhoneDiv = document.getElementById('booking-section-2-phoneDiv')

// section 4
const bkBtn = document.getElementById('booking-section-4-btn');
const bkinputs = document.querySelectorAll('input');

class Booking {
    fetchBookingData(){
        const url = `${window.port}/api/booking`
        fetch(url)
        .then( async (response)=>{
            return await response.json()
        })
        .then((result)=>{
            console.log(result)
            if(result.message === 'you do not have any booking information'){
                alert('您沒有預定行程')
            }  
        })
    }

    deleteBk(){
        bkIcon.onclick = ()=>{
            const url = `${window.port}/api/booking`
            fetch(url,{
                method: 'DELETE'
            })
            .then( async (response)=>{
                return await response.json()
            })
            .then((result)=>{
                if(result.ok === true){
                    alert('刪除成功');
                }
                if(result.message === 'you do not have any booking information to deleting'){
                    alert('您沒有預定行程可以刪除')
                }
            })
        }
    }

    btnDeliver(){
        bkBtn.onclick = function(){
            console.log('button click')
            // bkinputs.forEach( input =>{
            //     input.addEventListener('input',function(){
            //         if(input.value != ""){
            //             if(input.checkValidity()){
            //                 e.preventDefault()
            //                 console.log('送出')
            //             }
            //             else{
            //                 if(input.validity.patternMismatch){
            //                     input.setCustomValidity('請輸入10位數字');
            //                     e.preventDefault()
            //                 }
            //                 else if(input.validity.patternMismatch){
            //                     input.setCustomValidity('請輸入正確email格式')
            //                     e.preventDefault()
            //                 }
            //             }
            //         }
            //     })
            // })
            // if(bkPhone.checkValidity()){
            //     bkPhone.setCustomValidity('請輸入10位數字');
            //     bkPhone.reportValidity()
            //     e.preventDefault()
            // }
            
            // if(bkEmail.checkValidity()){
            //     // e.preventDefault()
            //     bkEmail.setCustomValidity('請輸入正確email格式')
            //     bkEmail.reportValidity()
            //     e.preventDefault()
            // }
            // else{
            //     console.log(bkEmail.checkValidity())
            // }
            // const url = `${window.port}/api/orders`
            // fetch(url,{
            //     method: "POST",
            //     body : JSON.stringify({
            //         "prime": "",
            //         "order": {
            //             "price": 2000,
            //             "trip": {
            //                 "attraction": {
            //                     "id": 10,
            //                     "name": "平安鐘",
            //                     "address": "臺北市大安區忠孝東路4段",
            //                     "image": "https://yourdomain.com/images/attraction/10.jpg"
            //                 },
            //                 "date": "2022-01-31",
            //                 "time": "afternoon"
            //             },
            //             "contact": {
            //                 "name": "彭彭彭",
            //                 "email": "ply@ply.com",
            //                 "phone": "0912345678"
            //             }
            //         }
            //     }),
            //     headers : {
            //         "Content-Type": "application/json"
            //     }
            // })
            // .then(async(response)=>{
            //     const result = await response.json()
            //     console.log(result)
            // })
        }
    }
}

document.addEventListener('DOMContentLoaded', async()=>{
    const bk = new Booking;

    let re = '\/booking'
    if(path.match(re)){
        await bk.fetchBookingData()
        bk.deleteBk()
        bk.btnDeliver()
        
    }
})