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
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import NetUtils from '../PublicComponents/NetUtils';

var orderInfoArr = [];

export default class businessRebate extends Component {

    constructor(props) {
        super(props);
        this.state = {
          title: '商家奖励',
          phone: '',
          token: '',
          rebateList: [],
          statusBarHeight: 0,
          pageNum: 1,
          pageSize: 10,
          isRefresh: false,
          isLoadMore: false,
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

   updateRebate(){
    setTimeout(() => {
        let params = "?mobile=" + this.state.phone +'&token=' + this.state.token[1]+'&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize;
        NetUtils.get('business/rebate', params, (result) => {
            // alert(JSON.stringify(result)) 
            this.setState({rebateList:result});
        });
    },200);
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken();
    this.loadPhone();
    this.updateRebate();
  }

  _onRefresh(i){
    if (!this.state.isRefresh) {
      this.updateRebate();
    }
  }

  _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize});
      setTimeout(() => {
        this.updateRebate();
      },300);
    }
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
    )

    _renderRebateItem(item){
      let status = '';
      if (item.status == 0) {
        status = '待清算'
      }else if (item.status == 1) {
        status = '已清算'
      }else{
        status = '已取消'
      }
      return (
        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),alignItems:'center'}}>
          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center'}}>
            <Text style={{width:ScreenUtils.scaleSize(450),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item.settlement_date.substring(0,10)}</Text>
            <Text style={{width:ScreenUtils.scaleSize(240),textAlign:'right',color:'red',fontSize:ScreenUtils.setSpText(8)}}>¥ {item.rebate_money}</Text>
          </View>
          <View style={{width:ScreenUtils.scaleSize(690)}}>
            <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(10)}}></View>
            <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>累计金额：¥{item.accumulative_amount}</Text>
            <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(10)}}></View>
            <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>当天扣佣：¥{item.deduct_commission}</Text>
            <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(10)}}></View>
            <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>清算状态：<Text style={{fontSize:ScreenUtils.setSpText(8),color:'red'}}>{status}</Text></Text>
            <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(10)}}></View>
          </View>
        </View>
      );
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
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>

                    <FlatList 
                      style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}
                      data={this.state.rebateList}
                      renderItem={({item}) => this._renderRebateItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
                      onRefresh={() => this._onRefresh()}
                      refreshing={this.state.isRefresh}
                      onEndReached={() => this._onLoadMore()}
                      onEndReachedThreshold={0.1}
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