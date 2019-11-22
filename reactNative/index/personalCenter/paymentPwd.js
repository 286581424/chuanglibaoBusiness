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
  Switch,
  FlatList,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import NetUtils from '../../PublicComponents/NetUtils';

var dismissKeyboard = require('dismissKeyboard');

export default class paymentPwd extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '修改支付密码',
      userImage: [],
      mobile: '',
      VCodeBtnText: '获取验证码',
      VCodeBtnHidden: false,
      paymentPwdTextInput: '',
      newPaymentPwdTextInput: '',
      newPaymentPwdTextInputAgain: '',
      statusBarHeight: 0,
      token: '',
      phone: '',
      mobileTextInput: '',
      vcodeTextInput: '',
  };
  }

  setStatusBarHeight(){
    const { StatusBarManager } = NativeModules;
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

  loadToken(){
    storage.load({
        key: 'token',
        id: '1004'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({token:ret});
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

  loadPhone(){
    storage.load({
        key: 'phone',
        id: '1005'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({phone:ret});
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadPhone();
    this.loadToken();
    const { params } = this.props.navigation.state;
    this.setState({mobileTextInput:params.mobile});
  }

  _getCodeBtn() {
    dismissKeyboard();
    if (this.state.VCodeBtnText = '获取验证码') {
      this.setState({VCodeBtnText:60});
      this.setState({VCodeBtnHidden:true});
      let params = "?type=B&mobile=" + this.state.mobileTextInput;
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
  }

  renderMoblie(){
    const { params } = this.props.navigation.state;
    let editable = true;
    if (params.mobile != '') {
      editable = false;
    }
    if (params.hasPayPassword == false) {
      return (
                <View>
                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'orange',alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        placeholder='请输入手机号'
                        placeholderTextColor='gray'
                        keyboardType='numeric'
                        maxLength={11}
                        autoCorrect={false}
                        editable={editable}
                        secureTextEntry={false}
                        style={{color:'black',width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(7),padding:0,}}
                        onChangeText={(mobileTextInput) => this._mobileTextInputChangeText(mobileTextInput)}
                        value={this.state.mobileTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'orange',alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        placeholder='请输入验证码'
                        placeholderTextColor='gray'
                        keyboardType='numeric'
                        maxLength={6}
                        autoCorrect={false}
                        secureTextEntry={false}
                        style={{color:'black',width:ScreenUtils.scaleSize(525),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(7),padding:0,}}
                        onChangeText={(vcodeTextInput) => this._vcodeTextInputChangeText(vcodeTextInput)}
                        value={this.state.vcodeTextInput}
                        underlineColorAndroid='transparent'
                      />
                      <Button style={styles.getCodeBtn} isDisabled={this.state.VCodeBtnHidden} disabledStyle={styles.VCodeBtnHidden} onPress={() => this._getCodeBtn()}>
                      <View>
                        <Text style={{textAlign:'center',color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>{this.state.VCodeBtnText}</Text>
                      </View>
                    </Button>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
                </View>
             )
    }else{
      return (
               <View>
                 <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'orange',alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        placeholder='请输入原支付密码'
                        placeholderTextColor='gray'
                        keyboardType='numeric'
                        maxLength={6}
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={{color:'black',width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(7),padding:0,}}
                        onChangeText={(paymentPwdTextInput) => this._paymentPwdTextInputChangeText(paymentPwdTextInput)}
                        value={this.state.paymentPwdTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
               </View>
             )
    }
  }

  _nextBtnPress(navigate,goBack){
    const { params } = this.props.navigation.state;
    if (this.state.vcodeTextInput == '') {
      Alert.alert('提示','请输入手机验证码')
      return
    }
    if (this.state.vcodeTextInput.length < 3) {
      Alert.alert('提示','请输入正确的手机验证码')
      return
    }
    if (this.state.newPaymentPwdTextInput == '') {
      Alert.alert('提示','请输入支付密码')
      return
    }
    if (this.state.newPaymentPwdTextInput.length < 6) {
      Alert.alert('提示','请输入6位数的支付密码')
      return
    }
    if (this.state.newPaymentPwdTextInputAgain == '') {
      Alert.alert('提示','请再次输入支付密码')
      return
    }
    if (this.state.newPaymentPwdTextInputAgain.length < 6) {
      Alert.alert('提示','请再次输入6位数的支付密码')
      return
    }
    if (this.state.newPaymentPwdTextInputAgain != this.state.newPaymentPwdTextInput) {
      Alert.alert('提示','两次支付密码不一致，请重新输入')
      return
    }
    let str = '?token=' + this.state.token[1] + '&payPassword=' + this.state.newPaymentPwdTextInput + '&mobile=' + params.mobile + '&code=' + this.state.vcodeTextInput
     NetUtils.postJson('business/setPayPw', {}, str,(result) => {
        Alert.alert('提示',result,[{text: '确定', onPress: () => this._setStatusSuccess(navigate,goBack,params)}]);
     });
  }

  _setStatusSuccess(navigate,goBack,params){
    if (params.nextView == 'payment') {
      DeviceEventEmitter.emit('setPayPwdSuccess','')
      goBack()
    }else{
      goBack()
    }
  }

  _forgetPaymentPwd(navigate){
    navigate('forgetPwd',{key:'忘记支付密码'});
  }

  _mobileTextInputChangeText(value){
    this.setState({mobileTextInput:value});
  }

  _vcodeTextInputChangeText(value){
    this.setState({vcodeTextInput:value});
  }

  _paymentPwdTextInputChangeText(value){
    this.setState({paymentPwdTextInput:value});
  }

  _paymentPwdTextInputChangeText(value){
    this.setState({paymentPwdTextInput:value});
  }

  _newPaymentPwdTextInputChangeText(value){
    this.setState({newPaymentPwdTextInput:value});
  }

  _newPaymentPwdTextInputChangeTextAgain(value){
    this.setState({newPaymentPwdTextInputAgain:value});
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'#F3A50E',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50)}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36),left:ScreenUtils.scaleSize(39)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(25),backgroundColor:'#EEEEEE'}}></View>

                  {this.renderMoblie()}

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'orange',alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        placeholder='请输入新支付密码'
                        placeholderTextColor='gray'
                        keyboardType='numeric'
                        maxLength={6}
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={{color:'black',width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(7),padding:0,}}
                        onChangeText={(newPaymentPwdTextInput) => this._newPaymentPwdTextInputChangeText(newPaymentPwdTextInput)}
                        value={this.state.newPaymentPwdTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',borderBottomWidth:1,borderBottomColor:'orange',alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                        placeholder='请再次输入新支付密码'
                        placeholderTextColor='gray'
                        keyboardType='numeric'
                        maxLength={6}
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={{color:'black',width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(7),padding:0,}}
                        onChangeText={(newPaymentPwdTextInputAgain) => this._newPaymentPwdTextInputChangeTextAgain(newPaymentPwdTextInputAgain)}
                        value={this.state.newPaymentPwdTextInputAgain}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <TouchableOpacity onPress={() => this._forgetPaymentPwd(navigate)} style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(80),left:ScreenUtils.scaleSize(550)}}>
                    <Text style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(40),top:ScreenUtils.scaleSize(20),color:'gray',textAlign:'right'}}>忘记密码？</Text>
                  </TouchableOpacity>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(0),backgroundColor:'#EEEEEE'}}></View>

                  <Button onPress={() => this._nextBtnPress(navigate,goBack)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(0),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                     <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>修改</Text>
                  </Button>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    scrollableTabview: {
        backgroundColor:'#EEEEEE',
        width: ScreenUtils.scaleSize(750),
        height: ScreenUtils.scaleSize(390),
      },
     underline: {
        borderColor: 'red',
        backgroundColor: '#F3A50E',
      },
    getCodeBtn: {
      width:ScreenUtils.scaleSize(165),
      height: ScreenUtils.scaleSize(48),
      top:ScreenUtils.scaleSize(21),
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#F3A50E',
    },
    VCodeBtnHidden: {
      borderColor: '#787878',
    },
    numberTextInput: {
      width:ScreenUtils.scaleSize(380),
      height:ScreenUtils.scaleSize(60),
      left: ScreenUtils.scaleSize(50),
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      borderColor:'gray',
      borderRadius:ScreenUtils.scaleSize(5),
      borderWidth: ScreenUtils.scaleSize(2),
    },
});