import { Text, View, TouchableOpacity,StyleSheet, BackHandler ,YellowBox, Alert,Button} from 'react-native';
import { Camera } from 'expo-camera';

import VideoPlayer from 'expo-video-player'
import { Audio } from 'expo-av';
import {connect} from "react-redux"
import React from 'react';
import CameraControllerBar from "./CameraControlBar"
import axios from "axios";
import * as firebase from 'firebase';


class CameraFace extends React.Component {

  camera = null
  player = null
  videoSet=null
  ButtonRef=null

  constructor(props) {
    super(props)
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.front,
      showVideo: false,
      url:""
    }
  
    
 

   
    this.stopRec=this.stopRec.bind(this)
    this.startRec=this.startRec.bind(this)
    this.audioSetUp=this.audioSetUp.bind(this)
    this.showVid=this.showVid.bind(this)
    this.flipCamera=this.flipCamera.bind(this)
   
    this.selectMusic=this.selectMusic.bind(this)


  
    
    this.logOut=this.logOut.bind(this)
  } 

  static navigationOptions=({ navigation })=>
  {
    return {
           title: 'Create',
        headerRight:()=><Button title="Sign Out" onPress={()=>{navigation.getParam('logOut')()}}></Button>
       }
  }



 componentDidMount() {
  this.props.navigation.setParams({ logOut: this.logOut });

}


componentWillUnmount() {
  
  console.log("unmount of camera face")
  this.props.setRec_Setting_Original()

 

}

  
  
  logOut=()=>{
    console.log("in logout")
    var self=this
    firebase.auth().signOut().then(function() {
         console.log("signed out")      
       
    }).catch(function(error) {
      Alert.alert("Unable to logout,Try again")
    });
     
  }

  





  showVid = () => {

    return (
      <View style={this.styles.container}>
        <Text style={this.styles.headline}>Videos</Text>
        <TouchableOpacity
          underlayColor="rgba(200,200,200,0.6)"
        
        >
          <VideoPlayer videoProps={this.videoSet}
           inFullscreen={true}
              />
            <Text style={this.styles.videoTile}>Watch Vid</Text>
        </TouchableOpacity>

      </View>

    )


  }
 
  
  audioSetUp=async()=>
  {
    console.log("audio setup called")
    var mode={
     shouldDuckAndroid:false,
      interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid:false}

    try{
    Audio.setAudioModeAsync(mode).then((res)=>{
      console.log("audio mode set")
    },err=>{
      console.log("audio setup error")
    })

  }
  catch(e)
  {
    console.log("error with audio set up")
  }




  }
 





  stopRec = () => {

    
    try {
      
      this.camera.stopRecording()
      
      console.log("recording stopped")
    } catch (e) {
     
      console.log("unable to stop recording");
    }

  }
  
    initialStatus = {
      //  shouldPlay: true ,
      //  playThroughEarpieceAndroid :false
     };
  soundObject=null


    
  startRec = async () => {
         

    console.log("in start rec",this.props.cameraTabControl.selectedAudio)
    if(this.props.cameraTabControl.selectedAudio!==null)
      this.source={uri:this.props.cameraTabControl.selectedAudio.url}
     else
     this.source={uri:""
    } 

        var options ={
    quality: Camera.Constants.VideoQuality['480p'],
    maxDuration:this.props.cameraTabControl.selectedAudio!==null?this.props.cameraTabControl.selectedAudio.dur:15,
    maxFileSize: 30000000,
    mute: false,
    mirror:true}

    
    this.soundObject = new Audio.Sound();


    var self = this
    console.log("clicked")
    try {
      
      if(this.props.cameraTabControl.selectedAudio!==null)
       { 
         await this.soundObject.loadAsync(this.source,this.initialStatus);
       this.soundObject.playAsync();
       console.log("audio is playing")
       }
     // Your sound is playing!
      await this.camera.recordAsync(options).then(async(data) => {
        if(this.props.cameraTabControl.selectedAudio!==null)
        this.soundObject.stopAsync()
        
       
        this.props.changeRecordingState()
         
       //setting video url info
         this.props.setVideo_Url(data.uri)
 
          //opening video player
          this.props.navigation.navigate("VideoPlay")  
         
         
        console.log("video recorded", data)
        
        

      })
    }
    catch (e) {
      this.props.changeRecordingState()
      Alert.alert("Some Problem in Recording please try again")
       
    }

     return 
  }

   flipCamera=()=>{
    
      this.setState({
        type:this.state.type===Camera.Constants.Type.front?Camera.Constants.Type.back:Camera.Constants.Type.front
      })
   }


   selectMusic=()=>{
    this.props.navigation.navigate('Music')

   }

  


componentDidMount()
{
  this.props.navigation.setParams({ logOut: this.logOut });
}
  


  render() {

    this.audioSetUp()
    
    console.log("render of camera component called")
    return ( 
        <View style={{ flex: 1 }}>
        <Camera style={{flex:.9,marginTop:30 }} type={this.state.type} ref={ree => { this.camera = ree }} >
        </Camera>
       <View style={{flex:.1}}> 
       <CameraControllerBar startRec={this.startRec} stopRec={this.stopRec} flipCamera={this.flipCamera} selectMusic={this.selectMusic}/> 
     </View>
    </View> );
  

    

   }

  





  styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start"
    },
    headline: {
      alignSelf: "center",
      fontSize: 18,
      marginTop: 10,
      marginBottom: 30
    },
    videoTile: {
      alignSelf: "center",
      fontSize: 16,
      marginTop: 15
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }
  });




}

const mapStateToProps = state => {
  return {
     cameraTabControl:state.CameraComponent,
     UserInfo:state.UserInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeRecordingState:() => {
      dispatch({
        type: "changeRecordingState",
        payload: ""
      });
    },
    set_BackGround_Audio:val => {
      dispatch({
        type: "set_BackGround_Audio",
        payload: val
      });
    },
    putMusic_down:(val) => {
      dispatch({
        type: "putMusic_down",
        payload: val
      });
    },
    putVideo:(val) => {
      dispatch({
        type: "putVideo",
        payload: val
      });
    },
    setUser:(val) => {
      dispatch({
        type: "setUser",
        payload: val
      });
    }
    ,logout:() => {
      dispatch({
        type: "logout",
        payload: ""
      });
    },
    setVideo_Url:(val) => {
      dispatch({
        type: "setVideo_Url",
        payload: val
      });
    },
    setRec_Setting_Original:() => {
      dispatch({
        type: "setRec_Setting_Original",
        payload: ""
      });
    }
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(CameraFace);
  
