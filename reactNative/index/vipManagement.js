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
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../PublicComponents/NetUtils';

export default class vipManagement extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '会员管理',
      tabTitleIndex: 1,
      statusBarHeight: 0,
      phone: '',
      token: '',
      totalRecord: '',
      firstRecord: '',
      shareRecord: '',
      fansRecord: '',
      vipList: '',
  };
  }

  componentWillUnmount(){
     this.deEmitter.remove();
  };

  componentDidMount(){
    this.deEmitter = DeviceEventEmitter.addListener('vipManagementListener', (a) => {
        this.loadPhone();
        this.loadToken();
        setTimeout(() => {
            this.loadMyteam(0);
        },300);
    });
    this.setStatusBarHeight();
    this.loadPhone();
    this.loadToken();
    setTimeout(() => {
      this.loadMyteam(0);
    },300);
  }

  loadMyteam(){
    let params = '?mobile=' + this.state.phone + '&token=' + this.state.token[1] + '&type=B';
    NetUtils.get('member/myteam', params, (result) => {
      // alert(JSON.stringify(result))
      this.setState({totalRecord:result.totalRecord});
      this.setState({firstRecord:result.firstRecord});
      this.setState({shareRecord:result.shareRecord});
      this.setState({fansRecord:result.fansRecord});
      this.setState({vipList:result.firstRecord.list});
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

  _renderHeaderImage(head_portrait){
    if (head_portrait == null) {
      return <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100),borderRadius:ScreenUtils.scaleSize(50)}} source={require('./images/header.jpg')}/>
    }else{
      return <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(100),borderRadius:ScreenUtils.scaleSize(50)}} source={{uri:head_portrait}}/>
    }
  }

     _renderItem(item){
       return (
                 <View style={{width:ScreenUtils.scaleSize(750),alignItems:'center',flexDirection:'row',backgroundColor:'white'}}>
                   <View style={{width:ScreenUtils.scaleSize(148),alignItems:'center',justifyContent:'center'}}>
                     {this._renderHeaderImage(item.head_portrait)}
                   </View>
                   <View style={{width:ScreenUtils.scaleSize(550),alignItems:'center'}}>
                     <View style={{height:ScreenUtils.scaleSize(30)}}></View>
                     <Text style={{width:ScreenUtils.scaleSize(550),color:'black',fontSize:ScreenUtils.setSpText(10)}}>{item.nickname}</Text>
                     <View style={{height:ScreenUtils.scaleSize(22)}}></View>
                     <Text style={{width:ScreenUtils.scaleSize(550),color:'black',fontSize:ScreenUtils.setSpText(8)}}>会员ID：{item.member_id}</Text>
                     <View style={{height:ScreenUtils.scaleSize(22)}}></View>
                     <Text style={{width:ScreenUtils.scaleSize(550),color:'black',fontSize:ScreenUtils.setSpText(8)}}>手机号码：{item.mobile}</Text>
                     <View style={{height:ScreenUtils.scaleSize(30)}}></View>
                   </View>
                 </View>
              );
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
    )

    tabOnChange(i){
      this.setState({tabTitleIndex:i});
      if (i == 1) {
        this.setState({vipList:this.state.firstRecord.list});
      }else if (i == 2) {
        this.setState({vipList:this.state.shareRecord.list});
      }else{
        this.setState({vipList:this.state.fansRecord.list});
      }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#F3A50E'}}>
                    <Text style={{width:ScreenUtils.scaleSize(672/2),fontSize:ScreenUtils.setSpText(9),color:'white'}}>会员总数</Text>
                    <Text style={{width:ScreenUtils.scaleSize(672/2),fontSize:ScreenUtils.setSpText(9),textAlign:'right',color:'white'}}>{this.state.totalRecord.count}人</Text>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150),flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => this.tabOnChange(1)} style={{width:ScreenUtils.scaleSize(750/3),height:ScreenUtils.scaleSize(120),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(29),flexDirection:'row'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.tabTitleIndex == 1?'#fea712':'#434343',textAlign:'center'}}>一级会员</Text>
                        <View style={{width:ScreenUtils.scaleSize(9)}}></View>
                        <Image source={this.state.tabTitleIndex == 1?require('./images/vipManagement/vipa.png'):require('./images/vipManagement/vip1.png')} style={{width:ScreenUtils.scaleSize(21),height:ScreenUtils.scaleSize(21)}}/>
                      </View>
                      <Text style={{top:ScreenUtils.scaleSize(46),fontSize:ScreenUtils.setSpText(8),color:this.state.tabTitleIndex == 1?'#fea712':'#434343',textAlign:'center'}}>{this.state.firstRecord.count}人</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.tabOnChange(2)} style={{width:ScreenUtils.scaleSize(750/3),height:ScreenUtils.scaleSize(120),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(29),flexDirection:'row'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.tabTitleIndex == 2?'#fea712':'#434343',textAlign:'center'}}>二级会员</Text>
                        <View style={{width:ScreenUtils.scaleSize(9)}}></View>
                        <Image source={this.state.tabTitleIndex == 2?require('./images/vipManagement/vipb.png'):require('./images/vipManagement/vip2.png')} style={{width:ScreenUtils.scaleSize(21),height:ScreenUtils.scaleSize(21)}}/>
                      </View>
                      <Text style={{top:ScreenUtils.scaleSize(46),fontSize:ScreenUtils.setSpText(8),color:this.state.tabTitleIndex == 2?'#fea712':'#434343',textAlign:'center'}}>{this.state.shareRecord.count}人</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.tabOnChange(3)} style={{width:ScreenUtils.scaleSize(750/3),height:ScreenUtils.scaleSize(120),alignItems:'center'}}>
                      <View style={{top:ScreenUtils.scaleSize(29),flexDirection:'row'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(9),color:this.state.tabTitleIndex == 3?'#fea712':'#434343',textAlign:'center'}}>三级会员</Text>
                        <View style={{width:ScreenUtils.scaleSize(9)}}></View>
                        <Image source={this.state.tabTitleIndex == 3?require('./images/vipManagement/vipc.png'):require('./images/vipManagement/vip3.png')} style={{width:ScreenUtils.scaleSize(21),height:ScreenUtils.scaleSize(21)}}/>
                      </View>
                      <Text style={{top:ScreenUtils.scaleSize(46),fontSize:ScreenUtils.setSpText(8),color:this.state.tabTitleIndex == 3?'#fea712':'#434343',textAlign:'center'}}>{this.state.fansRecord.count}人</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList 
                      style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}
                      data={this.state.vipList}
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