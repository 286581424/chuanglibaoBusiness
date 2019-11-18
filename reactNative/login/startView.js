import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal,
    Alert,
    NetInfo,
    ImageBackground,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import homepage from '../index/homes';
import login from './login';
import updataJS from './updataJS';
import orderDetails from '../index/orderDetails';
import applicationforCash from '../index/shopOperate/applicationforCash';
import balanceWater from '../index/shopOperate/balanceWater';
import commodityEditor from '../index/shopOperate/commodityEditor';
import couponEditor from '../index/shopOperate/couponEditor';
import commodityManagement from '../index/shopOperate/commodityManagement';
import editType from '../index/shopOperate/editType';
import personalCenter from '../index/personalCenter'
import financialReconciliation from '../index/shopOperate/financialReconciliation';
import historicalBill from '../index/shopOperate/historicalBill';
import messageCenter from '../index/shopOperate/messageCenter';
import putForward from '../index/shopOperate/putForward';
import restaurantNumList from '../index/shopOperate/restaurantNumList'
import tweetsList from '../index/shopOperate/tweetsList'
import tweetsAdd from '../index/shopOperate/tweetsAdd'
import tweetsDetails from '../index/shopOperate/tweetsDetails'
import tweetsEvaluate from '../index/shopOperate/tweetsEvaluate'
import qrCodeManagement from '../index/shopOperate/qrCodeManagement';
import skuSetting from '../index/shopOperate/skuSetting';
import skuAdd from '../index/shopOperate/skuAdd'
import labelSetting from '../index/shopOperate/labelSetting'
import labelAdd from '../index/shopOperate/labelAdd'
import typeManagement from '../index/shopOperate/TypeManagement';
import userEvaluate from '../index/shopOperate/userEvaluate';
import revenueManagement from '../index/revenueManagement/revenueManagement';
import businessImageUpdate from '../index/personalCenter/businessImageUpdate';
import businessQualification from '../index/personalCenter/businessQualification';
import businessState from '../index/personalCenter/businessState';
import businessTime from '../index/personalCenter/businessTime';
import shopInfos from '../index/personalCenter/shopInfos';
import shopKeyword from '../index/personalCenter/shopKeyword';
import shopPhoneNum from '../index/personalCenter/shopPhoneNum';
import businessAddress from '../index/personalCenter/businessAddress';
import shopSeting from '../index/personalCenter/shopSeting';
import printSetting from '../index/personalCenter/printSetting'
import printInfo from '../index/personalCenter/printInfo'
import registerBusinessQualification from '../login/registerBusinessQualification';
import scanView from '../index/scanView';
import businessQRCode from '../index/personalCenter/businessQRCode';
import commodityQRCode from '../index/shopOperate/commodityQRCode';
import bankCardList from '../index/personalCenter/bankCardList';
import receivableAccount from '../index/personalCenter/receivableAccount';
import setBackgroundImg from '../index/personalCenter/setBackgroundImg';
import businessRebate from '../index/businessRebate';
import Progress from './CusProgressBar';
import codePush from 'react-native-code-push';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import NetUtils from '../PublicComponents/NetUtils';
import province from '../PublicComponents/province'
import city from '../PublicComponents/city'
import area from '../PublicComponents/area'
import townOrStreet from '../PublicComponents/townOrStreet'

import marketCategory from '../index/Homes/MarketCategory/marketCategory'
import toBeVip from '../index/Homes/MarketCategory/toBeVip'
import vipPrivilege from '../index/Homes/MarketCategory/vipPrivilege'
import vipProfit from '../index/Homes/MarketCategory/vipProfit'
import vipAgreement from '../index/Homes/MarketCategory/vipAgreement'
import marketOrderList from '../index/Homes/MarketCategory/marketOrderList'
import payResult from '../index/Homes/MarketCategory/payResult'
import placeOrder from '../index/Homes/MarketCategory/placeOrder'
import profitWithdrawal from '../index/Homes/MarketCategory/profitWithdrawal'
import payment from '../index/Homes/MarketCategory/payment'
import marketOrderDetails from '../index/Homes/MarketCategory/marketOrderDetails'

import JPushModule from 'jpush-react-native';
import *as wechat from 'react-native-wechat';

var environmental = 0;  //0为生产环境，1为测试环境
var CODE_PUSH_PRODUCTION_KEY = ''
var codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
//设置检查更新的频率
  //ON_APP_RESUME APP恢复到前台的时候
  //ON_APP_START APP开启的时候
  //MANUAL 手动检查

class start extends Component {

