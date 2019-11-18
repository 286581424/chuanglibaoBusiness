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
  Modal,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
import ScreenUtils from '../../../PublicComponents/ScreenUtils';
import NetUtils from '../../../PublicComponents/NetUtils';

export default class payResult extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '支付成功',
      statusBarHeight: 0,
      token: '',
      phone: '',
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
    this.setStatusBarHeight()
    this.loadToken()
    this.loadPhone()
    const { params } = this.props.navigation.state
  }

  //跳转到送货订单页 待收货
  goToOrderList(navigate){
    navigate('marketCategory')
    DeviceEventEmitter.emit('marketCategory','marketOrderList')
    DeviceEventEmitter.emit('payResult','')
  }

  //跳转到下单页面
  goToPlaceOrder(navigate){
    const { params } = this.props.navigation.state
    if (params.goBackView!=null && params.goBackView == 'placeOrder'){
      navigate('placeOrder',{city:params.city,area:params.area,buyCarList:params.buyCarList,returnCash:params.returnCash,totalPrice:params.totalPrice})
      DeviceEventEmitter.emit('payResult','')
    }
  }

  //当用户在支付商品时余额不足，点击充值余额，充值余额成功后，点击当前按钮，返回之前订单继续支付
  goToContinuePay(navigate){
    const { params } = this.props.navigation.state
    if (params.goBackView!=null && params.goBackView == 'payment'){
      navigate('payment',{orderNum:params.orderNum,key:'placeOrder',canBalancePay:true})
    }
  }

  //回到首页
  goToMarketCategory(navigate){
    navigate('marketCategory')
    DeviceEventEmitter.emit('vipProfitListener','')
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <ImageBackground style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(554),justifyContent:'center',alignItems:'center'}} source={require('../../images/Market/payResult_bg.png')}>
                    <View style={{height:ScreenUtils.scaleSize(41)}}></View>
                    <Image style={{width:ScreenUtils.scaleSize(331),height:ScreenUtils.scaleSize(382)}} source={require('../../images/Market/payResult_success.png')} />
                    <View style={{height:ScreenUtils.scaleSize(21)}}></View>
                    <Text style={{color:'#78482f',fontSize:ScreenUtils.setSpText(10),fontWeight:'500'}}>{params.tipsText}</Text>
                  </ImageBackground>

                  <View style={{height:ScreenUtils.scaleSize(40)}}></View>

                  {params.tipsText=='采购商品成功'?<TouchableOpacity onPress={() => this.goToOrderList(navigate)} style={{left:ScreenUtils.scaleSize(24),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9)}}>返回送货订单</Text>
                  </TouchableOpacity>:null}

                  {params.goBackView!=null && params.goBackView == 'placeOrder'?<TouchableOpacity onPress={() => this.goToPlaceOrder(navigate)} style={{left:ScreenUtils.scaleSize(24),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9)}}>继续下单</Text>
                  </TouchableOpacity>:null}

                  {params.goBackView!=null && params.goBackView == 'payment'?<TouchableOpacity onPress={() => this.goToContinuePay(navigate)} style={{left:ScreenUtils.scaleSize(24),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9)}}>继续支付</Text>
                  </TouchableOpacity>:null}

                  <View style={{height:ScreenUtils.scaleSize(30)}}></View>

                  <TouchableOpacity onPress={() => this.goToMarketCategory(navigate)} style={{left:ScreenUtils.scaleSize(24),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(90),borderWidth:1,borderColor:'#fea712',borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#fea712',fontSize:ScreenUtils.setSpText(9)}}>返回首页</Text>
                  </TouchableOpacity>
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