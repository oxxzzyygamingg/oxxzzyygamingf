exports.handler = async function () {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  const headers = {"Access-Control-Allow-Origin":"*","Content-Type":"application/json"};
  if (!API_KEY || !CHANNEL_ID) return {statusCode:200,headers,body:JSON.stringify({videos:[],subscriberCount:null,error:"Missing environment variables"})};
  try {
    const channelData = await (await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${CHANNEL_ID}&key=${API_KEY}`)).json();
    if (!channelData.items?.length) throw new Error("Channel not found");
    const channel = channelData.items[0];
    const uploads = channel.contentDetails.relatedPlaylists.uploads;
    const playlistData = await (await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=12&key=${API_KEY}`)).json();
    const ids = (playlistData.items || []).map(i => i.snippet.resourceId.videoId).filter(Boolean);
    let videos = [];
    if (ids.length) {
      const detailsData = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(",")}&key=${API_KEY}`)).json();
      videos = (detailsData.items || []).map(v => {
        const thumb = v.snippet.thumbnails.maxres?.url || v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default?.url;
        return {id:v.id,title:v.snippet.title,url:`https://www.youtube.com/watch?v=${v.id}`,thumb,published:new Date(v.snippet.publishedAt).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})};
      });
    }
    return {statusCode:200,headers,body:JSON.stringify({channelTitle:channel.snippet.title,subscriberCount:channel.statistics.subscriberCount,videos})};
  } catch (error) {
    return {statusCode:200,headers,body:JSON.stringify({videos:[],subscriberCount:null,error:error.message})};
  }
};