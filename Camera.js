import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Clipboard,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as firebase from "firebase";
import uuid from "uuid";

const firebaseConfig = {
  apiKey: "your api-Key",
  authDomain: "your domain",
  databaseURL: "your url",
  projectId: "project Id",
  storageBucket: "bucket url",
  messagingSenderId: "your sender id",
  appId: "your_app_id",
  measurementId: "measurement id",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// // Firebase sets some timers for a long period, which will trigger some warnings. Let's turn that off for this example
console.disableYellowBox = true;

export default class MyCam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      video: null,
      recording: false,
      uploading: false,
    };
  }

  _StopRecord = async () => {
    this.setState({ recording: false }, () => {
      this.cam.stopRecording();
    });
  };

  _StartRecord = async () => {
    if (this.cam) {
      this.setState({ recording: true }, async () => {
        const video = await this.cam.recordAsync({ maxDuration: 15, quality: '480p' });
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
        // uploadUrl = await uploadVideoAsync(pickerResult.uri);
        this.setState({ video: await uploadVideoAsync(pickerResult.uri) });
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
          <Text style={{ fontWeight: "bold", color: "white", marginBottom: 10 }}>Uploading your video</Text>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderVideo = () => {
    let { video, recording } = this.state;
    if (!video) {
      return;
    }

    return (
      <View
        style={[
          StyleSheet.absoluteFill,
            {
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              elevation: 2
            },
        ]}
      >
        <Text
          style={{
            textAlign: "center",
            padding: 10,
            marginBottom: 5,
            backgroundColor: "red",
            color: 'white',
            fontWeight: 'bold',
            borderRadius: 20,
          }}
        >
          Tap the link to share / long press the link to share
        </Text>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ textAlign: "center", padding: 15, color: 'black' }}
        >
          {video}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: `Check out this video ${this.state.video}`,
      title: "Check out this video",
      url: this.state.video,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.video);
    alert("Copied video URL to clipboard");
  };

  render() {
    const { recording, uploading, video } = this.state;
    return (
      <Camera
        ref={(cam) => (this.cam = cam)}
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          flex: 1,
          backgroundColor: 'transparent',
          width: "100%",
        }}
      >
        {uploading ? null : video ? null : (
          <TouchableOpacity
            onPress={this.toogleRecord}
            style={{
              padding: 20,
              width: "100%",
              backgroundColor: recording ? "#ef4f84" : "#4fef97",
            }}
          >
            <Text style={{ textAlign: "center" }}>
              {recording ? "Stop" : "Record"}
            </Text>
          </TouchableOpacity>
        )}
        {this._renderUploadingOverlay()}
        {this._maybeRenderVideo()}
      </Camera>
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
  const uploadedVideo = await snapshot.ref.getDownloadURL();

  // We're done with the blob, close and release it
  blob.close();

  return uploadedVideo;
}
