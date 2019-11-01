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

export default class skuSetting extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '商品规格',
      statusBarHeight: 0,
      token: '',
      pageSize: 10,
      skuList: '',
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
        let params = '?token=' + this.state.token[1]
        NetUtils.get('business/physicalGoodsSpecificationsList', params, (result) => {
            console.log(result)
            this.setState({skuList:result})
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
        <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>暂无规格，请添加</Text>
      </View>
  )

  _renderSkuListItem(item,navigate){
    return (
             <TouchableOpacity onPress={() => navigate('skuAdd',{id:item.id})} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),backgroundColor:'white',justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
               <Text style={{width:ScreenUtils.scaleSize(335),fontSize:ScreenUtils.setSpText(9),color:'black'}}>{item.param_name}</Text>
               <TouchableOpacity style={{width:ScreenUtils.scaleSize(335),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'flex-end'}}>
                 <Image source={require('../images/more.png')} style={{width:ScreenUtils.scaleSize(16),height:ScreenUtils.scaleSize(28)}} />
               </TouchableOpacity>
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
                      <TouchableOpacity onPress={() => navigate('skuAdd',{id:0})} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'flex-end',justifyContent:'center'}}>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(39),height:ScreenUtils.scaleSize(39)}} source={require('../images/MenDian/tuiwen/add.png')}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>
                    <FlatList 
                            style={{backgroundColor:'#EEEEEE'}}
                            data={this.state.skuList}
                            ListEmptyComponent={this._renderEmptyTweets}
                            ItemSeparatorComponent={this._renderTweetsFenge}
                            renderItem={({item}) => this._renderSkuListItem(item,navigate)}
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