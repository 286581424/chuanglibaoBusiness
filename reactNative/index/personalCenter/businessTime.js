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
  Modal,
  TouchableHighlight,
  NativeModules,
} from 'react-native';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../../PublicComponents/ScreenUtils';
import Picker from 'react-native-picker';
import Swipeout from 'react-native-swipeout';
import CheckBox from 'react-native-checkbox';
import NetUtils from '../../PublicComponents/NetUtils';

var checkboxDaysArr = ['周一','周二','周三','周四','周五','周六','周日'];

export default class businessTime extends Component {
    constructor(props) {
    super(props);
    this.state = {
      title: '营业时间修改',
      show:false,
      tabTitleIndex: 0,
      daysText: '每天',
      chooseDays: ['每天'],
      everyDayBox: true,
      MondayBox: false,
      TuesdayBox: false,
      WednesdayBox: false,
      ThursdayBox: false,
      FridayBox: false,
      SaturdayBox: false,
      SundayBox: false,
      businessTimes: [
                        {startTime:'09 : 00',endTime:'21 : 00'},
                     ],
      timeData: [],
      shopInfo: '',
      businessID: '',
      mobile: '',
      statusBarHeight: 0,
     };
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

  componentDidMount(){
    this.setStatusBarHeight();
    this.loadMobile();
    this.loadBusinessID();
    if (this.props.navigation.state.params.businessTime != null) {
        let result = this.props.navigation.state.params.businessTime;
        let arr = result.split('  ');
        this.setState({daysText:arr[0]});
        this.setState({chooseDays:arr[0].split(',')});
        let timeArr = arr[1].split('-');
        this.setState({businessTimes:[{startTime:timeArr[0],endTime:timeArr[1]}]});
    }
    let hourArr = [];
    let minuteArr = [];
    let firData = [];
    let secData = [];
    for(let i=0;i<24;i++){
      if (i < 10) {
        hourArr.push('0'+i);
      }else{
        hourArr.push(i);
      }
    }
    for (var i=0;i<60;i+=5) {
      if (i < 10) {
        minuteArr.push('0'+i);
      }else{
        minuteArr.push(i);
      }
    }
    for (let h of hourArr) {
      for(let m of minuteArr){
        firData.push(h+' : '+m);
        secData.push(h+' : '+m);
      }
    }
    secData.splice(0,1);
    secData.push('00 : 00');
    this.setState({timeData:[firData,secData]});
  }

  _hiddenModelPress(){
    this._setModalVisible();
  }
 
  // 显示/隐藏 modal
  _setModalVisible() {
    let isShow = this.state.show;
    this.setState({
      show:!isShow,
    });
  }

  _saveBtnPress(navigate,params){
    if (this.state.daysText != null && this.state.businessTimes != null) {
      let resultStr = this.state.daysText + '  ' +this.state.businessTimes[0].startTime + '-' + this.state.businessTimes[0].endTime;
      if (params.key == 'shopSeting' || params.key == 'businessState') {
        let shopInfoStr = {id:this.state.businessID,mobile:this.state.mobile,business_hours:resultStr};
         NetUtils.postJson('business/updateBusiness',shopInfoStr,'',(result) => {
            navigate(params.key,{businessTime:resultStr});
         });
       }else{
          navigate(params.key,{businessTime:resultStr});
       }
     }else if (this.state.daysText == '') {
       Alert.alert('提示','请选择每周营业日');
     }else{
       Alert.alert('提示','请选择营业时间');
     }
  }

  _deleteBtnPress(item,i){
    let array = this.state.businessTimes;
    array.splice(i,1);
    this.setState({businessTimes:array});
  }

  _addTimeBtnPress(){
    let a = {startTime:'开始时间',endTime:'结束时间'};
    let array = this.state.businessTimes;
    if (array.length >=1 ) {
      Alert.alert('提示','最多新增1个');
    }else{
      array.push(a);
      this.setState({businessTimes:array});
    }
  }

  _showTimePickerPress(item,i){
    Picker.init({
            pickerData: this.state.timeData,
            pickerConfirmBtnText:'确认',
            pickerCancelBtnText:'取消',
            pickerTitleText:'',
            selectedValue: [item.startTime,item.endTime],
            onPickerConfirm: data => {
                let a = {startTime:data[0],endTime:data[1]};
                let arr = this.state.businessTimes;
                arr.splice(i,1,a);
                this.setState({businessTimes:arr});
            },
            onPickerCancel: data => {
            },
            onPickerSelect: data => {
            }
        });
        Picker.show();
  }

  _showCheckBoxPress(){
    for(let i of this.state.chooseDays){
      if (i == '每天') {
        this.setState({everyDayBox:true});
        this.setState({MondayBox:false});
        this.setState({TuesdayBox:false});
        this.setState({WednesdayBox:false});
        this.setState({ThursdayBox:false});
        this.setState({FridayBox:false});
        this.setState({SaturdayBox:false});
        this.setState({SundayBox:false});
        break;
      }
      if (i == '周一') {
        this.setState({MondayBox:true});
      }
      if (i == '周二') {
        this.setState({TuesdayBox:true});
      }
      if (i == '周三') {
        this.setState({WednesdayBox:true});
      }
      if (i == '周四') {
        this.setState({ThursdayBox:true});
      }
      if (i == '周五') {
        this.setState({FridayBox:true});
      }
      if (i == '周六') {
        this.setState({SaturdayBox:true});
      }
      if (i == '周日') {
        this.setState({SundayBox:true});
      }
    }
    this._setModalVisible();
  }

  _checkBoxSurePress(){
    this._setModalVisible();
    let array = [];
    let txt = '';
    if (this.state.everyDayBox) {
      array.push('每天');
      this.setState({chooseDays:array});
      this.setState({daysText:'每天'});
      return;
    }
    if (this.state.MondayBox && this.state.TuesdayBox && this.state.WednesdayBox && this.state.TuesdayBox && this.state.FridayBox && this.state.SaturdayBox && this.state.SundayBox) {
      array.push('每天');
      this.setState({chooseDays:array});
      this.setState({daysText:'每天'});
      return;
    }
    if (this.state.MondayBox) {
      array.push('周一');
    }
    if (this.state.TuesdayBox) {
      array.push('周二');
    }
    if (this.state.WednesdayBox) {
      array.push('周三');
    }
    if (this.state.ThursdayBox) {
      array.push('周四');
    }
    if (this.state.FridayBox) {
      array.push('周五');
    }
    if (this.state.SaturdayBox) {
      array.push('周六');
    }
    if (this.state.SundayBox) {
      array.push('周日');
    }
    for(var i of array){
      txt += i+',';
    }
    txt = txt.substring(0,txt.length-1);
    this.setState({daysText:txt});
    this.setState({chooseDays:array});
  }

  _checkBoxPress(item){
    switch(item){
      case '每天' :
         this.setState({everyDayBox:!this.state.everyDayBox});
         break;
      case '周一' :
         this.setState({MondayBox:!this.state.MondayBox});
         break;
      case '周二' :
         this.setState({TuesdayBox:!this.state.TuesdayBox});
         break;
      case '周三' :
         this.setState({WednesdayBox:!this.state.WednesdayBox});
         break;
      case '周四' :
         this.setState({ThursdayBox:!this.state.ThursdayBox});
         break;
      case '周五' :
         this.setState({FridayBox:!this.state.FridayBox});
         break;
      case '周六' :
         this.setState({SaturdayBox:!this.state.SaturdayBox});
         break;
      case '周日' :
         this.setState({SundayBox:!this.state.SundayBox});
         break;
    }
  }

  _renderCheckboxView(item,i){
    let daysBox = false;
    switch(i){
      case 0:
         daysBox = this.state.MondayBox;
         break;
      case 1:
         daysBox = this.state.TuesdayBox;
         break;
      case 2:
         daysBox = this.state.WednesdayBox;
         break;
      case 3:
         daysBox = this.state.ThursdayBox;
         break;
      case 4:
         daysBox = this.state.FridayBox;
         break;
      case 5:
         daysBox = this.state.SaturdayBox;
         break;
      case 6:
         daysBox = this.state.SundayBox;
         break;
    }
    if (i < 4) {
      return (
             <View style={{width:ScreenUtils.scaleSize(690/4),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
               <CheckBox
                  label={item}
                  checked={daysBox}
                  checkboxStyle={{width:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(40)}}
                  onChange={() => this._checkBoxPress(item)}
                />
             </View>
           );
    }else{
      return (
             <View style={{top:ScreenUtils.scaleSize(80),left:-ScreenUtils.scaleSize(690),width:ScreenUtils.scaleSize(690/4),height:ScreenUtils.scaleSize(80),alignItems:'center',justifyContent:'center'}}>
               <CheckBox
                  label={item}
                  checked={daysBox}
                  checkboxStyle={{width:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(40)}}
                  onChange={() => this._checkBoxPress(item)}
                />
             </View>
           );
    }
  }

  _renderBusinessTimeView(item,i){
      var swipeoutBtns = [
        {
          text: '删除',
          backgroundColor:'red',
          color: 'white',
          onPress: () => this._deleteBtnPress(item,i),
        }
      ];
    return (
            <Swipeout right={swipeoutBtns}>
              <TouchableOpacity onPress={() => this._showTimePickerPress(item,i)} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(80),justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                <Text style={{width:ScreenUtils.scaleSize(690),color:'#fea712',fontSize:ScreenUtils.setSpText(8),fontWeight:'bold',textAlign:'center'}}>{item.startTime}  ——  {item.endTime}</Text>
              </TouchableOpacity>
            </Swipeout>
           ); 
  }

    render() {
      const { navigate,goBack,state } = this.props.navigation;
      const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='transparent'/>

                <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(this.state.statusBarHeight),backgroundColor:'#F3A50E'}}>
                </View>

                  <View style={{backgroundColor:'white',flexDirection:'row',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(88),alignItems:'center',backgroundColor:'#F3A50E'}}>
                    <TouchableOpacity onPress={() => goBack()} style={{width:ScreenUtils.scaleSize(100),height:ScreenUtils.scaleSize(50),justifyContent:'center',alignItems:'center'}}>
                      <Image resizeMode={'stretch'} style={{top:ScreenUtils.scaleSize(5.5),width:ScreenUtils.scaleSize(19),height:ScreenUtils.scaleSize(36)}} source={require('../../login/images/login_back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'white',fontSize:ScreenUtils.setSpText(10),left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(450),textAlign:'center'}}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this._saveBtnPress(navigate,params)} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(50),justifyContent:'center'}}>
                      <Text style={{color:'white',textAlign:'right',left:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(100),fontSize:ScreenUtils.setSpText(8)}}>保存</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#F3A50E'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(130),alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(60),justifyContent:'center'}}>
                      <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black'}}>请选择每周营业日</Text>
                    </View>
                    <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(70),alignItems:'center',flexDirection:'row'}}>
                      <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(510),color:'#fea712',fontSize:ScreenUtils.setSpText(9),fontWeight:'bold'}}>{this.state.daysText}</Text>
                      <TouchableOpacity onPress={() => this._showCheckBoxPress()} style={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(60),alignItems:'flex-end',justifyContent:'center'}}>
                        <Image style={{resizeMode:'stretch',width:ScreenUtils.scaleSize(13*1.5),height:ScreenUtils.scaleSize(23*1.5)}} source={require('../images/shopSecond/shop_second_more.png')}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(10),backgroundColor:'#EEEEEE'}}>
                  </View>

                  <View style={{backgroundColor:'white',width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(70),alignItems:'center',justifyContent:'center'}}>
                    <Text style={{width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black'}}>请设置营业时间段</Text>
                  </View>

                  <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}>
                  </View>

                  {this.state.businessTimes.map((item,i) => this._renderBusinessTimeView(item,i))}

                  <View style={{top:ScreenUtils.scaleSize(50),width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100),backgroundColor:'#EEEEEE'}}>
                    <Button onPress={() => this._addTimeBtnPress()} style={{left:ScreenUtils.scaleSize(30),top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                        <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>新增营业时间</Text>
                     </Button>
                  </View>

                  <Modal
                       animationType='slide'
                       transparent={true}
                       visible={this.state.show}
                       onShow={() => {}}
                       onRequestClose={() => {}} >
                       <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight(),backgroundColor:'transparent'}}>
                         <TouchableOpacity onPress={() => this._hiddenModelPress()} style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.getHeight()-ScreenUtils.scaleSize(400)}}>
                         </TouchableOpacity>
                         <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(400),alignItems:'center',backgroundColor:'white'}}>
                           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(80),flexDirection:'row'}}>
                             <Button onPress={() => this._hiddenModelPress()} style={{top:ScreenUtils.scaleSize(10),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(60),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                                <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>取消</Text>
                             </Button>
                             <Button onPress={() => this._checkBoxSurePress()} style={{top:ScreenUtils.scaleSize(10),left:ScreenUtils.scaleSize(350),width:ScreenUtils.scaleSize(170),height:ScreenUtils.scaleSize(60),borderColor:'transparent',backgroundColor:'#F3A50E',borderRadius:ScreenUtils.scaleSize(750)/70}}>
                                <Text style={{textAlign:'center',color:'white',fontSize:ScreenUtils.setSpText(8)}}>确定</Text>
                             </Button>
                           </View>

                           <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(2),backgroundColor:'#EEEEEE'}}></View>

                           <View style={{width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(100),justifyContent:'center'}}>
                             <View style={{width:ScreenUtils.scaleSize(690/4),height:ScreenUtils.scaleSize(60),alignItems:'center',justifyContent:'center'}}>
                               <CheckBox
                                  label='每天'
                                  checked={this.state.everyDayBox}
                                  checkboxStyle={{width:ScreenUtils.scaleSize(40),height:ScreenUtils.scaleSize(40)}}
                                  onChange={() => this._checkBoxPress('每天')}
                                />
                              </View>
                           </View>

                           <View style={{top:ScreenUtils.scaleSize(20),width:ScreenUtils.scaleSize(690),height:ScreenUtils.scaleSize(100),flexDirection:'row'}}>
                             {checkboxDaysArr.map((item,i) => this._renderCheckboxView(item,i))}
                           </View>

                         </View>
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
    scrollableTabview: {
        backgroundColor:'#EEEEEE',
        width: ScreenUtils.scaleSize(750),
        height: ScreenUtils.scaleSize(390),
      },
     underline: {
        borderColor: 'red',
        backgroundColor: '#F3A50E',
      },
      // modal的样式
});