    constructor(props) {
    super(props);
    this.state = {
      phone : '',
      token: '',
      isUpdata: false,
      updateInfo: '',
      updateShow: false,
      packageSize: 0,
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

  _setLoadingShow(){
    let show = this.state.loadingShow;
    this.setState({loadingShow:!show});
  }

    _gotoNextView(){
        this.setState({updateShow:false});
        this.loadPhone();
        this.loadToken();
            setTimeout(() => {
                let nextView = '';
                if (this.state.phone != '') {
                    nextView = 'homepage';
                }else{
                    nextView = 'login';
                }
                const { navigate } = this.props.navigation; 
                if(navigator){
                    if (nextView == 'homepage') {
                      let  InterfaceUrl = '';
                      let url = NetUtils.getInterUrl();
                      InterfaceUrl = url + 'business/getUserBusinessInfoByBusiness?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&user_type=B';
                      fetch(InterfaceUrl,{
                          headers:{
                            "Accept": "application/json;charset=utf-8",
                            'Content-Type': 'application/json',
                          },
                         })
                          .then((response) => response.json())
                          .then((responseBody) => {
                              if(responseBody.flag == true){
                                let operate_type = 2  //商品券类型
                                if(responseBody.data.userBusinessInfo.operate_type==1 || responseBody.data.userBusinessInfo.operate_type==6){
                                   operate_type = 1  //实体商品类型
                                }
                                this.saveOperateType(operate_type);
                                this.saveBusinessID(responseBody.data.userBusinessInfo.id);
                                this.props.navigation.replace(nextView,{key:nextView});
                              }else{
                                if (responseBody.errMsg == 'token is error') {
                                    Alert.alert('提示','用户已在别的设备登录，请重新登录',[{text:'确认',onPress:() => this._gotoLoginView(navigate)}]);
                                }else{
                                    Alert.alert('提示','用户登录异常，请重新登录,错误提示：'+responseBody.errMsg,[{text:'确认',onPress:() => this._gotoLoginView(navigate)}]);
                                }
                              }
                          }).catch(error => {
                              alert(error);
                          });
                        }else{
                          this.props.navigation.replace(nextView,{key:nextView});
                        }
                }
            },1000);
    }

    _gotoLoginView(navigate){
      if (!this.state.isUpdata) {
        this.setState({loadingShow:false});
      }
      this.props.navigation.replace('login',{key:'login'});
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

   componentWillMount(){
    this.setState({checkLoadShow:true})
    this.loadPhone();
    this.loadToken();
    wechat.registerApp('wx88c53e1f1d36ff1f')
    JPushModule.initPush()
    let os = Platform.OS;
    if (os === 'ios') {
        if (environmental == 1) {
            CODE_PUSH_PRODUCTION_KEY = 'Ul4iqnT28ZQJtCJFFcHONvB1Iiyp4ksvOXqog';
        }else{
            CODE_PUSH_PRODUCTION_KEY = 'wqW3r0lZoz5sCXkGBYbZmBNpoN7K4ksvOXqog';
        }
    }else{
        if (environmental == 1) {
            CODE_PUSH_PRODUCTION_KEY = '4hEItnr8b145sc6Rfo1gSmOCB46r4ksvOXqog1';
        }else{
            CODE_PUSH_PRODUCTION_KEY = '66BveDaQMliT1rrOaJHx1oXtsxlM4ksvOXqog1';
        }
    }
    codePush.checkForUpdate()
      .then((update) => {
              if (!update) {
                  this._gotoNextView();
              } else {
                  let packageSize = 0;
                  packageSize = update.packageSize/1024/1024;
                  packageSize = packageSize.toFixed(2);
                  this.setState({updateShow:true,updateInfo:update,packageSize:packageSize});
              }
          }
      );
  }

  appUpdata(){
        this.setState({isUpdata:true,updateShow:false});
        codePush.sync({
          mandatoryInstallMode:codePush.InstallMode.IMMEDIATE,
          deploymentKey: CODE_PUSH_PRODUCTION_KEY,
        },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this),
        );
    }

    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({progressText: "检查更新"});
                //检查是否需要更新
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({progressText: "下载包"});
                break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({progressText: "更新提示"});
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({progressText: "正在安装"});
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                this.setState({progressText: "更新完成"});
                this._gotoNextView()
                break;
            case codePush.SyncStatus.UPDATE_IGNORED:
                this.setState({progressText: "用户选择忽略"});
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({progressText: "安装完成"});
                codePush.restartApp();
                break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({progressText: "An unknown error occurred."});
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        let str = parseInt(progress.receivedBytes/progress.totalBytes*100);
        let currProgress = parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2)
        this.refs.progressBar.progress = currProgress;
        this.setState({progress:str});
    }

    componentDidMount() {
        codePush.allowRestart();//在加载完了，允许重启
      }

