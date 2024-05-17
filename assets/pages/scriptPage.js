const cost = document.querySelector('.cost__span')
let COAST_WELL = 0
let COAST_FOUNTAIN = 0
let startCost = 0;

const choiceobj = {
    'mutually exclusive':{
        '000000102': ['000000101', '000000105', '000000144'],
        '000000101': ['000000102', '000000144'],
        '000000105': ['000000102'],
        '000000144': ['000000102', '000000101'],
        '000000108': ['000000107'],
        '000000107': ['000000108'],
        // 'Отделка стен санузла ПВХ панелями (из коллеции ЛХ)': ['000000110'],
        // '000000110': ['Отделка стен санузла ПВХ панелями (из коллеции ЛХ)'],
        '000000114': ['000000138'],
        '000000138': ['000000114', '000000132', '000000131', '000000122'],
        '000000120': ['000000121'],
        '000000121': ['000000120'],
        '000000131': ['000000130', '000000138'],
        '000000132': ['000000130', '000000138'],
        '000000130': ['000000132'],
        '000000130': ['000000131'],
        '000000133': ['000000134', '000000135'],
        '000000134': ['000000133', '000000135'],
        '000000135': ['000000134', '000000133'],
        '000000124': ['000000125'],
        '000000125': ['000000124'],
    },
    'cant choose without': {
        '000000131' : ['000000122'],
        '000000138' : ['000000130'],
    },
    'cant be removed without': {
        '000000130' : ['000000138'],
        '000000122': ['000000131']
    }

}

let listAdditionalServices = []

async function fetchAll() {
    const response = await fetch('1c_bel_site.json')
    const data = await response.json()
    return data
} 

async function createAdditionalServices(func) {
    const parent = document.querySelector('.secondBlock__services')
    const houseName = document.querySelector('#id')

    const data = await func()

    let itemHouse = {}


    const housePageName = houseName.textContent
    data['Дома'].forEach(item => {
        const houseName = item['ДомКод']

        if (housePageName == houseName) {
            itemHouse = item

        }
    })

    const arrAllSectionsAndSubsections = []

    const sections = itemHouse['Разделы']

    sections.forEach(section => {
        if (section['Раздел'] == 'Несортированно (технический раздел)') {
            return
        }

        arrAllSectionsAndSubsections.push(section['Раздел'])
        section['Подразделы'].forEach(subsection => {
            if (section['Раздел'] != subsection['Подраздел']) {
                arrAllSectionsAndSubsections.push(subsection)
            }
        })
    })
    const mainCost = document.querySelector('.firstBlock__button>span')

    parent.innerHTML = arrAllSectionsAndSubsections.map(item => {

        let activeClass = 'inactiveBtn'

        if (item == 'Строительство дома в базовой комплектации' ||
            item['Подраздел'] == 'Строительство дома в базовой комплектации' || 
            item['Подраздел'] == 'Дом (в базовой комплектации)'){
            
            if (item['Подраздел'] == 'Дом (в базовой комплектации)') {
                startCost += item['Стоимость']
                cost.textContent = startCost
                mainCost.textContent = startCost
            }
            return
        }

        if (item['Подраздел'] == 'Колодец (кольцо)') {
            COAST_FOUNTAIN = item['Стоимость']
            return `
                <div class="secondBlock__service">
                    <div class="secondBlock__service-button" id="${item['Код']}" data-name="${item['Подраздел']}">
                        <button class="secondBlock__service-buttonSelector inactiveBtn"></button>
                    </div>
                    <div class="secondBlock__service-text">
                        Устройство колодца <b>(колец)</b> 
                        <input class='secondBlock__service-input' type='number' min='0' max='100' value='0'/>
                    </div>
                </div>
            `
        } else if (item['Подраздел'] == 'Скважина (метр)') {
            COAST_WELL = item['Стоимость']
            return `
                <div class="secondBlock__service">
                    <div class="secondBlock__service-button" id="${item['Код']}" data-name="${item['Подраздел']}">
                        <button class="secondBlock__service-buttonSelector inactiveBtn"></button>
                    </div>
                    <div class="secondBlock__service-text">
                        Скважина Пластик <b>(метров)</b> 
                        <input class='secondBlock__service-input' type='number' min='0' max='10' value='0'/>
                    </div>
                </div>
            `
        
        }else if (typeof(item) != 'string') {
            if (item['Код'] == '000000144'){
                startCost += item['Стоимость']
                cost.textContent = startCost
                mainCost.textContent = startCost
                activeClass = 'activeBtn'
                listAdditionalServices.push('Имитация бруса')
            }
            return `
                <div class="secondBlock__service">
                    <div class="secondBlock__service-button" id="${item['Код']}" data-name="${item['Подраздел']}">
                        <button class="secondBlock__service-buttonSelector ${activeClass}" value="${item['Стоимость']}"></button>
                    </div>
                    <div class="secondBlock__service-text">${item['Подраздел']} + ${item['Стоимость']} руб.</div>
                </div>
            `
        } else {
            return `
                <div class="secondBlock__services-header">${item}</div>
            `
        }
    }).join('')
}

