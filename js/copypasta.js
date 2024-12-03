import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")
const detailRoot = document.querySelector("#detail")

renderCopypastaList(copypasta)

function showDetail(id){
  const c = copypasta.filter(c=>c.id===id)[0]
  console.log(c)
  const detail = `<div class="detail-box">${c.text}</div>`
  detailRoot.innerHTML = detail
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