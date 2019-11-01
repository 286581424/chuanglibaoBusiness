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
import LeftNative from '../../PublicComponents/LeftNative';
import NetUtils from '../../PublicComponents/NetUtils';

var messageArr = [
                {messageID:'112131231231',messageContent:'系统消息内容！！！！！！！',time:'2018.07.23 12:45'},
                {messageID:'112131231231',messageContent:'系统消息内容！！！！！！！',time:'2018.07.23 12:45'},
             ];

export default class messageCenter extends Component {

    constructor(props) {
    super(props);
    this.state = {
      title: '消息中心',
      statusBarHeight: 0,
      phone: '',
      token: '',
      messageArr: [],
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
    this.loadToken();
    this.loadPhone();
    this.setStatusBarHeight();
    this.updateMessage();
  }

  updateMessage(){
    setTimeout(() => {
        let params = "?mobile=" + this.state.phone +'&token=' + this.state.token[1];
        NetUtils.get('business/messageCenter', params, (result) => {
            // alert(JSON.stringify(result)) 
            this.setState({messageArr:result});
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

  _renderFenge= () => (
      <View style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(1),backgroundColor:'#EEEEEE'}}></View>
  )

  _renderItem(item){
    return (
        <TouchableOpacity style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(150),justifyContent:'center'}}>
          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.content}</Text>
          <Text style={{left:ScreenUtils.scaleSize(30),width:ScreenUtils.scaleSize(690),fontSize:ScreenUtils.setSpText(8),color:'black'}}>{item.create_time}</Text>
        </TouchableOpacity>
    );
  }

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
                    style={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(250*this.props.heightLine)}}
                    data={this.state.messageArr}
                    renderItem={({item}) => this._renderItem(item)}
                    ItemSeparatorComponent={this._renderFenge}
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