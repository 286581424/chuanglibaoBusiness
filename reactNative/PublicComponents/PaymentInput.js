import React, {Component} from 'react';
import {TextInput,FlatList,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity,Modal,DeviceEventEmitter} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StarRating from 'react-native-star-rating';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';

const Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');

export default class PaymentInput extends Component{

  constructor(props) {
    super(props);
    this.state = {
      paymentTextInput: '',
      show: true,
    }
  }

  componentDidMount(){
    setTimeout(() => {
      if (this.comments != null) {
        this.comments.focus()
      }
    },300);
    this.deEmitter = DeviceEventEmitter.addListener('pwdErrorListeners', (a) => {
       this.setState({paymentTextInput:''})
       this.comments.focus()
    });
  }

  componentWillUnmount(){
    this.deEmitter.remove()
  }

  renderView(value){
    let arr = [];
    // this.setState({paymentTextInput:value});
    for (let i = 0; i < 6; i++){
        arr.push(<View style={{width:ScreenUtils.scaleSize(this.props.width/6),height:ScreenUtils.scaleSize(this.props.height),borderColor:'#D9DADC',borderWidth:1,borderRightWidth:i==5?1:0,alignItems:'center',justifyContent:'center'}}>{i < this.state.paymentTextInput.length ? <View style={{width:ScreenUtils.scaleSize(30),height:ScreenUtils.scaleSize(30),borderRadius:ScreenUtils.scaleSize(15),backgroundColor:'#222'}}></View> : null}</View>);
    }
    return arr;
  }

  _numberTextInputChangeText(value){
    this.setState({paymentTextInput:value});
    if (value.length == 6) {
      dismissKeyboard()
      this.props.callback(value);
    }
  }

  _numberPress(item){
    let value = this.state.paymentTextInput;
    if (item == 'delete') {
      if(value.length != 0){
        value = value.slice(0,value.length-1);
        this.setState({paymentTextInput:value});
      }
    }else if (item == '') {

    }else{
      if (value.length < 5) {
        value+=item;
        this.setState({paymentTextInput:value});
      }else if (value.length == 5) {
        this._setModelShow();
        value+=item;
        this.setState({paymentTextInput:value});
        this.props.callback(value);
      }else{
        return;
      }
    }
  }

  _setModelShow(){
    setTimeout(()=>{
      let show = this.state.show;
      this.setState({show:!show});
    },100)
  }

  _renderNumberItem(item){
    if (item == '') {
      return(
             <TouchableOpacity onPress={() => this._numberPress(item)} style={{borderWidth:1,borderColor:'#EEEEEE',width:ScreenUtils.scaleSize(249),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
             </TouchableOpacity>
          );
    }else if (item == 'delete') {
      return(
             <TouchableOpacity onPress={() => this._numberPress(item)} style={{borderWidth:1,borderColor:'#EEEEEE',width:ScreenUtils.scaleSize(249),height:ScreenUtils.scaleSize(100),alignItems:'center',justifyContent:'center'}}>
               <Image style={{width:ScreenUtils.scaleSize(45),height:ScreenUtils.scaleSize(30)}} source={require('../index/images/delete.png')} />
             </TouchableOpacity>
          );
    }else{
      return(
             <TouchableOpacity onPress={() => this._numberPress(item)} style={{borderWidth:1,borderColor:'#EEEEEE',width:ScreenUtils.scaleSize(249),height:ScreenUtils.scaleSize(100),backgroundColor:'white',alignItems:'center',justifyContent:'center'}}>
               <Text style={{width:ScreenUtils.scaleSize(250),height:ScreenUtils.scaleSize(50),textAlign:'center',fontWeight:'bold',color:'black',fontSize:ScreenUtils.setSpText(8)}}>{item}</Text>
             </TouchableOpacity>
          );
    }
  }

  getFocus(){
    setTimeout(() => {
      if (this.comments != null) {
        this.comments.focus()
      }
    },300);
  }

  render() {
    var data = this.props.dataSource;
    var numberArr = ['1','2','3','4','5','6','7','8','9','','0','delete'];
    return (
        <TouchableOpacity onPress={() => this.getFocus()} style={{width:ScreenUtils.scaleSize(this.props.width),height:ScreenUtils.scaleSize(this.props.height),flexDirection:'row',backgroundColor:'white'}}>
          {this.renderView(this.props.value)}
          <TextInput
              keyboardType='numeric'
              placeholder=''
              maxLength={6}
              ref={(ref) => { this.comments = ref }}
              autoCorrect={false}
              style={{left:ScreenUtils.scaleSize(1000)}}
              onChangeText={(paymentTextInput) => this._numberTextInputChangeText(paymentTextInput)}
              value={this.state.paymentTextInput}
              underlineColorAndroid='transparent'
            />
        </TouchableOpacity>
      )
  }
}
const styles = StyleSheet.create({
  underline: {
    borderColor: 'red',
    backgroundColor: '#F3A50E',
  },
  businessViewStyle:{
    flexDirection:'row',
    width:ScreenUtils.scaleSize(750),
    height:ScreenUtils.scaleSize(240),
  },
});