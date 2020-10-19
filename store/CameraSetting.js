const CameraSetting = (state = { Recording:false,audio:null}, action) => {
    switch (action.type) {
      case "changeRecordingState":
          state = { Recording:state.Recording===false?true:false};
        break;
       case "set_BackGround_Audio":
           state={...state,audio:action.payload} 
           break;
      case "set_CameraSettingTo_Original":
            state={ Recording:false,audio:null} 
            break
 

    }
    return state;
  };
  
  export default CameraSetting;
  