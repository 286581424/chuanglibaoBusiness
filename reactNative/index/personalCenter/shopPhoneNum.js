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
import Swipeout from 'react-native-swipeout';
import NetUtils from '../../PublicComponents/NetUtils';

export default class shopPhoneNum extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '店铺电话',
      numberArr: [],
      businessID: '',
      mobile: '',
      statusBarHeight: 0,
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

  componentDidMount() {
    this.setStatusBarHeight();
    this.loadBusinessID();
    this.loadMobile();
    if (this.props.navigation.state.params.shopPhoneNum != null) {
        this.setState({numberArr:[this.props.navigation.state.params.shopPhoneNum]});
    }
  }

  _addBtnPress(){
    let arr = this.state.numberArr;
    if (arr.length >= 1) {
      Alert.alert('提示','最多增加1个');
      return;
    }
    arr.push('');
    this.setState({numberArr:arr});
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

  _numberTextInputChangeText(value,i){
    let arr = this.state.numberArr;
    if (i == 0) {
      arr.splice(i,1,value);
    }else{
      arr.splice(i,1,value);
    }
    this.setState({numberArr:arr});
  }

  _deleteBtnPress(item,i){
    let arr = this.state.numberArr;
    arr.splice(i,1);
    this.setState({numberArr:arr});
  }

    _renderPhoneItem(item,i){
       var swipeoutBtns = [
        {
          text: '删除',
          backgroundColor:'red',
          color: 'white',
          onPress: () => this._deleteBtnPress(item,i),
        }
      ];
      return (
        <Swipeout right={swipeoutBtns}>
                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',borderBottomColor:'#EEEEEE',borderBottomWidth:ScreenUtils.scaleSize(2)}}>
                  <TextInput
                        keyboardType='numeric'
                        maxLength={18}
                        placeholder='请输入号码'
                        placeholderTextColor='gray'
                        autoCorrect={false}
                        style={styles.numberTextInput}
                        onChangeText={(item) => this._numberTextInputChangeText(item,i)}
                        value={item}
                        underlineColorAndroid='transparent'
                      />
                </View>
          </Swipeout>
             );
    }

    _saveNumBtnPress(navigate,params){
      if (this.state.numberArr != null) {
        if (params.key == 'shopSeting') {
          let shopInfoStr = {id:this.state.businessID,mobile:this.state.mobile,contact_number:this.state.numberArr[0]};
           NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
              navigate(params.key,{shopPhoneNum:this.state.numberArr});
           });
         }else{
            navigate(params.key,{shopPhoneNum:this.state.numberArr});
         }
      }else{
        Alert.alert('提示','请输入联系电话');
      }
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
    )

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
                    <TouchableOpacity onPress={() => this._addBtnPress()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'white',textAlign:'right',left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(100),fontSize:ScreenUtils.setSpText(8)}}>增加</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>

                  <KeyboardAwareScrollView>
                  {this.state.numberArr.map((item,i) => this._renderPhoneItem(item,i))}
                  </KeyboardAwareScrollView>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE'}}>
                    <Button onPress={() => this._saveNumBtnPress(navigate,params)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存</Text>
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
     numberTextInput: {
        width:ScreenUtils.scaleSize(550),
        height:ScreenUtils.scaleSize(60),
        left:ScreenUtils.scaleSize(60),
        borderColor:'#EEEEEE',
        borderRadius:ScreenUtils.scaleSize(5),
        borderWidth:ScreenUtils.scaleSize(1),
        fontSize: ScreenUtils.setSpText(8),
        padding: 0,
        color:'black',
      },
});