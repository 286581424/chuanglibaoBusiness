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
import *as wechat from 'react-native-wechat'

export default class payment extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '支付',
      statusBarHeight: 0,
      token: '',
      phone: '',
      balance: '',  //账户余额
      orderDetails: '',  //订单详情
      payType: 1,  //0余额支付 1微信支付
      total_price: 0,  //价格
      orderNum: '',  //订单号
      invalid_time_timestamp: '',
      pay_time_min: 0,
      pay_time_sec: 0,
      payLoading: false,  //支付中
      payShow: false,  //支付框是否显示
      canBalancePay: true,
      params: '',
      isCanPay: true,  //支付按钮是否可点击 放重
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
          this.getBalance()
          const { params } = this.props.navigation.state
          this.setState({params:params})
          this.getOrderDetails(params)
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

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    this.setState({params:params})
    this.getOrderDetails(params)
    this.getBalance()
    if (params.key=='placeOrder') {
      this.setState({payType:0})
    }else{
      this.setState({payType:1})
    }
  }

  //查询账户余额
  getBalance(){
    let str = '?userType=B&token=' + this.state.token[1]
    NetUtils.get('user/balance', str, (result) => {
      this.setState({balance:result})
    });
  }

  //查询订单详情
  getOrderDetails(params){
    this.setState({orderNum:params.orderNum},() => {
      if (params.key == 'placeOrder' || params.key == 'marketOrderList' || params.key == 'marketOrderDetails') {
        let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + this.state.orderNum
        NetUtils.get('market/order/detail', str, (result) => {
          this.setState({orderDetails:result,total_price:result.total_price})
          this.calculateRemainingTime(result.invalid_time)
          this.setState({canBalancePay:true})
        });
      }else{
          if (params.canBalancePay != null) {
            this.setState({canBalancePay:params.canBalancePay})
          }
          this.setState({total_price:params.total_price})
          this.calculateRemainingTime(params.invalid_time)
      }
    })
  }

  calculateRemainingTime(time){
    let invalid_time = time.replace(/-/g,'/');
    let now_time = NetUtils.getTime().replace(/-/g,'/');
    let invalid_time_timestamp = new Date(invalid_time).getTime();
    this.setState({invalid_time_timestamp:invalid_time_timestamp});
    let now_time_timestamp = new Date(now_time).getTime();
    let zong_sec = (invalid_time_timestamp-now_time_timestamp)/1000;
    let remaining_time_min = parseInt(zong_sec/60);
    let remaining_time_sec = zong_sec%60;
    this.setState({pay_time_min:remaining_time_min});
    this.setState({pay_time_sec:remaining_time_sec});
    this._payTimeCountDown()
  }

  //倒计时
  _payTimeCountDown(){
    this.timer = setInterval(
      () => {
        let invalid_time_timestamp = this.state.invalid_time_timestamp;
        let now_time = NetUtils.getTime().replace(/-/g,'/');
        let now_time_timestamp = new Date(now_time).getTime();
        let zong_sec = (invalid_time_timestamp-now_time_timestamp)/1000;
        let remaining_time_min = parseInt(zong_sec/60);
        let remaining_time_sec = zong_sec%60;
        this.setState({pay_time_min:remaining_time_min});
        this.setState({pay_time_sec:remaining_time_sec});
        if (remaining_time_min == 0 && remaining_time_sec == 0) {
          this.timer && clearTimeout(this.timer);
          Alert.alert('提示','订单已超时',[{text:'确定',onPress:() => this.props.navigation.navigate('marketCategory',{key:'back'})}]);
        }
       },
      1000
    );
  }

  componentWillUnmount(){
    this.timer && clearTimeout(this.timer);
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
    if (params.key=='placeOrder') {
      this.setState({payType:0})
    }
  }

  //支付中
  renderPayLoading(){
    if (this.state.payLoading) {
      return (
               <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),top:ScreenUtils.scaleSize(-100),flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                  <Image source={require('../../images/pay_loading.gif')} style={{width:ScreenUtils.scaleSize(48),height:ScreenUtils.scaleSize(48)}} />
               </View>
             )
    }
  }

  //支付
  gotoPay(){
    const { params } = this.state;
    this.setState({isCanPay:false})
    if (!this.state.isCanPay) {
       setTimeout(() => {
        this.setState({isCanPay:true})
       },3000);
      return
    }
    //预充值+成为vip、充值余额、续费统一用'market/user/payRecharge'支付接口
    if (params.key == 'toBeVip') {
      //支付方式 1为微信支付
      let payment = 1
      let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + this.state.orderNum + '&payment=' + payment
      NetUtils.postJson('market/user/payRecharge', {}, str, (result) => {
        this.wechatPay(result)
      });
    }else{
      //采购商品支付接口
      let payment = 4
      if (this.state.payType == 1) {
        payment = 2
      }
      let str = '?userType=B&token=' + this.state.token[1] + '&orderNum=' + this.state.orderNum + '&payment=' + payment
      NetUtils.get('market/order/pay', str, (result) => {
        if(payment == 4){
          this.goToPayResult()
          this.setState({isCanPay:true})
        }else{
          this.wechatPay(result)
        }
      });
    }
  }

  //支付成功跳转到订单页面
  goToPayResult(){
    const { params } = this.state;
    this.timer && clearTimeout(this.timer);
    if (params.key=='toBeVip') {
      let tipsText = ''
      if (params.tipsText == '续费团美家VIP会员' || params.tipsText == '开通团美家VIP会员') {
        tipsText = '恭喜成为团美家会员'
      }else{
        tipsText = '充值余额成功'
      }
      if (params.goBackView!=null && params.goBackView == 'placeOrder'){
        this.props.navigation.navigate('payResult',{tipsText:tipsText,goBackView:'placeOrder',city:params.city,area:params.area,buyCarList:params.buyCarList,returnCash:params.returnCash,totalPrice:params.totalPrice})
      }else if (params.goBackView!=null && params.goBackView == 'payment') {
        this.props.navigation.navigate('payResult',{tipsText:tipsText,goBackView:'payment',orderNum:params.order_num})
      }else{
        this.props.navigation.navigate('payResult',{tipsText:tipsText})
      }
    }else{
      this.props.navigation.navigate('payResult',{tipsText:'采购商品成功'})
    }
  }

  //调起微信支付
  async wechatPay(json){
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    try {
        let result = await wechat.pay(
        {
          partnerId: json.partnerid,  // 商家向支付宝申请的商家id 1
          prepayId: json.prepayid,   // 预支付订单1
          nonceStr: json.noncestr,   // 随机串，防重发 1
          timeStamp: json.timestamp,  // 时间戳，防重发 1
          package: json.package,    // 商家根据财付通文档填写的数据和签名 1
          sign: json.signature,       // 商家根据微信开放平台文档对数据做的签名 1
        }
      );
      this.goToPayResult()
      this.setState({isCanPay:true})
    }catch(error){
      setTimeout(()=>{
          Alert.alert('提示','支付失败')
          this.setState({isCanPay:true})
      },500);
    }
  }

  //当用户余额不足时，跳转到充值页面
  goToBeVip(navigate,params){
    // params.orderNum 订单号
    navigate('toBeVip',{type:'recharge',orderNum:this.state.orderNum,goBackView:'payment'})
  }

  //返回上一页
  goBackView(goBack){
    //返回上一页时清空计时器，以免出现错误
    this.timer && clearTimeout(this.timer);
    goBack()
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => this.goBackView(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../../login/images/login_back1.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'#000000',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{height:ScreenUtils.scaleSize(50)}}></View>
                  {params.key=='toBeVip'?<View style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(10),color:'#df1d1d'}}>{params.tipsText}</Text>
                  </View>:null}
                  <View style={{height:ScreenUtils.scaleSize(23)}}></View>
                  <View style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'flex-end',flexDirection:'row'}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(12),color:'#df1d1d'}}>¥ </Text>
                    <Text style={{fontSize:ScreenUtils.setSpText(18),fontWeight:'600',color:'#df1d1d'}}>{this.state.total_price}</Text>
                  </View>

                  <View style={{height:ScreenUtils.scaleSize(30)}}></View>

                  <View style={{width:ScreenUtils.scaleSize(750),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../images/Market/shijian.png')} style={{width:ScreenUtils.scaleSize(36),height:ScreenUtils.scaleSize(36)}} />
                    <View style={{width:ScreenUtils.scaleSize(10)}}></View>
                    <Text style={{width:ScreenUtils.scaleSize(280),fontSize:ScreenUtils.setSpText(9),color:'#848484'}}>剩余支付时间 {this.state.pay_time_min}:{this.state.pay_time_sec}</Text>
                  </View>

                  <View style={{height:ScreenUtils.scaleSize(50)}}></View>
                  <Text style={{left:ScreenUtils.scaleSize(35),fontSize:ScreenUtils.setSpText(9),color:'black'}}>支付方式</Text>
                  <View style={{height:ScreenUtils.scaleSize(24)}}></View>

                  {/* 微信支付或余额支付 */}
                  <TouchableOpacity onPress={() => this.setState({payType:1})} style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'flex-end',flexDirection:'row'}}>
                    <ImageBackground style={{width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(164),justifyContent:'center',alignItems:'center',flexDirection:'row'}} source={require('../../images/Market/zhifu_kuang.png')}>
                      <Image style={{width:ScreenUtils.scaleSize(69),height:ScreenUtils.scaleSize(69)}} source={require('../../images/Market/wechat.png')} />
                      <View style={{width:ScreenUtils.scaleSize(30)}}></View>
                      <Text style={{width:ScreenUtils.scaleSize(440),fontSize:ScreenUtils.setSpText(10),color:'black'}}>微信支付</Text>
                      <View style={{width:ScreenUtils.scaleSize(90),justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(45)}} source={this.state.payType==1?require('../../images/Market/tobevip_choose.png'):require('../../images/Market/tobevip.png')} />
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                  <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                  {this.state.canBalancePay?<TouchableOpacity onPress={() => this.setState({payType:0})} style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'flex-end',flexDirection:'row'}}>
                    <ImageBackground style={{width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(164),justifyContent:'center',alignItems:'center',flexDirection:'row'}} source={require('../../images/Market/zhifu_kuang.png')}>
                      <Image style={{width:ScreenUtils.scaleSize(69),height:ScreenUtils.scaleSize(69)}} source={require('../../images/Market/yuezhifu.png')} />
                      <View style={{width:ScreenUtils.scaleSize(30)}}></View>
                      <Text style={{width:ScreenUtils.scaleSize(440),fontSize:ScreenUtils.setSpText(10),color:'black'}}>余额：{this.state.balance}</Text>
                      <View style={{width:ScreenUtils.scaleSize(90),justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(45)}} source={this.state.payType==0?require('../../images/Market/tobevip_choose.png'):require('../../images/Market/tobevip.png')} />
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>:null}

                  <View style={{flex:1,backgroundColor:'white'}}></View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(125),alignItems:'center'}}>
                    {this.state.balance-this.state.total_price<0 && this.state.canBalancePay && this.state.payType == 0?<TouchableOpacity onPress={() => this.goToBeVip(navigate,params)} style={{width:ScreenUtils.scaleSize(703),height:ScreenUtils.scaleSize(90),backgroundColor:'#434343',justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(10)}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>余额不足，点击前往充值</Text>
                    </TouchableOpacity>:<TouchableOpacity onPress={() => this.gotoPay()} style={{width:ScreenUtils.scaleSize(703),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(10)}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>支付 ¥ {this.state.total_price}</Text>
                    </TouchableOpacity>}
                  </View>

                  <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.payShow}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <TouchableOpacity activeOpacity={1} onPress={() => this._setPaypwdShow()} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'flex-end'}} underlayColor='rgba(140,140,140,0.7)'>
                          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight()/2+ScreenUtils.scaleSize(250),borderRadius:ScreenUtils.scaleSize(30),backgroundColor:'white'}}>
                            <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(100),left:ScreenUtils.scaleSize(30),flexDirection:'row',alignItems:'center'}}>
                              <TouchableOpacity onPress={() => this._setPaypwdShow()} style={{width:ScreenUtils.scaleSize(60),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center'}}>
                                <Image style={{width:ScreenUtils.scaleSize(32),height:ScreenUtils.scaleSize(32)}} source={require('../../images/Home/close.png')}/>
                              </TouchableOpacity>
                              <Text style={{width:ScreenUtils.scaleSize(570),fontSize:ScreenUtils.setSpText(10),color:'#000000',textAlign:'center'}}>请输入支付密码</Text>
                            </View>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                              <Text style={{fontSize:ScreenUtils.setSpText(12),fontWeight:'700',color:'red'}}>¥ {this.state.money}</Text>
                            </View>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                              <PaymentInput width={550} height={80} value='' callback={(value) => this._paymentCallback(value)}/>
                            </View>
                            {this.renderPayLoading()}
                          </View>
                       </TouchableOpacity>
                    </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});