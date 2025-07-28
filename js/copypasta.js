import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")
let isDetailActive = false;
const idMapping = new Map();
renderCopypastaList(copypasta)
detailRoot.addEventListener("input",updateTemplate)
function updateTemplate(e){
  if(e.target.tagName==="INPUT"){
    const idx = e.target.dataset.index
    // dapatkan new value
    const templateTexts = document.querySelectorAll(".template-text")
    console.log(e.srcElement.value)
    console.log(idMapping.get(idx))
    let val = e.srcElement.value
    if(e.srcElement.value===''){
      val = idx
    }
    templateTexts.forEach((element)=>{
      element.textContent = element.textContent.replace(idMapping.get(idx),`{${val}}`)
    })
    console.log(templateTexts[0])
    idMapping.set(idx,`{${val}}`)
  }
}


function showDetail(id){
  if(isDetailActive){
    detailRoot.innerHTML = ""
  }
  else{
    //reset mapping
    idMapping.clear()
    // cari data
    const c = copypasta.filter(c=>c.id===id)[0]
    // buat mapping
    for(let i=0;i<c.parameters.length;i++){
      idMapping.set(i.toString(),`{${i}}`)
    }
    const paramInputHTML = c.parameters.map((p,i)=>`<div class="param-input"><p>${p}</p><input type="text" data-index=${i}></div>`)    
    const text = c.text.split("\n").map(c=>`<p class="template-text">${c}</p>`).join('')
    const detail = `
    <div class="detail-box">
      <div id='template'>${text}</div>
      <div id='replace'>${paramInputHTML.join('')}</div>
    </div>`
    detailRoot.innerHTML = detail
  }
  isDetailActive = !isDetailActive;
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