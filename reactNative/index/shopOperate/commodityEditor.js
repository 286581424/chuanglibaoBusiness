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
  FlatList,
  NativeModules,
  findNodeHandle,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import Picker from 'react-native-picker';
import {StackNavigator} from 'react-navigation';
import {KeyboardAwareScrollView,KeyboardAwareFlatList} from 'react-native-keyboard-aware-scrollview';
import NetUtils from '../../PublicComponents/NetUtils';
import ImageUpdata from '../../PublicComponents/ImageUpdata';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Switch } from 'react-native-switch';
import SyanImagePicker from 'react-native-syan-image-picker';

var Dimensions = require('Dimensions');
var screenW = Dimensions.get('window').width;
var screenH = Dimensions.get('window').height;

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

export default class commodityEditor extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '录入商品',
      commodityID: '',  //商品id
      commodityName: '',  //商品名称
      commodityType: '请选择分类',  //商品分类
      commodityImage: [],  //商品图片
      commodityPrice: '',  //商品价格
      commodityStock: true,  //库存无限
      hasLabel: false,  //是否有标签
      labelList: [],  //标签列表
      chooseLabelText: '',  //已选标签text
      chooseLabelList: [],  //已经选标签列表
      isShowLabel: false,  //是否显示标签
      hasSku: false,  //是否有规格
      chooseSku: '',  //已选sku
      hasChangeSku: 0,  //是否重新修改了sku,1修改0未修改 只有重新排列组合算是修改了规格
      chooseSkuList: [],  //已选sku列表
      isShowList: false,  //是否显示sku列表
      skuData: [],  //sku列表
      skuList: [],  //sku表
      commodityStockNumber: '',  //库存
      termOfValidityTextInput: '',  //有效期
      commodityCompany: '',  //商品单位
      commodityMinCompany: '',  //最小购买单位
      commodityLabel: '',  //商品标签或使用规则
      picking_feeTextInput: '0',  //餐盒费
      businessID: 0,
      phone: '',
      pickerData: [],
      operateType: 0,
      businessID: 0,
      textName: '',
      physicalGoodsTypeList: [],  //实体商品分类
      physicalGoodsInfoList: [],  //编辑实体商品数组
      savePhysicalGoodsInfoList: [],  //保存本地实体商品数组
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
          this.setState({textName:'商品描述'});
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

  loadphysicalGoodsArray(){
      storage.load({
        key: 'physicalGoods',
        id: '1009'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
          this.setState({savePhysicalGoodsInfoList:ret});
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
    this.loadphysicalGoodsArray();
    setTimeout(() => {
        let str1 = '?token=' + this.state.token[1]
        NetUtils.get('business/physicalGoodsSpecificationsList', str1, (result) => {
            this.setState({skuDatas:result})
            let str2 = '?token=' + this.state.token[1]
            NetUtils.get('physical/goods/property/pageList', str2, (result) => {
                this.setState({labelList:result})
                this.getCommodityInfo()
            });
        });
    },200);
  }

  getCommodityInfo(){
    setTimeout(() => {
        let params = "?user_business_info_id=" + this.state.businessID;
        NetUtils.get('physicalGoods/getPhysicalGoodsTypeByBusinessId', params, (result) => {
          let arr = [];
          this.setState({physicalGoodsTypeList:result.physicalGoodsTypeList});
          for(let a of result.physicalGoodsTypeList){
            arr.push(a.name);
          }
          this.setState({pickerData:arr});
        });
        if (this.props.navigation.state.params.physicalGoodsInfoDTOList != null) {
          if (this.props.navigation.state.params.physicalGoodsInfoDTOList.id == '' || this.props.navigation.state.params.physicalGoodsInfoDTOList.id == null) {
             let arr = this.props.navigation.state.params.physicalGoodsInfoDTOList;
              // alert(JSON.stringify(arr))
              if (arr.id != '' && arr.id != null) {
                this.setState({commodityID:arr.id});
              }else{
                this.setState({commodityID:arr.commodityID});
              }
              this.setState({physicalGoodsInfoList:arr});
              this.setState({commodityName:arr.name});
              this.setState({commodityType:arr.physical_goods_type_name});
              if (arr.packing_fee != null) {
                this.setState({picking_feeTextInput:arr.packing_fee.toString()});
              }
              this.setState({commodityPrice:arr.price.toString()});
              if (arr.goods_img != null) {
                if (arr.goods_img.uri != null) {
                  this.setState({commodityImage:{name:arr.goods_img.name,uri:arr.goods_img.uri,fileName:arr.goods_img.fileName}});
                }else{
                  // alert(arr.goods_img);
                  this.setState({commodityImage:{name:arr.goods_img,uri:arr.goods_img,fileName:arr.goods_img.fileName}});
                }
              }
              if (arr.stock >= 1000) {
                this.setState({commodityStock:true});
                this.setState({commodityStockNumber:arr.stock.toString()});
              }else{
                this.setState({commodityStock:false});
                this.setState({commodityStockNumber:arr.stock.toString()});
              }
              this.setState({commodityCompany:arr.unit});
              this.setState({commodityLabel:arr.goods_describe});
          }else{
            let params = "?id=" + this.props.navigation.state.params.physicalGoodsInfoDTOList.id;
            NetUtils.get('physicalGoods/getPhysicalGoodsInfoById', params, (result) => {
              let arr = result.physicalGoodsInfoDTO;
              console.log(result)
              let has_properties = arr.has_properties
              this.setState({hasLabel:has_properties})
              if (arr.has_properties) {
                let properties = JSON.parse(arr.properties)
                let chooseLabelList = []
                let chooseLabelTextArr = []
                for(let a of this.state.labelList){
                  for(let b of properties){
                    if (b.property == a.property_name) {
                      chooseLabelList.push(a)
                    }
                  }
                }
                for(let a of chooseLabelList){
                  chooseLabelTextArr.push(a.property_name)
                }
                let chooseLabelText = chooseLabelTextArr.join(' ')
                this.setState({chooseLabelList:chooseLabelList,chooseLabelText:chooseLabelText})
              }

              this.setState({hasSku:arr.has_specifications})
              if (arr.has_specifications) {
                let specifications = JSON.parse(arr.specifications)
                let chooseSkuArr = []
                if (specifications.length>0) {
                  for(let a of specifications[0]){
                    if (a.param!=null) {
                      if (chooseSkuArr.indexOf(a.param) == -1) {
                        chooseSkuArr.push(a.param)
                      }
                    }
                  }
                }
                let chooseSku = chooseSkuArr.join(',')
                let skuDatas = this.state.skuDatas
                let chooseSkuList = []
                for(let a of skuDatas){
                  for(let b of chooseSkuArr){
                    if (a.param_name == b) {
                      chooseSkuList.push(a)
                    }
                  }
                }
                this.setState({chooseSku:chooseSku,chooseSkuList:chooseSkuList})

                let skuList = []
                for(let a of result.skuList){
                  let specification_values = JSON.parse(a.specification_values)
                  let valueArr = []
                  for(let b of specification_values){
                    valueArr.push(b.value)
                  }
                  let value = valueArr.join(',')
                  skuList.push({price:a.price.toString(),value:value,id:a.id})
                }
                this.setState({skuList:skuList})
              }

              if (arr.id != '' && arr.id != null) {
                this.setState({commodityID:arr.id});
              }else{
                this.setState({commodityID:arr.commodityID});
              }
              this.setState({physicalGoodsInfoList:arr});
              this.setState({commodityName:arr.name});
              this.setState({commodityType:arr.physical_goods_type_name});
              if (arr.packing_fee != null) {
                this.setState({picking_feeTextInput:arr.packing_fee.toString()});
              }
              this.setState({commodityPrice:arr.price.toString()});
              if (arr.goods_img != null) {
                if (arr.goods_img.uri != null) {
                  this.setState({commodityImage:{name:arr.goods_img.name,uri:arr.goods_img.uri}});
                }else{
                  // alert(arr.goods_img);
                  this.setState({commodityImage:{name:arr.goods_img,uri:arr.goods_img}});
                }
              }
              if (arr.stock >= 9999) {
                this.setState({commodityStock:true});
                this.setState({commodityStockNumber:arr.stock.toString()});
              }else{
                this.setState({commodityStock:false});
                this.setState({commodityStockNumber:arr.stock.toString()});
              }
              this.setState({commodityCompany:arr.unit});
              this.setState({commodityLabel:arr.goods_describe});
            });
          }
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

      let qianzui = 'physical_goods_pic_' + this.state.businessID;
      let name = ImageUpdata.getImageName(qianzui,this.state.phone,'1');
      let source = { uri: selectedPhotos[0].uri ,name: name,fileName:ImageUpdata.getName(qianzui,this.state.phone,'1')};

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      this.setState({
        commodityImage: source
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

    _showSkuTypePicker(){
        let isShowList = this.state.isShowList;
        this.setState({isShowList:!isShowList});
    }

    _showLabelTypePicker(){
        let isShowLabel = this.state.isShowLabel;
        this.setState({isShowLabel:!isShowLabel});
    }

    _commodityNameTextInputChangeText(value){
      this.setState({commodityName:value});
    }

    _commodityPriceTextInputChangeText(value){
      this.setState({commodityPrice:value});
    }

    _commodityCompanyTextInputChangeText(value){
      this.setState({commodityCompany:value});
    }

    _commodityMinCompanyTextInputChangeText(value){
      this.setState({commodityMinCompany:value});
    }

    _commodityLabelTextInputChangeText(value){
      this.setState({commodityLabel:value});
    }

    _termOfValidityTextInputChangeText(value){
      this.setState({termOfValidityTextInput:value});
    }

    _commodityStockNumberTextInputChangeText(value){
      this.setState({commodityStockNumber:value});
    }

    _switchChange(){
      if (this.state.commodityStock == true) {
        this.setState({commodityStock:false});
      }else{
        this.setState({commodityStock:true});
      }
    }

    sku_switchChange(){
      if (this.state.hasSku == true) {
        this.setState({hasSku:false});
      }else{
        this.setState({hasSku:true});
      }
    }

    label_switchChange(){
      if (this.state.hasLabel == true) {
        this.setState({hasLabel:false});
      }else{
        this.setState({hasLabel:true});
      }
    }

    _setDateTimePickerShow(){
      let isDateTimePickerVisible = this.state.isDateTimePickerVisible;
      this.setState({isDateTimePickerVisible:!isDateTimePickerVisible});
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
      this.setState({termOfValidityTextInput:time});
    }

    _handleDatePicked = (data) => this.handleDatePicked(data);

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _renderKuCun(){
      if (this.state.commodityStock == true) {
        return (
          <View>
          </View>
        );
      }else{
        return (
          <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*库存数量</Text>
            <TextInput
              maxLength={16}
              autoCorrect={false}
              placeholder='请输入库存'
              placeholderTextColor='gray'
              style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
              onChangeText={(commodityStockNumber) => this._commodityStockNumberTextInputChangeText(commodityStockNumber)}
              value={this.state.commodityStockNumber}
              underlineColorAndroid='transparent'
            />
          </View>
        );
      }
    }

    _renderPacking(){
      if (this.state.operateType == 1) {
        return (
          <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*打包费用</Text>
            <TextInput
              maxLength={10}
              autoCorrect={false}
              placeholderTextColor='gray'
              style={{color:'gray',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
              onChangeText={(value) => this.setState({picking_feeTextInput:value})}
              value={this.state.picking_feeTextInput}
              underlineColorAndroid='transparent'
            />
          </View>
        );
      }
    }

    _rendMinBuy(){
      if (this.state.operateType == 1) {
        return (
          <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(220),fontSize:ScreenUtils.setSpText(8)}}>*最小购买单位</Text>
            <TextInput
              maxLength={16}
              autoCorrect={false}
              placeholder='请输入商品最小单位'
              placeholderTextColor='gray'
              style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(450),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
              onChangeText={(commodityMinCompany) => this._commodityMinCompanyTextInputChangeText(commodityMinCompany)}
              value={this.state.commodityMinCompany}
              underlineColorAndroid='transparent'
            />
          </View>
        );
      }else{
        return (<View></View>);
      }
    }

    _saveAndUpdata(navigate,params,value){
      const { skuList,chooseSkuList,has_specifications,chooseLabelList } = this.state
      let specifications = [];
      let propertyIds = []
      let skus = []
      if (this.state.hasLabel) {
        for(let a of chooseLabelList){
          propertyIds.push(a.id)
        }
      }
      if (this.state.hasSku) {
        if (this.state.chooseSku == '') {
          Alert.alert('提示','请选择规格');
          return
        }else{
          for(let a of skuList){
            if (a.price == '') {
              Alert.alert('提示','请输入规格价钱');
              return
            }
          }
          let list = []
          for(let a of chooseSkuList){
            list.push(JSON.parse(a.param_value))
          }
          for (let a of skuList) {
            let spArr = []
            let skuArr = []
            let arr = a.value.split(',')
            for (let b of arr) {
              let param_name = ''
              for (let c of list) {
                let i = c.indexOf(b)
                if (i != -1) {
                  let x = list.indexOf(c)
                  param_name = chooseSkuList[x].param_name
                  break;
                }
              }
              spArr.push({param:param_name,value:b})
              skuArr.push({param:param_name,value:b})
            }
            spArr.push({"selected":true})
            specifications.push(spArr)
            if (a.id != null) {
              skus.push({price:a.price,specification_values:skuArr,id:a.id})
            }else{
              skus.push({price:a.price,specification_values:skuArr})
            }
          }
        }
      }
      if (this.state.commodityName != '' && this.state.commodityType != '' && this.state.commodityImage != null && this.state.commodityPrice != '' && this.state.commodityCompany != '') {
        if(this.state.commodityType == '请选择分类'){
          Alert.alert('提示','请选择分类');
          return
        }
        let goods_num = 99999
        let stock = 99999
        if (this.state.commodityStock == false) {
          goods_num = parseInt(this.state.commodityStockNumber)
          stock = parseInt(this.state.commodityStockNumber)
        }
        let couponGoodsTypeID = 0;
          for(let a of this.state.physicalGoodsTypeList){
            if (this.state.commodityType == a.name) {
              couponGoodsTypeID = a.id;
            }
          }
         if (value == 'updata'){
            if (params.key == 'add') {
              let typeInfoStr = {has_specifications:this.state.hasSku,specifications:specifications,has_properties:this.state.hasLabel,propertyIds:propertyIds,skus:skus,packing_fee:this.state.picking_feeTextInput,physical_goods_type_id:couponGoodsTypeID,name:this.state.commodityName,price:this.state.commodityPrice,goods_num:goods_num,stock:stock,unit:this.state.commodityCompany,goods_describe:this.state.commodityLabel,user_business_info_id:this.state.businessID,goods_img:this.state.commodityImage.fileName};
              console.log(typeInfoStr)
              let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
               NetUtils.postJson('physicalGoods/addPhysicalGoodsInfo',typeInfoStr,params,(result) => {
                  Alert.alert('提示','添加实体商品成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
                  ImageUpdata.upload(this.state.commodityImage.uri, this.state.commodityImage.name, (percentage,onloaded,size) => {
                    console.log();
                  },
                  (result) => {
                      if (result.status == 200) {
                      }else{
                      }
                  });
               });
            }else{
              if (params.nextStep == 'add') {
                let typeInfoStr = {has_specifications:this.state.hasSku,specifications:specifications,has_properties:this.state.hasLabel,propertyIds:propertyIds,skus:skus,packing_fee:this.state.picking_feeTextInput,physical_goods_type_id:couponGoodsTypeID,name:this.state.commodityName,price:this.state.commodityPrice,goods_num:goods_num,stock:stock,unit:this.state.commodityCompany,goods_describe:this.state.commodityLabel,user_business_info_id:this.state.businessID,goods_img:this.state.commodityImage.fileName};
                let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
                 NetUtils.postJson('physicalGoods/addPhysicalGoodsInfo',typeInfoStr,params,(result) => {
                    Alert.alert('提示','添加实体商品成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
                    ImageUpdata.upload(this.state.commodityImage.uri, this.state.commodityImage.name, (percentage,onloaded,size) => {
                      console.log();
                    },
                    (result) => {
                        if (result.status == 200) {
                        }else{
                          console.log('上传失败')
                        }
                    });
                 });
              }else{
                let goods_img = this.state.commodityImage.name;
                if (ImageUpdata.hasImgUrl(goods_img)) {
                  goods_img = ImageUpdata.separateUrl(goods_img);
                }
                let typeInfoStr = {has_specifications:this.state.hasSku,specifications:specifications,has_properties:this.state.hasLabel,propertyIds:propertyIds,skus:skus,packing_fee:this.state.picking_feeTextInput,id:this.state.commodityID,physical_goods_type_id:couponGoodsTypeID,name:this.state.commodityName,price:this.state.commodityPrice,goods_num:goods_num,stock:stock,unit:this.state.commodityCompany,goods_describe:this.state.commodityLabel,user_business_info_id:this.state.businessID,goods_img:this.state.commodityImage.fileName}
                let params = '?mobile='+this.state.phone+'&token='+this.state.token[1] + '&hasChangeSku='+this.state.hasChangeSku;
                console.log(typeInfoStr)
                console.log(params)
                NetUtils.postJson('physicalGoods/updPhysicalGoodsInfo',typeInfoStr,params,(result) => {
                    Alert.alert('提示','修改实体商品成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
                    ImageUpdata.upload(this.state.commodityImage.uri, this.state.commodityImage.name, (percentage,onloaded,size) => {
                      console.log();
                    },
                    (result) => {
                        if (result.status == 200) {
                        }else{
                        }
                    });
                 });
              }
            }
         }
      }else if (this.state.commodityName == '') {
        Alert.alert('提示','请输入商品名称');
      }else if (this.state.commodityType == '请选择分类') {
        Alert.alert('提示','请选择分类');
      }else if (this.state.commodityPrice == ''){
        Alert.alert('提示','请输入价格');
      }else if(this.state.commodityCompany == ''){
        Alert.alert('提示','请输入商品单位');
      }
    }

    _addsucess(navigate){
      navigate('commodityManagement',{key:'success'});
    }

    _deletePress(navigate,params){
      if (params.key == 'add') {
        Alert.alert('提示','未添加，无法删除');
      }else{
        if (this.state.operateType == 1) {
          if (params.nextStep  == '') {
          let typeInfoStr = '?id=' + this.state.commodityID + '&mobile=' + this.state.phone + '&token=' + this.state.token[1];
           NetUtils.get('physicalGoods/delPhysicalGoodsInfo',typeInfoStr,(result) => {
              Alert.alert('提示','删除成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
           });
         }else{
            let arr = this.state.savePhysicalGoodsInfoList;
            for(let i in arr){
              if (arr[i].commodityID == this.state.commodityID) {
                arr.splice(i, 1);
              }
            }
            storage.save({
                      key: 'physicalGoods',  // 注意:请不要在key中使用_下划线符号!
                      id: '1009',   // 注意:请不要在id中使用_下划线符号!
                      data: arr,
                      expires: null,
                    });
            Alert.alert('提示','删除成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
         }
        }else{
          if (params.couponGoodsInfoList.commodityID  == null) {
          let typeInfoStr = '?id=' + this.state.commodityID+'&mobile='+this.state.phone+'&token='+this.state.token[1];
           NetUtils.get('couponGoods/delCouponGoodsInfo',typeInfoStr,(result) => {
              Alert.alert('提示','删除成功',[{text: '确定', onPress: () => this._addsucess(navigate)}]);
           });
         }else{
            let arr = this.state.saveCouponGoodsInfoList;
            for(let i in arr){
              if (arr[i].commodityID == this.state.commodityID) {
                arr.splice(i, 1);
              }
            }
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
    }

    renderChooseImg(){
      if (this.state.commodityImage=='') {
        return (
                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(226),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*上传图片</Text>
                    <View style={{width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(155),alignItems:'flex-end',justifyContent:'center'}}>
                      <TouchableOpacity onPress={() => this._chooseImage()} style={{width:ScreenUtils.scaleSize(155),height:ScreenUtils.scaleSize(155),borderColor:'gray',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10),justifyContent:'center',alignItems:'center'}}>
                        <Image source={require('../images/tianjia.png')} style={{width:ScreenUtils.scaleSize(97),height:ScreenUtils.scaleSize(97)}} />
                      </TouchableOpacity>
                    </View>
                  </View>
               )
      }else{
        return (
                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(226),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*上传图片</Text>
                    <View style={{width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(155),alignItems:'flex-end',justifyContent:'center'}}>
                      <TouchableOpacity onPress={() => this._chooseImage()} style={{width:ScreenUtils.scaleSize(155),height:ScreenUtils.scaleSize(155),borderColor:'gray',borderRadius:ScreenUtils.scaleSize(10),justifyContent:'center',alignItems:'center'}}>
                        <Image source={{uri:this.state.commodityImage.uri}} style={{width:ScreenUtils.scaleSize(155),height:ScreenUtils.scaleSize(155),borderRadius:ScreenUtils.scaleSize(10)}} />
                      </TouchableOpacity>
                    </View>
                  </View>
               )
      }
    }

    renderSku(){
      if (this.state.hasSku) {
        return (
                 <View>
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                   </View>
                   <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*规格名称</Text>
                      <TouchableOpacity onPress={() => this._showSkuTypePicker()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <Text style={{width:ScreenUtils.scaleSize(470),color:'black',fontSize:ScreenUtils.setSpText(8),textAlign:'right',left:ScreenUtils.scaleSize(-10)}}>{this.state.chooseSku==''?'请选择规格名称':this.state.chooseSku}</Text>
                        <Image source={require('../images/add.png')} style={{width:ScreenUtils.scaleSize(42),height:ScreenUtils.scaleSize(42)}} />
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View> 
                    {this.state.skuList.map(item => this._renderSkuListItem(item))}
                 </View>
               )
      }
    }

    renderLabel(){
      if (this.state.hasLabel) {
        return (
                 <View>
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                   </View>
                   <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*属性名称</Text>
                      <TouchableOpacity onPress={() => this._showLabelTypePicker()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(470),color:'black',fontSize:ScreenUtils.setSpText(8),textAlign:'right',left:ScreenUtils.scaleSize(-10)}}>{this.state.chooseLabelText==''?'请选择属性名称':this.state.chooseLabelText}</Text>
                        <Image source={require('../images/add.png')} style={{width:ScreenUtils.scaleSize(42),height:ScreenUtils.scaleSize(42)}} />
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>
                    <FlatList
                        style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white'}}
                        data={this.state.chooseLabelList}
                        renderItem={({item}) => this._renderLabelListItem(item)}
                        ItemSeparatorComponent={this._renderFenge}
                      />
                 </View>
               )
      }
    }

    _renderLabelListItem(item){
      let property_value = JSON.parse(item.property_value)
      let value = property_value.join(' ')
      return (
                <View style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'center'}}>
                <View style={{height:ScreenUtils.scaleSize(15)}}></View>
                <View style={{width:ScreenUtils.scaleSize(600),flexDirection:'row',alignItems:'center'}}>
                  <Text style={{width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.property_name}</Text>
                  <Text style={{lineHeight:ScreenUtils.scaleSize(38),width:ScreenUtils.scaleSize(400),left:ScreenUtils.scaleSize(50),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{value}</Text>
                </View>
                <View style={{height:ScreenUtils.scaleSize(15)}}></View>
                </View>
             )
    }

    _priceTextInputChangeText(item,value){
      let skuList = this.state.skuList
      let i = skuList.indexOf(item)
      skuList[i].price = value
      this.setState({skuList:skuList})
    }

    _renderSkuListItem(item){
      return (
               <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),justifyContent:'center',alignItems:'center'}}>
                  <View style={{height:ScreenUtils.scaleSize(15)}}></View>
                  <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(350),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.value}</Text>
                    <View style={{width:ScreenUtils.scaleSize(50)}}></View>
                    <TextInput
                        maxLength={16}
                        placeholder='填写价格'
                        autoCorrect={false}
                        placeholderTextColor='gray'
                        style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                        onChangeText={(price) => this._priceTextInputChangeText(item,price)}
                        value={item.price}
                        underlineColorAndroid='transparent'
                      />
                  </View>
                  <View style={{height:ScreenUtils.scaleSize(15)}}></View>
               </View>
             )
    }

    _chooseSku(item){
      this.setState({hasChangeSku:1})
      let chooseSkuList = this.state.chooseSkuList
      if (chooseSkuList.length == 0) {
        chooseSkuList.push(item)
      }else{
        let i = chooseSkuList.indexOf(item)
        if (i == -1) {
          chooseSkuList.push(item)
        }else{
          chooseSkuList.splice(i,1)
        }
      }
      let chooseSku = ''
      let list = []
      for (let a of chooseSkuList) {
        list.push(JSON.parse(a.param_value))
        let i = chooseSkuList.indexOf(a)
        if (i == chooseSkuList.length-1) {
          chooseSku+=a.param_name
        }else{
          chooseSku+=a.param_name+','
        }
      }
      this.setState({chooseSkuList:chooseSkuList,chooseSku:chooseSku})
      let skuList = []
      if (list.length == 1) {
        for(let a of list){
          for(let b of a){
            skuList.push({price:'',value:b})
          }
        }
      }else{
        let skuLists = this.calcDescartes(list)
        for(let a of skuLists){
          let value = ''
          for (let b of a){
            let i = a.indexOf(b)
            if (i == a.length-1) {
              value+=b
            }else{
              value+=b+','
            }
          }
          skuList.push({price:'',value:value})
        }
      }
      this.setState({skuList:skuList})
    }

    //笛卡尔积算法，可用于商品 SKU 计算
  calcDescartes (array) {
    if (array.length < 2) return array[0] || [];
      return [].reduce.call(array, function (col, set) {
          var res = [];
          col.forEach(function (c) {
              set.forEach(function (s) {
                  var t = [].concat(Array.isArray(c) ? c : [c]);
                  t.push(s);
                  res.push(t);
              })
          });
          return res;
      });
  }

    _goBackList(){
      this._showSkuTypePicker()
    }

    surePress(){
      this._showSkuTypePicker()
    }

    _renderItem(item){
      return (
               <TouchableOpacity onPress={() => this._chooseSku(item)} style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                 <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(104),height:ScreenUtils.scaleSize(104)}} source={this.state.chooseSkuList.indexOf(item) == -1?require('../images/weigouxuan.png'):require('../images/gouxuan.png')}/>
                 <Text style={{width:ScreenUtils.scaleSize(400),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item.param_name}</Text>
               </TouchableOpacity>
             )
    }

    _renderLabelItem(item){
      return (
               <TouchableOpacity onPress={() => this._chooseLabel(item)} style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                 <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(104),height:ScreenUtils.scaleSize(104)}} source={this.state.chooseLabelList.indexOf(item) == -1?require('../images/weigouxuan.png'):require('../images/gouxuan.png')}/>
                 <Text style={{width:ScreenUtils.scaleSize(400),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item.property_name}</Text>
               </TouchableOpacity>
             )
    }

    _chooseLabel(item){
      let chooseLabelList = this.state.chooseLabelList
      let i = chooseLabelList.indexOf(item)
      if (i == -1) {
        chooseLabelList.push(item)
      }else{
        chooseLabelList.splice(i,1)
      }
      let arr = []
      for(let a of chooseLabelList){
        arr.push(a.property_name)
      }
      this.setState({chooseLabelList:chooseLabelList,chooseLabelText:arr.join(',')})
    }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
    )

    labelSurePress(){
      this._showLabelTypePicker()
    }

    _goBackLabel(){
      this._showLabelTypePicker()
    }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'white'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'white',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../images/back.png')}/>
                      </TouchableOpacity>
                      <Text style={{left:ScreenUtils.scaleSize(50),color:'black',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                      <TouchableOpacity onPress={() => this._deletePress(navigate,params)} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'center'}}>
                        <Text style={{top:ScreenUtils.scaleSize(7),fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(150),textAlign:'right',color:'black'}}>删除</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}>
                    </View>
                    
                      <KeyboardAwareScrollView style={{backgroundColor:'#EEEEEE'}}>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品名称</Text>
                          <TextInput
                            placeholder='请输入商品名称'
                            autoCorrect={false}
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(110),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(commodityName) => this._commodityNameTextInputChangeText(commodityName)}
                            value={this.state.commodityName}
                            underlineColorAndroid='transparent'
                            multiline={true}
                            textAlignVertical={'top'}
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品售价</Text>
                          <TextInput
                            maxLength={16}
                            placeholder='请输入商品售价'
                            placeholderTextColor='gray'
                            autoCorrect={false}
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(commodityPrice) => this._commodityPriceTextInputChangeText(commodityPrice)}
                            value={this.state.commodityPrice}
                            underlineColorAndroid='transparent'
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品类型</Text>
                          <TouchableOpacity onPress={() => this._showBusinessTypePicker()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={{width:ScreenUtils.scaleSize(500),color:'#434343',fontSize:ScreenUtils.setSpText(8),textAlign:'right',left:ScreenUtils.scaleSize(-10)}}>{this.state.commodityType}</Text>
                            <Image source={require('../images/more.png')} style={{width:ScreenUtils.scaleSize(16),height:ScreenUtils.scaleSize(28)}} />
                          </TouchableOpacity>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>

                        {this.renderChooseImg()}

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*库存无限</Text>
                          <View style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'flex-end',justifyContent:'center'}}>
                            <Switch value={this.state.commodityStock} onTintColor='green' thumbTintColor='#EEEEEE' tintColor='gray' onValueChange={() => this._switchChange()} />
                          </View>
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        {this._renderKuCun()}
                        {this._renderPacking()}
                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品单位</Text>
                          <TextInput
                            maxLength={16}
                            autoCorrect={false}
                            placeholder='请输入商品单位'
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(commodityCompany) => this._commodityCompanyTextInputChangeText(commodityCompany)}
                            value={this.state.commodityCompany}
                            underlineColorAndroid='transparent'
                          />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(300),flexDirection:'row'}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(20),color:'black',width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品描述</Text>
                            <TextInput
                              autoCorrect={false}
                              style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(20),color:'black',width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(264),padding:0,borderColor:'#EEEEEE',borderWidth:1}}
                              onChangeText={(commodityLabel) => this._commodityLabelTextInputChangeText(commodityLabel)}
                              value={this.state.commodityLabel}
                              placeholder='请输入商品描述'
                              placeholderTextColor='gray'
                              underlineColorAndroid='transparent'
                              multiline={true}
                              textAlignVertical={'top'}
                            />
                        </View>

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品规格</Text>
                          <View style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'flex-end',justifyContent:'center'}}>
                            <Switch value={this.state.hasSku} onTintColor='green' thumbTintColor='#EEEEEE' tintColor='gray' onValueChange={() => this.sku_switchChange()} />
                          </View>
                        </View>

                        {this.renderSku()}

                        <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}>
                        </View>
                        <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*商品属性</Text>
                          <View style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'flex-end',justifyContent:'center'}}>
                            <Switch value={this.state.hasLabel} onTintColor='green' thumbTintColor='#EEEEEE' tintColor='gray' onValueChange={() => this.label_switchChange()} />
                          </View>
                        </View>

                        {this.renderLabel()}

                      </KeyboardAwareScrollView>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(120),justifyContent:'center',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => this._saveAndUpdata(navigate,params,'updata')} style={{justifyContent:'center',width:ScreenUtils.scaleSize(688),height:ScreenUtils.scaleSize(92),backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(10)}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存上架</Text>
                      </TouchableOpacity>
                    </View>

                    <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.isShowList}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'flex-end'}}>
                          <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(500)}}>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row'}}>
                              <TouchableOpacity onPress={() => this._goBackList()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>返回</Text>
                              </TouchableOpacity>
                              <View style={{width:ScreenUtils.scaleSize(550),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>规格列表</Text>
                              </View>
                              <TouchableOpacity onPress={() => this.surePress()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>确定</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                            <FlatList
                              style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white'}}
                              data={this.state.skuDatas}
                              renderItem={({item}) => this._renderItem(item)}
                              ItemSeparatorComponent={this._renderFenge}
                            />
                          </View>
                       </View>
                    </Modal>

                    <Modal
                       animationType='fade'
                       transparent={true}
                       visible={this.state.isShowLabel}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',alignItems:'center',justifyContent:'flex-end'}}>
                          <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(500)}}>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row'}}>
                              <TouchableOpacity onPress={() => this._goBackLabel()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>返回</Text>
                              </TouchableOpacity>
                              <View style={{width:ScreenUtils.scaleSize(550),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>属性列表</Text>
                              </View>
                              <TouchableOpacity onPress={() => this.labelSurePress()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>确定</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                            <FlatList
                              style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white'}}
                              data={this.state.labelList}
                              renderItem={({item}) => this._renderLabelItem(item)}
                              ItemSeparatorComponent={this._renderFenge}
                            />
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