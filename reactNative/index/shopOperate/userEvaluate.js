import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    ScrollView,
    NativeModules,
    Platform,
    Alert,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import LeftNative from '../../PublicComponents/LeftNative';
import StarRating from 'react-native-star-rating';
import NetUtils from '../../PublicComponents/NetUtils';

export default class userEvaluate extends Component {

    constructor(props) {
    super(props);
    this.state = {
      title: '用户评价',
      businessID: '',
      operateType: '',
      evaluateList: '',
      statusBarHeight: 0,
      pageNum: 1,
      pageSize: 100,

    };
  }

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadBusinessID();
    this.loadOperateType();
    setTimeout(() => {
      if(this.state.operateType == 2 || this.state.operateType == 3){
        this.getEvaluate(3);
      }else{
        this.getEvaluate(2);
      }
    },200);
  }

  loadBusinessID(){
    storage.load({
        key: 'id',
        id: '1007'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({businessID:parseInt(ret)});
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

  getEvaluate(i){
    let params = "?user_business_info_id=" + this.state.businessID + '&user_member_id=0&goods_type=' + i + '&pageNum=' + this.state.pageNum + '&pageSize=' + this.state.pageSize;
    NetUtils.get('evaluate/pageGoodsEvaluateByParm', params, (result) => {
      console.log(result)
        this.setState({evaluateList:result.goodsEvaluateDTOList});
        if (result.goodsEvaluateDTOList == '') {
          Alert.alert('提示','暂无评价！');
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

  _renderItem(item){
    let pinglunHeight = 0;
      if (item.pictures == '') {
        pinglunHeight = 255;
      }
    return (
         <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(460-pinglunHeight),backgroundColor:'white'}}>
           <View style={{flexDirection:'row',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),justifyContent:'center',alignItems:'center'}}>
             <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.nickname}</Text>
             <Text style={{width:ScreenUtils.scaleSize(690/2),fontSize:ScreenUtils.setSpText(7),color:'black',textAlign:'right'}}>{item.create_time}</Text>
           </View>
           <View style={{flexDirection:'row',left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(40),alignItems:'center'}}>
             <StarRating
                starSize={16}
                containerStyle={{width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(40)}}
                disabled={false}
                maxStars={5}
                rating={item.score}
                fullStarColor={'orange'}
              />
           </View>
           <View style={{flexDirection:'row',left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(80),alignItems:'center'}}>
             <Text style={{width:ScreenUtils.scaleSize(690),color:'black'}}>{item.content}</Text>
           </View>
           {this.renderImage(item.pictures)}

         </View>
      );
  }

  // <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(30)}}></View>

  //          <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(230),backgroundColor:'#EEEEEE',borderRadius:ScreenUtils.scaleSize(10)}}>
  //            <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
  //              <Text style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(35),color:'black'}}>订单号： {item.order_num}</Text>
  //            </View>
  //            <View style={{left:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(650),height:ScreenUtils.scaleSize(150),alignItems:'center',flexDirection:'row'}}>
  //              <Image resizeMode={'stretch'} source={require('../images/shopSecond/shop_second_pinglunImg2.png')} style={{width:ScreenUtils.scaleSize(130),height:ScreenUtils.scaleSize(130)}}/>
  //              <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(460),height:ScreenUtils.scaleSize(130)}}>
  //                <Text style={{width:ScreenUtils.scaleSize(430),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(8),color:'black'}}></Text>
  //                <Text style={{width:ScreenUtils.scaleSize(430),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(6.5),color:'black'}}>订单时间： </Text>
  //                <Text style={{width:ScreenUtils.scaleSize(430),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(6.5),color:'black'}}>消费类型： </Text>
  //                <Text style={{width:ScreenUtils.scaleSize(430),height:ScreenUtils.scaleSize(40),fontSize:ScreenUtils.setSpText(7.5),color:'red'}}> ¥ </Text>
  //              </View>
  //            </View>
  //          </View>

  //          <View style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80)}}>
  //            <Button onPress={() => this._addCommodityPress(item)} style={{top:ScreenUtils.scaleSize(16),left:ScreenUtils.scaleSize(580),width:ScreenUtils.scaleSize(108),height:ScreenUtils.scaleSize(49),borderColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(40)}}>
  //               <Text style={{textAlign:'center',color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>回复</Text>
  //            </Button>
  //          </View>

  renderImage(pictures){
    if (pictures == '') {
      return (<View></View>)
    }else{
      let arr = pictures.split(',');
      return (
                <FlatList 
                        style={{width:ScreenUtils.scaleSize(710),top:ScreenUtils.scaleSize(30)}}
                        data={arr}
                        horizontal={true}
                        renderItem={({item}) => this.renderPinglunImage(item)}
                        ItemSeparatorComponent={this._renderpinglunImgFenge}
                      />
             )
    }
  }

  _renderpinglunImgFenge= () => (
    <View style={{width:ScreenUtils.scaleSize(10),height:ScreenUtils.scaleSize(240),backgroundColor:'white'}}></View>
  )

  renderPinglunImage(item){
    return (
      <Image
            source={{uri:item}}
            style={{height:ScreenUtils.scaleSize(225), width:ScreenUtils.scaleSize(225)}}/>
        );
    }

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderHeader= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(20),backgroundColor:'#EEEEEE'}}></View>
  )

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                  </View>

                    <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                      <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                        <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                      </TouchableOpacity>
                      <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(550),textAlign:'center'}}>{this.state.title}</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                    </View>

                  <FlatList
                    style={{backgroundColor:'#EEEEEE',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250*this.props.heightLine)}}
                    data={this.state.evaluateList}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
                    ListHeaderComponent={this._renderHeader}
                  />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
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
});