    renderProgress(){
      if (this.state.isUpdata) {
        return (
                 <View style={{alignItems:'center',top:ScreenUtils.scaleSize(100)}}>
                   <Progress
                      ref="progressBar"
                      progressColor={'#F3A50E'}
                      style={{
                        marginTop: 20,
                        height: ScreenUtils.scaleSize(15),
                        width: ScreenUtils.scaleSize(650),
                        backgroundColor: 'gray',
                        borderRadius: 10,
                      }}
                  />
                  <Text style={{color:this.state.isUpdata?"white":"transparent",fontSize:ScreenUtils.setSpText(8)}}>{this.state.progress}%</Text>
                 </View>
               )
      }
    }

    renderUpdateBtn(){
      if (this.state.updateInfo.Mandatory) {
        return (
                 <View style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(90),flexDirection:'row'}}>
                    <TouchableOpacity style={{width:ScreenUtils.scaleSize(710),height:ScreenUtils.scaleSize(90),justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',fontSize:ScreenUtils.scaleSize(9)}}>立即更新</Text>
                    </TouchableOpacity>
                  </View>
               );
      }else{
        return (
                 <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(90),flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => this._gotoNextView()} style={{width:ScreenUtils.scaleSize(690/2),height:ScreenUtils.scaleSize(90),justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>暂不更新</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.appUpdata()} style={{width:ScreenUtils.scaleSize(690/2),height:ScreenUtils.scaleSize(90),justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>立即更新</Text>
                    </TouchableOpacity>
                  </View>
               );
      }
    }

    render() {
        return (
            <ImageBackground source={require('./images/backgrounds.png')} style={{justifyContent:'center',alignItems:'center',width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight()}}>
               {this.renderProgress()}
              <Modal
                     animationType='fade'
                     transparent={true}
                     visible={this.state.updateShow}
                     onShow={() => {}}
                     onRequestClose={() => {}} >
                     <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'transparent',alignItems:'center',justifyContent:'center'}}>
                        <View style={{width:ScreenUtils.scaleSize(690),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'white'}}>
                          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(9),color:'black'}}>更新提示</Text></View>
                          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                          <View style={{width:ScreenUtils.scaleSize(690),alignItems:'center'}}>
                            <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                            <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',width:ScreenUtils.scaleSize(600)}}>更新内容:</Text>
                            <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',width:ScreenUtils.scaleSize(500)}}>{this.state.updateInfo.description}</Text>
                            <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                          </View>
                          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'center'}}><Text style={{width:ScreenUtils.scaleSize(600),fontSize:ScreenUtils.setSpText(8),color:'black'}}>安装包大小：{this.state.packageSize} M</Text></View>
                          <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                          {this.renderUpdateBtn()}
                        </View>
                     </View>
                  </Modal>
            </ImageBackground>
        );
    }

}

