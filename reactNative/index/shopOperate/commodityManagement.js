import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    ScrollView,
    Alert,
    NativeModules,
    Platform,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import LeftNative from '../../PublicComponents/LeftNative';
import NetUtils from '../../PublicComponents/NetUtils';
import ImageUpdata from '../../PublicComponents/ImageUpdata';

export default class commodityManagement extends Component {

    constructor(props) {
    super(props);
    this.state = {
      title: '商品管理',
      tabTitleArr: ['上架中','已下架'],
      businessIcon: '',
      orderTab: 0,
      operateType: 0,
      businessID: 0,
      couponGoodsList: [],  //商品券列表
      saveCouponGoodsArray: [],  //商品券数组（保存）
      physicalGoodsTypeList: [],  //实体商品分类数组
      upShelfPhysicalGoodsArray: [],  //实体商品数组（上架中）
      downShelfPhysicalGoodsArray: [],  //实体商品数组（已下架）
      savePhysicalGoodsArray: [],  //实体商品数组（保存）
      saveArray: [],  //保存数组
      pageNum: 1,  //当前页数
      pageSize: 100,  //条数
      token: '',
      phone: '',
      statusBarHeight: 0,
  };
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

  loadCouponGoodsArray(){
      storage.load({
        key: 'couponGoods',
        id: '1008'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        // alert(JSON.stringify(ret));
          this.setState({saveCouponGoodsArray:ret});
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
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

    loadphysicalGoodsArray(){
      storage.load({
        key: 'physicalGoods',
        id: '1009'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
          this.setState({saveArray:ret});
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadBusinessID();
    this.loadPhone();
    this.loadToken();
    this.loadOperateType();
    setTimeout(() => {
      if(this.state.operateType == 2){
        this.loadCouponGoodsArray();
        setTimeout(() => {
          this._upCouponGoodsData();
        },200);
      }else{
        this.loadphysicalGoodsArray();
        setTimeout(() => {
          this._upCommodityData();
        },200);
      }
    },500);
  }

  _upCommodityData(){
        let str = "?user_business_info_id=" + this.state.businessID;
        NetUtils.get('physicalGoods/getPhysicalGoodsTypeByBusinessId', str, (typeResult) => {
          console.log(typeResult)
          this.setState({physicalGoodsTypeList:typeResult.physicalGoodsTypeList});
          let params = "?user_business_info_id=" + this.state.businessID + '&physical_goods_type_id=0&status=0';
          NetUtils.get('physicalGoods/showPhysicalGoodsInfoByParm', params, (goodsResult) => {
            console.log(goodsResult)
            let typeArr = [];
            let upShelfArr = [];
            let downShelfArr = [];
            for(let a of typeResult.physicalGoodsTypeList){
              let upArr = [];
              let downArr = [];
              for(let b of goodsResult.physicalGoodsInfoDTOList){
                if(b.physical_goods_type_id == a.id){
                  if (b.status == 0) {
                    let img = '';
                    if (b.goods_img != null) {
                      img = b.goods_img;
                    }
                    upArr.push({name:b.name,salesVolume:b.monthly_sale,price:b.price,image:img,physicalGoodsInfoDTOList:b});
                  }else{
                    let img = '';
                    if (b.goods_img != null) {
                      img = b.goods_img;
                    }
                    downArr.push({name:b.name,salesVolume:b.monthly_sale,price:b.price,image:img,physicalGoodsInfoDTOList:b});
                  }
                }
              }
              upShelfArr.push({key:a.name,data:upArr});
              downShelfArr.push({key:a.name,data:downArr});
            }
            this.setState({upShelfPhysicalGoodsArray:upShelfArr});
            let savePhysicalArr = [];
            for (let a of typeResult.physicalGoodsTypeList){
              let arr = [];
              for(let b of this.state.saveArray){
                if (b.physical_goods_type_id == a.id) {
                  arr.push({name:b.name,salesVolume:b.monthly_sale,price:b.price,image:b.goods_img.uri,physicalGoodsInfoDTOList:b});
                }
              }
              savePhysicalArr.push({key:a.name,data:arr});
            }
            this.setState({savePhysicalGoodsArray:savePhysicalArr});

          });
          let params1 = "?user_business_info_id=" + this.state.businessID + '&physical_goods_type_id=0&status=1';
          NetUtils.get('physicalGoods/showPhysicalGoodsInfoByParm', params1, (goodsResult) => {
            console.log(goodsResult)
            let typeArr = [];
            let upShelfArr = [];
            let downShelfArr = [];
            for(let a of typeResult.physicalGoodsTypeList){
              let upArr = [];
              let downArr = [];
              for(let b of goodsResult.physicalGoodsInfoDTOList){
                if(b.physical_goods_type_id == a.id){
                  if (b.status == 0) {
                    let img = '';
                    if (b.goods_img != null) {
                      img = b.goods_img;
                    }
                    upArr.push({name:b.name,salesVolume:b.monthly_sale,price:b.price,image:img,physicalGoodsInfoDTOList:b});
                  }else{
                    let img = '';
                    if (b.goods_img != null) {
                      img = b.goods_img;
                    }
                    downArr.push({name:b.name,salesVolume:b.monthly_sale,price:b.price,image:img,physicalGoodsInfoDTOList:b});
                  }
                }
              }
              upShelfArr.push({key:a.name,data:upArr});
              downShelfArr.push({key:a.name,data:downArr});
            }
            this.setState({downShelfPhysicalGoodsArray:downShelfArr});
          });
        });
  }

  _upCouponGoodsData(){
      let orderTab = 0
      if (this.state.orderTab == 1) {
        orderTab = 1
      }
      let params = "?user_business_info_id=" + this.state.businessID + '&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize + '&status=' + orderTab;
      NetUtils.get('couponGoods/showCouponGoodsInfoByParm', params, (result) => {
        console.log(result.couponGoodsInfoDTOList)
        this.setState({couponGoodsList:result.couponGoodsInfoDTOList})
      });
  }

  componentWillReceiveProps(){
    this.loadCouponGoodsArray();
    this.loadphysicalGoodsArray();
    this.loadPhone();
    this.loadToken();
    setTimeout(() => {
      if(this.state.operateType == 2){
        this._upCouponGoodsData();
      }else if (this.state.operateType == 1) {
        this._upCommodityData();
      }
    },200);
  }

  _fastLoginChange(obj){
    this.setState({orderTab:obj.i,couponGoodsList:[]});
    setTimeout(() => {
      if (this.state.operateType == 2) {
        this._upCouponGoodsData()
      }
    },200);
  }

   renderOrderView(navigate){
    const orderViewArr = [];
    if (this.state.operateType == 2) {
        for(let a of this.state.tabTitleArr){
            if (a == '上架中') {
              orderViewArr.push(
                <ScrollView tabLabel={a} style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}>
                  {this.state.couponGoodsList.map((item,i) => this._renderCommodityView(item,a))}
                </ScrollView>
                );
              }else if(a == '已下架'){
                orderViewArr.push(
                <ScrollView tabLabel={a} style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}>
                  {this.state.couponGoodsList.map((item,i) => this._renderCommodityView(item,a))}
                </ScrollView>
                );
              }else{
                orderViewArr.push(
                <ScrollView tabLabel={a} style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}>
                  {this.state.saveCouponGoodsArray.map((item,i) => this._renderCommodityView(item,a))}
                </ScrollView>
                );
          }
        }
      }else{
        for(var a of this.state.tabTitleArr){
        if (a == '上架中') {
          orderViewArr.push(
            <LeftNative tabLabel={a} height='100' upOrdownText='下架' upOrDownSuccess={() => this._upCommodityData()} navigateData={navigate} nextStep='' dataSource={this.state.upShelfPhysicalGoodsArray} />
          );
        }else if (a == '已下架') {
          orderViewArr.push(
            <LeftNative tabLabel={a} height='100' upOrdownText='上架' upOrDownSuccess={() => this._upCommodityData()} navigateData={navigate} nextStep='' dataSource={this.state.downShelfPhysicalGoodsArray} />
          );
        }else{
          orderViewArr.push(
            <LeftNative tabLabel={a} height='100' upOrdownText='上架' upOrDownSuccess={() => this._upCommodityData()} navigateData={navigate} nextStep='add' upSuccess={(item) => this._saveClear(item)} dataSource={this.state.savePhysicalGoodsArray} />
          );
        }
        }
      }
      return orderViewArr;
  }

  _saveClear(item){
    let saveArray = this.state.saveArray
    let i = saveArray.indexOf(item.physicalGoodsInfoDTOList)
    saveArray.splice(i,1)
    this.setState({savePhysicalGoodsArray:saveArray})
    storage.save({
                  key: 'physicalGoods',  // 注意:请不要在key中使用_下划线符号!
                  id: '1009',   // 注意:请不要在id中使用_下划线符号!
                  data: saveArray,
                  expires: null,
                });
  }

  _renderCommodityView(item,i){
    let btnText = '';
    if (i == '上架中') {
      btnText = '下架';
    }else{
      btnText = '上架';
    }
    const { navigate,goBack,state } = this.props.navigation;
     return (
       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(300),backgroundColor:'#EEEEEE'}}>
         <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(280),top:ScreenUtils.scaleSize(10),left:ScreenUtils.scaleSize(10),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(10)}}>
           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}><Text style={{width:ScreenUtils.scaleSize(690),left:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(8),color:'black'}}>商品名称：{item.name}</Text></View>
           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}><Text style={{width:ScreenUtils.scaleSize(690),left:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(7),color:'black'}}>消费券类型：{item.goods_type==0?'代金券':'套餐券'}</Text></View>
           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}><Text style={{width:ScreenUtils.scaleSize(690),left:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(7),color:'black'}}>使用条件：{item.use_time}</Text></View>
           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}><Text style={{width:ScreenUtils.scaleSize(690),left:ScreenUtils.scaleSize(30),fontSize:ScreenUtils.setSpText(7),color:'black'}}>售价：<Text style={{color:'red'}}>¥{item.price}</Text></Text></View>
           <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>

           <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(100),justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
             <Button onPress={() => this._editorTypePress(navigate,item,i)} style={{left:-ScreenUtils.scaleSize(60),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(108),height:ScreenUtils.scaleSize(49),borderColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(40)}}>
                <Text style={{textAlign:'center',color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>编辑</Text>
              </Button>
              <Button onPress={() => this._upOrDownShelfPress(navigate,item,btnText)} style={{left:-ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(108),height:ScreenUtils.scaleSize(49),borderColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(40)}}>
                <Text style={{textAlign:'center',color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>{btnText}</Text>
              </Button>
           </View>
         </View>
       </View>
     );
  }

  saveUpdataCoupon(item){
    let saveArray = this.state.saveArray
    let i = saveArray.indexOf(item.couponGoodsInfoList)
    saveArray.splice(i,1)
    let typeInfoStr = {coupon_goods_type_id:item.couponGoodsInfoList.coupon_goods_type_id,general_type:item.couponGoodsInfoList.general_type,name:item.couponGoodsInfoList.name,price:item.couponGoodsInfoList.price,stock:item.couponGoodsInfoList.stock,status:0,unit:item.couponGoodsInfoList.unit,use_rules:item.couponGoodsInfoList.use_rules,user_business_info_id:item.couponGoodsInfoList.user_business_info_id,effective_time:item.couponGoodsInfoList.effective_time};
    let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
    NetUtils.postJson('couponGoods/addCouponGoodsInfo',typeInfoStr,params,(result) => {
       Alert.alert('提示','添加商品券成功',[{text: '确定', onPress: () => this._upCouponGoodsData()}]);
       this.setState({saveCouponGoodsArray:saveArray})
       storage.save({
                        key: 'couponGoods',  // 注意:请不要在key中使用_下划线符号!
                        id: '1008',   // 注意:请不要在id中使用_下划线符号!
                        data: saveArray,
                        expires: null,
                      });
    });
  }

  //上架or下架
  _upOrDownShelfPress(navigate,item,btnText){
    if (this.state.orderTab == 2 && this.state.operateType != 1) {
      navigate('couponEditor',{key:'add',couponInfo:item});
    }else{
      if (btnText == '下架') {
         Alert.alert('提示','确认下架？',[{text: '确定', onPress: () => this._downShelf(item)},{text:'取消'}]);
      }else{
         Alert.alert('提示','确认上架？',[{text: '确定', onPress: () => this._upShelf(item)},{text:'取消'}]);
      }
    }
  }

  _upShelf(item){
     let params = '?token='+this.state.token[1] + '&status=0&goodsId=' + item.id;
     NetUtils.postJson('couponGoods/changeGoodsStatus','',params,(result) => {
        Alert.alert('提示','上架成功',[{text: '确定', onPress: () => this._upCouponGoodsData()}]);
     });
  }

  _downShelf(item){
    let params = '?token='+this.state.token[1] + '&status=1&goodsId=' + item.id;
     NetUtils.postJson('couponGoods/changeGoodsStatus','',params,(result) => {
        Alert.alert('提示','下架成功',[{text: '确定', onPress: () => this._upCouponGoodsData()}]);
     });
  }
  //编辑
  _editorTypePress(navigate,item,i){
    if (this.state.orderTab == 2) {
      navigate('couponEditor',{key:'add',couponInfo:item});
    }else{
      navigate('couponEditor',{key:'edit',id:item.id});
    }
  }

  //排序
  _sortPress(navigate){

  }

  //分类管理
  _typeManagementPress(navigate){
    navigate('typeManagement',);
  }

  //录入商品
  _loadCommodityPress(navigate){
      if(this.state.operateType == 1){
        if(this.state.physicalGoodsTypeList == ''){
          Alert.alert('提示','请先新增分类！')
          return
        }
        navigate('commodityEditor',{key:'add'});
      }else{
        navigate('couponEditor',{key:'add'}); 
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
                  <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                    <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                  </TouchableOpacity>
                  <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                </View>

                <ScrollableTabView tabBarTextStyle={{fontSize:ScreenUtils.setSpText(9)}} style={styles.scrollableTabview} 
                    tabBarActiveTextColor= '#F3A50E'
                    tabBarInactiveTextColor= '#787878'
                    tabBarTextStyle={{fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(7)}}
                    tabBarBackgroundColor= 'white'
                    tabBarUnderlineStyle={styles.underline}
                    onChangeTab={(obj) => this._fastLoginChange(obj)}
                    scrollWithoutAnimation={true}
                    locked={true}
                >
                  {this.renderOrderView(navigate)}
                </ScrollableTabView>

                {this.state.operateType==1?<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                  <Button onPress={() => this._typeManagementPress(navigate)} style={{borderRadius:0,width:ScreenUtils.scaleSize(750/2),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E'}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>分类管理</Text>
                  </Button>
                  <View style={{width:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE'}}></View>
                  <Button onPress={() => this._loadCommodityPress(navigate)} style={{width:ScreenUtils.scaleSize(750/2),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>录入商品</Text>
                  </Button>
                </View>:<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                  <Button onPress={() => this._loadCommodityPress(navigate)} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>录入商品</Text>
                  </Button>
                </View>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
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