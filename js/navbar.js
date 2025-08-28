const tabs = document.getElementById("tabs");
const bar = document.querySelector("a.icon");

function toggleTabs(){
    if(tabs.style.display==='flex'){
        tabs.style.display= 'none'
    }
    else{
        tabs.style.display= 'flex'
    }
    bar.classList.toggle("open")
}

document.addEventListener("click",function(event){
    if(bar.classList.contains("open") && !tabs.contains(event.target) && !bar.contains(event.target)){
        // selain tab dan bar tapi dropdown kebuka
        toggleTabs()
    }
})

window.addEventListener("resize",function(event){
    if (window.innerWidth>500){
        if(bar.classList.contains("open")){
            bar.classList.remove("open")
        }
        tabs.style.display= 'flex'
    }
    else{
        tabs.style.display= 'none'
    }
})