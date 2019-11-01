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
  ImageBackground,
  CameraRoll,
} from 'react-native';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import NetUtils from '../../PublicComponents/NetUtils';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import Permissions from 'react-native-permissions';

export default class businessQRCode extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '商家二维码',
      businessID: '',  //商家id
      mobile: '',  //手机号
      statusBarHeight: 0,
      token: '',
      QRCodeStr: '',
      operateType: '',
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

  loadOperateType(){
    storage.load({
        key: 'operateType',
        id: '1006'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({operateType:ret});
        if (ret != 1) {
          this.setState({scanShow:true})
        }
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

  _requestPermission() {
    Permissions.request('photo').then(response => {
       if (response == 'authorized') {
         this.saveQRcode()
       }else{
         Alert.alert('提示','用户拒绝授权')
       }
    })
  }

  requestAndroidCamera(navigate){
    Permissions.request('photo').then(response => {
      if (response == 'authorized') {
        this.saveQRcode()
      }else{
        Alert.alert('提示','用户拒绝授权')
      }
    })
   }

  save(){
    Permissions.check('photo').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      if (response == 'denied') {
        if (Platform.OS == 'ios') {
          Alert.alert('提示','检测到用户尚未打开相册权限，是否马上打开？',[{text:'是',onPress:() => Permissions.openSettings},{text:'否'}])
        }else{
          Alert.alert('提示','检测到用户尚未打开相册权限，是否马上打开？',[{text:'是',onPress:() => this.requestAndroidCamera(navigate)},{text:'否'}])
        }
      }else if (response == 'undetermined') {
        if (Platform.OS == 'ios') {
          Alert.alert('提示','检测到用户尚未打开相册权限，是否马上打开？',[{text:'是',onPress:() => this._requestPermission()},{text:'否'}])
        }else{
          Alert.alert('提示','检测到用户尚未打开相册权限，是否马上打开？',[{text:'是',onPress:() => this.requestAndroidCamera(navigate)},{text:'否'}])
        }
      }else if (response == 'authorized'){
          this.saveQRcode()
      }
    })
  }

  saveQRcode(){
    this.refs.viewShot.capture().then(uri => {
      console.log(uri)
      let promise = CameraRoll.saveToCameraRoll(uri);
      promise.then(function(result) {
        Alert.alert('提示','保存成功');
      }).catch(function(error) {
        Alert.alert('提示','保存失败,'+error);
      });
    });
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadOperateType();
    this.loadToken()
    setTimeout(() => {
      const { params } = this.props.navigation.state;
      let operateType = '';
      if (this.state.operateType == 1) {
        operateType = 2
      }else{
        operateType = 3
      }
      let str = "?token=" + this.state.token[1];
      NetUtils.get('business/QRcodeUrl', str, (result) => {
        this.setState({QRCodeStr:result});
      });
      // let qrcode = 'http://m.chuanglibao.net.cn/gz/#/qrcodes'
      // let qrcode = 'http://m.chuanglibao.net.cn/gz/#/qrcodes?superior_id=' + params.user_member_info_id + '&id=0&goods_type=' + operateType + '&user_business_info_id=' + params.businessID;
    },300);
  }

  // {this.state.QRCodeStr==''?null:<QRCode
  //                                                     value={this.state.QRCodeStr}
  //                                                     logo={{uri:params.shopInfo.logo}}
  //                                                     logoSize={ScreenUtils.scaleSize(80)}
  //                                                     size={ScreenUtils.scaleSize(300)}
  //                                                     bgColor='black'
  //                                                     fgColor='white'/>}

  // {this.state.QRCodeStr==''?null:<QRCode
  //                                                   value={this.state.QRCodeStr}
  //                                                   size={ScreenUtils.scaleSize(400)}
  //                                                   backgroundColor='black'
  //                                                   color='white'/>}

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(22),height:ScreenUtils.scaleSize(39)}} source={require('../images/back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'black',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this.save()} style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>保存</Text>
                    </TouchableOpacity>
                  </View>

                  <ViewShot style={{flex:1}} ref="viewShot" options={{ format: "jpg", quality: 1 }}>
                  <View style={{flex:1,backgroundColor:'#F2AA40',justifyContent:'center',alignItems:'center'}}>
                     <ImageBackground style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(850),justifyContent:'center',alignItems:'center'}} source={require('../images/personalCenter/qrcodebg.png')}>
                       <Text style={{color:'black',fontSize:ScreenUtils.setSpText(10),fontWeight:'800'}}>{params.shopInfo.shop_name}</Text>
                       <View style={{height:ScreenUtils.scaleSize(70)}}></View>
                       {this.state.QRCodeStr==''?<View style={{height:ScreenUtils.scaleSize(420)}}></View>:
                         <View style={{width:ScreenUtils.scaleSize(420),height:ScreenUtils.scaleSize(420),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                           <QRCode
                              value={this.state.QRCodeStr}
                              logo={{uri:params.shopInfo.logo}}
                              logoSize={ScreenUtils.scaleSize(100)}
                              size={ScreenUtils.scaleSize(325)}
                              bgColor='black'
                              fgColor='white'/>
                         </View>
                       }
                       <View style={{height:ScreenUtils.scaleSize(70)}}></View>
                       <Text style={{color:'black',fontSize:ScreenUtils.setSpText(7)}}>扫一扫二维码，即可关注商家</Text>
                     </ImageBackground>
                     <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(30)}}></View>
                     <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(162),backgroundColor:'#F1B95B'}}>
                       <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(80),backgroundColor:'#F1B95B',flexDirection:'row',alignItems:'center'}}>
                          <Image source={require('../images/personalCenter/dizhi.png')} style={{width:ScreenUtils.scaleSize(26),height:ScreenUtils.scaleSize(34),left:ScreenUtils.scaleSize(10)}} />
                          <Text style={{left:ScreenUtils.scaleSize(30),color:'black',fontSize:ScreenUtils.setSpText(9)}}>{params.shopInfo.area}{params.shopInfo.address}</Text>
                       </View>
                       <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(2),backgroundColor:'#F2AA40'}}></View>
                       <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(80),backgroundColor:'#F1B95B',flexDirection:'row',alignItems:'center'}}>
                          <Image source={require('../images/personalCenter/phone-channel.png')} style={{width:ScreenUtils.scaleSize(28),height:ScreenUtils.scaleSize(32),left:ScreenUtils.scaleSize(10)}} />
                          <Text style={{left:ScreenUtils.scaleSize(30),color:'black',fontSize:ScreenUtils.setSpText(9)}}>{params.shopInfo.contact_number}</Text>
                       </View>
                     </View>
                  </View>
                  </ViewShot>
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