
// selectedAudio={url:"",dur:""}

//selectStatus={camera,music,video}


const VideoData = (state = {videoUrl:null}, action) => {
    switch (action.type) {
      case "setVideo_Url":
        state = {videoUrl:action.payload};
        break;
    case "removeVideo_Url":
        state = {videoUrl:null};
        break;
             }
    return state;
  };
  
  export default VideoData;
  