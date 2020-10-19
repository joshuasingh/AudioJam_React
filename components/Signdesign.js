import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions,TouchableOpacity,Alert } from 'react-native';
import SVG, {Image, Circle, ClipPath} from 'react-native-svg';

import Animated, {Easing} from 'react-native-reanimated'
import {TapGestureHandler, State, TextInput} from 'react-native-gesture-handler'

const { width, height } = Dimensions.get('window');
import {connect} from "react-redux"
import * as firebase from 'firebase';
import key from "./../assets/url"
import axios from "axios";
import Toast, {DURATION} from 'react-native-easy-toast'







const {Value, 
    event, 
    block, 
    cond, 
    eq, 
    set, 
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning, 
    interpolate,
    Extrapolate,
    concat} = Animated

function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
  }

class Signdesign extends Component {
  //reference to whole view 
  mainRef=null
 
  constructor(props){
      super(props)
    
      this.state = {
        userName:"",
        email:"",
        password:"",
        passwordConfirm:""
   }

   this.Create=this.Create.bind(this)
   this.createUserInfo=this.createUserInfo.bind(this)

      this.buttonOpacity = new Value(1)

      this.onStateOpen = event([
          {
              nativeEvent:({state})=>block([
                  cond(eq(state, State.END), 
                  set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))
              ])
          }
      ]);

      this.onStateClose = event([
        {
            nativeEvent:({state})=>block([
                cond(eq(state, State.END), 
                set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))
            ])
        }
    ]);

      this.buttonY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [100, 0],
        extrapolate: Extrapolate.CLAMP
      });
  
      this.bgY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [(-height/3) -50, 0],
        extrapolate: Extrapolate.CLAMP
      });

      this.textInputZindex = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, -1],
        extrapolate: Extrapolate.CLAMP
      });

      this.textInputY = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [0, 100],
        extrapolate: Extrapolate.CLAMP
      });

      this.textInputOpacity = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
      });

      this.rotateCross = interpolate(this.buttonOpacity, {
        inputRange: [0, 1],
        outputRange: [180, 360],
        extrapolate: Extrapolate.CLAMP
      });
 
 
 
    }  
  

    
//creating user info in mongo db database
   createUserInfo=async()=>{
    console.log("create user called") 
    var data=
      {
          userId:this.state.email.toLowerCase()
      }
     axios.post(key.ServerUrl+"createUser", data)
    .then(response => {
        if(response.state==="error")
          {
              Alert.alert("Please,Try to login again") 
              
            }
          else{
              Alert.alert("user Created")
              
            this.props.setUser(this.state.email.toLowerCase())
            
          }
         
        if(this.mainRef!==null)
        {  this.mainRef.setNativeProps({
            pointerEvents:'auto'
         })
        }
      }).catch(error => {
        

        Alert.alert("unable to create user please try again")
      });

      this.mainRef.setNativeProps({
        pointerEvents:'auto'
     }) 
    
   return 

  }


