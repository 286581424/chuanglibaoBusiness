/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Button from 'apsl-react-native-button'

//展示的页面
import orderAdministration from './orderAdministration';
import storeOperation from './storeOperation';
import revenueManagement from './revenueManagement';
import vipManagement from './vipManagement';
import personalCenter from './personalCenter';
import ScreenUtils from '../PublicComponents/ScreenUtils';

const dataSource = [
                    {icon:require('./images/bottomTabBar/order_manager.png'),selectedIcon:require('./images/bottomTabBar/order_manager_choose.png'),tabPage:'orderAdministration',tabName:'订单管理',component:orderAdministration},
                    {icon:require('./images/bottomTabBar/yunying_manager.png'),selectedIcon:require('./images/bottomTabBar/yunying_manager_choose.png'),tabPage:'storeOperation',tabName:'门店运营',component:storeOperation},
                    {icon:require('./images/bottomTabBar/kuajie_manager.png'),selectedIcon:require('./images/bottomTabBar/kuajie_manager_choose.png'),tabPage:'revenueManagement',tabName:'收益管理',component:revenueManagement},
                    {icon:require('./images/bottomTabBar/vip_manager.png'),selectedIcon:require('./images/bottomTabBar/vip_manager_choose.png'),tabPage:'vipManagement',tabName:'会员管理',component:vipManagement},
                    {icon:require('./images/bottomTabBar/personal_center.png'),selectedIcon:require('./images/bottomTabBar/personal_center_choose.png'),tabPage:'personalCenter',tabName:'个人中心',component:personalCenter},
                 ]
var navigation = null;
type Props = {};
export default class homes extends Component<Props> {
  constructor(props){
    super(props);
    navigation = this.props.navigation;
    this.state = {
      selectedTab:'orderAdministration'
    }
  }

componentDidMount() {
  this.deEmitter = DeviceEventEmitter.addListener('changeTab', (a) => {
        this.setState({selectedTab:'orderAdministration'})
    });
}

sendListener(item){
  switch(item)
  {
  case 'orderAdministration':
    DeviceEventEmitter.emit('orderAdministrationListener','')
    break;
  case 'storeOperation':
    DeviceEventEmitter.emit('storeOperationListener','')
    break;
  case 'revenueManagement':
    DeviceEventEmitter.emit('revenueManagementListener','')
    break;
  case 'vipManagement':
    DeviceEventEmitter.emit('vipManagementListener','')
    break;
  case 'personalCenter':
    DeviceEventEmitter.emit('personalCenterListener','')
    break;
  default:
    break;
  }
}

render() {
    let tabViews = dataSource.map((item,i) => {
      return (
          <TabNavigator.Item
            title={item.tabName}
            selected={this.state.selectedTab===item.tabPage}
            titleStyle={{color:'black'}}
            selectedTitleStyle={{color:'#F7A93C'}}
            renderIcon={()=><Image style={styles.tabIcon} source={item.icon}/>}
            renderSelectedIcon = {() => <Image style={styles.tabIcon} source={item.selectedIcon}/>}
            tabStyle={{width:ScreenUtils.scaleSize(150),height:ScreenUtils.scaleSize(90)}}
            onPress = {() => {this.setState({selectedTab:item.tabPage});this.sendListener(item.tabPage);}}
            key={i}
            >
            <item.component  navigation={navigation}/>
        </TabNavigator.Item>
      );
    })
    return (
      <View style={styles.container}>
        <TabNavigator
          tabBarStyle={{width:ScreenUtils.scaleSize(750),height:ScreenUtils.scaleSize(100)}}
          hidesTabTouch={true}
          >
            {tabViews}
        </TabNavigator>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabIcon:{
    width:ScreenUtils.scaleSize(55),
    height:ScreenUtils.scaleSize(48),
  }
});
