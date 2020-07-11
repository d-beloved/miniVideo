import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { Icon } from 'react-native-elements';
import MyCam from "./Camera";

export default class RecVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCamera: false,
    };
  }

  _showCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { status2 } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (status === "granted") {
      this.setState({ showCamera: true });
    }
  };

  toggleShow = () => {
    this.setState(state => ({ showCamera: !state.showCamera }));
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
          <>
            <Icon
              name='times-circle'
              type='font-awesome'
              onPress={this.toggleShow}
              iconStyle={{
                marginTop: 30,
              }}
            />
            <MyCam />
          </>
        ) : (
          <TouchableOpacity
            onPress={this._showCamera}
            style={{ backgroundColor: "red", padding: 15, borderRadius: 50 }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {" "}
              Record video (max 15secs){" "}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