createAdditionalServices(fetchAll)

// slider house img 

const slidesModal = document.querySelectorAll('.firstBlock__field-img')
const prevModal = document.querySelector('.firstBlock__carousel-left')
const nextModal = document.querySelector('.firstBlock__carousel-right')
const slideModalField = document.querySelector('.firstBlock__field')
const mainSlide = document.querySelector('.firstBlock__carousel-item')

let slideIndex = 1;
const mediaQuerrymax = window.matchMedia('(max-width: 959px)')

let lastSlideIndex = 0

function showSlides(n, transform, widthElem) {

    let translateCount = (slideIndex - 2) * -transform + 'px'
    const lastTranslateCount = (slidesModal.length - 2) * -transform - widthElem + 'px';

    if (n > slidesModal.length) {
        slideIndex = 1
    } 

    if  (n < 1) {
        slideIndex = slidesModal.length
    }

    
    if (n >= 3 && translateCount !== '100px' && n <= (slidesModal.length - 1)) {
        slideModalField.style.transform = `translateX(${translateCount})`
    }

    if (slideIndex == slidesModal - 1){
        slideModalField.style.transform = `translateX(${lastTranslateCount})`
    }

    if (translateCount == '100px' || translateCount == '0px') {
        slideModalField.style.transform = 'translateX(0)'
    }
    
    if (slideIndex - 3 == slidesModal.length - 3) {
        slideModalField.style.transform = `translateX(${lastTranslateCount})`
    }
    
    if (slidesModal.length == lastSlideIndex && slideIndex == 1){
        slideModalField.style.transform = 'translateX(0)'
    }

    slidesModal.forEach( slide => slide.classList.remove('active'))

    slidesModal[slideIndex - 1].classList.add('active')

    mainSlide.src = slidesModal[slideIndex - 1].src

    lastSlideIndex = slideIndex
    
}
function plusSlides(n, transform, widthElem) {
    showSlides(slideIndex += n, transform, widthElem)
}

prevModal.addEventListener('click', function(){
    if (mediaQuerrymax.matches){
        plusSlides(-1, 95, -95)
    } else {
        plusSlides(-1, 180, -180)
    }
})

nextModal.addEventListener('click', function(){
    if (mediaQuerrymax.matches){
        plusSlides(1, 95, -95)
    } else {
        plusSlides(1, 180, -180)
    }
})
    
//open and close selection menu

const buttonWrappers = document.querySelector('.secondBlock__services');
const selectionMenu = document.querySelector('.secondBlockMenu__menu')

// buttonWrappers.addEventListener('click', (e) => {
//     if (e.target.classList.contains('secondBlock__service-button')) {
//         if(selectionMenu.classList.contains('notVisible')){
//             selectionMenu.classList.remove('notVisible')
//             selectionMenu.classList.add('visible')
//         } else {
//             selectionMenu.classList.remove('visible')
//             selectionMenu.classList.add('notVisible')
//         }
//     }
// })

let priceChange = 0;
let inputPriceChange = 0





let firstPrice = 0;
let firstPositionInput = 0;
let secondPositionInput = 0;
let secondPrice = 0;


