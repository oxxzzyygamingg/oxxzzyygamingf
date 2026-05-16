const blogList=document.getElementById("blogList");
const blogSearch=document.getElementById("blogSearch");
const blogCategory=document.getElementById("blogCategory");
const blogs=(window.OXXZZYY_BLOGS||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date));

function createCategories(){
  const categories=[...new Set(blogs.map(blog=>blog.category))];
  categories.forEach(category=>{
    const option=document.createElement("option");
    option.value=category;
    option.textContent=category;
    blogCategory.appendChild(option);
  });
}
function renderBlogs(){
  const searchValue=(blogSearch.value||"").toLowerCase();
  const categoryValue=blogCategory.value||"All";
  const filtered=blogs.filter(blog=>{
    const matchesSearch=blog.title.toLowerCase().includes(searchValue)||blog.excerpt.toLowerCase().includes(searchValue)||blog.category.toLowerCase().includes(searchValue);
    const matchesCategory=categoryValue==="All"||blog.category===categoryValue;
    return matchesSearch&&matchesCategory;
  });
  if(!filtered.length){blogList.innerHTML=`<div class="empty-blogs">No blogs found.</div>`;return;}
  blogList.innerHTML=filtered.map(blog=>`
    <article class="blog-card">
      <span>${blog.category}</span>
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <small>${new Date(blog.date).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})}</small>
      <a href="blog-post.html?post=${encodeURIComponent(blog.slug)}">Read Blog →</a>
    </article>`).join("");
}
if(blogList&&blogSearch&&blogCategory){
  createCategories();
  renderBlogs();
  blogSearch.addEventListener("input",renderBlogs);
  blogCategory.addEventListener("change",renderBlogs);
}