const index = StackNavigator({  
    start: {
      screen: start,
      navigationOptions:{
        header: null,
      }
    },
    login: {
      screen: login,
      navigationOptions:{
        header: null,
      }
    },
    updataJS: {
      screen: updataJS,
      navigationOptions:{
        header: null,
      }
    },
    homepage: {
      screen: homepage,
      navigationOptions:{
        header: null,
      }
    },
    orderDetails: {
      screen: orderDetails,
      navigationOptions:{
        header: null,
      }
    },
    applicationforCash: {
      screen: applicationforCash,
      navigationOptions:{
        header: null,
      }
    },
    printSetting: {
      screen: printSetting,
      navigationOptions:{
        header: null,
      }
    },
    printInfo: {
      screen: printInfo,
      navigationOptions:{
        header: null,
      }
    },
    balanceWater: {
      screen: balanceWater,
      navigationOptions:{
        header: null,
      }
    },
    province: {
      screen: province,
      navigationOptions:{
        header: null,
      }
    },
    restaurantNumList: {
      screen: restaurantNumList,
      navigationOptions:{
        header: null,
      }
    },
    city: {
      screen: city,
      navigationOptions:{
        header: null,
      }
    },
    couponEditor: {
      screen: couponEditor,
      navigationOptions:{
        header: null,
      }
    },
    townOrStreet: {
      screen: townOrStreet,
      navigationOptions:{
        header: null,
      }
    },
    area: {
      screen: area,
      navigationOptions:{
        header: null,
      }
    },
    commodityEditor: {
      screen: commodityEditor,
      navigationOptions:{
        header: null,
      }
    },
    tweetsDetails: {
      screen: tweetsDetails,
      navigationOptions:{
        header: null,
      }
    },
    tweetsEvaluate: {
      screen: tweetsEvaluate,
      navigationOptions:{
        header: null,
      }
    },
    commodityManagement: {
      screen: commodityManagement,
      navigationOptions:{
        header: null,
      }
    },
    editType: {
      screen: editType,
      navigationOptions:{
        header: null,
      }
    },
    financialReconciliation: {
      screen: financialReconciliation,
      navigationOptions:{
        header: null,
      }
    },
    messageCenter: {
      screen: messageCenter,
      navigationOptions:{
        header: null,
      }
    },
    putForward: {
      screen: putForward,
      navigationOptions:{
        header: null,
      }
    },
    qrCodeManagement: {
      screen: qrCodeManagement,
      navigationOptions:{
        header: null,
      }
    },
    typeManagement: {
      screen: typeManagement,
      navigationOptions:{
        header: null,
      }
    },
    userEvaluate: {
      screen: userEvaluate,
      navigationOptions:{
        header: null,
      }
    },
    revenueManagement: {
      screen: revenueManagement,
      navigationOptions:{
        header: null,
      }
    },
    businessImageUpdate: {
      screen: businessImageUpdate,
      navigationOptions:{
        header: null,
      }
    },
    businessQualification: {
      screen: businessQualification,
      navigationOptions:{
        header: null,
      }
    },
    businessState: {
      screen: businessState,
      navigationOptions:{
        header: null,
      }
    },
    businessTime: {
      screen: businessTime,
      navigationOptions:{
        header: null,
      }
    },
    shopInfos: {
      screen: shopInfos,
      navigationOptions:{
        header: null,
      }
    },
    shopKeyword: {
      screen: shopKeyword,
      navigationOptions:{
        header: null,
      }
    },
    shopPhoneNum: {
      screen: shopPhoneNum,
      navigationOptions:{
        header: null,
      }
    },
    shopSeting: {
      screen: shopSeting,
      navigationOptions:{
        header: null,
      }
    },
    businessAddress: {
      screen: businessAddress,
      navigationOptions:{
        header: null,
      }
    },
    scanView: {
      screen: scanView,
      navigationOptions:{
        header: null,
      }
    },
    businessQRCode: {
      screen: businessQRCode,
      navigationOptions:{
        header: null,
      }
    },
    commodityQRCode: {
      screen: commodityQRCode,
      navigationOptions:{
        header: null,
      }
    },
    bankCardList: {
      screen: bankCardList,
      navigationOptions:{
        header: null,
      }
    },
    tweetsList: {
      screen: tweetsList,
      navigationOptions:{
        header: null,
      }
    },
    tweetsAdd: {
      screen: tweetsAdd,
      navigationOptions:{
        header: null,
      }
    },
    receivableAccount: {
      screen: receivableAccount,
      navigationOptions:{
        header: null,
      }
    },
    setBackgroundImg: {
      screen: setBackgroundImg,
      navigationOptions:{
        header: null,
      }
    },
    historicalBill: {
      screen: historicalBill,
      navigationOptions:{
        header: null,
      }
    },
    businessRebate: {
      screen: businessRebate,
      navigationOptions:{
        header: null,
      }
    },
    skuSetting: {
      screen: skuSetting,
      navigationOptions:{
        header: null,
      }
    },
    skuAdd: {
      screen: skuAdd,
      navigationOptions:{
        header: null,
      }
    },
    labelAdd: {
      screen: labelAdd,
      navigationOptions:{
        header: null,
      }
    },
    marketCategory: {
      screen: marketCategory,
      navigationOptions:{
        header: null,
      }
    },
    toBeVip: {
      screen: toBeVip,
      navigationOptions:{
        header: null,
      }
    },
    vipPrivilege: {
      screen: vipPrivilege,
      navigationOptions:{
        header: null,
      }
    },
    vipProfit: {
      screen: vipProfit,
      navigationOptions:{
        header: null,
      }
    },
    vipAgreement: {
      screen: vipAgreement,
      navigationOptions:{
        header: null,
      }
    },
    marketOrderList: {
      screen: marketOrderList,
      navigationOptions:{
        header: null,
      }
    },
    payResult: {
      screen: payResult,
      navigationOptions:{
        header: null,
      }
    },
    placeOrder: {
      screen: placeOrder,
      navigationOptions:{
        header: null,
      }
    },
    profitWithdrawal: {
      screen: profitWithdrawal,
      navigationOptions:{
        header: null,
      }
    },
    payment: {
      screen: payment,
      navigationOptions:{
        header: null,
      }
    },
    marketOrderDetails: {
      screen: marketOrderDetails,
      navigationOptions:{
        header: null,
      }
    },
    labelSetting: {
      screen: labelSetting,
      navigationOptions:{
        header: null,
      }
    },
  },
  {    
    navigationOptions: {
      gesturesEnabled: true
    }
  }
);

// start = codePush(start)
export default codePush(codePushOptions)(index);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
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

