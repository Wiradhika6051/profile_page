import copypasta from "../data/copypasta.json" with {type:"json"}
// DOM
const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")

// State
let isDetailActive = false;
let currentCopypasta = null;
let currentId = null
const idMapping = new Map();

// Initial Render
renderCopypastaList(copypasta)
detailRoot.addEventListener("input",handleParameterUpdate)


// Toast Notification
function showToast(message,duration= 3000){
  const toast = document.createElement("div")
  toast.className = 'toast'
  toast.textContent = message

  document.getElementById("toast-container").appendChild(toast)

  setTimeout(()=>{
    toast.remove()
  },duration)
}

// oninput in parameter
function handleParameterUpdate(e){
  const target = e.target
  if(target.tagName!=="INPUT") return;

  const idx = e.target.dataset.index
  // dapatkan template string {idx}
  const replacedTexts = [...document.querySelectorAll(".replaced-word")]
  let val = e.srcElement.value
  let isEmpty = val===''

  if(isEmpty){
    val = currentCopypasta.parameters[idx]
  }

  replacedTexts
    .filter((e)=>e.dataset.index===idx)
    .forEach((element)=>{
      element.textContent = element.textContent.replace(idMapping.get(idx),val)
      element.classList.toggle('empty',isEmpty)
    })

  idMapping.set(idx,val)
}

// Copy text to clipboard
function copyText(e){
  const text = e.srcElement.innerText
  navigator.clipboard.writeText(text)
  showToast("Teks berhasil disalin!")
}

// Show detail panel
function showDetail(id){
  if(isDetailActive && currentId==id){
    detailRoot.innerHTML = ""
    currentId = null
    isDetailActive = false;
    return;
  }

  // Reset
  idMapping.clear()
  currentCopypasta = copypasta.find(c=>c.id===id)
  currentId = id;
  isDetailActive = true

  // Map initial parameters
  for(let i=0;i<currentCopypasta.parameters.length;i++){
    idMapping.set(i.toString(),currentCopypasta.parameters[i])
  }

  // Create input fields
  const paramInputs = currentCopypasta.parameters.map((p,i)=>
    `<div class="param-input">
        <p>${p}</p>
        <input type="text" data-index=${i}>
    </div>
  `).join('')    

  // Fill the template detail
  const text = currentCopypasta.text
    .split("\n")
    .map(c=>`<p class="template-text">${c}</p>`)
    .join("")
    .replace(/(?<!\\)\{[^{}]+\}/g,(match)=>{
    const idx = match.slice(1,-1)
    return `<span class="replaced-word empty" data-index=${idx}>${currentCopypasta.parameters[idx]}</span>`
  })

  // Render detail panel
  detailRoot.innerHTML = `
    <div class="detail-box">
      <div id='template'>${text}</div>
      <div id='replace'>${paramInputs}</div>
    </div>`

  document.querySelector("#template").addEventListener("click",copyText)
}

// Render copypasta list
function renderCopypastaList(copypasta){
  copypastaRoot.innerHTML = copypasta.map((c)=>`
    <div class="project copypasta-info"  data-id=${c.id}>
      <div class="desc copypasta-box">
        <h2>${c.name}</h2>
        <p>${c.description}</p>
      </div>
    </div>
  `).join("")

  document.querySelectorAll(".copypasta-info").forEach((c)=>{
    c.addEventListener("click",()=>{
      const id= parseInt(c.getAttribute("data-id"),10)
      showDetail(id)
    })
  })
  }