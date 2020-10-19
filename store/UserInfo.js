import { cos } from "react-native-reanimated";

const UserInfo = (state = { userId:null,userData:[]}, action) => {
    switch (action.type) {
      case "setUser":
          state = { ...state,userId:action.payload};
        break;
       case "setUserData":
        state={...state,userData:action.payload} 
           break
      case "setUserLogin":
             //console.log("in set user login ",action.payload.data)
            state={userId:action.payload.id,userData:action.payload.data} 
            break   
        case "logout":
            state={ userId:null,userData:[]}
            break   
    }
    return state;
  };
  
  export default UserInfo;
  