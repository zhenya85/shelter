'use strict'

let arrowLeft = document.querySelector('#arrowLeft')
let arrowRight = document.querySelector('#arrowRight')
let sliderProducts = document.querySelectorAll('.slider__product')
let body=document.querySelector('body')
// let product=document.querySelectorAll('.slider__product__btn')
//let product = sliderProducts;
let chkpoopap = document.querySelector('#chkpoopap')
let poopapImg = document.querySelector('#poopapImg')
let pName = document.querySelector('#pName')
let pType = document.querySelector('#pType')
let description = document.querySelector('#description')
let pAge = document.querySelector('#pAge')
let pInoculations = document.querySelector('#pInoculations')
let pDiseases = document.querySelector('#pDiseases')
let pParasites = document.querySelector('#pParasites')

let fullPetsSlider = document.querySelector('#fullPetsSlider')
let firstPage = document.querySelector('#firstPage')
let prevStep = document.querySelector('#prevStep')
let numPage = document.querySelector('#numPage')
let nextStep = document.querySelector('#nextStep')
let endPage = document.querySelector('#endPage')

let safeSlidePosition;
let slidePosition = 0
let numberSlidePets = 1
let datapets = []
let fullPets = []

const request = new XMLHttpRequest()
if (fullPetsSlider) {
    request.open('GET', '../../pets.json')
} else {
    request.open('GET', './pets.json')
}
request.send()


request.onload = () => {
    datapets = JSON.parse(request.response)
    for (let i = 0; i < 6; i++) {
        datapets = shuffle(datapets)
        fullPets = [...fullPets, ...datapets]
    }
    if (!fullPetsSlider && sliderProducts) {
        changeMainSlide()
        arrowLeft.addEventListener('click', function () {
            slideShowRightToLeft(sliderProducts, changeMainSlide);
        })
        arrowRight.addEventListener('click', function () {
            slideShowLeftToRight(sliderProducts, changeMainSlide);

        })

        addPoopapToBlock(sliderProducts,datapets);
    }
    if (fullPetsSlider) {
        slidePosition = addPetsToSlider(fullPetsSlider, slidePosition);

        safeSlidePosition=slidePosition;
        nextStep.addEventListener('click', function () {
            let petsColumns = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-columns')
            let petsRows = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-rows')
            let petsCount = petsColumns * petsRows
            if (slidePosition < fullPets.length) {
                if (petsCount < fullPets.length - 1) {
                    firstPage.classList.remove('button_inactive')
                    prevStep.classList.remove('button_inactive')
                    firstPage.disabled = false
                    prevStep.disabled = false
                }
                numPage.innerText = Number(numPage.innerText) + 1
                slidePosition = addPetsToSlider(fullPetsSlider, slidePosition);

                if (slidePosition + petsCount > fullPets.length) {
                    nextStep.classList.add('button_inactive')
                    endPage.classList.add('button_inactive')
                    nextStep.disabled = true
                    endPage.disabled = true
                }
            }
        })
        prevStep.addEventListener('click', function () {
            let petsColumns = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-columns')
            let petsRows = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-rows')
            let petsCount = petsColumns * petsRows
            if (slidePosition >= 0) {
                if (petsCount >= 0) {
                    nextStep.classList.remove('button_inactive')
                    nextStep.disabled = false
                    endPage.classList.remove('button_inactive')
                    endPage.disabled = false
                }

                numPage.innerText = Number(numPage.innerText) - 1
                slidePosition = addPetsToSlider(fullPetsSlider, slidePosition, true);

                if (slidePosition === petsCount) {
                    firstPage.classList.add('button_inactive')
                    prevStep.classList.add('button_inactive')
                    firstPage.disabled = true
                    prevStep.disabled = true
                }
                if (petsCount > fullPets.length - 1 - petsCount) {
                    nextStep.classList.add('button_inactive')
                    endPage.classList.add('button_inactive')
                }
            }
        })
        firstPage.addEventListener('click',function (){
            let petsColumns = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-columns')
            let petsRows = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-rows')
            let petsCount = petsColumns * petsRows
            firstPage.classList.add('button_inactive')
            prevStep.classList.add('button_inactive')
            firstPage.disabled = true
            prevStep.disabled = true
            nextStep.classList.remove('button_inactive')
            endPage.classList.remove('button_inactive')
            nextStep.disabled = false
            endPage.disabled = false
            if(petsCount>=fullPets.length){
                nextStep.classList.add('button_inactive')
                endPage.classList.add('button_inactive')
                nextStep.disabled = true
                endPage.disabled = true
            }
            numPage.innerText='1'
            slidePosition = addPetsToSlider(fullPetsSlider, petsCount*2,true);

        })
        endPage.addEventListener('click',function (){
            let petsColumns = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-columns')
            let petsRows = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-rows')
            let petsCount = petsColumns * petsRows
            nextStep.classList.add('button_inactive')
            endPage.classList.add('button_inactive')
            nextStep.disabled = true
            endPage.disabled = true
            firstPage.classList.remove('button_inactive')
            prevStep.classList.remove('button_inactive')
            firstPage.disabled = false
            prevStep.disabled = false
            if(petsCount>=fullPets.length){
                firstPage.classList.add('button_inactive')
                prevStep.classList.add('button_inactive')
                firstPage.disabled = true
                prevStep.disabled = true
            }
            numPage.innerText=Math.ceil(fullPets.length/petsCount)
            slidePosition = addPetsToSlider(fullPetsSlider, fullPets.length-petsCount);


        })

    }

    setInterval(function (){
        let petsColumns = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-columns')
        let petsRows = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-rows')
        let petsCount = petsColumns * petsRows
        if(petsCount!==safeSlidePosition){
            if(slidePosition>=fullPets.length-petsCount){
                slidePosition = addPetsToSlider(fullPetsSlider, fullPets.length-petsCount);
            }
            else {
                slidePosition = addPetsToSlider(fullPetsSlider, slidePosition-safeSlidePosition);
            }
            numPage.innerText=Math.ceil(slidePosition/petsCount)
            safeSlidePosition=petsCount;
        }
        
    },100)
}


