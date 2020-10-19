import React, { useState, useEffect } from 'react';
import { Alert,Text,Platform, View, TouchableOpacity, StyleSheet, Linking, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {connect} from "react-redux"
import { NavigationActions ,StackActions} from 'react-navigation';
import * as firebase from "firebase"
import key from "../../assets/url"
import axios from "axios";


class Login extends React.Component {

    videoSet=null
  
  constructor(props) {
    super(props)
    this.state = {
         email:"",
         password:""
    }
    
     this.login=this.login.bind(this)
     this.signUp=this.signUp.bind(this)
     this.getUser=this.getUser.bind(this)
  
   }


   //getUserInfo on login
   getUser=()=>{
    axios.post(key.ServerUrl+"getUser", {userId:this.state.email.toLowerCase()})
    .then(response => {
        if(response.state==="error")
          {
              Alert.alert("Unable to fetch info , Please login again") 
          }
          else{
              //Alert.alert("user Created")
              console.log("user data",response.data.result)
              this.props.setUserLogin({id:this.state.email,data:response.data.result})

          }
      }).catch(error => {Alert.alert(error)});
   }



   login=()=>{
       console.log("in login")
      
       firebase
       .auth().signInWithEmailAndPassword(this.state.email, this.state.password)
       .then(() =>{
           //get logged in user info from server
           this.getUser()   
        })
       .catch(error => {Alert.alert(error)})
   }

       
  

   signUp=()=>{
    var navActions = StackActions.reset({
        title:"new screen",
        index: 0,
        actions: [NavigationActions.navigate({routeName: "SignUp"})]
    });
    this.props.navigation.dispatch(navActions);
     }



  render() {

    return (
        <View >
          
           <TextInput style={{margin:10,width:100,height:30,borderWidth:1}}  value={this.state.email} onChangeText={(e)=>{
               this.setState({email:e})
           }}/>
            <TextInput style={{margin:10,width:100,height:30,borderWidth:1}}  value={this.state.password} onChangeText={(e)=>{
               this.setState({password:e})
           }}/>
           <Button title='login' onPress={this.login} />
           <Button title='SignUp' onPress={this.signUp}/> 
            


        </View>

    );


   
    }

  


}

const mapStateToProps = state => {
  return {
    
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
    setUserLogin: (val) => {
        dispatch({
          type: "setUserLogin",
          payload:val
        });
      }
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login);
  
