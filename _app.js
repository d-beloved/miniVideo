// import * as ImagePicker from "expo-image-picker";
// import { Camera } from 'expo-camera';
// import * as Permissions from "expo-permissions";
// import * as firebase from "firebase";
// import React, { Component } from "react";
// import {
//   ActivityIndicator,
//   Button,
//   Clipboard,
//   Image,
//   Share,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import uuid from "uuid";

// const firebaseConfig = {
//   apiKey: "AIzaSyAlZruO2T_JNOWn4ysfX6AryR6Dzm_VVaA",
//   authDomain: "blobtest-36ff6.firebaseapp.com",
//   databaseURL: "https://blobtest-36ff6.firebaseio.com",
//   storageBucket: "blobtest-36ff6.appspot.com",
//   messagingSenderId: "506017999540",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// // Firebase sets some timers for a long period, which will trigger some warnings. Let's turn that off for this example
// console.disableYellowBox = true;

// export default class App extends Component {
//   state = {
//     image: null,
//     uploading: false,
//   };

//   async componentDidMount() {
//     await Permissions.askAsync(Permissions.CAMERA_ROLL);
//     await Permissions.askAsync(Permissions.CAMERA);
//   }

//   render() {
//     let { image } = this.state;

//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         {!!image && (
//           <Text
//             style={{
//               fontSize: 20,
//               marginBottom: 20,
//               textAlign: "center",
//               marginHorizontal: 15,
//             }}
//           >
//             Example: Upload ImagePicker result
//           </Text>
//         )}

//         <Button
//           onPress={this._pickImage}
//           title="Pick an image from camera roll"
//         />

//         <Button onPress={this._takePhoto} title="Take a photo" />

//         {this._maybeRenderImage()}
//         {this._maybeRenderUploadingOverlay()}

//         <StatusBar barStyle="default" />
//       </View>
//     );
//   }

//   _maybeRenderUploadingOverlay = () => {
//     if (this.state.uploading) {
//       return (
//         <View
//           style={[
//             StyleSheet.absoluteFill,
//             {
//               backgroundColor: "rgba(0,0,0,0.4)",
//               alignItems: "center",
//               justifyContent: "center",
//             },
//           ]}
//         >
//           <ActivityIndicator color="#fff" animating size="large" />
//         </View>
//       );
//     }
//   };

//   _maybeRenderImage = () => {
//     let { image } = this.state;
//     if (!image) {
//       return;
//     }

//     return (
//       <View
//         style={{
//           marginTop: 30,
//           width: 250,
//           borderRadius: 3,
//           elevation: 2,
//         }}
//       >
//         <View
//           style={{
//             borderTopRightRadius: 3,
//             borderTopLeftRadius: 3,
//             shadowColor: "rgba(0,0,0,1)",
//             shadowOpacity: 0.2,
//             shadowOffset: { width: 4, height: 4 },
//             shadowRadius: 5,
//             overflow: "hidden",
//           }}
//         >
//           <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
//         </View>
//         <Text
//           onPress={this._copyToClipboard}
//           onLongPress={this._share}
//           style={{ paddingVertical: 10, paddingHorizontal: 10 }}
//         >
//           {image}
//         </Text>
//       </View>
//     );
//   };

//   _share = () => {
//     Share.share({
//       message: this.state.image,
//       title: "Check out this photo",
//       url: this.state.image,
//     });
//   };

//   _copyToClipboard = () => {
//     Clipboard.setString(this.state.image);
//     alert("Copied image URL to clipboard");
//   };

//   _takePhoto = async () => {
//     let pickerResult = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//     });

//     this._handleImagePicked(pickerResult);
//   };

//   _pickImage = async () => {
//     let pickerResult = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//     });

//     this._handleImagePicked(pickerResult);
//   };

//   _handleImagePicked = async (pickerResult) => {
//     try {
//       this.setState({ uploading: true });

