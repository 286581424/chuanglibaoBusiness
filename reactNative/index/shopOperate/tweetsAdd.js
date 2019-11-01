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
  Modal,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ImagePicker from 'react-native-image-picker';
import Picker from 'react-native-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import SyanImagePicker from 'react-native-syan-image-picker';
import ImageUpdata from '../../PublicComponents/ImageUpdata';
import NetUtils from '../../PublicComponents/NetUtils';

export default class tweetsAdd extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '发表推文',
      statusBarHeight: 0,
      pushArticlesContent: '',
      linkName: '',
      linkCommodity: '',
      imgArr: ['addImage'],
      mobile: '',
      token: '',
      operateType: 0,
      commodityList: [],
      chooseCommodity: '',
      commodityListShow: false,
      isUploadShow: false,
    };
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

  loadOperateType(){
    storage.load({
        key: 'operateType',
        id: '1006'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({operateType:ret});
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

  componentDidMount(){
    this.loadMobile()
    this.loadToken()
    this.loadOperateType()
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

  chooseImg(){
    let maxImg = 9
    let i = this.state.imgArr.length;
    if (this.state.imgArr[i-1] == 'addImage') {
      maxImg = 9-i+1
    }else{
      maxImg = 9-i
    }
    let options = {
      imageCount: maxImg,          // 最大选择图片数目，默认6
      isCamera: true,         // 是否允许用户在内部拍照，默认true
      isCrop: false,          // 是否允许裁剪，默认false
      CropW: ScreenUtils.scaleSize(750), // 裁剪宽度，默认屏幕宽度60%
      CropH: ScreenUtils.scaleSize(750), // 裁剪高度，默认屏幕宽度60%
      isGif: false,           // 是否允许选择GIF，默认false，暂无回调GIF数据
      showCropCircle: false,  // 是否显示圆形裁剪区域，默认false
      showCropFrame: true,    // 是否显示裁剪区域，默认true
      showCropGrid: false     // 是否隐藏裁剪区域网格，默认false
    };
    SyanImagePicker.showImagePicker(options, (err, selectedPhotos) => {
      if (err) {
        // 取消选择
        return;
      }
      let imgArr = this.state.imgArr
      let imgArrLength = imgArr.length
      if (imgArr[imgArrLength-1] == 'addImage') {
        imgArr.splice(imgArrLength-1,1)
      }
      for(let a of selectedPhotos){
        let name = ImageUpdata.getImageName('pushArticles_img',this.state.mobile,selectedPhotos.indexOf(a));
        let fileName = ImageUpdata.getName('pushArticles_img',this.state.mobile,selectedPhotos.indexOf(a))
        imgArr.push({'uri':a.uri,'name':name,'fileName':fileName})
      }
      if (imgArr.length < 9) {
        imgArr.push('addImage')
      }
      this.setState({imgArr:imgArr})
    })
  }

  deleteImg(item){
    let imgArr = this.state.imgArr
    let i = imgArr.indexOf(item)
    imgArr.splice(i,1)
    let imgArrLength = imgArr.length
    if (imgArr[imgArrLength-1] != 'addImage') {
        imgArr.push('addImage')
    }
    this.setState({imgArr:imgArr})
  }

  _renderImgItem(item){
    if (item == 'addImage') {
      return (
             <View style={{width:ScreenUtils.scaleSize(706/3),height:ScreenUtils.scaleSize(199),justifyContent:'center',alignItems:'center'}}>
               <TouchableOpacity onPress={() => this.chooseImg()} style={{width:ScreenUtils.scaleSize(159),height:ScreenUtils.scaleSize(200),justifyContent:'center',alignItems:'center'}}>
                  <Image style={{width:ScreenUtils.scaleSize(159),height:ScreenUtils.scaleSize(159)}} source={require('../images/MenDian/tuiwen/addImg.png')} />
               </TouchableOpacity>
             </View>
           )
    }else{
        return (
               <View style={{width:ScreenUtils.scaleSize(706/3),height:ScreenUtils.scaleSize(199),alignItems:'center'}}>
                  <Image style={{top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(159),height:ScreenUtils.scaleSize(159)}} source={{uri:item.uri}} />
                  <TouchableOpacity onPress={() => this.deleteImg(item)} style={{top:ScreenUtils.scaleSize(-169),left:ScreenUtils.scaleSize(-70),width:ScreenUtils.scaleSize(70),height:ScreenUtils.scaleSize(70),justifyContent:'center',alignItems:'center'}}>
                      <Image style={{width:ScreenUtils.scaleSize(36),height:ScreenUtils.scaleSize(36)}} source={require('../images/MenDian/tuiwen/delete.png')} />
                  </TouchableOpacity>
                </View>
               )
    }
  }

  _renderImgFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(15),height:ScreenUtils.scaleSize(0),backgroundColor:'white'}}></View>
  )

  _addPushArticles(navigate){
    let content_img = ''
    let imgArr = this.state.imgArr
    if (imgArr[imgArr.length-1] == 'addImage') {
      imgArr.splice(imgArr.length-1,1)
    }
    let uploadImgArr = []
    for(let i = 0;i<imgArr.length;i++){
      if (i < imgArr.length-1) {
        if (imgArr[i] != 'addImage') {
          content_img += imgArr[i].fileName + ','
          uploadImgArr.push(imgArr[i])
        }
      }else{
        if (imgArr[i] != 'addImage') {
          content_img += imgArr[i].fileName
          uploadImgArr.push(imgArr[i])
        }
      }
    }
    let str = '?userType=B&token=' + this.state.token[1]
    let is_link = 0
    let goods_id = 0
    if (this.state.chooseCommodity != '') {
      is_link = 1
      goods_id = this.state.chooseCommodity.id
    }
    let jsonObj = {link_name:this.state.linkName,content:this.state.pushArticlesContent,content_img:content_img,is_link:is_link,goods_id:goods_id,link_type:0}
    console.log(jsonObj)
    NetUtils.postJson('pushArticles/add',jsonObj,str,(result) => {
      this.setState({isUploadShow:true})
      let i = 0
      for(let a of uploadImgArr){
        ImageUpdata.upload(a.uri, a.name, (percentage,onloaded,size) => {
          // console.log();
        }, 
        (result) => {
            if (result.status == 200) {
              i++
              if (i == uploadImgArr.length) {
                this.setState({isUploadShow:false})
                navigate('tweetsList',{key:'success'})
              }
            }else{
              console.log('提示','上传失败，错误码为'+result.status);
            }
        });
      }
     });
  }

  renderFlatList(){
    if (this.state.commodityListShow && this.state.operateType == 2) {
      return (
               <FlatList 
                            data={this.state.commodityList}
                            ListEmptyComponent={this._renderEmptyCommodity}
                            renderItem={({item}) => this._renderCommodityItem(item)}
                            />
             )
    }
  }

  _renderEmptyCommodity= () => (
      <View style={{left:ScreenUtils.scaleSize(22),borderRadius:ScreenUtils.scaleSize(5),width:ScreenUtils.scaleSize(706),height:ScreenUtils.scaleSize(101),borderColor:'#EEEEEE',borderWidth:1,alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',width:ScreenUtils.scaleSize(666)}}>暂无相关商品</Text>
      </View>
  )

  _renderCommodityItem(item){
    return (
              <TouchableOpacity onPress={() => this.setState({chooseCommodity:item,linkCommodity:item.name,commodityListShow:false})} style={{left:ScreenUtils.scaleSize(22),borderRadius:ScreenUtils.scaleSize(5),width:ScreenUtils.scaleSize(706),height:ScreenUtils.scaleSize(101),borderColor:'#EEEEEE',borderWidth:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:ScreenUtils.setSpText(8),color:'black',width:ScreenUtils.scaleSize(666)}}>{item.name}</Text>
              </TouchableOpacity>
           )
  }

  commodityNameChange(value){
    this.setState({linkCommodity:value,commodityListShow:true})
    if (value != ''  && this.state.operateType == 2) {
      let params = '?token=' + this.state.token[1] + '&goodsName=' + value;
      NetUtils.get('pushArticles/searchGoods', params, (result) => {
          this.setState({commodityList:result})
      });
    }
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'white'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'white'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../images/back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                  <ScrollView style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}>
                    <View style={{height:ScreenUtils.scaleSize(20),backgroundColor:'white'}}></View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(245),justifyContent:'center',backgroundColor:'white'}}>
                        <TextInput
                          autoCorrect={false}
                          placeholderTextColor='gray'
                          style={{color:'black',left:ScreenUtils.scaleSize(22),width:ScreenUtils.scaleSize(706),height:ScreenUtils.scaleSize(245),padding:0,borderColor:'#EEEEEE',borderWidth:1}}
                          onChangeText={(value) => this.setState({pushArticlesContent:value})}
                          value={this.state.pushArticlesContent}
                          underlineColorAndroid='transparent'
                          multiline={true}
                          placeholder='请输入推文内容'
                          textAlignVertical={'top'}
                        />
                      </View>
                      <View style={{height:ScreenUtils.scaleSize(20),backgroundColor:'white'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(86),justifyContent:'center',backgroundColor:'white'}}>
                        <TextInput
                            maxLength={20}
                            autoCorrect={false}
                            placeholder='请输入链接名称（限制20个字数）'
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(22),width:ScreenUtils.scaleSize(706),height:ScreenUtils.scaleSize(86),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.setState({linkName:value})}
                            value={this.state.linkName}
                            underlineColorAndroid='transparent'
                          />
                      </View>
                      <View style={{height:ScreenUtils.scaleSize(20),backgroundColor:'white'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(750),justifyContent:'center',backgroundColor:'white'}}>
                        <TextInput
                            maxLength={20}
                            autoCorrect={false}
                            placeholder='请输入链接商品）'
                            placeholderTextColor='gray'
                            style={{color:'black',left:ScreenUtils.scaleSize(22),width:ScreenUtils.scaleSize(706),height:ScreenUtils.scaleSize(86),padding:0,borderColor:'#EEEEEE',borderWidth:1,borderRadius:ScreenUtils.scaleSize(10)}}
                            onChangeText={(value) => this.commodityNameChange(value)}
                            value={this.state.linkCommodity}
                            underlineColorAndroid='transparent'
                          />
                          {this.renderFlatList()}
                      </View>
                      <View style={{height:ScreenUtils.scaleSize(20),backgroundColor:'white'}}></View>
                      <View style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                        <FlatList 
                            style={{width:ScreenUtils.scaleSize(706)}}
                            data={this.state.imgArr}
                            numColumns={3}
                            ItemSeparatorComponent={this._renderImgFenge}
                            renderItem={({item}) => this._renderImgItem(item)}
                            />
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(60),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'gray',fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(630)}}>最多分享9张图片</Text>
                      </View>
                  </ScrollView>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white'}}>
                    <Button onPress={() => this._addPushArticles(navigate)} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                      <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>确认发表</Text>
                    </Button>
                  </View>

                <Modal
                   animationType='fade'
                   transparent={true}
                   visible={this.state.isUploadShow}
                   onShow={() => {}}
                   onRequestClose={() => {}} >
                   <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'rgba(140,140,140,0.7)',justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>正在发表中，请稍候</Text>
                   </View>
                </Modal>

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