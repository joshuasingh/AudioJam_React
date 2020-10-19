import React from 'react';
import { Text,Alert, View, TouchableOpacity,StyleSheet, Image, Dimensions ,FlatList, Button} from 'react-native';
  import GalleryVideoPlayer from "./GalleryVideoPlayer"
  import * as firebase from 'firebase';



import {connect} from "react-redux"

class Profile extends React.Component {

    videoSet=null
    videoData=[]
  
  constructor(props) {
    super(props)
    this.state = {
      image:null,
      spinner:true,
     refresh:true,
      videoPlay:false,
      caption:"",
      url:null
      
    }
    
   this.renderItem=this.renderItem.bind(this)
     this.formatData=this.formatData.bind(this) 
   this.playVideo=this.playVideo.bind(this)
    this.setGallery=this.setGallery.bind(this)
    this.logOut=this.logOut.bind(this)  
    this.moveTo=this.moveTo.bind(this)
    this.refresh=this.refresh.bind(this)  
   

       //set the data for videos from redux store
    
   

   
  }


  static navigationOptions=({ navigation })=>
  {
    return {
           title: 'Gallery',
        headerRight:()=><Button title="Sign Out" onPress={()=>{navigation.getParam('logOut')()}}></Button>
       }
  }


  





  logOut=()=>{
    console.log("in logout")
    var self=this
    firebase.auth().signOut().then(function() {
         console.log("signed out")      
      //self.props.logout()
    }).catch(function(error) {
      Alert.alert("Unable to logout please try again")
     });
     
  }




  
   formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
  
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    
    
        
     
  
    return data;
  };
  
  numColumns = 3;
      
  renderItem = ({ item, index }) => {
     // console.log("in render item",item.thumbnail)
    if (item.empty === true) {
        return <View style={[this.styles.item, this.styles.itemInvisible]} />;
      }
      return (
        
        <View
          style={this.styles.item}
        >
            
         <TouchableOpacity onPress={this.playVideo.bind(this,item.url,item.caption)} style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
          <Image source={{ uri:item.thumbnail}}  style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}/>
          </TouchableOpacity>
           </View>
      );
      }
    

      playVideo=(url,caption)=>{
       console.log("in play video")
        this.setState({
           caption:caption,
           url:url,
           videoPlay:true
       })

      }

      setGallery=()=>{
        this.setState({
            caption:"",
            url:null,
            videoPlay:false
        })
 
        
      }


      refresh=()=>{
           
          this.setState((prev)=>({refresh:!prev.refresh}))
      }


      moveTo=()=>
      {
        
          this.props.navigation.navigate("Stream")

      }


      



      componentDidMount()
      {
                    this.props.navigation.setParams({ logOut: this.logOut });
      }
 

     
  

  render() {
  

  
  try{
    console.log("render of profile",this.props.UserInfo.userData[0].Video.length)
  this.videoData=this.props.UserInfo.userData[0].Video
  }catch(e)
  {
     
  }
     if(this.state.videoPlay===false)
    {
    return (
      <View style={{flex:1,marginTop:50}}>
      <FlatList
        data={this.formatData(this.videoData,this.numColumns)}
        style={this.styles.container}
        renderItem={this.renderItem}
        numColumns={this.numColumns}
      />
      <TouchableOpacity style={this.styles.button} onPress={this.moveTo}>
          <Text style={this.styles.itemText}>Make New Video</Text>
      </TouchableOpacity>
      </View>
    )
    }
    else{
        return (
            <View style={{flex:1}}>
              <GalleryVideoPlayer caption={this.state.caption} url={this.state.url} back={this.setGallery}/>
            </View>
          )   
    }
  // }
   
    }


    componentWillUnmount()
    {
      console.log("unmount of profile called")


    }

    





    styles = StyleSheet.create({
        container: {
          flex:1,
          backgroundColor: '#DCDCDC',
          marginBottom:10,
          marginTop:0
          
          
        },
        item: {
          backgroundColor: '#4D243D',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          margin: 1,
           height: Dimensions.get('window').width /this.numColumns,// approximate a square
        },
        itemInvisible: {
          backgroundColor: 'transparent',
        },
        itemText: {
          fontSize: 20, 
          fontWeight: 'bold'
        },
        spinnerTextStyle: {
            color: '#FFF'
          },
        textStyle:{flex:.1,
            backgroundColor:"#dcdcdc",
            alignItems:"center"},
        button: {
             flex: .1,
             // top: -20,
              backgroundColor: '#F0F8FF',
              height: 70,
              marginHorizontal: 20,
              borderRadius: 35,
              alignItems: 'center',
              justifyContent: 'center',
             // marginVertical: 5,
              shadowOffset: { width: 2, height: 2 },
              shadowColor: 'black',
               elevation: 3,
              shadowOpacity: 0.2,
              backgroundColor:"#f5f5dc",
              zIndex:1,
              marginBottom:4 
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
  )(Profile);
  
