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

export default class toBeVip extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '成为团美家VIP',
      btnText: '开通VIP',
      statusBarHeight: 0,
      token: '',
      phone: '',
      nowChooseMoney: 1,  //预充值金额当前选中
      prepareMoneyInfo: '',  //预充值金额信息
      vipMoney: '',  //vip价格
      isTobeVip: true,  //是否成为vip，默认是
      isVip: 0, //是否是vip 0不是 1是
      isVipBeOverdue: 0,  //vip是否已经过期 0未过期 1已过期
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
          const { params } = this.props.navigation.state
          //如果是从充值余额页面跳转过来
          if (params.type=='recharge') {
            this.setState({title:'充值余额',btnText:'充值余额',isVip:1,isVipBeOverdue:0})
          }else{
            this.getVipInfo()
          }
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
      this.setState({isVip:result.vip_status,isVipBeOverdue:result.deadline_status},() => {
          if (this.state.isVip == 0) {
            this.setState({title:'成为团美家VIP',btnText:'开通VIP'})
          }else if (this.state.isVip == 1 && this.state.isVipBeOverdue == 1) {
            this.setState({title:'续费团美家VIP',btnText:'续费VIP'})
          }else{
            this.setState({title:'充值余额',btnText:'充值余额'})
          }
      })
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
    this.getPrepareMoney()
    this.getVipMoney()
  }

  getVipMoney(){
    NetUtils.get('user/vipPrice', '?userType=B', (result) => {
      this.setState({vipMoney:result.vip_money})
    });
  }

  getPrepareMoney(){
    NetUtils.get('user/prepareMoney', '?userType=B', (result) => {
      this.setState({prepareMoneyInfo:result})
    });
  }

  //选择充值金额
  choosePrepareMoney(key){
    this.setState({nowChooseMoney:key})
  }

  //是否成为vip按钮
  isTobeVipPress(){
    let isTobeVip = this.state.isTobeVip
    this.setState({isTobeVip:!isTobeVip})
  }

  //下单支付
  gotoPay(navigate){
    const { nowChooseMoney, prepareMoneyInfo, isTobeVip, vipMoney, title } = this.state
    const { params } = this.props.navigation.state
    let money = 0
    switch(nowChooseMoney){
      case 1:
        money = parseInt(prepareMoneyInfo.level_one)
        break;
      case 2:
        money = parseInt(prepareMoneyInfo.level_two)
        break;
      case 3:
        money = parseInt(prepareMoneyInfo.level_three)
        break;
      default:
        break;
    }
    //如果用户是首次成为VIP，必须预充值+VIP付费
    if (title == '成为团美家VIP') {
      if (!isTobeVip) {
        Alert.alert('提示','必须成为会员才能充值！')
        return
      }
      let str = '?userType=B&token=' + this.state.token[1] + '&money=' + money
      //首次成为会员充值支付统一接口
      NetUtils.postJson('market/user/tobeVip', {}, str, (result) => {
        //如果前一个页面是‘placeOrder’，则要把city area buyCarList等信息传到下一页，以便支付成功后返回页面
        if (params.goBackView!=null && params.goBackView == 'placeOrder') {
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'开通团美家VIP会员',canBalancePay:false,orderNum:result.orderNum,total_price:vipMoney+money,invalid_time:result.InvalidTime,goBackView:'placeOrder',city:params.city,area:params.area,buyCarList:params.buyCarList,returnCash:params.returnCash,totalPrice:params.totalPrice})
        }else if (params.goBackView!=null && params.goBackView == 'payment'){
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'开通团美家VIP会员',canBalancePay:false,orderNum:result.orderNum,total_price:vipMoney+money,invalid_time:result.InvalidTime,goBackView:'payment',order_num:params.orderNum})
        }else{
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'开通团美家VIP会员',canBalancePay:false,orderNum:result.orderNum,total_price:vipMoney+money,invalid_time:result.InvalidTime})
        }
      });
    }else if (title == '续费团美家VIP') {
      if (!isTobeVip) {
        Alert.alert('提示','请选择成为会员！')
        return
      }
      let str = '?userType=B&token=' + this.state.token[1] + '&money=' + money
      //续费会员接口
      NetUtils.postJson('market/user/renewVip', {}, str, (result) => {
        //如果前一个页面是‘placeOrder’，则要把city area buyCarList等信息传到下一页，以便支付成功后返回页面
        if (params.goBackView!=null && params.goBackView == 'placeOrder') {
           //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'续费团美家VIP会员',canBalancePay:false,orderNum:result.orderNum,total_price:vipMoney,invalid_time:result.InvalidTime,goBackView:'placeOrder',city:params.city,area:params.area,buyCarList:params.buyCarList,returnCash:params.returnCash,totalPrice:params.totalPrice})
        }else{
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'续费团美家VIP会员',canBalancePay:false,orderNum:result.orderNum,total_price:vipMoney,invalid_time:result.InvalidTime})
        }
      });
    }else{
      let str = '?userType=B&token=' + this.state.token[1] + '&money=' + money
      //充值余额接口
      NetUtils.postJson('market/user/addBalance', {}, str, (result) => {
        //如果前一个页面是‘placeOrder’，则要把city area buyCarList等信息传到下一页，以便支付成功后返回页面
        if (params.goBackView!=null && params.goBackView == 'placeOrder') {
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'余额充值',canBalancePay:false,orderNum:result.orderNum,total_price:money,invalid_time:result.InvalidTime,goBackView:'placeOrder',city:params.city,area:params.area,buyCarList:params.buyCarList,returnCash:params.returnCash,totalPrice:params.totalPrice})
        }else if (params.goBackView!=null && params.goBackView == 'payment'){
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'余额充值',canBalancePay:false,orderNum:result.orderNum,total_price:money,invalid_time:result.InvalidTime,goBackView:'payment',order_num:params.orderNum})
        }else{
          //canBalancePay 不能用余额支付 tipsText 提示语
          navigate('payment',{key:'toBeVip',tipsText:'余额充值',canBalancePay:false,orderNum:result.orderNum,total_price:money,invalid_time:result.InvalidTime})
        }
      });
    }
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'black',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'black',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../images/Home/back_white.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(230-88-this.state.statusBarHeight),backgroundColor:'black'}}>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(85),backgroundColor:'white'}}></View>

                  <ImageBackground style={{top:ScreenUtils.scaleSize(-170),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(170),left:ScreenUtils.scaleSize(24),flexDirection:'row',justifyContent:'center',alignItems:'center'}} source={require('../../images/Market/kuang_bg.png')}>
                    <Image source={require('../../images/Market/huiyuan.png')} style={{width:ScreenUtils.scaleSize(105),height:ScreenUtils.scaleSize(97)}} />
                    <View style={{width:ScreenUtils.scaleSize(14)}}></View>
                    <View style={{width:ScreenUtils.scaleSize(555),height:ScreenUtils.scaleSize(150)}}>
                      <Text style={{top:ScreenUtils.scaleSize(35),color:'#78482f',fontSize:ScreenUtils.setSpText(11)}}>{this.state.phone}</Text>
                      <Text style={{top:ScreenUtils.scaleSize(49),color:'#78482f',fontSize:ScreenUtils.setSpText(7)}}>成为团美家VIP会员，享受更多优惠返现</Text>
                    </View>
                  </ImageBackground>

                  <View style={{top:ScreenUtils.scaleSize(-170),backgroundColor:'white'}}>

                  {this.state.isVip==1 && this.state.isVipBeOverdue==1?null:<View><View style={{height:ScreenUtils.scaleSize(41)}}></View>
                    <Text style={{left:ScreenUtils.scaleSize(26),fontSize:ScreenUtils.setSpText(10),color:'black'}}>预充值</Text>
                    <View style={{height:ScreenUtils.scaleSize(41)}}></View>
                    <View style={{left:ScreenUtils.scaleSize(24),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(156),flexDirection:'row'}}>
                      <TouchableOpacity onPress={() => this.choosePrepareMoney(1)}>
                        <ImageBackground resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(195),height:ScreenUtils.scaleSize(156),justifyContent:'center',alignItems:'center',flexDirection:'row'}} source={this.state.nowChooseMoney==1?require('../../images/Market/chongzhi_choose.png'):require('../../images/Market/chongzhi.png')}>
                          <Text style={{color:this.state.nowChooseMoney==1?'#fea712':'#989898',fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(5)}}>¥ </Text>
                          <Text style={{color:this.state.nowChooseMoney==1?'#fea712':'#989898',fontSize:ScreenUtils.setSpText(11)}}>{this.state.prepareMoneyInfo.level_one}</Text>
                        </ImageBackground>
                      </TouchableOpacity>
                      <View style={{width:ScreenUtils.scaleSize(59)}}></View>
                      <TouchableOpacity onPress={() => this.choosePrepareMoney(2)}>
                        <ImageBackground style={{width:ScreenUtils.scaleSize(195),height:ScreenUtils.scaleSize(156),justifyContent:'center',alignItems:'center',flexDirection:'row'}} source={this.state.nowChooseMoney==2?require('../../images/Market/chongzhi_choose.png'):require('../../images/Market/chongzhi.png')}>
                          <Text style={{color:this.state.nowChooseMoney==2?'#fea712':'#989898',fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(5)}}>¥ </Text>
                          <Text style={{color:this.state.nowChooseMoney==2?'#fea712':'#989898',fontSize:ScreenUtils.setSpText(11)}}>{this.state.prepareMoneyInfo.level_two}</Text>
                        </ImageBackground>
                      </TouchableOpacity>
                      <View style={{width:ScreenUtils.scaleSize(59)}}></View>
                      <TouchableOpacity onPress={() => this.choosePrepareMoney(3)}>
                        <ImageBackground style={{width:ScreenUtils.scaleSize(195),height:ScreenUtils.scaleSize(156),justifyContent:'center',alignItems:'center',flexDirection:'row'}} source={this.state.nowChooseMoney==3?require('../../images/Market/chongzhi_choose.png'):require('../../images/Market/chongzhi.png')}>
                          <Text style={{color:this.state.nowChooseMoney==3?'#fea712':'#989898',fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(5)}}>¥ </Text>
                          <Text style={{color:this.state.nowChooseMoney==3?'#fea712':'#989898',fontSize:ScreenUtils.setSpText(11)}}>{this.state.prepareMoneyInfo.level_three}</Text>
                        </ImageBackground>
                      </TouchableOpacity>
                    </View></View>}

                      <View style={{height:ScreenUtils.scaleSize(33)}}></View>

                      {/* 判断是否VIP*/}
                      {this.state.isVipBeOverdue==0?null:<View>
                        <ImageBackground style={{width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(164),left:ScreenUtils.scaleSize(24),flexDirection:'row',justifyContent:'center',alignItems:'center'}} source={require('../../images/Market/vip_price_money.png')}>
                          <View style={{width:ScreenUtils.scaleSize(590),height:ScreenUtils.scaleSize(164)}}>
                            <Text style={{color:'black',fontWeight:'500',fontSize:ScreenUtils.setSpText(9),top:ScreenUtils.scaleSize(38)}}>会员费用：<Text style={{color:'#df1d1d'}}>¥{this.state.vipMoney}</Text><Text style={{color:'#989898'}}>/月</Text></Text>
                            <Text style={{top:ScreenUtils.scaleSize(59),color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>到期时间 : {NetUtils.getExpireTime()}</Text>
                          </View>
                          <TouchableOpacity onPress={() => this.isTobeVipPress()} style={{width:ScreenUtils.scaleSize(64),height:ScreenUtils.scaleSize(164)}}>
                            <Image style={{top:ScreenUtils.scaleSize(34),left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(36),height:ScreenUtils.scaleSize(36)}} source={this.state.isTobeVip?require('../../images/Market/tobevip_choose.png'):require('../../images/Market/tobevip.png')} />
                          </TouchableOpacity>
                        </ImageBackground>

                        <View style={{left:ScreenUtils.scaleSize(24),width:ScreenUtils.scaleSize(702),height:ScreenUtils.scaleSize(77),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                          <TouchableOpacity onPress={() => navigate('vipPrivilege')} style={{height:ScreenUtils.scaleSize(57),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:ScreenUtils.scaleSize(43)}}></View>
                            <Image style={{width:ScreenUtils.scaleSize(25),left:ScreenUtils.scaleSize(-8),height:ScreenUtils.scaleSize(25)}} source={require('../../images/Market/tequan.png')} />
                            <Text style={{fontSize:ScreenUtils.setSpText(7),color:'#989898'}}>会员特权说明</Text>
                            <View style={{width:ScreenUtils.scaleSize(43)}}></View>
                          </TouchableOpacity>
                          <View style={{width:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(25),backgroundColor:'gray'}}></View>
                          <TouchableOpacity onPress={() => navigate('vipAgreement')} style={{height:ScreenUtils.scaleSize(57),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <View style={{width:ScreenUtils.scaleSize(43)}}></View>
                            <Image style={{width:ScreenUtils.scaleSize(25),left:ScreenUtils.scaleSize(-8),height:ScreenUtils.scaleSize(25)}} source={require('../../images/Market/shuoming.png')} />
                            <Text style={{fontSize:ScreenUtils.setSpText(7),color:'#fea712'}}>会员服务协议</Text>
                            <View style={{width:ScreenUtils.scaleSize(43)}}></View>
                          </TouchableOpacity>
                        </View>
                      </View>}

                  </View>

                  <View style={{flex:1,backgroundColor:'#EEEEEE'}}></View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(125),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => this.gotoPay(navigate)} style={{width:ScreenUtils.scaleSize(703),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',justifyContent:'center',alignItems:'center',borderRadius:ScreenUtils.scaleSize(10)}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>{this.state.btnText}</Text>
                    </TouchableOpacity>
                  </View>
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