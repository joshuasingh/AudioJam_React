const VideoInfo = (state = { videoUrl:null,thumbnailUrl:null}, action) => {
    switch (action.type) {
      case "Urls":
          console.log("setting thumnbnail",action.payload.thumbnail)
          state = { videoUrl:action.payload.url,thumbnailUrl:action.payload.thumbnail};
        break;
      case "remove_Urls":
          state = { videoUrl:null,thumbnailUrl:null};
        break;
      }
      
    return state;
  };
  
  export default VideoInfo;
  