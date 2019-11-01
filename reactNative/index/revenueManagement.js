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
  DeviceEventEmitter,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import NetUtils from '../PublicComponents/NetUtils';

export default class revenueManagement extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '收益管理',
      orderTab: 0,  //0订单收益，1跨级收益 2商家奖励
      phone: '',
      token: '',
      operateType: '',
      orderList: [],
      pageNum: 1,
      pageSize: 10,
      isRefresh: false,
      isLoadMore: false,
      statusBarHeight: 0,
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

   componentWillUnmount(){
     this.deEmitter.remove();
  };

  componentDidMount () {
    this.deEmitter = DeviceEventEmitter.addListener('revenueManagementListener', (a) => {
        this.loadPhone();
        this.loadToken();
        setTimeout(() => {
            this.loadOrderInfo(0);
        },300);
    });
    this.setStatusBarHeight();
    this.loadPhone();
    this.loadToken();
    this.loadOperateType();
    setTimeout(() => {
      this.loadOrderInfo(0);
    },300);
  }

  loadOrderInfo(i){
    let operateType = 0;
    if (this.state.operateType == 1) {
      operateType = 2;
    }else{
      operateType = 3;
    }
    let status = 0;
    if (operateType == 3) {
      status = 2;
    }else{
      status = 3;
    }
    let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize + '&goods_type='+operateType+'&status='+status+'&is_comment=-1&user_type=B';
    NetUtils.get('order/pageGoodsOrderByParm', params, (result) => {
        if (this.state.operateType == 1) {
          this.setState({orderList:result.physicalGoodsOrderList});
        }else{
          this.setState({orderList:result.couponGoodsOrderList});
        }
    });
  }

  updateRebate(){
      let params = "?mobile=" + this.state.phone +'&token=' + this.state.token[1]+'&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize;
      console.log(params)
      NetUtils.get('business/rebate', params, (result) => {
          console.log(result)
          this.setState({orderList:result});
      });
  }

     _renderItem(item){
       if (this.state.orderTab == 0) {
          return (
                    <View style={{width:ScreenUtils.scaleSize(750),alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(726),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(10)}}>
                        <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(90),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(470),color:'black',fontSize:ScreenUtils.setSpText(9)}}>订单号：{item.order_num}</Text>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                        <View style={{width:ScreenUtils.scaleSize(726),flexDirection:'row',alignItems:'center'}}>
                          <View style={{width:ScreenUtils.scaleSize(526)}}>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(28)}}></View>
                            <Text style={{left:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>商品类型：<Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>{this.state.operateType == 1?'实体商品':'商品券'}</Text></Text>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(20)}}></View>
                            <Text style={{left:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>下单时间：<Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.create_time}</Text></Text>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(40)}}></View>
                          </View>
                          <Text style={{width:ScreenUtils.scaleSize(170),fontSize:ScreenUtils.setSpText(8),color:'red',fontWeight:'bold',textAlign:'right'}}>¥ {item.business_total_price}</Text>
                        </View>
                      </View>
                    </View>
                 );
       }else if(this.state.orderTab == 1){
        let revenue_type = '';
        if (item.state == 0) {
          revenue_type = '待清算';
        }else if (item.state == 1) {
          if (item.is_withdraw == 1) {
            revenue_type = '已提现';
          }else{
            revenue_type = '可提现';
          }
        }
        let type = ''
         switch(item.type){
           case 0:
             type = '自购自返'
             break;
           case 1:
             type = '一级收益'
             break;
           case 2:
            type = '二级收益'
            break;
           case 3:
             type = '三级收益'
             break;
           case 4:
             type = '省公司收益'
             break;
           case 5:
             type = '合伙人区域收益'
             break;
           case 6:
             type = '团长区域收益'
             break;
           case 9:
             type = '平台收益'
             break;
           default:
             type = '血缘代理收益'
             break;
         }
          return (
                    <View style={{width:ScreenUtils.scaleSize(750),alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(726),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(10)}}>
                        <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(89),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(470),fontSize:ScreenUtils.setSpText(8),color:'black'}}>订单号： {item.order_no}</Text>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                        <View style={{width:ScreenUtils.scaleSize(726),flexDirection:'row',alignItems:'center'}}>
                          <View style={{width:ScreenUtils.scaleSize(526)}}>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(32)}}></View>
                            <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>账户： <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.consumer_member_id}</Text></Text>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(23)}}></View>
                            <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>会员类型： <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.level}级会员</Text></Text>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(23)}}></View>
                            <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>下单时间： <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.create_time}</Text></Text>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(23)}}></View>
                            <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>收益状况： <Text style={{fontSize:ScreenUtils.setSpText(8),color:'green'}}>{revenue_type}</Text></Text>
                            <View style={{width:ScreenUtils.scaleSize(526),height:ScreenUtils.scaleSize(40)}}></View>
                          </View>
                          <Text style={{width:ScreenUtils.scaleSize(160),fontSize:ScreenUtils.setSpText(8),color:'red',textAlign:'right',fontWeight:'bold'}}>¥ {item.income}</Text>
                        </View>
                      </View>
                    </View>
                 );

       }else{
        let status = '';
        if (item.status == 0) {
          status = '待清算'
        }else if (item.status == 1) {
          status = '已清算'
        }else{
          status = '已取消'
        }
         return (
                  <View style={{width:ScreenUtils.scaleSize(750),alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:ScreenUtils.scaleSize(726),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(10)}}>
                      <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(39)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',left:ScreenUtils.scaleSize(30)}}>{item.settlement_date!=null?item.settlement_date.slice(0,10):''}</Text>
                      <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(34)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898',left:ScreenUtils.scaleSize(30)}}>累计金额：<Text style={{fontSize:ScreenUtils.setSpText(9),color:'black'}}>¥{item.accumulative_amount}</Text></Text>
                      <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(23)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898',left:ScreenUtils.scaleSize(30)}}>当天扣佣：<Text style={{fontSize:ScreenUtils.setSpText(9),color:'black'}}>¥{item.deduct_commission}</Text></Text>
                      <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(23)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898',left:ScreenUtils.scaleSize(30)}}>清算状态：<Text style={{fontSize:ScreenUtils.setSpText(9),color:status=='已清算'?'green':'red'}}>{status}</Text></Text>
                      <View style={{width:ScreenUtils.scaleSize(726),height:ScreenUtils.scaleSize(40)}}></View>
                    </View>
                  </View>
                )
       }
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>
    )

    _renderHeader= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>
    )

    _loadAssociatedRevenue(){
      let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize;
      NetUtils.get('business/relateProfit', params, (result) => {
          this.setState({orderList:result});
      });
    }


    renderOrderList(){
      if (this.state.orderList != '') {
        return (
                 <FlatList
                      data={this.state.orderList}
                      renderItem={({item}) => this._renderItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
                      ListHeaderComponent={this._renderHeader}
                      onRefresh={() => this._onRefresh()}
                      refreshing={this.state.isRefresh}
                      onEndReached={() => this._onLoadMore()}
                      onEndReachedThreshold={0.1}
                    />
               );
      }else{
        return (
                 <View style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(710),height:ScreenUtils.getHeight()-ScreenUtils.scaleSize(371),alignItems:'center'}}>
                   <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(96),width:ScreenUtils.scaleSize(182),height:ScreenUtils.scaleSize(194)}} source={require('./images/no_order.png')}/>
                   <Text style={{top:ScreenUtils.scaleSize(143),color:'black',fontSize:ScreenUtils.setSpText(8)}}>暂无相关订单</Text>
                 </View>
               );
      }
    }

    _changeTab(i){
      this.setState({orderTab:i,pageSize:10});
      if (i == 0) {
        this.setState({orderList:[]});
        this.loadOrderInfo(0)
      }else if(i == 1){
        this.setState({orderList:[]});
        this._loadAssociatedRevenue()
      }else{
        this.setState({orderList:[]});
        this.updateRebate()
      }
    }

    _onRefresh(){
      if (!this.state.isRefresh) {
        if (this.state.orderTab == 0) {
          this.loadOrderInfo(0)
        }else if (this.state.orderTab == 1) {
          this._loadAssociatedRevenue()
        }else{
          this.updateRebate()
        }
      }
    }

    _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize});
      setTimeout(() => {
        if (this.state.orderTab == 0) {
          this.loadOrderInfo(0)
        }else if (this.state.orderTab == 1) {
          this._loadAssociatedRevenue()
        }else{
          this.updateRebate()
        }
      },300);
    }
  }

    render() {
      const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'#F3A50E',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(11),left:ScreenUtils.scaleSize(80),width:ScreenUtils.scaleSize(490),textAlign:'center'}}>{this.state.title}</Text>
                    <View onPress={() => navigate('businessRebate')} style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'right',color:'white'}}></Text>
                    </View>
                  </View>

                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',flexDirection:'row'}}>
                  <TouchableOpacity onPress={() => this._changeTab(0)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(90),borderBottomColor:this.state.orderTab == 0 ? '#fea712' : 'transparent',borderBottomWidth:1,justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.orderTab == 0 ? '#fea712' : '#434343'}}>订单收益</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._changeTab(1)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(90),borderBottomColor:this.state.orderTab == 1 ? '#fea712' : 'transparent',borderBottomWidth:1,justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.orderTab == 1 ? '#fea712' : '#434343'}}>跨界收益</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._changeTab(2)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(90),borderBottomColor:this.state.orderTab == 2 ? '#fea712' : 'transparent',borderBottomWidth:1,justifyContent:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.orderTab == 2 ? '#fea712' : '#434343'}}>商家奖励</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {this.renderOrderList()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
     underline: {
        borderColor: 'red',
        backgroundColor: '#F3A50E',
      },
});