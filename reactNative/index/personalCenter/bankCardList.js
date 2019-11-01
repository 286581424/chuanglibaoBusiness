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
import bankList from '../bankList/bankList'

export default class bankCardList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '银行卡列表',
      mobile: '',
      isPress: '',
      statusBarHeight: 0,
      bankCardList: '',
      token: '',
      phone: '',
      addBank: false,
      bankList: '',
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

  _getBankCardList(){
    const { params } = this.props.navigation.state;
    let str = '?mobile='+this.state.phone+'&token='+this.state.token[1];
    NetUtils.get('business/findBusinessAccount', str, (result) => {
      // alert(JSON.stringify(result)); 
      if (result != null) {
        this.setState({addBank:false})
        let arr = [];
        arr.push(result)
        this.setState({bankCardList:arr});
      }else{
        this.setState({addBank:true})
        this.setState({bankCardList:[]})
      }
    });
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken();
    this.loadPhone();
    let arr = JSON.stringify(bankList);
    setTimeout(() => {
      this._getBankCardList();
    },300);
  }

  componentWillReceiveProps(){
    this._getBankCardList();
  }

  btnPress(value){
    this.setState({isPress:value});
  }

  _renderFengge = () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
  )

  _addCardPress(navigate){
    navigate('receivableAccount',{key:'add',nextView:'bankCardList'});
  }

  _editCardPress(item){
    const { navigate } = this.props.navigation;
    navigate('receivableAccount',{key:'edit',bankCardInfo:item,nextView:'bankCardList'})
  }

  _renderBankCardListItem(item){
    return (
              <View style={{alignItems:'center',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(140),flexDirection:'row',backgroundColor:'white',alignItems:'center'}}>
                <View style={{width:ScreenUtils.scaleSize(348),height:ScreenUtils.scaleSize(140)}}>
                  <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(31),left:ScreenUtils.scaleSize(39)}}>{item.account_type == 1?'支付宝':item.bank}</Text>
                  <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8),fontWeight:'500',top:ScreenUtils.scaleSize(60),left:ScreenUtils.scaleSize(39)}}>{item.account_num}</Text>
                </View>
                <TouchableOpacity onPress={() => this._editCardPress(item)} style={{left:ScreenUtils.scaleSize(270),width:ScreenUtils.scaleSize(111),height:ScreenUtils.scaleSize(44),borderRadius:ScreenUtils.scaleSize(10),borderColor:'#F3A50E',borderWidth:1,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>编辑</Text>
                </TouchableOpacity>
              </View>
           );
  }

  renderAddBank(navigate){
    if (this.state.addBank) {
      return (
                  <TouchableOpacity onPress={() => this._addCardPress(navigate)} style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(7.5)}}>添加银行卡</Text>
                  </TouchableOpacity>
              )
    }
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'#F3A50E',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <ScrollView>
                    <FlatList 
                        style={{width:ScreenUtils.scaleSize(750)}}
                        data={this.state.bankCardList}
                        renderItem={({item}) => this._renderBankCardListItem(item)}
                        ItemSeparatorComponent={this._renderFengge}
                    />
                  </ScrollView>

                  {this.renderAddBank(navigate)}

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
      width:ScreenUtils.scaleSize(380),
      height:ScreenUtils.scaleSize(60),
      left: ScreenUtils.scaleSize(50),
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      borderColor:'gray',
      borderRadius:ScreenUtils.scaleSize(5),
      borderWidth: ScreenUtils.scaleSize(2),
    },
});