import React, { Component } from 'react';
import {
  Platform,
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {StackNavigator} from 'react-navigation';

var Dimensions = require('Dimensions');
var screenW = Dimensions.get('window').width;
var screenH = Dimensions.get('window').height;

var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
    businessIcon:'',
  }
};

export default class shopExamine extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '审核列表',
      nextStepValue: '', 
      numberTextInput: '', //手机号输入框value
      verificationCode: '', //验证码输入框value
      businessIcon: '',
      businessType: '请选择分类',
  };
  }

  _chooseImage(){
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }


    _businessNameTextInputChangeText(value){

    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(50)}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(50)}}>
                      <TouchableOpacity style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50)}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36),left:ScreenUtils.scaleSize(39)}} source={require('./images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'center',width:ScreenUtils.scaleSize(200)}}>商店头像</Text>
                      <TouchableOpacity style={{width:ScreenUtils.scaleSize(550),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(475),color:'gray',fontSize:ScreenUtils.setSpText(8),textAlign:'right'}}>王小明牛扒店</Text>
                      </TouchableOpacity>
                    </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    wechatLogin: {
        backgroundColor:'red',
        width: ScreenUtils.scaleSize(208),
        height: ScreenUtils.scaleSize(208),
        left: ScreenUtils.scaleSize(271),
    },
    wechatLoginImg: {
        width: ScreenUtils.scaleSize(208),
        height: ScreenUtils.scaleSize(208),
    },
    loginBtn: {
        width: ScreenUtils.scaleSize(750),
        height: ScreenUtils.scaleSize(92),
        backgroundColor: '#F3A50E',
        borderWidth: 0,
        borderColor:'transparent',
        borderRadius: ScreenUtils.scaleSize(1334)/60,
      },
});