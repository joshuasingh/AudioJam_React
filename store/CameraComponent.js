
// selectedAudio={url:"",dur:""}

//selectStatus={camera,music,video}


const CameraComponent = (state = {selectStatus:'camera',selectedAudio:null,videoUrl:null}, action) => {
    switch (action.type) {
      case "selectMusic":
        state = {selectStatus:'music'};
        break;
       case "putMusic": 
        console.log("in music selected", action.payload);
        state = { selectStatus:'camera',selectedAudio:action.payload,videoUrl:state.videoUrl};
        break;
        case "putMusic_down": 
          state = { selectStatus:'video',selectedAudio:null,videoUrl:action.payload};
        break;
        case "putVideo": 
          state = {...state,selectStatus:'video',videoUrl:action.payload};
        break;
        case "putCamera": 
          state = { selectStatus:'camera',selectedAudio:null,videoUrl:null};
        break;
        case "setRec_Setting_Original":
          state = { selectStatus:null,selectedAudio:null,videoUrl:null};
        break;
        
        }
    return state;
  };
  
  export default CameraComponent;
  