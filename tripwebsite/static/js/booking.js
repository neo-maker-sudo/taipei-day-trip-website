// section 1
const bkSection = document.querySelector('.booking-section-1');
const modal_delete = document.getElementById('modal-delete');
const deleteClose = document.querySelector('.delete-close');
const bkDeleteBtn = document.querySelector('.delete-button');
const bkDeleteCancel = document.querySelector('.delete-cancel');

// section 2
const bkName = document.getElementById('booking-section-2-name');
const bkEmail = document.getElementById('booking-section-2-email');
const bkPhone = document.getElementById('booking-section-2-phone');
const bkNameDiv = document.getElementById('booking-section-2-nameDiv');
const bkEmailDiv = document.getElementById('booking-section-2-emailDiv');
const bkPhoneDiv = document.getElementById('booking-section-2-phoneDiv');

// section 4
const bkBtn = document.getElementById('booking-section-4-btn');
const bkinputs = document.querySelectorAll('input');

// booking form
const bksectionForm = document.getElementById('booking-section-2-form');
const bksectionHr = document.querySelector('.booking-hr');
const bkTotal = document.getElementById('booking-total-price');

// booking card info
const bkCardNumber = document.getElementById('booking-section-cardNumber');
const bkCardExpireDay = document.getElementById('booking-section-expireDay');
const bkCardCvv = document.getElementById('booking-section-cvv');

var fields = {
    number: {
        // css selector
        element: bkCardNumber,
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: bkCardExpireDay,
        placeholder: 'MM / YY'
    },
    ccv: {
        element: bkCardCvv,
        placeholder: '後三碼'
    }
}

class Booking {
    fetchBookingData(){
        const url = `${window.port}/api/booking`
        fetch(url)
        .then( async (response)=>{
            return await response.json()
        })
        .then((result)=>{
            if(result.message === 'you are not allow to do this action'){
                location.href = `${window.port}` + "/"
            }
            else if(result.message === 'you do not have any booking information'){
                this.displayNoneBooking()
            }
            else {
                this.displayBooking(result.data)
            }
        })
    }

    async displayNoneBooking(){
        await this.createNoneItem()
        
        bksectionForm.style.display = 'none';
        bksectionHr.style.display = 'none';
        
        const bksection_1_noneInfo = document.querySelector('.booking-none-info');
        bksection_1_noneInfo.textContent = '目前沒有任何待預訂的行程';
    }

    async displayBooking(item){
        await this.createItem()

        const besection_1_img = document.querySelector('.booking-section-1-img');
        const bksection_1_mainDiv = document.querySelector('.booking-section-1-div');
        const bksection_1_Info_name = document.getElementById('booking-name');
        const bksection_1_Info_date = document.getElementById('booking-date');
        const bksection_1_Info_time = document.getElementById('booking-time');
        const bksection_1_Info_price = document.getElementById('booking-price');
        const bksection_1_Info_address = document.getElementById('booking-address');

        if(item.time === 'morning'){
            const images = item.attraction.image.split(',')
            besection_1_img.setAttribute('src', `${images[0]}`);
            bksection_1_mainDiv.setAttribute('id', item.attraction.id)

            bksection_1_Info_name.textContent = item.attraction.name;
            bksection_1_Info_date.textContent = item.date;
            bksection_1_Info_time.textContent = '早上9點到下午4點';
            bksection_1_Info_price.textContent =  item.price;
            bksection_1_Info_address.textContent = item.attraction.address;
            bkTotal.textContent =   item.price
        }
        else {
            const images = item.attraction.image.split(',')
            besection_1_img.setAttribute('src', `${images[0]}`);
            bksection_1_mainDiv.setAttribute('id', item.attraction.id)
            bksection_1_Info_name.textContent = item.attraction.name;
            bksection_1_Info_date.textContent = item.date;
            bksection_1_Info_time.textContent = '下午2點到晚上9點';
            bksection_1_Info_price.textContent = item.price;
            bksection_1_Info_address.textContent = item.attraction.address;
            bkTotal.textContent =   item.price
        }

        this.deleteIcon()
    }

    createNoneItem(){
        const bksection_1_noneP = document.createElement('p');
        bkSection.appendChild(bksection_1_noneP);
        bksection_1_noneP.classList.add('booking-none-info');
        footer.classList.add('main-footer');
    }

