import React, {Component} from 'react';
import {FlatList,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity,SectionList,Alert} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StarRating from 'react-native-star-rating';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import NetUtils from './NetUtils';
import ImageUpdata from './ImageUpdata';
const Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');

export default class leftNative extends Component{

  constructor(props) {
    super(props);
    this.state={
      businessTab : 0,  //0为推荐商家，1为附近商家，2为用户好评
      isActive : false,
      nowidex: 0,
      phone: '',
      token: '',
    }
  }

  componentDidMount(){
    this.loadPhone();
    this.loadToken();
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

  _itemPress(item,i){
    this.setState({nowidex:i});
    this.sectionList.scrollToLocation({
                                          sectionIndex: i,
                                          itemIndex: 0,
                                          viewOffset: 30,
                                        });
  }

  _renderTabBtn(item,i){
    return(
      <TouchableOpacity style={{justifyContent:'center',alignItems:'center',width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(80),backgroundColor:i==this.state.nowidex?'white':'#EEEEEE'}} onPress={() => this._itemPress(item,i)}>
        <Text style={{color:'black',width:ScreenUtils.scaleSize(110),fontSize:ScreenUtils.setSpText(8)}}>{item.key}</Text>
      </TouchableOpacity>
      );
  }

  _renderSecFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  editPress(item){
    if (this.props.nextStep != '') {
      console.log(item)
      this.props.navigateData('commodityEditor',{nextStep:'add',key:'edit',physicalGoodsInfoDTOList:item.physicalGoodsInfoDTOList});
    }else{
      this.props.navigateData('commodityEditor',{nextStep:'',key:'edit',physicalGoodsInfoDTOList:item.physicalGoodsInfoDTOList});
    }
  }

  _upShelf(item){
    if (item.physicalGoodsInfoDTOList.id == '' || item.physicalGoodsInfoDTOList.id == null) {
      let typeInfoStr = {packing_fee:item.physicalGoodsInfoDTOList.packing_fee,physical_goods_type_id:item.physicalGoodsInfoDTOList.physical_goods_type_id,name:item.physicalGoodsInfoDTOList.name,price:item.physicalGoodsInfoDTOList.price,goods_num:99999,stock:item.physicalGoodsInfoDTOList.stock,unit:item.physicalGoodsInfoDTOList.unit,goods_describe:item.physicalGoodsInfoDTOList.goods_describe,user_business_info_id:item.physicalGoodsInfoDTOList.user_business_info_id,goods_img:item.physicalGoodsInfoDTOList.goods_img.fileName};
      let params = '?mobile='+this.state.phone+'&token='+this.state.token[1];
       NetUtils.postJson('physicalGoods/addPhysicalGoodsInfo',typeInfoStr,params,(result) => {
          Alert.alert('提示','添加实体商品成功',[{text: '确定', onPress: () => this._success()}]);
          if (this.props.nextStep == 'add'){
            this.props.upSuccess(item)
          }
          ImageUpdata.upload(item.physicalGoodsInfoDTOList.goods_img.uri, item.physicalGoodsInfoDTOList.goods_img.name, (percentage,onloaded,size) => {
            console.log();
          },
          (result) => {
              if (result.status == 200) {
              }else{
              }
          });
       });
    }else{
    let params = '?token='+this.state.token[1] + '&goodsId=' + item.physicalGoodsInfoDTOList.id + '&status=0' ;
       NetUtils.get('physicalGoods/changeGoodsStatus',params,(result) => {
          Alert.alert('提示','上架成功',[{text: '确定', onPress: () => this._success()}]);
       });
    }
  }

  _downShelf(item){
    let params = '?token='+this.state.token[1] + '&goodsId=' + item.physicalGoodsInfoDTOList.id + '&status=1' ;
       NetUtils.get('physicalGoods/changeGoodsStatus',params,(result) => {
          Alert.alert('提示','下架成功',[{text: '确定', onPress: () => this._success()}]);
       });
  }

  _success(){
    this.props.upOrDownSuccess();
  }

  _upOrDownShelfPress(item){
    if (this.props.upOrdownText == '下架') {
       Alert.alert('提示','确认下架？',[{text: '确定', onPress: () => this._downShelf(item)},{text:'取消'}]);
    }else{
       Alert.alert('提示','确认上架？',[{text: '确定', onPress: () => this._upShelf(item)},{text:'取消'}]);
    }
  }

  _renderSecItem= (info) => {
    return (
      <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(280),backgroundColor:'white'}}>
        <View style={{white:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(200),flexDirection:'row'}}>
          <Image resizeMode={'stretch'} source={{uri:info.item.image}} style={{left:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(160),height:ScreenUtils.scaleSize(160)}} />
          <View style={{left:ScreenUtils.scaleSize(40),top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(160)}}>
            <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(53),justifyContent:'center',alignItems:'center'}}><Text style={{color:'black',width:ScreenUtils.scaleSize(400),fontSize:ScreenUtils.setSpText(8)}}>{info.item.name}</Text></View>
            <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(53),justifyContent:'center',alignItems:'center'}}><Text style={{color:'black',width:ScreenUtils.scaleSize(400),fontSize:ScreenUtils.setSpText(8)}}>月销量：{info.item.salesVolume}</Text></View>
            <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(53),justifyContent:'center',alignItems:'center'}}><Text style={{width:ScreenUtils.scaleSize(400),fontSize:ScreenUtils.setSpText(8),color:'red'}}>¥{info.item.price}</Text></View>
          </View>
        </View>
        <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(80),flexDirection:'row',justifyContent:'flex-end'}}>
          <Button onPress={() => this.editPress(info.item)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(70),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
              <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>编辑</Text>
          </Button>
          <View style={{width:ScreenUtils.scaleSize(20),height:ScreenUtils.scaleSize(80)}}></View>
          <Button onPress={() => this._upOrDownShelfPress(info.item)} style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(70),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
              <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>{this.props.upOrdownText}</Text>
          </Button>
          <View style={{width:ScreenUtils.scaleSize(20),height:ScreenUtils.scaleSize(80)}}></View>
        </View>
      </View>
    );
  }

  _renderSecHeaderItem= (info) => {
    return (
      <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(60),justifyContent:'center',backgroundColor:'#EEEEEE'}}>
        <Text style={{color:'black',left:ScreenUtils.scaleSize(20),fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(300)}}>{info.section.key}</Text>
      </View>
    );
  }

  render() {
    var data = this.props.dataSource;
    var heightLine = this.props.heightLine;
    return (
       <View style={{flexDirection:'row',flex:1}}>
          <View style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(80*data.length)}}>
            {data.map((item,i) => this._renderTabBtn(item,i))}
          </View>
          <SectionList
            ref={ref => this.sectionList = ref}
            style={{width:ScreenUtils.scaleSize(600)}}
            renderItem={this._renderSecItem}
            sections={data}
            ItemSeparatorComponent={this._renderSecFenge}
            renderSectionHeader={this._renderSecHeaderItem}
          />
       </View>
      )
  }
}
const styles = StyleSheet.create({
  underline: {
    borderColor: 'red',
    backgroundColor: '#F3A50E',
  },
  businessViewStyle:{
    flexDirection:'row',
    width:ScreenUtils.scaleSize(750),
    height:ScreenUtils.scaleSize(240),
  },
});