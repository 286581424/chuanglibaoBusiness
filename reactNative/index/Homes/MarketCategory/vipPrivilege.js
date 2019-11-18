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
} from 'react-native';
import ScreenUtils from '../../../PublicComponents/ScreenUtils';
import NetUtils from '../../../PublicComponents/NetUtils';

export default class vipPrivilege extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '团美家VIP会员特权',
      statusBarHeight: 0,
      token: '',
      phone: '',
      privilegeService: '',
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
    this.loadToken()
    this.loadPhone()
    this.getPrivilegeService()
  }

  getPrivilegeService(){
    NetUtils.get('user/privilegeService', '?type=1', (result) => {
        this.setState({privilegeService:result})
    });
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../../login/images/login_back1.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'#000000',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <Text style={{width:ScreenUtils.scaleSize(672),left:ScreenUtils.scaleSize(39),top:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(9),color:'black'}}>{this.state.privilegeService.content}</Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});