buttonWrappers.addEventListener('input', (e) => {

    const firstInput = document.getElementById(`000000126`)
    const secondInput = document.getElementById(`000000127`)
    const firstInputCounters = document.getElementById(`${COAST_WELL + 'numberCounter'}`)
    const secondInputCounters = document.getElementById(`${COAST_FOUNTAIN + 'numberCounter'}`)
    const firstInputProgressBar = document.getElementById(`${COAST_WELL + 'progressBar'}`)
    const secondInputProgressBar = document.getElementById(`${COAST_FOUNTAIN + 'progressBar'}`)
    const firstActiveButton = document.getElementById('000000126').querySelector('button')
    const secondActiveButton = document.getElementById('000000127').querySelector('button')

    if (e.target.classList.contains('secondBlock__service-input') && e.target.parentNode.previousElementSibling.getAttribute('id') === '000000126') {
        let value = e.target.value

        e.target.addEventListener('focusout', () => {
            
            if (e.target.value == '') {
                e.target.value = 0

                firstActiveButton.classList.add('inactiveBtn')
                firstActiveButton.classList.remove('activeBtn')

                const index = listAdditionalServices.indexOf(`Количество метров: ${firstPositionInput}`)

                if (index != -1) {
                    listAdditionalServices.splice(index, 1)
                }

                inputPriceChange -= firstPositionInput * COAST_WELL
                firstPrice = 0
                firstPositionInput = value

                cost.textContent = startCost + priceChange + inputPriceChange

            }
        })


        if (value == ''){
            return
        }

        if (secondActiveButton.classList.contains('activeBtn')){
            secondActiveButton.classList.add('inactiveBtn')
            secondActiveButton.classList.remove('activeBtn')
        }

        const indexFirstInput = listAdditionalServices.indexOf(`Количество метров: ${firstPositionInput}`)
        const indexSecondInput = listAdditionalServices.indexOf(`Количество колец: ${secondPositionInput}`)

        if (indexFirstInput != -1) {
            listAdditionalServices.splice(indexFirstInput, 1)
        }

        if (indexSecondInput != -1) {
            listAdditionalServices.splice(indexSecondInput, 1)
        }

        


        if (+value > 99) {
            e.target.value = '100'
            value = '100'
        }

        inputPriceChange -= secondPrice;

        secondInput.nextElementSibling.querySelector('input').value = 0;
        secondPositionInput = 0;
        secondPrice = 0;

        
        if ((+value === 0)){

            if (firstActiveButton.classList.contains('activeBtn')){
                firstActiveButton.classList.add('inactiveBtn')
                firstActiveButton.classList.remove('activeBtn')
            }

            inputPriceChange -= firstPositionInput * COAST_WELL
            firstPrice = 0
            firstPositionInput = value


        }else if ((+value) > firstPositionInput) {

            if (firstActiveButton.classList.contains('inactiveBtn')){
                firstActiveButton.classList.add('activeBtn')
                firstActiveButton.classList.remove('inactiveBtn')
            }

            firstPrice = (+value) * COAST_WELL
            inputPriceChange += firstPrice - inputPriceChange
            firstPositionInput = value

            listAdditionalServices.push(`Количество метров: ${firstPositionInput}`)

        } else if ((+value) < firstPositionInput) {

            firstPrice = (+value) * COAST_WELL
            inputPriceChange += firstPrice - inputPriceChange
            firstPositionInput = value

            listAdditionalServices.push(`Количество метров: ${firstPositionInput}`)
            
        } else if ((+value) == firstPositionInput) {
            
            firstPrice = (+value) * COAST_WELL
            inputPriceChange += firstPrice - inputPriceChange
            firstPositionInput = value
            
            listAdditionalServices.push(`Количество метров: ${firstPositionInput}`)
        }

        firstPositionInput = +value


        cost.textContent = startCost + priceChange + inputPriceChange

    } else if (e.target.classList.contains('secondBlock__service-input') && e.target.parentNode.previousElementSibling.getAttribute('id') === '000000127') {
        let value = e.target.value

        e.target.addEventListener('focusout', () => {
            
            if (e.target.value == '') {
                e.target.value = 0

                firstActiveButton.classList.add('inactiveBtn')
                firstActiveButton.classList.remove('activeBtn')

                const index = listAdditionalServices.indexOf(`Количество метров: ${secondPositionInput}`)

                if (index != -1) {
                    listAdditionalServices.splice(index, 1)
                }

                inputPriceChange -= secondPositionInput * COAST_FOUNTAIN
                secondPrice = 0
                secondPositionInput = value

                cost.textContent = startCost + priceChange + inputPriceChange

            }
        })

        if (value == ''){
            return
        }

        if (firstActiveButton.classList.contains('activeBtn')){
            firstActiveButton.classList.add('inactiveBtn')
            firstActiveButton.classList.remove('activeBtn')
        }

        const indexFirstInput = listAdditionalServices.indexOf(`Количество метров: ${firstPositionInput}`)
        const indexSecondInput = listAdditionalServices.indexOf(`Количество колец: ${secondPositionInput}`)

        if (indexFirstInput != -1) {
            listAdditionalServices.splice(indexFirstInput, 1)
        }

        if (indexSecondInput != -1) {
            listAdditionalServices.splice(indexSecondInput, 1)
        }

        inputPriceChange -= firstPrice;
        firstInput.nextElementSibling.querySelector('input').value = 0;
        firstPositionInput = 0;
        firstPrice = 0;

        if (+value > 9) {
            e.target.value = '10'
            value = '10'
        }

        if ((+value === 0)){
            if (secondActiveButton.classList.contains('activeBtn')){
                secondActiveButton.classList.add('inactiveBtn')
                secondActiveButton.classList.remove('activeBtn')
            }

            inputPriceChange -= secondPositionInput * COAST_FOUNTAIN
            secondPrice = 0
            secondPositionInput = value

        }else if ((+value) > secondPositionInput) {
            if (secondActiveButton.classList.contains('inactiveBtn')){
                secondActiveButton.classList.add('activeBtn')
                secondActiveButton.classList.remove('inactiveBtn')
            }

            secondPrice = value * COAST_FOUNTAIN
            inputPriceChange += secondPrice - inputPriceChange
            secondPositionInput = e.target.value

            listAdditionalServices.push(`Количество колец: ${secondPositionInput}`)

        } else if ((+value) < secondPositionInput) {

            secondPrice = e.target.value * COAST_FOUNTAIN
            inputPriceChange += secondPrice - inputPriceChange
            secondPositionInput = e.target.value 

            listAdditionalServices.push(`Количество колец: ${secondPositionInput}`)

        } else if ((+value) == secondPositionInput) {
            
            secondPrice = value * COAST_FOUNTAIN
            inputPriceChange += secondPrice - inputPriceChange
            secondPositionInput = value 
            
            listAdditionalServices.push(`Количество колец: ${secondPositionInput}`)
        }

        secondPositionInput = +value

        cost.textContent = startCost + priceChange + inputPriceChange

    }
})
// click select button


