import React, { Component } from 'react';
import { Alert,View,ActivityIndicator, Text, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';
import SVG, {Image, Circle, ClipPath} from 'react-native-svg';

import Animated, {Easing} from 'react-native-reanimated'
import {TapGestureHandler, State, TextInput} from 'react-native-gesture-handler'
import Toast, {DURATION} from 'react-native-easy-toast'


import {connect} from "react-redux"
import * as firebase from "firebase"
import key from "../assets/url"
import { NavigationActions ,StackActions} from 'react-navigation';
import axios from "axios";
const { width, height } = Dimensions.get('window');







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

class Login1 extends Component {
  
  loginRef=null
  signUpRef=null

  constructor(){
      super()

      this.state = {
        email:"",
        password:"",
        spinner:false
   }
   
    this.login=this.login.bind(this)
    this.signUp=this.signUp.bind(this)
    this.getUser=this.getUser.bind(this)
     
     
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
  
   //getUserInfo on login
   getUser=()=>{
    axios.post(key.ServerUrl+"getUser", {userId:this.state.email.toLowerCase()})
    .then(response => {
        if(response.data.status==="error")
          {
             
        Alert.alert("Unable to fetch info , Please login again") 
        }
          else{
              //Alert.alert("user Created")
              console.log("user data",response.data.result)
              this.props.setUserLogin({id:this.state.email,data:response.data.result})

          }

       try{   
           //disable the login and create account button
        this.mainRef.setNativeProps({
          pointerEvents:'auto'
        })
    }
    catch(e)
    {

    }

      }).catch(error => {
        Alert.alert("Problem in fetchin User Info")
      
          //disable the login and create account button
          this.mainRef.setNativeProps({
            pointerEvents:'auto'
          })
  
      });
   
   
    }



   login=()=>{
       console.log("in login")
       
      //disable the login and create account button
        this.mainRef.setNativeProps({
        pointerEvents:'none'
      })
      
      //toast called
   this.refs.toast.show('logging In', 5000, () => {
    console.log("toast caled")
     });
     

      firebase
       .auth().signInWithEmailAndPassword(this.state.email, this.state.password)
       .then(() =>{
           //get logged in user info from server
           this.getUser()   
        })
       .catch(error => {
         Alert.alert(error.message)
           //disable the login and create account button
        this.mainRef.setNativeProps({
          pointerEvents:'auto'
        })
        
        })
   }




       
   signUp=()=>{
    // var navActions = StackActions.reset({
    //     title:"new screen",
    //     index: 0,
    //     actions: [NavigationActions.navigate({routeName: "NewSignUp"})]
    // });
    // this.props.navigation.dispatch(navActions);
    this.props.navigation.navigate("NewSignUp")
     }
  
     spinnerRef=null 
  


     componentDidMount () {
      // add listener 
      this.willBlurSubscription = this.props.navigation.addListener('willBlur', this.willBlurAction);
    }
    
    componentWillUmount () {
      // remove listener
      this.willBlurSubscription.remove();
    }
    
    willBlurAction = () => {
      // do things here when the screen blurs
    
      console.log("in will blur")
    }


     mainRef=null


  render() {
    return (
      
      <View
        style={{flex: 1, backgroundColor: 'white',justifyContent: 'flex-end'}}  ref={e=>{this.mainRef=e}} >
         
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
                        LET'S START
                    </Text>
                </Animated.View>
            </TapGestureHandler>

            {/* <TapGestureHandler onHandlerStateChange={this.onStateOpen}>
                <Animated.View style={{ ...this.styles.button, opacity: this.buttonOpacity, 
                    transform: [{ translateY: this.buttonY }]}}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>
                            SIGN UP
                        </Text>
                </Animated.View>
            </TapGestureHandler> */}

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
                    placeholder="EMAIL"
                    style={this.styles.textinput}
                    placeholderTextColor="black"
                    value={this.state.email} onChangeText={(e)=>{
                      this.setState({email:e})}}
                     
                    />

                <TextInput
                    placeholder="PASSWORD"
                    style={this.styles.textinput}
                    placeholderTextColor="black" 
                    value={this.state.password} onChangeText={(e)=>{
                      this.setState({password:e})}}
                      secureTextEntry={true}
                    />

                <Animated.View style={this.styles.button}>
                    <TouchableOpacity onPress={this.login} ref={(e)=>{this.loginRef=e}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        LOG IN
                    </Text>
                    </TouchableOpacity>  
                </Animated.View>
                <Animated.View style={this.styles.button}>
                    <TouchableOpacity  onPress={this.signUp} ref={ree=>{this.signUpRef=ree}}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        New Here,SIGN UP
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
    },
    spinnerTextStyle: {
      color: '#FFF'
    
    },
    container1: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal1: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
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
  )(Login1);
  
