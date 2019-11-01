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
  FlatList,
  NativeModules,
  Modal,
  NativeEventEmitter,
  TouchableHighlight,
} from 'react-native';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import NetUtils from '../../PublicComponents/NetUtils';
import { Switch } from 'react-native-switch';
import Picker from 'react-native-picker';

export default class printSetting extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '打印设置',
      id: '',
      token: '',
      statusBarHeight: 0,
      printname: '',  //打印机名称
      msign: '',  //终端号秘钥
      machineCode: '',  //终端号
      printNumber: '1',
      printAuto: true,
      type: 0,  //0添加，1修改
      pickerData: ['易联云打印机','中午云打印机'],
      printType: '请选择打印机类型',
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

  loadToken(){
    storage.load({
        key: 'token',
        id: '1004'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({token:ret});
      }).catch(err => {
        // 如果没有找到数据且没有sync方法，
        // 或者有其他异常，则在catch中返回
        console.warn(err.message);
        switch (err.name) {
            case 'NotFoundError':
                // TODO;
                break;
            case 'ExpiredError':
                // TODO
                break;
        }
      });
  }

  deviceListShow(){
    let deviceListShow = this.state.deviceListShow
    this.setState({deviceListShow:!deviceListShow})
  }


    componentDidMount(){
      this.setStatusBarHeight();
      this.loadToken();
      const { params } = this.props.navigation.state
      if (params.key == 'info') {
        this.setState({type:1})
        if (params.info.printed == 0) {
          this.setState({printAuto:false})
        }
        let printType = '易联云打印机'
        if (params.info.type == 1) {
          printType = '中午云打印机'
        }
        this.setState({printType:printType,id:params.info.id,printNumber:params.info.print_copies.toString(),printname:params.info.print_name,msign:params.info.msign,machineCode:params.info.machine_code})
      }
      setTimeout(() => {
        // let params = '?token=' + this.state.token[1]
        // NetUtils.get('business/printerList', params, (result) => {
        //   console.log(result)
        // });
      },400);
    }

    _showPrintTypePicker(){
        let type = '';
        if (this.state.printType == '请选择打印机类型') {
          type = this.state.pickerData[0];
        }else{
          type = this.state.printType;
        }
        Picker.init({
            pickerData: this.state.pickerData,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText:'商品类型',
            selectedValue: [type],
            onPickerConfirm: data => {
                this.setState({printType:data[0]});
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }

    ConnectPrinter(){
      const { navigate } = this.props.navigation;
      if (this.state.printType == '请选择打印机类型') {
        Alert.alert('提示','请选择打印机类型')
        return
      }
      if (this.state.type == 0) {
        if (this.state.printname == '') {
          Alert.alert('提示','请输入打印机名字')
          return
        }
        if (this.state.machineCode == '') {
          Alert.alert('提示','请输入终端号')
          return
        }
        if (this.state.msign == '') {
          Alert.alert('提示','请输入终端号秘钥')
          return
        }
        let formData = new FormData();
        let printType = 0
        if (this.state.printType == '中午云打印机') {
          printType = 1
        }
        formData.append('type',printType);
        formData.append('token',this.state.token[1]);
        formData.append('machineCode',this.state.machineCode);
        formData.append('msign',this.state.msign);
        formData.append('printname',this.state.printname);
        formData.append('printCopies',this.state.printNumber);
        console.log(formData)
        NetUtils.post('business/addPrinter', formData, (result) => {
          Alert.alert('提示',result,[{text:'确定',onPress:() => navigate('printSetting',{key:'success'})}])
        });
      }else{
        let printAuto = 1
        if (!this.state.printAuto) {
          printAuto = 0
        }
        let params = '?token=' + this.state.token[1] + '&id=' + this.state.id + '&printCopies=' + this.state.printNumber + '&printed=' + printAuto
        NetUtils.get('business/updatePrintCopies', params, (result) => {
          Alert.alert('提示',result,[{text:'确定',onPress:() => navigate('printSetting',{key:'success'})}])
        });
      }
    }

    deletePrint(){
      if (this.state.type==0) {
        return
      }
      const { navigate } = this.props.navigation;
      let params = '?token=' + this.state.token[1] + '&id=' + this.state.id
      NetUtils.get('business/delPrinter', params, (result) => {
        Alert.alert('提示',result,[{text:'确定',onPress:() => navigate('printSetting',{key:'success'})}])
      });
    }

    _switchChange(){
      if (this.state.printAuto == true) {
        this.setState({printAuto:false});
      }else{
        this.setState({printAuto:true});
      }
    }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
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
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this.deletePrint()} style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'center',justifyContent:'center'}}>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9)}}>删除</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{flex:1}}>
                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(690/2-150),fontSize:ScreenUtils.setSpText(8),color:'black'}}>打印机类型</Text>
                      <TouchableOpacity onPress={() => this._showPrintTypePicker()} style={{width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center'}}>
                        <Text style={{width:ScreenUtils.scaleSize(500),color:'black',fontSize:ScreenUtils.setSpText(8),textAlign:'right'}}>{this.state.printType}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(690/2-150),fontSize:ScreenUtils.setSpText(8),color:'black'}}>打印机名称</Text>
                      <TextInput
                        placeholder='请输入打印机名称'
                        placeholderTextColor='gray'
                        autoCorrect={true}
                        style={{color:'black',padding: 0,width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(60)}}
                        onChangeText={(value) => this.setState({printname:value})}
                        value={this.state.printname}
                        underlineColorAndroid='transparent'
                      />
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(690/2-150),fontSize:ScreenUtils.setSpText(8),color:'black'}}>终端号</Text>
                      <TextInput
                        placeholder='请输入终端号'
                        placeholderTextColor='gray'
                        autoCorrect={true}
                        style={{color:'black',padding: 0,width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(60)}}
                        onChangeText={(value) => this.setState({machineCode:value})}
                        value={this.state.machineCode}
                        underlineColorAndroid='transparent'
                      />
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(690/2-150),fontSize:ScreenUtils.setSpText(8),color:'black'}}>终端号秘钥</Text>
                      <TextInput
                        placeholder='请输入终端号秘钥'
                        placeholderTextColor='gray'
                        autoCorrect={true}
                        style={{color:'black',padding: 0,width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(60)}}
                        onChangeText={(value) => this.setState({msign:value})}
                        value={this.state.msign}
                        underlineColorAndroid='transparent'
                      />
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>
                    <View style={{flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(690/2-150),fontSize:ScreenUtils.setSpText(8),color:'black'}}>打印份数</Text>
                      <TextInput
                        placeholder='请输入打印份数'
                        placeholderTextColor='gray'
                        autoCorrect={true}
                        style={{color:'black',padding: 0,width:ScreenUtils.scaleSize(500),height:ScreenUtils.scaleSize(60)}}
                        onChangeText={(value) => this.setState({printNumber:value})}
                        value={this.state.printNumber}
                        underlineColorAndroid='transparent'
                      />
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white',height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>自动打印</Text>
                      <View style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),alignItems:'flex-end',justifyContent:'center'}}>
                        <Switch value={this.state.printAuto} onTintColor='green' thumbTintColor='#EEEEEE' tintColor='gray' onValueChange={() => this._switchChange()} />
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => this.ConnectPrinter()} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),backgroundColor:'#F3A50E',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(8)}}>{this.state.type==0?'添加':'修改'}</Text>
                  </TouchableOpacity>

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