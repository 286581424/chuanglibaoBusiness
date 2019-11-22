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
  DeviceEventEmitter
} from 'react-native';
import ScreenUtils from '../../../PublicComponents/ScreenUtils';
import NetUtils from '../../../PublicComponents/NetUtils';
import *as wechat from 'react-native-wechat'

export default class marketOrderList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '支付',
      statusBarHeight: 0,
      token: '',
      phone: '',
      tabIndex: 1,  //顶部导航 1待付款 2待收货 3已完成 4退款/取消
      pageSize: 10,
      orderList: '',  //订单列表
      isRefresh: false,  //下拉刷新
      isLoadMore: false,  //上拉刷新
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
        this.setState({token:ret},() => {
          if (this.state.token == '') {
            Alert.alert('提示','请先登录再查看订单！',[{text:'确定',onPress:() => this.props.navigation.navigate('login',{nextView:'marketCategory'})}])
          }else{
            this.getOrderList()
          }
        });
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        Alert.alert('提示','请先登录再查看订单！',[{text:'确定',onPress:() => this.props.navigation.navigate('login',{nextView:'marketCategory'})}])
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

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    this.loadToken()
  }

  componentDidMount(){
    this.setStatusBarHeight()
    this.loadToken()
    this.loadPhone()
    const { params } = this.props.navigation.state;
    //底部导航栏点击监听
    this.deEmitter = DeviceEventEmitter.addListener('marketOrderListListener', (a) => {
        if (this.state.token!='') {
          this.getOrderList()
        }
    });
    //支付成功返回监听
    this.deEmitter = DeviceEventEmitter.addListener('payResult', (a) => {
        this.setState({tabIndex:2},() => {
          if (this.state.token!='') {
            this.getOrderList()
          }
        })
    });
  }

  //获取订单列表
  getOrderList(){
    let str = '?userType=B&token=' + this.state.token[1] + '&status=' + this.state.tabIndex + '&pageNum=1&pageSize=' + this.state.pageSize
    NetUtils.get('market/order/pageList', str, (result) => {
        console.log(result)
        this.setState({orderList:result})
    });
  }

  //跳转订单详情
  gotoOrderDetails(item){
    const { navigate } = this.props.navigation;
    navigate('marketOrderDetails',{orderNum:item.order_num})
  }

  _renderItem(item){
    let status = '待出库'
    switch(item.status){
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
    if (item.status == 5) {
      switch(item.pay_status){
        case 4:
          status = '退款申请中'
          break;
        case 5:
          status = '退款申请中'
          break;
        case 6:
          status = '退款成功'
          break;
        case 7:
          status = '退款失败'
          break;
        default:
          status = '其他'
          break;
      }
    }
    return (
              <View style={{width:ScreenUtils.scaleSize(705),overflow:'hidden',borderRadius:ScreenUtils.scaleSize(20),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(84),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Text style={{width:ScreenUtils.scaleSize(495),fontSize:ScreenUtils.setSpText(8),color:'black'}}>订单编号：{item.order_num}</Text>
                  <TouchableOpacity onPress={() => this.gotoOrderDetails(item)} style={{flexDirection:'row',width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(84),alignItems:'center',justifyContent:'flex-end'}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>{status}</Text>
                    <View style={{width:ScreenUtils.scaleSize(10)}}></View>
                    <Image source={require('../../images/Market/more.png')} style={{width:ScreenUtils.scaleSize(16),height:ScreenUtils.scaleSize(32)}} />
                  </TouchableOpacity>
                </View>
                <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <FlatList
                        style={{width:ScreenUtils.scaleSize(656),backgroundColor:'white',overflow:'hidden',borderRadius:ScreenUtils.scaleSize(15)}}
                        data={item.items}
                        renderItem={({item}) => this._renderCommodityItem(item)}
                        ItemSeparatorComponent={this._renderCommodityFenge}
                      />
                </View>
                <Text style={{width:ScreenUtils.scaleSize(645),textAlign:'right',fontSize:ScreenUtils.setSpText(9)}}>商品合计：<Text style={{color:'red'}}>¥</Text> <Text style={{fontSize:ScreenUtils.setSpText(11),color:'red'}}>{item.real_price}</Text></Text>
                <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(31)}}></View>
                {this.renderBtn(item)}
                <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(31)}}></View>
              </View>
           )
  }

  //支付订单
  gotoPay(item){
    const { navigate } = this.props.navigation;
    navigate('payment',{key:'placeOrder',orderNum:item.order_num})
  }

  //确认收货
  confirmReceipt(item){
    let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + item.order_num
    NetUtils.get('market/order/finishedOrder', str, (result) => {
        Alert.alert('提示','收货成功')
        this.getOrderList()
    });
  }

  //申请退款
  applyForRefund(item){
    let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + item.order_num + '&remark='
    NetUtils.postJson('market/order/applyRefund', {}, str, (result) => {
      this.getOrderList()
      Alert.alert('提示','申请退款成功！')
    });
  }

  renderBtn(item){
    let tabIndex = this.state.tabIndex
    if (tabIndex == 1) {
      return (
               <View style={{width:ScreenUtils.scaleSize(645),height:ScreenUtils.scaleSize(53),flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this.gotoPay(item)} style={{width:ScreenUtils.scaleSize(151),height:ScreenUtils.scaleSize(53),justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(30),borderColor:'#fea712',borderWidth:1}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#fea712'}}>支付订单</Text>
                  </TouchableOpacity>
               </View>
             )
    }else if (tabIndex == 2) {
      return (
               <View style={{width:ScreenUtils.scaleSize(645),height:ScreenUtils.scaleSize(53),flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                  {item.status == 1?<TouchableOpacity onPress={() => Alert.alert('提示','确认申请退款？',[{text:'是',onPress:() => this.applyForRefund(item)},{text:'否'}])} style={{width:ScreenUtils.scaleSize(151),height:ScreenUtils.scaleSize(53),justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(30),borderColor:'#989898',borderWidth:1}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>申请退款</Text>
                  </TouchableOpacity>:null}
                  {item.status == 2?<TouchableOpacity onPress={() => Alert.alert('提示','确认收货？',[{text:'我已收货',onPress:() => this.confirmReceipt(item)},{text:'我未收货'}])} style={{width:ScreenUtils.scaleSize(151),height:ScreenUtils.scaleSize(53),justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(30),borderColor:'#fea712',borderWidth:1}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#fea712'}}>确认收货</Text>
                  </TouchableOpacity>:null}
               </View>
             )
    }else{
      return (<View></View>)
    }
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderCommodityFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(656),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderCommodityItem(item){
    return (
             <View style={{width:ScreenUtils.scaleSize(656),height:ScreenUtils.scaleSize(192),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
               {item.list_img=='图片地址'?<Image source={require('../../images/Market/xilanhua.png')} style={{width:ScreenUtils.scaleSize(141),height:ScreenUtils.scaleSize(134)}} />:<Image source={{uri:item.list_img}} style={{width:ScreenUtils.scaleSize(141),height:ScreenUtils.scaleSize(134)}} />}
               <View style={{width:ScreenUtils.scaleSize(27)}}></View>
               <View style={{width:ScreenUtils.scaleSize(508),height:ScreenUtils.scaleSize(134)}}>
                 <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',fontWeight:'500'}}>{item.product_name}</Text>
                 <View style={{flex:1,justifyContent:'flex-end'}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>x{item.buy_num}</Text>
                   <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                   <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>¥ {item.price}</Text>
                 </View>
               </View>
             </View>
           )
  }

  //下拉刷新
  _onRefresh(i){
    if (!this.state.isRefresh) {
      this.getOrderList();
    }
  }

  //上拉加载
  _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize},() => {
        this.getOrderList();
      });
    }
  }

  //tab切换
  tabIndexChange(key){
    this.setState({tabIndex:key},() => {
      this.getOrderList()
    })
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this.tabIndexChange(1)} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(80),borderBottomWidth:1,borderBottomColor:this.state.tabIndex==1?'#fea712':'transparent',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'500',color:this.state.tabIndex==1?'#fea712':'#434343'}}>待付款</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.tabIndexChange(2)} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(80),borderBottomWidth:1,borderBottomColor:this.state.tabIndex==2?'#fea712':'transparent',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'500',color:this.state.tabIndex==2?'#fea712':'#434343'}}>待收货</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.tabIndexChange(3)} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(80),borderBottomWidth:1,borderBottomColor:this.state.tabIndex==3?'#fea712':'transparent',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'500',color:this.state.tabIndex==3?'#fea712':'#434343'}}>已完成</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.tabIndexChange(4)} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(80),borderBottomWidth:1,borderBottomColor:this.state.tabIndex==4?'#fea712':'transparent',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'500',color:this.state.tabIndex==4?'#fea712':'#434343'}}>退款/取消</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20)}}></View>

                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <FlatList 
                      style={{width:ScreenUtils.scaleSize(705)}}
                      data={this.state.orderList}
                      renderItem={({item}) => this._renderItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
                      onRefresh={() => this._onRefresh()}
                      refreshing={this.state.isRefresh}
                      onEndReached={() => this._onLoadMore()}
                      onEndReachedThreshold={1}
                  />
                </View>

                {this.state.orderList.length==0?<View style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(710),height:ScreenUtils.getHeight()-ScreenUtils.scaleSize(371),alignItems:'center'}}>
                       <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(96),width:ScreenUtils.scaleSize(182),height:ScreenUtils.scaleSize(194)}} source={require('../../images/Order/no_order.png')}/>
                       <Text style={{top:ScreenUtils.scaleSize(143),color:'black',fontSize:ScreenUtils.setSpText(8)}}>暂无相关订单</Text>
                       <Text style={{top:ScreenUtils.scaleSize(181),color:'gray',fontSize:ScreenUtils.setSpText(6.5)}}>可以去看看有什么想买的</Text>
                     </View>:null}

                <View style={{height:ScreenUtils.scaleSize(10)}}></View>

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