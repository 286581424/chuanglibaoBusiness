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
  NativeModules,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {StackNavigator} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import NetUtils from '../../PublicComponents/NetUtils';

export default class editType extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '编辑分类',
      typeName: '',
      typeDec: '',
      typeID: 0,
      operateType: 0,
      businessID: 0,  //商家id
      typeInfo: [],  //编辑分类数据
      phone: '',
      token: '',
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

  loadOperateType(){
    storage.load({
        key: 'operateType',
        id: '1006'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({operateType:parseInt(ret)});
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
        this.setState({businessID:parseInt(ret)});
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
    this.loadBusinessID();
    this.loadOperateType();
    this.loadPhone();
    this.loadToken();
    if (this.props.navigation.state.params.typeInfo != null) {
      this.setState({typeID:this.props.navigation.state.params.typeInfo.id});
      this.setState({typeInfo:this.props.navigation.state.params.typeInfo});
      this.setState({typeName:this.props.navigation.state.params.typeInfo.name});
      this.setState({typeDec:this.props.navigation.state.params.typeInfo.goods_describe})
    }
  }

  _typeNameTextInputChangeText(value){
    this.setState({typeName:value});
  }

  _typeDecTextInputChangeText(value){
    this.setState({typeDec:value});
  }

  _savaTypePress(navigate){
    if (this.state.operateType == 1) {
      if (this.state.typeInfo == null || this.state.typeInfo == '') {
        let typeInfoStr = {name:this.state.typeName,user_business_info_id:this.state.businessID,goods_describe:this.state.typeDec};
        let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
         NetUtils.postJson('physicalGoods/addPhysicalGoodsType',typeInfoStr,params,(result) => {
            Alert.alert('提示','成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         });
       }else{
        let typeInfoStr = {name:this.state.typeName,user_business_info_id:this.state.businessID,goods_describe:this.state.typeDec,id:this.state.typeID};
        let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
         NetUtils.postJson('physicalGoods/updPhysicalGoodsType',typeInfoStr,params,(result) => {
            Alert.alert('提示','成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         });
       }
    }else{
      if (this.state.typeInfo == null || this.state.typeInfo == '') {
        let typeInfoStr = {name:this.state.typeName,user_business_info_id:this.state.businessID,goods_describe:this.state.typeDec};
        let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
         NetUtils.postJson('couponGoods/addCouponGoodsType',typeInfoStr,params,(result) => {
            Alert.alert('提示','成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         });
       }else{
        let typeInfoStr = {name:this.state.typeName,user_business_info_id:this.state.businessID,goods_describe:this.state.typeDec,id:this.state.typeID};
        let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
         NetUtils.postJson('couponGoods/updCouponGoodsType',typeInfoStr,params,(result) => {
            Alert.alert('提示','成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         });
       }
    }
  }

  _addsucess(navigate){
    navigate('typeManagement',{key:'success'});
  }

  _deleteTypePress(navigate){
    if (this.state.operateType == 1) {
      if (this.state.typeID != 0) {
        let typeInfoStr = '?id=' + this.state.typeID+'&mobile='+this.state.phone+'&token='+this.state.token[1];
         // alert(JSON.stringify(typeInfoStr));
         NetUtils.get('physicalGoods/delPhysicalGoodsType',typeInfoStr,(result) => {
            Alert.alert('提示',result,[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         });
      }else{
        Alert.alert('提示','未添加，无法删除');
      }
    }else{
      if (this.state.typeID != 0) {
        let typeInfoStr = '?id=' + this.state.typeID+'&mobile='+this.state.phone+'&token='+this.state.token[1];
         // alert(JSON.stringify(typeInfoStr));
         NetUtils.get('couponGoods/delCouponGoodsType',typeInfoStr,(result) => {
            Alert.alert('提示',result,[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         });
      }else{
        Alert.alert('提示','未添加，无法删除');
      }
    }
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                      <TouchableOpacity onPress={() => Alert.alert('提示','确定删除？',[{text:'确定',onPress: () => this._deleteTypePress(navigate)},{text:'取消'}])} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'center'}}>
                        <Text style={{top:ScreenUtils.scaleSize(7),fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(150),textAlign:'center',color:'white'}}>删除</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    <KeyboardAwareScrollView>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE',justifyContent:'center',}}>
                        <Text style={{width:ScreenUtils.scaleSize(200),fontSize:ScreenUtils.setSpText(8),color:'black',left:ScreenUtils.scaleSize(40)}}>分类名称</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(120),justifyContent:'center',backgroundColor:'white'}}>
                        <TextInput
                            maxLength={16}
                            placeholderTextColor='gray'
                            autoCorrect={false}
                            style={{color:'black',left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(70),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(typeName) => this._typeNameTextInputChangeText(typeName)}
                            value={this.state.typeName}
                            underlineColorAndroid='transparent'
                          />
                      </View>

                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE',justifyContent:'center',}}>
                        <Text style={{width:ScreenUtils.scaleSize(200),fontSize:ScreenUtils.setSpText(8),color:'black',left:ScreenUtils.scaleSize(40)}}>分类描述</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(350),justifyContent:'center',backgroundColor:'white'}}>
                        <TextInput
                          autoCorrect={false}
                          placeholderTextColor='gray'
                          style={{color:'black',left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(310),padding:0,borderColor:'#EEEEEE',borderWidth:1}}
                          onChangeText={(typeDec) => this._typeDecTextInputChangeText(typeDec)}
                          value={this.state.typeDec}
                          underlineColorAndroid='transparent'
                          multiline={true}
                          textAlignVertical={'top'}
                        />
                      </View>
                    </KeyboardAwareScrollView>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                      <Button onPress={() => goBack()} style={{borderRadius:0,width:ScreenUtils.scaleSize(374.5),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#989898'}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消</Text>
                      </Button>
                      <View style={{width:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE'}}></View>
                      <Button onPress={() => this._savaTypePress(navigate)} style={{width:ScreenUtils.scaleSize(374.5),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
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
});