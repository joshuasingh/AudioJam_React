import React  from 'react';
import { Text,Alert,View, TouchableOpacity, StyleSheet,} from 'react-native';
import {connect} from "react-redux"



class CameraControlBar extends React.Component {

 camera = null
  player = null
  videoSet=null
  ButtonRef=null

  constructor(props) {
    super(props)
    this.state = {
       recording: false,
      }

 
    this.buttonColor=this.buttonColor.bind(this)
    this.startRecording=this.startRecording.bind(this)
    this.stopRecording=this.stopRecording.bind(this)
    }
   
    

    startRecording=()=>
    { 
        this.props.changeRecordingState()
        this.props.startRec()
      
    }

    stopRecording=()=>{
        this.props.stopRec()
      

    }

    

     
    buttonColor=()=>{
        if(this.props.camValues.Recording===true)
        {
          this.ButtonRef.setNativeProps({
            style:{backgroundColor: '#87ceeb'}
        });
        }
        else
        {
          this.ButtonRef.setNativeProps({
            style:{backgroundColor: '#f0ffff'}
        });
        }
  
      }
  
      componentDidMount()
      {
         this.buttonColor()
      }
  
  
      componentDidUpdate()
      {
         this.buttonColor()
      } 

  render() {

   
    var RecState=this.props.camValues.Recording===false?"Rec":"Rec..."
    return (
        <View style={{ flex: 1 }}>
        
        <View
          style={{
             flexDirection: 'row',
             position: 'absolute',
               bottom:0
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: "#f0ffff",
              borderRadius:10,
              margin:10,
              height:40,
              elevation: 2,
            }}
            onPress={this.props.flipCamera}
          >
            <Text style={{ fontSize: 22, alignItems:"center", color: '#6495ed' }}>flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              alignItems: 'center',
              backgroundColor: "#f0ffff",
              borderRadius:50,
              margin:10,
              height:40,
              elevation: 2,
            }}

            ref={ree => { this.ButtonRef = ree }}
            onPress={this.props.camValues.Recording===false?this.startRecording:this.stopRecording}
           
          >
            <Text style={{ fontSize: 22, marginBottom: 10, color: '#6495ed' }} >
               {RecState}
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: 'flex-start',
              alignItems: 'center',
              backgroundColor: "#f0ffff",
              borderRadius:10,
              margin:10,
              height:40,
              elevation: 2,
            }}

            onPress={()=>{this.props.selectMusic()}}
           
          >
            <Text style={{ fontSize: 22, marginBottom: 10, color: '#6495ed' }} >
               +Music
              </Text>
          </TouchableOpacity>
        </View>
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
      camValues: state.CameraSetting
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
      }
     
  
    };
  };

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(CameraControlBar);
  
