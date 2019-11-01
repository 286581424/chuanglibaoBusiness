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
import ScreenUtils from '../PublicComponents/ScreenUtils';
import ImageUpdata from '../PublicComponents/ImageUpdata';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SyanImagePicker from 'react-native-syan-image-picker';

const { StatusBarManager } = NativeModules;

const options = {
      imageCount: 1,          // 最大选择图片数目，默认6
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: true,          // 是否允许裁剪，默认false
      CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
      CropH: ScreenUtils.scaleSize(750), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
    };

export default class registerBusinessQualification extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '经营资质',
      english: '',
      phone : '',
      businessLicenseImageArr: ['addImage'],
      CardIDImageArr: ['addImage'],
      statusBarHeight: 0,
  };
  }

  componentDidMount(){
    this.setStatusBarHeight();
    if (this.props.navigation.state.params.BusinessLicense != null) {
      this.setState({businessLicenseImageArr:this.props.navigation.state.params.BusinessLicense});
    }
    if (this.props.navigation.state.params.CardID != null) {
      this.setState({CardIDImageArr:this.props.navigation.state.params.CardID});
    }
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

  _ImageLongPress(key,item){
    Alert.alert('提示','是否删除图片',[{text: '删除', onPress: () => this._deleteImagePress(key,item)},{text:'取消'}]);
  }

  _deleteImagePress(key,item){
    if (key == 'BusinessLicense') {
      let arr = this.state.businessLicenseImageArr;
      let i = arr.indexOf(item);
      arr.splice(i,1);
      if (arr.length == 0) {
        if (arr[1] != 'addImage') {
          arr.push('addImage');
        }
      }
      this.setState({businessLicenseImageArr:arr});
    }else{
      let arr = this.state.CardIDImageArr;
      let i = arr.indexOf(item);
      arr.splice(i,1);
      if (arr.length < 2) {
        if (arr[i] != 'addImage') {
          arr.push('addImage');
        }
      }
      this.setState({shopImageArr:arr});
    }
  }

  _renderShopImageItem(key,item){
    if (item == 'addImage') {
      return (
              <TouchableOpacity onPress={() => this._addImagePress(key)} style={{width:ScreenUtils.scaleSize(256),height:ScreenUtils.scaleSize(258),borderColor:'black',borderWidth:ScreenUtils.scaleSize(1),justifyContent:'center',alignItems:'center'}}>
                <Image style={{width:ScreenUtils.scaleSize(60),height:ScreenUtils.scaleSize(59)}} source={require('../index/images/personalCenter/tianjiazhaopian.png')} />
              </TouchableOpacity>
           );
     }else{
        return (
                <TouchableOpacity onLongPress={() => this._ImageLongPress(key,item)} style={{width:ScreenUtils.scaleSize(256),height:ScreenUtils.scaleSize(258)}}>
                  <Image style={{width:ScreenUtils.scaleSize(256),height:ScreenUtils.scaleSize(258)}} source={{uri:item.uri}} resizeMode={'stretch'} />
                </TouchableOpacity>
               );
     }
  }

  _addImagePress(key){
    if (key == 'BusinessLicense') {
      SyanImagePicker.showImagePicker(options, (err, selectedPhotos) => {
        if (err) {
          // 取消选择
          return;
        }
        // 选择成功，渲染图片
        // ...
         // let source = { uri: selectedPhotos[0].uri };

        let array = this.state.businessLicenseImageArr;;
        let name = ImageUpdata.getImageName('BusinessLicense',this.props.navigation.state.params.phoneNum,'1');
        let source = { uri: selectedPhotos[0].uri ,name: name,fileName:ImageUpdata.getName('BusinessLicense',this.props.navigation.state.params.phoneNum,'1')};

        let arr = this.state.businessLicenseImageArr;
        arr.splice(arr.length-1,1,source);
        this.setState({businessLicenseImageArr:arr});
      })
    }else{
      SyanImagePicker.showImagePicker(options, (err, selectedPhotos) => {
        if (err) {
          // 取消选择
          return;
        }
        // 选择成功，渲染图片
        // ...
         // let source = { uri: selectedPhotos[0].uri };

        let array = this.state.CardIDImageArr;
        let name = ImageUpdata.getImageName('CardID',this.props.navigation.state.params.phoneNum,array.length);
        let source = { uri: selectedPhotos[0].uri ,name: name,fileName:ImageUpdata.getName('CardID',this.props.navigation.state.params.phoneNum,array.length)};

        let arr = this.state.CardIDImageArr;
        if (arr.length < 2) {
          arr.splice(arr.length-1,1,source);
          arr.push('addImage');
        }else if(arr.length == 2){
          arr.splice(1,1,source);
        }
        this.setState({
          CardIDImageArr: arr
        });
      })
    }
  }

  _backBtn(goBack){
    goBack();
  }

  _saveBtnPress(){
    if (this.state.businessLicenseImageArr[0] != 'addImage' && this.state.CardIDImageArr.length ==2) {
      if (this.state.CardIDImageArr[1] != 'addImage') {
        this.props.navigation.navigate('shopInfo',{BusinessLicense:this.state.businessLicenseImageArr,CardID:this.state.CardIDImageArr});
      }else{
        Alert.alert('提示','请选择身份证正反面图片');
      }
    }else if(this.state.CardIDImageArr[0] != 'addImage'){
      Alert.alert('提示','请选择身份证正反面图片');
    }else{
      Alert.alert('提示','请选择营业执照图片');
    }
  }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(180),backgroundColor:'white'}}></View>
    )

    render() {
      const { navigate,goBack } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(50),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(50),backgroundColor:'#F3A50E'}}>
                    <TouchableOpacity onPress={() => this._backBtn(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50)}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36),left:ScreenUtils.scaleSize(39)}} source={require('./images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(9),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'white'}}></View>

                   <View style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>

                     <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
                       <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black',fontWeight:'bold'}}>*营业执照（正面）</Text>
                     </View>
                     <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'white'}}></View>
                     <View style={{width:ScreenUtils.scaleSize(690),alignItems:'center',justifyContent:'center'}}>
                       <FlatList 
                          style={{width:ScreenUtils.scaleSize(630),backgroundColor:'white'}}
                          data={this.state.businessLicenseImageArr}
                          horizontal={true}
                          renderItem={({item}) => this._renderShopImageItem('BusinessLicense',item)}
                          ItemSeparatorComponent={this._renderFenge}
                      />
                     </View>
                     <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(53)}}></View>

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE'}}></View>

                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
                         <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black',fontWeight:'bold'}}>*个人证件（身份证正反两面）</Text>
                       </View>
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'white'}}></View>
                       <View style={{width:ScreenUtils.scaleSize(690),alignItems:'center',justifyContent:'center'}}>
                         <FlatList 
                            style={{width:ScreenUtils.scaleSize(630),backgroundColor:'white'}}
                            data={this.state.CardIDImageArr}
                            horizontal={true}
                            renderItem={({item}) => this._renderShopImageItem('CardID',item)}
                            ItemSeparatorComponent={this._renderFenge}
                        />
                       </View>
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(53)}}></View>

                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(91)}}></View>

                  <Button onPress={() => this._saveBtnPress()} style={{left:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                     <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(9)}}>保存并提交</Text>
                  </Button>

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
    numberTextInput: {
      width:ScreenUtils.scaleSize(380),
      height:ScreenUtils.scaleSize(60),
      left: ScreenUtils.scaleSize(50),
      fontSize: ScreenUtils.setSpText(7),
      padding: 0,
      borderColor:'gray',
      borderRadius:ScreenUtils.scaleSize(5),
      borderWidth: ScreenUtils.scaleSize(2),
    },
});