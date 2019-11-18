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
  DeviceEventEmitter,
} from 'react-native';
import ScreenUtils from '../../../PublicComponents/ScreenUtils';
import NetUtils from '../../../PublicComponents/NetUtils';
import Permissions from 'react-native-permissions';

export default class purchaseList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '采购列表',
      statusBarHeight: 0,
      token: '',
      phone: '',
      titleList: [],  //顶部导航列表
      tabLabelChoose: '',  //顶部导航列表已选name
      tabLabelChooseId: 0,  //顶部导航列表已选id
      leftTitleList: [],  //左侧导航栏列表
      leftTitleChoose: '',  //左侧导航栏列表name
      leftTitleChooseId: 0,  //左侧导航栏列表id
      commodityList: [],  //右侧商品列表
      buyCarList: [],  //购物车列表
      buyCarShow: false,  //购物车Modal显示
      city: '',  //当前城市
      area: '',  //区域
      isVip: 0, //是否是vip 0不是 1是
      isVipBeOverdue: 0,  //vip是否已经过期 0未过期 1已过期
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
        this.setState({token:ret},() => {
            if (this.state.token == '') {
              Alert.alert('提示','请先登录再进行购买！',[{text:'确定',onPress:() => this.props.navigation.navigate('login',{nextView:'marketCategory'})}])
            }else{
              Permissions.check('location').then(response => {
              // Response is one of: 'authorized' 已授权, 'denied' 拒绝授权, 'restricted' 拒绝授权或不支持, or 'undetermined' 尚未用权限对话框提示用户
                console.log(response)
                if (response == 'denied') {
                  if (Platform.OS == 'ios') {
                    Alert.alert('提示','监测到用户尚未打开位置权限，是否马上打开？',[{text:'是',onPress:() => Permissions.openSettings()}])
                  }else{
                    Alert.alert('提示','监测到用户尚未打开位置权限，是否马上打开？',[{text:'是',onPress:() => this.requestAndroidLocation()}])
                  }
                }else if (response == 'undetermined') {
                    if (Platform.OS == 'ios') {
                      Alert.alert('提示','监测到用户尚未打开位置权限，是否马上打开？',[{text:'是',onPress:() => this.requestAndroidLocation()}])
                    }else{
                      Alert.alert('提示','监测到用户尚未打开位置权限，是否马上打开？',[{text:'是',onPress:() => this.requestAndroidLocation()}])
                    }
                }else if (response == 'authorized') {
                    this.getLocation();
                  }
              })
              this.getVipInfo()
            }
        });
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        Alert.alert('提示','请先登录再进行购买！',[{text:'确定',onPress:() => this.props.navigation.navigate('login',{nextView:'marketCategory'})}])
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

  //请求位置权限
  requestAndroidLocation(){
    Permissions.request('location').then(response => {
      if (response == 'authorized') {
        this.getLocation();
      }else{
        Alert.alert('提示','用户拒绝授权')
      }
    })
   }

  //获取vip信息
  getVipInfo(){
    let str = '?userType=B&token=' + this.state.token[1]
    NetUtils.postJson('market/user/vipInfo', {}, str, (result) => {
      //vip_status 是否是vip 0不是 1是 deadline_status vip是否过期 0未过期 1过期 vip_deadline 过期时间
      this.setState({isVip:result.vip_status,isVipBeOverdue:result.deadline_status})
    });
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    this.loadToken()
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

  componentDidMount(){
    this.setStatusBarHeight()
    this.loadToken()
    this.loadPhone()
    this.deEmitter = DeviceEventEmitter.addListener('purchaseListListener', (a) => {
        // this.loadToken()
    });
  }

  //获取定位信息
  getLocation(){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            let longitude = JSON.stringify(position.coords.longitude);//精度
            let latitude = JSON.stringify(position.coords.latitude);//纬度
            this.setState({longitude:longitude,latitude:latitude})
            let params = '?longitude=' + longitude + '&latitude=' + latitude;
            NetUtils.get('getLocationAddress', params, (result) => {
                this.setState({city:result.city,area:result.area},() => {
                  this.getMarketCategoryList()
                });
            });

        },
        (error) =>{
            Alert.alert('提示','定位失败，请重试')
        },
        {enableHighAccuracy: true, timeout: 50000, maximumAge: 100000}
    );
  }

  setBuyCarShow(){
    let buyCarShow = this.state.buyCarShow
    this.setState({buyCarShow:!buyCarShow})
  }

  getProductList(){
    let leftTitleChooseId = this.state.leftTitleChooseId
    // let str = '?categoryId=' + leftTitleChooseId + '&userType=B&city=广州市&area=黄埔区'
    let str = '?categoryId=' + leftTitleChooseId + '&userType=B&city='+ this.state.city + '&area=' + this.state.area
    NetUtils.get('market/category/productList', str, (result) => {
      this.setState({commodityList:result})
    });
  }

  getMarketCategoryList(){
    NetUtils.get('market/category/list', '', (result) => {
        this.setState({titleList:result})
        if (result.length > 0) {
          this.setState({tabLabelChoose:result[0].category_name,tabLabelChooseId:result[0].id})
          let leftTitleList = result[0].childList
          this.setState({leftTitleList:leftTitleList})
          if (leftTitleList.length > 0) {
            this.setState({leftTitleChoose:leftTitleList[0].category_name,leftTitleChooseId:leftTitleList[0].id},() => {
              this.getProductList()
            })
          }
        }
    });
  }

  tabLabelChange(item){
    this.setState({commodityList:[],tabLabelChoose:item.category_name,tabLabelChooseId:item.id})
    let leftTitleList = item.childList
    this.setState({leftTitleList:leftTitleList})
    if (leftTitleList.length > 0) {
      this.setState({leftTitleChoose:leftTitleList[0].category_name,leftTitleChooseId:leftTitleList[0].id},() => {
        this.getProductList()
      })
    }
  }

  _renderTabItem(item){
      let name = item.category_name
      let nowName = this.state.tabLabelChoose
      let isShow = 0
      if (nowName == name) {
        isShow = 1
      }
      return (
               <TouchableOpacity onPress={() => this.tabLabelChange(item)} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(170),alignItems:'center'}}>
                 <View style={{height:ScreenUtils.scaleSize(21)}}></View>
                 {item.icon==null?<Image source={require('../../images/Market/cailei.png')} style={{width:ScreenUtils.scaleSize(84),height:ScreenUtils.scaleSize(84)}} />:<Image source={{uri:item.icon}} style={{width:ScreenUtils.scaleSize(84),height:ScreenUtils.scaleSize(84)}} />}
                 <View style={{height:ScreenUtils.scaleSize(14)}}></View>
                 <Text style={{fontSize:ScreenUtils.setSpText(9),fontWeight:'500',color:isShow==1?'#F3A50E':'#434343'}}>{name}</Text>
               </TouchableOpacity>
             )
    }

    leftTitleChange(item){
      this.setState({leftTitleChoose:item.category_name,leftTitleChooseId:item.id},() => {
        this.getProductList()
      })
    }

    _renderLeftTitleItem(item){
      let name = item.category_name
      let nowName = this.state.leftTitleChoose
      let isShow = 0
      if (nowName == name) {
        isShow = 1
      }
      return (
               <TouchableOpacity onPress={() => this.leftTitleChange(item)} style={{width:ScreenUtils.scaleSize(145),height:ScreenUtils.scaleSize(103),flexDirection:'row',backgroundColor:isShow?'white':'#EEEEEE'}}>
                 {isShow?<View style={{width:ScreenUtils.scaleSize(5),height:ScreenUtils.scaleSize(103),backgroundColor:'#F3A50E'}}></View>:<View style={{width:ScreenUtils.scaleSize(5),height:ScreenUtils.scaleSize(103)}}></View>}
                 <View style={{width:ScreenUtils.scaleSize(135),height:ScreenUtils.scaleSize(103),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(9),fontWeight:'500',color:isShow?'#000000':'#666666'}}>{name}</Text></View>
               </TouchableOpacity>
             )
    }

  _renderLeftTitleFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(180),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  //商品减1
  deleteCommodity(item){
    let buyCarList = this.state.buyCarList
    let i = buyCarList.indexOf(item)
    let nowCommodity = buyCarList[i]
    if (nowCommodity.number == 1) {
      buyCarList.splice(i,1)
    }else{
      nowCommodity["number"] = nowCommodity.number - 1
    }
    this.setState({buyCarList:buyCarList})
  }

  addCommodity(item){
    let buyCarList = this.state.buyCarList
    let i = buyCarList.indexOf(item)
    let nowCommodity = buyCarList[i]
    nowCommodity["number"] = nowCommodity.number + 1
    this.setState({buyCarList:buyCarList})
  }

  //检查当前商品是否已经加入购物车
  checkCommodityIsInBuyCar(item){
    let buyCarList = this.state.buyCarList
    for(let a of buyCarList){
      if (a.id == item.id) {
        return (
                 <View style={{top:ScreenUtils.scaleSize(20),left:ScreenUtils.scaleSize(-35),width:ScreenUtils.scaleSize(168),height:ScreenUtils.scaleSize(57),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                   <TouchableOpacity onPress={() => this.deleteCommodity(a)} style={{width:ScreenUtils.scaleSize(48),height:ScreenUtils.scaleSize(48),justifyContent:'center',alignItems:'center'}}>
                     <Image source={require('../../images/Market/delete.png')} style={{width:ScreenUtils.scaleSize(48),height:ScreenUtils.scaleSize(48)}} />
                   </TouchableOpacity>
                   <Text style={{width:ScreenUtils.scaleSize(52),textAlign:'center',fontSize:ScreenUtils.setSpText(10),color:'black'}}>{a.number}</Text>
                   <TouchableOpacity onPress={() => this.addCommodity(a)} style={{width:ScreenUtils.scaleSize(48),height:ScreenUtils.scaleSize(48),justifyContent:'center',alignItems:'center'}}>
                     <Image source={require('../../images/Market/add.png')} style={{width:ScreenUtils.scaleSize(48),height:ScreenUtils.scaleSize(48)}} />
                   </TouchableOpacity>
                 </View>
               )
      }
    }
    return (
             <TouchableOpacity onPress={() => this.addToBuyCar(item)} style={{top:ScreenUtils.scaleSize(30),justifyContent:'center',alignItems:'center',width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(46),borderRadius:ScreenUtils.scaleSize(25),borderColor:'#fea712',borderWidth:1}}>
               <Text style={{fontSize:ScreenUtils.setSpText(7),fontWeight:'500',color:'#fea712'}}>立即购买</Text>
             </TouchableOpacity>
           )
  }

    _renderCommodityItem(item){
      return (
               <View style={{width:ScreenUtils.scaleSize(605),flexDirection:'row'}}>
                 <View style={{width:ScreenUtils.scaleSize(44)}}></View>
                 <View style={{width:ScreenUtils.scaleSize(175),height:ScreenUtils.scaleSize(221),justifyContent:'center',alignItems:'center'}}>
                   {item.list_img=='图片地址'?<Image style={{width:ScreenUtils.scaleSize(175),height:ScreenUtils.scaleSize(175)}} source={require('../../images/Market/xilanhua.png')} />:<Image style={{width:ScreenUtils.scaleSize(175),height:ScreenUtils.scaleSize(175)}} source={{uri:item.list_img}} />}
                 </View>
                 <View style={{width:ScreenUtils.scaleSize(17)}}></View>
                 <View style={{flex:1,justifyContent:'center'}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(9),color:'black',fontWeight:'500'}}>{item.name}</Text>
                   <View style={{height:ScreenUtils.scaleSize(40)}}></View>
                   <Text style={{fontSize:ScreenUtils.setSpText(7),fontWeight:'500',color:'#989898'}}>{item.unit}g/{item.packing}</Text>
                   <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                   <View style={{flexDirection:'row'}}>
                     <View>
                       <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#434343',fontWeight:'500'}}>¥{item.vip1_price}</Text>
                       <View style={{height:ScreenUtils.scaleSize(10)}}></View>
                       <View style={{flexDirection:'row',backgroundColor:'#F8E8E5',borderRadius:ScreenUtils.scaleSize(10)}}>
                         <Text style={{fontSize:ScreenUtils.setSpText(7),width:ScreenUtils.scaleSize(170),textAlign:'center',color:'#e42919',fontWeight:'500'}}>vip:可返{item.vip1_price-item.vip2_price}元</Text>
                       </View>
                     </View>
                     <View style={{width:ScreenUtils.scaleSize(50)}}></View>
                     {this.checkCommodityIsInBuyCar(item)}
                   </View>
                 </View>
               </View>
             )
    }

    addToBuyCar(item){
      let buyCarList = this.state.buyCarList
      for(let a of buyCarList){
        if (a.id == item.id) {
          return
        }
      }
      item["number"] = 1
      buyCarList.push(item)
      this.setState({buyCarList:buyCarList})
    }

    _renderBuyCarItem(item){
      return (
               <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(112),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                 <Text style={{width:ScreenUtils.scaleSize(260),fontSize:ScreenUtils.setSpText(9),color:'#434343',fontWeight:'500'}}>{item.name}</Text>
                 <Text style={{width:ScreenUtils.scaleSize(190),fontSize:ScreenUtils.setSpText(9),color:'#434343',fontWeight:'500',textAlign:'center'}}>¥ {item.vip1_price}</Text>
                 <View style={{width:ScreenUtils.scaleSize(228),height:ScreenUtils.scaleSize(67),flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#D2D2D2',borderRadius:ScreenUtils.scaleSize(30)}}>
                   <TouchableOpacity onPress={() => this.deleteCommodity(item)} style={{width:ScreenUtils.scaleSize(76),height:ScreenUtils.scaleSize(67),justifyContent:'center',alignItems:'center'}}>
                     <Text style={{fontSize:ScreenUtils.setSpText(8),fontWeight:'700'}}>—</Text>
                   </TouchableOpacity>
                   <View style={{width:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(67),backgroundColor:'#D2D2D2'}}></View>
                   <Text style={{width:ScreenUtils.scaleSize(72),textAlign:'center',fontSize:ScreenUtils.setSpText(10),color:'black'}}>{item.number}</Text>
                   <View style={{width:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(67),backgroundColor:'#D2D2D2'}}></View>
                   <TouchableOpacity onPress={() => this.addCommodity(item)} style={{width:ScreenUtils.scaleSize(76),height:ScreenUtils.scaleSize(67),justifyContent:'center',alignItems:'center'}}>
                     <Text style={{fontSize:ScreenUtils.setSpText(14),fontWeight:'500',color:'#fea712'}}>+</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             )
    }

    _renderLeftTitleFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
    )

    //清空购物车
    clearBuyCarPress(){
      this.setState({buyCarList:[]})
      this.setBuyCarShow()
    }

    //计算总价
    calculatedTotalPrice(){
      let buyCarList = this.state.buyCarList
      let totalPrice = 0
      for(let a of buyCarList){
        let price = a.vip1_price * a.number
        totalPrice+=price
      }
      return totalPrice
    }

    //计算返现
    calculatedReturnToCash(){
      let buyCarList = this.state.buyCarList
      let returnCash = 0
      for(let a of buyCarList){
        let vip1_price = a.vip1_price * a.number
        let vip2_price = a.vip2_price * a.number
        returnCash+=vip1_price-vip2_price
      }
      return returnCash
    }

    //跳转到vip充值页面
    gotoVip(navigate){
      if (this.state.isVip == 1 && this.state.isVipBeOverdue == 0) {
        Alert.alert('提示','您已是VIP用户，立即下单可享受返现优惠')
        return
      }
      this.setBuyCarShow()
      navigate('toBeVip',{key:'vip'})
    }

    //立即下单
    gotoPlaceOrder(navigate){
      this.setBuyCarShow()
      // navigate('placeOrder',{city:'广州市',area:'黄埔区',buyCarList:this.state.buyCarList,returnCash:this.calculatedReturnToCash(),totalPrice:this.calculatedTotalPrice()})
      navigate('placeOrder',{city:this.state.city,area:this.state.area,buyCarList:this.state.buyCarList,returnCash:this.calculatedReturnToCash(),totalPrice:this.calculatedTotalPrice()})
      setTimeout(() => {
          this.setState({buyCarList:[]})
      },1000);
    }

    //判断vip是否过期
    judgeVipIsBeOverdue(){
      let isVipBeOverdue = this.state.isVipBeOverdue
      if (isVipBeOverdue == 0) {
        return '立即下单可返现'
      }else{
        return '续费VIP可享受返现'
      }
    }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../../login/images/login_back1.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'#000000',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(30)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View>
                    <FlatList 
                      style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(170),backgroundColor:'white'}}
                      data={this.state.titleList}
                      horizontal={true}
                      renderItem={({item}) => this._renderTabItem(item)}
                    />
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                  </View>
                  <View style={{flex:1,flexDirection:'row',backgroundColor:'white'}}>
                    <View style={{width:ScreenUtils.scaleSize(145)}}>
                      <FlatList 
                        style={{backgroundColor:'#EEEEEE'}}
                        data={this.state.leftTitleList}
                        ItemSeparatorComponent={this._renderLeftTitleFenge}
                        renderItem={({item}) => this._renderLeftTitleItem(item)}
                      />
                    </View>
                    <View style={{flex:1}}>
                      <FlatList 
                        style={{flex:1,backgroundColor:'white'}}
                        data={this.state.commodityList}
                        renderItem={({item}) => this._renderCommodityItem(item)}
                      />
                      <View style={{width:ScreenUtils.scaleSize(605),height:ScreenUtils.scaleSize(144),alignItems:'flex-end'}}>
                        {this.state.buyCarList.length==0?<View style={{left:ScreenUtils.scaleSize(-19),width:ScreenUtils.scaleSize(103),height:ScreenUtils.scaleSize(113),flexDirection:'row'}}>
                          <Image source={require('../../images/Market/buy_car_empty.png')} style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(103),height:ScreenUtils.scaleSize(103)}} />
                        </View>:<TouchableOpacity onPress={() => this.setBuyCarShow()} style={{left:ScreenUtils.scaleSize(-19),width:ScreenUtils.scaleSize(103),height:ScreenUtils.scaleSize(113),flexDirection:'row'}}>
                          <Image source={require('../../images/Market/buy_car.png')} style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(103),height:ScreenUtils.scaleSize(103)}} />
                          <View style={{width:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(40),borderRadius:ScreenUtils.scaleSize(20),left:ScreenUtils.scaleSize(-40),backgroundColor:'#E95B4D',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:ScreenUtils.setSpText(6),color:'white'}}>{this.state.buyCarList.length}</Text>
                          </View>
                        </TouchableOpacity>}
                      </View>
                    </View>
                  </View>

                  <Modal
                     animationType='fade'
                     transparent={true}
                     visible={this.state.buyCarShow}
                     onShow={() => {}}
                     onRequestClose={() => {}}
                  >
                     <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(140,140,140,0.7)'}}>
                       <TouchableOpacity activeOpacity={1} onPress={() => this.setBuyCarShow()} style={{flex:1}}>
                       </TouchableOpacity>
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(73),backgroundColor:'#fea712',borderTopLeftRadius:ScreenUtils.scaleSize(20),borderTopRightRadius:ScreenUtils.scaleSize(20),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                         <Text style={{width:ScreenUtils.scaleSize(344),fontSize:ScreenUtils.setSpText(8),color:'white'}}>购物车</Text>
                         <View style={{width:ScreenUtils.scaleSize(344),alignItems:'flex-end'}}>
                           <TouchableOpacity onPress={() => this.clearBuyCarPress()} style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(73),justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                             <Image source={require('../../images/Market/clearBuyCar.png')} style={{width:ScreenUtils.scaleSize(20),height:ScreenUtils.scaleSize(24),left:ScreenUtils.scaleSize(-5)}} />
                             <Text style={{fontSize:ScreenUtils.setSpText(8),color:'white',left:ScreenUtils.scaleSize(5)}}>清空购物车</Text>
                           </TouchableOpacity>
                         </View>
                       </View>
                       <View>
                         <FlatList 
                            style={{backgroundColor:'white',height:this.state.buyCarList.length>5?ScreenUtils.scaleSize(560):null}}
                            data={this.state.buyCarList}
                            ItemSeparatorComponent={this._renderBuyCarFenge}
                            renderItem={({item}) => this._renderBuyCarItem(item)}
                          />
                       </View>
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(138),backgroundColor:'white',flexDirection:'row',alignItems:'flex-end'}}>
                         <View style={{width:ScreenUtils.scaleSize(179)}}></View>
                         <TouchableOpacity onPress={() => this.gotoVip(navigate)} style={{width:ScreenUtils.scaleSize(349),height:ScreenUtils.scaleSize(98)}}>
                           <Text style={{top:ScreenUtils.scaleSize(17),fontSize:ScreenUtils.setSpText(10),color:'#ef0613'}}>¥ {this.calculatedTotalPrice()}</Text>
                           <Text style={{top:ScreenUtils.scaleSize(22),fontSize:ScreenUtils.setSpText(6.5),color:'#989898'}}>{this.state.isVip==0?'点击成为VIP即可享受返现':this.judgeVipIsBeOverdue()}<Text style={{color:'#ef0613'}}>¥{this.calculatedReturnToCash()}</Text></Text>
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => this.gotoPlaceOrder(navigate)} style={{width:ScreenUtils.scaleSize(231),height:ScreenUtils.scaleSize(98),backgroundColor:'#fea712',justifyContent:'center',alignItems:'center'}}>
                           <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>立即购买</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={{position:'absolute',left:ScreenUtils.scaleSize(35),top:ScreenUtils.scaleSize(0),width:ScreenUtils.scaleSize(113),height:ScreenUtils.scaleSize(118),flexDirection:'row'}}>
                            <Image source={require('../../images/Market/buy_car.png')} style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(113),height:ScreenUtils.scaleSize(118)}} />
                            <View style={{width:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(40),borderRadius:ScreenUtils.scaleSize(20),left:ScreenUtils.scaleSize(-40),backgroundColor:'#E95B4D',justifyContent:'center',alignItems:'center'}}>
                              <Text style={{fontSize:ScreenUtils.setSpText(6),color:'white'}}>{this.state.buyCarList.length}</Text>
                            </View>
                         </TouchableOpacity>
                       </View>
                     </View>
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
});