import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Image,
    ScrollView,
    Modal,
    NativeModules,
    Platform,
    Alert,
    FlatList,
    DeviceEventEmitter,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import NetUtils from '../PublicComponents/NetUtils';
import DateTimePicker from 'react-native-modal-datetime-picker';

var orderInfoArr = [];

export default class orderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
          title: '订单详情',
          nextStepValue: '', 
          businessIcon: '',
          sendPeopleTextInput: '',
          contectNumTextInput: '',
          sendTimeTextInput: '',
          orderTab: 0,
          sendOrderShow: false,
          phone: '',
          token: '',
          operateType: '',
          orderInfo: [],
          orderState: '',
          statusBarHeight: 0,
          isDateTimePickerVisible: false,
          findPhysicalGoodsDeliver: [],
          buckleMoney: 0,
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

  componentDidMount () {
    this.setStatusBarHeight();
    this.loadPhone();
    this.loadToken();
    this.loadOperateType();
    setTimeout(() => {
      this.loadOrderInfo();
    },300);
  }

  loadOrderInfo(){
    const { params } = this.props.navigation.state;
    if (params.orderTab == 0) {
      this.setState({orderState:'已付款'})
    }else if (params.orderTab == 1) {
      this.setState({orderState:'已完成'})
    }else{
      this.setState({orderState:'退款申请中'})
    }
    let operateType = 0;
    if (this.state.operateType == 1 || this.state.operateType == 5) {
      operateType = 2;
    }else{
      operateType = 3;
    }
    let str = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&user_type=B' + '&order_num=' + params.order_num + '&goods_type='+operateType;
    NetUtils.get('order/getGoodsOrderByOrderNum', str, (result) => {
      console.log(result)
        if (this.state.operateType == 1) {
          if (result.findPhysicalGoodsDeliver!=null) {
            this.setState({findPhysicalGoodsDeliver:result.findPhysicalGoodsDeliver})
          }
          this.setState({orderInfo:result.physicalGoodsOrderDTO});
          if (result.physicalGoodsOrderDTO.pay_status == 5) {
            this.setState({orderState:'退款成功'});
          }
          let buckleMoney = result.physicalGoodsOrderDTO.payment - result.physicalGoodsOrderDTO.business_total_price
          this.setState({buckleMoney:buckleMoney.toFixed(2)})
        }else{
          this.setState({orderInfo:result.couponGoodsOrderDTO});
          if (result.couponGoodsOrderDTO.pay_status == 5) {
            this.setState({orderState:'退款成功'});
          }
          let buckleMoney = result.couponGoodsOrderDTO.payment - result.couponGoodsOrderDTO.business_total_price
          this.setState({buckleMoney:buckleMoney.toFixed(2)})
        }
    });
  }
      renderCommodityInfo(){
        if (this.state.operateType != 1 && this.state.operateType != 5) {
          return(
                  <View>
                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(120),backgroundColor:'white'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(40),color:'black',fontSize:ScreenUtils.setSpText(8)}}>商品名称：{this.state.orderInfo.goods_name}</Text>
                    </View>
                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>商品类型：{this.state.orderInfo.goods_type==0?'代金券':'套餐券'}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>商品数量：{this.state.operateType == 1?'':this.state.orderInfo.buy_num}件</Text>
                      </View>
                  </View>
                )
        }else{
          return (<FlatList 
                    style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}
                    data={this.state.orderInfo.orderGoodsRelateList}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                />)
        }
      }

      _renderFenge= () => (
          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
      )

      _renderItem(item){
        let sku = ''
        if (item.sku!=null) {
          sku=item.sku
        }
        let propertiesArr = []
        let properties = ''
        if (item.properties!=null) {
          propertiesArr = item.properties.split('@@')
          properties = propertiesArr.join(',')
          if (sku!='') {
            sku+= ','+properties
          }else{
            sku = properties
          }
        }
        return (
                 <View>
                    <View style={{flexDirection:'row',borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center'}}>
                        <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80),borderRadius:ScreenUtils.scaleSize(80)/2}}><Image style={{borderRadius:ScreenUtils.scaleSize(80)/2,borderColor:'black',borderWidth:1,width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80)}} source={{uri:item.img}}/></View>
                        <Text style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(500),color:'black',fontSize:ScreenUtils.setSpText(8)}}>  {item.goods_name}</Text>
                    </View>
                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>商品类型：{item.label}</Text>
                      </View>
                      {sku!=''?<View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>商品规格：{sku}</Text>
                      </View>:null}
                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>商品数量：{item.buy_num}件</Text>
                      </View>
                  </View>
               )
      }

      _sendPeopleTextInputChangeText(value){
        this.setState({sendPeopleTextInput:value});
      }

      _contectNumTextInputChangeText(value){
        this.setState({contectNumTextInput:value});
      }

      _cancelOrderPress(){
        Alert.alert('提示','确认取消订单？余额将返回给用户',[{text:'是',onPress: () => this._cancelOrder()},{text:'否'}]);
      }

      _cancelOrder(){
        const { params } = this.props.navigation.state;
        let str = '?token=' + this.state.token[1] + '&orderNum=' + params.order_num;
        NetUtils.get('business/cancelOrder', str, (result) => {
            Alert.alert('提示','取消订单成功！',[{text:'确认',onPress: () => this._goToOrderAdmin()}])
        });
      }

      _completeOrder(){
        const { params } = this.props.navigation.state;
        let operateType = 0;
        if (this.state.operateType == 1) {
          operateType = 2;
        }else{
          operateType = 3;
        }
        let str = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&order_status=3' + '&user_type=B' + '&order_num=' + params.order_num + '&goods_type='+operateType;
        NetUtils.get('order/updateGoodsOrderStatus', str, (result) => {
            Alert.alert('提示','订单已完成！',[{text:'确认',onPress: () => this._goToOrderAdmin()}])
        });
      }

      _setSendOrderShow(){
        let show = this.state.sendOrderShow;
        this.setState({sendOrderShow:!show});
      }

      _completeOrderPress(){
        Alert.alert('提示','确认已完成订单？',[{text:'是',onPress: () => this._completeOrder()},{text:'否'}]);
      }

      _approvalOfRefund(){
        const { params } = this.props.navigation.state;
        let order_type = 1;
        if (this.state.operateType == 1) {
          order_type = 1;
        }else{
          order_type = 2;
        }
        let str = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&order_type=' + order_type + '&order_num=' + params.order_num;
        NetUtils.get('business/agreeRefund', str, (result) => {
            Alert.alert('提示','退款成功！',[{text:'确认',onPress: () => this._goToOrderAdmin()}])
        });
      }

      _tongyituikuan(){
        Alert.alert('提示','确认同意退款？',[{text:'是',onPress: () => this._approvalOfRefund()},{text:'否'}]);
      }

      renderBtn(){
        if(this.state.operateType == 1){
          if (this.state.orderState == '已付款') {
            if (orderInfoArr.orderDistributionType == '到店消费') {
              return (
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100)}}>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(92),justifyContent:'center',flexDirection:'row'}}>
                        <Button onPress={() => this._cancelOrderPress()} style={{width:ScreenUtils.scaleSize(684),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#F1A93F',borderRadius:0}}>
                          <Text style={{color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消订单</Text>
                        </Button>
                      </View>
                    </View>
              );
           }
          if (this.state.operateType == 1) {
            if(this.state.orderInfo.deliver_type == 1 && this.state.findPhysicalGoodsDeliver == ''){
              return (
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100)}}>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(92),justifyContent:'center',flexDirection:'row'}}>
                        <Button onPress={() => this._setSendOrderShow()} style={{width:ScreenUtils.scaleSize(342),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#F1A93F',borderRadius:0}}>
                          <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>录入配送</Text>
                        </Button>
                        <Button onPress={() => this._cancelOrderPress()} style={{width:ScreenUtils.scaleSize(342),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#D22D26',borderRadius:0}}>
                          <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消订单</Text>
                        </Button>
                      </View>
                    </View>
              );
          }else{
              return (
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100)}}>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(92),justifyContent:'center',flexDirection:'row'}}>
                        <Button onPress={() => this._completeOrderPress()} style={{width:ScreenUtils.scaleSize(342),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#F1A93F',borderRadius:0}}>
                          <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>完成订单</Text>
                        </Button>
                        <Button onPress={() => this._cancelOrderPress()} style={{width:ScreenUtils.scaleSize(342),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#D22D26',borderRadius:0}}>
                          <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消订单</Text>
                        </Button>
                      </View>
                    </View>
              );
            }
          }
          }else if(this.state.orderState == '退款申请中'){
            return (
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(92)}}>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(92),justifyContent:'center',flexDirection:'row'}}>
                        <Button onPress={() => this._tongyituikuan()} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#F1A93F',borderRadius:0}}>
                          <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>同意退款</Text>
                        </Button>
                      </View>
                    </View>
              );
          }
        }
      }

    renderOrderSend(){
      if (this.state.operateType == 1) {
        let send_type = ''
        if (this.state.orderInfo.deliver_type==0) {
          send_type = '到店自取'
          return (
                 <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                   <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单配送：{send_type}</Text>
                 </View>
               )
        }else if (this.state.orderInfo.deliver_type==1) {
          send_type = '商家配送'
          return (
                 <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                   <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单配送：{send_type}</Text>
                 </View>
               )
        }else{
          send_type = '到店用餐'
          return (
                 <View>
                   <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                     <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单配送：{send_type}</Text>
                   </View>
                   <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                     <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>餐座号：{this.state.orderInfo.table_number}</Text>
                   </View>
                 </View>
               )
        }
      }
    }

    renderUserInfo(){
      if (this.state.operateType == 1 && this.state.orderInfo.receiving_address_id != 0) {
        return (
                  <View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91),backgroundColor:'#EEEEEE',justifyContent:'center'}}>
                        <Text style={{left:ScreenUtils.scaleSize(39),width:ScreenUtils.scaleSize(200),color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>用户信息</Text>
                      </View>

                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>地址：{this.state.orderInfo.province}{this.state.orderInfo.city}{this.state.orderInfo.area}{this.state.orderInfo.street}{this.state.orderInfo.receiving_address}</Text>
                    </View>

                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>联系人姓名：{this.state.orderInfo.consignee}</Text>
                    </View>

                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>联系电话：{this.state.orderInfo.contact_number}</Text>
                    </View>
                  </View>
               );
      }
    }

    _goToOrderAdmin(){
      const { goBack } = this.props.navigation;
      goBack();
      DeviceEventEmitter.emit('orderAdministrationListener','');
    }

    _deliverGoods(goBack){
      if(this.state.contectNumTextInput != '' && this.state.sendPeopleTextInput != '' && this.state.sendTimeTextInput != ''){
        this._setSendOrderShow();
        let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1];
        let jsonObj = {order_num:this.state.orderInfo.order_num,contact_number:this.state.contectNumTextInput,deliveryman:this.state.sendPeopleTextInput,arrival_time:1539309644};
         NetUtils.postJson('physicalGoods/addPhysicalGoodsDeliver',jsonObj,params,(result) => {
            Alert.alert('提示','录入成功！',[{text:'确认',onPress: () => this._goToOrderAdmin(goBack)}])
         });
       }else if (this.state.contectNumTextInput == '') {
          Alert.alert('提示','联系电话不能为空！')
       }else if (this.state.sendPeopleTextInput == '') {
          Alert.alert('提示','配送人员不能为空！')
       }else{
          Alert.alert('提示','预计时间不能为空！')
       }
    }

    _setDateTimePickerShow(){
      let isDateTimePickerVisible = this.state.isDateTimePickerVisible;
      this.setState({isDateTimePickerVisible:!isDateTimePickerVisible});
    }

    //格式化日期,
      formatDate(date,format){
        var paddNum = function(num){
          num += "";
          return num.replace(/^(\d)$/,"0$1");
        }
        //指定格式字符
        var cfg = {
           yyyy : date.getFullYear() //年 : 4位
          ,yy : date.getFullYear().toString().substring(2)//年 : 2位
          ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
          ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
          ,d  : date.getDate()   //日 : 如果1位的时候不补0
          ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
          ,hh : date.getHours()  //时
          ,mm : date.getMinutes() //分
          ,ss : date.getSeconds() //秒
        }
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
      } 

    handleDatePicked(data){
      this._hideDateTimePicker()
      let time = this.formatDate((new Date(data)),"yyyy-MM-dd hh:mm");
      this.setState({sendTimeTextInput:time});
    }

    _handleDatePicked = (data) => this.handleDatePicked(data);

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    renderSendInfo(){
      if (this.state.findPhysicalGoodsDeliver != '') {
        return (
                  <View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91),backgroundColor:'#EEEEEE',justifyContent:'center'}}>
                        <Text style={{left:ScreenUtils.scaleSize(39),width:ScreenUtils.scaleSize(200),color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>配送信息</Text>
                      </View>

                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>配送员姓名：{this.state.findPhysicalGoodsDeliver.deliveryman}</Text>
                    </View>

                    <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>联系电话：{this.state.findPhysicalGoodsDeliver.contact_number}</Text>
                    </View>
                  </View>
               );
      }
    }

    printOrder(){
      const { params } = this.props.navigation.state
      let str = '?token=' + this.state.token[1] + '&orderNum=' + params.order_num
      NetUtils.get('order/print', str, (result) => {
        Alert.alert('提示',result);
      })
    }

    renderPrintBtn(){
      if (this.state.operateType == 1) {
        return (
                 <TouchableOpacity onPress={() => this.printOrder()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(150),textAlign:'right',color:'white'}}>打印</Text>
                 </TouchableOpacity>
               )
      }else{
        return (
                 <View style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                 </View>
               )
      }
    }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{left:ScreenUtils.scaleSize(50),color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                      {this.renderPrintBtn()}
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>

                    <ScrollView>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91),backgroundColor:'#EEEEEE',justifyContent:'center'}}>
                        <Text style={{left:ScreenUtils.scaleSize(39),width:ScreenUtils.scaleSize(200),color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>订单信息</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单号：{this.state.orderInfo.order_num}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单状态：{this.state.orderState}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>下单时间：{this.state.orderInfo.create_time}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单类型：{this.state.operateType == 1?'实体商品':'消费券'}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单金额：¥ {this.state.orderInfo.payment}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>实际金额：¥ {this.state.orderInfo.business_total_price}</Text>
                      </View>

                      <View style={{borderBottomColor:'#EEEEEE',borderBottomWidth:1,width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white'}}>
                        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(500),top:ScreenUtils.scaleSize(20),color:'black',fontSize:ScreenUtils.setSpText(8)}}>平台技术服务费：¥ {this.state.buckleMoney}</Text>
                      </View>

                      {this.renderOrderSend()}

                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91),backgroundColor:'#EEEEEE',justifyContent:'center'}}>
                        <Text style={{left:ScreenUtils.scaleSize(39),width:ScreenUtils.scaleSize(200),color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>商品信息</Text>
                      </View>

                      {this.renderCommodityInfo()}

                      {this.renderUserInfo()}

                      {this.renderSendInfo()}
                    </ScrollView>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(57)}}></View>

                    {this.renderBtn()}

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(27)}}></View>

                    <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.sendOrderShow}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'center'}}>
                          <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(450),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(20),alignItems:'center'}}>
                            <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(16)}}></View>
                            <Text style={{top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(150),color:'black',fontSize:ScreenUtils.setSpText(8)}}>配送信息</Text>
                            <View style={{left:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(66),flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>配送人员</Text>
                              <View style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(66),borderWidth:1,borderColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(5),justifyContent:'center',alignItems:'center'}}>
                                <TextInput
                                  placeholder='请输入配送人员'
                                  placeholderTextColor='gray'
                                  maxLength={30}
                                  autoCorrect={false}
                                  style={{color:'black',padding:0,width:ScreenUtils.scaleSize(460)}}
                                  onChangeText={(sendPeopleTextInput) => this._sendPeopleTextInputChangeText(sendPeopleTextInput)}
                                  value={this.state.sendPeopleTextInput}
                                  underlineColorAndroid='transparent'
                                />
                              </View>
                            </View>
                            <View style={{left:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(62),width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(66),flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>联系电话</Text>
                              <View style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(66),borderWidth:1,borderColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(5),justifyContent:'center',alignItems:'center'}}>
                                <TextInput
                                  placeholder='请输入联系电话'
                                  placeholderTextColor='gray'
                                  maxLength={11}
                                  autoCorrect={false}
                                  style={{color:'black',padding:0,width:ScreenUtils.scaleSize(460)}}
                                  onChangeText={(contectNumTextInput) => this._contectNumTextInputChangeText(contectNumTextInput)}
                                  value={this.state.contectNumTextInput}
                                  underlineColorAndroid='transparent'
                                />
                              </View>
                            </View>
                            <View style={{left:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(84),width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(66),flexDirection:'row',alignItems:'center'}}>
                              <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>预计时间</Text>
                              <TouchableOpacity onPress={() => this._setDateTimePickerShow()} style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(66),justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                                  <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8),left:ScreenUtils.scaleSize(-20)}}>{this.state.sendTimeTextInput}</Text>
                                  <Image resizeMode={'stretch'} source={require('./images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                                  <DateTimePicker
                                    mode={'time'}
                                    titleIOS={'选择时间'}
                                    cancelTextIOS={'取消'}
                                    confirmTextIOS={'确定'}
                                    isVisible={this.state.isDateTimePickerVisible}
                                    onConfirm={this._handleDatePicked}
                                    onCancel={this._hideDateTimePicker}
                                  />
                              </TouchableOpacity>
                            </View>
                            <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE',top:ScreenUtils.scaleSize(106)}}></View>
                            <View style={{top:ScreenUtils.scaleSize(106),width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(77),flexDirection:'row',borderTopWidth:1,borderTopColor:'#EEEEEE'}}>
                              <TouchableOpacity onPress={() => this._setSendOrderShow()} style={{width:ScreenUtils.scaleSize(710/2),height:ScreenUtils.scaleSize(77),alignItems:'center',justifyContent:'center',borderRightWidth:1,borderRightColor:'#EEEEEE'}}>
                                <Text style={{color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>取消</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => this._deliverGoods(goBack)} style={{width:ScreenUtils.scaleSize(710/2),height:ScreenUtils.scaleSize(77),alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'#fea712',fontSize:ScreenUtils.setSpText(8)}}>发货</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
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
});