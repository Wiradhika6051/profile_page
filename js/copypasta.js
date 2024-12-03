/* `<div class="project">
        <div class="desc">
          <h2>${project.name}</h2>
        ${project.desc.map((desc)=>`<p>${escapeHTML(desc).replace(/\$b\{(.*?)\}/g,"<b>$1</b>")}</p>`).join("")}
        </div>
        <div class="action">
          <div class="tags">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              class="bi bi-tags"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"
              />
              <path
                d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"
              />
            </svg>
            <div class="tag-list">
            ${project.tags.map((tag)=>`<div class="tag tag-click">${escapeHTML(tag)}</div>`).join("")}
            </div>
          </div>
          <div>${Object.keys(project.links).map((key)=>`
            <a class="small-box" href="${project.links[key]}" title="${ACTION_TEXT[key]}">
              ${ICONS[key]}
            </a>`).join("")}
          </div>
        </div>
      </div>`);*/
import copypasta from "../data/copypasta.json" with {type:"json"}

const copypastaRoot= document.querySelector("#copypasta")

renderCopypastaList(copypasta)

function renderCopypastaList(copypasta){
  
}

