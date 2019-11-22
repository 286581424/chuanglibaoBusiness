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

export default class vipProfit extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: 'vip收益',
      statusBarHeight: 0,
      token: '',
      phone: '',
      head_portrait: '',  //头像
      nickname: '',  //昵称
      profitList: '',  //收益列表
      isRefresh: false,  //下拉刷新
      isLoadMore: false,  //上拉刷新
      pageSize: 10,
      isVip: 0, //是否是vip 0不是 1是
      isVipBeOverdue: 0,  //vip是否已经过期 0未过期 1已过期
      vipDeadline: '',  //vip过期时间
      chooseList: [], //选择提现列表
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
            Alert.alert('提示','请先登录再查看会员信息！',[{text:'确定',onPress:() => this.props.navigation.navigate('login',{nextView:'marketCategory'})}])
          }else{
            this.getVipInfo()
            this.getProfitList()
            this._getUserInfo()
          }
        });
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        Alert.alert('提示','请先登录再查看会员信息！',[{text:'确定',onPress:() => this.props.navigation.navigate('login',{nextView:'marketCategory'})}])
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
    //底部导航栏点击监听
    this.deEmitter = DeviceEventEmitter.addListener('vipProfitListener', (a) => {
        this.loadToken()
        this.setState({chooseList:[]})
    });
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    this.loadToken()
  }

  //查询收益列表
  getProfitList(){
    let str = '?userType=B&pageNum=1&token=' + this.state.token[1] + '&pageSize=' + this.state.pageSize
    NetUtils.get('market/user/profitList', str, (result) => {
      this.setState({profitList:result})
      console.log(result)
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

  uncodeUtf16(str){
   var reg = /\&#.*?;/g;
   var result = str.replace(reg,function(char){
       var H,L,code;
       if(char.length == 9 ){
           code = parseInt(char.match(/[0-9]+/g));
           H = Math.floor((code-0x10000) / 0x400)+0xD800;
           L = (code - 0x10000) % 0x400 + 0xDC00;
           return unescape("%u"+H.toString(16)+"%u"+L.toString(16));
       }else{
           return char;
       }
   });
   return result;
}

  _getUserInfo(){
    let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&order_status=0&pageNum=1&pageSize=10';
        NetUtils.get('member/getMemberInformationByMobile', params, (result) => {
        let arr = result.userMemberInfoDTO;
        this.setState({nickname:this.uncodeUtf16(arr.nickname)});
        if (arr.head_portrait != null) {
          this.setState({head_portrait:arr.head_portrait});
        }
    });
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(657),left:ScreenUtils.scaleSize(24),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderEmptyFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(239),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black'}}>暂无收益信息</Text>
      </View>
  )

  _renderItem(item){
    let type = ''
    switch(item.type){
      case 1:
        type = '会员贡献';
        break;
      case 2:
        type = 'VIP收益'
        break;
      default:
        type = '其他收益'
        break;
    }
    let status = ''
    switch(item.status){
      case 0:
        status = '待清算';
        break;
      case 1:
        status = '可提现'
        break;
      case 2:
        status = '已提现'
        break;
      case 3:
        status = '提现申请中'
        break;
      case 4:
        status = '提现被拒绝'
        break;
      default:
        status = '其他'
        break;
    }
    return (
              <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(289),backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{width:ScreenUtils.scaleSize(550)}}>
                  <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>订单号：{item.order_num}</Text>
                  <View style={{height:ScreenUtils.scaleSize(20)}}></View>
                  <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>收益来源：<Text style={{fontSize:ScreenUtils.setSpText(10),color:item.type==1?'#b9ad96':'#845f2e',fontWeight:'500'}}>{type}</Text></Text>
                  <View style={{height:ScreenUtils.scaleSize(20)}}></View>
                  <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>金额：<Text style={{color:'#ec2626'}}>¥ {item.profit_money}</Text></Text>
                  <View style={{height:ScreenUtils.scaleSize(20)}}></View>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>扣费比例：<Text style={{color:'#ec2626'}}>{item.rate*100}%</Text></Text>
                    <Image source={require('../../images/Market/tishishuoming.png')} style={{width:ScreenUtils.scaleSize(22),height:ScreenUtils.scaleSize(22),left:ScreenUtils.scaleSize(20)}} />
                  </View>
                  <View style={{height:ScreenUtils.scaleSize(20)}}></View>
                  <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343'}}>收益状态：<Text style={{color:item.status==0?'#ec2626':'green'}}>{status}</Text></Text>
                </View>
                <TouchableOpacity onPress={() => this.chooseProfit(item)} style={{width:ScreenUtils.scaleSize(107),alignItems:'flex-end'}}>
                  <Image source={this.judgeProfitIsInChooseList(item)?require('../../images/Market/tobevip_choose.png'):require('../../images/Market/tobevip.png')} style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(45)}} />
                </TouchableOpacity>
              </View>
           )
  }

  //判断当前收益订单是否在选择提现列表内
  judgeProfitIsInChooseList(item){
    let chooseList = this.state.chooseList
    let i = chooseList.indexOf(item)
    if (i == -1) {
      return false
    }else{
      return true
    }
  }

  //收益选择
  chooseProfit(item){
    if (item.status == 0) {
      Alert.alert('提示','该订单暂未完成，请完成订单再进行提现')
      return
    }
    if (item.status == 2) {
      Alert.alert('提示','该订单已提现，请选择其他订单进行提现')
      return
    }
    if (item.status == 3) {
      Alert.alert('提示','该订单正在提现中，请选择其他订单进行提现')
      return
    }
    let chooseList = this.state.chooseList
    if (chooseList.length == 0) {
      chooseList.push(item)
    }else{
      let i = chooseList.indexOf(item)
      if (i == -1) {
        chooseList.push(item)
      }else{
        chooseList.splice(i,1)
      }
    }
    this.setState({chooseList:chooseList})
  }

  //跳转到提现页面
  goToProfitWithdrawal(navigate){
    // if (this.state.chooseList.length == 0) {
    //   Alert.alert('提示','请选择需要提现的订单！')
    //   return
    // }
    navigate('profitWithdrawal',{profitList:this.state.chooseList})
    this.setState({chooseList:[]})
  }

  gotoBeVip(navigate){
    if (this.state.token == '') {
      Alert.alert('提示','请先登录再成为VIP！',[{text:'确定',onPress:() => navigate('login',{nextView:'marketCategory'})}])
      return
    }
    navigate('toBeVip',{key:'vipProfit'})
  }

  renderView(navigate){
    if (this.state.isVip == 1) {
      return (
                <View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'black'}}></View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(259),backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <Image source={{uri:this.state.head_portrait}} style={{width:ScreenUtils.scaleSize(126),height:ScreenUtils.scaleSize(119),borderRadius:ScreenUtils.scaleSize(60)}} />
                      <View style={{width:ScreenUtils.scaleSize(16)}}></View>
                      <View style={{}}>
                        <Text style={{color:'#f1d39d',fontSize:ScreenUtils.setSpText(14)}}>{this.state.nickname}</Text>
                        <View style={{height:ScreenUtils.scaleSize(15)}}></View>
                        <Text style={{color:'#f1d39d',fontSize:ScreenUtils.setSpText(10),fontWeight:'500'}}>团美家VIP会员</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{position:'absolute',top:ScreenUtils.scaleSize(259+this.state.statusBarHeight-62),width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight()-ScreenUtils.scaleSize(299+110-62),alignItems:'center'}}>
                    <ImageBackground source={require('../../images/Market/vip_profit_bgimg.png')} style={{width:ScreenUtils.scaleSize(706),height:ScreenUtils.scaleSize(124),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(509),fontSize:ScreenUtils.setSpText(9),color:'black'}}>会员到期时间：{this.state.vipDeadline}</Text>
                      {/* 判断vip是否过期，过期显示续费，未过期显示提现 */}
                      {this.state.isVipBeOverdue==0?<TouchableOpacity onPress={() => this.goToProfitWithdrawal(navigate)} style={{width:ScreenUtils.scaleSize(129),height:ScreenUtils.scaleSize(49),borderRadius:ScreenUtils.scaleSize(25),backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'500',color:'#D8C399'}}>去提现</Text>
                      </TouchableOpacity>:<TouchableOpacity onPress={() => this.gotoBeVip(navigate)} style={{width:ScreenUtils.scaleSize(129),height:ScreenUtils.scaleSize(49),borderRadius:ScreenUtils.scaleSize(25),backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(7),fontWeight:'500',color:'#D8C399'}}>续费VIP</Text>
                      </TouchableOpacity>}
                    </ImageBackground>

                    <View style={{height:ScreenUtils.scaleSize(35)}}></View>

                    <View style={{width:ScreenUtils.scaleSize(705),overflow:'hidden',borderRadius:ScreenUtils.scaleSize(20),justifyContent:'center',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.scaleSize(84),justifyContent:'center',backgroundColor:'white'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(10),color:'#333333',fontWeight:'500',left:ScreenUtils.scaleSize(24)}}>你的VIP收益</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(657),left:ScreenUtils.scaleSize(24),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                      <FlatList 
                          style={{width:ScreenUtils.scaleSize(705),height:ScreenUtils.getHeight()-ScreenUtils.scaleSize(299+110-62+124+35+84)}}
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
                  </View>

                </View>
             )
    }else{
      return (
                <View style={{flex:1}}>
                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                  </View>
                  <View style={{flex:1,backgroundColor:'#EEEEEE',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:ScreenUtils.scaleSize(166),height:ScreenUtils.scaleSize(121)}} source={require('../../images/Market/vip_profit_img.png')} />
                    <View style={{height:ScreenUtils.scaleSize(73)}}></View>
                    <Text style={{fontSize:ScreenUtils.setSpText(11),color:'#989898'}}>您还不是团美家VIP用户</Text>
                    <View style={{height:ScreenUtils.scaleSize(37)}}></View>
                    <TouchableOpacity onPress={() => this.gotoBeVip(navigate)} style={{width:ScreenUtils.scaleSize(312),height:ScreenUtils.scaleSize(71),borderRadius:ScreenUtils.scaleSize(20),borderWidth:1,borderColor:'#fea712',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#fea712'}}>成为团美家VIP用户</Text>
                    </TouchableOpacity>
                  </View>
                </View>
             )
    }
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                {this.renderView(navigate)}

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