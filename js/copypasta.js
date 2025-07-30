import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")
let isDetailActive = false;
const idMapping = new Map();
let currentCopypasta = null;
let currentId = null
renderCopypastaList(copypasta)
detailRoot.addEventListener("input",updateTemplate)
function updateTemplate(e){
  if(e.target.tagName==="INPUT"){
    const idx = e.target.dataset.index
    // dapatkan new value
    const templateTexts = [...document.querySelectorAll(".replaced-word")]
    let val = e.srcElement.value
    let isEmpty = false
    if(e.srcElement.value===''){
      val = currentCopypasta.parameters[idx]
      isEmpty = true
    }
    templateTexts.filter((e)=>e.dataset.index===idx).forEach((element)=>{
      element.textContent = element.textContent.replace(idMapping.get(idx),val)
      if(isEmpty){
        element.classList.add('empty')
      }else{
        element.classList.remove('empty')
      }
    })
    idMapping.set(idx,val)
  }
}


function showDetail(id){
  if(isDetailActive && currentId==id){
    detailRoot.innerHTML = ""
    currentId = null
    isDetailActive = false;
  }
  else{
    //reset mapping
    idMapping.clear()
    // cari data
    const c = copypasta.filter(c=>c.id===id)[0]
    currentCopypasta = c
    // buat mapping
    for(let i=0;i<c.parameters.length;i++){
      idMapping.set(i.toString(),c.parameters[i])
    }
    const paramInputHTML = c.parameters.map((p,i)=>`<div class="param-input"><p>${p}</p><input type="text" data-index=${i}></div>`)    
    let text = c.text.split("\n").map(c=>`<p class="template-text">${c}</p>`).join('')
    // make span for the replaced
    text = text.replace(/(?<!\\)\{[^{}]+\}/g,(match)=>{
      const idx = match.slice(1,-1)
      return `<span class="replaced-word empty" data-index=${idx}>${c.parameters[idx]}</span>`
    })
    const detail = `
    <div class="detail-box">
      <div id='template'>${text}</div>
      <div id='replace'>${paramInputHTML.length>0 ? paramInputHTML.join('') : ""}</div>
    </div>`
    detailRoot.innerHTML = detail
    currentId = id;
    isDetailActive = true
  }
}

function renderCopypastaList(copypasta){
  const copypastaList = copypasta.map((c)=>`<div class="project copypasta-info"  data-id=${c.id}>
        <div class="desc copypasta-box">
          <h2>${c.name}</h2>
          <p>${c.description}</p>
        </div>
      </div>`)
  copypastaRoot.innerHTML = copypastaList.join("")
  // add listener
  const copypastaInfos = document.querySelectorAll(".copypasta-info")
  copypastaInfos.forEach((c)=>{
    c.addEventListener("click",()=>{
      const id= parseInt(c.getAttribute("data-id"))
      showDetail(id)
    })
  })
  }