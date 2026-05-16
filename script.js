const menuBtn=document.getElementById("menuBtn");
const navMenu=document.getElementById("navMenu");
if(menuBtn){menuBtn.addEventListener("click",()=>navMenu.classList.toggle("open"));}

const fallbackVideos=[
  {title:"Latest Gaming Upload",url:"https://youtu.be/noqjT2wf0t8",thumb:"https://img.youtube.com/vi/noqjT2wf0t8/maxresdefault.jpg",published:"Oxxzzyy Gaming"},
  {title:"Gaming Tips & Gameplay",url:"https://youtu.be/vsomSMwKCaU",thumb:"https://img.youtube.com/vi/vsomSMwKCaU/maxresdefault.jpg",published:"Oxxzzyy Gaming"},
  {title:"Creator Gaming Content",url:"https://youtu.be/08MNtKt_icw",thumb:"https://img.youtube.com/vi/08MNtKt_icw/maxresdefault.jpg",published:"Oxxzzyy Gaming"}
];

function formatNumber(num){
  const n=Number(num||0);
  if(!n)return"--";
  if(n>=1000000)return(n/1000000).toFixed(1)+"M";
  if(n>=1000)return(n/1000).toFixed(1)+"K";
  return String(n);
}
function videoCard(v){
  return `<a class="video-card" href="${v.url}" target="_blank"><div class="thumb"><img src="${v.thumb}" alt="${v.title}"><div class="play">▶</div></div><div class="video-info"><h3>${v.title}</h3><p>${v.published||"Oxxzzyy Gaming"}</p></div></a>`;
}
function renderFallback(){
  const grid=document.getElementById("videosGrid");
  if(grid)grid.innerHTML=fallbackVideos.map(videoCard).join("");
  const status=document.getElementById("apiStatus");
  if(status)status.textContent="Showing featured videos. Subscriber count will appear when the YouTube API function is active.";
}
async function loadYouTube(){
  try{
    const grid=document.getElementById("videosGrid");
    if(!grid)return;
    const res=await fetch("/.netlify/functions/youtube");
    if(!res.ok)throw new Error("Function unavailable");
    const data=await res.json();
    const videos=data.videos?.length?data.videos:fallbackVideos;
    grid.innerHTML=videos.slice(0,6).map(videoCard).join("");
    const status=document.getElementById("apiStatus");
    if(status)status.textContent=`Auto-loaded latest content from ${data.channelTitle||"Oxxzzyy Gaming"}.`;
    const subs=document.getElementById("subscriberCount");
    if(subs)subs.textContent=formatNumber(data.subscriberCount);
  }catch(e){renderFallback();}
}
loadYouTube();

document.querySelectorAll("[data-youtube-app='channel']").forEach((link)=>{
  link.addEventListener("click", function(event){
    const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if(!isMobile)return;
    event.preventDefault();
    const fallbackUrl="https://youtube.com/@oxxzzyygaming?si=UiScwcYlvLL3kIFH";
    const appUrl="youtube://www.youtube.com/@oxxzzyygaming";
    window.location.href=appUrl;
    setTimeout(()=>{window.location.href=fallbackUrl;},900);
  });
});

const homeBlogList = document.getElementById("homeBlogList");

if (homeBlogList && window.OXXZZYY_BLOGS) {
  const latestBlogs = window.OXXZZYY_BLOGS
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  homeBlogList.innerHTML = latestBlogs.map(blog => `
    <article>
      <span>${blog.category}</span>
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <a class="read-more" href="blog-post.html?post=${blog.slug}">Read Blog →</a>
    </article>
  `).join("");
}
