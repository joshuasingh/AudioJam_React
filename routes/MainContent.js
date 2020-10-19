import {createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import CameraFace from "../components/CameraFace"
import Audio_Log from "../components/Audio_Log"
import UploadVideo from "../components/UploadVideo"
import Profile from "../components/Profile"
import VideoPlay from "../components/VideoPlay"

const screen={
   Profile:{
        screen:Profile
    }, 
    Stream:{
        screen:CameraFace
    },
    Music:{
        screen:Audio_Log
    } ,
  
upload:{
        screen:UploadVideo
    }, 
    VideoPlay:{
        screen:VideoPlay
    }

}


const HomeStack=createStackNavigator(screen)

export default createAppContainer(HomeStack);