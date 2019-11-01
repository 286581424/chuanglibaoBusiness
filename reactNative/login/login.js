/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
  InteractionManager,
  Alert,
  StatusBar,
  BackAndroid,
  NativeModules,
  Modal,
  DeviceEventEmitter,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import registerView from './register';
import setPass from './setPass';
import agreement from './Agreement';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import NetUtils from '../PublicComponents/NetUtils';
import DeviceInfo from 'react-native-device-info';
import homepage from '../index/homes';
import openShop from './openShop';
import shopInfo from './shopInfo';
import shopExamine from './shopExamine';
import shopKeyword from '../index/personalCenter/shopKeyword';
import shopPhoneNum from '../index/personalCenter/shopPhoneNum';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import province from '../PublicComponents/province'
import city from '../PublicComponents/city'
import area from '../PublicComponents/area'
import townOrStreet from '../PublicComponents/townOrStreet'
import registerBusinessQualification from '../login/registerBusinessQualification';
import businessTime from '../index/personalCenter/businessTime';
import JPushModule from 'jpush-react-native';
import firstView from './firstView'

const { StatusBarManager } = NativeModules;

var dismissKeyboard = require('dismissKeyboard');

type Props = {};
class login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '登录',
      nextStepValue: '', 
      numberTextInput: '', //手机号输入框value
      verificationCode: '', //验证码输入框value
      password: '',  //密码输入框
      loginTitleType: '1',  //0是快速登录 1是密码登录
      isDisabled: true, //登录按钮是否不可点
      passwordHidden: true,  //密码输入框密码是否不可见 默认true不可见
      VCodeBtnHidden: false,  //验证码按钮是否不可见
      VCodeBtnText: '获取验证码',
      tokenId: [],
      statusBarHeight: 0,
      loadingShow: false,
      registrationId: '',
  };
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  _setLoadingShow(){
    let show = this.state.loadingShow;
    this.setState({loadingShow:!show});
  }

  onBackAndroid = () => {
    // if (!this.onMainScreen()) {
    //     this.goBack();
        return true;
    // }
    // return false;
  };

  componentDidMount() {
    this.loadToken();
    this.setStatusBarHeight();
    JPushModule.getRegistrationID(registrationId => {
      this.setState({registrationId:registrationId})
    })
  }

  setStatusBarHeight(){
    let height = 0;
    if (Platform.OS === 'android') {
      height = StatusBar.currentHeight * 2;
      this.setState({statusBarHeight:height});
    }else{
      StatusBarManager.getHeight((statusBarHeight)=>{
        height = statusBarHeight.height * 2;
        this.setState({statusBarHeight:height});
      })
    }
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillReceiveProps(){
    this.setState({numberTextInput:''});
    this.setState({verificationCode:''});
    this.setState({password:''});
  }

  _fastLoginChange(obj) {
    this.setState({loginTitleType:obj.i});
     if (obj.i == '0') {
      if (this.state.numberTextInput != '' && this.state.verificationCode != '') {
        this.setState({isDisabled:false});
      }else{
        this.setState({isDisabled:true});
      }
    }else{
      if (this.state.numberTextInput != '' && this.state.password != '') {
        this.setState({isDisabled:false});
      }else{
        this.setState({isDisabled:true});
      }
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

  _numberTextInputChangeText(number) {
    this.setState({numberTextInput: number});
    if (this.state.loginTitleType == '0') {
      if (number != '' && this.state.verificationCode != '') {
        this.setState({isDisabled: false});
      }else{
        this.setState({isDisabled: true});
      }
    }
    if (this.state.loginTitleType == '1') {
      if (number != '' && this.state.password != '') {
        this.setState({isDisabled: false});
      }else{
        this.setState({isDisabled: true});
      }
    }
  }

  _VCodeBtnTextInputChangeText(vcode) {
    this.setState({verificationCode: vcode});
    if (vcode.length == 4) {
      dismissKeyboard()
    }
  }

  _passwordTextInputChangeText(password) {
    this.setState({password: password});
    if (this.state.loginTitleType == '1') {
      if (this.state.numberTextInput != '' && password != '') {
        this.setState({isDisabled: false});
      }else{
        this.setState({isDisabled: true});
      }
    }
  }

  _numberTextInputChange(password) {
    // this.setState({numberTextInput:password});
    if (this.state.loginTitleType = '0') {
      if (this.state.numberTextInput != '' && this.state.verificationCode != '') {
        this.setState({isDisabled:false});
      }else{
        this.setState({isDisabled:true});
      }
    }else{
      if (this.state.numberTextInput != '' && this.state.password != '') {
        this.setState({isDisabled:false});
      }else{
        this.setState({isDisabled:true});
      }
    }
  }
  
  _getCodeBtn() {
    dismissKeyboard();
    if (this.numberTextInput != '' && this.state.numberTextInput.length == 11 && this._checkPhoneNum(this.state.numberTextInput)){
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
      Alert.alert('提示','请输入正确的手机号');
    }
  }

  _registerBtn(navigate) {
    dismissKeyboard();
    navigate('firstView');
  }

  _forgetPwdBtn(navigate) {
    navigate('register',{headerTitle:'忘记密码',key:'忘记密码'});
  }

  generatingToken(phoneNum){
    let tokenArr = [];
    tokenArr.push(phoneNum);
    let version = DeviceInfo.getSystemVersion();
    let phoneModel = DeviceInfo.getModel();
    let token = phoneNum+'&'+phoneModel+'&'+version;
    let tokenMD5 = NetUtils.MD5(token);
    tokenArr.push(tokenMD5);
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

  saveToken(arr){
    storage.save({
        key: 'token',  // 注意:请不要在key中使用_下划线符号!
        id: '1004',   // 注意:请不要在id中使用_下划线符号!
        data: arr,
        expires: null,
    });
  }

  savePhone(phoneNum){
    storage.save({
            key: 'phone',  // 注意:请不要在key中使用_下划线符号!
            id: '1005',   // 注意:请不要在id中使用_下划线符号!
            data: phoneNum,
            expires: null,
          });
  }

  saveIsTakeaway(key){
    storage.save({
            key: 'isTakeaway',  // 注意:请不要在key中使用_下划线符号!
            id: '1011',   // 注意:请不要在id中使用_下划线符号!
            data: key,
            expires: null,
          });
  }

  _loginBtn(navigate) {
    dismissKeyboard();
    if (this.state.loginTitleType == '1') {
      if(this.state.numberTextInput.length < 11 && this.state.verificationCode.length == 4){
        Alert.alert('提示','手机号不能少于11位');
      }
      if (this.state.numberTextInput.length == 11 && this.state.verificationCode.length < 4) {
        Alert.alert('提示','验证码不能少于4位');
      }
      if (this.state.numberTextInput.length < 11 && this.state.verificationCode.length < 4) {
        Alert.alert('提示','手机号不能少于11位，且验证码不能少于4位');
      }
      if (this.state.numberTextInput.length == 11 && this.state.verificationCode.length == 4) {
          let tokenArray = [];
          let token = '';
          let phone = '';
          if(this.state.tokenId == '' || this.state.tokenId == null){
              tokenArray = this.generatingToken(this.state.numberTextInput);
              token = tokenArray[1];
              phone = tokenArray[0];
          }else{
              phone = this.state.tokenId[0];
              if (phone != this.state.numberTextInput) {
                tokenArray = this.generatingToken(this.state.numberTextInput);
                token = tokenArray[1];
                phone = tokenArray[0];
              }else{
                token = this.state.tokenId[1];
                phone = this.state.tokenId[0];
              }
          }
        let params = "?deviceType=a&type=B&mobile=" + this.state.numberTextInput + '&smsCode=' + this.state.verificationCode + '&token=' + token;
        // 发送请求
        NetUtils.get('login/loginBySmsCode', params, (result) => {
            this._setLoadingShow();
            this.JPushRegistration(result.token)
            this.savePhone(this.state.numberTextInput);
            let arr = []
            arr.push(phone)
            arr.push(result.token)
            this.saveToken(arr)
            this._getBusinessInfo(phone,result.token,navigate);
        });
      }
    }else{
      if(this.state.numberTextInput.length < 11 && this.state.password.length == 6){
        Alert.alert('提示','手机号不能少于11位');
      }
      if (this.state.numberTextInput.length == 11 && this.state.password.length <6) {
        Alert.alert('提示','密码不能少于6位');
      }
      if (this.state.numberTextInput.length < 11 && this.state.password.length < 6) {
        Alert.alert('提示','手机号不能少于11位，且密码不能少于6位');
      }
      if (this.state.numberTextInput.length == 11 && this.state.password.length >= 6) {
          let tokenArray = [];
          let token = '';
          let phone = '';
          if(this.state.tokenId == '' || this.state.tokenId == null){
              tokenArray = this.generatingToken(this.state.numberTextInput);
              token = tokenArray[1];
              phone = tokenArray[0];
          }else{
              phone = this.state.tokenId[0];
              if (phone != this.state.numberTextInput) {
                tokenArray = this.generatingToken(this.state.numberTextInput);
                token = tokenArray[1];
                phone = tokenArray[0];
              }else{
                token = this.state.tokenId[1];
                phone = this.state.tokenId[0];
              }
          }
        let params = "?deviceType=a&type=B&mobile=" + this.state.numberTextInput + '&password=' + this.state.password + '&token=' + token;
        // 发送请求
        NetUtils.get('login/loginByPwd', params, (result) => {
            this._setLoadingShow();
            this.JPushRegistration(result.token)
            let arr = []
            arr.push(phone)
            arr.push(result.token)
            this.saveToken(arr)
            this.savePhone(this.state.numberTextInput);
            this._getBusinessInfo(phone,result.token,navigate);
        });
      }
    }
  }

  JPushRegistration(token){
    let formData = new FormData();
    formData.append('token',token);
    formData.append('rid',this.state.registrationId);
    formData.append('alias',this.state.numberTextInput);
    NetUtils.post('business/saveJiGuangPushInfo', formData, (result) => {
    });
  }

  saveOperateType(value){
    storage.save({
            key: 'operateType',  // 注意:请不要在key中使用_下划线符号!
            id: '1006',   // 注意:请不要在id中使用_下划线符号!
            data: value,
            expires: null,
          });
  }

  saveBusinessID(value){
    storage.save({
            key: 'id',  // 注意:请不要在key中使用_下划线符号!
            id: '1007',   // 注意:请不要在id中使用_下划线符号!
            data: value.toString(),
            expires: null,
          });
  }

  _getBusinessInfo(phone,token,navigate){
    setTimeout(() => {
        let params = "?user_type=B&mobile=" + phone+'&token=' + token;
        NetUtils.get('business/getUserBusinessInfoByBusiness', params, (result) => {
            let operate_type = 2  //商品券类型
            if(result.userBusinessInfo.operate_type==1 || result.userBusinessInfo.operate_type==6){
               operate_type = 1  //实体商品类型
            }
            if (result.userBusinessInfo.operate_type == 6) {
              this.saveIsTakeaway('true')
            }else{
              this.saveIsTakeaway('false')
            }
            this.timer && clearTimeout(this.timer);
            this.setState({VCodeBtnText:'获取验证码'});
            this.saveOperateType(operate_type);
            this.saveBusinessID(result.userBusinessInfo.id);
            navigate('homepage',{key:'homepage'});
            DeviceEventEmitter.emit('personalCenterListener','')
            this._setLoadingShow();
        });
    },300);
  }

  getFocus(){
    var comment = this.refs.comment;
    comment.focus();  
  }

  _gotoAgreement(navigate){
    // navigate('agreement')
  }

  render() {
    const { navigate } = this.props.navigation;  

    return (
      <View style={styles.mainView}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>
          <KeyboardAwareScrollView>
          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'transparent'}}></View>

            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(135)}}></View>

            <View style={{width:ScreenUtils.scaleSize(750),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(419),height:ScreenUtils.scaleSize(127)}} source={require('./images/login_bg.png')}/>
            </View>
            
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(165)}}></View>

          <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(60),flexDirection:'row',left:ScreenUtils.scaleSize(61)}}>
            <TouchableOpacity onPress={() => this.setState({loginTitleType:1,verificationCode:'',isDisabled:true})} style={{width:ScreenUtils.scaleSize(300),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:this.state.loginTitleType==1?ScreenUtils.setSpText(18):ScreenUtils.setSpText(9),fontWeight:'bold',color:this.state.loginTitleType==1?'#fea712':'#989898'}}>手机号登录</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({loginTitleType:0,password:'',isDisabled:true})} style={{width:ScreenUtils.scaleSize(300),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:this.state.loginTitleType==0?ScreenUtils.setSpText(18):ScreenUtils.setSpText(9),fontWeight:'bold',color:this.state.loginTitleType==0?'#fea712':'#989898'}}>密码登录</Text>
            </TouchableOpacity>
          </View>

          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(79)}}></View>
            <View style={{flexDirection:'row',height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'center',width:ScreenUtils.scaleSize(638),left:ScreenUtils.scaleSize(56)}}>
              <TextInput
                        keyboardType='numeric'
                        placeholder='请输入您的账号'
                        placeholderTextColor='gray'
                        maxLength={11}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(24),fontSize:ScreenUtils.setSpText(10),padding:0,width:ScreenUtils.scaleSize(470)}}
                        onChangeText={(numberTextInput) => this._numberTextInputChangeText(numberTextInput)}
                        value={this.state.numberTextInput}
                        underlineColorAndroid='transparent'
                      />
                {this.state.loginTitleType == 1?<TouchableOpacity onPress={() => this._getCodeBtn()} style={{width:ScreenUtils.scaleSize(148),height:ScreenUtils.scaleSize(60),borderColor:'#989898',borderWidth:1,borderRadius:ScreenUtils.scaleSize(7),justifyContent:'center',alignItems:'center'}}>
                  <Text style={{fontSize:ScreenUtils.setSpText(7),fontWeight:'bold',color:'#fea712'}}>{this.state.VCodeBtnText}</Text>
                </TouchableOpacity>:<View style={{width:ScreenUtils.scaleSize(148)}}></View>}
            </View>
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(34)}}></View>
            <View style={{left:ScreenUtils.scaleSize(56),width:ScreenUtils.scaleSize(638),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb'}}></View>

            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(64)}}></View>

            {this.state.loginTitleType == 0?<TextInput
                        placeholder='请输入您的密码'
                        placeholderTextColor='gray'
                        maxLength={16}
                        autoCorrect={false}
                        secureTextEntry={this.state.passwordHidden}
                        style={{color:'black',left:ScreenUtils.scaleSize(80),fontSize:ScreenUtils.setSpText(10),padding:0,width:ScreenUtils.scaleSize(500)}}
                        onChangeText={(password) => this._passwordTextInputChangeText(password)}
                        value={this.state.password}
                        underlineColorAndroid='transparent'
                      />:<View style={{width:ScreenUtils.scaleSize(638),left:ScreenUtils.scaleSize(56),flexDirection:'row'}}>
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
                              onChangeText={(verificationCode) => this._VCodeBtnTextInputChangeText(verificationCode)}
                              underlineColorAndroid='transparent'
                            />
                      </View>}
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(34)}}></View>
            {this.state.loginTitleType == 0?<View style={{left:ScreenUtils.scaleSize(56),width:ScreenUtils.scaleSize(638),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb'}}></View>:<View style={{left:ScreenUtils.scaleSize(56),width:ScreenUtils.scaleSize(638),flexDirection:'row'}}>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
              <View style={{width:ScreenUtils.scaleSize(32)}}></View>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
              <View style={{width:ScreenUtils.scaleSize(32)}}></View>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
              <View style={{width:ScreenUtils.scaleSize(32)}}></View>
              <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(2),backgroundColor:'#cbcbcb',justifyContent:'center',alignItems:'center'}}></View>
            </View>}

            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80)}}></View>

            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(96),flexDirection:'row',justifyContent:'center'}}>
              <TouchableOpacity onPress={() => this._registerBtn(navigate)} style={{width:ScreenUtils.scaleSize(320),height:ScreenUtils.scaleSize(96),backgroundColor:'red',justifyContent:'center',alignItems:'center',borderTopLeftRadius:ScreenUtils.scaleSize(50),borderBottomLeftRadius:ScreenUtils.scaleSize(50)}}>
                <Text style={{fontSize:ScreenUtils.setSpText(10),color:'white'}}>开店</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._loginBtn(navigate)} style={{width:ScreenUtils.scaleSize(320),height:ScreenUtils.scaleSize(96),borderWidth:1.2,borderColor:'red',backgroundColor:'transparent',justifyContent:'center',alignItems:'center',borderTopRightRadius:ScreenUtils.scaleSize(50),borderBottomRightRadius:ScreenUtils.scaleSize(50),borderLeftColor:'transparent'}}>
                <Text style={{fontSize:ScreenUtils.setSpText(10),color:'#e60012'}}>登录</Text>
              </TouchableOpacity>
            </View>

            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(59)}}></View>

            <View style={{width:ScreenUtils.scaleSize(750),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#000000'}}>登录即代表同意</Text>
              <Text onPress={() => this._gotoAgreement(navigate)} style={{fontSize:ScreenUtils.setSpText(8),color:'#027bff'}}>《团美家服条款》</Text>
            </View>

            </KeyboardAwareScrollView>

            <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.loadingShow}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'center'}}>
                          <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>正在登录...</Text>
                       </View>
                    </Modal>

      </View>
    );
  }
}