/**
 * Анимация смены слайдов влево
 * @param blockContent Контейнер с элементами
 * @param slideFunc Функция смены данных в слайдере
 */
function slideShowRightToLeft(blockContent, slideFunc) {
    blockContent.forEach(item => {
        item.classList.remove('animate__backInLeft')
        item.classList.remove('animate__backInRight')
        item.classList.add('animate__backOutLeft')
    })
    setTimeout(function () {
        slideFunc()
        blockContent.forEach(item => {
            item.classList.remove('animate__backOutRight')
            item.classList.remove('animate__backOutLeft')
            item.classList.add('animate__backInRight')
        })
    }, 500)
}

/**
 * Анимация смены слайдов вправо
 * @param blockContent Контейнер с элементами
 * @param slideFunc Функция смены данных в слайдере
 */
function slideShowLeftToRight(blockContent, slideFunc) {
    blockContent.forEach(item => {
        item.classList.remove('animate__backInLeft')
        item.classList.remove('animate__backInRight')
        item.classList.add('animate__backOutRight')
    })
    setTimeout(function () {
        slideFunc()
        blockContent.forEach(item => {
            item.classList.remove('animate__backOutRight')
            item.classList.remove('animate__backOutLeft')
            item.classList.add('animate__backInLeft')
        })
    }, 500)
}

/**
 * Назначение poopap окна для каждого элемента
 * @param product Контейнер с элементами
 */
