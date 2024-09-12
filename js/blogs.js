import blogs from '../data/blogs.json' with {type:"json"}

const blogsRoot = document.querySelector("#blogs");

// render list of blog
renderBlogList(blogs);


function renderBlogList(blogs){
  const options = {day:'2-digit','month':'long','year':'numeric'};
  const blogList = blogs.map((blog)=>`
  <a href="./blogs/${blog.content_path}" class="blog-link">
    <div class="blog">
      <div class="blog-header">
        <h3>${blog.title}</h3>
        <p class="date">${new Date(blog.date).toLocaleDateString('en-GB',options)}</p>
      </div>
      <div class="blog-desc">
        <p>${blog.desc}</p>
      </div>
    </div>
  `);
  blogsRoot.innerHTML = blogList.join("");
}