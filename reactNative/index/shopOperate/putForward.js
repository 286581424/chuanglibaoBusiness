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
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

var applicationArr = [
                {orderNum:'20180521N001',money:'100.00',time:'2018.07.21 18:00',state:'待审核'},
                {orderNum:'20180521N001',money:'100.00',time:'2018.07.21 18:00',state:'已通过'},
             ];

export default class putForward extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '提现申请',
      statusBarHeight: 0,
  };
  }

  componentDidMount(){
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

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                  <ScrollView style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}>
                  </ScrollView>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white'}}>
                    <Button onPress={() => this._addCommodityPress} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                      <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>提交申请</Text>
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
});