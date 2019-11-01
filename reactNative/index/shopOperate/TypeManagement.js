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
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DraggableView from '../../PublicComponents/DraggableView';
import NetUtils from '../../PublicComponents/NetUtils';
import DragSortableView from 'react-native-drag-sort'
var typeArr = [
                {type:'代金券',number:'9'},
                {type:'团购券',number:'7'},
                {type:'团购券',number:'7'},
              ];

export default class TypeManagement extends Component {

    constructor(props) {
    super(props);
    this.state = {
      title: '分类管理',
      couponGoodsTypeList: [],
      businessID: 0,
      operateType: 0,
      token: '',
      phone: '',
      statusBarHeight: 0,
      isSort: false,
  };
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

  loadOperateType(){
    storage.load({
        key: 'operateType',
        id: '1006'
      }).then(ret => {
        // 如果找到数据，则在then方法中返回
        this.setState({operateType:parseInt(ret)});
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
    this.loadOperateType();
    this.loadPhone();
    this.loadToken();
    setTimeout(() => {
      console.log(this.state.operateType)
      if (this.state.operateType == 1) {
        let params = "?user_business_info_id=" + this.state.businessID;
        NetUtils.get('physicalGoods/getPhysicalGoodsTypeByBusinessId', params, (result) => {
          console.log(111111)
          if (result.physicalGoodsTypeList != null) {
            this.setState({couponGoodsTypeList:result.physicalGoodsTypeList});
          }else{
            this.setState({couponGoodsTypeList:[]});
          }
        });
      }else{
        console.log(22222)
        let params = "?user_business_info_id="+this.state.businessID+'&mobile='+this.state.phone+'&token='+this.state.token[1];
        NetUtils.get('couponGoods/getCouponGoodsTypeByBusinessId', params, (result) => {
          this.setState({couponGoodsTypeList:result.couponGoodsTypeList});
        });
      }
    },400);
  }

  componentWillReceiveProps(){
    if (this.state.operateType ==1) {
        let params = "?user_business_info_id=" + this.state.businessID;
        NetUtils.get('physicalGoods/getPhysicalGoodsTypeByBusinessId', params, (result) => {
            this.setState({couponGoodsTypeList:result.physicalGoodsTypeList});
        });
      }else{
        let params = "?user_business_info_id="+this.state.businessID+'&mobile='+this.state.phone+'&token='+this.state.token[1];
        NetUtils.get('couponGoods/getCouponGoodsTypeByBusinessId', params, (result) => {
            this.setState({couponGoodsTypeList:result.couponGoodsTypeList});
        });
      }
  }

  _addTypeBtn(navigate){
    navigate('editType',{typeInfo:null});
  }

  _editorTypePress(navigate,item){
    navigate('editType',{typeInfo:item});
  }

  _addCommodityPress(navigate,item){
    navigate('commodityEditor',{key:'add',couponGoodsTypeList:this.state.couponGoodsTypeList});
  }

  _renderTypeView(item,i){
    const { navigate } = this.props.navigation;
    return (
            <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150),backgroundColor:'white',borderBottomColor:'#EEEEEE',borderBottomWidth:1,flexDirection:'row',alignItems:'center'}}>
              <View style={{left:ScreenUtils.scaleSize(60),width:ScreenUtils.scaleSize(260),height:ScreenUtils.scaleSize(110),justifyContent:'center'}}>
                <Text style={{width:ScreenUtils.scaleSize(200),fontSize:ScreenUtils.setSpText(9),color:'black'}}>{item.name}</Text>
              </View>
              <View style={{left:ScreenUtils.scaleSize(170),width:ScreenUtils.scaleSize(290),height:ScreenUtils.scaleSize(80),flexDirection:'row'}}>
                <Button onPress={() => this._editorTypePress(navigate,item)} style={{top:ScreenUtils.scaleSize(9),width:ScreenUtils.scaleSize(108),height:ScreenUtils.scaleSize(49),borderColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(40)}}>
                  <Text style={{textAlign:'center',color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>编辑</Text>
                </Button>
                <Button onPress={() => this._addCommodityPress(navigate,item)} style={{left:ScreenUtils.scaleSize(50),top:ScreenUtils.scaleSize(9),width:ScreenUtils.scaleSize(134),height:ScreenUtils.scaleSize(49),borderColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(40)}}>
                  <Text style={{textAlign:'center',color:'#F3A50E',fontSize:ScreenUtils.setSpText(7)}}>添加商品</Text>
                </Button>
              </View>
            </View>
          );
  }

  sortOnChange(data,nowIndex,chooseIndex){
    console.log(data)
    this.setState({couponGoodsTypeList:data})
    let couponGoodsTypeList = this.state.couponGoodsTypeList
    let flag = 0
    if (nowIndex > chooseIndex) {
      flag = 1
    }
    let begin = couponGoodsTypeList[chooseIndex].id
    let end = couponGoodsTypeList[nowIndex].id
    console.log(begin+','+end)
    let params = "?token=" + this.state.token[1] + '&flag=0' + flag + '&begin=' + begin + '&end=' + end;
    NetUtils.get('physicalGoods/sortGoodsType', params, (result) => {
      console.log(result)
    });
  }

  renderView(){
    if (this.state.isSort) {
      return (
               <View style={{flex:1}}>
                    <ScrollView >
                      <DragSortableView
                        dataSource={this.state.couponGoodsTypeList}
                        parentWidth={ScreenUtils.scaleSize(750)}
                        childrenWidth= {ScreenUtils.scaleSize(750)}
                        childrenHeight={ScreenUtils.scaleSize(150)}
                        onDataChange = {(data,nowIndex,chooseIndex)=> this.sortOnChange(data,nowIndex,chooseIndex)}
                        renderItem={(item,index)=>{
                            return this._renderTypeView(item,index)
                        }}/>
                    </ScrollView>
                    <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center'}}>
                      <Text style={{color:'black',fontSize:ScreenUtils.setSpText(8)}}>长按即可拖拽排序</Text>
                    </View>
               </View>
             )
    }else{
      return (
               <ScrollView style={{width:ScreenUtils.scaleSize(750),backgroundColor:'#EEEEEE'}}>
                  {this.state.couponGoodsTypeList.map((item,i) => this._renderTypeView(item,i))}
               </ScrollView>
             )
    }
  }

  saveSort(){
    this.setState({isSort:false})
  }

  renderBtn(navigate){
    if (this.state.isSort) {
      return (
               <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                  <Button onPress={() => this.saveSort()} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>保存</Text>
                  </Button>
                </View>
             )
    }else{
      return (
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                  <Button onPress={() => this._addTypeBtn(navigate)} style={{width:ScreenUtils.scaleSize(374),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>新增分类</Text>
                  </Button>
                  <View style={{height:ScreenUtils.scaleSize(100),width:ScreenUtils.scaleSize(2),backgroundColor:'white'}}></View>
                  <Button onPress={() => this.setState({isSort:true})} style={{width:ScreenUtils.scaleSize(374),height:ScreenUtils.scaleSize(100),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:0}}>
                    <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>排序</Text>
                  </Button>
                </View>
             )
    }
  }

    render() {
      const { navigate,goBack } = this.props.navigation;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),backgroundColor:'#F3A50E',alignItems:'center'}}>
                  <TouchableOpacity onPress={() => navigate('commodityManagement',{key:'success'})} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                    <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                  </TouchableOpacity>
                  <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                  <TouchableOpacity style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),alignItems:'center'}}>
                    <Text style={{top:ScreenUtils.scaleSize(7),fontSize:ScreenUtils.setSpText(8),width:ScreenUtils.scaleSize(150),textAlign:'center',color:'black'}}></Text>
                  </TouchableOpacity>
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                </View>
                <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}>
                </View>

                {this.renderView()}

                {this.renderBtn(navigate)}
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
    item: {
        flexDirection: 'row',
        backgroundColor:'yellow',
        height: ScreenUtils.scaleSize(49),
        width: ScreenUtils.scaleSize(750),
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 1,
        position: 'absolute',
    },
});