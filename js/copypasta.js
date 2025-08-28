import copypasta from "../data/copypasta.json" with {type:"json"}

// DOM
const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")
const toastContainer = document.getElementById("toast-container")

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
  toastContainer.appendChild(toast)

  setTimeout(()=>{
    toast.remove()
  },duration)
}

// oninput in parameter
function handleParameterUpdate(e){
  const target = e.target
  if(target.tagName!=="TEXTAREA") return;

  const idx = e.target.dataset.index
  // dapatkan template string idx
  const replacedTexts = document.querySelectorAll(`.replaced-word[data-index="${idx}"]`)

  let val = e.srcElement.value
  let isEmpty = val===''

  if(isEmpty){
    val = currentCopypasta.parameters[idx]
  }

  replacedTexts
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

// resetDetail
function resetDetail(){
    detailRoot.innerHTML = ""
    currentId = null
    isDetailActive = false;
}

// Show detail panel
function showDetail(id){
  if(isDetailActive && currentId==id){
    resetDetail()
    return;
  }

  // Reset
  currentCopypasta = copypasta.find(c=>c.id===id)
  currentId = id;
  isDetailActive = true

  // Reset and map initial parameters
  idMapping.clear()
  currentCopypasta.parameters.forEach((p,i)=>idMapping.set(i.toString(),p))

  // Create input fields
  const paramInputs = buildParamsInputTemplate(currentCopypasta.parameters)

  // Fill the template detail
  const textTemplate = buildTemplateTexts(currentCopypasta)

  // Render detail panel
  detailRoot.innerHTML = `
    <div class="detail-box">
      <div id='template'>${textTemplate}</div>
      <div id='replace'>${paramInputs}</div>
    </div>`

  document.querySelector("#template").addEventListener("click",copyText)
}

// Build params input template
function buildParamsInputTemplate(params){
  return params.map((p,i)=>
    `<div class="param-input">
        <p>${p}</p>
        <textarea data-index=${i} rows="3"></textarea>
    </div>
  `).join('')   
}

// Build templaye texts
function buildTemplateTexts(c){
  return c.text
    .split("\n")
    .map(line=>`<p class="template-text">${line}</p>`)
    .join("")
    .replace(/(?<!\\)\{(\d+)\}/g,(_,idx)=>{
    return `<span class="replaced-word empty" data-index=${idx}>${c.parameters[idx]}</span>`
  })
}

// Render copypasta list
function renderCopypastaList(copypasta){
  copypastaRoot.innerHTML = copypasta.map((c)=>`
    <div class="copypasta-info"  data-id=${c.id}>
      <div class="desc copypasta-box">
        <h2>${c.name}</h2>
        <p>${c.description}</p>
      </div>
    </div>
  `).join("")

  // Event Delegation
  copypastaRoot.addEventListener("click",(e)=>{
    const copypasta = e.target.closest(".copypasta-info")
    if(!copypasta)return
    showDetail(parseInt(copypasta.dataset.id,10))
  })
}