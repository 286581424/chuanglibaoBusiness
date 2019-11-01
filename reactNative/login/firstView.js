/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  InteractionManager,
  Alert,
  StatusBar,
  NativeModules,
} from 'react-native';

import {StackNavigator} from 'react-navigation';
import Button from 'apsl-react-native-button';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CheckBox from 'react-native-checkbox';
import InputScrollView from 'react-native-input-scroll-view';
import NetUtils from '../PublicComponents/NetUtils';
import ScreenUtils from '../PublicComponents/ScreenUtils';

var dismissKeyboard = require('dismissKeyboard');

const { StatusBarManager } = NativeModules;

let shenfenzheng_txt = '需清晰展示人物五官及身份证信息'+'\n需拍摄手持身份证正、反面两张图片'+'\n不可自拍、不可只拍身份证'
let yingyezhizhao_txt = '需文字清晰、边框完整、露出国徽'+'\n拍摄复印件需加盖印章，可用有效特许证件代替'
let guanlianxuke_txt = '需文字清晰、边框完整'+'\n可用餐饮服务许可证、食品流通许可证等市场监督管理局下发证件代替'

type Props = {};
export default class firstView extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = { 
      headerTitle: '开店须知',
      statusBarHeight: 0,
      checkbox: false,
  };
  }

  componentDidMount() {
    this.setStatusBarHeight();
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

  _checkBoxBtn(checked) {
    if (this.state.checkbox == false) {
      this.setState({checkbox:true});
    }else{
      this.setState({checkbox:false});
    }
  }

  _backBtn(goBack){
    goBack();
  }

  gotoRegister(navigate){
    if (this.state.checkbox) {
      navigate('register',{headerTitle:'注册',key:'注册'});
    }else{
      Alert.alert('提示','请同意协议！')
    }
  }

  render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;

    return (
      <View style={styles.mainView}>

                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
          </View>

            <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
              <TouchableOpacity onPress={() => this._backBtn(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('./images/login_back.png')}/>
              </TouchableOpacity>
              <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.headerTitle}</Text>
            </View>

         <ScrollView>
           <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(340)}} source={require('./images/open_background.png')}/>

           <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(340),top:ScreenUtils.scaleSize(-340),alignItems:'center',justifyContent:'center'}}>
             <View style={{width:ScreenUtils.scaleSize(371),height:ScreenUtils.scaleSize(157),borderWidth:2,borderColor:'white',justifyContent:'center',alignItems:'center'}}>
               <Text style={{fontSize:ScreenUtils.setSpText(19),color:'white',top:ScreenUtils.scaleSize(-8.5)}}>加入创立宝</Text>
               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white',top:ScreenUtils.scaleSize(8.5)}}>打造分享经济新零售</Text>
             </View>
           </View>

           <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),top:ScreenUtils.scaleSize(-340),alignItems:'center'}}>
             <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(190),justifyContent:'center',alignItems:'center'}}>
               <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#070707',top:ScreenUtils.scaleSize(-15)}}>开店前准备好一下</Text>
               <Text style={{fontSize:ScreenUtils.setSpText(12),color:'#070707',top:ScreenUtils.scaleSize(-5)}}>5种图片资料</Text>
               <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#070707',top:ScreenUtils.scaleSize(10)}}>（建议你在证件齐全的店铺中完成）</Text>
             </View>

             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(255),flexDirection:'row'}}>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(255),left:ScreenUtils.scaleSize(34)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50),flexDirection:'row'}}>
                   <View style={{width:ScreenUtils.scaleSize(38),height:ScreenUtils.scaleSize(38),backgroundColor:'orange',borderRadius:ScreenUtils.scaleSize(19),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>1</Text></View>
                   <Text style={{left:ScreenUtils.scaleSize(23),fontSize:ScreenUtils.setSpText(11),color:'#070707'}}>门店照片</Text>
                 </View>
                 <Text numberOfLines={0} style={{left:ScreenUtils.scaleSize(61),width:ScreenUtils.scaleSize(315),top:ScreenUtils.scaleSize(28),fontSize:ScreenUtils.setSpText(8),lineHeight:ScreenUtils.setSpText(12),color:'#989797'}}>需拍出完整门匾、门框（建议正对门面2米处拍摄）</Text>
               </View>
               <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(292),height:ScreenUtils.scaleSize(192)}} source={require('./images/shop_image.png')}/>
             </View>

             <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(37)}}></View>

             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(255),flexDirection:'row'}}>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(255),left:ScreenUtils.scaleSize(34)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50),flexDirection:'row'}}>
                   <View style={{width:ScreenUtils.scaleSize(38),height:ScreenUtils.scaleSize(38),backgroundColor:'orange',borderRadius:ScreenUtils.scaleSize(19),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>2</Text></View>
                   <Text style={{left:ScreenUtils.scaleSize(23),fontSize:ScreenUtils.setSpText(11),color:'#070707'}}>店内环境图片</Text>
                 </View>
                 <Text numberOfLines={0} style={{left:ScreenUtils.scaleSize(61),width:ScreenUtils.scaleSize(315),top:ScreenUtils.scaleSize(28),fontSize:ScreenUtils.setSpText(8),lineHeight:ScreenUtils.setSpText(12),color:'#989797'}}>需真实反应用餐环境（收银台、用餐桌椅）</Text>
               </View>
               <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(292),height:ScreenUtils.scaleSize(192)}} source={require('./images/shop_nei.png')}/>
             </View>

             <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(37)}}></View>

             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(255),flexDirection:'row'}}>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(255),left:ScreenUtils.scaleSize(34)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50),flexDirection:'row'}}>
                   <View style={{width:ScreenUtils.scaleSize(38),height:ScreenUtils.scaleSize(38),backgroundColor:'orange',borderRadius:ScreenUtils.scaleSize(19),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>3</Text></View>
                   <Text style={{left:ScreenUtils.scaleSize(23),fontSize:ScreenUtils.setSpText(11),color:'#070707'}}>法人手持身份证</Text>
                 </View>
                 <Text numberOfLines={0} style={{left:ScreenUtils.scaleSize(61),width:ScreenUtils.scaleSize(315),top:ScreenUtils.scaleSize(28),fontSize:ScreenUtils.setSpText(8),lineHeight:ScreenUtils.setSpText(12),color:'#989797'}}>{shenfenzheng_txt}</Text>
               </View>
               <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(292),height:ScreenUtils.scaleSize(192)}} source={require('./images/idcard.png')}/>
             </View>

             <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(37)}}></View>

             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(255),flexDirection:'row'}}>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(255),left:ScreenUtils.scaleSize(34)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50),flexDirection:'row'}}>
                   <View style={{width:ScreenUtils.scaleSize(38),height:ScreenUtils.scaleSize(38),backgroundColor:'orange',borderRadius:ScreenUtils.scaleSize(19),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>4</Text></View>
                   <Text style={{left:ScreenUtils.scaleSize(23),fontSize:ScreenUtils.setSpText(11),color:'#070707'}}>营业执照</Text>
                 </View>
                 <Text numberOfLines={0} style={{left:ScreenUtils.scaleSize(61),width:ScreenUtils.scaleSize(315),top:ScreenUtils.scaleSize(28),fontSize:ScreenUtils.setSpText(8),lineHeight:ScreenUtils.setSpText(12),color:'#989797'}}>{yingyezhizhao_txt}</Text>
               </View>
               <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(292),height:ScreenUtils.scaleSize(192)}} source={require('./images/yingyezhizhao.png')}/>
             </View>

             <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(37)}}></View>

             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(255),flexDirection:'row'}}>
               <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(255),left:ScreenUtils.scaleSize(34)}}>
                 <View style={{width:ScreenUtils.scaleSize(400),height:ScreenUtils.scaleSize(50),flexDirection:'row'}}>
                   <View style={{width:ScreenUtils.scaleSize(38),height:ScreenUtils.scaleSize(38),backgroundColor:'orange',borderRadius:ScreenUtils.scaleSize(19),justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:ScreenUtils.setSpText(8),color:'white'}}>5</Text></View>
                   <Text style={{left:ScreenUtils.scaleSize(23),fontSize:ScreenUtils.setSpText(11),color:'#070707'}}>关联许可证</Text>
                 </View>
                 <Text numberOfLines={0} style={{left:ScreenUtils.scaleSize(61),width:ScreenUtils.scaleSize(315),top:ScreenUtils.scaleSize(28),fontSize:ScreenUtils.setSpText(8),lineHeight:ScreenUtils.setSpText(12),color:'#989797'}}>{guanlianxuke_txt}</Text>
               </View>
               <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(292),height:ScreenUtils.scaleSize(192)}} source={require('./images/xukezheng.png')}/>
             </View>

             <View style={{width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(3),backgroundColor:'#EEEEEE'}}></View>
             <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(660),height:ScreenUtils.scaleSize(37)}}></View>

           </View>

           <View style={{top:ScreenUtils.scaleSize(-340),width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(280),alignItems:'center',backgroundColor:'#EEEEEE'}}>
             <View style={{width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(110),alignItems:'center',justifyContent:'center'}}>
               <CheckBox
                  label={'我已阅读并同意《创利宝开店说明》'}
                  checked={this.state.checkbox}
                  checkboxStyle={{width:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(40)}}
                  onChange={() => this._checkBoxBtn()}
                />
             </View>
             <Button style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(670),height:ScreenUtils.scaleSize(90),backgroundColor:'#F3A50E',borderColor:'transparent'}} onPress={() => this.gotoRegister(navigate)}>
                  <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(9)}}>下一步</Text>
             </Button>
           </View>
         </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor:'#EEEEEE',
    width: ScreenUtils.scaleSize(750),
    height: ScreenUtils.getHeight(),
  },
});
