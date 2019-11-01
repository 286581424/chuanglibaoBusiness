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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../../PublicComponents/NetUtils';

export default class businessState extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '营业状态',
      tabTitleIndex: 0,
      status: 0,
      statusText: '',  //营业状态text
      statusDec: '',  //营业状态描述
      statusBtnText: '',  //按钮文字
      businessTime: '',  //营业时间
      businessID: '',  //商家id
      mobile: '',  //手机号
      times: '',
      businessTime: '',
      mobile:'',
      businessID: '',
      token: '',
      statusBarHeight: 0,
  };
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

  loadBusinessID(){
    storage.load({
        key: 'id',
        id: '1007'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({businessID:ret});
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

  loadMobile(){
    storage.load({
        key: 'phone',
        id: '1005'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({mobile:ret});
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadBusinessID();
    this.loadMobile();
    this.loadToken();
    this.setState({statusText:this.props.navigation.state.params.status});
    let str = this.props.navigation.state.params.businessTime;
    console.log(str)
    this.setState({businessTime:this.props.navigation.state.params.businessTime});
    if (str != null) {
          let arr = str.split('  ')
          this.setState({times:arr[1]});
    }
    if (this.props.navigation.state.params.status == '未营业') {
      this.setState({status:0});
      this.setState({statusDec:'当前商家处于未营业中，暂不接受订单'});
      this.setState({statusBtnText:'开始营业'});
    }else{
      this.setState({status:1});
      this.setState({statusDec:'当前商家处于正常营业中，接受订单'});
      this.setState({statusBtnText:'暂停营业'});
    }
  }

  componentWillReceiveProps(){
    let params = "?user_type=B&mobile=" + this.state.mobile+'&token=' + this.state.token[1];
    NetUtils.get('business/getUserBusinessInfoByBusiness', params, (result) => {
      let str = result.userBusinessInfo.business_hours;
      this.setState({businessTime:this.props.navigation.state.params.businessTime});
      let arr = str.split('  ');
      this.setState({times:arr[1]});
    });
  }

  _setBusinessTimePress(navigate,params){
    navigate('businessTime',{key:'businessState',businessTime:this.state.businessTime});
  }

  _businessStatePress(navigate,params){
    let status = 0;
    if(this.state.status == 0){
      status = 1;
    }else{
      status = 0;
    }
    let statusStr = {id:this.state.businessID,mobile:this.state.mobile,status:status};
     NetUtils.postJson('business/updateBusiness',statusStr,'',(result) => {
        Alert.alert('提示',result,[{text: '确定', onPress: () => this._setStatusSuccess(navigate)}]);
     });
  }

  _setStatusSuccess(navigate){
    navigate('homepage',{key:'setStatusSuccess'});
  }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this._setBusinessTimePress(navigate,params)} style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'white',width:ScreenUtils.scaleSize(150)}}>修改时间</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250),alignItems:'center'}}>
                    <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(130),flexDirection:'row',alignItems:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
                        <Image style={{width:ScreenUtils.scaleSize(80),height:ScreenUtils.scaleSize(80),borderRadius:ScreenUtils.scaleSize(40)}} source={{uri:params.logo}} />
                      </View>
                      <Text style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(300),fontSize:ScreenUtils.setSpText(9),color:'black',fontWeight:'bold'}}>{this.state.statusText}</Text>
                    </View>
                    <Text style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(630),fontSize:ScreenUtils.setSpText(8),color:'black'}}>营业时间： {this.state.times}</Text>
                    <Text style={{top:ScreenUtils.scaleSize(25),width:ScreenUtils.scaleSize(630),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{this.state.statusDec}</Text>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(30),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE'}}>
                    <Button onPress={() => this._businessStatePress(navigate,params)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                      <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>{this.state.statusBtnText}</Text>
                    </Button>
                  </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    scrollableTabview: {
        backgroundColor:'#EEEEEE',
        width: ScreenUtils.scaleSize(750),
        height: ScreenUtils.scaleSize(390),
      },
     underline: {
        borderColor: 'red',
        backgroundColor: '#F3A50E',
      },
});