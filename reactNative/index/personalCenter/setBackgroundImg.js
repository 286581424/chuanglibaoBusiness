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
import ImageUpdata from '../../PublicComponents/ImageUpdata';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../../PublicComponents/NetUtils';
import SyanImagePicker from 'react-native-syan-image-picker';

const options = {
      imageCount: 1,          // 最大选择图片数目，默认6
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: false,          // 是否允许裁剪，默认false
      CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
      CropH: ScreenUtils.scaleSize(750), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
    };

export default class setBackgroundImg extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '背景图',
      english: '',
      phone : '',
      businessLicenseImageArr: ['addImage'],
      shopInfo: '',
      businessID: '',
      mobile: '',
      statusBarHeight: 0,
  };
  }

  loadBusinessID(){
    storage.load({
        key: 'id',
        id: '1007'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({businessID:ret});
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

  loadMobile(){
    storage.load({
        key: 'phone',
        id: '1005'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({phone:ret});
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadBusinessID();
    this.loadMobile();
    const { params } = this.props.navigation.state;
    if (params.background != '') {
      let businessLicenseImageArr = []
      businessLicenseImageArr.push({uri:params.background,name:params.background})
      this.setState({businessLicenseImageArr:businessLicenseImageArr})
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

  _renderShopImageItem(item){
    if (item == 'addImage') {
      return (
              <TouchableOpacity onPress={() => this._addImagePress()} style={{top:ScreenUtils.scaleSize(30/2),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(170),borderColor:'black',borderWidth:ScreenUtils.scaleSize(1)}}>
              </TouchableOpacity>
           );
     }else{
        return (
                <TouchableOpacity onPress={() => this._addImagePress()} style={{top:ScreenUtils.scaleSize(30/2),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(170)}}>
                  <Image style={{width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(170)}} source={{uri:item.uri}} resizeMode={'stretch'} />
                </TouchableOpacity>
               );
     }
  }

  _addImagePress(key){
    SyanImagePicker.showImagePicker(options, (err, selectedPhotos) => {
      if (err) {
        // 取消选择
        return;
      }
      // 选择成功，渲染图片
       // let source = { uri: selectedPhotos[0].uri };

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };

      let array = this.state.businessLicenseImageArr;;
      let name = ImageUpdata.getImageName('Business_background',this.state.phone,'1');
      let source = { uri: selectedPhotos[0].uri ,name: name, fileName:ImageUpdata.getName('Business_background',this.state.phone,'1')};

      let arr = this.state.businessLicenseImageArr;
      arr.splice(arr.length-1,1,source);
      this.setState({businessLicenseImageArr:arr});
    })
  }

  _backBtn(goBack){
    goBack();
  }

  _saveBtnPress(navigate,params){
    if (this.state.businessLicenseImageArr[0] != 'addImage') {
        let shopInfoStr = {id:this.state.businessID,mobile:this.state.phone,background:this.state.businessLicenseImageArr[0].fileName};
         NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
            let ImageUpdataArray = [];
            ImageUpdata.upload(this.state.businessLicenseImageArr[0].uri, this.state.businessLicenseImageArr[0].name, (percentage,onloaded,size) => {
              console.log();
            },
            (result) => {
              if (result.status == 200) {
              }else{
                Alert.alert('提示','上传失败，错误码为'+result.status,[{text:"确定", onPress:() => this._setModalVisible}]);
              }
            });
            navigate('shopSeting',{key:'success'});
          });
    }else{
      Alert.alert('提示','请选择背景图');
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

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                    <TouchableOpacity onPress={() => this._backBtn(goBack)} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <View style={{left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'black',width:ScreenUtils.scaleSize(150)}}></Text>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>


                 <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
                   <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black',fontWeight:'bold'}}>*店铺背景图</Text>
                 </View>
                 <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(5),backgroundColor:'#EEEEEE'}}></View>
                 <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(215),alignItems:'center',justifyContent:'center'}}>
                   <FlatList 
                      style={{width:ScreenUtils.scaleSize(630),height:ScreenUtils.scaleSize(215),backgroundColor:'#EEEEEE'}}
                      data={this.state.businessLicenseImageArr}
                      horizontal={true}
                      renderItem={({item}) => this._renderShopImageItem(item)}
                      ItemSeparatorComponent={this._renderFenge}
                  />
                 </View>


                  <Button onPress={() => this._saveBtnPress(navigate)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                     <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存并提交</Text>
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