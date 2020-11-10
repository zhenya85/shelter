let btnMenu=document.querySelector('#btnMenu')
let winMenu=document.querySelector('#winMenu')
let chkmenu=document.querySelector('#chkmenu')
let lgTitle=document.querySelector('#lgTitle')
let subTitle=document.querySelector('#subTitle')
let menuMobile=document.querySelector('#menuMobile')
btnMenu.addEventListener('click',function (){
    if (!chkmenu.checked){
        winMenu.classList.remove('animate__fadeOutRight')
        winMenu.style.display='flex'
        winMenu.classList.add('animate__fadeInRight')
        lgTitle.classList.add('mb-logo__title')
        subTitle.classList.add('mb-logo__subtitle')
    }
    else {
        winMenu.classList.remove('animate__fadeInRight')
        winMenu.classList.add('animate__fadeOutRight')
        lgTitle.classList.remove('mb-logo__title')
        subTitle.classList.remove('mb-logo__subtitle')
        setTimeout(()=>{
            winMenu.style.display='none'
        },1000)
    }
})
document.addEventListener('click',function (e){
    let eventElement=e.target;
    if ((!menuMobile.contains(eventElement) || eventElement.localName==='body') && chkmenu.checked){
        chkmenu.checked=false
        winMenu.classList.remove('animate__fadeInRight')
        winMenu.classList.add('animate__fadeOutRight')
        lgTitle.classList.remove('mb-logo__title')
        subTitle.classList.remove('mb-logo__subtitle')
        setTimeout(()=>{
            winMenu.style.display='none'
        },1000)
    }
    return null;
})