//creating user in firebase
   Create=()=>{
     console.log("creation")
    
     
     
     if(this.state.password!==this.state.passwordConfirm)
      {
        Alert.alert("Passwords do not match");
        return 
      }

      this.mainRef.setNativeProps({
        pointerEvents:'none'
      })
    
         //toast called
       this.refs.toast.show('Signing Up', 5000, () => {
         console.log("toast caled")
         });
     


      
      var self=this
       firebase.auth().createUserWithEmailAndPassword(this.state.email.toLowerCase(), this.state.password)
           .then((val)=>{
                   
            self.createUserInfo()
                    
           
                      },(err)=>{
            Alert.alert('Error:', err.message)
               
           this.mainRef.setNativeProps({
              pointerEvents:'auto'
             }) 
          })
   }




  
  
  
  
  
  
  render() {
    return (
      <View
        style={{flex: 1, backgroundColor: 'white',justifyContent: 'flex-end'}} 
        ref={ree=>{this.mainRef=ree}}
        >
           <Toast  position={'center'} ref="toast"/>
        
        <Animated.View style={{ ...StyleSheet.absoluteFill, 
            transform: [{ translateY: this.bgY }]}}>
                <SVG height={height+50} width={width}>
                    <ClipPath id="clip">
                        <Circle r={height+50} cx={width/2}/>
                    </ClipPath>

                    <Image href={require('../assets/star.jpg')}
                           height={height+50} 
                           width={width}
                           preserveAspectRatio="xMidYMid slice"
                           ClipPath="url(#clip)"/>
                </SVG>
        </Animated.View>

        <View style={{ height: height / 3, justifyContent: 'center' }}>
            <TapGestureHandler onHandlerStateChange={this.onStateOpen}>
                <Animated.View style={{...this.styles.button, opacity: this.buttonOpacity, 
                    transform: [{ translateY: this.buttonY }]}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        CREATE A NEW ACCOUNT
                    </Text>
                </Animated.View>
            </TapGestureHandler>

           

            <Animated.View style={{zIndex:this.textInputZindex, 
            opacity:this.textInputOpacity, backgroundColor: '#B0E0E6',
            transform: [{ translateY: this.textInputY }], height:height/2, ...StyleSheet.absoluteFill,
            top:null, justifyContent: 'center'}}>

                <TapGestureHandler onHandlerStateChange={this.onStateClose}>
                    <Animated.View style={this.styles.closeButton}>
                        <Animated.Text style={{ fontSize: 15, 
                            transform: [{rotate: concat(this.rotateCross, 'deg')}]}}>
                            X
                        </Animated.Text>
                    </Animated.View>
                </TapGestureHandler>

                <TextInput
                    placeholder="NAME"
                    style={this.styles.textinput}
                    placeholderTextColor="black" 
                    value={this.state.userName} onChangeText={(e)=>{
                      this.setState({userName:e})
                  }}
                 
                    />

                <TextInput
                    placeholder="EMAIL"
                    style={this.styles.textinput}
                    placeholderTextColor="black" 
                    value={this.state.email} 
                    onChangeText={(e)=>{
                      this.setState({email:e})}}
                      
                  />
                    
                <TextInput
                    placeholder="PASSWORD"
                    style={this.styles.textinput}
                    placeholderTextColor="black" 
                    value={this.state.password} onChangeText={(e)=>{
                      this.setState({password:e})
                  }}
                  secureTextEntry={true}
                    />

                <TextInput
                    placeholder="CONFIRM PASSWORD"
                    style={this.styles.textinput}
                    placeholderTextColor="black"
                    value={this.state.passwordConfirm} onChangeText={(e)=>{
                      this.setState({passwordConfirm:e})
                  }}
                  secureTextEntry={true}
                    />

                <Animated.View style={this.styles.button}>
                    <TouchableOpacity onPress={this.Create}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        CREATE
                    </Text>
                    </TouchableOpacity>
                </Animated.View>

            </Animated.View>
        </View>
      </View>
    );
  }
 styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: 'white',
      height: 70,
      marginHorizontal: 20,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
      shadowOffset: { width: 2, height: 2 },
      shadowColor: 'black',
      elevation: 3,
      shadowOpacity: 0.2
    },
    closeButton: {
      height: 40,
      width: 40,
      backgroundColor: 'white',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -20,
      left: (width/2)-20,
      shadowOffset: { width: 2, height: 2 },
      shadowColor: 'black',
      elevation: 3,
      shadowOpacity: 0.2
    },
    textinput: {
      height: 50,
      backgroundColor: '#F0F8FF',
      marginHorizontal: 20,
      borderRadius: 25,
      borderWidth: 0.5,
      paddingLeft: 10,
      marginVertical: 5,
      borderColor:'rgba(0,0,0,0.2)'
    }
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
  )(Signdesign);
  
