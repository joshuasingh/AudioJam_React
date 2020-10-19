import React, { useState, useEffect } from 'react';
import { View,Alert, TouchableOpacity, StyleSheet, Button,Dimensions  } from 'react-native';
import VideoPlayer from 'expo-video-player'
import { Video } from 'expo-av'

  import * as VideoThumbnails from 'expo-video-thumbnails';
  import * as firebase from 'firebase';
  



import {connect} from "react-redux"

class VideoPlay extends React.Component {

  videoSet=null
  thumbnail=null
  deviceHeight=null
  
  constructor(props) {
    super(props)
    var self=this
    this.state = {
      spinner:false,
      url:null
    }
    
    this.navigateBack=this.navigateBack.bind(this)
    this.generateThumbnail=this.generateThumbnail.bind(this)
    this.logOut=this.logOut.bind(this)

   this.deviceHeight=Math.round(Dimensions.get('window').height);
 
   }


  navigateBack=()=>{
    console.log("navigate back of player")  
    this.props.putCamera()

  }


   componentDidMount() {
    this.props.navigation.setParams({ logOut: this.logOut });
   
  }
 


  static navigationOptions=({ navigation })=>
  {
    return {
           title: 'Video',
        headerRight:()=><Button title="Sign Out" onPress={()=>{navigation.getParam('logOut')()}}></Button>
       }
  }





  generateThumbnail = async () => {
    console.log("thumbnail called")
   
  
    try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          this.props.VideoData.videoUrl,
          {
            time: 15000,
          }
        );
        
        this.setState({url:uri})       
       
      
      } catch (e) {
        console.warn(e);
      }
 
    
 
  return 

  };





   
  uploadVideo=()=>{
      this.generateThumbnail()
    console.log("uploading video")
  }


  componentDidUpdate()
  {
   
     console.log("in did update of video player")
    if(this.state.url!==null)
    {
      
      this.props.Urls({url:this.props.VideoData.videoUrl,thumbnail:this.state.url})
      this.props.navigation.navigate('upload')
      
     
    
    }

  }

  //video player ref
  videoplayerRef=null

  


  render() {
    
    


    var self=this
    console.log("in render of VideoPlay")
    this.videoSet={
        shouldPlay: true,
       resizeMode: Video.RESIZE_MODE_CONTAIN,
        source: {
           uri:self.props.VideoData.videoUrl
              }
          }

    return (
        <View style={{flex:1}}>
        <View style={{flex:.9,marginBottom:80}}>
        <TouchableOpacity
          underlayColor="rgba(200,200,200,0.6)"
       >
          <VideoPlayer videoProps={this.videoSet}
         
          inFullscreen={true}
          height={this.deviceHeight-60}
                />
            
        </TouchableOpacity>
        </View>
       <View style={{flex:.1}}>
        <Button  style={this.styles.buttonStyle} title="Continue" onPress={this.generateThumbnail}/>
        </View>
      </View>


    );
    

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


   



    componentWillUnmount()
    {
    console.log("unmount of video play") 
      
    //set camera setting to original
    this.props.set_CameraSettingTo_Original()
    
    //setting video info
    this.props.removeVideo_Url()

    //setting thumbnail info
    this.props.remove_Urls()

     
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
    },
    buttonStyle:{
      
    },
    spinnerTextStyle: {
      color: '#FFF'
    }
  });





}

const mapStateToProps = state => {
  return {
    VideoData:state.VideoData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    putCamera: () => {
      dispatch({
        type: "putCamera",
        payload:""
      });
    },
    Urls:(val) => {
      dispatch({
        type: "Urls",
        payload:val
      });
    },
    set_CameraSettingTo_Original:() => {
      dispatch({
        type: "set_CameraSettingTo_Original",
        payload:""
      });
    },
    removeVideo_Url:() => {
      dispatch({
        type: "removeVideo_Url",
        payload:""
      });
    },
    remove_Urls:() => {
      dispatch({
        type: "remove_Urls",
        payload:""
      });
    }  
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(VideoPlay);
  
