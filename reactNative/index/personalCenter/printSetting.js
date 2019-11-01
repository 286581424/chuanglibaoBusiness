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
  Modal,
  NativeEventEmitter,
  TouchableHighlight,
} from 'react-native';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import NetUtils from '../../PublicComponents/NetUtils';
import { Switch } from 'react-native-switch';

export default class printSetting extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '打印机列表',
      token: '',
      statusBarHeight: 0,
      printList: [],
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

  deviceListShow(){
    let deviceListShow = this.state.deviceListShow
    this.setState({deviceListShow:!deviceListShow})
  }

  componentWillReceiveProps(){
    this.getPrintList();
  }

  getPrintList(){
    let params = '?token=' + this.state.token[1]
    NetUtils.get('business/printerList', params, (result) => {
      console.log(result)
      this.setState({printList:result})
    });
  }

    componentDidMount(){
      this.setStatusBarHeight();
      this.loadToken();
      setTimeout(() => {
        this.getPrintList()
      },400);
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>
    )

    _renderEmptyView= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>暂未连接打印机，请添加</Text>
      </View>
    )

    _renderItem(item,navigate){
       return (
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'white',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                  <Text style={{color:'black',width:ScreenUtils.scaleSize(550),fontSize:ScreenUtils.setSpText(9)}}>{item.print_name}</Text>
                  <TouchableOpacity onPress={() => navigate('printInfo',{key:'info',info:item})} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                    <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                  </TouchableOpacity>
                </View>
              )
    }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => navigate('printInfo',{key:'add'})} style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9)}}>添加</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList 
                    style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}
                    data={this.state.printList}
                    renderItem={({item}) => this._renderItem(item,navigate)}
                    ItemSeparatorComponent={this._renderFenge}
                    ListEmptyComponent={this._renderEmptyView}
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