import React, {Component} from 'react';
import {Platform,NativeModules,FlatList,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity,SectionList,StatusBar,Alert} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StarRating from 'react-native-star-rating';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import {StackNavigator} from 'react-navigation';
import NetUtils from './NetUtils';
import shopInfo from '../login/shopInfo';

const { StatusBarManager } = NativeModules;

//市
export default class townOrStreet extends Component{

  constructor(props) {
    super(props);
    this.state={
      title: '镇或街道',
      statusBarHeight: 0,
      townOrStreetData: [],
    }
  }

  componentDidMount() {
    this.setStatusBarHeight();
    const { params } = this.props.navigation.state;
    this._loadCityData(params.area);
  }

  setStatusBarHeight(){
    let height = 0;
    if (Platform.OS === 'android') {
      height = StatusBar.currentHeight * 2;
      this.setState({statusBarHeight:height});
    }else{
      StatusBarManager.getHeight((statusBarHeight)=>{
        if (statusBarHeight.height == '20') {
          height = 40;
        }else{
          height = 80;
        }
        this.setState({statusBarHeight:height});
      })
    }
  }

  _itemPress(item,navigate,params){
    let data = [];
    for(let a of params.data){
      data.push(a);
    }
    data.push(item);
    let str = '';
    for(let a of data){
      if (a.city_name != '市辖区') {
        str += a.city_name+'-';
      }
    }
    let province = data[0].city_name;
    let city = data[1].city_name;
    let area = data[2].city_name;
    let street = data[3].city_name;
    str = str.substring(0,str.length-1);
    navigate(params.key,{cityArray:data,cityResult:str,province:province,city:city,area:area,street:street});
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderItem(item,navigate,params){
    return (
      <TouchableOpacity onPress={() => this._itemPress(item,navigate,params)} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
        <Text style={{width:ScreenUtils.scaleSize(630),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.city_name}</Text>
      </TouchableOpacity>
    );
  }

  _backBtn(goBack){
    goBack();
  }

  _loadCityData(area){
    let params = "?city_level=4&&parent_code="+area.city_code;
      NetUtils.get('public/getCitysRelatesByParm', params, (result) => {
          let arr = [];
          for(var a of result.citysRelateList){
            arr.push(a);
          }
          this.setState({townOrStreetData:arr});
      });
  }

  render() {
    const { navigate,goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
       <View>

         <StatusBar translucent={true} backgroundColor={'transparent'}/>

          <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
          </View>

            <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(50)}}>
              <TouchableOpacity onPress={() => this._backBtn(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50)}}>
                <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36),left:ScreenUtils.scaleSize(39)}} source={require('../login/images/login_back.png')}/>
              </TouchableOpacity>
              <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
            </View>
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}>
            </View>
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
            </View>

          <FlatList 
                style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight()-ScreenUtils.scaleSize(111),backgroundColor:'#EEEEEE'}}
                data={this.state.townOrStreetData}
                renderItem={({item}) => this._renderItem(item,navigate,params)}
                ItemSeparatorComponent={this._renderFenge}
              />
       </View>
      )
  }
}