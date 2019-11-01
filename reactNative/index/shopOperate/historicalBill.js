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

var orderHistoryArr = [
                {time:'2018.07.02-2018.07.03',money:'100',state:'待清算'},
                {time:'2018.07.01-2018.07.02',money:'100',state:'已清算'},
             ];

export default class historicalBill extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '查看账单',
      statusBarHeight: 0,
      phone: '',
      token: '',
      balance: 0,
      totalMoney: 0,
      totalNum: 0,
      refundNum: 0,
      refundMoney: 0,
      historyBill: [],
  };
  }

  updateShopInfo(){
    setTimeout(() => {
        let params = "?user_type=B&mobile=" + this.state.phone+'&token=' + this.state.token[1];
        NetUtils.get('business/getUserBusinessInfoByBusiness', params, (result) => {
            // alert(JSON.stringify(result))
            this.setState({balance:result.balance});
        });
    },200);
  }

  updateFinancial(){
    setTimeout(() => {
        let params = "?mobile=" + this.state.phone +'&token=' + this.state.token[1];
        NetUtils.get('business/storeOperation', params, (result) => {
            // alert(JSON.stringify(result))
            this.setState({totalNum:result.totalNum});
            this.setState({totalMoney:result.totalMoney});
            this.setState({refundMoney:result.refundMoney});
            this.setState({refundNum:result.refundNum});
        });
    },200);
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

  updateHistoryBill(){
    setTimeout(() => {
        let params = "?mobile=" + this.state.phone +'&token=' + this.state.token[1]+'&pageNum=1&pageSize=100';
        NetUtils.get('business/historyBill', params, (result) => {
            this.setState({historyBill:result});
        });
    },200);
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken();
    this.loadPhone();
    this.updateShopInfo();
    this.updateFinancial();
    this.updateHistoryBill();
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

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
    )

    _renderHeader= () => (
      <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white',alignItems:'center',borderBottomColor:'#EEEEEE',borderBottomWidth:ScreenUtils.scaleSize(3)}}>
        <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(450),color:'black',fontSize:ScreenUtils.setSpText(8)}}>历史账单</Text>
        <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(240),height:ScreenUtils.scaleSize(40),justifyContent:'flex-end',flexDirection:'row'}}>
        </View>
      </View>
    )

    _renderItem(item){
      let state = '';
      if (item.state == 0) {
        state = '未清算'
      }else if (item.state == 1) {
        state = '已清算'
      }else{
        state = '冻结'
      }
      return (
        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),alignItems:'center'}}>
          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
            <Text style={{width:ScreenUtils.scaleSize(450),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.order_date.substring(0,10)}</Text>
            <Text style={{width:ScreenUtils.scaleSize(240),fontSize:ScreenUtils.setSpText(8),textAlign:'right',color:'red'}}>¥ {item.trade_money}</Text>
          </View>
          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),justifyContent:'center'}}>
            <Text style={{width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>{state}</Text>
          </View>
          {this.renderNum(item)}
          {this.renderRemark(item)}
        </View>
      );
    }

    renderNum(item){
      if (item.certificate_no != null && item.certificate_no != '') {
        return (
                 <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(600),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>凭证号:{item.certificate_no}</Text>
                 </View>
               )
      }
    }

    renderRemark(item){
      if (item.remark != '' && item.remark != null) {
        return (
                 <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(600),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>备注:{item.remark}</Text>
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

                    <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(130),alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(450),fontSize:ScreenUtils.setSpText(8),color:'black'}}>今日账单{NetUtils.getCurrentDateFormat()}</Text>
                        <Text style={{width:ScreenUtils.scaleSize(240),fontSize:ScreenUtils.setSpText(8),textAlign:'right',color:'red'}}>¥ {this.state.totalMoney-this.state.refundMoney}</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),justifyContent:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>待清算账单</Text>
                      </View>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}>
                    </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(260),backgroundColor:'white'}}>
                    <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(500),fontSize:ScreenUtils.setSpText(8),color:'black',textAlign:'center'}}>账单明细</Text>
                    </View>
                    <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}>
                    </View>
                    <View style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(630/3),fontSize:ScreenUtils.setSpText(8),color:'black'}}>成交额</Text>
                      <Text style={{width:ScreenUtils.scaleSize(630/3),textAlign:'center',fontSize:ScreenUtils.setSpText(8),color:'black'}}>共{this.state.totalNum}笔</Text>
                      <Text style={{width:ScreenUtils.scaleSize(630/3),textAlign:'right',fontSize:ScreenUtils.setSpText(8),color:'red'}}>¥ {this.state.totalMoney}</Text>
                    </View>
                    <View style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
                    <View style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(630/3),fontSize:ScreenUtils.setSpText(8),color:'black'}}>退款订单</Text>
                      <Text style={{width:ScreenUtils.scaleSize(630/3),textAlign:'center',fontSize:ScreenUtils.setSpText(8),color:'black'}}>共{this.state.refundNum}笔</Text>
                      <Text style={{width:ScreenUtils.scaleSize(630/3),textAlign:'right',fontSize:ScreenUtils.setSpText(8),color:'red'}}>¥ {this.state.refundMoney}</Text>
                    </View>
                    <View style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <FlatList 
                    style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80+130*orderHistoryArr.length),backgroundColor:'#EEEEEE'}}
                    data={this.state.historyBill}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                    ListHeaderComponent={this._renderHeader}
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