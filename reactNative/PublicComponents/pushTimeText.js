import React, {Component} from 'react';
import {FlatList,ScrollView,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity,SectionList,Alert} from 'react-native';
import ScreenUtils from './ScreenUtils';
import NetUtils from './NetUtils';

export default class pushTimeText extends Component{

  constructor(props) {
    super(props);
    this.state={
      businessTab : 0,  //0为推荐商家，1为附近商家，2为用户好评
      isActive : false,
      nowidex: 0,
      endingTime: '',
    }
  }

  componentDidMount () {
    let pushTime = this.props.pushTime
    this.endingTime(endingTime)
  }

  endingTime(endingTime){
    let invalid_time = endingTime.replace(/-/g,'/');
    let now_time = NetUtils.getTime().replace(/-/g,'/');
    let invalid_time_timestamp = new Date(invalid_time).getTime();
    this.setState({invalid_time_timestamp:invalid_time_timestamp});
    let now_time_timestamp = new Date(now_time).getTime();
    let zong_sec = (invalid_time_timestamp-now_time_timestamp)/1000;
    let d = Math.floor(zong_sec / 3600/24) < 10 ? '0'+Math.floor(zong_sec / 3600/24) : Math.floor(zong_sec / 3600/24);
    let h = Math.floor(zong_sec / 3600) < 10 ? '0'+Math.floor(zong_sec / 3600) : Math.floor(zong_sec / 3600);
    let m = Math.floor((zong_sec / 60 % 60)) < 10 ? '0' + Math.floor((zong_sec / 60 % 60)) : Math.floor((zong_sec / 60 % 60));
    let s = Math.floor((zong_sec % 60)) < 10 ? '0' + Math.floor((zong_sec % 60)) : Math.floor((zong_sec % 60));
    let time = parseInt(d)+'天'+h%24+'小时'+m+'分'+s+'秒'
    this.setState({endingTime:time});
    this._payTimeCountDown()
  }

  _payTimeCountDown(){
    this.timer = setInterval(
      () => {
        let invalid_time_timestamp = this.state.invalid_time_timestamp;
        let now_time = NetUtils.getTime().replace(/-/g,'/');
        let now_time_timestamp = new Date(now_time).getTime();
        let zong_sec = (invalid_time_timestamp-now_time_timestamp)/1000;
        let d = Math.floor(zong_sec / 3600/24) < 10 ? '0'+Math.floor(zong_sec / 3600/24) : Math.floor(zong_sec / 3600/24);
        let h = Math.floor(zong_sec / 3600) < 10 ? '0'+Math.floor(zong_sec / 3600) : Math.floor(zong_sec / 3600);
        let m = Math.floor((zong_sec / 60 % 60)) < 10 ? '0' + Math.floor((zong_sec / 60 % 60)) : Math.floor((zong_sec / 60 % 60));
        let s = Math.floor((zong_sec % 60)) < 10 ? '0' + Math.floor((zong_sec % 60)) : Math.floor((zong_sec % 60));
        let time = parseInt(d)+'天'+h%24+'小时'+m+'分'+s+'秒'
        this.setState({endingTime:time});
        if (h == 0 && m == 0 && s == 0) {
          this.timer && clearTimeout(this.timer);
        }
       },
      1000
    );
  }

  componentWillUnmount(){
    this.timer && clearTimeout(this.timer);
  }

  renderText(){
    if (this.props.type == 'list') {
      return (
               <Text style={{fontSize:ScreenUtils.setSpText(7.8),color:'gray'}}>剩余:{this.state.endingTime}</Text>
             )
    }else{
      return (
               <Text style={{fontSize:ScreenUtils.setSpText(8),color:'red'}}>{this.state.endingTime}</Text>
             )
    }
  }

  render() {
    return (
       <View style={{flexDirection:'row'}}>
          {this.renderText()}
       </View>
      )
  }
}
const styles = StyleSheet.create({
  underline: {
    borderColor: 'red',
    backgroundColor: '#F3A50E',
  },
});