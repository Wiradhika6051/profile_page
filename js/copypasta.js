import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")

renderCopypastaList(copypasta)

function renderCopypastaList(copypasta){
  console.log(copypasta)
  const copypastaList = copypasta.map((c)=>`<div class="project copypasta-info">
        <div class="desc copypasta-box">
          <h2>${c.name}</h2>
          <p>${c.description}</p>
        </div>
      </div>`)
  copypastaRoot.innerHTML = copypastaList.join("")
}

