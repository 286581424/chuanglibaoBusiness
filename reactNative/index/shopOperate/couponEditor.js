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
  NativeModules,
  FlatList,
  Keyboard,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import Picker from 'react-native-picker';
import {StackNavigator} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import NetUtils from '../../PublicComponents/NetUtils';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Switch } from 'react-native-switch';
import CheckBox from 'react-native-checkbox';
import ImageUpdata from '../../PublicComponents/ImageUpdata';
import SyanImagePicker from 'react-native-syan-image-picker';

const options = {
      imageCount: 1,          // 最大选择图片数目，默认6
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: true,          // 是否允许裁剪，默认false
      CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
      CropH: ScreenUtils.scaleSize(750), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
    };
var Dimensions = require('Dimensions');
var screenW = Dimensions.get('window').width;
var screenH = Dimensions.get('window').height;

export default class couponEditor extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '录入商品',
      commodityID: '',  //商品id
      commodityName: '',  //商品名称
      commodityType: '请选择分类',  //商品类型
      commodityPrice: '',  //商品价格
      commodityOriginalPrice: '', //原价
      commodityStock: '',  //库存
      beginUseTime: '开始时间',  //开始时间
      endUseTime: '结束时间',  //结束时间
      chooseTime: 0,  //0开始时间 1结束时间
      commodityCompany: '',  //商品单位
      useTimeTextInput: '',  //使用时间
      useRuleTextInput: [''],  //使用规则
      packageContent: [{goodsName:'',goodsNum:'',price:''}],  //套餐内容
      packageImg: '',  //套餐图片
      scopeApplication: '',  //适用范围
      holidayCheckbox: false,  //节假日是否可用
      commodityMinCompany: '',  //最小购买单位
      commodityLabel: '',  //商品标签或使用规则
      businessID: 0,
      phone: '',
      pickerData: ['代金券','套餐券'],
      operateType: 0,
      businessID: 0,
      textName: '',
      couponGoodsInfoList: [],  //编辑消费券数组
      saveCouponGoodsInfoList: [],  //保存本地消费券数组
      saveIndex: 0,
      token: '',
      statusBarHeight: 0,
      isDateTimePickerVisible:false,
  };
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
        if (ret == 1) {
          this.setState({textName:'商品标签'});
        }else{
          this.setState({textName:'使用规则'});
        }
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
          this.setState({saveCouponGoodsInfoList:ret});
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

    loadMobile(){
    storage.load({
        key: 'phone',
        id: '1005'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({phone:ret});
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadBusinessID();
    this.loadOperateType();
    this.loadMobile();
    this.loadToken();
    this.loadCouponGoodsArray();
    setTimeout(() => {
        if (this.props.navigation.state.params.id != null) {
          let params = "?id=" + this.props.navigation.state.params.id
          NetUtils.get('couponGoods/getCouponGoodsInfoById', params, (result) => {
            console.log(result)
            let goods_type = '代金券'
            if (result.goods_type == 1) {
              goods_type = '套餐券'
            }
            let is_general_purpose = false
            if (result.is_general_purpose == 1) {
              is_general_purpose = true
            }
            let packageContent = []
            if (result.set_meal_list != null) {
              for(let a of result.set_meal_list){
                packageContent.push({goodsName:a.goodsName,goodsNum:a.goodsNum,price:a.price.toString()})
              }
            }
            let packageImg = ''
            if (result.goods_img != null) {
              packageImg = { uri: result.goods_img ,name: result.goods_img,fileName:result.goods_img}
            }
            if (result.market_price != null) {
              this.setState({commodityOriginalPrice:result.market_price.toString()})
            }
            this.setState({commodityID:result.id,packageImg:packageImg,holidayCheckbox:is_general_purpose,commodityType:goods_type,commodityName:result.name,commodityPrice:result.price.toString()})
            this.setState({commodityStock:result.stock.toString(),beginUseTime:result.begin_use_date.slice(0,10),endUseTime:result.effective_time.slice(0,10)})
            this.setState({useTimeTextInput:result.use_time,scopeApplication:result.scope_of_application,packageContent:packageContent,useRuleTextInput:result.use_rules_list})
          });
        }else if(this.props.navigation.state.params.couponInfo != null){
          let couponInfo = this.props.navigation.state.params.couponInfo
          let saveList = this.state.saveCouponGoodsInfoList
          let i = saveList.indexOf(couponInfo)
          this.setState({saveIndex:i})
          console.log(couponInfo)
          let goods_type = '代金券'
          if (couponInfo.goods_type == 1) {
            goods_type = '套餐券'
          }
          if (couponInfo.goods_type == 1) {
            this.setState({commodityOriginalPrice:couponInfo.market_price,packageContent:couponInfo.set_meal_list,packageImg:couponInfo.goods_img})
          }
          let is_general_purpose = false
          if (couponInfo.is_general_purpose == 1) {
            is_general_purpose = true
          }
          this.setState({beginUseTime:couponInfo.begin_use_date,endUseTime:couponInfo.effective_time,commodityType:goods_type,commodityName:couponInfo.name,commodityPrice:couponInfo.price,commodityStock:couponInfo.stock})
          this.setState({holidayCheckbox:is_general_purpose,scopeApplication:couponInfo.scope_of_application,useTimeTextInput:couponInfo.use_time,useRuleTextInput:couponInfo.use_rules_list})
        }
    },200);
  }

  _chooseImage(){
    SyanImagePicker.showImagePicker(options, (err, selectedPhotos) => {
      if (err) {
        // 取消选择
        return;
      }
      // 选择成功，渲染图片
      // ...
       // let source = { uri: selectedPhotos[0].uri };

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };

      let qianzui = 'package_img_' + this.state.businessID;
      let name = ImageUpdata.getImageName(qianzui,this.state.phone,'1');
      let source = { uri: selectedPhotos[0].uri ,name: name,fileName:ImageUpdata.getName(qianzui,this.state.phone,'1')};

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };

      this.setState({
        packageImg: source
      });
    })
  }


    _businessNameTextInputChangeText(value){

    }

    _showBusinessTypePicker(){
        let type = '';
        if (this.state.commodityType == '请选择分类') {
          type = this.state.pickerData[0];
        }else{
          type = this.state.commodityType;
        }
        Picker.init({
            pickerData: this.state.pickerData,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText:'商品类型',
            selectedValue: [type],
            onPickerConfirm: data => {
                this.setState({commodityType:data[0]});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }

    _setDateTimePickerShow(i){
      let isDateTimePickerVisible = this.state.isDateTimePickerVisible;
      this.setState({isDateTimePickerVisible:!isDateTimePickerVisible,chooseTime:i});
    }

     //格式化日期,
      formatDate(date,format){
        var paddNum = function(num){
          num += "";
          return num.replace(/^(\d)$/,"0$1");
        }
        //指定格式字符
        var cfg = {
           yyyy : date.getFullYear() //年 : 4位
          ,yy : date.getFullYear().toString().substring(2)//年 : 2位
          ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
          ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
          ,d  : date.getDate()   //日 : 如果1位的时候不补0
          ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
          ,hh : date.getHours()  //时
          ,mm : date.getMinutes() //分
          ,ss : date.getSeconds() //秒
        }
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
      } 

    handleDatePicked(data){
      this._hideDateTimePicker()
      let time = this.formatDate((new Date(data)),"yyyy-MM-dd");
      if (this.state.chooseTime == 0) {
        this.setState({beginUseTime:time});
      }else{
        this.setState({endUseTime:time});
      }
    }

    _handleDatePicked = (data) => this.handleDatePicked(data);

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _saveAndUpdata(navigate,params,value){
      if (this.state.commodityType == '请选择分类') {
        Alert.alert('提示','请选择分类')
        return
      }else if (this.state.commodityName == '') {
        Alert.alert('提示','请输入商品名称')
        return
      }else if (this.state.commodityPrice == '') {
        Alert.alert('提示','请输入商品价格')
        return
      }else if (this.state.commodityOriginalPrice == '' && this.state.commodityType == '套餐券') {
        Alert.alert('提示','请输入商品原价')
        return
      }else if (this.state.commodityStock == '') {
        Alert.alert('提示','请输入商品库存')
        return
      }else if (this.state.useTimeTextInput == '') {
        Alert.alert('提示','请输入使用时间')
        return
      }else if (this.state.beginUseTime == '' || this.state.endUseTime == '') {
        Alert.alert('提示','请输入开始时间和结束时间')
        return
      }else if (this.state.scopeApplication == '') {
        Alert.alert('提示','请输入适用范围')
        return
      }else if (this.state.packageImg == '' && this.state.commodityType == '套餐券') {
        Alert.alert('提示','请选择套餐图片')
        return
      }

      let beginUseTime = this.state.beginUseTime;
      let arr1 = beginUseTime.split('-');
      let date1 = beginUseTime
      date1 = date1.substring(0,19);
      date1 = date1.replace(/-/g,'-');
      // let timestamp = new Date(date).getTime();
      let endUseTime = this.state.endUseTime;
      let arr2 = endUseTime.split('-');
      let date2 = endUseTime
      date2 = date2.substring(0,19);
      date2 = date2.replace(/-/g,'-');
      if (value == 'updata'){
        if (params.key == 'add') {
          let is_general_purpose = 0
          if (this.state.holidayCheckbox) {
            is_general_purpose = 1
          }
           let typeInfoStr = ''
           let useRuleTextInput = ''
           for(let a of this.state.useRuleTextInput){
             let i = this.state.useRuleTextInput.indexOf(a)
             if (i == this.state.useRuleTextInput.length-1) {
               useRuleTextInput += a
             }else{
               useRuleTextInput += a +','
             }
           }
           if (this.state.commodityType == '套餐券') {
              typeInfoStr = {begin_use_date:date1,market_price:this.state.commodityOriginalPrice,stock:this.state.commodityStock,goods_img:this.state.packageImg.fileName,set_meal_list:this.state.packageContent,effective_time:date2,goods_type:1,price:this.state.commodityPrice,is_general_purpose:is_general_purpose,name:this.state.commodityName,scope_of_application:this.state.scopeApplication,use_time:this.state.useTimeTextInput,use_rules_list:this.state.useRuleTextInput};
           }else{
              typeInfoStr = {begin_use_date:date1,stock:this.state.commodityStock,effective_time:date2,goods_type:0,price:this.state.commodityPrice,is_general_purpose:is_general_purpose,name:this.state.commodityName,scope_of_application:this.state.scopeApplication,use_time:this.state.useTimeTextInput,use_rules_list:this.state.useRuleTextInput};
           }
           let str = '?token='+this.state.token[1];
           NetUtils.postJson('couponGoods/addCouponGoodsInfo',typeInfoStr,str,(result) => {
              if (params.couponInfo != null) {
                let arr = this.state.saveCouponGoodsInfoList;
                arr.splice(this.state.saveIndex, 1);
                storage.save({
                          key: 'couponGoods',  // 注意:请不要在key中使用_下划线符号!
                          id: '1008',   // 注意:请不要在id中使用_下划线符号!
                          data: arr,
                          expires: null,
                        });
              }
              Alert.alert('提示','添加商品券成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
              if (this.state.commodityType == '套餐券') {
                if (this.state.packageImg.uri != this.state.packageImg.name) {
                  ImageUpdata.upload(this.state.packageImg.uri, this.state.packageImg.name, (percentage,onloaded,size) => {
                    console.log();
                  },
                  (result) => {
                      if (result.status == 200) {
                      }else{
                      }
                  });
                }
              }
           });
        }else{
          let is_general_purpose = 0
          if (this.state.holidayCheckbox) {
            is_general_purpose = 1
          }
           let typeInfoStr = ''
           let useRuleTextInput = ''
           for(let a of this.state.useRuleTextInput){
             let i = this.state.useRuleTextInput.indexOf(a)
             if (i == this.state.useRuleTextInput.length-1) {
               useRuleTextInput += a
             }else{
               useRuleTextInput += a +','
             }
           }
           if (this.state.commodityType == '套餐券') {
              typeInfoStr = {id:this.props.navigation.state.params.id,begin_use_date:date1,market_price:this.state.commodityOriginalPrice,stock:this.state.commodityStock,goods_img:this.state.packageImg.fileName,set_meal_list:this.state.packageContent,effective_time:date2,goods_type:1,price:this.state.commodityPrice,is_general_purpose:is_general_purpose,name:this.state.commodityName,scope_of_application:this.state.scopeApplication,use_time:this.state.useTimeTextInput,use_rules_list:this.state.useRuleTextInput};
           }else{
              typeInfoStr = {id:this.props.navigation.state.params.id,begin_use_date:date1,stock:this.state.commodityStock,effective_time:date2,goods_type:0,price:this.state.commodityPrice,is_general_purpose:is_general_purpose,name:this.state.commodityName,scope_of_application:this.state.scopeApplication,use_time:this.state.useTimeTextInput,use_rules_list:this.state.useRuleTextInput};
           }
           let str = '?token='+this.state.token[1];
           NetUtils.postJson('couponGoods/updCouponGoodsInfo',typeInfoStr,str,(result) => {
              Alert.alert('提示','修改商品券成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
           });
        }
      }else{
        let arr = this.state.saveCouponGoodsInfoList;
        let is_general_purpose = 0
        if (this.state.holidayCheckbox) {
          is_general_purpose = 1
        }
         let typeInfoStr = ''
         let useRuleTextInput = ''
         for(let a of this.state.useRuleTextInput){
           let i = this.state.useRuleTextInput.indexOf(a)
           if (i == this.state.useRuleTextInput.length-1) {
             useRuleTextInput += a
           }else{
             useRuleTextInput += a +','
           }
         }
         if (this.state.commodityType == '套餐券') {
            typeInfoStr = {begin_use_date:date1,market_price:this.state.commodityOriginalPrice,stock:this.state.commodityStock,goods_img:this.state.packageImg,set_meal_list:this.state.packageContent,effective_time:date2,goods_type:1,price:this.state.commodityPrice,is_general_purpose:is_general_purpose,name:this.state.commodityName,scope_of_application:this.state.scopeApplication,use_time:this.state.useTimeTextInput,use_rules_list:this.state.useRuleTextInput};
         }else{
            typeInfoStr = {begin_use_date:date1,stock:this.state.commodityStock,effective_time:date2,goods_type:0,price:this.state.commodityPrice,is_general_purpose:is_general_purpose,name:this.state.commodityName,scope_of_application:this.state.scopeApplication,use_time:this.state.useTimeTextInput,use_rules_list:this.state.useRuleTextInput};
         }
        if (params.key == 'add'){
          arr.push(typeInfoStr);
        }else{
          arr.splice(this.state.saveIndex,1,typeInfoStr)
        }
        storage.save({
                  key: 'couponGoods',  // 注意:请不要在key中使用_下划线符号!
                  id: '1008',   // 注意:请不要在id中使用_下划线符号!
                  data: arr,
                  expires: null,
                });
        Alert.alert('提示','保存商品券成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
      }
    }

    _addsucess(navigate){
      navigate('commodityManagement',{key:'success'});
    }

    _deletePress(navigate,params){
      if (params.key == 'add') {
        Alert.alert('提示','未添加，无法删除');
      }else{
          if (params.couponInfo  == null) {
          let typeInfoStr = '?id=' + this.state.commodityID+'&mobile='+this.state.phone+'&token='+this.state.token[1];
           NetUtils.get('couponGoods/delCouponGoodsInfo',typeInfoStr,(result) => {
              Alert.alert('提示','删除成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
           });
         }else{
            let arr = this.state.saveCouponGoodsInfoList;
            arr.splice(this.state.saveIndex, 1);
            storage.save({
                      key: 'couponGoods',  // 注意:请不要在key中使用_下划线符号!
                      id: '1008',   // 注意:请不要在id中使用_下划线符号!
                      data: arr,
                      expires: null,
                    });
            Alert.alert('提示','删除成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         }
      }
    }

    _checkBoxBtn(checked) {
      let holidayCheckbox = this.state.holidayCheckbox
      this.setState({holidayCheckbox:!holidayCheckbox});
    }

    renderPackageImg(){
      if (this.state.commodityType == '套餐券') {
        if (this.state.packageImg!='') {
          return (
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(160),flexDirection:'row',alignItems:'center'}}>
                    <View style={{left:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(130),width:ScreenUtils.scaleSize(550),justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(550),textAlign:'left',fontSize:ScreenUtils.setSpText(8),color:'black'}}>上传套餐图片</Text>
                      <Text style={{width:ScreenUtils.scaleSize(550),textAlign:'left',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>图片需要大于600x600像素</Text>
                    </View>
                    <TouchableOpacity onPress={() => this._chooseImage()} style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130),borderRadius:ScreenUtils.scaleSize(10)}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130),borderRadius:ScreenUtils.scaleSize(10)}} source={{uri:this.state.packageImg.uri}} />
                    </TouchableOpacity>
                  </View>
               )
        }else{
          return (
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(160),flexDirection:'row',alignItems:'center'}}>
                    <View style={{left:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(130),width:ScreenUtils.scaleSize(550),justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(550),textAlign:'left',fontSize:ScreenUtils.setSpText(8),color:'black'}}>上传套餐图片</Text>
                      <Text style={{width:ScreenUtils.scaleSize(550),textAlign:'left',color:'gray',fontSize:ScreenUtils.setSpText(8)}}>图片需要大于600x600像素</Text>
                    </View>
                    <TouchableOpacity onPress={() => this._chooseImage()} style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130),borderColor:'gray',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),alignItems:'center',justifyContent:'center'}}>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(50),height:ScreenUtils.scaleSize(50),borderRadius:ScreenUtils.scaleSize(10)}} source={require('../images/personalCenter/tianjiazhaopian.png')} />
                    </TouchableOpacity>
                  </View>
               )
        }
      }
    }

    addUserRule(){
      let useRuleTextInput = this.state.useRuleTextInput
      useRuleTextInput.push('')
      this.setState({useRuleTextInput:useRuleTextInput})
    }

    renderUserRule(){
      return (
                 <View>
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*使用规则</Text>
                      <TouchableOpacity onPress={() => this.addUserRule()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'flex-end'}}>
                        <Image source={require('../images/MenDian/add.png')} />
                      </TouchableOpacity>
                   </View>
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                   {this.state.useRuleTextInput.map(item => this._renderUseRuleItem(item))}
                 </View>
               )
    }

    renderPackageContent(){
      if (this.state.commodityType == '套餐券') {
        return (
                 <View>
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*套餐内容</Text>
                      <TouchableOpacity onPress={() => this.addPackageContent()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'flex-end'}}>
                        <Image source={require('../images/MenDian/add.png')} />
                      </TouchableOpacity>
                   </View>
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                   {this.state.packageContent.map(item => this._renderPackageContentItem(item))}
                 </View>
               )
      }
    }

    addPackageContent(){
      let packageContent = this.state.packageContent
      packageContent.push({goodsName:'',goodsNum:'',price:''})
      this.setState({packageContent:packageContent})
    }

    deleteUseRule(item){
      let useRuleTextInput = this.state.useRuleTextInput
      let i = useRuleTextInput.indexOf(item)
      console.log(i)
      useRuleTextInput.splice(i,1)
      console.log(useRuleTextInput)
      this.setState({useRuleTextInput:useRuleTextInput})
    }

    deletePackContent(item){
      let packageContent = this.state.packageContent
      let i = packageContent.indexOf(item)
      console.log(i)
      packageContent.splice(i,1)
      this.setState({packageContent:packageContent})
    }

    useRuleChange(value,item){
      let useRuleTextInput = this.state.useRuleTextInput
      let i = useRuleTextInput.indexOf(item)
      useRuleTextInput.splice(i,1,value)
      this.setState({useRuleTextInput:useRuleTextInput})
    }

    packageContentChange(value,item,key){
      let packageContent = this.state.packageContent
      let i = packageContent.indexOf(item)
      if (key == 'name') {
        packageContent.splice(i,1,{goodsName:value,goodsNum:item.goodsNum,price:item.price})
      }else if (key == 'weight') {
        packageContent.splice(i,1,{goodsName:item.goodsName,goodsNum:value,price:item.price})
      }else{
        packageContent.splice(i,1,{goodsName:item.goodsName,goodsNum:item.goodsNum,price:value})
      }
      this.setState({packageContent:packageContent})
    }

    _renderUseRuleItem(item){
      return (
               <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                 <TextInput
                    maxLength={16}
                    placeholder='请输入使用规则'
                    placeholderTextColor='gray'
                    autoCorrect={false}
                    style={{color:'black',width:ScreenUtils.scaleSize(590),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                    onChangeText={(value) => this.useRuleChange(value,item)}
                    value={item}
                    underlineColorAndroid='transparent'
                  />
                  <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                  <TouchableOpacity onPress={() => this.deleteUseRule(item)} style={{width:ScreenUtils.scaleSize(50),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../images/MenDian/shanchu.png')} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} />
                  </TouchableOpacity>
               </View>
             )
    }

    _renderPackageContentItem(item){
      return (
               <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                 <TextInput
                    maxLength={16}
                    placeholder='菜品名称'
                    placeholderTextColor='gray'
                    autoCorrect={false}
                    style={{color:'black',width:ScreenUtils.scaleSize(550/3),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                    onChangeText={(value) => this.packageContentChange(value,item,'name')}
                    value={item.goodsName}
                    underlineColorAndroid='transparent'
                  />
                  <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                  <TextInput
                    maxLength={16}
                    placeholder='菜品分量'
                    placeholderTextColor='gray'
                    autoCorrect={false}
                    style={{color:'black',width:ScreenUtils.scaleSize(550/3),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                    onChangeText={(value) => this.packageContentChange(value,item,'weight')}
                    value={item.goodsNum}
                    underlineColorAndroid='transparent'
                  />
                  <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                  <TextInput
                    maxLength={16}
                    placeholder='菜品价格'
                    placeholderTextColor='gray'
                    autoCorrect={false}
                    style={{color:'black',width:ScreenUtils.scaleSize(550/3),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                    onChangeText={(value) => this.packageContentChange(value,item,'price')}
                    value={item.price}
                    underlineColorAndroid='transparent'
                  />
                  <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                  <TouchableOpacity onPress={() => this.deletePackContent(item)} style={{width:ScreenUtils.scaleSize(50),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../images/MenDian/shanchu.png')} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} />
                  </TouchableOpacity>
               </View>
             )
    }

    _renderPackageContentFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
    )

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{left:ScreenUtils.scaleSize(50),color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                      <TouchableOpacity onPress={() => this._deletePress(navigate,params)} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'center'}}>
                        <Text style={{top:ScreenUtils.scaleSize(7),fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(150),textAlign:'right',color:'white'}}>删除</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                    
                    <KeyboardAwareScrollView style={{backgroundColor:'white'}}>
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品类型</Text>
                          <TouchableOpacity onPress={() => this._showBusinessTypePicker()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center'}}>
                            <Text style={{width:ScreenUtils.scaleSize(520),color:'black',fontSize:ScreenUtils.setSpText(8),textAlign:'right'}}>{this.state.commodityType}</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品名称</Text>
                          <TextInput
                            maxLength={16}
                            placeholder='请输入商品名称'
                            placeholderTextColor='gray'
                            autoCorrect={false}
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({commodityName:value})}
                            value={this.state.commodityName}
                            underlineColorAndroid='transparent'
                          />
                        </View>
                        
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品价格</Text>
                          <TextInput
                            maxLength={16}
                            placeholder='请输入商品价格'
                            placeholderTextColor='gray'
                            autoCorrect={false}
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({commodityPrice:value})}
                            value={this.state.commodityPrice}
                            underlineColorAndroid='transparent'
                          />
                        </View>

                        {this.state.commodityType == '套餐券'?<View><View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品原价</Text>
                          <TextInput
                            maxLength={16}
                            placeholder='请输入商品原价'
                            placeholderTextColor='gray'
                            autoCorrect={false}
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({commodityOriginalPrice:value})}
                            value={this.state.commodityOriginalPrice}
                            underlineColorAndroid='transparent'
                          />
                        </View></View>:null}

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品库存</Text>
                          <TextInput
                            maxLength={16}
                            autoCorrect={false}
                            placeholder='请输入库存'
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({commodityStock:value})}
                            value={this.state.commodityStock}
                            underlineColorAndroid='transparent'
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*有效期</Text>
                          <View style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
                            <TouchableOpacity onPress={() => this._setDateTimePickerShow(0)} style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(60),borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),justifyContent:'center',alignItems:'center'}}><Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>{this.state.beginUseTime}</Text></TouchableOpacity>
                            <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                            <TouchableOpacity onPress={() => this._setDateTimePickerShow(1)} style={{width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(60),borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),justifyContent:'center',alignItems:'center'}}><Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>{this.state.endUseTime}</Text></TouchableOpacity>
                            <View style={{width:ScreenUtils.scaleSize(20)}}></View>
                            <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                            <DateTimePicker
                              mode={'date'}
                              titleIOS={'选择时间'}
                              cancelTextIOS={'取消'}
                              confirmTextIOS={'确定'}
                              isVisible={this.state.isDateTimePickerVisible}
                              onConfirm={this._handleDatePicked}
                              onCancel={this._hideDateTimePicker}
                            />
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(540),height:ScreenUtils.scaleSize(60),left:ScreenUtils.scaleSize(180),justifyContent:'center',alignItems:'flex-end'}}>
                          <CheckBox
                            label={'周末，法定节假日通用'}
                            checked={this.state.holidayCheckbox}
                            checkboxStyle={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(30)}}
                            onChange={() => this._checkBoxBtn()}
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*使用时间</Text>
                          <TextInput
                            maxLength={16}
                            autoCorrect={false}
                            placeholder='请输入使用时间'
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({useTimeTextInput:value})}
                            value={this.state.useTimeTextInput}
                            underlineColorAndroid='transparent'
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*适用范围</Text>
                          <TextInput
                            maxLength={16}
                            autoCorrect={false}
                            placeholder='请输入适用范围'
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({scopeApplication:value})}
                            value={this.state.scopeApplication}
                            underlineColorAndroid='transparent'
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        {this.renderPackageImg()}
                        {this.state.commodityType=='套餐券'?<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>:null}
                        {this.renderPackageContent()}
                        {this.state.commodityType=='套餐券'?<View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>:null}
                        {this.renderUserRule()}
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>


                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100)}}></View>
                    </KeyboardAwareScrollView>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                      <Button onPress={() => this._saveAndUpdata(navigate,params,'back')} style={{borderRadius:0,width:ScreenUtils.scaleSize(750/2),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'white'}}>
                        <Text style={{textAlign:'center',color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>保存并返回</Text>
                      </Button>
                      <View style={{width:ScreenUtils.scaleSize(1),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE'}}></View>
                      <Button onPress={() => this._saveAndUpdata(navigate,params,'updata')} style={{width:ScreenUtils.scaleSize(750/2),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存并上架</Text>
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
    wechatLogin: {
        backgroundColor:'red',
        width: ScreenUtils.scaleSize(208),
        height: ScreenUtils.scaleSize(208),
        left: ScreenUtils.scaleSize(271),
    },
    wechatLoginImg: {
        width: ScreenUtils.scaleSize(208),
        height: ScreenUtils.scaleSize(208),
    },
    loginBtn: {
        width: ScreenUtils.scaleSize(750),
        height: ScreenUtils.scaleSize(92),
        backgroundColor: '#F3A50E',
        borderWidth: 0,
        borderColor:'transparent',
        borderRadius: ScreenUtils.scaleSize(1334)/60,
      },
});