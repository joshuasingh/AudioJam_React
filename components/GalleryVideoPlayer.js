import React from 'react';
import { Text, View, TouchableOpacity,Alert, StyleSheet,Dimensions } from 'react-native';
import VideoPlayer from 'expo-video-player'
import { Video } from 'expo-av'
import {
    handleAndroidBackButton,
  } from "../functions/BackButton_Config" 
 
  



import {connect} from "react-redux"

class GalleryVideoPlayer extends React.Component {

  videoSet=null
  thumbnail=null
  deviceHeight=null
  
  constructor(props) {
    super(props)
    this.state = {
      caption:this.props.caption,
      url:this.props.url
    }

    this.deviceHeight=Math.round(Dimensions.get('window').height);
     this.navigateBack=this.navigateBack.bind(this)
   }

   navigateBack=()=>{
    this.props.back()

}


 componentDidMount() {
  handleAndroidBackButton(this.navigateBack);
 }





 render() {
    
    
   console.log("the video played",this.state.url,this.state.caption)

    var self=this
    console.log("in render of GalleryVideoPlay")
    this.videoSet={
        shouldPlay: true,
       resizeMode: Video.RESIZE_MODE_CONTAIN,
        source: {
           uri:self.state.url
              }
          }

    return (
        <View style={{flex:1,backgroundColor:"black"}}>
      
        <TouchableOpacity
          underlayColor="rgba(200,200,200,0.6)"
          style={{flex:.9}}
       >
          <VideoPlayer videoProps={this.videoSet}
          inFullscreen={true}
          height={this.deviceHeight-150}     
                />
            
        </TouchableOpacity>
    {/* <Text style={{flex:.2}}>{this.state.caption}</Text> */}
    <Text style={this.styles.captionStyles} multiline = {true}
         numberOfLines = {3} textAlign={'center'}>{this.state.caption.length===0?"---No Caption---":this.state.caption}</Text>
    
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
    },
    buttonStyle:{
       marginBottom:100
    },
    spinnerTextStyle: {
      color: '#FFF'
    },
    captionStyles:{
      flex:.14,
      margin:10,
      borderRadius:20,
      backgroundColor:"#d3d3d3",
      fontSize:20,
      color: 'black',
      height:120,
      textAlign: 'center'
      
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
    Urls:(val) => {
      dispatch({
        type: "Urls",
        payload:val
      });
    }
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(GalleryVideoPlayer);
  
