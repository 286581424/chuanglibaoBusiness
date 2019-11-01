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
  Modal,
  NativeModules,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import Picker from 'react-native-picker';
import {StackNavigator} from 'react-navigation';
import NetUtils from '../PublicComponents/NetUtils';

const { StatusBarManager } = NativeModules;

pickerDatas = ['超市便利','美食','休闲娱乐','生活服务','外卖'];

var dismissKeyboard = require('dismissKeyboard');

export default class openShop extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '店铺介绍',
      nextStepValue: '', 
      numberTextInput: '', //手机号输入框value
      verificationCode: '', //验证码输入框value
      businessNameTextInput: '',
      businessTypeText: '请选择分类',
      businessType: 0,
      show:false,
      statusBarHeight: 0,
      sale_type: '请选择营业类型',
      sale_type_data: [],
      businessTypeData: [],
      businessType_dec: '',
  };
  }

  componentDidMount() {
    this.setStatusBarHeight();
    this.getBusinessTypeData()
  }

  getBusinessTypeData(){
      let params = '?level=1&parentId=0';
      NetUtils.get('business/operateType', params, (result) => {
          console.log(result)
          this.setState({businessTypeData:result})
      });
    }

  setStatusBarHeight(){
    let height = 0;
    if (Platform.OS === 'android') {
      height = StatusBar.currentHeight * 2;
      this.setState({statusBarHeight:height});
    }else{
      StatusBarManager.getHeight((statusBarHeight)=>{
        if (statusBarHeight.height == '20') {
          height = 40;
        }else{
          height = 80;
        }
        this.setState({statusBarHeight:height});
      })
    }
  }

    _businessNameTextInputChangeText(value){
      this.setState({businessNameTextInput:value});
    }

    _showBusinessTypePicker(){
      dismissKeyboard();
      let type = 0
      let data = []
      for (let a of this.state.businessTypeData) {
        if (a.type!=4) {
          data.push(a.name_of_business_operate_type)
        }
      }
      if (this.state.businessTypeText == '请选择分类') {
        type = data[0]
      }else{
        type = this.state.businessTypeText
      }
        Picker.init({
            pickerData: data,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText:'商家类型',
            selectedValue: [type],
            onPickerConfirm: data => {
                let str = data[0];
                this.setState({businessTypeText:str});
                for (let a of this.state.businessTypeData) {
                  if (a.name_of_business_operate_type == str) {
                    this.setState({businessType:a.type,sale_type:'请选择营业类型'})
                    switch(a.type){
                      case 1:
                        this.setState({businessType_dec:a.name_of_business_operate_type+':销售实体类型商品，支持商家配送、到店取餐'})
                        break;
                      case 2:
                        this.setState({businessType_dec:a.name_of_business_operate_type+':销售消费券类型商品，如优惠券、套餐券等'})
                        break;
                      case 3:
                        this.setState({businessType_dec:a.name_of_business_operate_type+':销售消费券类型商品，如优惠券、套餐券等'})
                        break;
                      case 5:
                        this.setState({businessType_dec:a.name_of_business_operate_type+':销售消费券类型商品，如优惠券、套餐券等'})
                        break;
                      case 6:
                        this.setState({businessType_dec:a.name_of_business_operate_type+':销售实体类型商品，支持商家配送、到店取餐、到店用餐'})
                        break;
                    }
                    this.getSaleTypeData(a.id)
                  }
                }
            },
            onPickerCancel: data => {
                // console.log(data);
            },
            onPickerSelect: data => {
                // console.log(data);
            }
        });
        Picker.show();
    }

    getSaleTypeData(id){
      let params = '?level=2&parentId='+id;
      NetUtils.get('business/operateType', params, (result) => {
          console.log(result)
          this.setState({sale_type_data:result})
      });
    }

    _showSaleTypePicker(){
      if (this.state.businessType == 0) {
        Alert.alert('提示','请先选择分类')
        return
      }
      dismissKeyboard();
      let type = 0
      let data = []
      for (let a of this.state.sale_type_data) {
        data.push(a.name_of_business_operate_type)
      }
      if (this.state.sale_type == '请选择营业类型') {
        type = data[0]
      }else{
        type = this.state.sale_type
      }
        Picker.init({
            pickerData: data,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText:'商家类型',
            selectedValue: [type],
            onPickerConfirm: data => {
                let str = data[0];
                this.setState({sale_type:str});
            },
            onPickerCancel: data => {
                // console.log(data);
            },
            onPickerSelect: data => {
                // console.log(data);
            }
        });
        Picker.show();
    }

    _openShopBtn(navigate,params){
      dismissKeyboard();
        if (this.state.businessNameTextInput != '' && this.state.businessTypeText != '请选择分类') {
              navigate('shopInfo',{sale_type:this.state.sale_type,phoneNum:params.phone,smsCode:params.smsCode,password:params.password,shopName:this.state.businessNameTextInput,shopType:this.state.businessType});
        }else{
            if (this.state.businessNameTextInput == '') {
                Alert.alert('提示','请输入店名');
            }else{
                Alert.alert('提示','请选择分类');
            }
        }
    }

    render() {
            const { navigate,goBack,state } = this.props.navigation;
            const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => {goBack()}} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('./images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(11),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(114)}}>
                    </View>

                    <Text style={{width:ScreenUtils.scaleSize(750),fontSize:ScreenUtils.setSpText(10),textAlign:'center',color:'#000000'}}><Text style={{color:'red'}}>*</Text>填写你的店名和分类</Text>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(96)}}>
                    </View>

                    <View style={{borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),left:ScreenUtils.scaleSize(33),width:ScreenUtils.scaleSize(684),height:ScreenUtils.scaleSize(94),alignItems:'center',justifyContent:'center'}}>
                      <TextInput
                          placeholder='请输入店铺名称号'
                          placeholderTextColor='gray'
                          maxLength={16}
                          autoCorrect={false}
                          style={{color:'black',width:ScreenUtils.scaleSize(602),height:ScreenUtils.scaleSize(60),padding:0,fontSize:ScreenUtils.setSpText(9)}}
                          onChangeText={(businessNameTextInput) => this._businessNameTextInputChangeText(businessNameTextInput)}
                          value={this.state.businessNameTextInput}
                          underlineColorAndroid='transparent'
                        />
                     </View>

                     <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(25)}}></View>

                    <View style={{borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),left:ScreenUtils.scaleSize(33),width:ScreenUtils.scaleSize(684),height:ScreenUtils.scaleSize(94),alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => this._showBusinessTypePicker()} style={{width:ScreenUtils.scaleSize(670),height:ScreenUtils.scaleSize(60),alignItems:'center',flexDirection:'row'}}>
                          <Text style={{color:'gray',fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(590),left:ScreenUtils.scaleSize(30)}}>{this.state.businessTypeText}</Text>
                          <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(20),height:ScreenUtils.scaleSize(12)}} source={require('./images/choose.png')}/>
                        </TouchableOpacity>
                     </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(40)}}></View>

                    <View style={{borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),left:ScreenUtils.scaleSize(33),width:ScreenUtils.scaleSize(684),height:ScreenUtils.scaleSize(94),alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={() => this._showSaleTypePicker()} style={{width:ScreenUtils.scaleSize(670),height:ScreenUtils.scaleSize(60),alignItems:'center',flexDirection:'row'}}>
                          <Text style={{color:'gray',fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(590),left:ScreenUtils.scaleSize(30)}}>{this.state.sale_type}</Text>
                          <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(20),height:ScreenUtils.scaleSize(12)}} source={require('./images/choose.png')}/>
                        </TouchableOpacity>
                     </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(40)}}></View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(40)}}></View>

                     <Text style={{left:ScreenUtils.scaleSize(33),width:ScreenUtils.scaleSize(684),fontSize:ScreenUtils.setSpText(8),color:'gray'}}>{this.state.businessType_dec}</Text>

                    <View style={{flex:1,justifyContent:'flex-end'}}>
                      <Button onPress={() => this._openShopBtn(navigate,params)} style={styles.loginBtn}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(11)}}>开店</Text>
                     </Button>
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    wechatLogin: {
        backgroundColor:'white',
        borderColor:'black',
        borderWidth:ScreenUtils.scaleSize(2),
        width: ScreenUtils.scaleSize(208),
        height: ScreenUtils.scaleSize(208),
        left: ScreenUtils.scaleSize(271),
    },
    wechatLoginImg: {
        width: ScreenUtils.scaleSize(208),
        height: ScreenUtils.scaleSize(208),
    },
    loginBtn: {
        top:ScreenUtils.scaleSize(-32),
        left: ScreenUtils.scaleSize(30),
        width: ScreenUtils.scaleSize(690),
        height: ScreenUtils.scaleSize(92),
        backgroundColor: '#F3A50E',
        borderWidth: 0,
        borderRadius: ScreenUtils.scaleSize(1334)/60,
      },
});