const index = StackNavigator({  
    login: {
      screen: login,
      navigationOptions:{
        header: null,
      }
    },  
    register:{
      screen:registerView,
      navigationOptions:{
        header: null,
      }
    },  
    setPass: {
      screen: setPass,
      navigationOptions:{
        header: null,
      }
    },
    openShop: {
      screen: openShop,
      navigationOptions:{
        header: null,
      }
    },
    firstView: {
      screen: firstView,
      navigationOptions:{
        header: null,
      }
    },
    agreement: {
      screen: agreement,
      navigationOptions:{
        header: null,
      }
    },
    shopInfo: {
      screen: shopInfo,
      navigationOptions:{
        header: null,
      }
    },
    shopExamine: {
      screen: shopExamine,
      navigationOptions:{
        header: null,
      }
    },
    province: {
      screen: province,
      navigationOptions:{
        header: null,
      }
    },
    city: {
      screen: city,
      navigationOptions:{
        header: null,
      }
    },
    area: {
      screen: area,
      navigationOptions:{
        header: null,
      }
    },
    townOrStreet: {
      screen: townOrStreet,
      navigationOptions:{
        header: null,
      }
    },
    registerBusinessQualification: {
      screen: registerBusinessQualification,
      navigationOptions:{
        header: null,
      }
    },
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    }
  }
); 
export default index; 

