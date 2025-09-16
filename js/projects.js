import data from "../data/projects.json" with { type: "json" };
import sortData from "./sortButton.js";
import { ICONS } from "./icons.js";

const {projects, tags} = data;

// Constant
const showTag = document.querySelector("#selectedTags");
const tagInput = document.querySelector("#tagInput");
const sortingList = document.getElementById("sortOptions")
const sortFilter = document.querySelector("#sortFilter")
const selectedTags = new Set();

const ACTION_TEXT = {
  "download": "Download",
  "github": "Source Code",
  "gitlab": "Source Code",
  "play": "Play",
  "browse": "Open Website"
}
const SORTING_MODES = {
  'A → Z': {key: "name", order: "asc"},
  'Z → A': { key: "name", order: "desc"},
  'Oldest': { key: "date", order: "asc"},
  'Latest': { key: "date", order: "desc"}
};
const DEFAULT_SORT = "Latest";

let selectedOption = DEFAULT_SORT;
// Utilities
function escapeHTML(text) {
  return text
    .replace(/[&<>"'/]/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;",
      "'": "&#39;", "/": "&#x2F;"
    }[c]))
}

function formatDate(date_str){
  // Create a Date object
  return new Date(date_str).toLocaleDateString(undefined, {  
    month: 'long',  
    year: 'numeric'  
  });
}

function getThumbnail(path){
  return `image/${(typeof path === 'string' && path.trim() !== '') ? path : 'no-thumbnail.png'}`
}

// Rendering Helper
function formatDescription(desc) {
  return `<p>${escapeHTML(desc).replace(/\$b\{(.*?)\}/g, "<b>$1</b>")}</p>`;
}

function formatTags(tags) {
  return tags.map(tag => `<div class="tag tag-click">${escapeHTML(tag)}</div>`).join('');
}

function formatLinks(links) {
  return Object.entries(links)
    .map(([key, url]) => `
      <a class="small-box" href="${url}" title="${ACTION_TEXT[key]}">
        ${ICONS[key]}
      </a>`)
    .join('');
}

function renderProjectCard(project,idx){
  return `<div class="project" data-index=${idx}>
    <div class="image-viewer show-image" data-index=${idx}>
      <img src="${getThumbnail(project.thumbnail)}"/>
    </div>
    <div class="content">
      <div class="desc">
        <h2>${escapeHTML(project.name)}</h2>
        ${project.desc.map(formatDescription).join("")}
      </div>
      <div class="project-date">Project Start: ${formatDate(project.date)}</div>
      <div class="action">
        <div class="action-links">
          ${formatLinks(project.links)}
          <div class="small-box image-viewer-button" data-index=${idx} title="See Images">
            ${ICONS["image-open"]}
          </div>
        </div>
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
            ${formatTags(project.tags)}
            </div>
          </div>
      </div>
    </div>
  </div>`;
}

function renderProjects(projects){
  const workSection = document.querySelector("#work");
  if(!projects.length){
    // gak ada project
    workSection.innerHTML = "<p>No Project Found</p>";
    return
  }
  workSection.innerHTML = projects.map((project,idx) => renderProjectCard(project,idx)).join("");

  // listener tag diklik
  document.querySelectorAll(".tag-click").forEach((tag)=>{
    tag.addEventListener("click",onTagClick)
  })
  // Whenever a project clicked, it show image
  document.querySelectorAll(".image-viewer-button").forEach((project)=>{
    project.addEventListener("click",showPictures)
  })
}

function renderTagDropdown() {
  tagInput.innerHTML = `<ul>${tags.map(t => `<li class="tag-click">${t}</li>`).join("")}</ul>`;
  document.querySelectorAll("#tagInput .tag-click").forEach(tag =>
    tag.addEventListener("click", onTagClick)
  );
}

function renderSortOptions() {
  sortingList.innerHTML = "";
  Object.keys(SORTING_MODES).forEach(option => {
    const node = document.createElement("li");
    node.textContent = option;
    node.classList.add("sort-option");
    sortingList.appendChild(node);
  });
}

// --- Event Handlers ---
function showPictures(e) {
  const idx = e.currentTarget.dataset.index;
  document.querySelector(`.image-viewer[data-index="${idx}"]`)
    .classList.toggle("show-image");
}

function onTagClick(e) {
  selectedTags.add(e.target.textContent.trim())
  sortData(filterProjectsByTags(),SORTING_MODES[selectedOption],selectedOption,onSortChangedHandler)
  updateSelectedTagsUI();
}

function onTagRemove(e) {
  // disanitasi buat hilangin whitespace
  const tag = e.target.textContent.trim();
  selectedTags.delete(tag);
  if(!selectedTags.size){
    showTag.innerHTML = "";
    showTag.style.display = 'none';
  }
  const data = selectedTags.size ? filterProjectsByTags() : projects
  sortData(data,SORTING_MODES[selectedOption],selectedOption,onSortChangedHandler)
  updateSelectedTagsUI();
}

function onSortChangedHandler(projects){
  renderProjects(projects)
}

function updateSelectedTagsUI() {
  showTag.style.display = selectedTags.size ? "flex" : "none";
  showTag.innerHTML = [...selectedTags]
    .map(t => `<div class="show tag">${ICONS["x-close"]}<p>${escapeHTML(t)}</p></div>`)
    .join(" ");
  document.querySelectorAll(".show, .close-i").forEach(el =>
    el.addEventListener("click", onTagRemove)
  );
}

function filterProjectsByTags() {
  return projects.filter(p => p.tags.some(tag => selectedTags.has(tag)));
}

function initSorting(){
  renderSortOptions()
  sortData(projects,SORTING_MODES[DEFAULT_SORT],DEFAULT_SORT,onSortChangedHandler)
  sortingList.addEventListener("click",(e)=>{
    selectedOption = e.srcElement.textContent
    if (SORTING_MODES[selectedOption]) {
      const data = selectedTags.size ? filterProjectsByTags() : projects
      sortData(data,SORTING_MODES[selectedOption],selectedOption,onSortChangedHandler)
    }
  })
}


// --- Init ---
sortFilter.addEventListener("click", () =>
  sortFilter.classList.toggle("force-hide")
);
// Reset forceHide variable on mouse leave
sortFilter.addEventListener("mouseleave", () =>
  sortFilter.classList.remove("force-hide")
);

// Initial rendering
// render tag dropdown
renderTagDropdown();
// Tambahkan ke website
renderProjects(projects);
// Init sorting
initSorting();