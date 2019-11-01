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
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ScrollableTabView from 'react-native-scrollable-tab-view';

export default class businessQualification extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '经营资质',
      tabTitleIndex: 0,
      businessLicenseArr: [],
      restaurantLicenseArr: [],
      cardIDArr: [],
      foodSafetyGradeArr: [],
      statusBarHeight: 0,
  };
  }

  componentDidMount() {
    this.setStatusBarHeight();
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

  _updataImagePress(navigate,params,key,english){
    navigate('businessImageUpdate',{key:key,english:english,phone:this.props.navigation.state.params.phoneNum,BusinessLicense:params.BusinessLicense,BusinessLicenseNum:params.BusinessLicenseNum,RestaurantLicense:params.RestaurantLicense,RestaurantLicenseNum:params.RestaurantLicenseNum,CardID:params.CardID,CardIDNum:params.CardIDNum,FoodSafetyGrade:params.FoodSafetyGrade,FoodSafetyGradeNum:params.FoodSafetyGradeNum});
  }

  _saveBtnPress(navigate,params){
    navigate('shopInfo',{BusinessLicense:params.BusinessLicense,BusinessLicenseNum:params.BusinessLicenseNum,RestaurantLicense:params.RestaurantLicense,RestaurantLicenseNum:params.RestaurantLicenseNum,CardID:params.CardID,CardIDNum:params.CardIDNum,FoodSafetyGrade:params.FoodSafetyGrade,FoodSafetyGradeNum:params.FoodSafetyGradeNum});
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
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
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this._saveBtnPress(navigate,params)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50)}}>
                      <Text style={{color:'white',textAlign:'center',fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(100)}}>保存</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>营业执照</Text>
                    <Text style={{width:ScreenUtils.scaleSize(280),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(7.5)}}>{params.BusinessLicense != null ? '待审核':'请上传'}</Text>
                    <TouchableOpacity onPress={() => this._updataImagePress(navigate,params,'营业执照','BusinessLicense')} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
                  </View>


                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>

                   <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(7.5),color:'black'}}>个人证件</Text>
                    <Text style={{width:ScreenUtils.scaleSize(280),textAlign:'right',color:'gray',fontSize:ScreenUtils.setSpText(7.5)}}>{params.CardID != null ? '待审核':'请上传'}</Text>
                    <TouchableOpacity onPress={() => this._updataImagePress(navigate,params,'个人证件','CardID')} style={{width:ScreenUtils.scaleSize(690/2-280),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'flex-end'}}>
                      <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_more.png')} style={{width:ScreenUtils.scaleSize(14*1.3),height:ScreenUtils.scaleSize(25*1.3)}}/>
                    </TouchableOpacity>
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