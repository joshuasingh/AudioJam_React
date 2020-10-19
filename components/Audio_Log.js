import React from 'react';
import { Text,View, TouchableOpacity, StyleSheet,ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import {connect} from "react-redux"
import Toast, {DURATION} from 'react-native-easy-toast'


class Audio_Log extends React.Component {
  
   mainViewRef=null
  audioLoading=null
    
 
  constructor(props) {
    super(props)

    this.state={
        playing:false,
        url:null,
        playIndex:-1
    }
    
    this.musicTemplate=this.musicTemplate.bind(this)
    this.playAudio=this.playAudio.bind(this)
    this.audioSetUp=this.audioSetUp.bind(this)  
    this.startMusic=this.startMusic.bind(this)  
    this.setMusic=this.setMusic.bind(this)
   

   


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
        console.log("audio mode set",res)
      },err=>{
        console.log("audio setup error")
      })
  
    }
    catch(e)
    {
      console.log("error with audio set up")
    }
  
   }
   





  playAudio=(ind,urll)=>
  {
     
    if(this.state.playing)
      {
        if(this.audioLoading===null)
           return 
        this.soundObject.stopAsync()
      }
    if(this.state.playIndex===ind)
      {  this.setState({
        playIndex:-1,
        playing:false,
        url:null
    })   
   }
   else{
    this.setState({
        playing:true,
        playIndex:ind,
        url:urll
    })

   }
      
   return 
  }


  

    musicTemplate=(a,ind)=>
    {
     
       
     var icon=this.state.playIndex===ind?"||":">"

     return (
       <View pointerEvents={"auto"} ref={(ree)=>{this.mainViewRef=ree}}>
       <TouchableOpacity style={{flexDirection:"row" ,margin:10,height:70,borderRadius:10,
        shadowColor: "#000",
       shadowOffset: { 
	   width: 0,
	  height: 1,
        },
      shadowOpacity: 0.25,
      shadowRadius: 3,

    elevation: 3,}} onPress={this.playAudio.bind(this,ind,a.url)}
       onLongPress={this.setMusic.bind(this,ind,a.url)}> 
        <Text style={{flex:.7,fontSize:18,textAlign:"center",marginTop:18}}>{a.title}</Text>
        <Text style={{flex:.3,fontSize:22,textAlign:"center",marginTop:18}} >{icon}</Text>
        </TouchableOpacity>
        </View>   
     )

     
    }

  
  soundObject=null

     
  startMusic = async () => {

  
    this.soundObject = new Audio.Sound();


    var self = this
    console.log("clicked",this.state.url)
    try {
       
      this.audioLoading=await this.soundObject.loadAsync({uri:this.state.url},{});
      
      this.soundObject.playAsync();
     console.log("audio is playing")
  }
    catch (e) {
     
      console.log("error in video", e)
    }

      return 
  }


   setMusic=async(ind,url)=>{
    
    var dur=0
    var self=this
   
       
    
       //stop the audio play 
        if(this.state.playing)
        {
           this.soundObject.stopAsync() 
        }   
     try{   
     
    //if current url is already loaded (get audio duration)
     if(this.state.url===url && this.state.playing===true)
       {
           console.log("already loaded")
        await this.soundObject.getStatusAsync()
        .then(function(result) {
            dur=result.durationMillis
          console.log("the duration of audio",result.durationMillis)
        }).catch(e=>{
          if(this.state.playing)
             this.soundObject.stopAsync()  
          
             console.log("err in getting audio duration")
            
            return 
        })
      
    }
    else
    {
        console.log("have to unloaded")
       if(this.soundObject!==null)
           this.soundObject.unloadAsync()
        else
        {
            this.soundObject = new Audio.Sound();
        }   
           
          
           await this.soundObject.loadAsync({uri:url},{});
           await this.soundObject.getStatusAsync()
        .then(function(result) {
            dur=result.durationMillis
          console.log("the duration of audio",result.durationMillis)
        }).catch(e=>{
          if(this.state.playing)
             this.soundObject.stopAsync()  
          
             console.log("err in getting audio duration")
            
            return 
        }) 
        
   }  
   
       console.log("in selecting music the duration",dur)
         
      this.props.putMusic({url:url,dur:dur/1000})
      this.props.navigation.goBack()
     }
     catch(e)
     {
       Alert.alert("Unable to add Music,try again")
     }

      return
     
    }

    


   componentDidMount() {
    this.audioSetUp()

    //toast called
   this.refs.toast.show('Long Press to Select', 3000, () => {
   
     });
    }



   
   
   componentDidUpdate()
   {
      this.audioLoading=null   
    if(this.state.playing===true && this.state.url!==null)
           this.startMusic()

   }

    
    

    
  render() 
  {
      var self=this
      console.log("in render of audio State")
  
   return (
        <View style={{ flex: 1,marginTop:60}}>
         <Toast style={this.styles.toastStyle} position={'center'} ref="toast"/>
         <ScrollView>
         {
          this.props.audioData.allAudio.map((val,ind)=>{
            return(
            <View>
              {
              this.musicTemplate(val,ind)
          }
            </View>)
          })
         }
         </ScrollView>
        
          </View>
    );
    

    }

    componentWillUnmount(){
      try{
      (this.soundObject!==null)
      this.soundObject.stopAsync()  
      }catch(e){}
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
    toastStyle:{
      
    }
  });




}

const mapStateToProps = state => {
    return {
      audioData: state.AudioState 
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        setAll_Audio:() => {
        dispatch({
          type: "setAll_Audio",
          payload: ""
        });
      },
      set_BackGround_Audio:val => {
        dispatch({
          type: "set_BackGround_Audio",
          payload: val
        });
      },
      putMusic:val => {
        dispatch({
          type:"putMusic",
          payload: val
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
  )(Audio_Log);
  
