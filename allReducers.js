import {combineReducers} from "redux"
import screen from "./store/AdminDetailView" 
import CameraSetting from "./store/CameraSetting"
import AudioState from "./store/AudioState"
import CameraComponent from "./store/CameraComponent"
import UserInfo from "./store/UserInfo"
import VideoInfo from "./store/VideoInfo"
import VideoData from "./store/VideoData"

export default combineReducers({
screen,
CameraSetting,
AudioState,
CameraComponent,
UserInfo,
VideoInfo,
VideoData
})