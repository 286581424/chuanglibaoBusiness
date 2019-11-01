import React, {Component} from 'react';
import {Platform,FlatList,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StarRating from 'react-native-star-rating';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';

const Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');

export default class ProductView extends Component{

  constructor(props) {
    super(props);
    this.state={
    }
  }

  _renderHeader= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(110)}}>
        <Text style={{color:'black',fontSize:20,left:ScreenUtils.scaleSize(300),top:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(160),height:ScreenUtils.scaleSize(40),textAlign:'center'}}>{this.props.title}</Text>
        <Text style={{color:'#908F8F',fontSize:10,left:ScreenUtils.scaleSize(280),top:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(30),textAlign:'center'}}>{this.props.titleEnglish}</Text>
        <Button onPress={() => this.props.morePress()} style={{width:ScreenUtils.scaleSize(60),height:ScreenUtils.scaleSize(30),borderColor:'white',top:-ScreenUtils.scaleSize(30),left:ScreenUtils.scaleSize(620)}}>
        <Text style={{fontSize:14,color:'gray'}}>更多</Text>
        <Image
            resizeMode={'stretch'}
            source={require('../index/images/Home/index_Home_newProject_more.png')}
            style={{height:ScreenUtils.scaleSize(15), width:ScreenUtils.scaleSize(10),left:ScreenUtils.scaleSize(12)}}/>
      </Button>
      </View>
  )

  _renderItem(item){
  	return(
      <TouchableOpacity onPress={() => this.props.itemPress(item)}>
  		  <View style={{backgroundColor:'#EEEEEE',width:ScreenUtils.scaleSize(375),height:ScreenUtils.scaleSize(450)}}>
	          <View style={{flexDirection:'column',backgroundColor:'white',width:ScreenUtils.scaleSize(365),height:ScreenUtils.scaleSize(365),left:ScreenUtils.scaleSize(5)}}>
	            <Image resizeMode={'stretch'} source={require('../index/images/Home/index_Home_newProject_projectImg.png')} style={{width:ScreenUtils.scaleSize(365),height:ScreenUtils.scaleSize(365)}}/>
	          </View>
	          <View style={{flex:1,flexDirection:'column',backgroundColor:'white'}}>
	            <View style={{flex:1}}>
	              <Image resizeMode={'stretch'} source={require('../index/images/Home/index_Home_discount.png')} style={{left:ScreenUtils.scaleSize(25),top:ScreenUtils.scaleSize(18),width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(20)}}/>
	              <Text numberOfLines={1} style={{color:'black',top:-ScreenUtils.scaleSize(8),fontSize:12,left:ScreenUtils.scaleSize(70),width:ScreenUtils.scaleSize(280),height:ScreenUtils.scaleSize(30)}}>{item.newProjectName}</Text>
	            </View>
	            <View style={{flex:1,flexDirection:'row'}}>
	              <Text style={{left:ScreenUtils.scaleSize(25),width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(30),fontSize:14,color:'red'}}>¥{item.nowPrice}</Text>
	              <Text style={{left:ScreenUtils.scaleSize(25),top:ScreenUtils.scaleSize(2),width:ScreenUtils.scaleSize(200),height:ScreenUtils.scaleSize(30),fontSize:12,color:'gray',textDecorationLine:'line-through'}}>原价¥{item.originalPrice}</Text>
	            </View>
	            <View style={{width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
	          </View>
	        </View>
        </TouchableOpacity>
  		);
  }

  render() {
    var data = this.props.dataSource;
    return (
        //新品上市
        <FlatList 
              style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1450),backgroundColor:'white'}}
              data={data}
              numColumns={2}
              renderItem={({item}) => this._renderItem(item)}
              ListHeaderComponent={this._renderHeader()}
          />
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