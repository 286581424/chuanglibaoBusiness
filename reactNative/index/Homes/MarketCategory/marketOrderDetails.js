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
} from 'react-native';
import ScreenUtils from '../../../PublicComponents/ScreenUtils';
import NetUtils from '../../../PublicComponents/NetUtils';
import PaymentInput from '../../../PublicComponents/PaymentInput';

export default class marketOrderDetails extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '订单详情',
      statusBarHeight: 0,
      token: '',
      phone: '',
      orderDetails: ''
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

  _setPaypwdShow(){
    let show = this.state.payShow;
    this.setState({payShow:!show});
  }

  loadToken(){
    storage.load({
        key: 'token',
        id: '1004'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({token:ret},() => {
          this.getOrderDetails()
        });
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

  //查询订单详情
  getOrderDetails(){
    const { params } = this.props.navigation.state
    let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + params.orderNum
    NetUtils.get('market/order/detail', str, (result) => {
      console.log(result)
      this.setState({orderDetails:result})
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
  }

  checkOrderStatus(){
    let status = ''
    switch(this.state.orderDetails.status){
      case 0:
        status = '待付款'
        break;
      case 1:
        status = '待出库'
        break;
      case 2:
        status = '已出库'
        break;
      case 3:
        status = '已完成'
        break;
      case 4:
        status = '已取消'
        break;
      case 5:
        status = '退款售后'
        break;
      default:
        status = '其他'
        break;
    }
    return status
  }

  _renderCommodityItem(item){
    return (
             <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(100),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
               {item.list_img=='图片地址'?<Image style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100)}} source={require('../../images/Market/xilanhua.png')} />:<Image style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100)}} source={{uri:item.list_img}} />}
               <View style={{width:ScreenUtils.scaleSize(22)}}></View>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(80)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40)}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#000000'}}>{item.product_name}</Text>
                 </View>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),justifyContent:'flex-end'}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(7),color:'#434343'}}>x{item.buy_num}</Text>
                 </View>
               </View>
               <View style={{width:ScreenUtils.scaleSize(125),height:ScreenUtils.scaleSize(80),alignItems:'flex-end'}}>
                 <Text style={{fontSize:ScreenUtils.setSpText(10),color:'#434343'}}><Text style={{fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(5)}}>¥</Text> {item.price}</Text>
               </View>
             </View>
           )
  }

  _renderCommodityFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(33),backgroundColor:'white'}}></View>
  )

  _renderCommodityFooter= () => (
      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(33),backgroundColor:'white'}}></View>
  )

  _renderCommodityHeader= () => (
      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(33),backgroundColor:'white'}}></View>
  )

  checkAddress(){
    let orderDetails = this.state.orderDetails
    if (orderDetails.receiver_address == null) {
      return
    }
    let arr = orderDetails.receiver_address.split('@@')
    if (arr.length == 5) {
      return arr[3]+arr[4]
    }
  }

  //支付订单
  gotoPay(navigate){
    navigate('payment',{key:'marketOrderDetails',orderNum:this.state.orderDetails.order_num})
  }

  //确认收货
  confirmReceipt(item){
    let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + this.state.orderDetails.order_num
    NetUtils.get('market/order/finishedOrder', str, (result) => {
        Alert.alert('提示','收货成功')
    });
  }

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
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../../login/images/login_back1.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'#000000',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <ScrollView>
                    <View style={{width:ScreenUtils.scaleSize(710),left:ScreenUtils.scaleSize(20),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(20),overflow:'hidden',justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),fontWeight:'500',color:'black'}}>订单信息</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>订单号</Text>
                        <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474',width:ScreenUtils.scaleSize(500)}}>{this.state.orderDetails.order_num}</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>订单状态</Text>
                        <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474',width:ScreenUtils.scaleSize(500)}}>{this.checkOrderStatus()}</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>下单时间</Text>
                        <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474',width:ScreenUtils.scaleSize(500)}}>{this.state.orderDetails.create_time}</Text>
                      </View>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(710),left:ScreenUtils.scaleSize(20),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(20),overflow:'hidden',justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),fontWeight:'500',color:'black'}}>商品信息</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      {/* 购物车列表 */}
                      <FlatList
                          style={{width:ScreenUtils.scaleSize(650),backgroundColor:'white'}}
                          data={this.state.orderDetails.items}
                          renderItem={({item}) => this._renderCommodityItem(item)}
                          ItemSeparatorComponent={this._renderCommodityFenge}
                          ListHeaderComponent={this._renderCommodityHeader}
                          ListFooterComponent={this._renderCommodityFooter}
                        />
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(115),flexDirection:'row'}}>
                        <Image source={require('../../images/Market/vip_profit.png')} style={{width:ScreenUtils.scaleSize(74),height:ScreenUtils.scaleSize(74)}} />
                        <View style={{width:ScreenUtils.scaleSize(55)}}></View>
                        <View style={{width:ScreenUtils.scaleSize(452),height:ScreenUtils.scaleSize(115),justifyContent:'center',alignItems:'center'}}>
                          <Text style={{color:'#434343',fontSize:ScreenUtils.setSpText(9),fontWeight:'500'}}>该订单VIP收益可返现：<Text style={{color:'#e61313'}}>¥</Text> <Text style={{color:'#e61313',fontSize:ScreenUtils.setSpText(12)}}>{this.state.orderDetails.rebate}</Text></Text>
                        </View>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(86),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>总计</Text>
                        <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(500)}}>¥ <Text style={{fontSize:ScreenUtils.setSpText(11)}}>{this.state.orderDetails.real_price}</Text></Text>
                      </View>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(30),backgroundColor:'#EEEEEE'}}>
                    </View>

                    {this.checkOrderStatus()!='待付款'?<View style={{width:ScreenUtils.scaleSize(710),left:ScreenUtils.scaleSize(20),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(20),overflow:'hidden',justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),fontWeight:'500',color:'black'}}>配送信息</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>配送服务</Text>
                        <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474',width:ScreenUtils.scaleSize(500)}}>集装区配送</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>预计时间</Text>
                        <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474',width:ScreenUtils.scaleSize(500)}}>{NetUtils.getTimeAddOneDay(this.state.orderDetails.create_time)}</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(125),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(150)}}>配送地址</Text>
                        <View style={{width:ScreenUtils.scaleSize(500)}}>
                          <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474'}}>{this.checkAddress()}</Text>
                          <View style={{height:ScreenUtils.scaleSize(5)}}></View>
                          <Text style={{textAlign:'right',fontSize:ScreenUtils.setSpText(9),color:'#747474'}}>{this.state.orderDetails.addressee}  {this.state.orderDetails.receiver_contacts}</Text>
                        </View>
                      </View>
                    </View>:null}

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(30),backgroundColor:'#EEEEEE'}}>
                    </View>
                  </ScrollView>

                  {this.checkOrderStatus()=='待付款'?<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91),flexDirection:'row'}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>取消订单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.gotoPay(navigate)} style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fea712'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>支付订单</Text>
                    </TouchableOpacity>
                  </View>:null}

                  {this.checkOrderStatus()=='待收货'?<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91),flexDirection:'row'}}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>申请退款</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert('提示','确认收货？',[{text:'我已收货',onPress:() => this.confirmReceipt()},{text:'我未收货'}])} style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fea712'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>确认收货</Text>
                    </TouchableOpacity>
                  </View>:null}

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