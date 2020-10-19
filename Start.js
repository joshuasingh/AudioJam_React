import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity,Alert, StyleSheet, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {Provider} from 'react-redux'
import store from "./createRedux"
import {connect} from "react-redux"
import {Asset} from 'expo-asset'
import { AppLoading } from 'expo';
import Navigator from "./routes/HomeStack"
import * as firebase from "firebase"
import ApiKey from "./assets/config/ApiKey"
import MainContent from "./routes/MainContent"
import key from "./assets/url"
import axios from "axios";


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

class Start extends React.Component {

  camera = null
  player = null
  videoSet=null
  currentUser=null

  constructor(props) {
    super(props)
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
      showVideo: false,
      url:"",
      isReady:false,
      isAuthenticationReady: false,
      isAuthenticated: false,
    }

     // Initialize firebase...
  if (!firebase.apps.length) 
  { 
    firebase.initializeApp(ApiKey); 
  }
  
  firebase.auth().onAuthStateChanged((user)=>{
    if(user)
    {
     this.currentUser=user
    }  
    this.onAuthStateChanged(user)
  }
  );

  
    this.onAuthStateChanged=this.onAuthStateChanged.bind(this)
    this.getUser=this.getUser.bind(this) 

}

  

  onAuthStateChanged = (user) => {
    console.log("auth changed called")
    
    if(user)
    {
        console.log("getting user",user.email) 
        var temp=user.email
        this.getUser(user,temp.toLowerCase())
        
       }
     else{
     
      this.setState({isAuthenticated:false,isAuthenticationReady: true});
     }
  }
  

  //getUserInfo on login
  getUser=(user,id)=>{
      var data={"userId":id}
    axios.post(key.ServerUrl+"getUser",data )
    .then(response => {
        if(response.state==="error")
          {
              Alert.alert("Unable to fetch info , Please login again") 
          }
          else{
              //Alert.alert("user Created")
              console.log("user data")
              this.props.setUserLogin({id:id,data:response.data.result})
               this.setState({isAuthenticated: !!user,isAuthenticationReady: true});
     
          }
      }).catch(error => {Alert.alert("unable to fetch user info")});
   }











  componentDidMount = async () => {
    console.log("in comp did mount ,start")

    const { status } = await Camera.requestPermissionsAsync();

    const { status1 } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

     this.setState({ hasPermission: (status === 'granted' && status1 === 'granted') })

     this.props.setAll_Audio(this.props.musicData)

  }

  


  

  

  
  


  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('./assets/star.jpg')]);

    await Promise.all([...imageAssets]);
  }



  render() {

   
    
    console.log("in user is ",this.state.isAuthenticated,this.currentUser!==null?this.currentUser.email:"")
     
    if ((!this.state.isReady && this.state.hasPermission===null) || !this.state.isAuthenticationReady) {
        return (
          <AppLoading
            startAsync={this._loadAssetsAsync}
            onFinish={() =>{ 
                console.log("on finish")
                this.setState({ isReady: true })}}
            onError={console.warn}
          />
        );
      }
       else
       {
       
       return (
         <Provider store={store}>
          {this.state.isAuthenticated?<MainContent/>:<Navigator/>}
          </Provider>
       );
       }


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
      UserInfo:state.UserInfo
      
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        setAll_Audio: (val) => {
        dispatch({
          type: "setAll_Audio",
          payload:val
        });
      },
      setUserLogin: (val) => {
        dispatch({
          type: "setUserLogin",
          payload:val
        });
      },
      logout:() => {
        dispatch({
          type: "logout",
          payload: ""
        });
      }
    };
  };
  
  export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(Start);
    
