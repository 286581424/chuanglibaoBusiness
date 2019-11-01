import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
    Modal,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import homepage from '../index/homes';
import login from './login';
import Progress from './CusProgressBar';
import codePush from 'react-native-code-push';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import NetUtils from '../PublicComponents/NetUtils';

var environmental = 0;  //0为生产环境，1为测试环境
var CODE_PUSH_PRODUCTION_KEY = ''
var codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

class updataJS extends Component {

    constructor(props) {
    super(props);
    this.state = {
      phone : '',
      token: '',
      syncMessage: '',
      progressText: '',
      progress: 0,
      isUpdata: false,
      loadingShow: true,
      checkLoadShow: false,
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
                                this.saveOperateType(responseBody.data.userBusinessInfo.operate_type);
                                this.saveBusinessID(responseBody.data.userBusinessInfo.id);
                                navigate(nextView,{key:nextView});
                                if (!this.state.isUpdata) {
                                  this.setState({loadingShow:false});
                                }
                              }else{
                                if (responseBody.errMsg == 'token is error') {
                                    Alert.alert('提示','用户已在别的设备登录，请重新登录',[{text:'确认',onPress:() => this._gotoLoginView(navigate)}]);
                                }else{
                                    Alert.alert('提示','用户登录异常，请重新登录,错误提示：'+JSON.stringify(responseBody),[{text:'确认',onPress:() => this._gotoLoginView(navigate)}]);
                                }
                              }
                          }).catch(error => {
                              alert(error);
                          });
                        }else{
                          navigate(nextView,{key:nextView});
                          if (!this.state.isUpdata) {
                            this.setState({loadingShow:false});
                          }
                        }
                }
            },1000);
    }

    _gotoLoginView(navigate){
      if (!this.state.isUpdata) {
        this.setState({loadingShow:false});
      }
      navigate('login',{key:'login'});
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
    codePush.disallowRestart()//禁止重启
    this.setState({checkLoadShow:true})
      codePush.checkForUpdate()
        .then((update) => {
                if (!update) {
                    this._gotoNextView();
                    this.setState({checkLoadShow:false})
                } else {
                    this.setState({checkLoadShow:false})
                    let packageSize = 0;
                    packageSize = update.packageSize/1024/1024;
                    packageSize = packageSize.toFixed(2);
                    this.setState({updateShow:true,updateInfo:update,packageSize:packageSize});
                }
            }
        );
    }

    appUpdata(){
        this.setState({isUpdata:true});
        this._setLoadingShow();
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
        codePush.sync({
          mandatoryInstallMode:codePush.InstallMode.IMMEDIATE,
          deploymentKey: CODE_PUSH_PRODUCTION_KEY,
          updateDialog : {
            //是否显示更新描述
            appendReleaseDescription : false ,
            //更新描述的前缀。 默认为"Description"
            descriptionPrefix : "更新内容：" ,
            //强制更新按钮文字，默认为continue
            mandatoryContinueButtonLabel : "立即更新" ,
            //强制更新时的信息. 默认为"An update is available that must be installed."
            mandatoryUpdateMessage : "有新版本，是否更新？" ,
            //非强制更新时，按钮文字,默认为"ignore"
            optionalIgnoreButtonLabel : '暂不更新' ,
            //非强制更新时，确认按钮文字. 默认为"Install"
            optionalInstallButtonLabel : '立即更新' ,
            //非强制更新时，检查到更新的消息文本
            optionalUpdateMessage : '有新版本了，是否更新？' ,
            //Alert窗口的标题
            title : '更新提示'
          } ,
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
                this._gotoNextView();
                break;
            case codePush.SyncStatus.UPDATE_IGNORED:
                this.setState({progressText: "用户选择忽略"});
                this._gotoNextView();
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({syncMessage: "已经安装"});
                this.setState({progressText: "安装完成"});
                codePush.restartApp();
                this.setState({loadingShow:false});
                this._gotoNextView();
                break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
                alert('An unknown error occurred');
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
                 <View style={{alignItems:'center'}}>
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
                  <Text style={{color:this.state.isUpdata?"black":"transparent",fontSize:ScreenUtils.setSpText(8)}}>{this.state.progress}%</Text>
                 </View>
               )
      }
    }

    render() {

        return (
            <View style={styles.container}>
                {this.renderProgress()}
                <Modal
                   animationType='fade'
                   transparent={true}
                   visible={this.state.updateShow}
                   onShow={() => {}}
                   onRequestClose={() => {}} >
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'center'}}>
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
            </View>
        );
    }

}

export default codePush(codePushOptions)(updataJS);

const styles = StyleSheet.create({
    container: {
        flex:1,
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