//       if (!pickerResult.cancelled) {
//         uploadUrl = await uploadImageAsync(pickerResult.uri);
//         this.setState({ image: uploadUrl });
//       }
//     } catch (e) {
//       console.log(e);
//       alert("Upload failed, sorry :(");
//     } finally {
//       this.setState({ uploading: false });
//     }
//   };
// }

// async function uploadImageAsync(uri) {
//   // Why are we using XMLHttpRequest? See:
//   // https://github.com/expo/expo/issues/2402#issuecomment-443726662
//   const blob = await new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//       resolve(xhr.response);
//     };
//     xhr.onerror = function (e) {
//       console.log(e);
//       reject(new TypeError("Network request failed"));
//     };
//     xhr.responseType = "blob";
//     xhr.open("GET", uri, true);
//     xhr.send(null);
//   });

//   const ref = firebase.storage().ref().child(uuid.v4());
//   const snapshot = await ref.put(blob);

//   // We're done with the blob, close and release it
//   blob.close();

//   return await snapshot.ref.getDownloadURL();
// }












// // import React, { Component } from "react";
// // import { View, Text, TouchableOpacity } from "react-native";
// // import * as Permissions from 'expo-permissions';
// // import { Camera, MediaLibrary } from "expo";

// // class MyCam extends Component {
// //   state = {
// //     video: null,
// //     picture: null,
// //     recording: false
// //   };

// //   _saveVideo = async () => {
// //     const { video } = this.state;
// //     const asset = await MediaLibrary.createAssetAsync(video.uri);
// //     if (asset) {
// //       this.setState({ video: null });
// //     }
// //   };

// //   _StopRecord = async () => {
// //     this.setState({ recording: false }, () => {
// //       this.cam.stopRecording();
// //     });
// //   };

// //   _StartRecord = async () => {
// //     if (this.cam) {
// //       this.setState({ recording: true }, async () => {
// //         const video = await this.cam.recordAsync();
// //         this.setState({ video });
// //       });
// //     }
// //   };

// //   toogleRecord = () => {
// //     const { recording } = this.state;

// //     if (recording) {
// //       this._StopRecord();
// //     } else {
// //       this._StartRecord();
// //     }
// //   };

// //   render() {
// //     const { recording, video } = this.state;
// //     return (
// //       <Camera
// //         ref={cam => (this.cam = cam)}
// //         style={{
// //           justifyContent: "flex-end",
// //           alignItems: "center",
// //           flex: 1,
// //           width: "100%"
// //         }}
// //       >
// //         {video && (
// //           <TouchableOpacity
// //             onPress={this._saveVideo}
// //             style={{
// //               padding: 20,
// //               width: "100%",
// //               backgroundColor: "#fff"
// //             }}
// //           >
// //             <Text style={{ textAlign: "center" }}>save</Text>
// //           </TouchableOpacity>
// //         )}
// //         <TouchableOpacity
// //           onPress={this.toogleRecord}
// //           style={{
// //             padding: 20,
// //             width: "100%",
// //             backgroundColor: recording ? "#ef4f84" : "#4fef97"
// //           }}
// //         >
// //           <Text style={{ textAlign: "center" }}>
// //             {recording ? "Stop" : "Record"}
// //           </Text>
// //         </TouchableOpacity>
// //       </Camera>
// //     );
// //   }
// // }

// // class RecVideo extends Component {
// //   state = {
// //     showCamera: false
// //   };

// //   _showCamera = async () => {
// //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

// //     if (status === "granted") {
// //       this.setState({ showCamera: true });
// //     }
// //   };

// //   render() {
// //     const { showCamera } = this.state;
// //     return (
// //       <View
// //         style={{
// //           justifyContent: "center",
// //           alignItems: "center",
// //           flex: 1,
// //           width: "100%"
// //         }}
// //       >
// //         {showCamera ? (
// //           <MyCam />
// //         ) : (
// //           <TouchableOpacity onPress={this._showCamera}>
// //             <Text> Show Camera </Text>
// //           </TouchableOpacity>
// //         )}
// //       </View>
// //     );
// //   }
// // }

// // export default RecVideo;