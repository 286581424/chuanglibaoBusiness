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
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import ImageUpdata from '../../PublicComponents/ImageUpdata';
import NetUtils from '../../PublicComponents/NetUtils';
import SyanImagePicker from 'react-native-syan-image-picker';

const options = {
      imageCount: 1,          // 最大选择图片数目，默认6
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: true,          // 是否允许裁剪，默认false
      CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
      CropH: ScreenUtils.scaleSize(750), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
    };
// const options = {
//       imageCount: 1,          // 最大选择图片数目，默认6
//       isCamera: true,         // 是否允许用户在内部拍照，默认true
//       isCrop: true,          // 是否允许裁剪，默认false
//       CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
//       CropH: ScreenUtils.scaleSize(750), // 裁剪高度，默认屏幕宽度60%
//       isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
//       showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
//       showCropFrame: true,    // 是否显示裁剪区域，默认true
//       showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
//   };
pickerData = ['超市便利','美食','休闲娱乐'];

export default class shopInfos extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '店铺信息',
      shopNameTextInput: '',
      shopImageArr: ['addImage'],
      shopLogo: {},
      businessType: 0,
      businessTypeText: '',
      businessID: '',  //商家id
      mobile: '',  //手机号
      statusBarHeight: 0,
      delivery_fee: '0',
      startSendMoney: '0',
      noticeTextInput: '',
      operateType: 0,
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

  loadBusinessID(){
    storage.load({
        key: 'id',
        id: '1007'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({businessID:ret});
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

  loadMobile(){
    storage.load({
        key: 'phone',
        id: '1005'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({mobile:ret});
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

  loadOperateType(){
    storage.load({
        key: 'operateType',
        id: '1006'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({operateType:parseInt(ret)});
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
    this.loadBusinessID();
    this.loadMobile();
    this.loadOperateType()
    if (this.props.navigation.state.params.shopName != null) {
      this.setState({shopNameTextInput:this.props.navigation.state.params.shopName});
    }
    this.setState({noticeTextInput:this.props.navigation.state.params.shopInfos.notice});
    if (this.props.navigation.state.params.shopInfos.delivery_fee != null) {
      this.setState({delivery_fee:this.props.navigation.state.params.shopInfos.delivery_fee.toString()});
    }
    if (this.props.navigation.state.params.shopInfos.minimum_delivery_price != null) {
      this.setState({startSendMoney:this.props.navigation.state.params.shopInfos.minimum_delivery_price.toString()});
    }
    if (this.props.navigation.state.params.operateType != null) {
      let operateType = this.props.navigation.state.params.operateType;
      if (operateType == '超市便利') {
        this.setState({businessType:1});
      }else if (operateType == '美食') {
        this.setState({businessType:2});
      }else{
        this.setState({businessType:3});
      }
      this.setState({businessTypeText:this.props.navigation.state.params.operateType});
    }
    if (this.props.navigation.state.params.shopLogo != null || this.props.navigation.state.params.shopLogo != '') {
      this.setState({shopLogo:{uri:this.props.navigation.state.params.shopLogo,name:this.props.navigation.state.params.shopLogo}});
    }
  }

  _shopNameTextInputChangeText(value){
    this.setState({shopNameTextInput:value});
  }

  _noticeTextInputChangeText(value){
    this.setState({noticeTextInput:value});
  }

  _chooseImage(params){
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

      let name = ImageUpdata.getImageName('business_logo',this.state.mobile,'1');
      this.setState({
        avatarSource: source
      });
      let arr = [];
      arr = {'uri':selectedPhotos[0].uri,'name':name,fileName:ImageUpdata.getName('business_logo',this.state.mobile,'1')};
      this.setState({shopLogo: arr});
    })
  }

 // _chooseImage(params){
 //    ImagePicker.showImagePicker(options, (response) => {
 //      console.log('Response = ', response);

 //      if (response.didCancel) {
 //        console.log('User cancelled image picker');
 //      }
 //      else if (response.error) {
 //        console.log('ImagePicker Error: ', response.error);
 //      }
 //      else if (response.customButton) {
 //        console.log('User tapped custom button: ', response.customButton);
 //      }
 //      else {
 //        let source = { uri: response.uri };

 //        // You can also display the image using data:
 //        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

 //        let name = ImageUpdata.getImageName('business_logo',this.state.mobile,'1');
 //        this.setState({
 //          avatarSource: source
 //        });
 //        let arr = [];
 //        arr = {'uri':response.uri,'name':name,fileName:ImageUpdata.getName('business_logo',this.state.mobile,'1')};
 //        this.setState({shopLogo: arr});
 //      }
 //    });
 //  }

  _saveBtnPress(navigate){
    let logoName = this.state.shopLogo.fileName;
    let shopInfoStr = {delivery_fee:this.state.delivery_fee,minimum_delivery_price:this.state.startSendMoney,id:this.state.businessID,notice:this.state.noticeTextInput,mobile:this.state.mobile,logo:logoName,shop_name:this.state.shopNameTextInput};
     NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
      Alert.alert('提示',result,[{text: '确定', onPress: () => this._setShopInfoSuccess(navigate)}]);
      ImageUpdata.upload(this.state.shopLogo.uri, this.state.shopLogo.name, (percentage,onloaded,size) => {
          // console.log();
        }, 
        (result) => {
            if (result.status == 200) {
              
            }else{
              Alert.alert('提示','上传失败，错误码为'+result.status);
            }
        });
     });
  }

  _setShopInfoSuccess(navigate){
    navigate('shopSeting',{key:'setShopInfoSuccess'});
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(180),backgroundColor:'white'}}></View>
    )

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'#F3A50E',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>店铺头像</Text>
                    <Text style={{width:ScreenUtils.scaleSize(400),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(7.5)}}></Text>
                    <View style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}}>
                      <Image resizeMode={'stretch'} source={{uri:this.state.shopLogo.uri}} style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80),borderRadius:ScreenUtils.scaleSize(40)}}/>
                    </View>
                    <TouchableOpacity onPress={() => this._chooseImage()} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-100),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>门店名称</Text>
                    <TextInput
                        placeholder='请输入店名'
                        placeholderTextColor='gray'
                        autoCorrect={true}
                        style={styles.numberTextInput}
                        onChangeText={(shopNameTextInput) => this._shopNameTextInputChangeText(shopNameTextInput)}
                        value={this.state.shopNameTextInput}
                        underlineColorAndroid='transparent'
                      />
                    <View style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                    </View>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>经营类型</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(7.5)}}>{this.state.businessTypeText}</Text>
                    <TouchableOpacity style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(210),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-100),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>店铺公告</Text>
                    <TextInput
                        placeholder='请输入店铺公告'
                        placeholderTextColor='gray'
                        autoCorrect={false}
                        style={styles.noticeTextInput}
                        onChangeText={(noticeTextInput) => this._noticeTextInputChangeText(noticeTextInput)}
                        value={this.state.noticeTextInput}
                        underlineColorAndroid='transparent'
                        multiline={true}
                        textAlignVertical={'top'}
                      />
                    <View style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                    </View>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                  {this.state.operateType == 1?<View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-100),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>配送费</Text>
                    <TextInput
                        autoCorrect={true}
                        placeholderTextColor='gray'
                        style={styles.numberTextInput}
                        onChangeText={(value) => this.setState({delivery_fee:value})}
                        value={this.state.delivery_fee}
                        underlineColorAndroid='transparent'
                      />
                    <View style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                    </View>
                  </View>:null}

                  {this.state.operateType == 1?<View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-100),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>起送费</Text>
                    <TextInput
                        autoCorrect={true}
                        placeholderTextColor='gray'
                        style={styles.numberTextInput}
                        onChangeText={(value) => this.setState({startSendMoney:value})}
                        value={this.state.startSendMoney}
                        underlineColorAndroid='transparent'
                      />
                    <View style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                    </View>
                  </View>:null}

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(30),backgroundColor:'#EEEEEE'}}></View>

                  <Button onPress={() => this._saveBtnPress(navigate)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                     <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存并提交</Text>
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
    numberTextInput: {
      width:ScreenUtils.scaleSize(380),
      height:ScreenUtils.scaleSize(60),
      left: ScreenUtils.scaleSize(50),
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      borderColor:'gray',
      color:'black',
      borderRadius:ScreenUtils.scaleSize(5),
      borderWidth: ScreenUtils.scaleSize(2),
    },
    noticeTextInput: {
      color:'black',
      width:ScreenUtils.scaleSize(380),
      height:ScreenUtils.scaleSize(180),
      left: ScreenUtils.scaleSize(50),
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      borderColor:'gray',
      borderRadius:ScreenUtils.scaleSize(5),
      borderWidth: ScreenUtils.scaleSize(2),
    },
});