const styles = StyleSheet.create({
  mainView: {
    backgroundColor:'white',
    flex:1,
  },
  headerStyle: {
    shadowOpacity: 0,
    elevation: 0,
  },
  wechatLogin: {
    width: ScreenUtils.scaleSize(208),
    height: ScreenUtils.scaleSize(208),
    left: ScreenUtils.scaleSize(271),
  },
  wechatLoginImg: {
    width: ScreenUtils.scaleSize(208),
    height: ScreenUtils.scaleSize(208),
  },
  phoneLogin: {
    backgroundColor: '#459AD0'
  },
  scrollableTabview: {
    top: ScreenUtils.scaleSize(7),
    width: ScreenUtils.scaleSize(685),
    height: ScreenUtils.scaleSize(390),
  },
  tabView: {
    width: ScreenUtils.scaleSize(690),
    height: ScreenUtils.scaleSize(292),  
  },
  card: {
  },
  underline: {
    borderColor: 'red',
    backgroundColor: '#F3A50E',
  },
  phoneImg: {
    width: ScreenUtils.scaleSize(30),
    height: ScreenUtils.scaleSize(30),
    left: ScreenUtils.scaleSize(32),
    top: ScreenUtils.scaleSize(28),
  },
  numberView: {
    width: ScreenUtils.scaleSize(750),
    height: ScreenUtils.scaleSize(100),
    backgroundColor:'white',
    flexDirection: 'row',
  },
  passwordView: {
    flexDirection: 'row',
    width: ScreenUtils.scaleSize(690),
    height: ScreenUtils.scaleSize(98),
  },
  numberTextInput: {
    flex: 1,
    left: ScreenUtils.scaleSize(50),
    fontSize: ScreenUtils.setSpText(9),
    padding: 0,
  },
  verificationCodeView: {
    flexDirection: 'row',
    width: ScreenUtils.scaleSize(750),
    height: ScreenUtils.scaleSize(100),
    backgroundColor:'white'
  },
  pwdTextInput: {
    flex: 1,
    left: ScreenUtils.scaleSize(50),
    fontSize: ScreenUtils.setSpText(9),
    padding: 0,
  },
  verificationCodeTextInput: {
    flex: 1,
    left: ScreenUtils.scaleSize(50),
    fontSize: ScreenUtils.setSpText(9),
    padding: 0,
  },
  loginBtn: {
    left:ScreenUtils.scaleSize(19),
    top:ScreenUtils.scaleSize(40),
    width: ScreenUtils.scaleSize(712),
    height: ScreenUtils.scaleSize(88),
    borderWidth:0,
    backgroundColor: '#F3A50E',
  },
  disabledBtn: {
    backgroundColor: '#F3A50E',
  },
  getCodeBtn: {
    width:ScreenUtils.scaleSize(165),
    height: ScreenUtils.scaleSize(48),
    top: ScreenUtils.scaleSize(25),
    right: ScreenUtils.scaleSize(33),
    borderColor: '#F3A50E',
  },
  VCodeBtnHidden: {
    borderColor: '#787878',
  },
  registerView: {
    flexDirection: 'row',
    width: ScreenUtils.scaleSize(689),
    height: ScreenUtils.scaleSize(96),
    left:ScreenUtils.scaleSize(30),
    top: ScreenUtils.scaleSize(170),
  },
  registerBtn: {
    borderColor: 'white',
    width: ScreenUtils.scaleSize(100),
    height: ScreenUtils.scaleSize(60),
    top: ScreenUtils.scaleSize(18),
    left: ScreenUtils.scaleSize(2),
  },
  forgetPwdBtn: {
    left: ScreenUtils.scaleSize(275),
    width: ScreenUtils.scaleSize(200),
    height: ScreenUtils.scaleSize(60),
    borderWidth:0,
    top: ScreenUtils.scaleSize(68),
  },
});
