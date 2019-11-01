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
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import NetUtils from '../../PublicComponents/NetUtils';

var options = {
  title: null,
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'选择相册',
  quality: 1.0,
  maxWidth: 1200,
  maxHeight: 1200,
  storageOptions: {
    skipBackup: true
  },
  storageOptions: {
    skipBackup: true,
    path: 'images',
    avatarSource:'',
  }
};

export default class businessImageUpdate extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '经营资质',
      english: '',
      phone : '',
      businessLicenseImageArr: ['addImage'],
      CardIDImageArr: ['addImage'],
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
        this.setState({mobile:ret});
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
    if (this.props.navigation.state.params.shopInfos != null) {
        if (this.props.navigation.state.params.shopInfos.business_license_pic != null) {
          this.setState({businessLicenseImageArr:[{uri:this.props.navigation.state.params.shopInfos.business_license_pic,name:this.props.navigation.state.params.shopInfos.business_license_pic}]});
        }
        if (this.props.navigation.state.params.shopInfos.id_card_pic_opposite != null && this.props.navigation.state.params.shopInfos.id_card_pic_positive != null) {
          this.setState({CardIDImageArr:[{uri:this.props.navigation.state.params.shopInfos.id_card_pic_opposite,name:this.props.navigation.state.params.shopInfos.id_card_pic_opposite},{uri:this.props.navigation.state.params.shopInfos.id_card_pic_positive,name:this.props.navigation.state.params.shopInfos.id_card_pic_positive}]});
        }
    }
  }

  _ImageLongPress(key,item){
    return
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
                <Image style={{width:ScreenUtils.scaleSize(60),height:ScreenUtils.scaleSize(59)}} source={require('../images/personalCenter/tianjiazhaopian.png')} />
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
      ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          let array = this.state.businessLicenseImageArr;;
          let name = ImageUpdata.getImageName('BusinessLicense',this.props.navigation.state.params.phoneNum,'1');
          let source = { uri: response.uri ,name: name};

          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };

          let arr = this.state.businessLicenseImageArr;
          arr.splice(arr.length-1,1,source);
          this.setState({businessLicenseImageArr:arr});
        }
      });
    }else{
      ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let array = this.state.CardIDImageArr;
        let name = ImageUpdata.getImageName('CardID',this.props.navigation.state.params.phoneNum,array.length);
        let source = { uri: response.uri ,name: name};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

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
      }
    });
    }
  }

  _backBtn(goBack){
    goBack();
  }

  _saveBtnPress(navigate,params){
    if (this.state.businessLicenseImageArr[0] != 'addImage' && this.state.CardIDImageArr.length ==2) {
      if (this.state.CardIDImageArr[1] != 'addImage') {
        let shopInfoStr = {id:this.state.businessID,mobile:this.state.mobile,business_license_pic:this.state.businessLicenseImageArr.name,id_card_pic_opposite:this.state.CardIDImageArr[0].name,id_card_pic_positive:this.state.CardIDImageArr[1].name};
         NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
          let ImageUpdataArray = [];
          if (this.state.businessLicenseImageArr[0].name != this.props.navigation.state.params.shopInfos.business_license_pic) {
            ImageUpdataArray.push(this.state.businessLicenseImageArr[0]);
          }
          if (this.state.CardIDImageArr[0].name != this.props.navigation.state.params.shopInfos.id_card_pic_opposite) {
            ImageUpdataArray.push(this.state.CardIDImageArr[0]);
          }
          if (this.state.CardIDImageArr[1].name != this.props.navigation.state.params.shopInfos.id_card_pic_positive) {
            ImageUpdataArray.push(this.state.CardIDImageArr[1]);
          }
          for(let a of ImageUpdataArray){
              ImageUpdata.upload(a.uri, a.name, (percentage,onloaded,size) => {
              console.log();
            },
            (result) => {
                if (result.status == 200) {
                }else{
                  Alert.alert('提示','上传失败，错误码为'+result.status,[{text:"确定", onPress:() => this._setModalVisible}]);
                }
            });
            }
            navigate('shopSeting',{key:'success'});
          });
      }else{
        Alert.alert('提示','请选择身份证正反面图片');
      }
    }else if(this.state.CardIDImageArr[0] == 'addImage'){
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

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
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

                   <View style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>

                     <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
                       <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black',fontWeight:'bold'}}>营业执照（正面）</Text>
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

                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(16),backgroundColor:'#EEEEEE'}}></View>

                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
                         <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black',fontWeight:'bold'}}>个人证件（正反面）</Text>
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

                  <Button onPress={() => this._saveBtnPress(navigate)} style={{left:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(730),height:ScreenUtils.scaleSize(92),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
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