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

import {StackNavigator} from 'react-navigation';
import Button from 'apsl-react-native-button';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CheckBox from 'react-native-checkbox';
import InputScrollView from 'react-native-input-scroll-view';

import NetUtils from '../PublicComponents/NetUtils';
import ScreenUtils from '../PublicComponents/ScreenUtils';

var dismissKeyboard = require('dismissKeyboard');

const { StatusBarManager } = NativeModules;

type Props = {};
export default class registerView extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = { 
      headerTitle: '',
      numberTextInput: '', //手机号输入框value
      verificationCode: '', //验证码输入框value
      VCodeBtnHidden: false,  //验证码按钮是否不可见
      VCodeBtnText: '获取验证码',
      checkbox: true,
      title: '',  //头部标题
      statusBarHeight: 0,
  };
  }

  componentDidMount() {
    this.setStatusBarHeight();
  }

  setStatusBarHeight(){
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

  _numberTextInputChange(number) {
    this.setState({numberTextInput: number});
    if (number.length == 11) {

    }
  }

  _vcodeTextInputChange(vcode) {
    this.setState({verificationCode: vcode});
    if (vcode.length == 4) {
      dismissKeyboard()
    }
  }

  _getCodeBtn() {
    dismissKeyboard();
    if (this.numberTextInput != '' && this.state.numberTextInput.length == 11 && this._checkPhoneNum(this.state.numberTextInput)) {
      let params = "?mobile=" + this.state.numberTextInput
      NetUtils.get('login/hadMobile', params, (result) => {
          if (result) {
            if (this.state.VCodeBtnText = '获取验证码') {
              this.setState({VCodeBtnText:60});
              this.setState({VCodeBtnHidden:true});
              let params = "?mobile=" + this.state.numberTextInput+'&type=B';
              NetUtils.get('login/getSmsCode', params, (result) => {
                  Alert.alert('提示',result);
              });
            }
            this.timer = setInterval(
              () => {
                this.setState({VCodeBtnText:this.state.VCodeBtnText-1});

                if (this.state.VCodeBtnText == 0) {
                  this.timer && clearTimeout(this.timer);
                  this.setState({VCodeBtnText:'获取验证码'});
                  this.setState({VCodeBtnHidden:false});
                }
               },
              1000
            );
          }else{
            Alert.alert('提示','此手机尚未注册会员，请先注册！')
          }
      });
    }else{
      Alert.alert('提示','请输入正确的手机号');
    }
  }

  _checkBoxBtn(checked) {
    if (this.state.checkbox == false) {
      this.setState({checkbox:true});
    }else{
      this.setState({checkbox:false});
    }
  }

  _checkPhoneNum(value){
     var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(value)) {
          return false;
      } else {
          return true;
      }
  }

  _agreementBtn(navigate,params) {
    navigate('agreement',{headerTitle:'协议内容',backview:'register',backtitle:params.headerTitle});
  }

  _nextBtn(navigate,params) {
    dismissKeyboard();
    if(this.state.numberTextInput.length < 11 && this.state.verificationCode.length == 4){
      Alert.alert('提示','手机号不能少于11位');
    }
    if (this.state.numberTextInput.length == 11 && this.state.verificationCode.length < 4) {
      Alert.alert('提示','验证码不能少于6位');
    }
    if (this.state.numberTextInput.length < 11 && this.state.verificationCode.length < 4) {
      Alert.alert('提示','手机号不能少于11位，且验证码不能少于6位');
    }
    if (this.state.numberTextInput.length == 11 && this.state.verificationCode.length == 4) {
      if (this.state.checkbox == true) {
          let a = this._checkPhoneNum(this.state.numberTextInput);
          if (a) {
            if(params.key == '注册'){
              let str = "?type=B&mobile=" + this.state.numberTextInput + '&smsCode=' + this.state.verificationCode;
              // 发送请求
              NetUtils.get('validateSmsCode', str, (result) => {
                navigate('setPass',{headerTitle:'设置密码',nextBtnText:'注册',phoneNum:this.state.numberTextInput,vcode:this.state.verificationCode});
              });
            }else{
              let str = "?type=B&mobile=" + this.state.numberTextInput + '&smsCode=' + this.state.verificationCode;
              // 发送请求
              NetUtils.get('validateSmsCode', str, (result) => {
                navigate('setPass',{headerTitle:'设置密码',nextBtnText:'重置密码',phoneNum:this.state.numberTextInput,vcode:this.state.verificationCode});
              });
            }
          }else{
            Alert.alert('提示','请输入正确的手机号');
          }
      }else{
          Alert.alert('提示','请同意用户协议');
      }
    }
  }

  _backBtn(goBack){
    goBack();
  }

  getFocus(){
    var comment = this.refs.comment;
    comment.focus();  
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
          <Text style={{fontSize:ScreenUtils.setSpText(15),fontWeight:'500',left:ScreenUtils.scaleSize(50)}}>手机号登录</Text>
          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(60)}}></View>
          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(200),alignItems:'center'}}>
            <View style={styles.numberView}>
              <TextInput
                keyboardType='numeric'
                placeholder='请输入手机号'
                placeholderTextColor='gray'
                maxLength={11}
                autoCorrect={false}
                style={{color:'black',fontSize:ScreenUtils.setSpText(9),padding:0,width:ScreenUtils.scaleSize(480),left:ScreenUtils.scaleSize(20)}}
                onChangeText={(numberTextInput) => this._numberTextInputChange(numberTextInput)}
                value={this.state.numberTextInput}
                underlineColorAndroid='transparent'
              />
              <Button onPress={() => this._getCodeBtn()} isDisabled={this.state.VCodeBtnHidden} disabledStyle={styles.VCodeBtnHidden} style={{left:ScreenUtils.scaleSize(12),top:ScreenUtils.scaleSize(25),width:ScreenUtils.scaleSize(150),borderRadius:0,height:ScreenUtils.scaleSize(50),borderWidth:1,borderColor:'#F3A50E',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:this.state.VCodeBtnHidden?'gray':'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>{this.state.VCodeBtnText}</Text>
              </Button>
            </View>

            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(30)}}></View>

            <View style={{width:ScreenUtils.scaleSize(638),flexDirection:'row'}}>
              <TouchableOpacity onPress={() => this.getFocus()} style={{width:ScreenUtils.scaleSize(638),flexDirection:'row'}}>
                <View style={{width:ScreenUtils.scaleSize(135),justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenUtils.setSpText(10),color:'black'}}>{this.state.verificationCode.slice(0,1)}</Text>
                </View>
                <View style={{width:ScreenUtils.scaleSize(32)}}></View>
                <View style={{width:ScreenUtils.scaleSize(135),justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenUtils.setSpText(10),color:'black'}}>{this.state.verificationCode.slice(1,2)}</Text>
                </View>
                <View style={{width:ScreenUtils.scaleSize(32)}}></View>
                <View style={{width:ScreenUtils.scaleSize(135),justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenUtils.setSpText(10),color:'black'}}>{this.state.verificationCode.slice(2,3)}</Text>
                </View>
                <View style={{width:ScreenUtils.scaleSize(32)}}></View>
                <View style={{width:ScreenUtils.scaleSize(135),justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenUtils.setSpText(10),color:'black'}}>{this.state.verificationCode.slice(3,4)}</Text>
                </View>
              </TouchableOpacity>
              <TextInput
                keyboardType='numeric'
                placeholderTextColor='gray'
                maxLength={4}
                caretHidden={true}
                autoCorrect={false}
                ref = 'comment'
                autoFocus={this.state.isAutoFocus}
                style={{color:'black',left:ScreenUtils.scaleSize(1080),fontSize:ScreenUtils.setSpText(10),padding:0,width:ScreenUtils.scaleSize(638)}}
                value={this.state.verificationCode}
                onChangeText={(verificationCode) => this._vcodeTextInputChange(verificationCode)}
                underlineColorAndroid='transparent'
              />
           </View>
          </View>

          <View style={{left:ScreenUtils.scaleSize(56),width:ScreenUtils.scaleSize(638),flexDirection:'row'}}>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
              <View style={{width:ScreenUtils.scaleSize(32)}}></View>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
              <View style={{width:ScreenUtils.scaleSize(32)}}></View>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
              <View style={{width:ScreenUtils.scaleSize(32)}}></View>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
            </View>

         <Button style={styles.nextBtn} onPress={() => this._nextBtn(navigate,params)}>
          <View style={styles.loginBtnView}>
            <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(9)}}>下一步</Text>
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
  },
  verificationCodeView: {
    flexDirection: 'row',
    width: ScreenUtils.scaleSize(650),
    height: ScreenUtils.scaleSize(100),
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
    top: ScreenUtils.scaleSize(220),
    height: ScreenUtils.scaleSize(96),
    width: ScreenUtils.scaleSize(641),
    backgroundColor: '#F3A50E',
    borderWidth: 0,
    borderRadius: ScreenUtils.scaleSize(50),
  },
});
