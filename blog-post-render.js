const params=new URLSearchParams(window.location.search);
const slug=params.get("post");
const blogs=window.OXXZZYY_BLOGS||[];
const post=blogs.find(blog=>blog.slug===slug);
const container=document.getElementById("blogPost");
if(container){
  if(!post){
    container.innerHTML=`<a class="back-link" href="blogs.html">← Back to Blogs</a><p class="meta">Blog Not Found</p><h1>This blog does not exist</h1><p>Please go back to the blogs page and choose another post.</p>`;
  }else{
    document.title=`${post.title} | Oxxzzyy Gaming`;
    const meta=document.querySelector("meta[name='description']");
    if(meta)meta.setAttribute("content",post.excerpt);
    container.innerHTML=`<a class="back-link" href="blogs.html">← Back to Blogs</a><p class="meta">${post.category} • ${new Date(post.date).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})}</p><h1>${post.title}</h1>${post.content}`;
  }
}