buttonWrappers.addEventListener('click', (e) => {
    const target = e.target
    if (target.classList.contains('secondBlock__service-button') || target.classList.contains('secondBlock__service-buttonSelector')) {
        if (target.classList.contains('secondBlock__service-button')) {

            
    
            const btn = target.querySelector('button')
            const value = +btn.value

            
            if (btn.classList.contains('inactiveBtn')) {
                const id = btn.parentNode.getAttribute('id')
                const nameService = btn.parentNode.dataset.name


                if (id === '000000127' || id === '000000126'){
                    return
                }
    
                listAdditionalServices.push(nameService)


                let choiceElsId = ''
                let choice = ''


                if (choiceobj['cant choose without'][id]) {
                    choiceElsId = choiceobj['cant choose without'][id]
                        choice = 'cant choose without'
                } else if (choiceobj['mutually exclusive'][id]){
                    choiceElsId = choiceobj['mutually exclusive'][id]
                    choice = 'mutually exclusive'
                }

                if (choiceElsId && choice == 'mutually exclusive') {

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }
                        
                        const dataEl = el.dataset.name

                        if (choiceobj['cant choose without'][`${elId}`]){

                            const choiceEls = choiceobj['cant choose without'][`${elId}`]
                            choiceEls.forEach(choiceElId => {
                                const choiceEl = document.getElementById(`${choiceElId}`)
                                const choiceElChildren = choiceEl.children[0]
                                const choiceElData = choiceElId.dataset.name
                                const index = listAdditionalServices.indexOf(choiceElData)

                                if (index !== -1) {
                                    listAdditionalServices.splice(index, 1)
                                    choiceElChildren.classList.add('inactiveBtn')
                                    choiceElChildren.classList.remove('activeBtn')
                                    priceChange -= +choiceElChildren.getAttribute('value')
                                }
                            })
                        }

                        if(elChildren.classList.contains('activeBtn')){

                            elChildren.classList.remove('activeBtn')
                            elChildren.classList.add('inactiveBtn')
                            
                            priceChange -= +elChildren.getAttribute('value')
                            const index = listAdditionalServices.indexOf(dataEl)

                            if(index != -1) {
                                listAdditionalServices.splice(index, 1)
                            }
                        }
                    })
                } else if (choiceElsId && choice == 'cant choose without'){

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }

                        const dataEl = el.dataset.name

                        if (choiceobj['mutually exclusive'][id]){
                            const choiceEls = choiceobj['mutually exclusive'][id]
                            choiceEls.forEach(choiceElId => {
                                if (choiceobj['cant be removed without'][elId]){

                                    const indexEl = listAdditionalServices.indexOf(dataEl)

                                    if (indexEl !== -1) {
                                        listAdditionalServices.splice(indexEl, 1)
                                        priceChange -= +elChildren.getAttribute('value')
                                        elChildren.classList.add('inactiveBtn')
                                        elChildren.classList.remove('activeBtn')
                                    }
                                }

                                if (!document.getElementById(`${choiceElId}`)){
                                    return
                                }

                                const choiceEl = document.getElementById(`${choiceElId}`)
                                const choiceElChildren = choiceEl.children[0]
                                const choiceElData = choiceElId.dataset.name
                                const index = listAdditionalServices.indexOf(choiceElData)
                                
                                if (index !== -1) {
                                    listAdditionalServices.splice(index, 1)
                                    priceChange -= +choiceElChildren.getAttribute('value')
                                    choiceElChildren.classList.add('inactiveBtn')
                                    choiceElChildren.classList.remove('activeBtn')
                                }
                                
                            })
                        }
    
                        if(elChildren.classList.contains('inactiveBtn')){
                            elChildren.classList.remove('inactiveBtn')
                            elChildren.classList.add('activeBtn')
                            
                            priceChange += +elChildren.getAttribute('value')
                            const index = listAdditionalServices.indexOf(elId)
    
                            if(index == -1) {
                                listAdditionalServices.push(nameService)
                            }
                        }
                    })
                }

                
                btn.classList.add('activeBtn')
                btn.classList.remove('inactiveBtn')
                priceChange += value

            } else {

                const id = btn.parentNode.getAttribute('id')
                const nameService = btn.parentNode.dataset.name

                if (id === '000000127'){
                    
                    let secondInput = document.getElementById(`000000127`).nextElementSibling.children[1]

                    secondInput.value = 0

                    inputPriceChange = 0
                    
                    cost.textContent = startCost + priceChange + inputPriceChange

                } else if (id === '000000126'){

                    let firstInput = document.getElementById(`000000126`).nextElementSibling.children[1]

                    firstInput.value = 0

                    inputPriceChange = 0
                    
                    cost.textContent = startCost + priceChange + inputPriceChange

                }

                let choiceElsId = ''
                let choice = ''
                if (choiceobj['cant be removed without'][id]) {
                    choiceElsId = choiceobj['cant be removed without'][id]
                    choice = 'cant be removed without'
                } else if (choiceobj['cant choose without'][id]){
                    choiceElsId = choiceobj['cant choose without'][id]
                    choice = 'cant choose without'
                }

                if (choiceElsId && choice == 'cant be removed without') {

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }

                        const dataEl = el.dataset.name

                        const indexEl = listAdditionalServices.indexOf(dataEl)
                        if (indexEl !== -1) {

                            listAdditionalServices.splice(indexEl, 1)
                            elChildren.classList.add('inactiveBtn')
                            elChildren.classList.remove('activeBtn')
        
                            priceChange -= +elChildren.getAttribute('value')
                        }
                        
                    })      
                    const indexEl = listAdditionalServices.indexOf(nameService)
                    listAdditionalServices.splice(indexEl, 1)
                } else if (choiceElsId && choice == 'cant choose without') {

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }
                        const dataEl = el.dataset.name

                        const indexEl = listAdditionalServices.indexOf(dataEl)

                        if (indexEl !== -1){

                            listAdditionalServices.splice(indexEl, 1)
                            
                            elChildren.classList.add('inactiveBtn')
                            elChildren.classList.remove('activeBtn')
        
                            priceChange -= +elChildren.getAttribute('value')
                        }
    
                    })                
                    const indexEl = listAdditionalServices.indexOf(nameService)
                    listAdditionalServices.splice(indexEl, 1)
                } else {
                    if (id === '000000102' || id === '000000101') {
                        const facadeImitation = document.getElementById('000000144').querySelector('button')

                        if (facadeImitation.classList.contains('inactiveBtn')) {
                            listAdditionalServices.push('Имитация бруса')
                            facadeImitation.classList.add('activeBtn')
                            facadeImitation.classList.remove('inactiveBtn')
                            priceChange += +facadeImitation.getAttribute('value')
                        }
                    }

                    if (id === '000000144'){
                        return
                    }

                    const indexEl = listAdditionalServices.indexOf(nameService)
                    listAdditionalServices.splice(indexEl, 1)
                }

                
                btn.classList.add('inactiveBtn')
                btn.classList.remove('activeBtn')
                priceChange -= value

            }

            cost.textContent = startCost + priceChange + inputPriceChange

        } else {
            const btn = target.parentNode.querySelector('button')
            const value = +btn.value

    
            if (btn.classList.contains('inactiveBtn')) {
                const id = btn.parentNode.getAttribute('id')
                const nameService = btn.parentNode.dataset.name


                if (id === '000000127' || id === '000000126'){
                    return
                }
    
                listAdditionalServices.push(nameService)


                let choiceElsId = ''
                let choice = ''


                if (choiceobj['cant choose without'][id]) {
                    choiceElsId = choiceobj['cant choose without'][id]
                        choice = 'cant choose without'
                } else if (choiceobj['mutually exclusive'][id]){
                    choiceElsId = choiceobj['mutually exclusive'][id]
                    choice = 'mutually exclusive'
                }

                if (choiceElsId && choice == 'mutually exclusive') {

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }
                        
                        const dataEl = el.dataset.name

                        if (choiceobj['cant choose without'][`${elId}`]){

                            const choiceEls = choiceobj['cant choose without'][`${elId}`]
                            choiceEls.forEach(choiceElId => {
                                const choiceEl = document.getElementById(`${choiceElId}`)
                                const choiceElChildren = choiceEl.children[0]
                                const choiceElData = choiceElId.dataset.name
                                const index = listAdditionalServices.indexOf(choiceElData)

                                if (index !== -1) {
                                    listAdditionalServices.splice(index, 1)
                                    choiceElChildren.classList.add('inactiveBtn')
                                    choiceElChildren.classList.remove('activeBtn')
                                    priceChange -= +choiceElChildren.getAttribute('value')
                                }
                            })
                        }

                        if(elChildren.classList.contains('activeBtn')){

                            elChildren.classList.remove('activeBtn')
                            elChildren.classList.add('inactiveBtn')
                            
                            priceChange -= +elChildren.getAttribute('value')
                            const index = listAdditionalServices.indexOf(dataEl)

                            if(index != -1) {
                                listAdditionalServices.splice(index, 1)
                            }
                        }
                    })
                } else if (choiceElsId && choice == 'cant choose without'){

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }

                        const dataEl = el.dataset.name

                        if (choiceobj['mutually exclusive'][id]){
                            const choiceEls = choiceobj['mutually exclusive'][id]
                            choiceEls.forEach(choiceElId => {
                                if (choiceobj['cant be removed without'][elId]){

                                    const indexEl = listAdditionalServices.indexOf(dataEl)

                                    if (indexEl !== -1) {
                                        listAdditionalServices.splice(indexEl, 1)
                                        priceChange -= +elChildren.getAttribute('value')
                                        elChildren.classList.add('inactiveBtn')
                                        elChildren.classList.remove('activeBtn')
                                    }
                                }

                                if (!document.getElementById(`${choiceElId}`)){
                                    return
                                }

                                const choiceEl = document.getElementById(`${choiceElId}`)
                                const choiceElChildren = choiceEl.children[0]
                                const choiceElData = choiceElId.dataset.name
                                const index = listAdditionalServices.indexOf(choiceElData)
                                
                                if (index !== -1) {
                                    listAdditionalServices.splice(index, 1)
                                    priceChange -= +choiceElChildren.getAttribute('value')
                                    choiceElChildren.classList.add('inactiveBtn')
                                    choiceElChildren.classList.remove('activeBtn')
                                }
                                
                            })
                        }
    
                        if(elChildren.classList.contains('inactiveBtn')){
                            elChildren.classList.remove('inactiveBtn')
                            elChildren.classList.add('activeBtn')
                            
                            priceChange += +elChildren.getAttribute('value')
                            const index = listAdditionalServices.indexOf(elId)
    
                            if(index == -1) {
                                listAdditionalServices.push(nameService)
                            }
                        }
                    })
                }

                
                btn.classList.add('activeBtn')
                btn.classList.remove('inactiveBtn')
                priceChange += value

            } else {

                const id = btn.parentNode.getAttribute('id')
                const nameService = btn.parentNode.dataset.name

                if (id === '000000127'){
                    
                    let secondInput = document.getElementById(`000000127`).nextElementSibling.children[1]

                    secondInput.value = 0

                    inputPriceChange = 0
                    
                    cost.textContent = startCost + priceChange + inputPriceChange

                } else if (id === '000000126'){

                    let firstInput = document.getElementById(`000000126`).nextElementSibling.children[1]

                    firstInput.value = 0

                    inputPriceChange = 0
                    
                    cost.textContent = startCost + priceChange + inputPriceChange

                }

                let choiceElsId = ''
                let choice = ''
                if (choiceobj['cant be removed without'][id]) {
                    choiceElsId = choiceobj['cant be removed without'][id]
                    choice = 'cant be removed without'
                } else if (choiceobj['cant choose without'][id]){
                    choiceElsId = choiceobj['cant choose without'][id]
                    choice = 'cant choose without'
                }

                if (choiceElsId && choice == 'cant be removed without') {

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }

                        const dataEl = el.dataset.name

                        const indexEl = listAdditionalServices.indexOf(dataEl)
                        if (indexEl !== -1) {

                            listAdditionalServices.splice(indexEl, 1)
                            elChildren.classList.add('inactiveBtn')
                            elChildren.classList.remove('activeBtn')
        
                            priceChange -= +elChildren.getAttribute('value')
                        }
                        
                    })      
                    const indexEl = listAdditionalServices.indexOf(nameService)
                    listAdditionalServices.splice(indexEl, 1)
                } else if (choiceElsId && choice == 'cant choose without') {

                    choiceElsId.forEach(elId => {
                        const el = document.getElementById(`${elId}`)
                        
                        let elChildren = ''
                        if(!el) {
                            return
                        } else {
                            elChildren = el.children[0]
                        }
                        const dataEl = el.dataset.name

                        const indexEl = listAdditionalServices.indexOf(dataEl)

                        if (indexEl !== -1){

                            listAdditionalServices.splice(indexEl, 1)
                            
                            elChildren.classList.add('inactiveBtn')
                            elChildren.classList.remove('activeBtn')
        
                            priceChange -= +elChildren.getAttribute('value')
                        }
    
                    })                
                    const indexEl = listAdditionalServices.indexOf(nameService)
                    listAdditionalServices.splice(indexEl, 1)
                } else {
                    if (id === '000000102' || id === '000000101') {
                        const facadeImitation = document.getElementById('000000144').querySelector('button')

                        if (facadeImitation.classList.contains('inactiveBtn')) {
                            listAdditionalServices.push('Имитация бруса')
                            facadeImitation.classList.add('activeBtn')
                            facadeImitation.classList.remove('inactiveBtn')
                            priceChange += +facadeImitation.getAttribute('value')
                        }
                    }

                    if (id === '000000144'){
                        return
                    }

                    const indexEl = listAdditionalServices.indexOf(nameService)
                    listAdditionalServices.splice(indexEl, 1)
                }

                
                btn.classList.add('inactiveBtn')
                btn.classList.remove('activeBtn')
                priceChange -= value

            }

            cost.textContent = startCost + priceChange + inputPriceChange
        }

        console.log(listAdditionalServices)
    }
})




