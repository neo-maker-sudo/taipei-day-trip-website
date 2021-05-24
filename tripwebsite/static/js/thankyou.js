const tkSection = document.querySelector('.thankyou-section-1');


class Thankyou {
    fetchOrderData(){
        let tkPath = window.location.search
        let tkNumber = tkPath.split('=')
        const url = `${window.port}/api/order/${tkNumber[1]}`
        fetch(url)
        .then( async (response)=>{
            return await response.json()
        })
        .then((result)=>{
            console.log(result)

            if(result.status === "failed") {
                this.displayNoneOrder()
            }else {
                this.displayThankyouPage(result.data)
            }
        })
    }

    async displayThankyouPage(filterItem){
        console.log(filterItem)
        await this.createItem()
        // http://127.0.0.1:3000/thankyou?number=3c8caeafaf020e55421ad95088706ddaaadb34a5d2deac89ce242d79e0023496
        const tkTitle = document.querySelector('.thankyou-section-1-title');
        const tkNumber = document.querySelector('.thankyou-section-1-number');
        const tkContent = document.querySelector('.thankyou-section-1-content');
        tkTitle.textContent = `您好，${filterItem.contact.name}，恭喜您下訂單成功。`;
        tkNumber.textContent = filterItem.number ? filterItem.number : "無";
        tkContent.textContent = '祝您有一個美好的一天。';
    }
    
    async displayNoneOrder(){
        await this.createNoneItem()
        
        const bksection_1_noneInfo = document.querySelector('.thankyou-none-info');
        bksection_1_noneInfo.textContent = '目前沒有任何訂單紀錄';
    }

    createItem() {
        // create element
        const tksection_1_tilte = document.createElement('h2');
        const tksection_1_number = document.createElement('h2');
        const tkseciotn_1_content = document.createElement('h2');

        // insert element
        tkSection.appendChild(tksection_1_tilte);
        tkSection.appendChild(tksection_1_number);
        tkSection.appendChild(tkseciotn_1_content);

        // add attribute
        tksection_1_tilte.classList.add('thankyou-section-1-title');
        tksection_1_number.classList.add('thankyou-section-1-number');
        tkseciotn_1_content.classList.add('thankyou-section-1-content');
        footer.classList.add('main-footer');
    }

    createNoneItem(){
        // create element
        const tksection_1_none = document.createElement('h2');

        // insert element
        tkSection.appendChild(tksection_1_none);

        // add attribute
        tksection_1_none.classList.add('thankyou-none-info');
        footer.classList.add('main-footer');
    }
}

document.addEventListener('DOMContentLoaded',async ()=>{
    const thankyou = new Thankyou
    let subPath = path + window.location.search
    
    let re = '\/thankyou\\?number=[a-zA-Z0-9]+'
    if(subPath.match(re)){
        await thankyou.fetchOrderData()
    }
})