    createItem(){
        // create element
        const bksection_1_Div = document.createElement('div');
        const bksection_1_imgDiv = document.createElement('div');
        const bksection_1_info = document.createElement('div');
        const bksection_1_img = document.createElement('img');
        const bksection_1_span = document.createElement('span');

        const section_1_infoTitle = document.createElement('div');
        const section_1_infoDiv1 = document.createElement('div');
        const section_1_infoDiv2 = document.createElement('div');
        const section_1_infoDiv3 = document.createElement('div');
        const section_1_infoDiv4 = document.createElement('div');

        const section_1_p1 = document.createElement('p');
        const section_1_p2 = document.createElement('p');
        const section_1_p3 = document.createElement('p');
        const section_1_p4 = document.createElement('p');
        const section_1_p5 = document.createElement('p');

        // insert element
        bkSection.appendChild(bksection_1_Div);
        bksection_1_Div.appendChild(bksection_1_imgDiv);
        bksection_1_Div.appendChild(bksection_1_info);
        bksection_1_Div.appendChild(bksection_1_span);
        bksection_1_imgDiv.appendChild(bksection_1_img);
        bksection_1_info.appendChild(section_1_infoTitle);
        bksection_1_info.appendChild(section_1_infoDiv1);
        bksection_1_info.appendChild(section_1_infoDiv2);
        bksection_1_info.appendChild(section_1_infoDiv3);
        bksection_1_info.appendChild(section_1_infoDiv4);

        section_1_infoTitle.appendChild(section_1_p1);
        section_1_infoDiv1.appendChild(section_1_p2);
        section_1_infoDiv2.appendChild(section_1_p3);
        section_1_infoDiv3.appendChild(section_1_p4);
        section_1_infoDiv4.appendChild(section_1_p5);

        // add class
        bksection_1_Div.classList.add('booking-section-1-div');
        bksection_1_imgDiv.classList.add('booking-section-1-imgDiv');
        bksection_1_info.classList.add('booking-section-1-info');
        bksection_1_img.classList.add('booking-section-1-img');
        bksection_1_span.setAttribute('id', 'booking-section-1-icon');
        section_1_infoTitle.classList.add('section-1-infoTitle');

        section_1_p1.setAttribute('id', 'booking-name');
        section_1_p2.setAttribute('id', 'booking-date');
        section_1_p3.setAttribute('id', 'booking-time');
        section_1_p4.setAttribute('id', 'booking-price');
        section_1_p5.setAttribute('id', 'booking-address');
    }

    deleteClose(){
        deleteClose.onclick = ()=>{
            modal_delete.style.display = 'none'
        }
    }

    deleteIcon(){
        const booking_section_1_Div = document.querySelector('.booking-section-1-div');
        if(booking_section_1_Div){
            booking_section_1_Div.lastChild.onclick = ()=>{
                modal_delete.style.display = 'block'
                this.deleteClose()
                this.deleteCancel()
            }
        }

    }

    deleteCancel(){
        bkDeleteCancel.onclick = ()=>{
            modal_delete.style.display = 'none'
        }
    }

    deleteBtn(){
        bkDeleteBtn.onclick = ()=>{
            const url = `${window.port}/api/booking`
            fetch(url,{
                method: 'DELETE'
            })
            .then( async (response)=>{
                return await response.json()
            })
            .then((result)=>{
                if(result.ok === true){
                    window.location.reload()
                }
            })
        }
    }

    btnDeliver(){
        bkBtn.onclick = function(){

            const tappayStatus = TPDirect.card.getTappayFieldsStatus()

            if(tappayStatus.canGetPrime === false){
                if(!document.querySelector('.booking-errorMsg')){
                    const error =document.createElement('p');
                    error.textContent = '請填選完卡號相關欄位';
                    error.classList.add('booking-errorMsg');
                    const bksection_3_Div = document.querySelector('.booking-section-3-div')
                    bksection_3_Div.appendChild(error)
                }
                return
            }

            TPDirect.card.getPrime(function(result){
                if(result.status !== 0){
                    alert("getPrime 錯誤")
                    return
                }
                else {
                    console.log(result)
                    console.log(result.card.prime)
                    const url = `${window.port}/api/orders`
                    fetch(url,{
                        method: "POST",
                        body : JSON.stringify({
                            "prime": result.card.prime,
                            "order": {
                                "price": document.getElementById('booking-price').textContent,
                                "trip": {
                                    "attraction": {
                                        "id": document.querySelector('.booking-section-1-div').id,
                                        "name": document.getElementById('booking-name').textContent,
                                        "address": document.getElementById('booking-address').textContent,
                                        "image": document.querySelector('.booking-section-1-img').src
                                    },
                                    "date": document.getElementById('booking-date').textContent,
                                    "time": document.getElementById('booking-time').textContent === "早上9點到下午4點" ? "morning " : "afternoon"
                                },
                                "contact": {
                                    "name": bkName.value,
                                    "email": bkEmail.value,
                                    "phone": bkPhone.value
                                }
                            }
                        }),
                        headers : {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(async(response)=>{
                        return await response.json()
                    })
                    .then((result)=>{
                        console.log(result.data)
                        if(result.data.payment.message === "付款成功" && result.data.payment.status === 0){
                            location.href = `${window.port}` + `/thankyou` + `?number=${result.data.number}`
                        }
                    })
                }
            })
        }
    }
}

document.addEventListener('DOMContentLoaded', async()=>{
    const bk = new Booking;


    let re = '\/booking'
    if(path.match(re)){
        await bk.fetchBookingData()

        TPDirect.setupSDK('20358', 'app_ZjeUNi2efstOeNWcsc8eUtEWZTqbersDdxFU27U9bZDdGgWgHrG0zyF2v301', 'sandbox')
        TPDirect.card.setup({ fields: fields })
        TPDirect.card.onUpdate(function(update){
            if(update.canGetPrime){
                bkBtn.removeAttribute('disabled')
            }
            else{
                bkBtn.setAttribute('disabled', true)
            }
        })
        bk.deleteIcon()
        bk.deleteCancel()
        bk.deleteBtn()
        bk.btnDeliver()
        
    }
})