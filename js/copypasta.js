import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")
let isDetailActive = false;
renderCopypastaList(copypasta)

function showDetail(id){
  isDetailActive = !isDetailActive;
  if(isDetailActive){
    detailRoot.innerHTML = ""
  }
  else{
    const c = copypasta.filter(c=>c.id===id)[0]
    const paramInputHTML = c.parameters.map((p)=>`<div class="param-input"><p>${p}</p><input type="text"></div>`)
    const text = c.text.split("\n").map(c=>`<p>${c}</p>`).join('')
    const detail = `
    <div class="detail-box">
      <div id='template'>${text}</div>
      <div id='replace'>${paramInputHTML.join('')}</div>
    </div>`
    detailRoot.innerHTML = detail
  }

}

function renderCopypastaList(copypasta){
  console.log(copypasta)
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