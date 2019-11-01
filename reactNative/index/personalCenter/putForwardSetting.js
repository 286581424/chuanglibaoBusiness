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
  FlatList,
  NativeModules,
} from 'react-native';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import NetUtils from '../../PublicComponents/NetUtils';

export default class putForwardSetting extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '提现设置',
      businessID: '',
      mobile: '',
      statusBarHeight: 0,
      shopAddressTextInput: '',
    };
  }

  componentDidMount() {
    this.loadBusinessID();
    this.loadMobile();
    this.setState({shopAddressTextInput:this.props.navigation.state.params.address});
    this.setStatusBarHeight();
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

  componentWillReceiveProps(){
    
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

  _gotoBusinessProvince(navigate){
    navigate('province',{key:'businessAddress'});
  }

    _saveNumBtnPress(navigate,params){
     if(this.state.shopAddressTextInput != null){
      if (params.cityArray != null) {
        let shopInfoStr = {id:this.state.businessID,mobile:this.state.mobile,province:params.cityArray[0].city_code,city:params.cityArray[1].city_code,area:params.cityArray[2].city_code,street:params.cityArray[3].city_code,address:this.state.shopAddressTextInput};
         NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
            navigate('shopSeting',{key:'success'});
         });
      }else{
        Alert.alert('提示','请输入店铺地址');
      }
     }else{
         Alert.alert('提示','请输入详细地址');
     }
    }

    _shopAddressTextInputChangeText(value){
      this.setState({shopAddressTextInput:value});
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
                    <TouchableOpacity onPress={() => {goBack()}} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'white',textAlign:'right',left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(100)}}></Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
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
     numberTextInput: {
      width:ScreenUtils.scaleSize(490),
      height:ScreenUtils.scaleSize(60),
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      borderColor:'#F3A50E',
      borderRadius:ScreenUtils.scaleSize(5),
      borderWidth: ScreenUtils.scaleSize(2),
    },
});