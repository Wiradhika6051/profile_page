import copypasta from "../data/copypasta.json" with {type:"json"}
import {escapeHTML,capitalize} from "./utils.js"
import { ICONS } from "./icons.js"
// DOM
const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")
const toastContainer = document.getElementById("toast-container")
const newCopypastaCard = document.getElementById("new-copypasta");
const modalOverlay = document.getElementById("modal-overlay");
const modalCancel = document.getElementById("modal-cancel");
const modalSubmit = document.getElementById("modal-submit");
const confirmationCancelButton = document.getElementById("confirmation-cancel")
const confirmationConfirmButton = document.getElementById("confirmation-confirm")
const confirmationText = document.getElementById("confirmationText")
const confirmationOverlay = document.getElementById("confirmationModalOverlay")
const customCopypastaBox = document.getElementById("customCopypasta")
const newParametersList = document.getElementById("newParameters")
const copypastaText = document.getElementById("copypasta-text")
const copypastaName = document.getElementById("copypasta-name")
const copypastaDesc = document.getElementById("copypasta-desc")
// State
let isDetailActive = false;
let currentCopypasta = null;
let currentId = null
let matches = new Set()
let isParamInputFinished = false;
const idMapping = new Map();
let confirmAction = null;

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
  console.log(idx)
  const replacedTexts = document.querySelectorAll(`.replaced-word[data-index="${idx}"]`)
  console.log(replacedTexts)
  let vals = e.srcElement.value.split("\n")
  let isEmpty = vals.length ===0 || (vals.length===1 && vals[0].trim()==="")
  console.log(isEmpty)
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
  console.log(isDetailActive)
  console.log(currentId)
  console.log(id)
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
  console.log(idMapping)
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
  console.log(isDetailActive)
  console.log(currentId)
  console.log(id)
  if(isDetailActive && currentId===id){
    resetDetail()
    return;
  }
  const loaded_data = localStorage.getItem("custom_copypastas")
  if(!loaded_data){
    return;
  }
  // Reset
  console.log(loaded_data)
  const copypasta = JSON.parse(loaded_data)
  console.log(copypasta)
  currentCopypasta = copypasta.find(c=>c.id===id)
  console.log(currentCopypasta)
  currentId = currentCopypasta.id;
  console.log(currentId)
  isDetailActive = true

  // Reset and map initial parameters
  idMapping.clear()
  console.log(currentCopypasta)
  currentCopypasta.parameters.forEach((p,i)=>idMapping.set(p,p))
  console.log(idMapping)
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
    console.log("start")
    // addParam.textContent = text
    // addParam.classList.remove("param-input")
    // newParametersList
    // insert into character list
    // const paramHTML = `            
    //   <div class="new-params param">
    //     <svg
    //       class="close-i"
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="16"
    //       height="16"
    //       fill="currentColor"
    //       class="bi bi-x-lg"
    //       viewBox="0 0 16 16"
    //     >
    //       <path
    //         d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
    //       />
    //     </svg>
    //     ${capitalize(text)}
    //   </div>`
      const paramHTML = `            
      <div class="new-params param">
        ${capitalize(text)}
      </div>`
    // Create a template element for converting html
    const template = document.createElement("template");
    template.innerHTML = paramHTML.trim(); // trim avoids text nodes
    const node = template.content.firstChild;
  //   node.addEventListener("click",()=>{
  //     // literally bunuh node sendiri
  //     // if(node.parentNode){
  //     //   node.parentElement.removeChild(node)
  //     // }
  //     if(node.classList.contains("param-input"))return;
  //     isParamInputFinished = false;
  //     node.classList.add("param-input")
  //     node.innerHTML = ""
  //     // Create input
  //     const input = document.createElement("input");
  //     input.type = "text";
  //     node.appendChild(input)
  //     // focus input
  //     input.focus()
  //     // Kalau pencet enter, ketutup
  //     input.addEventListener("keydown",(e)=>{
  //       console.log(e.key)
  //       if (e.key=="Enter" && !isParamInputFinished){
  //         isParamInputFinished = true;
  //         const text = input.value || ""
  //         updateCharacter(node,text)
  //       }
  //     })
  //     // Kalau pencet selain input, jadi ketutup
  //     //  blur -> lagi gak fokus ke element
  //     input.addEventListener("blur",()=>{
  //       if(isParamInputFinished)return;
  //       isParamInputFinished = true;
  //       const text = input.value || ""
  //       updateCharacter(node,text)
  // })      
  //   })
    // insert into params list 
    // const children = newParametersList.children
    // if(children.length>0){
    //   // insert second to last
    //   newParametersList.insertBefore(node,children[children.length-1])
    // }
    // else{
    //   // langsung insert (untuk handle edge case)
    //   newParametersList.appendChild(node)
    // }
    newParametersList.appendChild(node)
    // Reset the add param button
    // addParam.innerHTML = `
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     width="20"
    //     height="20"
    //     fill="currentColor"
    //     class="bi bi-plus-lg"
    //     viewBox="0 0 16 16"
    //   >
    //     <path
    //       fill-rule="evenodd"
    //       d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
    //     />
    //   </svg>
    //   Add New`
}

function openConfirmation(message,action){
  confirmationText.textContent = message
  confirmationOverlay.style.display = "block"
  confirmAction = action
}
// confirmation yes button
confirmationConfirmButton.addEventListener("click",()=>{
  // hide confirmation
  confirmationOverlay.style.display = "none"
  // run action
  if(confirmAction){
    confirmAction()
    // reset action
    confirmAction = null;
  }
})
confirmationCancelButton.addEventListener("click",()=>{
  confirmationOverlay.style.display = "none"
  confirmAction = null;
})

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
    openConfirmation("Are you sure you want to discard change?",clearCopypasta)
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
  openConfirmation("Are you sure you want to add this new copypasta?",addCopypasta)
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
// Add new param
// addParam.addEventListener("click",()=>{
//   if(addParam.classList.contains("param-input"))return;
//   isParamInputFinished = false;
//   addParam.classList.add("param-input")
//   addParam.innerHTML = ""
//   // Create input
//   const input = document.createElement("input");
//   input.type = "text";
//   addParam.appendChild(input)
//   // focus input
//   input.focus()
//   // Kalau pencat enter, ketutup
//   input.addEventListener("keydown",(e)=>{
//     console.log(e.key)
//     if (e.key=="Enter" && !isParamInputFinished){
//       isParamInputFinished = true;
//       const text = input.value || ""
//       createCharacter(text)
//     }
//   })
//   // Kalau pencet selain input, jadi ketutup
//   //  blur -> lagi gak fokus ke element
//   input.addEventListener("blur",()=>{
//     if(isParamInputFinished)return;
//     isParamInputFinished = true;
//     const text = input.value || ""
//     createCharacter(text)
//   })
// })

copypastaText.addEventListener("input",(e)=>{
  const text = e.target.value
  // if it like {0}. process.. if like \{0\}, dont
  const raw_matches = [...text.matchAll(/(?<!\\)\{(.*?)\}/g)].map(m => m[1].toLowerCase());
  console.log(raw_matches)
  // const matches = raw_matches.filter((item, index) => raw_matches.indexOf(item) === index);
  matches = new Set(raw_matches)
  console.log(matches)
  // create tag
  newParametersList.innerHTML = ""
  if(matches){
    matches.forEach((param)=>createCharacter(param))
  }
})