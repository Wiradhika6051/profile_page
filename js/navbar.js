function showTabs(){
    const tabs = document.getElementById("tabs")
    const bar = document.querySelector("a.icon")
    if(tabs.style.display==='block'){
        tabs.style.display= 'none'
    }
    else{
        tabs.style.display= 'block'
    }
    bar.classList.toggle("open")
}

document.addEventListener("click",function(event){
    const tabs = document.getElementById("tabs")
    const bar = document.querySelector("a.icon")

    if(bar.classList.contains("open") && !tabs.contains(event.target) && !bar.contains(event.target)){
        // selain tab dan bar tapi dropdown kebuka
        showTabs()
    }
})

window.addEventListener("resize",function(event){
    const tabs = document.getElementById("tabs")
    const bar = document.querySelector("a.icon")
    if (window.innerWidth>500){
        console.log("resize",window.innerWidth,bar.classList.contains("open"))
        if(bar.classList.contains("open")){
            bar.classList.remove("open")
        }
        tabs.style.display= 'flex'
    }
    else{
        tabs.style.display= 'none'
    }
})