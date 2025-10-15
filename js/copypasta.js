import copypasta from "../data/copypasta.json" with {type:"json"}
import {escapeHTML,capitalize} from "./utils.js"
import Confirmation from "./confirmation.js"
// DOM
const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")
const toastContainer = document.getElementById("toast-container")
const newCopypastaCard = document.getElementById("new-copypasta");
const modalOverlay = document.getElementById("modal-overlay");
const modalCancel = document.getElementById("modal-cancel");
const modalSubmit = document.getElementById("modal-submit");
const customCopypastaBox = document.getElementById("customCopypasta")
const newParametersList = document.getElementById("newParameters")
const copypastaText = document.getElementById("copypasta-text")
const copypastaName = document.getElementById("copypasta-name")
const copypastaDesc = document.getElementById("copypasta-desc")
// Components
const confirmationDialog = new Confirmation();
// State
let isDetailActive = false;
let currentCopypasta = null;
let currentId = null
let matches = new Set()
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
  let vals = e.srcElement.value.split("\n")
  let isEmpty = vals.length ===0 || (vals.length===1 && vals[0].trim()==="")
  
  if(isEmpty){
    vals = idx.split("\n")
  }

  const joinedVals = safeHTML(vals.join("\n"))
  replacedTexts
    .forEach((element)=>{
      element.innerHTML = joinedVals
      element.classList.toggle('empty',isEmpty)
    })

  idMapping.set(idx,joinedVals)
}

// Copy text to clipboard
function copyText(e){
  const text = e.currentTarget.innerText
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
  if(isDetailActive && currentId===id){
    resetDetail()
    return;
  }

  // Reset
  currentCopypasta = copypasta.find(c=>c.id===id)
  currentId = id;
  isDetailActive = true

  // Reset and map initial parameters
  idMapping.clear()
  currentCopypasta.parameters.forEach((p,i)=>idMapping.set(p,p))
  
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
function showCustomDetail(id){
  if(isDetailActive && currentId===id){
    resetDetail()
    return;
  }
  const loaded_data = localStorage.getItem("custom_copypastas")
  if(!loaded_data){
    return;
  }
  // Reset
  const copypasta = JSON.parse(loaded_data)
  currentCopypasta = copypasta.find(c=>c.id===id)
  currentId = currentCopypasta.id;
  isDetailActive = true

  // Reset and map initial parameters
  idMapping.clear()
  currentCopypasta.parameters.forEach((p,i)=>idMapping.set(p,p))
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
  return params.map((p)=>
    `<div class="param-input">
        <p>${p}</p>
        <textarea data-index=${p} rows="3"></textarea>
    </div>
  `).join('')   
}

// Sanitize replaced texts
function safeHTML(text) {
  return escapeHTML(text).replace(/\n/g, "<br>");
}

// Build templaye texts
function buildTemplateTexts(c){
  return c.text
    .split("\n")
    .map(line=>`<p class="template-text">${line}</p>`)
    .join("")
    .replace(/(?<!\\)\{(.+?)\}/g,(_,data)=>{
    return `<span class="replaced-word empty" data-index=${data}>${data}</span>`
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
  // render custom copypasta
  const loaded_data = localStorage.getItem("custom_copypastas")
  if(loaded_data){
    const customCopypasta = JSON.parse(loaded_data)
    customCopypasta.forEach((data)=>{  // spawn card
      const template = document.createElement("template");
      template.innerHTML = `
        <div class="copypasta-info custom-copypasta" data-id="${data.id}">
          <div class="desc copypasta-box">
            <h2>${data.name}</h2>
            <p>${data.description}</p>
          </div>
        </div>
      `.trim();

      const node = template.content.firstChild;
      // insert before #new-copypasta
      customCopypastaBox.insertBefore(node, newCopypastaCard);})
  }
  // add event delegation
  customCopypastaBox.addEventListener("click",(e)=>{
    const copypasta = e.target.closest(".custom-copypasta")
    if(!copypasta)return
    showCustomDetail(copypasta.dataset.id)
  })
}

function createCharacter(text){
    const paramHTML = `            
      <div class="new-params param">
        ${capitalize(text)}
      </div>`
    // Create a template element for converting html
    const template = document.createElement("template");
    template.innerHTML = paramHTML.trim(); // trim avoids text nodes
    const node = template.content.firstChild;
    newParametersList.appendChild(node)
}
// Add listener
newCopypastaCard.addEventListener("click",()=>{
  modalOverlay.style.display = "block";
  // Focus user on first input
  document.getElementById("copypasta-name").focus();
})
// Tombol cancel
modalCancel.addEventListener("click",()=>{
  // Ask confirmation if there is content
  if(copypastaName.value || copypastaDesc.value || copypastaText.value || newParametersList.innerHTML){
    confirmationDialog.open({
      message:"Are you sure you want to discard change?",
      confirmAction:clearCopypasta
    })
  }
  else{
    clearCopypasta()
  }
})

function clearCopypasta(){
    // Clear input
    copypastaName.value = ""
    copypastaDesc.value = ""
    copypastaText.value = ""
    newParametersList.innerHTML = ""
    // hide overlay
    modalOverlay.style.display = "none";
}
// Tombol submit
modalSubmit.addEventListener("click",()=>{
  confirmationDialog.open({
    message:"Are you sure you want to add this new copypasta?",
    confirmAction:addCopypasta
  })
})
function addCopypasta(){
  // get the text
  const text = copypastaText.value
  const standardized_text = text.replace(/\{(.*?)\}/g,(fullMatch,inner)=>{
    const substr = inner.toLowerCase()
    if(matches.has(substr)){
      return `{${capitalize(substr)}}`
    }
    return fullMatch
  })
  // get last idx 
  let lastIdx = parseInt(localStorage.getItem("last_idx") ?? "-1",10) + 1
  // get copypasta
  const custom_copypastas = JSON.parse(localStorage.getItem("custom_copypastas") ?? "[]")
  // make new data
  const newCopypastaData =     {
    id:`C${lastIdx}`,
    name: copypastaName.value,
    description: copypastaDesc.value,
    text: standardized_text,
    parameters: [...matches].map((m)=>capitalize(m))
  }
  custom_copypastas.push(newCopypastaData)
  // simpan data
  localStorage.setItem("last_idx",lastIdx)
  localStorage.setItem("custom_copypastas",JSON.stringify(custom_copypastas))
  // clear data
  copypastaName.value = ""
  copypastaDesc.value = ""
  copypastaText.value = ""
  newParametersList.innerHTML = ""
  modalOverlay.style.display = "none";
  // spawn card
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="copypasta-info custom-copypasta" data-id="${newCopypastaData.id}">
      <div class="desc copypasta-box">
        <h2>${newCopypastaData.name}</h2>
        <p>${newCopypastaData.description}</p>
      </div>
    </div>
  `.trim();

  const node = template.content.firstChild;
  // insert before #new-copypasta
  customCopypastaBox.insertBefore(node, newCopypastaCard);
}

copypastaText.addEventListener("input",(e)=>{
  const text = e.target.value
  // if it like {0}. process.. if like \{0\}, dont
  const raw_matches = [...text.matchAll(/(?<!\\)\{(.*?)\}/g)].map(m => m[1].toLowerCase());
  matches = new Set(raw_matches)
  
  // create tag
  newParametersList.innerHTML = ""
  if(matches){
    matches.forEach((param)=>createCharacter(param))
  }
})