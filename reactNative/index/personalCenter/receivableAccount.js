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
  Modal,
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

var accountTypeArray = [
                     {name:'银行卡'},
                     {name:'支付宝'},
                  ];

const bankListArr = bankList.bankList;
export default class receivableAccount extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '收款账号',
      mobile: '',
      isPress: '',
      moneyTextInput: '',
      show: false,
      accountTypeText: '银行卡',
      accountBankTextInput: '',
      accountBankAddressTextInput: '',
      accountTextInput: '',
      nameTextInput: '',
      moblieTextInput: '',
      statusBarHeight: 0,
      isDefault: true,
      phone: '',
      token: '',
      accountInfo: [],
      user_business_info_id: 0,
      bankList: '',
      showBankList: false,
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

  updateShopInfo(){
    setTimeout(() => {
        let params = "?user_type=B&mobile=" + this.state.phone+'&token=' + this.state.token[1];
        NetUtils.get('business/getUserBusinessInfoByBusiness', params, (result) => {
            // alert(JSON.stringify(result))
            this.setState({user_business_info_id:result.userBusinessInfo.id})
        });
    },200);
  }

  componentDidMount(){
    this.setStatusBarHeight()
    this.loadPhone()
    this.loadToken()
    this.updateShopInfo()
    const { params } = this.props.navigation.state;
    if (params.key == 'edit') {
      // alert(JSON.stringify(params.bankCardInfo))
      let arr = params.bankCardInfo;
      if (arr.account_type == 0) {
        this.setState({accountTypeText:'银行卡'});
      }else{
        this.setState({accountTypeText:'支付宝'});
      }
      this.setState({accountInfo:arr})
      this.setState({accountBankTextInput:arr.bank})
      this.setState({accountBankAddressTextInput:arr.branch})
      this.setState({accountTextInput:arr.account_num})
      this.setState({nameTextInput:arr.payee})
      this.setState({moblieTextInput:arr.contact_number})
      if (arr.is_defaulted == 1) {
        this.setState({isDefault:true})
      }else{
        this.setState({isDefault:false})
      }
    }
  }

   // 显示/隐藏 modal
  _setModalVisible() {
    let isShow = this.state.show;
    this.setState({
      show:!isShow,
    });
  }

  _setBankListVisible() {
    let isShow = this.state.showBankList;
    this.setState({
      showBankList:!isShow,
    });
  }

  btnPress(value){
    this.setState({isPress:value});
  }

  _accountTextInputChangeText(value){
    this.setState({accountTextInput:value});
  }

  _nameTextInputChangeText(value){
    this.setState({nameTextInput:value});
  }

  _mobileTextInputChangeText(value){
    this.setState({moblieTextInput:value});
  }

  _accountBankTextInputChangText(value){
    this.setState({accountBankTextInput:value});
  }

  _accountBankAddressTextInputChangText(value){
    this.setState({accountBankAddressTextInput:value});
  }

  _renderFengge = () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderFengge1 = () => (
      <View style={{width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _chooseType(name){
    this.setState({accountTypeText:name});
    this._setModalVisible();
  }

  _renderBankCardItem(item){
    return (
              <TouchableOpacity onPress={() => this._chooseType(item.name)} style={{borderRadius:ScreenUtils.scaleSize(15),alignItems:'center',width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(88),alignItems:'center',flexDirection:'row',backgroundColor:'white'}}>
                <Text style={{width:ScreenUtils.scaleSize(400),left:ScreenUtils.scaleSize(26),fontSize:ScreenUtils.setSpText(8)}}>{item.name}</Text>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                  <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(32),height:ScreenUtils.scaleSize(32),left:ScreenUtils.scaleSize(-20)}} source={item.name == this.state.accountTypeText ? require('../images/gou.png') : require('../images/gou_un.png')}/>
                </View>
              </TouchableOpacity>
           );
  }

  _renderBankListItem(item){
    return (
              <TouchableOpacity onPress={() => this._chooseBank(item.bank_name)} style={{borderRadius:ScreenUtils.scaleSize(15),alignItems:'center',width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(88),alignItems:'center',flexDirection:'row',backgroundColor:'white'}}>
                <Text style={{width:ScreenUtils.scaleSize(400),left:ScreenUtils.scaleSize(26),fontSize:ScreenUtils.setSpText(8)}}>{item.bank_name}</Text>
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                  <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(32),height:ScreenUtils.scaleSize(32),left:ScreenUtils.scaleSize(-20)}} source={item.bank_name == this.state.accountBankTextInput ? require('../images/gou.png') : require('../images/gou_un.png')}/>
                </View>
              </TouchableOpacity>
           );
  }

  _chooseBank(bank_name){
    this.setState({accountBankTextInput:bank_name})
    this._setBankListVisible()
  }

  renderView(){
    if (this.state.accountTypeText == '银行卡') {
      return (
               <View>
                 <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>开户银行</Text>
                    <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() => this._setBankListVisible()}>
                      <Text style={{left:ScreenUtils.scaleSize(30),color:this.state.accountBankTextInput == ''?'gray':'black',width:ScreenUtils.scaleSize(550),fontSize:ScreenUtils.setSpText(8)}}>{this.state.accountBankTextInput == ''?'请选择开户银行':this.state.accountBankTextInput}</Text>
                      <Image style={{top:-ScreenUtils.scaleSize(0),resizeMode:'stretch',width:ScreenUtils.scaleSize(13*1.5),height:ScreenUtils.scaleSize(23*1.5)}} source={require('../images/shopSecond/shop_second_more.png')}/>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>开户行地址</Text>
                    <TextInput
                        placeholder='请输入开户行地址'
                        placeholderTextColor='gray'
                        maxLength={20}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(accountBankAddressTextInput) => this._accountBankAddressTextInputChangText(accountBankAddressTextInput)}
                        value={this.state.accountBankAddressTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>{this.state.accountTypeText}号</Text>
                    <TextInput
                        keyboardType='numeric'
                        placeholder='请输入银行卡号'
                        placeholderTextColor='gray'
                        maxLength={20}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(accountTextInput) => this._accountTextInputChangeText(accountTextInput)}
                        value={this.state.accountTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>真实姓名</Text>
                    <TextInput
                        placeholder='请输入真实姓名'
                        placeholderTextColor='gray'
                        maxLength={20}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(nameTextInput) => this._nameTextInputChangeText(nameTextInput)}
                        value={this.state.nameTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>预留电话</Text>
                    <TextInput
                        keyboardType='numeric'
                        placeholder='请输入预留电话'
                        placeholderTextColor='gray'
                        maxLength={11}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(moblieTextInput) => this._mobileTextInputChangeText(moblieTextInput)}
                        value={this.state.moblieTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>设置为默认</Text>
                    <Text style={{width:ScreenUtils.scaleSize(300),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(7.5)}}></Text>
                    <View style={{width:ScreenUtils.scaleSize(690/2-300),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Switch
                        onValueChange={(value) => this.setState({isDefault: value})}
                        style={{marginBottom:10,marginTop:10}}
                        value={this.state.isDefault} />
                    </View>
                  </View>
               </View>
             )
    }else{
      return (
               <View>
                 <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{this.state.accountTypeText}账号</Text>
                    <TextInput
                        keyboardType='numeric'
                        placeholder='请输入账号'
                        placeholderTextColor='gray'
                        maxLength={20}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(accountTextInput) => this._accountTextInputChangeText(accountTextInput)}
                        value={this.state.accountTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',fontSize:ScreenUtils.setSpText(8)}}>真实姓名</Text>
                    <TextInput
                        placeholder='请输入真实姓名'
                        placeholderTextColor='gray'
                        maxLength={20}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(nameTextInput) => this._nameTextInputChangeText(nameTextInput)}
                        value={this.state.nameTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',alignItems:'center'}}>
                    <Text style={{left:ScreenUtils.scaleSize(30),color:'black',fontSize:ScreenUtils.setSpText(8)}}>联系电话</Text>
                    <TextInput
                        keyboardType='numeric'
                        placeholder='请输入联系电话'
                        placeholderTextColor='gray'
                        maxLength={11}
                        autoCorrect={false}
                        style={{color:'black',left:ScreenUtils.scaleSize(63),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),padding:0,}}
                        onChangeText={(moblieTextInput) => this._mobileTextInputChangeText(moblieTextInput)}
                        value={this.state.moblieTextInput}
                        underlineColorAndroid='transparent'
                      />
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>设置为默认</Text>
                    <Text style={{width:ScreenUtils.scaleSize(300),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(7.5)}}></Text>
                    <View style={{width:ScreenUtils.scaleSize(690/2-300),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Switch
                        onValueChange={(value) => this.setState({isDefault: value})}
                        style={{marginBottom:10,marginTop:10}}
                        value={this.state.isDefault} />
                    </View>
                  </View>
               </View>
             )
    }
  }

  _saveBtnPress(navigate){
    const { params } = this.props.navigation.state;
    let type = 0;
    if (this.state.accountTypeText == '支付宝') {
      type = 1;
    }
    if (type == 0) {
      if (this.state.nameTextInput != '' && this.state.nameTextInput != '' && this.state.accountTextInput != '' && this.state.accountBankTextInput != '' && this.state.accountBankAddressTextInput != '' && this.state.moblieTextInput != '') {
        let str = '?mobile=' + this.state.phone + '&token=' + this.state.token[1];
        let is_default = 0;
        if (this.state.isDefault) {
          is_default = 1;
        }
        if (params.key == 'add') {
          let jsonObj = {user_business_info_id:this.state.user_business_info_id,payee:this.state.nameTextInput,account_num:this.state.accountTextInput,account_type:type,bank:this.state.accountBankTextInput,branch:this.state.accountBankAddressTextInput,contact_number:this.state.moblieTextInput,is_defaulted:1}
          NetUtils.postJson('business/addBusinessAccount', jsonObj, str, (result) => {
            Alert.alert('提示','添加成功',[{text:'确定',onPress:() => navigate(params.nextView,{text:'success'})}])
          });
        }else{
          let jsonObj = {user_business_info_id:this.state.user_business_info_id,id:this.state.accountInfo.id,user_member_info_id:0,payee:this.state.nameTextInput,account_num:this.state.accountTextInput,account_type:type,bank:this.state.accountBankTextInput,branch:this.state.accountBankAddressTextInput,contact_number:this.state.moblieTextInput,is_defaulted:1}
          NetUtils.postJson('business/updateBusinessAccount', jsonObj, str, (result) => {
            Alert.alert('提示','修改成功',[{text:'确定',onPress:() => navigate(params.nextView,{text:'success'})}])
          });
        }
      }else if (this.state.accountTextInput == '') {
        Alert.alert('提示','请输入银行卡号');
      }else if (this.state.accountBankTextInput == '') {
        Alert.alert('提示','请输入开户银行');
      }else if (this.state.accountBankAddressTextInput == '') {
        Alert.alert('提示','请输入开户行地址');
      }else if (this.state.moblieTextInput == '') {
        Alert.alert('提示','请输入预留手机');
      }else if (this.state.nameTextInput == '') {
        Alert.alert('提示','请输入收款人');
      }
    }else{
      if (this.state.nameTextInput != '' && this.state.accountTextInput != '' && this.state.moblieTextInput != '') {
        let str = '?user_type=B&mobile=' + this.state.phone + '&token=' + this.state.token[1];
        let is_default = 0;
        if (this.state.isDefault) {
          is_default = 1;
        }
        if (params.key == 'add') {
          let jsonObj = {payee:this.state.nameTextInput,account_num:this.state.accountTextInput,account_type:type,bank:this.state.accountBankTextInput,bank_address:this.state.accountBankAddressTextInput,contact_number:this.state.moblieTextInput,is_default:is_default}
          NetUtils.postJson('memberAccount/addMemberAccount', jsonObj, str, (result) => {
            Alert.alert('提示','添加成功',[{text:'确定',onPress:() => navigate(params.nextView,{text:'success'})}])
          });
        }else{
          let jsonObj = {id:this.state.accountInfo.id,payee:this.state.nameTextInput,account_num:this.state.accountTextInput,account_type:type,bank:this.state.accountBankTextInput,bank_address:this.state.accountBankAddressTextInput,contact_number:this.state.moblieTextInput,is_default:is_default}
          NetUtils.postJson('memberAccount/updMemberAccount', jsonObj, str, (result) => {
            Alert.alert('提示','修改成功',[{text:'确定',onPress:() => navigate(params.nextView,{text:'success'})}])
          });
        }
      }else if (this.state.accountTextInput == '') {
        Alert.alert('提示','请输入支付宝账号');
      }else if (this.state.nameTextInput == '') {
        Alert.alert('提示','请输入收款人');
      }else if (this.state.moblieTextInput) {
        Alert.alert('提示','请输入预留手机');
      }
    }
  }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
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
                    <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(400),fontSize:ScreenUtils.setSpText(8)}}>账号类型</Text>
                      <View style={{width:ScreenUtils.scaleSize(290),height:ScreenUtils.scaleSize(88),alignItems:'center',justifyContent:'flex-end',flexDirection:'row',left:ScreenUtils.scaleSize(-10)}}>
                        <Text style={{color:'gray',fontSize:ScreenUtils.setSpText(8)}}>{this.state.accountTypeText}</Text>
                      </View>
                    </View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    {this.renderView()}
                  </ScrollView>

                  <TouchableOpacity onPress={() => this._saveBtnPress(navigate)} style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(7.5)}}>保存</Text>
                  </TouchableOpacity>

                  <Modal
                     animationType='slide'
                     transparent={true}
                     visible={this.state.show}
                     onShow={() => {}}
                     onRequestClose={() => {}} >
                     <TouchableOpacity onPress={() => this._setModalVisible()} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(128,128,128,0.7)',alignItems:'center',justifyContent:'center'}}>
                       <View style={{width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(accountTypeArray.length*88),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'white'}}>
                         <FlatList 
                            style={{width:ScreenUtils.scaleSize(750)}}
                            data={accountTypeArray}
                            renderItem={({item}) => this._renderBankCardItem(item)}
                            ItemSeparatorComponent={this._renderFengge1}
                        />
                       </View>
                     </TouchableOpacity>
                  </Modal>

                  <Modal
                     animationType='slide'
                     transparent={true}
                     visible={this.state.showBankList}
                     onShow={() => {}}
                     onRequestClose={() => {}} >
                     <TouchableOpacity onPress={() => this._setBankListVisible()} style={{flex:1,backgroundColor:'rgba(128,128,128,0.7)',alignItems:'center',justifyContent:'center'}}>
                       <View style={{width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(704),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'white'}}>
                         <FlatList 
                            style={{width:ScreenUtils.scaleSize(750)}}
                            data={bankListArr}
                            renderItem={({item}) => this._renderBankListItem(item)}
                            ItemSeparatorComponent={this._renderFengge1}
                        />
                       </View>
                     </TouchableOpacity>
                  </Modal>

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