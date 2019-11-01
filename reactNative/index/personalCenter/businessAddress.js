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
  Modal,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../../PublicComponents/NetUtils';
import { MapView, MapTypes, MapModule, Geolocation } from 'react-native-baidu-map'

var dismissKeyboard = require('dismissKeyboard');

export default class businessAddress extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '商铺地址',
      businessID: '',
      mobile: '',
      statusBarHeight: 0,
      shopAddressTextInput: '',  //地址关键字
      lat: 0,
      lng: 0,
      show: false,
      addressArray: '',
      province: [],
      city: [],
      area: [],
      street: [],
      nowChooseTab: 0,  //0省 1市 2区 3街道
      searchAddressList: [],
      chooseAddress: [],
      doorNumberTextInput: '',  //门牌号
    };
  }

  componentDidMount() {
    this.loadBusinessID();
    this.loadMobile();
    this.setStatusBarHeight();
    const { params } = this.props.navigation.state
    if (params.key == 'openShop' && params.info==1) {
      this.setState({province:params.province,city:params.city,area:params.area,street:params.street,chooseAddress:params.chooseAddress,doorNumberTextInput:params.doorNumber,shopAddressTextInput:params.chooseAddress.name,lat:params.chooseAddress.location.lat,lng:params.chooseAddress.location.lng})
    }else if (params.key == 'setting') {
      this.setState({province:{city_name:params.province,city_code:0},city:{city_name:params.city,city_code:0},area:{city_name:params.area,city_code:0},street:{city_name:params.street,city_code:0},shopAddressTextInput:params.address,lat:params.lat,lng:params.lng})
    }else{
      // 百度地图定位
      Geolocation.getCurrentPosition()
        .then(data => {
          console.log(data.longitude+','+data.latitude)
          this.setState({lat:data.latitude,lng:data.longitude})
        })
        .catch(e =>{
          console.warn(e, 'error');
        })
    }
  }

   _chooseAddress(key){
    this.setState({show:true})
    if (key == 'all') {
      console.log(this.state.nowChooseTab)
      let params = ''
      if(this.state.nowChooseTab == 0){
        params = '?city_level=1';
        NetUtils.get('public/getCitysRelatesByParm', params, (result) => {
            // Alert.alert('提示',JSON.stringify(result));
            let arr = [];
            for(var a of result.citysRelateList){
              arr.push(a);
            }
            // alert(JSON.stringify(arr));
            this.setState({addressArray:arr});
        });
        return
      }
    }
    let params = '';
    if (key == 'province') {
      params = '?city_level=1';
    }else if (key == 'city') {
      params = "?city_level=2&&parent_code="+this.state.province.city_code;
      if (this.state.province.city_code == 0) {
        Alert.alert('提示','请重新选择省份！')
        this.setState({addressArray:[]})
        return
      }
    }else if (key == 'area') {
      params = "?city_level=3&&parent_code="+this.state.city.city_code;
      if (this.state.city.city_code == 0) {
        Alert.alert('提示','请重新选择城市！')
        this.setState({addressArray:[]})
        return
      }
    }else if (key == 'street') {
      params = "?city_level=4&&parent_code="+this.state.area.city_code;
      if (this.state.area.city_code == 0) {
        Alert.alert('提示','请重新选择区域！')
        this.setState({addressArray:[]})
        return
      }
    }
      NetUtils.get('public/getCitysRelatesByParm', params, (result) => {
          // Alert.alert('提示',JSON.stringify(result));
          let arr = [];
          for(var a of result.citysRelateList){
            arr.push(a);
          }
          // alert(JSON.stringify(arr));
          this.setState({addressArray:arr});
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
        let shopInfoStr = {id:this.state.businessID,mobile:this.state.mobile,province:params.cityArray[0].city_name,city:params.cityArray[1].city_name,area:params.cityArray[2].city_name,street:params.cityArray[3].city_name,address:this.state.shopAddressTextInput};
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

    // http://api.map.baidu.com/place/v2/search?query=万科黄埔仓&region=广州&output=json&ak=K4rj53HOPFtVBBMFx1LMBeeGPc4qTSrt
    searchAddress(){
      if (this.state.city=='') {
        Alert.alert('提示','请选择城市')
        return
      }
      if (this.state.shopAddressTextInput=='') {
        Alert.alert('提示','请输入地址关键字')
        return
      }
      dismissKeyboard()
      let InterfaceUrl = 'http://api.map.baidu.com/place/v2/search?query='+this.state.shopAddressTextInput+'&region='+this.state.city.city_name+'&output=json&ak=K4rj53HOPFtVBBMFx1LMBeeGPc4qTSrt'
      fetch(InterfaceUrl,{
          headers:{
            "Accept": "application/json;charset=utf-8",
            'Content-Type': 'application/json',
          },
         })
          .then((response) => response.json())
          .then((responseBody) => {
              console.log(responseBody)
              if (responseBody.status == 0) {
                this.setState({searchAddressList:responseBody.results})
              }
          }).catch(error => {
              alert(error);
          });
    }

    _chooseAddressTab(i){
    if (i == 0) {
      this.setState({nowChooseTab:i,addressArray:[]})
      this._chooseAddress('province')
    }else if (i == 1) {
      if (this.state.province == '') {
        return
      }
      this.setState({nowChooseTab:i,addressArray:[]})
      this._chooseAddress('city')
    }else if (i == 2) {
      if (this.state.city == '') {
        return
      }
      this.setState({nowChooseTab:i,addressArray:[]})
      this._chooseAddress('area')
    }else{
      if (this.state.area == '') {
        return
      }
      this.setState({nowChooseTab:i,addressArray:[]})
      this._chooseAddress('street')
    }
  }

  _chooseCityPress(item){
    if (this.state.nowChooseTab == 0) {
      if (this.state.province != '') {
        if (this.state.province.city_name != item.city_name) {
          this.setState({city:'',area:'',street:''})
        }
      }
      this.setState({province:item,nowChooseTab:1,addressArray:[]});
      setTimeout(()=>{
        this._chooseAddress('city')
      },200);
    }else if (this.state.nowChooseTab == 1) {
      if (this.state.city != '') {
        if (this.state.city.city_name != item.city_name) {
          this.setState({area:'',street:''})
        }
      }
      this.setState({city:item,nowChooseTab:2,addressArray:[]});
      setTimeout(()=>{
        this._chooseAddress('area')
      },200);
    }else if (this.state.nowChooseTab == 2) {
      if (this.state.area != '') {
        if (this.state.area.city_name != item.city_name) {
          this.setState({street:''})
        }
      }
      this.setState({area:item,nowChooseTab:3,addressArray:[]});
      setTimeout(()=>{
        this._chooseAddress('street')
      },200);
    }else if (this.state.nowChooseTab == 3) {
      this.setState({street:item});
      this._setModalVisible()
    }
  }

   _renderAdressItem(item){
    return(
             <TouchableOpacity onPress={() => this._chooseCityPress(item)} style={{width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
               <Text style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(630),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item.city_name}</Text>
             </TouchableOpacity>
          );
  }

  _renderFengge = () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderEmptyView(){
      return (
               <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(496),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                 <Image source={require('../images/personalCenter/loading.gif')} style={{width:ScreenUtils.scaleSize(32),height:ScreenUtils.scaleSize(32)}} />
               </View>
             )
  }

  // 显示/隐藏 modal
  _setModalVisible() {
    let isShow = this.state.show;
    this.setState({
      show:!isShow,
    });
  }

  returnAddress(){
    let address = ''
    if (this.state.province != '') {
      address += this.state.province.city_name
      if (this.state.city != '') {
        address += '-' + this.state.city.city_name
        if (this.state.area != '') {
          address += '-' + this.state.area.city_name
          if (this.state.street != '') {
            address += '-' + this.state.street.city_name
          }
        }
      }
    }
    return address
  }

  renderImg(item){
    if (this.state.chooseAddress!='') {
      if (this.state.chooseAddress.uid == item.uid) {
        return <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(30)}} source={require('../images/personalCenter/shop_second_address.png')}/>
      }
    }
  }

  _choosePoint(item){
    this.setState({chooseAddress:item,lat:item.location.lat,lng:item.location.lng})
  }

  _renderSearchAddressListItem(item){
    return (
             <TouchableOpacity onPress={() => this._choosePoint(item)} style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'center'}}>
               <View style={{height:ScreenUtils.scaleSize(20)}}></View>
               <View style={{width:ScreenUtils.scaleSize(690),flexDirection:'row',alignItems:'center'}}>
                 <View style={{width:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'center'}}>
                   {this.renderImg(item)}
                 </View>
                 <View>
                   <Text style={{color:'black',width:ScreenUtils.scaleSize(630),fontSize:ScreenUtils.setSpText(9)}}>{item.name}</Text>
                   <View style={{height:ScreenUtils.scaleSize(20)}}></View>
                   <Text style={{color:'gray',width:ScreenUtils.scaleSize(630),fontSize:ScreenUtils.setSpText(8)}}>{item.address}</Text>
                 </View>
               </View>
               <View style={{height:ScreenUtils.scaleSize(20)}}></View>
             </TouchableOpacity>
           )
  }

  _renderSearchAddressListFengge = () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderSearchAddressListEmptyView(){
    return (
               <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(500),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                 <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>请选择城市并输入地址关键字搜索</Text>
               </View>
             )
  }

  saveBtn(navigate){
    if (this.state.province == '') {
      Alert.alert('提示','请选择省份')
      return
    }
    if (this.state.city == '') {
      Alert.alert('提示','请选择城市')
      return
    }
    if (this.state.area == '') {
      Alert.alert('提示','请选择区')
      return
    }
    if (this.state.street == '') {
      Alert.alert('提示','请选择街道')
      return
    }
    if (this.state.shopAddressTextInput == '') {
      Alert.alert('提示','请输入地址关键字')
      return
    }
    if (this.state.chooseAddress == '') {
      Alert.alert('提示','请选择店铺定位')
      return
    }
    if (this.state.doorNumberTextInput == '') {
      Alert.alert('提示','请输入门牌号')
      return
    }
    const { params } = this.props.navigation.state
    if (params.key == 'openShop') {
      navigate('shopInfo',{key:'address',province:this.state.province,city:this.state.city,area:this.state.area,street:this.state.street,chooseAddress:this.state.chooseAddress,doorNumber:this.state.doorNumberTextInput})
    }else{

      let shopInfoStr = {
                          id:this.state.businessID,
                          mobile:this.state.mobile,
                          province:this.state.province.city_name,
                          city:this.state.city.city_name,
                          area:this.state.area.city_name,
                          street:this.state.street.city_name,
                          address:this.state.chooseAddress.name+this.state.doorNumberTextInput,
                          lat:this.state.lat,
                          lng:this.state.lng,
                          address_key:this.state.chooseAddress.name,
                        };
       NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
          Alert.alert('提示','修改店铺地址成功！',[{text:'确定',onPress:() => navigate('shopSeting',{key:'success'})}])
       });
    }
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
                      <Text style={{color:'white',textAlign:'right',left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(100),fontSize:ScreenUtils.setSpText(8)}}></Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'white'}}>
                    <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(80),backgroundColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(20),flexDirection:'row',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => this._chooseAddress('all')} style={{height:ScreenUtils.scaleSize(80),width:ScreenUtils.scaleSize(200),flexDirection:'row',alignItems:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(150),textAlign:'center',color:'black',fontSize:ScreenUtils.setSpText(8)}}>{this.state.area!=''?this.state.area.city_name:'选择城市'}</Text>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(11)}} source={require('../images/personalCenter/index_Home_top_down.png')}/>
                      </TouchableOpacity>
                      <TextInput
                          placeholder='请输入地址关键字'
                          placeholderTextColor='gray'
                          autoCorrect={false}
                          style={styles.numberTextInput}
                          onChangeText={(value) => this.setState({shopAddressTextInput:value})}
                          value={this.state.shopAddressTextInput}
                          underlineColorAndroid='transparent'
                        />
                        <TouchableOpacity onPress={() => this.searchAddress()} style={{width:ScreenUtils.scaleSize(110),height:ScreenUtils.scaleSize(60),borderRadius:ScreenUtils.scaleSize(15),justifyContent:'center',alignItems:'center',backgroundColor:'#F3A50E'}}>
                          <Text style={{color:'white',fontSize:ScreenUtils.setSpText(8)}}>搜索</Text>
                        </TouchableOpacity>
                    </View>
                  </View>

                  {this.state.chooseAddress!=''?<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:ScreenUtils.scaleSize(700),height:ScreenUtils.scaleSize(80),borderRadius:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE',justifyContent:'center',alignItems:'center'}}>
                      <TextInput
                          placeholder='请输入门牌号'
                          placeholderTextColor='gray'
                          autoCorrect={false}
                          style={{color:'black',width:ScreenUtils.scaleSize(640),height:ScreenUtils.scaleSize(60),fontSize: ScreenUtils.setSpText(7),padding: 0,}}
                          onChangeText={(value) => this.setState({doorNumberTextInput:value})}
                          value={this.state.doorNumberTextInput}
                          underlineColorAndroid='transparent'
                        />
                    </View>
                  </View>:null}

                  <MapView marker={{latitude:this.state.lat,longitude:this.state.lng,title:'当前位置'}} center={{latitude:this.state.lat,longitude:this.state.lng}} zoom={19} style={{flex:1}} />

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(500),backgroundColor:'white'}}>
                    <FlatList
                            data={this.state.searchAddressList}
                            renderItem={({item}) => this._renderSearchAddressListItem(item)}
                            ItemSeparatorComponent={this._renderSearchAddressListFengge}
                            ListEmptyComponent={() => this._renderSearchAddressListEmptyView()}
                          />
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white'}}>
                       <Button onPress={() => this.saveBtn(navigate)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                          <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存</Text>
                       </Button>
                    </View>
                  </View>

                  <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.show}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <TouchableOpacity activeOpacity={1} onPress={() => this._setModalVisible()} style={{flex:1,backgroundColor:'rgba(128,128,128,0.7)',alignItems:'center',justifyContent:'flex-end'}}>
                         <TouchableOpacity activeOpacity={1} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(640),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(30),alignItems:'center'}}>
                           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center'}}>
                             <Text style={{width:ScreenUtils.scaleSize(540),fontSize:ScreenUtils.setSpText(10),color:'#000000'}}>收货地址</Text>
                             <TouchableOpacity onPress={() => this._setModalVisible()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'flex-end'}}>
                               <Image source={require('../images/Home/close.png')} style={{width:ScreenUtils.scaleSize(32),height:ScreenUtils.scaleSize(32)}} />
                             </TouchableOpacity>
                           </View>
                           <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center'}}>
                             <TouchableOpacity onPress={() => this._chooseAddressTab(0)} style={{height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center',borderBottomColor:'#fea712',borderBottomWidth:this.state.nowChooseTab==0?1:0}}>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000'}}>{this.state.province!=''?this.state.province.city_name:'选择省'}</Text>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={() => this._chooseAddressTab(1)} style={{height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center',borderBottomColor:'#fea712',borderBottomWidth:this.state.nowChooseTab==1?1:0}}>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000'}}>{this.state.city!=''?this.state.city.city_name:'选择市'}</Text>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={() => this._chooseAddressTab(2)} style={{height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center',borderBottomColor:'#fea712',borderBottomWidth:this.state.nowChooseTab==2?1:0}}>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000'}}>{this.state.area!=''?this.state.area.city_name:'选择区'}</Text>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={() => this._chooseAddressTab(3)} style={{height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center',borderBottomColor:'#fea712',borderBottomWidth:this.state.nowChooseTab==3?1:0}}>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000'}}>{this.state.street!=''?this.state.street.city_name:'选择镇或街道'}</Text>
                               <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                             </TouchableOpacity>
                           </View>
                           <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(496)}}>
                             <FlatList 
                                style={{width:ScreenUtils.scaleSize(690)}}
                                data={this.state.addressArray}
                                renderItem={({item}) => this._renderAdressItem(item)}
                                ItemSeparatorComponent={this._renderFengge}
                                ListEmptyComponent={() => this._renderEmptyView()}
                              />
                           </View>
                         </TouchableOpacity>
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
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      color:'black',
    },
});