const buttonsSpan = document.querySelectorAll('.secondBlock__service-span')
const imgBtn = document.querySelector('.firstBlock__carousel-item')
const modal = document.querySelector(`.modalMain.bgwhite`)
let slideIndexModal = 1;


imgBtn.addEventListener('click', () => {
    modal.classList.add('visible')
    modal.classList.remove('notVisible')
    document.body.style.overflow = 'hidden';
    slidesModal.forEach((slide, i) => {
        if (slide.classList.contains('active')){
            slideIndexModal = i + 1
            showSlidesModal(slideIndexModal)
        }
    }) 
})

const buttonWrapper = modal.children[0]
const btnClose = buttonWrapper.children[0]
btnClose.addEventListener('click', (e) => {
    if (modal.classList.contains('visible')){
        modal.classList.remove('visible')
        modal.classList.add('notVisible')
        document.body.style.overflow = '';
    }
})

buttonWrapper.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__wrapper')){
        modal.classList.remove('visible')
        modal.classList.add('notVisible')
        document.body.style.overflow = '';
    }
})

const mediaQuerrymax1200 = window.matchMedia('(max-width: 1199px)')
const sliderImgsModal = modal.querySelectorAll('.modalMain__img')
const btnNext = buttonWrapper.children[buttonWrapper.children.length - 2]
const btnPrev = buttonWrapper.children[buttonWrapper.children.length - 1]


