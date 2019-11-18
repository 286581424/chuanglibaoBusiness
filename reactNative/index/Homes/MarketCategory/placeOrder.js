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

export default class placeOrder extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '生成订单',
      statusBarHeight: 0,
      token: '',
      phone: '',
      buyCarList: [],  //购物车列表
      vipMoney: '',  //每月会员费用
      balance: '',  //账户余额
      defaultAddress: '',  //默认地址
      canPress: false,  //提交订单按钮是否不能点击
      isVip: 0, //是否是vip 0不是 1是
      isVipBeOverdue: 0,  //vip是否已经过期 0未过期 1已过期
      vipDeadline: '',  //vip过期时间
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
          this.getBalance()
          this._loadAddress()
          this.getVipInfo()
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

  //获取vip信息
  getVipInfo(){
    let str = '?userType=B&token=' + this.state.token[1]
    NetUtils.postJson('market/user/vipInfo', {}, str, (result) => {
      //vip_status 是否是vip 0不是 1是 deadline_status vip是否过期 0未过期 1过期 vip_deadline 过期时间
      this.setState({isVip:result.vip_status,isVipBeOverdue:result.deadline_status})
      if (result.vip_deadline!=null) {
        this.setState({vipDeadline:result.vip_deadline.slice(0,10)})
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
    this.loadPhone()
    this.loadToken()
    const { params } = this.props.navigation.state;
    this.setState({buyCarList:params.buyCarList})
    this.getVipMoney()
    //支付成功监听
    this.deEmitter = DeviceEventEmitter.addListener('payResult', (a) => {
        if (this.state.token!='') {
          this.getBalance()
          this.getVipMoney()
        }
    });
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    if (params.addressInfo != null) {
          this.setState({defaultAddress:params.addressInfo});
    }else{
      this._loadAddress();
    }
  }

  //获取收获地址
  _loadAddress(){
    let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1];
    NetUtils.get('address/getMemberReceivingAddress', params, (result) => {
        let arr = result.receivingAddressList;
        if (arr.length>0) {
          for (let a of arr){
            if (a.is_default == 1) {
              this.setState({defaultAddress:a});
            }
          }
        }
    });
  }

  getVipMoney(){
    NetUtils.get('user/vipPrice', '?userType=B', (result) => {
      this.setState({vipMoney:result.vip_money})
    });
  }

  getBalance(){
    let str = '?userType=B&token=' + this.state.token[1]
    NetUtils.get('user/balance', str, (result) => {
      this.setState({balance:result})
    });
  }

  _renderCommodityItem(item){
    return (
             <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(100),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
               {item.list_img=='图片地址'?<Image style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100)}} source={require('../../images/Market/xilanhua.png')} />:<Image style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100)}} source={{uri:item.list_img}} />}
               <View style={{width:ScreenUtils.scaleSize(22)}}></View>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(100)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50)}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',fontWeight:'500'}}>{item.name}</Text>
                 </View>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50),justifyContent:'flex-end'}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898',fontWeight:'500'}}>x{item.number}</Text>
                 </View>
               </View>
               <View style={{width:ScreenUtils.scaleSize(125),height:ScreenUtils.scaleSize(100),alignItems:'flex-end'}}>
                 <Text style={{fontSize:ScreenUtils.setSpText(10),color:'black',fontWeight:'500'}}><Text style={{fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(5)}}>¥</Text> {item.vip1_price}</Text>
               </View>
             </View>
           )
  }

  _renderCommodityFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(33),backgroundColor:'white'}}></View>
  )

  _renderCommodityFooter= () => (
      <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(33),backgroundColor:'white'}}></View>
  )

  _renderCommodityHeader= () => (
      <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(117),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(83),justifyContent:'center'}}>
          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',fontWeight:'500'}}>订单内容</Text>
        </View>
        <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
        <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(34)}}></View>
      </View>
  )

  //添加收货地址
  _addAddressPress(){
    const { navigate } = this.props.navigation;
    navigate('editAddress',{key:'新增地址',back:'placeOrder'});
  }

  //选择收货地址
  _choosePlace(){
    const { navigate } = this.props.navigation;
    navigate('receivingAddress',{key:'placeOrder'});
  }

  //提交订单
  submitOrder(navigate,params){
    this.setState({canPress:true})
    if (this.state.canPress) {
      return
    }
    let buyCarList = this.state.buyCarList
    let str = '?userType=B&token=' + this.state.token[1]
    let productInfo = []
    for(let a of buyCarList){
      productInfo.push({'productId':a.id,'buyNum':a.number})
    }
    let jsonObj = {'receivedId':this.state.defaultAddress.id,remarks:'',productInfo:productInfo}
    NetUtils.postJson_backErr('market/order/submit',jsonObj,str,(result) => {
        navigate('payment',{key:'placeOrder',orderNum:result.orderNum})
        this.setState({canPress:false})
      },(errResult) =>{
        Alert.alert('提示',errResult)
        this.setState({canPress:false})
      },(errorResult) => {
        Alert.alert('提示',errorResult)
        this.setState({canPress:false})
      });
  }

  //检查收货地址是否和当前定位city和area一致
  checkAddressIsInArea(params){
    let defaultAddress = this.state.defaultAddress
    if (params.city == defaultAddress.city && params.area == defaultAddress.area) {
      return true
    }else{
      return false
    }
  }

  //判断用户是否是vip，并且判断vip是否过期
  judgeIsVipAndVipIsBeOverdue(){
    const { isVip, isVipBeOverdue } = this.state
    // 0不是vip
    if (isVip == 0) {
      return '成为团美家VIP'
    }else{
      if (isVipBeOverdue == 0) {
        return '团美家VIP'
      }else{
        return '团美家VIP已过期'
      }
    }
  }

  //跳转到vip页面
  goToVip(navigate){
    const { params } = this.props.navigation.state;
    // city area buyCarList returnCash totalPrice 
    //goBackView 返回页面
    navigate('toBeVip',{key:'vip',goBackView:'placeOrder',city:params.city,area:params.area,buyCarList:params.buyCarList,returnCash:params.returnCash,totalPrice:params.totalPrice})
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <ScrollView style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'#fea712',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'#fea712',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../images/Home/back_white.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'#fea712',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(300-88-this.state.statusBarHeight),backgroundColor:'#fea712'}}>
                  </View>

                  {/* 购物车列表 */}
                  <View style={{top:ScreenUtils.scaleSize(-160),justifyContent:'center',alignItems:'center'}}>
                    <FlatList
                        style={{width:ScreenUtils.scaleSize(700),backgroundColor:'white',overflow:'hidden',borderRadius:ScreenUtils.scaleSize(15)}}
                        data={this.state.buyCarList}
                        renderItem={({item}) => this._renderCommodityItem(item)}
                        ItemSeparatorComponent={this._renderCommodityFenge}
                        ListHeaderComponent={this._renderCommodityHeader}
                        ListFooterComponent={this._renderCommodityFooter}
                      />
                  </View>

                  <ScrollView style={{top:ScreenUtils.scaleSize(-160)}}>
                    <View style={{height:ScreenUtils.scaleSize(25)}}></View>

                  {/* 支付信息 */}
                    <View style={{left:ScreenUtils.scaleSize(25),overflow:'hidden',width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(279),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(93),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(330),fontSize:ScreenUtils.setSpText(9),color:'black'}}>支付方式</Text>
                        <Text style={{width:ScreenUtils.scaleSize(330),fontSize:ScreenUtils.setSpText(9),textAlign:'right',color:'#989898'}}>在线支付</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(93),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(330),fontSize:ScreenUtils.setSpText(9),color:'black'}}>送达时间</Text>
                        <Text style={{width:ScreenUtils.scaleSize(330),fontSize:ScreenUtils.setSpText(9),textAlign:'right',color:'#434343'}}>{NetUtils.getTimeAddOneDay('')}</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(93),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(330),fontSize:ScreenUtils.setSpText(9),color:'black'}}>合计</Text>
                        <Text style={{width:ScreenUtils.scaleSize(330),fontSize:ScreenUtils.setSpText(9),textAlign:'right',color:'#e43232'}}>¥ <Text style={{fontSize:ScreenUtils.setSpText(12)}}>{params.totalPrice}</Text></Text>
                      </View>
                    </View>

                    <View style={{height:ScreenUtils.scaleSize(25)}}></View>

                    {/* 会员信息 */}
                    <View style={{borderWidth:1,borderColor:'#D0D0D0',left:ScreenUtils.scaleSize(25),overflow:'hidden',width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(224),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(60),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(210),height:ScreenUtils.scaleSize(60)}} source={require('../../images/Market/vip_icon.png')} />
                        <View style={{width:ScreenUtils.scaleSize(491),height:ScreenUtils.scaleSize(60),justifyContent:'center'}}>
                          <Text style={{left:ScreenUtils.scaleSize(41),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>此单可返<Text style={{color:'red'}}>{params.returnCash}</Text>元，每单都有优惠</Text>
                        </View>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(164),flexDirection:'row',justifyContent:'center'}}>
                        <View style={{width:ScreenUtils.scaleSize(580),height:ScreenUtils.scaleSize(164),justifyContent:'center'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(10),color:'#434343',fontWeight:'500'}}>{this.judgeIsVipAndVipIsBeOverdue()}</Text>
                          <View style={{height:ScreenUtils.scaleSize(18)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#434343',fontWeight:'500'}}>账户余额 : {this.state.balance}</Text>
                          <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                          {this.state.isVipBeOverdue==1?<Text style={{fontSize:ScreenUtils.setSpText(8),color:'#434343',fontWeight:'500'}}>会员费用 : <Text style={{color:'red'}}>¥{this.state.vipMoney}</Text><Text style={{color:'#989898'}}>/月</Text></Text>:<Text style={{fontSize:ScreenUtils.setSpText(8),color:'#434343',fontWeight:'500'}}>到期时间 : {this.state.vipDeadline}</Text>}
                        </View>
                        <TouchableOpacity onPress={() => this.goToVip(navigate)} style={{width:ScreenUtils.scaleSize(76),height:ScreenUtils.scaleSize(164),justifyContent:'center',alignItems:'flex-end'}}>
                          <Image source={require('../../images/Market/more.png')} style={{width:ScreenUtils.scaleSize(16),height:ScreenUtils.scaleSize(32)}} />
                        </TouchableOpacity>
                      </View>
                    </View>

                  </ScrollView>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(125),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => this.submitOrder(navigate,params)} style={{width:ScreenUtils.scaleSize(703),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(10)}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>提交订单</Text>
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
});