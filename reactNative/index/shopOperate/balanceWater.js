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
import NetUtils from '../../PublicComponents/NetUtils';

var balanceArr = [
                {name:'余额提现',type:'-',money:'100.00',time:'2018.07.21',state:'已转出',balance:'0'},
                {name:'账单',type:'+',money:'100.00',time:'2018.07.21',state:'已汇入',balance:'100'},
             ];

export default class balanceWater extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '余额流水',
      statusBarHeight: 0,
      token: '',
      phone: '',
      balance: 0,
  };
  }

  updateAccountRecord(){
    setTimeout(() => {
        let params = "?pageNum=1&pageSize=100&mobile=" + this.state.phone+'&token=' + this.state.token[1];
        NetUtils.get('business/accountRecord', params, (result) => {
            alert(result)
            // this.setState({balance:result.balance});
        });
    },200);
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken();
    this.loadPhone();
    this.updateAccountRecord();
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

     _renderItem(item){
      let txtColor = '';
      if (item.type == '+') {
        txtColor = 'green';
      }else{
        txtColor = 'red';
      }
      return (
          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150),flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'white',flexDirection:'row'}}>
            <View style={{width:ScreenUtils.scaleSize(690/2),height:ScreenUtils.scaleSize(120),justifyContent:'center'}}>
              <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.name}</Text>
              <Text style={{top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>{item.time} {item.state}</Text>
            </View>
            <View style={{width:ScreenUtils.scaleSize(690/2),height:ScreenUtils.scaleSize(120),justifyContent:'center'}}>
              <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(8),color:txtColor,textAlign:'right',fontWeight:'bold'}}>{item.type}¥ {item.money}</Text>
              <Text style={{top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(8),color:'gray',textAlign:'right'}}>余额： {item.balance}</Text>
            </View>
          </View>
      );
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
    )

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                  <FlatList 
                      style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150*balanceArr.length)}}
                      data={balanceArr}
                      renderItem={({item}) => this._renderItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
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