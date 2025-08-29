import blogs from '../data/blogs.json' with {type:"json"}

const blogsRoot = document.querySelector("#blogs");

// render list of blog, ONLY if the data exists and html loaded
if(blogsRoot && Array.isArray(blogs)){
  renderBlogList(blogs);
}

function formatBlogDate(date){
  if(!date){
    return ""
  }
  const options = {day:'2-digit','month':'long','year':'numeric'};
  return new Date(date).toLocaleDateString('en-GB',options)
}

function createBlogElement(blog){
  // TEMPLATE: `
  // <a href="./blogs/${blog.content_path}" class="blog-link">
  //   <div class="blog">
  //     <div class="blog-header">
  //       <h3>${blog.title}</h3>
  //       <p class="date">${formatBlogDate(blog.date)}</p>
  //     </div>
  //     <div class="blog-desc">
  //       <p>${blog.desc}</p>
  //     </div>
  //   </div>
  // `
  const link = document.createElement("a");
  link.href = `./blogs/${blog.content_path ?? "#"}`;
  link.className = "blog-link";

  const container = document.createElement("div");
  container.className = "blog";

  const header = document.createElement("div");
  header.className = "blog-header";

  const title = document.createElement("h3");
  title.textContent = blog.title ?? "Untitled Blog";

  const date = document.createElement("p");
  date.className = "date";
  date.textContent = formatBlogDate(blog.date);

  header.append(title, date);

  const descWrapper = document.createElement("div");
  descWrapper.className = "blog-desc";

  const desc = document.createElement("p");
  desc.textContent = blog.desc ?? "";

  descWrapper.appendChild(desc);

  container.append(header, descWrapper);
  link.appendChild(container);

  return link;
}

function renderBlogList(blogs){
  // for faster performance
  const fragment = document.createDocumentFragment();

  blogs.forEach((blog)=>{fragment.appendChild(createBlogElement(blog))})

  // reset blogRoots
  blogsRoot.innerHTML = ""
  blogsRoot.appendChild(fragment)
}