function addPoopapToBlock(product,datapets) {
    product.forEach(item => {
        item.addEventListener('click', function (e) {
            let numSlide = item.dataset.number
            if (poopapImg.dataset.page === 'main') {
                poopapImg.src = datapets[numSlide]['img'].replace('../../', '')
            } else {
                poopapImg.src = datapets[numSlide]['img']
            }
            pName.innerText = datapets[numSlide]['name']
            pType.innerText = `${datapets[numSlide]['type']} - ${datapets[numSlide]['breed']}`
            description.innerText = datapets[numSlide]['description']
            pAge.innerText = datapets[numSlide]['age']
            pInoculations.innerText = createInfo(datapets[numSlide]['inoculations'])
            pDiseases.innerText = createInfo(datapets[numSlide]['diseases'])
            pParasites.innerText = createInfo(datapets[numSlide]['parasites'])
            chkpoopap.checked = true;
            e.preventDefault();
        })
    })
}

/**
 * Добавляет питомцев в слайдер
 * @param fullPetsSlider Контейнер, в который помещаются элементы
 * @param position Позиция в массиве данных, на основании которого формируются блоки
 * @param reverse Направления продвижения по массиву (true - в прямом напрвлении, false - в обратном
 * @returns {number|*} Текущая позиция в массиве
 */
function addPetsToSlider(fullPetsSlider, position, reverse = false) {
    if (numPage.innerText > 1 && !reverse) {
        let pets = document.querySelectorAll('.pet')
        pets.forEach(item => {
            item.classList.remove('animate__backInRight')
            item.classList.remove('animate__backInLeft')
            item.classList.add('animate__backOutLeft')
        })
    } else if (numPage.innerText >= 1 && reverse) {
        let pets = document.querySelectorAll('.pet')
        pets.forEach(item => {
            item.classList.remove('animate__backInRight')
            item.classList.remove('animate__backInLeft')
            item.classList.add('animate__backOutRight')
        })
    }

//Определение количества элементов в блоке
    let petsColumns = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-columns')
    let petsRows = +getComputedStyle(fullPetsSlider).getPropertyValue('--slide-rows')
    let petsCount = petsColumns * petsRows

    setTimeout(function () {
        fullPetsSlider.innerText = ''
//генерация элементов для блока
        let animateBlock = ''
        let index;
        if (!reverse) {


            for (let i = 0; i < petsCount; i++) {
                let petBlock = `<div class="pet animate__animated animate__backInRight" data-number="${position + i}">
                <img src="${fullPets[position + i]["img"]}" alt="pet photo" class="pet__img">
                <h3 class="pet__name">${fullPets[position + i]["name"]}</h3>
                <a href="#" class="pet__button">Learn more</a>
            </div>`
                fullPetsSlider.insertAdjacentHTML('beforeend', petBlock)

            }
        }
        else {
            position-=petsCount
            for (let i = 0; i < petsCount; i++) {
                let petBlock = `<div class="pet animate__animated animate__backInLeft" data-number="${position - i - 1}">
                <img src="${fullPets[position - i - 1]["img"]}" alt="pet photo" class="pet__img">
                <h3 class="pet__name">${fullPets[position - i - 1]["name"]}</h3>
                <a href="#" class="pet__button">Learn more</a>
            </div>`
                fullPetsSlider.insertAdjacentHTML('afterbegin', petBlock)

            }
        }
        let pet=document.querySelectorAll('.pet')
        addPoopapToBlock(pet,fullPets)
    }, 500)

    return reverse ? position - petsCount : position + petsCount

}

/**
 * Функция сортировки
 * @param arr Исходный массив данных
 * @returns {*} Конечный массив данных
 */
function shuffle(arr) {
    let j, temp;
    for (let i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

/**
 * генерирует новые данные для слайдера
 */
function changeMainSlide() {
    datapets = shuffle(datapets)
    for (let i = 0; i < sliderProducts.length; i++) {
        sliderProducts[i].children[0].src = datapets[i]['img'].replace('../../', '')
        sliderProducts[i].children[1].innerText = datapets[i]['name']
    }
}

/**
 * Формирует строку данных из массива
 * @param data Массив данных
 * @returns {*} Сформированная строка
 */
function createInfo(data) {
    return data.reduce((info, item, index) => index !== data.length - 1 ? info + item + ', ' : info + item, '')
}


