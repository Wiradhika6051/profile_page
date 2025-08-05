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