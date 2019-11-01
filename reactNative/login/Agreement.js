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
  StatusBar,
  TouchableOpacity,
  NativeModules
} from 'react-native';

import StackNavigator from 'react-navigation'
import Button from 'apsl-react-native-button'
import registerView from '../login/register'
import ScreenUtils from '../PublicComponents/ScreenUtils';

const { StatusBarManager } = NativeModules;

var Dimensions = require('Dimensions'); //必须要写这一行，否则报错，无法找到这个变量
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;
// var handle = InteractionManager.createInteractionHandle();
// // 执行动画... (`runAfterInteractions`中的任务现在开始排队等候)
// // 在动画完成之后
// InteractionManager.clearInteractionHandle(handle);

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = { 
      statusBarHeight: 0,
  };
  }

  _backBtn(navigate,params){
    navigate(params.backview,{headerTitle:params.backtitle,key:'注册'});
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

  componentDidMount() {
    this.setStatusBarHeight();
  }


  render() {
    const { navigate,goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.mainView}>

                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

          <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
          </View>

            <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
              <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('./images/login_back.png')}/>
              </TouchableOpacity>
              <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>商家协议</Text>
            </View>

        <ScrollView style={styles.neirongView}>
          <Text style={styles.neirongText}>
          {'\r\n'}本《最终用户许可协议》（以下称《协议》）是您（单一实体）与 xxx系统之间有关上述xxx系统软件产品的法律协议。 
          本“软件产品”包括计算机软件，并可能包括相关媒体、印刷材料和“联机”或电子文档（“软件产品”）。本“软件产品”还包括对xxx系统提供给您的原“软件产品”的任何更新和补充资料。任何与本“软件产品”一同提供给您的并与单独一份最终用户许可证相关的软件产品是根据那份许可协议中的条款而授予您。您一旦安装、复制、下载、访问或以其它方式使用“软件产品”，即表示您同意接受本《协议》各项条款的约束。如您不同意本《协议》中的条款，请不要安装或使用“软件产品”；但您可将其退回原购买处，并获得全额退款。
          软件产品许可证
          {'\r\n'}本“软件产品”受袒护著作权法及国际著作权条约和其它知识产权法和条约的保护。本“软件产品”只许可使用，而不出售。
          {'\r\n'}1．许可证的授予。本《协议》授予您下列权利：．应用软件。您可在单一一台计算机上安装、使用、访问、显示、运行或以其它方 
          式互相作用于（“运行”）本“软件产品” （或适用于同一操作系统的任何前版本）的一份副本。运行“软件产品”的计算机的主要用户可以制作另一份副本，仅供在其在安装到公司其他电脑管理注册后的同一项目之用。
          {'\r\n'}．储存／网络用途。您还可以在您公司的其它计算机上运行“软件产品”但仅限于注册时所添之项目，您必须为增加的每个项目获得一份许可证。
          {'\r\n'}．保留权利。未明示授予的一切其它权利均为XXX有限公司所有。
          {'\r\n'}2．其它权利和限制的说明。 
          {'\r\n'}．试用版本。仅限于试用，如需正式使用，必须注册成为正式版。
          {'\r\n'}．组件的分隔。本“软件产品”是作为单一产品而被授予使用许可的。您不得将 
          其组成部分分开在多台计算机上使用。
          {'\r\n'}．商标。本《协议》不授予您有关任何xxx系统商标或服务商标的任何 
          权利。 
          {'\r\n'}．出租。不得出租、租赁或出借本“软件产品”。
          {'\r\n'}．支持服务。xxx有限公司可能为您提供 
          与“软件产品”有关的支持服务（“支持服务”）。支持服务的使用受用户手册、“联机”文档和/或其它提供的材料中所述的各项政策和计划的制约。提供给您作为支持服务的一部份的任何附加软件代码应被视为本“软件产品”的一部分，并须符合本《协议》中的各项条款和条件。至于您提供给XX有限公司作为支持服务的一部分的技术信息，xxx有限公司可将其用于商业用途，包括产品支持和开发。xxx咨有限公司在使用这些技术信息时不会以个人形式提及您。
          {'\r\n'}．软件转让。本"软件产品"的第一被许可人不可以对本《协议》及“软件产品”直接或间接向任何用户作转让。
          {'\r\n'}．终止。如您未遵守本《协议》的各项条款和条件，在不损害其它权利的情况 
          下，xxx咨询有限公司可终止本《协议》。如此类情况发生，您必须销毁“软件产品”的所有副本及其所有组成部分。
          {'\r\n'}3．升级版本。如本“软件产品”标明为升级版本，您必须获取xxx有限公司标明为合格使用升级版本的产品的许可证方可使用本“软件产品” 。标明为升级版本的“软件产品”替换和/或补充（也 
          可能使无能）使您有资格使用升级版本的基础的产品，您只可根据本《协议》的条款使用所产生的升级产品。如本“软件产品”是您获得许可作为单一产品使用的一套软件程序包中一个组件的升级版本，则本“软件产品”只可作为该单一产品包的一部分而使用和转让，并且不可将其分开使用在一台以上的计算机上。
          {'\r\n'}4．著作权。本“软件产品”（包括但不限于本“软件产品”中所含的任何图象、照片、动画、录像、录音、音乐、文字和附加程序）、随附的印刷材料、及本“软件产品”的任何副本的产权和著作权，均由xxx有限公司拥有。通过使用“软件产品”可访问的内容的一切所有权和知识产权均属于各自内容所有者拥有，并可能受适用著作权或其它知识产权法和条约的保护。 
          </Text>
       </ScrollView>
       </View>
    );
  }
}


const styles = StyleSheet.create({
  mainView: {
    flex:1,
    backgroundColor: 'white',
  },
  neirongView: {
    top: 30,
    width: ScreenWidth,
  },
});
