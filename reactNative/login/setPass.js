/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  InteractionManager,
  Alert,
  StatusBar,
  NativeModules,
} from 'react-native';

import {StackNavigator} from 'react-navigation'
import Button from 'apsl-react-native-button'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CheckBox from 'react-native-checkbox'
import DeviceInfo from 'react-native-device-info';
import NetUtils from '../PublicComponents/NetUtils';
import ScreenUtils from '../PublicComponents/ScreenUtils';

var dismissKeyboard = require('dismissKeyboard');

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      passwordTextInput: '', //密码输入框value
      passwordAgainTextInput: '', //确认输入框value
      VCodeBtnHidden: false,  //验证码按钮是否不可见
      VCodeBtnText: '获取验证码',
      checkbox: false,
      passwordHidden:true,
      tokenId : [],   //用户信息:手机号（微信登录:openID），手机信息（手机系统版本，手机型号)
  };
  }

  componentDidMount() {
    this.loadToken();
    this.setStatusBarHeight();
  }

  setStatusBarHeight(){
    const { StatusBarManager } = NativeModules;
    let height = 0;
    if (Platform.OS === 'android') {
      height = StatusBar.currentHeight * 2;
      this.setState({statusBarHeight:height});
    }else{
      StatusBarManager.getHeight((statusBarHeight)=>{
        if (statusBarHeight.height == '20') {
          height = 40;
        }else{
          height = 80;
        }
        this.setState({statusBarHeight:height});
      })
    }
  }

  componentWillUnmount() {
    // 请注意Un"m"ount的m是小写

    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
  }

  _passwordTextInput(password) {
    this.setState({passwordTextInput: password});
  }

  _passwordAgainTextInput(passwordAgain){
    this.setState({passwordAgainTextInput: passwordAgain});
  }

    _agreementBtn(navigate,params) {
    navigate('agreement',{headerTitle:'协议内容',backview:'setPass',backtitle:params.headerTitle});
  }

    _checkBoxBtn(checked) {
    if (this.state.checkbox == false) {
      this.setState({checkbox:true});
    }else{
      this.setState({checkbox:false});
    }
  }

  generatingToken(phoneNum){
    let tokenArr = [];
    tokenArr.push(phoneNum);
    let version = DeviceInfo.getSystemVersion();
    let phoneModel = DeviceInfo.getModel();
    let token = phoneNum+'&'+phoneModel+'&'+version;
    let tokenMD5 = NetUtils.MD5(token);
    tokenArr.push(tokenMD5);
    storage.save({
            key: 'token',  // 注意:请不要在key中使用_下划线符号!
            id: '1004',   // 注意:请不要在id中使用_下划线符号!
            data: tokenArr,
            expires: null,
          });
    return tokenArr;
  }

  loadToken(){
    storage.load({
        key: 'token',
        id: '1004'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({tokenId:ret});
        // alert('aaa'+searchHistory[0]);
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        switch (err.name) {
            case 'NotFoundError':
                // TODO;
                break;
            case 'ExpiredError':
                // TODO
                break;
        }
      });
  }

  _checkPwd(value){
     var myreg=/^[a-zA-Z0-9]\w{5,16}$/;
      if (!myreg.test(value)) {
          return false;
      } else {
          return true;
      }
  }

  _nextBtn(navigate,params) {
          dismissKeyboard();
          if (this._checkPwd(this.state.passwordTextInput) && this._checkPwd(this.state.passwordAgainTextInput)) {
            if (this.state.passwordTextInput == this.state.passwordAgainTextInput) {
                 //发送请求
              let token = '';
              let phone = '';
              if(this.state.tokenId == '' || this.state.tokenId == null){
                  phone = this.generatingToken(params.phoneNum)[0];
                  token = this.generatingToken(params.phoneNum)[1];
              }else{
                  phone = this.state.tokenId[0];
                  if (phone != params.phoneNum) {
                    phone = this.generatingToken(params.phoneNum)[0];
                    token = this.generatingToken(params.phoneNum)[1];
                  }else{
                    token = this.state.tokenId[1];
                    phone = this.state.tokenId[0];
                  }
              }
              if (params.nextBtnText == '注册') {
                  navigate('openShop',{phone:phone,smsCode:params.vcode,password:this.state.passwordTextInput});
              }else{
                  let formData = new FormData();
                  formData.append('mobile',phone);
                  formData.append('smscode',params.vcode);
                  formData.append('newPwd',this.state.passwordTextInput);
                  formData.append('confirmPwd',this.state.passwordAgainTextInput);
                  NetUtils.post('business/forgetpwd',formData,(result) => {
                        Alert.alert('提示','重置密码成功！',[{text: '确认', onPress: () => navigate('login',{key:'success'})}]);
                  });
              }
            }else
            {
              Alert.alert('提示','两次密码不相等');
            }
          }else{
            Alert.alert('提示','密码输入不规范');
          }
  }

  _login(navigate) {
    navigate('login',{headerTitle:'登录'});
  }

  _backBtn(goBack){
    goBack();
  }

  render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
    return (
      <View style={styles.mainView}>

                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
          </View>

            <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
              <TouchableOpacity onPress={() => this._backBtn(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('./images/login_back.png')}/>
              </TouchableOpacity>
              <Text style={{color:'white',fontSize:ScreenUtils.setSpText(11),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{params.headerTitle}</Text>
            </View>

          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(265)}}></View>
          <Text style={{fontSize:ScreenUtils.setSpText(15),fontWeight:'500',left:ScreenUtils.scaleSize(50)}}>设置密码</Text>
          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(60)}}></View>

          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(200),alignItems:'center'}}>
            <View style={styles.numberView}>
              <TextInput
                placeholder='请输入您的密码'
                placeholderTextColor='gray'
                maxLength={16}
                autoCorrect={false}
                secureTextEntry={this.state.passwordHidden}
                style={styles.pwdTextInput}
                onChangeText={(passwordTextInput) => this._passwordTextInput(passwordTextInput)}
                value={this.state.passwordTextInput}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={styles.verificationCodeView}>
              <TextInput
                placeholder='请确认您的密码'
                placeholderTextColor='gray'
                maxLength={16}
                autoCorrect={false}
                secureTextEntry={this.state.passwordHidden}
                style={styles.pwdTextInput}
                onChangeText={(passwordAgainTextInput) => this._passwordAgainTextInput(passwordAgainTextInput)}
                value={this.state.passwordAgainTextInput}
                underlineColorAndroid='transparent'
              />
            </View>
          </View>

         <Button style={styles.nextBtn} onPress={() => this._nextBtn(navigate,params)}>
          <View style={styles.loginBtnView}>
            <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(10)}}>{params.nextBtnText}</Text>
          </View>
        </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor:'white',
    width: ScreenUtils.scaleSize(750),
    height: ScreenUtils.getHeight(),
  },
 loginView: {
    width: ScreenUtils.scaleSize(690),
    height: ScreenUtils.scaleSize(200),
    left:ScreenUtils.scaleSize(30),
    top: ScreenUtils.scaleSize(140),
    borderColor: '#F1F1F1',
    borderWidth: 1,
    borderRadius: ScreenUtils.scaleSize(1334)/60,
  },
  numberView: {
    width: ScreenUtils.scaleSize(650),
    height: ScreenUtils.scaleSize(100),
    borderBottomWidth:1,
    borderBottomColor:'#cbcbcb',
    backgroundColor:'white',
    flexDirection: 'row',
  },
  numberTextInput: {
    flex: 1,
    top: ScreenUtils.scaleSize(1),
    fontSize: ScreenUtils.setSpText(9),
    left: ScreenUtils.scaleSize(78),
    color:'black',
  },
  verificationCodeView: {
    flexDirection: 'row',
    width: ScreenUtils.scaleSize(650),
    height: ScreenUtils.scaleSize(100),
    borderBottomWidth:1,
    borderBottomColor:'#cbcbcb',
    backgroundColor:'white',
  },
  disabledBtn: {
    backgroundColor: '#787878',
  },
  getCodeBtn: {
    width:ScreenUtils.scaleSize(165),
    height: ScreenUtils.scaleSize(60),
    top: ScreenUtils.scaleSize(17),
    right: ScreenUtils.scaleSize(10),
    borderColor: '#F3A50E',
  },
  pwdTextInput: {
    flex: 1,
    fontSize: ScreenUtils.setSpText(9),
    padding: 0,
    color:'black',
  },
  VCodeBtnHidden: {
    borderColor: '#787878',
  },
  checkboxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    left: ScreenUtils.scaleSize(40),
    top: ScreenUtils.scaleSize(180),
    width: ScreenUtils.scaleSize(690),
    height: ScreenUtils.scaleSize(50),
  },
  checkboxText: {
    color: 'black',
    width: ScreenUtils.scaleSize(200),
    left: -ScreenUtils.scaleSize(11),
    height: ScreenUtils.scaleSize(40),
    textAlign: 'left',
    fontSize: ScreenUtils.setSpText(7),
  },
  nextBtn: {
    left: ScreenUtils.scaleSize(109/2),
    top: ScreenUtils.scaleSize(80),
    height: ScreenUtils.scaleSize(96),
    width: ScreenUtils.scaleSize(641),
    backgroundColor: '#F3A50E',
    borderWidth: 0,
    borderRadius: ScreenUtils.scaleSize(50),
  },
});
