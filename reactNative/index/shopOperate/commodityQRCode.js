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
  CameraRoll,
  PermissionsAndroid,
} from 'react-native';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import NetUtils from '../../PublicComponents/NetUtils';
import QRCode from 'react-native-qrcode';
import SyanImagePicker from 'react-native-syan-image-picker';
import ImageUpdata from '../../PublicComponents/ImageUpdata';
import ViewShot from "react-native-view-shot";
import Permissions from 'react-native-permissions';

const options = {
      imageCount: 1,          // 最大选择图片数目，默认6
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: true,          // 是否允许裁剪，默认false
      CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
      CropH: ScreenUtils.scaleSize(945), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
  };
export default class commodityQRCode extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '产品二维码',
      statusBarHeight: 0,
      QRCodeStr: '',
      operateType: '',
      phone: '',
      token: '',
      qrcodeImage: '',
      isSave: false,
  };
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

  loadToken(){
    storage.load({
        key: 'token',
        id: '1004'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({token:ret});
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
    this.loadOperateType();
    this.loadToken();
    this.loadPhone();
    const { params } = this.props.navigation.state;
    if (params.key == 'save') {
      this.setState({isSave:true})
    }
    setTimeout(() => {
      let operateType = '';
      if (this.state.operateType == 1) {
        operateType = 2
      }else{
        operateType = 3
      }
      if (params.qrcode_image != null) {
        this.setState({qrcodeImage:{uri:params.qrcode_image,name:params.qrcode_image}})
      }else{
        this.setState({qrcodeImage:{uri:'',name:''}})
      }
      let str = "?user_type=B&mobile=" + this.state.phone+'&token=' + this.state.token[1];
      NetUtils.get('business/getUserBusinessInfoByBusiness', str, (result) => {
          // alert(JSON.stringify(result))
          let arr = result.userBusinessInfo;
          let qrcode = 'http://m.chuanglibao.net.cn/gz/#/qrcodes?superior_id=' + arr.user_member_info_id + '&goods_type=' + operateType + '&id=' + params.commodityID + '&user_business_info_id=' + arr.id;
          this.setState({QRCodeStr:qrcode});
      });
    },300);
  }

  renderQRCode(){
    if (this.state.QRCodeStr != '') {
      return (
               <QRCode
                      value={this.state.QRCodeStr}
                      size={ScreenUtils.scaleSize(214)}
                      bgColor='black'
                      fgColor='white'/>
             )
    }else{
      return (<View style={{width:ScreenUtils.scaleSize(214),height:ScreenUtils.scaleSize(214)}}></View>)
    }
  }

  _changeQRCodeImg(){
    SyanImagePicker.showImagePicker(options, (err, selectedPhotos) => {
      if (err) {
        // 取消选择
        return;
      }
      // 选择成功，渲染图片
      // ...
       let source = { uri: selectedPhotos[0].uri };

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      const { params } = this.props.navigation.state;
      let name = ImageUpdata.getImageName('qrcode_image',params.commodityID,'1');
      this.setState({
        avatarSource: source
      });
      let arr = [];
      arr = {'uri':selectedPhotos[0].uri,'name':name};
      let formData = new FormData();
      formData.append('mobile',this.state.phone);
      formData.append('token',this.state.token[1]);
      formData.append('id',params.commodityID);
      formData.append('qrCodeUrl',ImageUpdata.getName('qrcode_image',params.commodityID,'1'))
      let Interface = ''
      if(this.state.operateType == 1){
        Interface = 'physicalGoods/uploadQrCode'
      }else{
        Interface = 'couponGoods/uploadQrCode'
      }
      NetUtils.post(Interface, formData, (result) => {
        ImageUpdata.upload(arr.uri, arr.name, (percentage,onloaded,size) => {
          console.log();
        }, 
        (result) => {
            if (result.status == 200) {
              console.log('图片上传成功')
            }else{
              Alert.alert('提示','上传失败，错误码为'+result.status);
            }
        });
      });
      this.setState({qrcodeImage: arr});
    })
  }

  _requestPermission() {
    Permissions.request('photo').then(response => {
       if (response == 'authorized') {
         this.save()
       }else{
         Alert.alert('提示','用户拒绝授权')
       }
    })
  }

  requestAndroidCamera(navigate){
    Permissions.request('photo').then(response => {
      if (response == 'authorized') {
        this.save()
      }else{
        Alert.alert('提示','用户拒绝授权')
      }
    })
   }

  _saveImg(){
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
          this.save()
      }
    })
  }

  save(){
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

  async requestReadPermission() {
        try {
            //返回string类型
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '需要获取读写权限',
                    'message': '需要获取读写权限，以保存图片'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.save()
            } else {
                alert("获取读写权限失败,无法保存图片")
            }
        } catch (err) {
            alert(err.toString())
        }
    }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'#F3A50E',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigate('qrCodeManagement',{key:'success'})} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    {this.state.isSave?<TouchableOpacity onPress={() => this._saveImg()} style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItem:'center'}}>
                                         <Text style={{color:'white',fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(150),textAlign:'right'}}>保存</Text>
                                       </TouchableOpacity>:<TouchableOpacity onPress={() => this._changeQRCodeImg()} style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItem:'center'}}>
                                         <Text style={{color:'white',fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(130),textAlign:'right',}}>修改样式</Text>
                                       </TouchableOpacity>}
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>

                  <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
                    {this.state.qrcodeImage.uri != ''?<Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(945)}} source={{uri:this.state.qrcodeImage.uri}}/>:<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(945),backgroundColor:'#EEEEEE',justifyContent:'center',alignItems:'center'}}><Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>暂未设置背景图</Text></View>}

                    <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(261),flexDirection:'row',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(17),height:ScreenUtils.scaleSize(261)}}></View>
                      {this.renderQRCode()}
                      <View style={{width:ScreenUtils.scaleSize(309),height:ScreenUtils.scaleSize(261),alignItems:'center',justifyContent:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(200),top:ScreenUtils.scaleSize(-26.5),fontSize:ScreenUtils.setSpText(9),color:'black'}}>{params.name}</Text>
                        <Text style={{width:ScreenUtils.scaleSize(200),top:ScreenUtils.scaleSize(26.5),fontSize:ScreenUtils.setSpText(9),color:'black'}}>售价：<Text style={{color:'red',fontSize:ScreenUtils.setSpText(9)}}>¥{params.price}</Text></Text>
                      </View>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(210),height:ScreenUtils.scaleSize(261)}} source={require('../images/qrcode/keepqrcode.png')}/>
                    </View>
                  </ViewShot>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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