import { QRScannerView } from 'ac-qrcode';
import React, {Component} from 'react';
import { RNCamera } from 'react-native-camera';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    Animated,
    NativeModules,
    Platform,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import NetUtils from '../PublicComponents/NetUtils';

export default class scanView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusBarHeight: 0,
        };
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

  componentDidMount () {
    this.setStatusBarHeight();
  }

    render() {
        const { navigate,goBack,state } = this.props.navigation;
        return (
                < QRScannerView
                    onScanResultReceived={this.barcodeReceived.bind(this)}

                    renderTopBarView={() => this._renderTitleBar()}

                    renderBottomMenuView={() => this._renderMenu()}

                    isShowScanBar={false}
                />
        )
    }

    _renderTitleBar(){
        const { navigate,goBack,state } = this.props.navigation;
        return(
            <View >
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                  <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                    <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../login/images/login_back.png')}/>
                  </TouchableOpacity>
                  <View style={{width:ScreenUtils.scaleSize(550),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(11)}}>扫一扫</Text>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                  </View>
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                </View>
            </View>
        );
    }

    _renderMenu() {
        return (
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}></Text>
        )
    }

    _userSuccess(goBack){
        goBack();
        DeviceEventEmitter.emit('orderAdministrationListener','')
    }

    barcodeReceived(e) {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
      if (e.data.indexOf("app=clb") != -1) {
        let result = e.data.split('clb');
        let jsonObj = JSON.parse(result[1]);
        let str = '?mobile=' + params.phone + '&token=' + params.token[1] + '&order_status=2' + '&user_type=B' + '&order_num=' + jsonObj.order_num + '&goods_type=3';
        NetUtils.get_back('order/updateGoodsOrderStatus', str, (result) => {
            Alert.alert('提示','优惠券使用成功！',[{text:'确认',onPress: () => this._userSuccess(goBack)}])
        },(error) => {
            Alert.alert('提示',error,[{text:'确认',onPress: () => this._userSuccess(goBack)}])
        },);
      }else{
        Alert.alert('提示','二维码有误！',[{text:'确认',onPress: () => goBack()}]);
      }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    }
});