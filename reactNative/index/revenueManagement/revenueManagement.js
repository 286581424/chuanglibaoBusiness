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
import ScrollableTabView from 'react-native-scrollable-tab-view';

var ordreRevenueArr = [
                {orderNum:'20180521N001',type:'代金券',money:'100.00',time:'2018.07.21',user:'马化腾',phoneNum:'132****2217'},
                {orderNum:'20180521N001',type:'代金券',money:'100.00',time:'2018.07.21',user:'马化腾',phoneNum:'132****2217'},
             ];

var relationRevenueArr = [
                            {orderNum:'20180521N001',userType:'一级会员',money:'100.00',time:'2018.07.21',user:'马化腾',state:'待清算'},
                            {orderNum:'20180521N001',userType:'一级会员',money:'100.00',time:'2018.07.21',user:'马化腾',state:'可提现'},
                         ];

export default class revenueManagement extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '收益管理',
      tabTitleIndex: 0,
      tabTitleArr: ['订单收益','关联收益'],
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

     _fastLoginChange(obj){
        this.setState({tabTitleIndex:obj.i});
     }

     _renderItem(item){
       if (this.state.tabTitleIndex == 0) {
          return (
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(320),alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(300),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(10)}}>
                        <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(70),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(450),color:'black',fontSize:ScreenUtils.setSpText(8)}}>订单号： {item.orderNum}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(220),fontSize:ScreenUtils.setSpText(8),color:'red',fontWeight:'bold',textAlign:'right'}}>¥ {item.money}</Text>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                        <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(250)}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>订单类型： {item.type}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>下单时间： {item.time}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>联系人： {item.user}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>电话： {item.phoneNum}</Text>
                        </View>
                      </View>
                    </View>
                 );
       }else{
          return (
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(320),alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(300),backgroundColor:'white',borderRadius:ScreenUtils.scaleSize(10)}}>
                        <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(70),flexDirection:'row',alignItems:'center'}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(450),fontSize:ScreenUtils.setSpText(8),color:'black'}}>订单号： {item.orderNum}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(220),fontSize:ScreenUtils.setSpText(8),color:'red',textAlign:'right',fontWeight:'bold'}}>¥ {item.money}</Text>
                        </View>
                        <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                        <View style={{width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(250)}}>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>账户： {item.user}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>会员类型： {item.userType}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>下单时间： {item.time}</Text>
                          <Text style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(670),fontSize:ScreenUtils.setSpText(8),color:'black'}}>收益状况： {item.state}</Text>
                        </View>
                      </View>
                    </View>
                 );
       }
    }

      renderOrderView(){
        let datas = [];
        if (this.state.tabTitleIndex == 0) {
          datas = ordreRevenueArr;
        }else{
          datas = relationRevenueArr;
        }
        const orderViewArr = [];
          for(var i of this.state.tabTitleArr){
            orderViewArr.push(
              <FlatList 
                      tabLabel={i}
                      style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(350*datas.length),backgroundColor:'#EEEEEE'}}
                      data={datas}
                      renderItem={({item}) => this._renderItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
                    />
              );
            }
          return orderViewArr;
      }

    _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
    )

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight)}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'black',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <ScrollableTabView tabBarTextStyle={{fontSize:ScreenUtils.setSpText(9)}} style={styles.scrollableTabview} 
                    tabBarActiveTextColor= '#F3A50E'
                    tabBarInactiveTextColor= '#787878'
                    tabBarTextStyle={{fontSize:ScreenUtils.setSpText(7.5),top:ScreenUtils.scaleSize(7)}}
                    tabBarBackgroundColor= 'white'
                    tabBarUnderlineStyle={styles.underline}
                    onChangeTab={(obj) => this._fastLoginChange(obj)}
                    scrollWithoutAnimation={true}
                    locked={true}
                >
                  {this.renderOrderView()}
                </ScrollableTabView>

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