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
import {StackNavigator} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import NetUtils from '../../PublicComponents/NetUtils';
import SyanImagePicker from 'react-native-syan-image-picker';
import ImageUpdata from '../../PublicComponents/ImageUpdata'


export default class qrCodeManagement extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '二维码管理',
      typeName: '',
      typeDec: '',
      statusBarHeight: 0,
      phone: '',
      token: '',
      operateType: '',
      pageNum: 1,
      pageSize: 100,
      businessID: '',
      commodityList: '',
  };
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

  loadBusinessID(){
    storage.load({
        key: 'id',
        id: '1007'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({businessID:parseInt(ret)});
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

  loadOperateType(){
    storage.load({
        key: 'operateType',
        id: '1006'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({operateType:ret});
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
    this.loadToken();
    this.loadOperateType();
    this.loadPhone();
    this.loadBusinessID();
    this.setStatusBarHeight();
    setTimeout(() => {
      if(this.state.operateType == 2 || this.state.operateType == 3){
        this._upCouponGoodsData();
      }else{
        this._upCommodityData();
      }
    },200);
  }

  componentWillReceiveProps(){
    if(this.state.operateType == 2 || this.state.operateType == 3){
      this._upCouponGoodsData();
    }else{
      this._upCommodityData();
    }
  }

  _upCommodityData(){
    let params = "?user_business_info_id=" + this.state.businessID + '&physical_goods_type_id=0';
    NetUtils.get('physicalGoods/showPhysicalGoodsInfoByParm', params, (goodsResult) => {
      console.log(goodsResult)
      this.setState({commodityList:goodsResult.physicalGoodsInfoDTOList});
    });
  }

  _upCouponGoodsData(){
    let params = "?user_business_info_id=" + this.state.businessID + '&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize;
    NetUtils.get('couponGoods/showCouponGoodsInfoByParm', params, (result) => {
        console.log(result)
        this.setState({commodityList:result.couponGoodsInfoDTOList});
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

  _showQRCode(item,key){
    const { navigate } = this.props.navigation;
    navigate('commodityQRCode',{key:key,commodityID:item.id,qrcode_image:item.qr_code_adverts,name:item.name,price:item.price});
  }

    _renderItem(item){
        return (
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(190),alignItems:'center',backgroundColor:'white',flexDirection:'row'}}>
              {item.qr_code_adverts != null?<Image resizeMode={'stretch'} source={{uri:item.qr_code_adverts}} style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130)}}/>:<View style={{width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130),backgroundColor:'#EEEEEE',left:ScreenUtils.scaleSize(30)}}></View>}
              <View style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(350),height:ScreenUtils.scaleSize(130)}}>
                <Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(9),color:'black'}}>{item.name}</Text>
                <Text style={{top:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(8),color:'black'}}>售价： <Text style={{width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(8),color:'red'}}>¥ {item.price}</Text></Text>
              </View>
              <TouchableOpacity onPress={() => this._showQRCode(item,'setting')} style={{left:ScreenUtils.scaleSize(0),width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'stretch'} source={item.qr_code_adverts != null?require('../images/qrcode/change.png'):require('../images/qrcode/setting.png')} style={{top:ScreenUtils.scaleSize(-6.5),width:ScreenUtils.scaleSize(26),height:ScreenUtils.scaleSize(26)}}/>
                <Text style={{top:ScreenUtils.scaleSize(6.5),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>{item.qr_code_adverts != null?'修改':'设置'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._showQRCode(item,'save')} style={{left:ScreenUtils.scaleSize(0),width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'stretch'} source={require('../images/qrcode/save.png')} style={{top:ScreenUtils.scaleSize(-6.5),width:ScreenUtils.scaleSize(26),height:ScreenUtils.scaleSize(26)}}/>
                <Text style={{top:ScreenUtils.scaleSize(6.5),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>保存</Text>
              </TouchableOpacity>
            </View>
        );
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
    )

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                   <FlatList 
                      style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250*this.props.heightLine)}}
                      data={this.state.commodityList}
                      renderItem={({item}) => this._renderItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
                    />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
});