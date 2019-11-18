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
import purchaseList from './purchaseList';
import marketOrderList from './marketOrderList'
import vipProfit from './vipProfit'
import ScreenUtils from '../../../PublicComponents/ScreenUtils';

const dataSource = [
                    {icon:require('../../images/Market/list.png'),selectedIcon:require('../../images/Market/list_choose.png'),tabPage:'purchaseList',tabName:'采购列表',component:purchaseList},
                    {icon:require('../../images/Market/order.png'),selectedIcon:require('../../images/Market/order_choose.png'),tabPage:'marketOrderList',tabName:'送货订单',component:marketOrderList},
                    {icon:require('../../images/Market/profit.png'),selectedIcon:require('../../images/Market/profit_choose.png'),tabPage:'vipProfit',tabName:'VIP收益',component:vipProfit},
                 ]
var navigation = null;
type Props = {};
export default class marketCategory extends Component<Props> {
  constructor(props){
    super(props);
    navigation = this.props.navigation;
    this.state = {
      selectedTab:'purchaseList'
    }
  }

  componentDidMount() {
    this.deEmitter = DeviceEventEmitter.addListener('marketCategory', (a) => {
        if (a == 'marketOrderList') {
          this.setState({selectedTab:'marketOrderList'})
        }else if (a == 'purchaseList') {
          this.setState({selectedTab:'purchaseList'})
        }else{
          this.setState({selectedTab:'vipProfit'})
        }
    });
  }

sendListener(item){
  switch(item)
  {
  case 'purchaseList':
    DeviceEventEmitter.emit('purchaseListListener','')
    break;
  case 'marketOrderList':
    DeviceEventEmitter.emit('marketOrderListListener','')
    break;
  case 'vipProfit':
    DeviceEventEmitter.emit('vipProfitListener','')
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
    width:ScreenUtils.scaleSize(42),
    height:ScreenUtils.scaleSize(48),
  }
});
