const AudioState = (state = { allAudio:[ 
    {title:"one",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"}
    ,{title:"two",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"}
    ],
selectedAudio:null}, action) => {
    switch (action.type) {
      case "setAudio":
        state = {selectedAudio:action,payload};
        break;
       case "setAll_Audio":
       
           state={allAudio:action.payload} 
           break;
    }
    return state;
  };
  
  export default AudioState;
  