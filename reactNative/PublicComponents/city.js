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
export default class city extends Component{

  constructor(props) {
    super(props);
    this.state={
      title: '市',
      statusBarHeight: 0,
      cityData: [],
    }
  }

  componentDidMount() {
    this.setStatusBarHeight();
    const { params } = this.props.navigation.state;
    this._loadCityData(params.province);
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
    data.push(params.data[0]);
    data.push(item);
    navigate('area',{city:item,data:data,key:params.key});
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

  _loadCityData(province){
    let params = "?city_level=2&&parent_code="+province.city_code;
      NetUtils.get('public/getCitysRelatesByParm', params, (result) => {
          let arr = [];
          for(var a of result.citysRelateList){
            arr.push(a);
          }
          this.setState({cityData:arr});
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
                data={this.state.cityData}
                renderItem={({item}) => this._renderItem(item,navigate,params)}
                ItemSeparatorComponent={this._renderFenge}
              />
       </View>
      )
  }
}