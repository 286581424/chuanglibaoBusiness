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
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../PublicComponents/NetUtils';
import codePush from 'react-native-code-push';
import { NavigationActions } from 'react-navigation'
import {BoxShadow} from 'react-native-shadow'

var environmental = 0;  //0为生产环境，1为测试环境
// A7867079-C925-0405-0D65-A14BEF3F23DC
export default class personalCenter extends Component {

    constructor(props) {
    super(props);
    this.state = {
      title: '个人中心',
      tabTitleIndex: 0,
      businessLogo: {},
      phone: '',
      token: '',
      shopInfo: [],
      shopName: '',
      createTime: '',
      mobile: '',
      status: '',
      statusBarHeight: 0,
      user_member_info_id: '',
      businessID: '',
  };
  }

  saveOperateType(value){
    storage.save({
            key: 'operateType',  // 注意:请不要在key中使用_下划线符号!
            id: '1006',   // 注意:请不要在id中使用_下划线符号!
            data: value.toString(),
            expires: null,
          });
  }

  saveBusinessID(value){
    storage.save({
            key: 'id',  // 注意:请不要在key中使用_下划线符号!
            id: '1007',   // 注意:请不要在id中使用_下划线符号!
            data: value.toString(),
            expires: null,
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

  removeAll(){
    storage.clearMap();
  }

  _signOutPress(navigate){
    Alert.alert('提示','确定退出登录？',[{text:'是',onPress:() => this.signOut(navigate)},{text:'否'}]);
  }

  signOut(navigate){
    this.removeAll();
    // const setParamsAction = NavigationActions.setParams({
    //   params: {}, 
    //   key: 'personalCenter',
    // })
    // this.props.navigation.dispatch(setParamsAction)
    navigate('login',{key:'signOut'});
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

  componentWillMount(){
    this.setStatusBarHeight();
    this.loadToken();
    this.loadPhone();
  }

  componentWillUnmount(){
     this.deEmitter.remove();
  };

  _checkVersionUpdata(){
    let os = Platform.OS;
    if (os === 'ios') {
        if (environmental == 1) {
            CODE_PUSH_PRODUCTION_KEY = '2jGQ4yWLfEw4MFFADT6Xn50o0LMD91ff4b12-98ee-40d6-903a-5e851a3fa7fc';
        }else{
            CODE_PUSH_PRODUCTION_KEY = 'xJrAoC3yYLuILG016jG_-P8qaVgu91ff4b12-98ee-40d6-903a-5e851a3fa7fc';
        }
    }else{
        if (environmental == 1) {
            CODE_PUSH_PRODUCTION_KEY = 'E1HO3dMEiK-d-V0sp2AGWRilwKFn91ff4b12-98ee-40d6-903a-5e851a3fa7fc';
        }else{
            CODE_PUSH_PRODUCTION_KEY = '1swgBVcSDdV5y-CiuzVAvxskFDN791ff4b12-98ee-40d6-903a-5e851a3fa7fc';
        }
    }
    codePush.checkForUpdate(CODE_PUSH_PRODUCTION_KEY).then((update) => {
            if (!update) {
                Alert.alert('提示','已是最新版本');
            } else {
                codePush.sync({
                  mandatoryInstallMode:codePush.InstallMode.IMMEDIATE,
                  deploymentKey: CODE_PUSH_PRODUCTION_KEY,
                  updateDialog : {
                    //是否显示更新描述
                    appendReleaseDescription : true ,
                    //更新描述的前缀。 默认为"Description"
                    descriptionPrefix : "更新内容：" ,
                    //强制更新按钮文字，默认为continue
                    mandatoryContinueButtonLabel : "立即更新" ,
                    //强制更新时的信息. 默认为"An update is available that must be installed."
                    mandatoryUpdateMessage : "必须更新后才能使用" ,
                    //非强制更新时，按钮文字,默认为"ignore"
                    optionalIgnoreButtonLabel : '稍后' ,
                    //非强制更新时，确认按钮文字. 默认为"Install"
                    optionalInstallButtonLabel : '后台更新' ,
                    //非强制更新时，检查到更新的消息文本
                    optionalUpdateMessage : '有新版本了，是否更新？' ,
                    //Alert窗口的标题
                    title : '更新提示'
                  } ,
                });
             }
        });
  }

  componentWillReceiveProps(){
    this.updateShopInfo();
  }

  updateShopInfo(){
    setTimeout(() => {
        let params = "?user_type=B&mobile=" + this.state.phone+'&token=' + this.state.token[1];
        NetUtils.get('business/getUserBusinessInfoByBusiness', params, (result) => {
            console.log(result)
            let arr = result.userBusinessInfo;
            this.setState({shopInfo:arr,businessID:arr.id,user_member_info_id:arr.user_member_info_id});
            this.setState({shopName:arr.shop_name});
            let createTime = arr.create_time.substring(0,10);
            this.setState({createTime:createTime});
            this.setState({mobile:arr.mobile});
            let operate_type = 2  //商品券类型
            if(arr.operate_type==1 || arr.operate_type==6){
               operate_type = 1  //实体商品类型
            }
            this.saveOperateType(operate_type);
            this.saveBusinessID(arr.id);
            if (arr.logo != null) {
              let businessLogo = {uri:arr.logo,name:arr.logo};
              this.setState({businessLogo:businessLogo});
            }
            if (arr.status == 0) {
              this.setState({status:'未营业'});
            }else{
              this.setState({status:'营业中'});
            }
        });
    },200);
  }

  componentDidMount(){
    this.deEmitter = DeviceEventEmitter.addListener('personalCenterListener', (a) => {
        this.loadToken();
        this.loadPhone();
        this.updateShopInfo();
    });
    this.updateShopInfo();
  }

  _setBusinessStatePress(navigate){
    navigate('businessState',{logo:this.state.businessLogo.uri,status:this.state.status,businessTime:this.state.shopInfo.business_hours});
  }

  _settingPress(navigate){
    navigate('shopSeting');
  }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
      const shadowOpt = {
            position:'absolute',
            width:ScreenUtils.scaleSize(686), //包裹的子内容多宽这里必须多宽
            height:ScreenUtils.scaleSize(110),//同上
            color:"#000",//阴影颜色
            border:4,//阴影宽度
            radius:ScreenUtils.scaleSize(20),//包裹的子元素圆角多少这里必须是多少
            opacity:0.1,//透明度
            x:0,
            y:0,
            style: { left:ScreenUtils.scaleSize(32),top:ScreenUtils.scaleSize(-55)  },
        }
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                <View style={{backgroundColor:'white'}}>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(325),flexDirection:'row',backgroundColor:'#F3A50E'}}>
                    <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(250),flexDirection:'row'}}>
                      <Image style={{width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130),borderRadius:ScreenUtils.scaleSize(10),top:ScreenUtils.scaleSize(94),left:ScreenUtils.scaleSize(32)}} source={{uri:this.state.businessLogo.uri}} />
                      <View style={{width:ScreenUtils.scaleSize(380),top:ScreenUtils.scaleSize(94),height:ScreenUtils.scaleSize(110),left:ScreenUtils.scaleSize(58)}}>
                        <Text style={{top:ScreenUtils.scaleSize(10),fontSize:ScreenUtils.setSpText(11),fontWeight:'600',color:'white'}}>{this.state.shopName}</Text>
                        <Text style={{top:ScreenUtils.scaleSize(46),width:ScreenUtils.scaleSize(400),fontWeight:'500',fontSize:ScreenUtils.setSpText(8),color:'white'}}>注册时间：{this.state.createTime}</Text>
                      </View>
                    </View>
                    <View style={{flex:1,alignItems:'center'}}>
                      <TouchableOpacity onPress={() => this._settingPress(navigate)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center',top:ScreenUtils.scaleSize(20),left:ScreenUtils.scaleSize(10)}}>
                          <Image source={require('./images/personalCenter/set-s.png')} style={{width:ScreenUtils.scaleSize(38),height:ScreenUtils.scaleSize(39)}}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <BoxShadow setting={shadowOpt}>
                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(686),height:ScreenUtils.scaleSize(110),borderRadius:ScreenUtils.scaleSize(20),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(25),fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(200),color:'black'}}>营业状态</Text>
                    <TouchableOpacity onPress={() => this._setBusinessStatePress(navigate)} style={{width:ScreenUtils.scaleSize(431),height:ScreenUtils.scaleSize(110),left:ScreenUtils.scaleSize(25),flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                      <Text style={{left:ScreenUtils.scaleSize(-30),fontSize:ScreenUtils.setSpText(10),color:this.state.status == '营业中'?'#1ad95d':'red'}}>{this.state.status}</Text>
                      <Image style={{top:-ScreenUtils.scaleSize(0),resizeMode:'stretch',width:ScreenUtils.scaleSize(13*1.5),height:ScreenUtils.scaleSize(23*1.5)}} source={require('./images/shopSecond/shop_second_more.png')}/>
                    </TouchableOpacity>
                  </View>
                  </BoxShadow>
                </View>

                <ScrollView style={{top:ScreenUtils.scaleSize(-35)}}>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150),flexDirection:'row',backgroundColor:'white'}}>
                    <TouchableOpacity onPress={() => navigate('businessQRCode',{shopInfo:this.state.shopInfo,user_member_info_id:this.state.user_member_info_id,businessID:this.state.businessID})} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(150),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(56),height:ScreenUtils.scaleSize(56)}} source={require('./images/personalCenter/qrcode.png')} />
                      </View>
                      <Text style={{width:ScreenUtils.scaleSize(187.5),top:ScreenUtils.scaleSize(20),color:'black',textAlign:'center',fontSize:ScreenUtils.setSpText(9)}}>商家二维码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._settingPress(navigate)} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(150),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(60),height:ScreenUtils.scaleSize(55)}} source={require('./images/personalCenter/mendian.png')} />
                      </View>
                      <Text style={{width:ScreenUtils.scaleSize(187.5),top:ScreenUtils.scaleSize(20),color:'black',textAlign:'center',fontSize:ScreenUtils.setSpText(9)}}>门店设置</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => DeviceEventEmitter.emit('left','发送消息')} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(150),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(48),height:ScreenUtils.scaleSize(56)}} source={require('./images/personalCenter/order.png')} />
                      </View>
                      <Text style={{width:ScreenUtils.scaleSize(187.5),top:ScreenUtils.scaleSize(20),color:'black',textAlign:'center',fontSize:ScreenUtils.setSpText(9)}}>订单设置</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('printSetting')} style={{width:ScreenUtils.scaleSize(187.5),height:ScreenUtils.scaleSize(150),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(90),alignItems:'center',justifyContent:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(54),height:ScreenUtils.scaleSize(54)}} source={require('./images/personalCenter/dayin.png')} />
                      </View>
                      <Text style={{width:ScreenUtils.scaleSize(187.5),top:ScreenUtils.scaleSize(20),color:'black',textAlign:'center',fontSize:ScreenUtils.setSpText(9)}}>打印设置</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(39),backgroundColor:'white'}}></View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>

                  <View style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white'}}>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),flexDirection:'row',alignItems:'center',borderBottomColor:'#EEEEEE',borderBottomWidth:ScreenUtils.scaleSize(2)}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(510),color:'black',fontSize:ScreenUtils.setSpText(9)}}>提现设置</Text>
                      <TouchableOpacity onPress={() => navigate('bankCardList')} style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(180),height:ScreenUtils.scaleSize(60),alignItems:'flex-end',justifyContent:'center'}}>
                        <Image style={{resizeMode:'stretch',width:ScreenUtils.scaleSize(13*1.5),height:ScreenUtils.scaleSize(23*1.5)}} source={require('./images/shopSecond/shop_second_more.png')}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),flexDirection:'row',alignItems:'center',borderBottomColor:'#EEEEEE',borderBottomWidth:ScreenUtils.scaleSize(2)}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(410),color:'black',fontSize:ScreenUtils.setSpText(9)}}>当前账户</Text>
                      <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(280),height:ScreenUtils.scaleSize(60),flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(250),color:'#989898',textAlign:'right',fontSize:ScreenUtils.setSpText(9)}}>{this.state.mobile}</Text>
                      </View>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),flexDirection:'row',alignItems:'center',borderBottomColor:'#EEEEEE',borderBottomWidth:ScreenUtils.scaleSize(2)}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(410),color:'black',fontSize:ScreenUtils.setSpText(9)}}>当前版本</Text>
                      <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(280),height:ScreenUtils.scaleSize(60),flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(250),color:'#989898',textAlign:'right',fontSize:ScreenUtils.setSpText(9)}}>1.0.0</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>


                  <TouchableOpacity onPress={() => this._signOutPress(navigate)} style={{top:-ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(93),alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                    <Text style={{width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(8.5),color:'#fea712',textAlign:'center'}}>退出登录</Text>
                  </TouchableOpacity>
            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    button: {
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
    }
});