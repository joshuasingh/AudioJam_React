import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button,Image,TextInput, Alert } from 'react-native';import axios from "axios"
  import Toast, {DURATION} from 'react-native-easy-toast'
  import * as firebase from 'firebase';
  import key from "../assets/url"



import {connect} from "react-redux"

class UploadVideo extends React.Component {

  videoSet=null
  thumbnail=null
  
  
  constructor(props) {
    super(props)
    this.state = {
     spinner:false,
      caption:""
     }
    
    
     this.uploadVideo=this.uploadVideo.bind(this)
     this.logOut=this.logOut.bind(this)
      
    }





  componentDidMount() {
    this.props.navigation.setParams({ logOut: this.logOut });
   
  }
 


  static navigationOptions=({ navigation })=>
  {
    return {
           title: 'Upload Video',
        headerRight:()=><Button title="Sign Out" onPress={()=>{navigation.getParam('logOut')()}}></Button>
       }
  }



  logOut=()=>{
    console.log("in logout")
    var self=this
    firebase.auth().signOut().then(function() {
       console.log("signed out")      
      self.props.logout()
    }).catch(function(error) {
      Alert.alert("Unable to logout,Try again")
    });
     
  }


  




   
  uploadVideo=async()=>{
    console.log("upload called")
    const uri=this.props.VideoInfo.videoUrl
    const codec = "mp4"  
    const type = `video/${codec}`;
  
    const data = new FormData();
    data.append("file", {
      name: "mobile-video-upload",
      type,
      uri
    });

    data.append("file", {
        name: "thumbnail-pic",
        type,
        uri:this.props.VideoInfo.thumbnailUrl
      });
    data.append("file",this.props.UserInfo.userId);
    data.append("file",this.state.caption);

    //disabling the screen
    this.mainRef.setNativeProps({
      pointerEvents:"none"
    })
        
     
    //toast called
   this.refs.toast.show('Video is being uploaded', 4000, () => {
    console.log("toast caled")
     });


    axios.post(key.ServerUrl+"UploadVideo", data)
    .then(response => {
      
       //enabling the screen
    this.mainRef.setNativeProps({
      pointerEvents:"auto"
    })
       this.props.setUserData(response.data.result)
       this.props.navigation.goBack()
      
    }).catch(error => {
      //enabling the screen
    this.mainRef.setNativeProps({
      pointerEvents:"auto"
    })
    Alert.alert("Problem in uploading please try again")
    })
      
    return 

}

mainRef=null



  render() {

   
    return (
        <View style={{flex:1,marginVertical:20}} ref={ree=>{this.mainRef=ree}}>
       <Toast  position={'center'} ref="toast"/>
    
        <Image source={{ uri:this.props.VideoInfo.thumbnailUrl}}  style={this.styles.imageRef}/>
         <TextInput placeholder="enter the caption" style={this.styles.captionStyles} 
          value={this.state.caption}
         onChangeText={(e)=>{this.setState({caption:e})}} multiline = {true}
         numberOfLines = {4} textAlign={'center'} ></TextInput>
         <Button title="upload Video" style={{flex:.2,borderRadius:10}} onPress={this.uploadVideo}/>
          </View>


    );
    

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
    buttonStyle:{
       marginBottom:100
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
    imageRef:
    {
      flex:.8,
      marginHorizontal:10,
      borderRadius:10
    },
    captionStyles:{
      flex:.2,
      margin:10,
      borderRadius:20,
      backgroundColor:"#fdf5e6",
      fontSize:22,
      color: '#6495ed'
    }
  });





}

const mapStateToProps = state => {
  return {
    VideoInfo:state.VideoInfo,
    UserInfo:state.UserInfo
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
    setUserData: (val) => {
        dispatch({
          type: "setUserData",
          payload:val
        });
      },
    putCamera: () => {
        dispatch({
          type: "putCamera",
          payload:""
        });
      }
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(UploadVideo);
  
