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
import Swiper from 'react-native-swiper';
import NetUtils from '../../PublicComponents/NetUtils';

export default class tweetsDetails extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '推文详情',
      statusBarHeight: 0,
      token: '',
      contentImgList: [],
      tweetsDetail: [],
      commentList: [],
  };
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken()
    this.loadPushArticlesDetails()
    this.loadCommentList()
  }

  loadCommentList(){
    const { params } = this.props.navigation.state;
    setTimeout(() => {
        let str = '?id=' + params.id + '&pageNum=1&pageSize=10'
        NetUtils.get('pushArticles/commentList', str, (result) => {
            console.log(result)
            this.setState({commentList:result})
        });
    },200);
  }

  loadPushArticlesDetails(){
    const { params } = this.props.navigation.state;
    setTimeout(() => {
        let str = '?id=' + params.id + '&token=' + this.state.token[1]
        NetUtils.get('pushArticles/businessDetails', str, (result) => {
            console.log(result)
            let imgArr = result.content_img.split(',')
            this.setState({contentImgList:imgArr})
            this.setState({tweetsDetail:result})
        });
    },200);
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

  renderAdvertisingImg(){
    const AdvertisingImg = [];
    if (this.state.contentImgList.length > 0) {
      for (let a of this.state.contentImgList) {
          AdvertisingImg.push(
                    <Image
                          source={{uri:a}}
                          style={styles.AdvertisingImgStyle}/>
              );
      }
      return AdvertisingImg;
    }else{
      return <View></View>
    }
  }

  pushTime(pushTime){
    if (pushTime == undefined) {
      return
    }
    let invalid_time = pushTime.replace(/-/g,'/');
    let now_time = NetUtils.getTime().replace(/-/g,'/');
    let invalid_time_timestamp = new Date(invalid_time).getTime();
    let now_time_timestamp = new Date(now_time).getTime();
    let zong_sec = (now_time_timestamp-invalid_time_timestamp)/1000;
    let d = Math.floor(zong_sec / 3600/24) < 10 ? '0'+Math.floor(zong_sec / 3600/24) : Math.floor(zong_sec / 3600/24);
    let h = Math.floor(zong_sec / 3600) < 10 ? '0'+Math.floor(zong_sec / 3600) : Math.floor(zong_sec / 3600);
    let m = Math.floor((zong_sec / 60 % 60)) < 10 ? '0' + Math.floor((zong_sec / 60 % 60)) : Math.floor((zong_sec / 60 % 60));
    let s = Math.floor((zong_sec % 60)) < 10 ? '0' + Math.floor((zong_sec % 60)) : Math.floor((zong_sec % 60));
    // let time = parseInt(d)+'天'+h%24+'小时'+m+'分'+s+'秒'
    let time = ''
    if (m < 1 && h < 1 && d < 1) {
      time = '刚刚'
    }else if (m>1 && m<60  && h < 1 && d < 1) {
      time = ~~m.toString()+'分钟前'
    }else if (h >= 1 && d < 1) {
      time = ~~h.toString()+'小时前'
    }else{
      title = ~~d.toString()+'天前'
    }
    return time
  }

  _renderPinglunFenge= () => (
      <View style={{left:ScreenUtils.scaleSize(750-633),width:ScreenUtils.scaleSize(633),height:ScreenUtils.scaleSize(0)}}></View>
  )

  _renderEmptyPinglun= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>暂无评论</Text>
      </View>
  )

  _renderPinglunItem(item){
    return (
             <View style={{backgroundColor:'white'}}>
                 <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(44)}}></View>
                 <View style={{width:ScreenUtils.scaleSize(696),left:ScreenUtils.scaleSize(32),height:ScreenUtils.scaleSize(84),flexDirection:'row',alignItems:'center'}}>
                   <Image source={{uri:item.head_portrait}} style={{width:ScreenUtils.scaleSize(84),height:ScreenUtils.scaleSize(84),borderRadius:ScreenUtils.scaleSize(42)}} />
                   <View style={{height:ScreenUtils.scaleSize(84),width:ScreenUtils.scaleSize(500),left:ScreenUtils.scaleSize(14)}}>
                     <Text style={{color:'#000000',fontSize:ScreenUtils.setSpText(9),fontWeight:'500'}}>{item.nickname}</Text>
                     <Text style={{color:'#989898',fontSize:ScreenUtils.setSpText(8),top:ScreenUtils.scaleSize(8)}}>{item.create_time.slice(0,10)}</Text>
                   </View>
                 </View>
                 <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10)}}></View>
                 <View style={{left:ScreenUtils.scaleSize(130),width:ScreenUtils.scaleSize(595)}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(9),width:ScreenUtils.scaleSize(595),color:'#434343'}}>{item.content}</Text>
                 </View>
                 <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20)}}></View>
                 <View style={{width:ScreenUtils.scaleSize(595),height:ScreenUtils.scaleSize(2),left:ScreenUtils.scaleSize(130),backgroundColor:'#EEEEEE'}}></View>
               </View>
           )
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
                    <View style={styles.AdvertisingRotation}>
                      <Swiper AdvertisingRotation dotStyle={{top:ScreenUtils.scaleSize(40)}} activeDotStyle={{top:ScreenUtils.scaleSize(40)}} activeDotColor='white' showsButtons={false} autoplay={true} autoplayTimeout='3'>
                        {this.renderAdvertisingImg()}
                      </Swiper>
                    </View>
                    <View style={{backgroundColor:'white'}}>
                      <View style={{height:ScreenUtils.scaleSize(35)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(696),left:ScreenUtils.scaleSize(27),fontWeight:'500'}}>{this.state.tweetsDetail.content}</Text>
                      <View style={{height:ScreenUtils.scaleSize(33)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#1caff1',width:ScreenUtils.scaleSize(696),left:ScreenUtils.scaleSize(27),fontWeight:'500'}}>{this.state.tweetsDetail.link_name}</Text>
                      <View style={{height:ScreenUtils.scaleSize(34)}}></View>
                      <View style={{left:ScreenUtils.scaleSize(27),width:ScreenUtils.scaleSize(696),flexDirection:'row',alignItems:'center'}}>
                         <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898',width:ScreenUtils.scaleSize(423)}}>发布时间：{this.pushTime(this.state.tweetsDetail.create_time)}</Text>
                         <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(27)}} source={require('../images/MenDian/tuiwen/yuedu.png')}/>
                         <View style={{width:ScreenUtils.scaleSize(10)}}></View>
                         <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898',width:ScreenUtils.scaleSize(110)}}>{this.state.tweetsDetail.view_time}</Text>
                         <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(36),height:ScreenUtils.scaleSize(37)}} source={require('../images/MenDian/tuiwen/like.png')}/>
                         <View style={{width:ScreenUtils.scaleSize(10)}}></View>
                         <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898',width:ScreenUtils.scaleSize(110)}}>{this.state.tweetsDetail.likes}</Text>
                      </View>
                      <View style={{width:ScreenUtils.scaleSize(10),height:ScreenUtils.scaleSize(39)}}></View>
                    </View>
                    <View style={{height:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(750)}}></View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(83),backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                      <Text style={{left:ScreenUtils.scaleSize(25),width:ScreenUtils.scaleSize(550),color:'#989898',fontSize:ScreenUtils.setSpText(8)}}>评论</Text>
                      <TouchableOpacity style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(83),flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>查看更多</Text>
                        <Image resizeMode={'stretch'} style={{left:ScreenUtils.scaleSize(15),width:ScreenUtils.scaleSize(16),height:ScreenUtils.scaleSize(28)}} source={require('../images/MenDian/tuiwen/more.png')}/>
                      </TouchableOpacity>
                    </View>
                    <FlatList 
                      style={{width:ScreenUtils.scaleSize(750)}}
                      data={this.state.commentList}
                      ListEmptyComponent={this._renderEmptyPinglun}
                      ItemSeparatorComponent={this._renderPinglunFenge}
                      renderItem={({item}) => this._renderPinglunItem(item)}
                      />
                  </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    AdvertisingRotation: {
        width:ScreenUtils.scaleSize(750),
        height:ScreenUtils.scaleSize(400),
    },
    AdvertisingImgStyle: {
      width:ScreenUtils.scaleSize(750),
      height:ScreenUtils.scaleSize(400),
    },
});