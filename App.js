import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import VideoPlayer from "expo-video-player";
import { Provider } from "react-redux";
import store from "./createRedux";
import Start from "./Start";
import key from "./assets/url";
import axios from "axios";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import { WebView } from "react-native-webview";

class App extends React.Component {
  webview = null;
  constructor(props) {
    super(props);

    this.webview_Ref = null;
    this.state = {
      Ready: false,
      refresh: false,
      musicData: null,
      canGoBack: false,
      canGoForward: false,
      currentUrl: "",
    };

    this.getAllMusicData = this.getAllMusicData.bind(this);
    this.refresh = this.refresh.bind(this);
    this.backHandler = this.backHandler.bind(this);
    this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
  }

  getAllMusicData = () => {
    console.log("music data called", key.ServerUrl + "allMusic");
    axios
      .get(key.ServerUrl + "allMusic", {})
      .then((response) => {
        if (response.state === "error") {
          Alert.alert("Please,Try to login again");
          return;
        } else {
          this.setState({ Ready: true, musicData: response.data.result });
        }
      })
      .catch((error) => {
        Alert.alert(error.message, "Please try Again");
      });
    return;
  };

  refresh = () => {
    console.log("clicked");
    this.setState((prev) => {
      return {
        refresh: !prev.refresh,
      };
    });
  };

  // render() {
  //   if (this.state.musicData === null) this.getAllMusicData();

  //   console.log("reder called");

  //   if (this.state.Ready) {
  //     return (
  //       <Provider store={store}>
  //         <Start musicData={this.state.musicData} />
  //       </Provider>
  //     );
  //   } else {
  //     return (
  //       <View style={{ flex: 1 }}>
  //         <TouchableOpacity
  //           style={{ padding: 100, "font-size": "11px" }}
  //           onPress={this.refresh}
  //         >
  //           <Text>
  //             Unable to load ,Please Check your Internet connection,And tap the
  //             screen
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  // }

  backHandler = () => {
    console.log("backandler called");
    this.webview.goBack();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backHandler);
  }

  _onNavigationStateChange(webViewState) {
    console.log("gation value changed", webViewState.url);
  }

  render() {
    console.log("current url", this.state.currentUrl);
    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={(ref) => (this.webview = ref)}
          source={{
            uri: "http://192.168.1.203:3000/",
            // uri: "https://github.com/joshuasingh/finalNodeServer",
          }}
          style={{ marginTop: 20 }}
          onNavigationStateChange={(e) => {
            this._onNavigationStateChange(e);
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </SafeAreaView>
    );
  }
}

export default App;