function showSlidesModal(n) {

    if (n > sliderImgsModal.length) {
        slideIndexModal= 1
    } 

    if  (n < 1) {
        slideIndexModal = sliderImgsModal.length
    }

    sliderImgsModal.forEach( slide => slide.classList.add('none'))
    sliderImgsModal.forEach( slide => slide.classList.remove('block'))
    sliderImgsModal[slideIndexModal - 1].classList.add('block')
    sliderImgsModal[slideIndexModal - 1].classList.remove('none')

}

function plusSlidesModal(n) {
    showSlidesModal(slideIndexModal += n)
}

btnPrev.addEventListener('click', function(){
    plusSlidesModal(-1)
})

btnNext.addEventListener('click', function(){
    plusSlidesModal(1)
})

buttonsSpan.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.querySelector(`.modal[data-modal=${btn.dataset.modal}]`)
        modal.classList.add('visible')
        modal.classList.remove('notVisible')
        document.body.style.overflow = 'hidden';
    })
})


const modals = document.querySelectorAll('.modal')
modals.forEach(modal => {
    const buttonWrapper = modal.children[0]
    const btnClose = buttonWrapper.children[0]
    btnClose.addEventListener('click', (e) => {
        if (modal.classList.contains('visible')){
            modal.classList.remove('visible')
            modal.classList.add('notVisible')
            document.body.style.overflow = '';
        }
    })

    buttonWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal__wrapper')){
            modal.classList.remove('visible')
            modal.classList.add('notVisible')
            document.body.style.overflow = '';
        }
    })

    // modal slider


    const sliderImgs = buttonWrapper.querySelectorAll('.modal__img')
    const btnNext = buttonWrapper.children[buttonWrapper.children.length - 2]
    const btnPrev = buttonWrapper.children[buttonWrapper.children.length - 1]

    let slideIndex = 1;

    showSlides(slideIndex)


    function showSlides(n) {

        if (n > sliderImgs.length) {
            slideIndex = 1
        } 

        if  (n < 1) {
            slideIndex = sliderImgs.length
        }

        sliderImgs.forEach( slide => slide.classList.add('none'))
        sliderImgs.forEach( slide => slide.classList.remove('block'))

        sliderImgs[slideIndex - 1].classList.add('block')
        sliderImgs[slideIndex - 1].classList.remove('none')

    }

    function plusSlides(n) {
        showSlides(slideIndex += n)
    }

    btnPrev.addEventListener('click', function(){
        plusSlides(-1)
    })

    btnNext.addEventListener('click', function(){
        plusSlides(1)
    })
})











