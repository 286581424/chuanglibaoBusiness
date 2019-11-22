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

export default class profitWithdrawal extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '收益提现',
      statusBarHeight: 0,
      token: '',
      phone: '',
      withdrawnIncome: '',  //已提现收益
      minimumCashWithdrawal: 0,  //最低提现金额
      profitList: [],  //提现列表
      isRefresh: false,  //下拉刷新
      isLoadMore: false,  //上拉刷新
      pageSize: 10,
      money: 0,  //提现金额
      canWithdrawal: false,  //是否能提现 当提现金额大于最低提现金额时为true
      bankCardList: [],  //银行卡列表
      chooseBank: '',  //当前选择银行
      bankListShow: false,  //银行卡列表Modal是否显示
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
          this.getWithDrawalInfo()
          this.getProfitList()
          this._getBankCardList()
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

  componentDidMount(){
    this.setStatusBarHeight()
    this.loadPhone()
    this.loadToken()
    //银行卡添加成功监听监听
    this.deEmitter = DeviceEventEmitter.addListener('profitWithdrawalListener', (a) => {
        this._getBankCardList()
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

  _getBankCardList(){
    let str = '?mobile='+this.state.phone+'&token='+this.state.token[1];
    NetUtils.get('business/findBusinessAccount', str, (result) => {
        let list = []
        if (result!=null) {
          list.push(result)
        }
        if(list.length > 0){
          this.setState({bankCardList:list});
          this.setState({chooseBank:list[0]})
        }
    });
  }

  //查询提现信息，包括最低提现额和已提现金额
  getWithDrawalInfo(){
    let str = '?userType=B&token=' + this.state.token[1]
    NetUtils.get('market/profit/withdraw/market/user/withdrawInfo', str, (result) => {
      this.setState({withdrawnIncome:result.sumWithdrawMoney,minimumCashWithdrawal:result.minMoney})
      const { params } = this.props.navigation.state;
      let money = 0
      for(let a of params.profitList){
        money+=a.profit_money
      }
      if (money >= result.minMoney) {
        this.setState({canWithdrawal:true})
      }
      this.setState({money:money})
    });
  }

  //查询提现记录列表
  getProfitList(){
    let str = '?userType=B&pageNum=1&token=' + this.state.token[1] + '&pageSize=' + this.state.pageSize
    NetUtils.get('market/profit/withdraw/market/user/withdrawRecord', str, (result) => {
      this.setState({profitList:result})
    });
  }

  //提现到银行卡
  withdrawToBankCard(){
    const { navigate } = this.props.navigation;
    if (!this.state.canWithdrawal) {
      Alert.alert('提示','不满足最低提现金额')
      return
    }
    if (this.state.bankCardList.length == 0) {
      Alert.alert('提示','请先添加银行卡！',[{text:'确定',onPress:() => navigate('receivableAccount',{key:'add',nextView:'profitWithdrawal'})}])
      return
    }
    this.setBankListShow()
  }

  toBankCard(){
    this.setBankListShow()
    const { params } = this.props.navigation.state;
    let ids = []
    for(let a of params.profitList) {
      ids.push(a.id)
    }
    let str = '?userType=B&token=' + this.state.token[1] + '&receiveType=1&ids=' + ids + '&accountId=' + this.state.chooseBank.id
    NetUtils.postJson('market/profit/withdraw/add', {}, str, (result) => {
      Alert.alert('提示','提现发起成功！审核通过后预计2-5个工作日内到账，请注意查收',[{text:'确定',onPress:() => this.goBackView()}])
    });
  }

  //提现到余额
  withdrawToBalance(){
    if (!this.state.canWithdrawal) {
      Alert.alert('提示','不满足最低提现金额')
      return
    }
    const { params } = this.props.navigation.state;
    let ids = []
    for(let a of params.profitList) {
      ids.push(a.id)
    }
    let str = '?userType=B&token=' + this.state.token[1] + '&receiveType=0&ids=' + ids
    NetUtils.postJson('market/profit/withdraw/add', {}, str, (result) => {
      this.getBalance()
    });
  }

  getBalance(){
    let str = '?userType=B&token=' + this.state.token[1]
    NetUtils.get('user/balance', str, (result) => {
      let tips = '余额提现成功，当前余额为'+result+'元'
      Alert.alert('提示',tips,[{text:'确定',onPress:() => this.goBackView()}])
    });
  }

  //下拉刷新
  _onRefresh(i){
    if (!this.state.isRefresh) {
      this.getProfitList();
    }
  }

  //上拉加载
  _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize},() => {
        this.getProfitList();
      });
    }
  }

  _renderItem(item){
    let status = ''
    switch(item.status){
      case 0:
        status = '申请中'
        break;
      case 1:
        status = '同意'
        break;
      case 2:
        status = '拒绝'
        break;
      default:
        status = '其他'
        break
    }
    return (
             <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(493),overflow:'hidden',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(510)}}>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>提现单号：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>{item.order_num}</Text>
                        </View>
                        <View style={{height:ScreenUtils.scaleSize(31)}}></View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>到账方式：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>银行卡</Text>
                        </View>
                        <View style={{height:ScreenUtils.scaleSize(31)}}></View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>收款账号：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>{item.account}</Text>
                        </View>
                        <View style={{height:ScreenUtils.scaleSize(31)}}></View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>收款银行：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>{item.bank}</Text>
                        </View>
                        <View style={{height:ScreenUtils.scaleSize(31)}}></View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>提现时间：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>{item.create_time}</Text>
                        </View>
                        <View style={{height:ScreenUtils.scaleSize(31)}}></View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>提现金额：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>¥ {item.money}</Text>
                        </View>
                        <View style={{height:ScreenUtils.scaleSize(31)}}></View>
                        <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898'}}>凭证单号：</Text>
                          <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                          <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>{item.certificate_num}</Text>
                        </View>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(431),alignItems:'flex-end'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:item.status==1?'#1ebc5a':'red'}}>{status}</Text>
                      </View>
                    </View>
           )
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(657),left:ScreenUtils.scaleSize(24),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderEmptyFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(239),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black'}}>暂无提现记录</Text>
      </View>
  )

  //返回上一页
  goBackView(){
    const { goBack } = this.props.navigation;
    DeviceEventEmitter.emit('vipProfitListener','')
    goBack()
  }

  setBankListShow(){
    let bankListShow = this.state.bankListShow
    this.setState({bankListShow:!bankListShow})
  }

  _renderBankCardListFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(710),left:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  judgeChooseBank(item){
    let chooseBank = this.state.chooseBank
    if (chooseBank.id == item.id) {
      return true
    }else{
      return false
    }
  }

  _renderBankCardListItem(item){
     return (
               <TouchableOpacity onPress={() => this.setState({chooseBank:item})} style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(80),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 <Image style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(45)}} source={this.judgeChooseBank(item)?require('../../images/Market/tobevip_choose.png'):require('../../images/Market/tobevip.png')} />
                 <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                 <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',width:ScreenUtils.scaleSize(150)}}>{item.bank}</Text>
                 <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',width:ScreenUtils.scaleSize(400)}}>{item.account_num}</Text>
               </TouchableOpacity>
            )
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
                    <TouchableOpacity onPress={() => this.goBackView()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../images/Home/back_white.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(450-88-40),backgroundColor:'#fea712',alignItems:'center'}}>
                    <View style={{height:ScreenUtils.scaleSize(14)}}></View>
                    <Text style={{fontSize:ScreenUtils.setSpText(26),fontWeight:'500',color:'#ffffff'}}>{this.state.money}</Text>
                    <View style={{height:ScreenUtils.scaleSize(21)}}></View>
                    <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'600',color:'#ffffff'}}>已提现收益{this.state.withdrawnIncome}</Text>
                  </View>

                  <View style={{overflow:'hidden',width:ScreenUtils.scaleSize(708),height:ScreenUtils.scaleSize(358),left:ScreenUtils.scaleSize(21),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(-120),alignItems:'center'}}>
                    <View style={{width:ScreenUtils.scaleSize(657),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',width:ScreenUtils.scaleSize(200)}}>收款账号</Text>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#989898',width:ScreenUtils.scaleSize(457),textAlign:'right'}}>最低提现金额¥ {this.state.minimumCashWithdrawal}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(657),height:ScreenUtils.scaleSize(1),backgroundColor:'#EFEFEF'}}></View>
                    <View style={{height:ScreenUtils.scaleSize(27)}}></View>
                    <TouchableOpacity onPress={() => this.withdrawToBankCard()} style={{width:ScreenUtils.scaleSize(657),height:ScreenUtils.scaleSize(90),borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:this.state.canWithdrawal?'#fea712':'#D1D1D1'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.canWithdrawal?'#fea712':'#989898'}}>提现到银行账户</Text>
                    </TouchableOpacity>
                    <View style={{height:ScreenUtils.scaleSize(32)}}></View>
                    <TouchableOpacity onPress={() => this.withdrawToBalance()} style={{width:ScreenUtils.scaleSize(657),height:ScreenUtils.scaleSize(90),borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center',backgroundColor:this.state.canWithdrawal?'#fea712':'#C8C8C8'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.canWithdrawal?'white':'#D1D1D1'}}>提现到账户余额</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{top:ScreenUtils.scaleSize(-100),flex:1,backgroundColor:'white'}}>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(84),justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                      <Text style={{width:ScreenUtils.scaleSize(710),fontSize:ScreenUtils.setSpText(9),color:'black'}}>我的提现记录</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(710),left:ScreenUtils.scaleSize(20),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                    <FlatList 
                        style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white'}}
                        data={this.state.profitList}
                        renderItem={({item}) => this._renderItem(item)}
                        ItemSeparatorComponent={this._renderFenge}
                        ListEmptyComponent={this._renderEmptyFenge}
                        onRefresh={() => this._onRefresh()}
                        refreshing={this.state.isRefresh}
                        onEndReached={() => this._onLoadMore()}
                        onEndReachedThreshold={1}
                    />
                  </View>

                   <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.bankListShow}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <TouchableOpacity activeOpacity={1} onPress={() => this.setBankListShow()} style={{flex:1,backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'center'}} underlayColor='rgba(140,140,140,0.7)'>
                          <View style={{width:ScreenUtils.scaleSize(710),overflow:'hidden',borderRadius:ScreenUtils.scaleSize(15)}}>
                            <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(80),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                              <Text style={{width:ScreenUtils.scaleSize(655),fontSize:ScreenUtils.setSpText(9),color:'black'}}>银行卡列表</Text>
                            </View>
                            <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                            <FlatList 
                                style={{width:ScreenUtils.scaleSize(710),backgroundColor:'white'}}
                                data={this.state.bankCardList}
                                renderItem={({item}) => this._renderBankCardListItem(item)}
                                ItemSeparatorComponent={this._renderBankCardListFenge}
                            />
                          </View>
                          <View style={{height:ScreenUtils.scaleSize(20)}}></View>
                          <TouchableOpacity onPress={() => this.toBankCard()} style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(90),backgroundColor:'#fea712',borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>确定提现</Text>
                          </TouchableOpacity>
                       </TouchableOpacity>
                    </Modal>


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