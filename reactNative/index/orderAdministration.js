import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    NativeModules,
    Platform,
    Alert,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../PublicComponents/NetUtils';
import JPushModule from 'jpush-react-native';
import Permissions from 'react-native-permissions';

export default class orderAdministration extends Component {

    constructor(props) {
    super(props);
    this.state = {
      title: '订单管理',
      nextStepValue: '',
      businessIcon: '',
      orderInfoArr: [],
      orderTab: 0,
      phone: '',
      token: '',
      operateType: '',
      pageNum: 1,
      pageSize: 10,
      orderArray: '',
      statusBarHeight: 0,
      isRefresh: false,
      isLoadMore: false,
      isShowBankCardList: false,
      scanShow: false,
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
        if (ret == 2) {
          this.setState({scanShow:true})
        }
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

  tuisong(){
    if (Platform.OS === 'android') {
    // 通知 JPushModule 初始化完成，发送缓存事件。
     JPushModule.notifyJSDidLoad((resultCode) => {
     });
    }
    // 接收自定义消息事件
    JPushModule.addReceiveCustomMsgListener((message) => {
        
    });
    // 接收推送事件
    JPushModule.addReceiveNotificationListener((message) => {
        
    });

    // 点击推送事件,打开通知
    JPushModule.addReceiveOpenNotificationListener((map) => {
       // alert(JSON.stringify(map)) ;
       // const { navigate } = this.props.navigation;
       // navigate('homes')
       // let extras = JSON.parse(map.extras)
       let extras = ''
       if (Platform.OS === 'android') {
         extras = JSON.parse(map.extras)
       }else{
         extras = map.extras
       }
       if (extras.flag == 0) {
         this._changeTabTitle(0)
       }else{
         this._changeTabTitle(1)
       }
       DeviceEventEmitter.emit('changeTab','')
       // 可执行跳转操作，也可跳转原生页面
       // this.props.navigation.navigate("SecondActivity");
    });
  }

  componentDidMount () {
    this.tuisong()
    this.deEmitter = DeviceEventEmitter.addListener('orderAdministrationListener', (a) => {
        this.loadPhone();
        this.loadToken();
        this.loadOperateType();
        setTimeout(() => {
            this.loadOrderInfo(this.state.orderTab)
            this._getBankCardList()
        },300);
    });
    this.setStatusBarHeight();
    this.loadPhone();
    this.loadToken();
    this.loadOperateType();
    setTimeout(() => {
      this.loadOrderInfo(0);
      this._getBankCardList();
    },300);
  }

  componentWillUnmount(){
     this.deEmitter.remove();
  };

  loadOrderInfo(i){
    let operateType = 0;
    if (this.state.operateType == 1) {
      operateType = 2;  //实体商品
    }else{
      operateType = 3;  //商品券
    }
    let status = 0;
    if (operateType == 3) {
      if (i == 0) {
        status = 1;
      }else if (i == 1) {
        status = 2;
      }else{
        status = 5;
      }
    }else{
      if (i == 0) {
        status = -2;
      }else if (i == 1) {
        status = 3;
      }else{
        status = 5;
      }
    }
    let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize + '&goods_type='+operateType+'&status='+status+'&is_comment=-1&user_type=B';
    NetUtils.get('order/pageGoodsOrderByParm', params, (result) => {
      console.log(result)
        if (this.state.operateType == 1) {
          this.setState({orderArray:result.physicalGoodsOrderList});
          console.log(result.physicalGoodsOrderList)
        }else{
          this.setState({orderArray:result.couponGoodsOrderList});
        }
    });
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    if (params.key == 'success') {
      this.loadOrderInfo(0);
    }
    if (params.scanResult != null) {
      if (params.scanResult.indexOf("app=clb") != -1) {
        let result = params.scanResult.split('clb');
        let jsonObj = JSON.parse(result[1]);

        if (this.state.operateType != 1 && jsonObj.type == 'coupon') {
            let str = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&order_status=2' + '&user_type=B' + '&order_num=' + jsonObj.order_num + '&goods_type=3';
            NetUtils.get('order/updateGoodsOrderStatus', str, (result) => {
                Alert.alert('提示','优惠券使用成功！',[{text:'确认',onPress: () => this.loadOrderInfo(this.state.orderTab)}])
            });
          }
      }else{
        Alert.alert('提示','二维码有误！');
      }
    }
  }

  _fastLoginChange(obj){
    this.setState({orderTab:obj.i});
    this.loadOrderInfo(obj.i);
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderHeader= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>
  )

  _detailsBtnPress(item){
    const { navigate } = this.props.navigation;
    navigate('orderDetails',{order_num:item.order_num,orderTab:this.state.orderTab});
  }

  _renderItem(item){
    if (this.state.operateType == 1) {
      let btnHeight = 0;
      if (this.state.orderTab == 0) {
          btnHeight = ScreenUtils.scaleSize(70);
      }
      let sendType = '';
      if (item.deliver_type == 0) {
        sendType = '到店自取';
      }else if(item.deliver_type == 1){
        sendType = '商家配送';
      }else{
        sendType = '到店用餐';
      }
      let sendStr = '';
      if (item.order_status == 2) {
        sendStr = '配送中';
      }
      let order_status = '';
      if (item.pay_status == 1) {
        order_status = '已支付';
      }else if (item.pay_status == 3) {
        order_status = '退款申请中';
      }else if (item.pay_status == 5) {
        order_status = '退款成功'
      }
      if (this.state.orderTab == 1) {
        order_status = '已完成'
      }
      return (
        <View style={{left:ScreenUtils.scaleSize(16),borderRadius:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(718),backgroundColor:'white'}}>
          <View style={{width:ScreenUtils.scaleSize(718),height:ScreenUtils.scaleSize(89),alignItems:'center',flexDirection:'row'}}>
            <Text style={{left:ScreenUtils.scaleSize(27),width:ScreenUtils.scaleSize(580),fontSize:ScreenUtils.setSpText(9),color:'black'}}> 订单号： {item.order_num}</Text>
            <TouchableOpacity onPress={() => this._detailsBtnPress(item)} style={{flexDirection:'row',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'flex-end',alignItems:'center'}}>
                <Text style={{fontSize:ScreenUtils.setSpText(7),color:'#fea712'}}>订单详情</Text>
                <View style={{width:ScreenUtils.scaleSize(10),height:ScreenUtils.scaleSize(60)}}></View>
                <Image style={{top:-ScreenUtils.scaleSize(0),width:ScreenUtils.scaleSize(12),height:ScreenUtils.scaleSize(20)}} source={require('./images/Home/Order/more1.png')}/>
                <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(60)}}></View>
            </TouchableOpacity>
          </View>
          <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>

          <View style={{width:ScreenUtils.scaleSize(730),flexDirection:'row'}}>
            <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(260)}}>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>订单时间：{item.create_time}</Text></View>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>消费类型：实体消费</Text></View>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>配送方式：{sendType}  {sendStr}</Text></View>
              {sendType=='到店用餐'?<View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>就餐座号：{item.table_number}</Text></View>:null}
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>订单状态：<Text style={{fontSize:ScreenUtils.setSpText(7),color:order_status=='退款成功'||order_status=='已完成'?'green':'red'}}>{order_status}</Text></Text></View>
            </View>
            <View style={{width:ScreenUtils.scaleSize(170),justifyContent:'center',alignItems:'flex-end'}}><Text style={{color:'red',fontSize:ScreenUtils.setSpText(10)}}>¥{item.payment}</Text></View>
          </View>

        </View>
      );
    }else{
      let order_status = '';
      if (item.pay_status == 1) {
        order_status = '已支付';
      }else if (item.pay_status == 3) {
        order_status = '退款申请中';
      }else if (item.pay_status == 5) {
        order_status = '退款成功'
      }
      if (this.state.orderTab == 1) {
        order_status = '已完成'
      }
      return (
        <View style={{left:ScreenUtils.scaleSize(16),borderRadius:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(718),backgroundColor:'white'}}>
          <View style={{width:ScreenUtils.scaleSize(718),height:ScreenUtils.scaleSize(89),alignItems:'center',flexDirection:'row'}}>
            <Text style={{left:ScreenUtils.scaleSize(27),width:ScreenUtils.scaleSize(600),fontSize:ScreenUtils.setSpText(9),color:'black'}}>订单号： {item.order_num}</Text>
            <TouchableOpacity onPress={() => this._detailsBtnPress(item)} style={{flexDirection:'row',width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(50),justifyContent:'flex-end',alignItems:'center'}}>
                <Text style={{fontSize:ScreenUtils.setSpText(7),color:'#fea712'}}>订单详情</Text>
                <View style={{width:ScreenUtils.scaleSize(10),height:ScreenUtils.scaleSize(60)}}></View>
                <Image style={{top:-ScreenUtils.scaleSize(0),width:ScreenUtils.scaleSize(12),height:ScreenUtils.scaleSize(20)}} source={require('./images/Home/Order/more1.png')}/>
                <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(60)}}></View>
            </TouchableOpacity>
          </View>
          <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>

          <View style={{width:ScreenUtils.scaleSize(718),height:ScreenUtils.scaleSize(215),flexDirection:'row'}}>
            <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(215)}}>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(43),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item.goods_name}</Text></View>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(43),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>订单时间：{item.create_time}</Text></View>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(43),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>商品类型：{item.goods_type==0?'代金券':'套餐券'}</Text></View>
              <View style={{width:ScreenUtils.scaleSize(530),height:ScreenUtils.scaleSize(43),justifyContent:'center',alignItems:'center'}}><Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(530),color:'#989898',fontSize:ScreenUtils.setSpText(7)}}>订单状态：<Text style={{fontSize:ScreenUtils.setSpText(7),color:order_status=='退款成功'||order_status=='已完成'?'green':'red'}}>{order_status}</Text></Text></View>
            </View>
            <View style={{width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(215),justifyContent:'center',alignItems:'flex-end'}}><Text style={{color:'red',fontSize:ScreenUtils.setSpText(10)}}>¥{item.business_total_price}</Text></View>
          </View>

        </View>
      );
    }
  }

  renderBtnView(item){
    if (this.state.orderTab == 0) {
        if (item.receiving_address_id == 0) {
            return (
                  <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(70)}}>
                    <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(70),justifyContent:'flex-end',flexDirection:'row'}}>
                      <Button onPress={() => this._cancelOrderPress(item)} style={{top:ScreenUtils.scaleSize(9),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(60),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消订单</Text>
                      </Button>
                    </View>
                  </View>
            );
        }else{
            return (
                  <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(70)}}>
                    <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(70),justifyContent:'flex-end',flexDirection:'row'}}>
                      <Button onPress={() => this._sendOrderPress(item)} style={{top:ScreenUtils.scaleSize(9),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(60),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>录入配送</Text>
                      </Button>
                      <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(70)}}></View>
                      <Button onPress={() => this._cancelOrderPress(item)} style={{top:ScreenUtils.scaleSize(9),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(60),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消订单</Text>
                      </Button>
                    </View>
                  </View>
            );
        }
    }else{
        return (
          <View></View>
        );
    }
  }

  _cancelOrderPress(item){

  }

  _sendOrderPress(item){

  }

  _completeOrderPress(item){

  }

  _scanPress(navigate){
    Permissions.check('camera').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      if (response == 'denied') {
        if (Platform.OS == 'ios') {
          Alert.alert('提示','监测到用户尚未打开相机权限，是否马上打开？',[{text:'是',onPress:Permissions.openSettings},{text:'否'}])
        }else{
          Alert.alert('提示','监测到用户尚未打开相机权限，是否马上打开？',[{text:'是',onPress:this.requestAndroidCamera(navigate)},{text:'否'}])
        }
      }else if (response == 'undetermined') {
        if (Platform.OS == 'ios') {
          Alert.alert('提示','监测到用户尚未打开相机权限，是否马上打开？',[{text:'是',onPress:this._requestPermission()},{text:'否'}])
        }else{
          Alert.alert('提示','监测到用户尚未打开相机权限，是否马上打开？',[{text:'是',onPress:this.requestAndroidCamera(navigate)},{text:'否'}])
        }
      }else if (response == 'authorized'){
          navigate('scanView',{operateType:this.state.operateType,phone:this.state.phone,token:this.state.token});
      }
    })
  }

  _requestPermission() {
    Permissions.request('camera').then(response => {
       if (response == 'authorized') {
         navigate('scanView',{operateType:this.state.operateType,phone:this.state.phone,token:this.state.token});
       }else{
         Alert.alert('提示','权限请求失败')
       }
    })
  }

  requestAndroidCamera(navigate){
    Permissions.request('camera').then(response => {
      if (response == 'authorized') {
        navigate('scanView',{operateType:this.state.operateType,phone:this.state.phone,token:this.state.token});
      }else{
        Alert.alert('提示','用户拒绝授权')
      }
    })
   }

  _changeTabTitle(i){
    this.setState({orderTab:i});
    this.loadOrderInfo(i);
  }

  _onRefresh(i){
    if (!this.state.isRefresh) {
      this.loadOrderInfo(i);
    }
  }

  _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize});
      setTimeout(() => {
        this.loadOrderInfo(i);
      },300);
    }
  }

  renderOrderList(){
    if (this.state.orderArray != '') {
      return (
               <FlatList 
                    style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}
                    data={this.state.orderArray}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                    ListHeaderComponent={this._renderHeader}
                    onRefresh={() => this._onRefresh(this.state.orderTab)}
                    refreshing={this.state.isRefresh}
                    onEndReached={() => this._onLoadMore(this.state.orderTab)}
                    onEndReachedThreshold={0.1}
                />
             );
    }else{
      return (
               <ScrollView style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(710)}}>
                 <View style={{alignItems:'center',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(400)}}>
                    <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(96),width:ScreenUtils.scaleSize(182),height:ScreenUtils.scaleSize(194)}} source={require('./images/no_order.png')}/>
                    <Text style={{top:ScreenUtils.scaleSize(143),color:'black',fontSize:ScreenUtils.setSpText(8)}}>暂无相关订单</Text>
                 </View>
               </ScrollView>
             );
    }
  }

  _getBankCardList(){
    let str = '?mobile='+this.state.phone+'&token='+this.state.token[1];
    NetUtils.get('business/findBusinessAccount', str, (result) => {
      // alert(result)
      if (result == null) {
        this.setState({isShowBankCardList:true})
      }else{
        this.setState({isShowBankCardList:false})
      }
    });
  }

  renderBankListShow(navigate){
    if (this.state.isShowBankCardList) {
      return (
               <TouchableOpacity onPress={() => navigate('bankCardList')} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(70),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                 <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>尚未提供收款账号，请完善信息</Text>
                 <Image style={{left:ScreenUtils.scaleSize(20),resizeMode:'stretch',width:ScreenUtils.scaleSize(13*1.5),height:ScreenUtils.scaleSize(23*1.5)}} source={require('./images/shopSecond/shop_second_more.png')}/>
               </TouchableOpacity>
             )
    }
  }

  renderScan(navigate){
    if (this.state.scanShow) {
      return (
               <TouchableOpacity onPress={() => this._scanPress(navigate)} style={{left:ScreenUtils.scaleSize(80),width:ScreenUtils.scaleSize(50),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                 <Image style={{width:ScreenUtils.scaleSize(59),height:ScreenUtils.scaleSize(59)}} source={require('./images/Home/Order/scan.png')} />
               </TouchableOpacity>
             )
    }else{
      return (
               <View style={{left:ScreenUtils.scaleSize(80),width:ScreenUtils.scaleSize(50),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
               </View>
             )
    }
  }

    render() {
      const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                  <Text style={{color:'white',fontSize:ScreenUtils.setSpText(11),left:ScreenUtils.scaleSize(80),width:ScreenUtils.scaleSize(590),textAlign:'center'}}>{this.state.title}</Text>
                  {this.renderScan(navigate)}
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                </View>

               <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this._changeTabTitle(0)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(90),borderBottomColor:this.state.orderTab == 0 ? '#fea712' : 'transparent',borderBottomWidth:1,justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.orderTab == 0 ? '#fea712' : '#434343'}}>新订单</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._changeTabTitle(1)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(90),borderBottomColor:this.state.orderTab == 1 ? '#fea712' : 'transparent',borderBottomWidth:1,justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.orderTab == 1 ? '#fea712' : '#434343'}}>已完成</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._changeTabTitle(2)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(90),borderBottomColor:this.state.orderTab == 2 ? '#fea712' : 'transparent',borderBottomWidth:1,justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.orderTab == 2 ? '#fea712' : '#434343'}}>退款中</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {this.renderOrderList()}

                {this.renderBankListShow(navigate)}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
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