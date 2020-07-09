import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, Share, Clipboard } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as firebase from "firebase";
import uuid from "uuid";


const firebaseConfig = {
  apiKey: "AIzaSyBxeBLfG8bFfyg5wwft0stNdEMRM6OPjBo",
  authDomain: "videoupload-f4879.firebaseapp.com",
  databaseURL: "https://videoupload-f4879.firebaseio.com",
  projectId: "videoupload-f4879",
  storageBucket: "videoupload-f4879.appspot.com",
  messagingSenderId: "659565983703",
  appId: "1:659565983703:web:7376471096873bb1a07d92",
  measurementId: "G-J8SSTPW9KS",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firebase sets some timers for a long period, which will trigger some warnings. Let's turn that off for this example
console.disableYellowBox = true;

class MyCam extends Component {
  state = {
    video: null,
    recording: false,
    uploading: false,
  };

  // _saveVideo = async () => {
  //   const { video } = this.state;
  //   const asset = await MediaLibrary.createAssetAsync(video.uri);
  //   if (asset) {
  //     this.setState({ video: null });
  //   }
  // };

  _StopRecord = async () => {
    this.setState({ recording: false }, () => {
      this.cam.stopRecording();
    });
  };

  _StartRecord = async () => {
    if (this.cam) {
      this.setState({ recording: true }, async () => {
        const video = await this.cam.recordAsync({ maxDuration: 15 });
        // this.setState({ video });
        this._StopRecord();
        this._handleRecordedVideo(video);
      });
    }
  };

  toogleRecord = () => {
    const { recording } = this.state;

    if (recording) {
      this._StopRecord();
    } else {
      this._StartRecord();
    }
  };

  _handleRecordedVideo = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadVideoAsync(pickerResult.uri);
        this.setState({ video: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  _renderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderVideo = () => {
    let { video } = this.state;
    if (!video) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: video }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {video}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.video,
      title: "Check out this video",
      url: this.state.video,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.video);
    alert("Copied video URL to clipboard");
  };

  render() {
    const { recording } = this.state;
    return (
      <Camera
        ref={cam => (this.cam = cam)}
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          flex: 1,
          width: "100%"
        }}
      >
        {/* {video && (
          <TouchableOpacity
            onPress={this._saveVideo}
            style={{
              padding: 20,
              width: "100%",
              backgroundColor: "#fff"
            }}
          >
            <Text style={{ textAlign: "center" }}>Upload recording</Text>
          </TouchableOpacity>
        )} */}
        <TouchableOpacity
          onPress={this.toogleRecord}
          style={{
            padding: 20,
            width: "100%",
            backgroundColor: recording ? "#ef4f84" : "#4fef97"
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {recording ? "Stop" : "Record"}
          </Text>
        </TouchableOpacity>
        {this._maybeRenderVideo()}
        {this._renderUploadingOverlay()}
      </Camera>
    );
  }
}

export default class RecVideo extends Component {
  state = {
    showCamera: false,
    audioRecord: false,
  };

  _showCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { status2 } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (status === "granted") {
      this.setState({ showCamera: true });
    }
  };

  render() {
    const { showCamera } = this.state;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          width: "100%",
        }}
      >
        {showCamera ? (
          <MyCam />
        ) : (
          <TouchableOpacity
            onPress={this._showCamera}
            style={{ backgroundColor: "red", padding: 15, borderRadius: 50 }}
          >
            <Text style={{ fontSize:18, fontWeight: 'bold', color: 'white' }}> Record video (max 15secs) </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

async function uploadVideoAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}
