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
import NetUtils from '../../PublicComponents/NetUtils';

export default class tweetsList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '推文列表',
      statusBarHeight: 0,
      token: '',
      pageSize: 10,
      tweetsList: '',
      isRefresh: false,
      isLoadMore: false,
  };
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken()
    this.loadPushArticles()
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    this.loadPushArticles();
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

  _onRefresh(i){
    if (!this.state.isRefresh) {
      this.loadPushArticles();
    }
  }

  _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize});
      setTimeout(() => {
        this.loadPushArticles();
      },300);
    }
  }

  loadPushArticles(){
    setTimeout(() => {
        let params = '?token=' + this.state.token[1] + '&pageNum=1&pageSize=' + this.state.pageSize;
        NetUtils.get('pushArticles/businessPageList', params, (result) => {
            console.log(result)
            this.setState({tweetsList:result})
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

  _renderTweetsFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'white'}}></View>
  )

  _renderEmptyTweets= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>暂无推文</Text>
      </View>
  )

  _renderImgFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(696),height:ScreenUtils.scaleSize(20),backgroundColor:'white'}}></View>
  )

  _renderImgItem(item){
    return (
           <View style={{width:ScreenUtils.scaleSize(696/3),alignItems:'center'}}>
              <Image style={{width:ScreenUtils.scaleSize(217),height:ScreenUtils.scaleSize(217)}} source={{uri:item}} />
            </View>
           )
  }

  // pushTime(pushTime){
  //   console.log(11111)
  //   return '111'
  // }

  pushTime(pushTime){
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
      time = ~~d.toString()+'天前'
    }
    return time
  }

  deleteTweets(item){
    Alert.alert('提示','确定删除推文？',[{text:'确定',onPress:() => this.delete(item)},{text:'取消'}])
  }

  delete(item){
    let str = '?id='+item.id+'&token=' + this.state.token[1]
    NetUtils.postJson('pushArticles/delete','',str,(result) => {
      this.loadPushArticles()
    })
  }

  // lineHeight:ScreenUtils.scaleSize(35)
  _renderTweetsItem(item,navigate){
    let imgArr = item.content_img.split(',')
    return (
             <TouchableOpacity onPress={() => navigate('tweetsDetails',{id:item.id})} style={{width:ScreenUtils.scaleSize(750),backgroundColor:'white'}}>
               <View style={{height:ScreenUtils.scaleSize(35)}}></View>
               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#000000',width:ScreenUtils.scaleSize(696),left:ScreenUtils.scaleSize(27),fontWeight:'500'}}>{item.content}</Text>
               <View style={{height:ScreenUtils.scaleSize(33)}}></View>
               <Text style={{fontSize:ScreenUtils.setSpText(9),color:'#1caff1',width:ScreenUtils.scaleSize(696),left:ScreenUtils.scaleSize(27),fontWeight:'500'}}>{item.link_name}</Text>
               <View style={{height:ScreenUtils.scaleSize(34)}}></View>
               <FlatList 
                  style={{width:ScreenUtils.scaleSize(696),left:ScreenUtils.scaleSize(27)}}
                  data={imgArr}
                  numColumns={3}
                  ItemSeparatorComponent={this._renderImgFenge}
                  renderItem={({item}) => this._renderImgItem(item)}
                  />
                <View style={{height:ScreenUtils.scaleSize(43)}}></View>
                <View style={{left:ScreenUtils.scaleSize(27),width:ScreenUtils.scaleSize(696),flexDirection:'row',alignItems:'center'}}>
                   <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898',width:ScreenUtils.scaleSize(423)}}>发布时间：{this.pushTime(item.create_time)}</Text>
                   <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(27)}} source={require('../images/MenDian/tuiwen/yuedu.png')}/>
                   <View style={{width:ScreenUtils.scaleSize(10)}}></View>
                   <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898',width:ScreenUtils.scaleSize(110)}}>{item.view_time}</Text>
                   <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(36),height:ScreenUtils.scaleSize(37)}} source={require('../images/MenDian/tuiwen/like.png')}/>
                   <View style={{width:ScreenUtils.scaleSize(10)}}></View>
                   <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#989898'}}>{item.likes}</Text>
                </View>
                <View style={{height:ScreenUtils.scaleSize(43)}}></View>
                <View style={{left:ScreenUtils.scaleSize(27),width:ScreenUtils.scaleSize(696),flexDirection:'row',justifyContent:'flex-end'}}>
                  <View style={{width:ScreenUtils.scaleSize(279),height:ScreenUtils.scaleSize(62),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'#EEEEEE',flexDirection:'row'}}>
                    <TouchableOpacity style={{width:ScreenUtils.scaleSize(279/2),height:ScreenUtils.scaleSize(62),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} source={require('../images/MenDian/tuiwen/pinglun.png')}/>
                      <View style={{width:ScreenUtils.scaleSize(8)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#434343'}}>评论</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.deleteTweets(item)} style={{width:ScreenUtils.scaleSize(279/2),height:ScreenUtils.scaleSize(62),flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} source={require('../images/MenDian/tuiwen/shanchu.png')}/>
                      <View style={{width:ScreenUtils.scaleSize(8)}}></View>
                      <Text style={{fontSize:ScreenUtils.setSpText(8),color:'#434343'}}>删除</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{height:ScreenUtils.scaleSize(28)}}></View>
             </TouchableOpacity>
           )
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
                      <TouchableOpacity onPress={() => navigate('tweetsAdd')} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'flex-end',justifyContent:'center'}}>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(39),height:ScreenUtils.scaleSize(39)}} source={require('../images/MenDian/tuiwen/add.png')}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>
                    <FlatList 
                            style={{backgroundColor:'#EEEEEE'}}
                            data={this.state.tweetsList}
                            ListEmptyComponent={this._renderEmptyTweets}
                            ItemSeparatorComponent={this._renderTweetsFenge}
                            renderItem={({item}) => this._renderTweetsItem(item,navigate)}
                            onRefresh={() => this._onRefresh(this.state.orderTab)}
                            refreshing={this.state.isRefresh}
                            onEndReached={() => this._onLoadMore(this.state.orderTab)}
                            onEndReachedThreshold={0.1}
                            />

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