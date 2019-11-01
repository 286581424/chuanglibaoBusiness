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

export default class restaurantNumList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '餐座号列表',
      statusBarHeight: 0,
      token: '',
      pageSize: 10,
      restaurantNumList: '',
      isRefresh: false,
      isLoadMore: false,
    };
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadToken()
    this.loadRestaurantNum()
  }

  componentWillReceiveProps(nextProps){
    const { params } = nextProps.navigation.state;
    this.loadRestaurantNum();
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
      this.loadRestaurantNum();
    }
  }

  _onLoadMore(i){
    if (!this.state.isLoadMore) {
      let pageSize = this.state.pageSize;
      pageSize += 10;
      this.setState({pageSize:pageSize});
      setTimeout(() => {
        this.loadRestaurantNum();
      },300);
    }
  }

  loadRestaurantNum(){
    setTimeout(() => {
        let params = '?token=' + this.state.token[1]
        NetUtils.get('business/tableNumberList', params, (result) => {
            console.log(result)
            this.setState({restaurantNumList:result})
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
        <Text style={{color:'black',fontSize:ScreenUtils.setSpText(9)}}>暂无餐座号信息,请添加</Text>
      </View>
  )

  restaurantNumChange(value,item){
    let restaurantNumList = this.state.restaurantNumList
    let i = restaurantNumList.indexOf(item)
    restaurantNumList.splice(i,1,{key:'add',value:value})
    this.setState({restaurantNumList:restaurantNumList})
  }

  delete(item){
    if (item.key == 'add') {
      let restaurantNumList = this.state.restaurantNumList
      let i = restaurantNumList.indexOf(item)
      restaurantNumList.splice(i,1)
      this.setState({restaurantNumList:restaurantNumList})
    }else{
      Alert.alert('提示','确定删除',[{text:'确定',onPress:() => this.deleteSure(item.id)},{text:'取消'}])
    }
  }

  deleteSure(id){
    let params = '?token=' + this.state.token[1] + '&id=' + id
    NetUtils.get('business/delTableNum', params, (result) => {
        this.loadRestaurantNum()
    });
  }

  getFous(item){
      if (Platform.OS === 'ios') {
        setTimeout(() => {
          let listHeight = ScreenUtils.scaleSize(100) * this.state.restaurantNumList.length
          let ViewHeight = ScreenUtils.getHeight() - ScreenUtils.scaleSize(88)
          if (listHeight > ViewHeight/2) {
            let i = this.state.restaurantNumList.indexOf(item)
            this.numberListView.scrollToIndex({ viewPosition: 0, index: i-3 });
          }
        },200);
      }
    }

  _renderTweetsItem(item,navigate){
    if (item.key == 'add') {
      return (
             <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
               <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(60),borderRadius:ScreenUtils.scaleSize(10),alignItems:'center',left:ScreenUtils.scaleSize(30),borderColor:'#EEEEEE',borderWidth:1}}>
                 <TextInput
                    maxLength={16}
                    placeholder='请输入餐座号'
                    placeholderTextColor='gray'
                    autoCorrect={false}
                    onFocus={() => this.getFous(item)}
                    style={{color:'black',width:ScreenUtils.scaleSize(550),height:ScreenUtils.scaleSize(60),padding:0}}
                    onChangeText={(value) => this.restaurantNumChange(value,item)}
                    value={item.value}
                    underlineColorAndroid='transparent'
                  />
               </View>
               <TouchableOpacity onPress={() => this.delete(item)} style={{width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(70),left:ScreenUtils.scaleSize(30),justifyContent:'center',alignItems:'center'}}>
                 <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} source={require('../images/MenDian/tuiwen/shanchu.png')}/>
               </TouchableOpacity>
             </View>
           )
     }else{
      return (
             <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row',alignItems:'center',backgroundColor:'white'}}>
               <View style={{width:ScreenUtils.scaleSize(600),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center',left:ScreenUtils.scaleSize(30)}}>
                 <Text style={{width:ScreenUtils.scaleSize(550),color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item.table_number}</Text>
               </View>
               <TouchableOpacity onPress={() => this.delete(item)} style={{width:ScreenUtils.scaleSize(90),height:ScreenUtils.scaleSize(70),left:ScreenUtils.scaleSize(30),justifyContent:'center',alignItems:'center'}}>
                 <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(35),height:ScreenUtils.scaleSize(35)}} source={require('../images/MenDian/tuiwen/shanchu.png')}/>
               </TouchableOpacity>
             </View>
           )
     }
  }

  //添加
  addNum(){
    let restaurantNumList = this.state.restaurantNumList
    restaurantNumList.push({key:'add',value:''})
    this.setState({restaurantNumList:restaurantNumList})
  }

  //提交
  addPush(){
    let restaurantNumList = this.state.restaurantNumList
    let addList = []
    for(let a of restaurantNumList){
      if (a.key == 'add' && a.value != '') {
          addList.push(a.value)
      }
    }
    this.setState({restaurantNumList:[]})
    if (addList.length == 0) {
      return
    }
    let str = '?token=' + this.state.token[1] + '&tableNum=' + addList
    NetUtils.postJson('business/tableNumber','',str,(result) => {
      this.loadRestaurantNum()
      Alert.alert('提示','添加成功',[{text:'确定'}])
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
                      <TouchableOpacity onPress={() => this.addNum()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'flex-end',justifyContent:'center'}}>
                        <Image resizeMode={'stretch'} style={{width:ScreenUtils.scaleSize(39),height:ScreenUtils.scaleSize(39)}} source={require('../images/MenDian/tuiwen/add.png')}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>
                    <FlatList
                            ref={(ref) => { this.numberListView = ref }}
                            data={this.state.restaurantNumList}
                            extraData={this.state}
                            ItemSeparatorComponent={this._renderTweetsFenge}
                            renderItem={({item}) => this._renderTweetsItem(item,navigate)}
                            />

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'white'}}>
                    <Button onPress={() => this.addPush()} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                      <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>提交</Text>
                    </Button>
                  </View>

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