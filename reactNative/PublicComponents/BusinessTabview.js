import React, {Component} from 'react';
import {FlatList,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StarRating from 'react-native-star-rating';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';

const Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');

export default class BusinessTabview extends Component{

  constructor(props) {
    super(props);
    this.state={
      businessTab : 0,  //0为推荐商家，1为附近商家，2为用户好评
    }
  }

  _businessTabChange(obj){
    this.setState({businessTab:obj.i});
  }

  _itemPress(item){
    alert(JSON.stringify(item));
  }

  _renderItem(item){
    return(
      <TouchableOpacity onPress={() => this.props.itemPress(item)}>
        <View style={{flexDirection:'column',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250)}}>
                <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(240)}}>
                  <Image resizeMode={'stretch'} source={require('../index/images/Home/index_Home_businessImage.png')} style={{left:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(21),width:ScreenUtils.scaleSize(190),height:ScreenUtils.scaleSize(160)}}/>
                  <View style={{flexDirection:'column',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(240)}}>
                    <View style={{flexDirection:'row',top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(40)}}>
                      <Text style={{color:'black',top:ScreenUtils.scaleSize(10),fontSize:ScreenUtils.setSpText(8)}}>{item.businessName}</Text>
                      <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(25),top:ScreenUtils.scaleSize(13),width:ScreenUtils.scaleSize(34),height:ScreenUtils.scaleSize(34)}}/>
                    </View>
                    <View style={{flexDirection:'row',top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(40)}}>
                      <StarRating
                          starSize={12}
                          containerStyle={{width:ScreenUtils.scaleSize(140),height:ScreenUtils.scaleSize(40)}}
                          disabled={false}
                          maxStars={5}
                          rating={item.start}
                          fullStarColor={'orange'}
                        />
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(6)}}>{item.perCapita}</Text>
                    </View>
                    <View style={{top:ScreenUtils.scaleSize(5),width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(60),borderBottomColor:'#EEEEEE',borderBottomWidth:1}}>
                      <Text style={{top:ScreenUtils.scaleSize(10),fontSize:ScreenUtils.setSpText(6),color:'gray'}}>{item.businessType}  {item.place}</Text>
                    </View>
                    <View style={{flexDirection:'column',top:ScreenUtils.scaleSize(16),width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(80)}}>
                      <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(40)}}>
                        <Image resizeMode={'stretch'} source={require('../index/images/Home/index_Home_coupon.png')} style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(30)}}/>
                        <Text style={{color:'black',top:ScreenUtils.scaleSize(5),fontSize:ScreenUtils.setSpText(6),left:ScreenUtils.scaleSize(16),width:ScreenUtils.scaleSize(150)}}>{item.coupon}</Text>
                      </View>
                      <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(40)}}>
                        <Image resizeMode={'stretch'} source={require('../index/images/Home/index_Home_discount.png')} style={{width:width*30/750,height:width*30/750}}/>
                        <Text style={{color:'black',top:ScreenUtils.scaleSize(5),fontSize:ScreenUtils.setSpText(6),left:ScreenUtils.scaleSize(16),width:ScreenUtils.scaleSize(150)}}>{item.discount}</Text>
                        </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
      );
  }

  _renderFenge= () => (
      <View style={{width:width,height:height*5/1334,backgroundColor:'#EEEEEE'}}></View>
  )

  renderBusinessView(data){
    var tabTitleArr = ['推荐商家','附近商家','用户好评'];
    const businessViewArr = [];
    if(this.props.tabTitleArray != null){
      for(var i of this.props.tabTitleArray){
        businessViewArr.push(
          <FlatList 
                    tabLabel={i}
                    style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250*this.props.heightLine)}}
                    data={data[this.state.businessTab]}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                />
          );
        }
      }else{
        for(var i of tabTitleArr){
          businessViewArr.push(
          <FlatList 
                    tabLabel={i}
                    style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250*this.props.heightLine)}}
                    data={data[this.state.businessTab]}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                />
          );
        }
      }
      return businessViewArr;
  }


  render() {
    var data = this.props.dataSource;
    var height = this.props.height;
    var heightLine = this.props.heightLine;
    return (
        //推荐商家、附近商家、用户好评切换页面
            //切换按钮
            <ScrollableTabView tabBarTextStyle={{fontSize:16}} style={{width:ScreenUtils.scaleSize(750),height:height}} 
              tabBarActiveTextColor= 'black'  //选中颜色
              tabBarInactiveTextColor= 'black'  //未选中颜色
              tabBarUnderlineStyle={styles.underline}  //下划线样式
              onChangeTab={(obj) => this._businessTabChange(obj)}  //切换按钮时调用
              scrollWithoutAnimation={true}  //是否有切换动画 true为没有
              locked={true}
              >
                {this.renderBusinessView(data)}
              </ScrollableTabView>
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