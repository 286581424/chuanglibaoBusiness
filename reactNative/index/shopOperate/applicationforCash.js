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
import {StackNavigator} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

var applicationArr = [
                {orderNum:'20180521N001',money:'100.00',time:'2018.07.21 18:00',state:'待审核'},
                {orderNum:'20180521N001',money:'100.00',time:'2018.07.21 18:00',state:'已通过'},
             ];

export default class applicationforCash extends Component {
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

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
    )

    _renderItem(item){
      let txtColor = '';
      if (item.state == '待审核') {
        txtColor = 'red';
      }else{
        txtColor = 'green';
      }
      return (
        <View style={{backgroundColor:'white',left:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(200),borderRadius:ScreenUtils.scaleSize(10)}}>
          <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(70),borderBottomColor:'#EEEEEE',borderBottomWidth:ScreenUtils.scaleSize(2),justifyContent:'center'}}>
            <Text style={{left:ScreenUtils.scaleSize(20),top:ScreenUtils.scaleSize(7),width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black'}}>提现单号： {item.orderNum}</Text>
          </View>
          <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(130),flexDirection:'row',alignItems:'center'}}>
            <Text style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(380),fontSize:ScreenUtils.setSpText(9),color:'red'}}>¥ {item.money}</Text>
            <View style={{width:ScreenUtils.scaleSize(300),height:ScreenUtils.scaleSize(100),alignItems:'center'}}>
              <Text style={{width:ScreenUtils.scaleSize(380),fontSize:ScreenUtils.setSpText(8),color:'black'}}>订单时间： {item.time}</Text>
              <Text style={{width:ScreenUtils.scaleSize(380),fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(20),color:'black'}}>状态： <Text style={{color:txtColor,fontSize:ScreenUtils.setSpText(8)}}>{item.state}</Text></Text>
            </View>
          </View>
        </View>
      );
    }

    render() {
      const { navigate,goBack } = this.props.navigation;
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
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                  <FlatList 
                    style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(200*applicationArr.length),backgroundColor:'#EEEEEE'}}
                    data={applicationArr}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                  />

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white'}}>
                    <Button onPress={() => this._addCommodityPress} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                      <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>申请提现</Text>
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