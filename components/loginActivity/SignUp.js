import React, { useState, useEffect } from 'react';
import { Text,Platform, View, TouchableOpacity, StyleSheet, Linking, Button,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {connect} from "react-redux"
import * as firebase from 'firebase';
import key from "../../assets/url"
import axios from "axios";




class SignUp extends React.Component {

    videoSet=null
  
  constructor(props) {
    super(props)
    this.state = {
         email:"",
         password:"",
         passwordConfirm:""
    }
    
   this.Create=this.Create.bind(this)
   this.createUserInfo=this.createUserInfo.bind(this)
 
   }

//creating user info in mongo db database
   createUserInfo=async()=>{
    console.log("create user called") 
    var data=
      {
          userId:this.state.email
      }
     axios.post(key.ServerUrl+"createUser", data)
    .then(response => {
        if(response.state==="error")
          {
              Alert.alert("Please,Try to login again") 
          }
          else{
              Alert.alert("user Created")
              this.props.setUser(this.state.email)

             
          }
      }).catch(error => {Alert.alert(error)});
    
   return 

  }


//creating user in firebase
   Create=()=>{
     console.log("creation")
    
     
     
    //  if(this.state.password!==this.state.passwordConfirm)
    //   {
    //     Alert.alert("Passwords do not match");
    //     return 
    //   }
      
      var self=this
       firebase.auth().createUserWithEmailAndPassword(this.state.email.toLowerCase(), "Qwerty")
           .then((val)=>{
                      self.createUserInfo()
           },(err)=>{
            Alert.alert('Error:', err.message)
           })
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
            <TextInput style={{margin:10,width:100,height:30,borderWidth:1}}  value={this.state.passwordConfirm} onChangeText={(e)=>{
               this.setState({passwordConfirm:e})
           }}/>
          

           <Button title='Create Account' onPress={this.Create} />
         
            


        </View>
    );


   
    }

  





  styles = StyleSheet.create({
    
  });




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
    setUser:(id) => {
        dispatch({
          type: "setUser",
          payload:id
        });
      }
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignUp);
  
