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
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../../PublicComponents/NetUtils';

export default class shopSeting extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '店铺设置',
      tabTitleIndex: 0,
      shopLogo: '',
      shopName: '',
      background: '',
      operateType: '',
      businessLicenseImage: '',
      cardIDPositiveImage: '',
      cardIDOppositeImage: '',
      businessTime: '',
      contactNumber: '',
      delivery_fee: '0',  //配送费
      startSendMoney: '0',  //起送费用
      deliveryFeeIsShow: true,
      province: '',
      city: '',
      area: '',
      street: '',
      address: '',
      addressKey: '',
      businessID: '',  //商家id
      mobile: '',  //手机号
      token: '',
      notice: '',
      shopInfos: [],
      lat: 0,
      lng: 0,
      statusBarHeight: 0,
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

  getShopInfo(){
    let params = "?user_type=B&mobile=" + this.state.mobile+'&token=' + this.state.token[1];
    // alert(params);
    NetUtils.get('business/getUserBusinessInfoByBusiness', params, (result) => {
        let shopInfo = result.userBusinessInfo;
        console.log(shopInfo);
        this.setState({shopInfos:result.userBusinessInfo});
        if (shopInfo.delivery_fee != null) {
          this.setState({delivery_fee:shopInfo.delivery_fee});
        }
        if (shopInfo.minimum_delivery_price != null) {
          this.setState({startSendMoney:shopInfo.minimum_delivery_price})
        }
        if (shopInfo.logo != null) {
          this.setState({shopLogo:shopInfo.logo});
        }
        this.setState({shopName:shopInfo.shop_name});
        if (shopInfo.notice != null) {
          this.setState({notice:shopInfo.notice});
        }
        if (shopInfo.background != null) {
          this.setState({background:shopInfo.background});
        }
        let operateType = shopInfo.operate_type;
        let operateTypeStr = '';
        if (operateType == 1) {
          operateTypeStr = '超市便利';
        }else if (operateType == 2) {
          operateTypeStr = '美食';
          this.setState({deliveryFeeIsShow:false})
        }else if (operateType == 3) {
          operateTypeStr = '休闲娱乐';
          this.setState({deliveryFeeIsShow:false})
        }else if (operateType == 5) {
          operateTypeStr = '生活服务';
          this.setState({deliveryFeeIsShow:false})
        }else if (operateType == 6) {
          operateTypeStr = '外卖';
        }
        operateTypeStr+='-'+shopInfo.sale_type
        this.setState({operateType:operateTypeStr});
        this.setState({businessTime:shopInfo.business_hours});
        if (shopInfo.business_license_pic != null) {
          this.setState({businessLicenseImage:shopInfo.business_license_pic});
        }
        if (shopInfo.id_card_pic_positive != null) {
          this.setState({cardIDPositiveImage:shopInfo.id_card_pic_positive});
        }
        if (shopInfo.id_card_pic_opposite != null) {
          this.setState({cardIDOppositeImage:shopInfo.id_card_pic_opposite});
        }
        this.setState({contactNumber:shopInfo.contact_number});
        this.setState({province:shopInfo.province});
        this.setState({city:shopInfo.city});
        this.setState({area:shopInfo.area});
        this.setState({street:shopInfo.street});
        this.setState({address:shopInfo.address});
        this.setState({lat:shopInfo.lat,lng:shopInfo.lng})
        this.setState({addressKey:shopInfo.address_key});
    });
  }

  componentWillReceiveProps(nextProps){
    setTimeout(() => {
      this.getShopInfo();
    },200);
  }

    componentDidMount(){
      this.setStatusBarHeight();
      this.loadBusinessID();
      this.loadMobile();
      this.loadToken();
      setTimeout(() => {
        this.getShopInfo();
      },200);
    }

    _goToShopInfo(navigate,params){
      navigate('shopInfos',{shopInfos:this.state.shopInfos,notice:this.state.notice,shopName:this.state.shopName,shopLogo:this.state.shopLogo,operateType:this.state.operateType,businessLicenseImage:this.state.businessLicenseImage,cardIDOppositeImage:this.state.cardIDOppositeImage,cardIDPositiveImage:this.state.cardIDPositiveImage});
    }

    _goToBusinessLicense(navigate,params){
      navigate('businessImageUpdate',{shopInfos:this.state.shopInfos});
    }

    _goToBusinessTime(navigate){
      navigate('businessTime',{key:'shopSeting',businessTime:this.state.businessTime});
    }

    _gotoShopPhoneNum(navigate){
      navigate('shopPhoneNum',{key:'shopSeting',shopPhoneNum:this.state.shopInfos.contact_number});
    }

    _gotoBusinessPlace(navigate){
      navigate('businessAddress',{key:'setting',businessID:this.state.shopInfos.id,province:this.state.province,city:this.state.city,area:this.state.area,street:this.state.street,address:this.state.addressKey,lat:this.state.lat,lng:this.state.lng});
    }

    _gotoShopKey(navigate){
      navigate('shopKeyword',{key:'shopSeting',shopKeyword:this.state.shopInfos.address_key});
    }

    renderShopLogo(){
      if (this.state.shopLogo != null) {
        return (
                  <Image resizeMode={'stretch'} source={{uri:this.state.shopLogo}} style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80),borderRadius:ScreenUtils.scaleSize(10)}}/>
               );
      }else{
        return (
                  <Image style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}} source={require('../images/personalCenter/shop_logo.png')}/>
               );
      }
    }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <ScrollView style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'white',width:ScreenUtils.scaleSize(150)}}></Text>
                    </View>
                  </View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(8),color:'black'}}>店铺头像</Text>
                    <View style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(80)}}></View>
                    <View style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}}>
                      {this.renderShopLogo()}
                    </View>
                    <TouchableOpacity onPress={() => this._goToShopInfo(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>店铺名称</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.shopName}</Text>
                    <TouchableOpacity onPress={() => this._goToShopInfo(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>店铺公告</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.notice != ''?'已添加':'未添加'}</Text>
                    <TouchableOpacity onPress={() => this._goToShopInfo(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   {this.state.deliveryFeeIsShow?<View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>配送费</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.delivery_fee}</Text>
                    <TouchableOpacity onPress={() => this._goToShopInfo(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                   </View>:null}

                   {this.state.deliveryFeeIsShow?<View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>起送费</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.startSendMoney}</Text>
                    <TouchableOpacity onPress={() => this._goToShopInfo(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                   </View>:null}

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>店铺背景图</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.background != ''?'已上传':'未上传'}</Text>
                    <TouchableOpacity onPress={() => navigate('setBackgroundImg',{background:this.state.background})} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>经营类型</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.operateType}</Text>
                    <TouchableOpacity onPress={() => this._goToShopInfo(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>经营资质</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}></Text>
                    <TouchableOpacity onPress={() => this._goToBusinessLicense(navigate,params)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>营业时间</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.businessTime}</Text>
                    <TouchableOpacity onPress={() => this._goToBusinessTime(navigate)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>店铺电话</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.contactNumber}</Text>
                    <TouchableOpacity onPress={() => this._gotoShopPhoneNum(navigate)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2-200),fontSize:ScreenUtils.setSpText(8),color:'black'}}>店铺地址</Text>
                    <Text style={{width:ScreenUtils.scaleSize(480),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.address}</Text>
                    <TouchableOpacity onPress={() => this._gotoBusinessPlace(navigate)} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>

            </ScrollView>
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
});