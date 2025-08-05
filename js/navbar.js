function showTabs(){
    const tabs = document.getElementById("tabs")
    const bar = document.querySelector("a.icon")
    if(tabs.style.display==='block'){
        tabs.style.display= 'none'
        bar.classList.remove("open")
    }
    else{
        tabs.style.display= 'block'
        bar.classList.add("open")
    }
}