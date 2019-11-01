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
  Keyboard,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import NetUtils from '../../PublicComponents/NetUtils';

export default class skuAdd extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '添加规格',
      statusBarHeight: 0,
      token: '',
      skuName: '',
      skuList: [''],
      keyBoardHeight: 0,
  };
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken()
    const { params } = this.props.navigation.state
    if (params.id != 0) {
      this.loadSkuDetails(params.id)
      this.setState({title:'修改规格'})
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  _keyboardDidShow(e) {
    this.setState({
      keyBoardHeight: e.endCoordinates.height 
    });
  }

  _keyboardDidHide() {
    this.setState({evaluateShow:false})
    this.setState({
      keyBoardHeight: 0
    });
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

  addSure(){
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    if (this.state.title == '添加规格') {
      let str = '?token=' + this.state.token[1]
      let JsonObj = {param_name:this.state.skuName,param_value:JSON.stringify(this.state.skuList)}
      NetUtils.postJson('business/addPhysicalGoodsSpecifications', JsonObj ,str, (result) => {
          Alert.alert('提示','添加成功!',[{text:'确定',onPress:() => navigate('skuSetting',{key:'success'})}])
      });
    }else{
      let str = '?token=' + this.state.token[1]
      let JsonObj = {id:params.id,param_name:this.state.skuName,param_value:JSON.stringify(this.state.skuList)}
      NetUtils.postJson('business/updatePhysicalGoodsSpecifications', JsonObj ,str, (result) => {
          Alert.alert('提示','修改成功!',[{text:'确定',onPress:() => navigate('skuSetting',{key:'success'})}])
      });
    }
  }

  loadSkuDetails(id){
    setTimeout(() => {
        let params = '?token=' + this.state.token[1] + '&id=' + id;
        NetUtils.get('business/physicalGoodsSpecifications', params, (result) => {
            console.log(result)
            this.setState({skuName:result.param_name})
            let param_value = result.param_value
            this.setState({skuList:JSON.parse(param_value)})
        });
    },200);
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

  addSku(){
    let skuList = this.state.skuList
    skuList.push('')
    this.setState({skuList:skuList})
  }

  deleteSku(item){
      let skuList = this.state.skuList
      let i = skuList.indexOf(item)
      skuList.splice(i,1)
      console.log(skuList)
      this.setState({skuList:skuList})
    }

  _renderSkuListFenge= () => (
    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  getFous(item,a){
      if (Platform.OS === 'ios') {
        setTimeout(() => {
            let skuList = this.state.skuList
            let i = skuList.indexOf(item)
            i += 1
            if (ScreenUtils.getHeight()>740) {
              this.scrollview.scrollTo({x: 0, y: ScreenUtils.scaleSize(400), animated: true})
            }else{
              console.log(ScreenUtils.scaleSize(i*80))
              this.scrollview.scrollTo({x: 0, y: ScreenUtils.scaleSize(100+i*80+80+80+20-this.state.keyBoardHeight*2), animated: true})
            }
        },200);
      }
    }

  skuListChange(value,item){
    let skuList = this.state.skuList
    let i = skuList.indexOf(item)
    skuList.splice(i,1,value)
    this.setState({skuList:skuList})
  }

  //onFocus={() => this.getFous(item)}
  _renderSkuListItem(item){
    return (
               <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                 <TextInput
                    maxLength={16}
                    placeholder='请输入规格参数'
                    placeholderTextColor='gray'
                    autoCorrect={false}
                    style={{color:'black',width:ScreenUtils.scaleSize(590),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                    onChangeText={(value) => this.skuListChange(value,item)}
                    value={item}
                    underlineColorAndroid='transparent'
                  />
                  <View style={{width:ScreenUtils.scaleSize(40)}}></View>
                  <TouchableOpacity onPress={() => this.deleteSku(item)} style={{width:ScreenUtils.scaleSize(50),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../images/MenDian/shanchu.png')} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} />
                  </TouchableOpacity>
               </View>
             )
  }

  delete(){
    const { params } = this.props.navigation.state
    const { navigate } = this.props.navigation
    if (params.id == 0) {
      return
    }
    let str = '?token=' + this.state.token[1] + '&id=' + params.id;
    NetUtils.get('business/delPhysicalGoodsSpecifications', str, (result) => {
        Alert.alert('提示','删除成功!',[{text:'确定',onPress:() => navigate('skuSetting',{key:'success'})}])
    });
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'white'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'white',alignItems:'center'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../images/back.png')}/>
                      </TouchableOpacity>
                      <Text style={{left:ScreenUtils.scaleSize(50),color:'black',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                      <TouchableOpacity onPress={() => this.delete()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'flex-end',justifyContent:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black'}}>删除</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>
                    <KeyboardAwareScrollView>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*规格名称</Text>
                      <TextInput
                        maxLength={16}
                        autoCorrect={false}
                        placeholder='请输入规格名称'
                        placeholderTextColor='gray'
                        style={{color:'black',left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                        onChangeText={(skuName) => this.setState({skuName:skuName})}
                        value={this.state.skuName}
                        underlineColorAndroid='transparent'
                      />
                    </View>
                    <View>
                   <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center'}}>
                      <Text style={{color:'black',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(150),fontSize:ScreenUtils.setSpText(8)}}>*规格参数</Text>
                      <TouchableOpacity onPress={() => this.addSku()} style={{left:ScreenUtils.scaleSize(40),width:ScreenUtils.scaleSize(520),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'flex-end'}}>
                        <Image source={require('../images/MenDian/add.png')} />
                      </TouchableOpacity>
                   </View>
                   <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
                     {this.state.skuList.map(item => this._renderSkuListItem(item))}
                   </View>
                   </KeyboardAwareScrollView>
                   <TouchableOpacity onPress={() => this.addSure()} style={{backgroundColor:'#F3A50E',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(90),justifyContent:'center',alignItems:'center'}}>
                     <Text style={{fontSize:ScreenUtils.setSpText(9),color:'white'}}>{this.state.title=='添加规格'?'添加':'修改'}</Text>
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
});