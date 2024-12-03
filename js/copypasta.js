import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")

renderCopypastaList(copypasta)

function showDetail(id){
  console.log(id)
  console.log(copypasta.filter(c=>c.id===id))
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