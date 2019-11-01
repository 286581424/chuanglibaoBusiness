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
  Modal,
  NativeModules,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import Picker from 'react-native-picker';
import ImageUpdata from '../PublicComponents/ImageUpdata';
import NetUtils from '../PublicComponents/NetUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import SyanImagePicker from 'react-native-syan-image-picker';

var Dimensions = require('Dimensions');
var screenW = Dimensions.get('window').width;
var screenH = Dimensions.get('window').height;

var dismissKeyboard = require('dismissKeyboard');

const { StatusBarManager } = NativeModules;

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

export default class shopInfo extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '店铺信息',
      shopImageUploadArr: [],
      placeTextInput: '',  //详细地址
      show:false,  //正在上传
      shopImage: [],  //店铺头像
      businessLicenseNumTextInput:'',  //营业号
      CardIDNumTextInput:'',  //身份证
      operatorTextInput: '',  //营业人
      contectNumTextInput: '',  //电话
      shopAddress: '', //店铺地址
      province: [],  //省
      city: [],  //市
      area: [],  //区
      street: [],  //镇或街道
      chooseAddress: [],  //选择定位
      doorNumber: '',  //门牌号
  };
  }

  componentDidMount(){
    this.setStatusBarHeight();
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state
    if (params.key == 'address') {
      this.setState({province:params.province,city:params.city,area:params.area,street:params.street})
      this.setState({chooseAddress:params.chooseAddress,doorNumber:params.doorNumber})
    }
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

      let name = ImageUpdata.getImageName('business_logo',params.phoneNum,'1');
      this.setState({
        avatarSource: source
      });
      let arr = [];
      arr = {'uri':selectedPhotos[0].uri,'name':name,fileName:ImageUpdata.getName('business_logo',params.phoneNum,'1')};
      this.setState({shopImage: arr});
    })
  }


    _businessLicenseNumChangeText(value){
      this.setState({businessLicenseNumTextInput:value});
    }

    _cardIDNumTextInputChangeText(value){
      this.setState({CardIDNumTextInput:value});
    }

    _operatorTextInputChangeText(value){
      this.setState({operatorTextInput:value});
    }

    _contectNumTextInputChangeText(value){
      this.setState({contectNumTextInput:value});
    }

    _shopKeywordTextInputChangeText(value){
      this.setState({shopKeywordTextInput:value});
    }

      // 显示/隐藏 modal
  _setModalVisible() {
    let isShow = this.state.show;
    this.setState({
      show:!isShow,
    });
  }

    _openShopBtn(navigate,params,ContactNumberStr){
        if (this.state.shopImage != null && params.BusinessLicense != null && this.state.businessLicenseNumTextInput != '' && this.state.CardIDNumTextInput != '' && this.state.contectNumTextInput != '' && this.state.operatorTextInput != '') {
          let BusinessLicenseStr = '';
          if (params.BusinessLicense != null) {
            for(let a of params.BusinessLicense){
              BusinessLicenseStr += a.fileName+',';
            }
            BusinessLicenseStr = BusinessLicenseStr.substring(0,BusinessLicenseStr.length-1);
          }

          if (this.state.province == '' ) {
            Alert.alert('提示','请标记店铺地址')
            return
          }

          let province = this.state.province.city_name;
          let city = this.state.city.city_name;
          let area = this.state.area.city_name;
          let street = this.state.street.city_name;

          let addressArr = this.state.chooseAddress.address.split(this.state.chooseAddress.area)
          let address = ''
          if (addressArr.length == 2) {
            address = addressArr[1]+this.state.doorNumber
          }else{
            address = addressArr[0]+this.state.doorNumber
          }

          let businessInfoStr = {
                                   sale_type:params.sale_type,
                                   logo:this.state.shopImage.fileName,
                                   business_type:0,
                                   mobile:params.phoneNum,
                                   password:params.password,
                                   shop_name:params.shopName,
                                   operate_type:params.shopType,
                                   business_license_pic:BusinessLicenseStr,
                                   business_license_num:this.state.businessLicenseNumTextInput,
                                   id_card_no:this.state.CardIDNumTextInput,
                                   id_card_pic_opposite:params.CardID[0].fileName,
                                   id_card_pic_positive:params.CardID[1].fileName,
                                   contact_number:this.state.contectNumTextInput,
                                   province:province,
                                   city:city,
                                   area:area,
                                   street:street,
                                   address:this.state.chooseAddress.name+this.state.doorNumber,
                                   address_key:this.state.chooseAddress.name,
                                   operator:this.state.operatorTextInput,
                                   lat:this.state.chooseAddress.location.lat,
                                   lng:this.state.chooseAddress.location.lng,
                                 };
          // alert(JSON.stringify(businessInfoStr))
          let smsCode = '?smsCode='+params.smsCode+'&mobile='+params.phoneNum;
          let ImageUpdataArray = [];
          ImageUpdataArray.push(this.state.shopImage);
          ImageUpdataArray.push(params.BusinessLicense[0]);
          ImageUpdataArray.push(params.CardID[0]);
          ImageUpdataArray.push(params.CardID[1]);

          NetUtils.postJson('business/registerBusiness',businessInfoStr,smsCode,(result) => {
                Alert.alert('提示',result,[{text: '去登录', onPress: () => this._login(navigate)}]);

            for(let a of ImageUpdataArray){
              ImageUpdata.upload(a.uri, a.name, (percentage,onloaded,size) => {
              console.log();
            },
            (result) => {
                if (result.status == 200) {
                  
                }else{
                  Alert.alert('提示','上传失败，错误码为'+result.status,[{text:"确定", onPress:() => this._setModalVisible()}]);
                }
            });
            }
          });
        }else if(this.state.shopImage == null){
          Alert.alert('提示','请选择商店头像');
        }else if (params.BusinessLicense == null) {
          Alert.alert('提示','请上传经营资质图片');
        }else if (this.state.businessLicenseNumTextInput == '') {
          Alert.alert('提示','请输入营业执照编号');
        }else if (this.state.CardIDNumTextInput == ''){
          Alert.alert('提示','请输入身份证号');
        }else if (this.state.contectNumTextInput == '') {
          Alert.alert('提示','请输入店铺电话');
        }else{
          Alert.alert('提示','请输入营业人');
        }

    }

    _login(navigate) {
      navigate('login',{headerTitle:'登录'});
    }

    _businessQualificationPress(navigate,params){
      navigate('registerBusinessQualification',{key:'openShop',phoneNum:params.phoneNum,BusinessLicense:params.BusinessLicense,CardID:params.CardID});
    }

    _showFourLevLinkPress(navigate){
      navigate('province',{key:'shopInfo'});
    }

    _backBtn(goBack){
      goBack();
    }

    renderShopImage(){
      if (this.state.shopImage != '') {
        return (
                  <Image style={{width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(90)}} source={{uri:this.state.shopImage.uri}}/>
               );
      }else{
        return (
                  <Image style={{width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(90)}} source={require('./images/shop_logo.png')}/>
               );
      }
    }

    gotoBusinessAddress(navigate){
      if (this.state.province == '') {
        navigate('businessAddress',{key:'openShop',info:0})
      }else{
        navigate('businessAddress',{info:1,key:'openShop',province:this.state.province,city:this.state.city,area:this.state.area,street:this.state.street,chooseAddress:this.state.chooseAddress,doorNumber:this.state.doorNumber})
      }
    }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;

        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => this._backBtn(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('./images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(11),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    <ScrollView>
                      <KeyboardAwareScrollView>
                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(135),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*店铺头像</Text>
                          <TouchableOpacity onPress={() => this._chooseImage(params)} style={{width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                            <View style={{width:ScreenUtils.scaleSize(340),height:ScreenUtils.scaleSize(80)}}></View>
                            <View style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}}>{this.renderShopImage()}</View>
                            <Image style={{left:ScreenUtils.scaleSize(20),resizeMode:'stretch',width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}} source={require('./images/more.png')}/>
                          </TouchableOpacity>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*店铺名称</Text>
                          <View style={{width:ScreenUtils.scaleSize(550),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{width:ScreenUtils.scaleSize(475),color:'gray',fontSize:ScreenUtils.setSpText(8),textAlign:'right'}}>{params.shopName}</Text>
                            <View style={{left:ScreenUtils.scaleSize(30),resizeMode:'stretch',width:ScreenUtils.scaleSize(25),height:ScreenUtils.scaleSize(47.5)}}></View>
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*营业人</Text>
                          <View style={{width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(74),alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(5)}}>
                            <TextInput
                                placeholder='请输入营业人'
                                placeholderTextColor='gray'
                                maxLength={10}
                                autoCorrect={false}
                                style={{color:'black',width:ScreenUtils.scaleSize(460),height:ScreenUtils.scaleSize(74),fontSize:ScreenUtils.setSpText(8),padding:0}}
                                onChangeText={(operatorTextInput) => this._operatorTextInputChangeText(operatorTextInput)}
                                value={this.state.operatorTextInput}
                                underlineColorAndroid='transparent'
                              />
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*身份证号</Text>
                          <View style={{width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(74),alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(5)}}>
                            <TextInput
                                placeholder='请输入身份号'
                                placeholderTextColor='gray'
                                maxLength={18}
                                autoCorrect={false}
                                style={{color:'black',width:ScreenUtils.scaleSize(460),height:ScreenUtils.scaleSize(74),fontSize:ScreenUtils.setSpText(8),padding:0}}
                                onChangeText={(CardIDNumTextInput) => this._cardIDNumTextInputChangeText(CardIDNumTextInput)}
                                value={this.state.CardIDNumTextInput}
                                underlineColorAndroid='transparent'
                              />
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*经营资质</Text>
                          <TouchableOpacity onPress={() => this._businessQualificationPress(navigate,params)} style={{width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{width:ScreenUtils.scaleSize(405),color:'gray',fontSize:ScreenUtils.setSpText(8),textAlign:'right'}}>{params.BusinessLicense!=null?'已上传':'未上传'}</Text>
                            <Image style={{left:ScreenUtils.scaleSize(30),resizeMode:'stretch',width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}} source={require('./images/more.png')}/>
                          </TouchableOpacity>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*营业执照号</Text>
                          <View style={{width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(74),alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(5)}}>
                            <TextInput
                                placeholder='请输入营业执照编号'
                                placeholderTextColor='gray'
                                maxLength={30}
                                autoCorrect={false}
                                style={{color:'black',width:ScreenUtils.scaleSize(460),height:ScreenUtils.scaleSize(74),fontSize:ScreenUtils.setSpText(8),padding:0}}
                                onChangeText={(businessLicenseNumTextInput) => this._businessLicenseNumChangeText(businessLicenseNumTextInput)}
                                value={this.state.businessLicenseNumTextInput}
                                underlineColorAndroid='transparent'
                              />
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                          <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*店铺电话</Text>
                          <View style={{width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(74),alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(5)}}>
                            <TextInput
                                placeholder='请输入店铺电话'
                                placeholderTextColor='gray'
                                maxLength={30}
                                autoCorrect={false}
                                style={{color:'black',width:ScreenUtils.scaleSize(460),height:ScreenUtils.scaleSize(74),fontSize:ScreenUtils.setSpText(8),padding:0}}
                                onChangeText={(contectNumTextInput) => this._contectNumTextInputChangeText(contectNumTextInput)}
                                value={this.state.contectNumTextInput}
                                underlineColorAndroid='transparent'
                              />
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:params.cityResult != null? ScreenUtils.scaleSize(200):ScreenUtils.scaleSize(100)}}>
                          <View style={{flexDirection:'row',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',}}>
                            <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'left',width:ScreenUtils.scaleSize(200)}}>*店铺地址</Text>
                            <TouchableOpacity onPress={() => this.gotoBusinessAddress(navigate)} style={{width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                              <Text numberOfLines={1} style={{width:ScreenUtils.scaleSize(405),color:'gray',fontSize:ScreenUtils.setSpText(8),textAlign:'right'}}>{this.state.chooseAddress!=''?this.state.chooseAddress.name:'请标记店铺地址'}</Text>
                            <Image style={{left:ScreenUtils.scaleSize(30),resizeMode:'stretch',width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}} source={require('./images/more.png')}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </KeyboardAwareScrollView>
                    </ScrollView>

                    <Button onPress={() => this._openShopBtn(navigate,params)} style={styles.loginBtn}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(11)}}>提交审核</Text>
                    </Button>

                    <Modal
                       animationType='slide'
                       transparent={true}
                       visible={this.state.show}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'#EEEEEE',opacity:0.9,alignItems:'center',justifyContent:'center'}}>
                         <Text style={{width:ScreenUtils.scaleSize(300),color:'black',textAlign:'center'}}>正在上传</Text>
                       </View>
                    </Modal>

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
        left: ScreenUtils.scaleSize(30),
        width: ScreenUtils.scaleSize(690),
        height: ScreenUtils.scaleSize(92),
        backgroundColor: '#F3A50E',
        borderWidth: 0,
        borderColor:'transparent',
        borderRadius: ScreenUtils.scaleSize(10),
      },
});