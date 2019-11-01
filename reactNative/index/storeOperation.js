import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
    FlatList,
    NativeModules,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import ScreenUtils from '../PublicComponents/ScreenUtils';
import NetUtils from '../PublicComponents/NetUtils';

var btnArray = [{title:'商品管理',img:require('./images/MenDian/commodity.png')},{title:'消息中心',img:require('./images/MenDian/message.png')},{title:'用户评价',img:require('./images/MenDian/pingjia.png')},{title:'二维码管理',img:require('./images/MenDian/qrcode.png')},{title:'财务对账',img:require('./images/MenDian/caiwu.png')},{title:'推文列表',img:require('./images/MenDian/tuiwen.png')},{title:'规格设置',img:require('./images/MenDian/guige.png')},{title:'商品属性',img:require('./images/MenDian/shuxing.png')}];

export default class storeOperation extends Component {

    constructor(props) {
        super(props);
        this.state = {
          title: '门店运营',
          nextStepValue: '', 
          businessIcon: '',
          orderTab: 0,
          statusBarHeight: 0,
          phone: '',
          token: '',
          totalMoney: '',
          totalNum: '',
          };
      }

  updateFinancial(){
    setTimeout(() => {
        let params = "?mobile=" + this.state.phone +'&token=' + this.state.token[1];
        NetUtils.get('business/storeOperation', params, (result) => {
            // alert(JSON.stringify(result))
            this.setState({totalNum:result.totalNum});
            this.setState({totalMoney:result.totalMoney});
        });
    },200);
  }

  loadPhone(){
    storage.load({
        key: 'phone',
        id: '1005'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({phone:ret});
        // alert('aaa'+searchHistory[0]);
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

  loadIsTakeaway(){
    storage.load({
        key: 'isTakeaway',
        id: '1011'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        console.log(ret)
        if (ret == 'true') {
          if (btnArray[btnArray.length-1].title != '餐座号设置'){
            btnArray.push({title:'餐座号设置',img:require('./images/MenDian/zuohao.png')})
          }
        }else{
          if (btnArray[btnArray.length-1].title == '餐座号设置') {
            btnArray.splice(btnArray.length-1,1)
          }
        }
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

   componentWillUnmount(){
     this.deEmitter.remove();
  };

  componentDidMount(){
    this.deEmitter = DeviceEventEmitter.addListener('storeOperationListener', (a) => {
        this.loadPhone();
        this.loadToken();
        this.loadIsTakeaway()
        setTimeout(() => {
            this.updateFinancial();
        },300);
    });
    this.loadIsTakeaway()
    this.setStatusBarHeight();
    this.loadToken();
    this.loadPhone();
    this.updateFinancial();
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

      _btnPress(item){
        let nextViewStr = '';
        const { navigate } = this.props.navigation;
        if (item == '商品管理') {
          nextViewStr = 'commodityManagement';
        }else if(item == '消息中心'){
          nextViewStr =  'messageCenter';
        }else if(item == '优惠券管理'){
          nextViewStr =  '';
        }else if(item == '活动管理'){
          nextViewStr =  '';
        }else if(item == '用户评价'){
          nextViewStr =  'userEvaluate';
        }else if(item == '二维码管理'){
          nextViewStr =  'qrCodeManagement';
        }else if(item == '财务对账'){
          nextViewStr =  'financialReconciliation';
        }else if(item == '经营数据'){
          nextViewStr =  '';
        }else if (item == '推文列表') {
          nextViewStr =  'tweetsList';
        }else if (item == '餐座号设置') {
          nextViewStr =  'restaurantNumList';
        }else if (item == '规格设置') {
          nextViewStr =  'skuSetting';
        }else if (item == '商品属性') {
          nextViewStr =  'labelSetting';
        }
        navigate(nextViewStr);
      }

      _renderBtnItem(item){
        return (
              <TouchableOpacity onPress={() => this._btnPress(item.title)} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(94),alignItems:'center',flexDirection:'row',backgroundColor:'white',borderBottomColor:'#EEEEEE',borderBottomWidth:1}}>
                <Image style={{resizeMode:'stretch',width:ScreenUtils.scaleSize(70),height:ScreenUtils.scaleSize(70),left:ScreenUtils.scaleSize(22)}} source={item.img}/>
                <Text style={{left:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(450),color:'black'}}>{item.title}</Text>
                <Image style={{left:ScreenUtils.scaleSize(170),resizeMode:'stretch',width:ScreenUtils.scaleSize(16),height:ScreenUtils.scaleSize(28)}} source={require('./images/Home/Order/more.png')}/>
              </TouchableOpacity>
            );
      }

    render() {
      const { navigate } = this.props.navigation;
        return (
            <ScrollView style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'#F3A50E',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(192),flexDirection:'row'}}>
                      <View style={{flex:1}}>
                        <Text style={{textAlign:'center',top:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(375),color:'white',fontSize:ScreenUtils.setSpText(11),fontWeight:'bold'}}>¥ {this.state.totalMoney}</Text>
                        <Text style={{textAlign:'center',top:ScreenUtils.scaleSize(75),width:ScreenUtils.scaleSize(375),color:'white',fontSize:ScreenUtils.setSpText(9)}}>今日订单收入/元</Text>
                      </View>
                      <View style={{flex:1}}>
                        <Text style={{textAlign:'center',top:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(375),color:'white',fontSize:ScreenUtils.setSpText(11),fontWeight:'bold'}}>{this.state.totalNum}</Text>
                        <Text style={{textAlign:'center',top:ScreenUtils.scaleSize(75),width:ScreenUtils.scaleSize(375),color:'white',fontSize:ScreenUtils.setSpText(9)}}>今日订单/单</Text>
                      </View>
                    </View>

                    <FlatList 
                        style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100*btnArray.length)}}
                        data={btnArray}
                        renderItem={({item}) => this._renderBtnItem(item)}
                    />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    button: {
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
    }
});