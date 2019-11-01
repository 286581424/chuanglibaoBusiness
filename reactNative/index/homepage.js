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
} from 'react-native';

import {TabNavigator,StackNavigator,} from 'react-navigation'
import Button from 'apsl-react-native-button'

//展示的页面
import orderAdministration from './orderAdministration';
import storeOperation from './storeOperation';
import revenueManagement from './revenueManagement';
import vipManagement from './vipManagement';
import personalCenter from './personalCenter';
import ScreenUtils from '../PublicComponents/ScreenUtils';

console.disableYellowBox = true;
// var handle = InteractionManager.createInteractionHandle();
// // 执行动画... (`runAfterInteractions`中的任务现在开始排队等候)
// // 在动画完成之后
// InteractionManager.clearInteractionHandle(handle);

const Tab = TabNavigator({
    //每一个页面的配置
    orderAdministration: {
        screen: orderAdministration,
        navigationOptions: {
            //stackNavigator的属性
            header: null,
            gestureResponseDistance: {horizontal: 300},

            //tab 的属性
            tabBarLabel: '订单管理',
            tabBarIcon: ({tintColor}) => (
                <Image
                    resizeMode={'stretch'}
                    source={require('./images/bottomTabBar/order_manager.png')}
                    style={[{height:ScreenUtils.scaleSize(48), width:ScreenUtils.scaleSize(55)}, {tintColor: tintColor}]}/>
            ),

        },
    },
    storeOperation: {
        screen: storeOperation,
        navigationOptions: {
            //stackNavigator的属性
            gestureResponseDistance: {horizontal: 300},
            //tab 的属性
            tabBarLabel: '门店运营',
            tabBarIcon: ({tintColor}) => (
                <Image
                    resizeMode={'stretch'}
                    source={require('./images/bottomTabBar/yunying_manager.png')}
                    style={[{height:ScreenUtils.scaleSize(48), width:ScreenUtils.scaleSize(55)}, {tintColor: tintColor}]}
                />
            ),
        }
    },
    crossBorderIncome: {
        screen: revenueManagement,
        navigationOptions: {
            //tab 的属性
            tabBarLabel: '收益管理',
            tabBarIcon: ({tintColor}) => (
                <Image
                    resizeMode={'stretch'}
                    source={require('./images/bottomTabBar/kuajie_manager.png')}
                    style={[{height:ScreenUtils.scaleSize(48), width:ScreenUtils.scaleSize(55)}, {tintColor: tintColor}]}
                />
            ),
        }
    },
    vipManagement: {
        screen: vipManagement,
        navigationOptions: {
            //tab 的属性
            tabBarLabel: '会员管理',
            tabBarIcon: ({tintColor}) => (
                <Image
                    resizeMode={'stretch'}
                    source={require('./images/bottomTabBar/vip_manager.png')}
                    style={[{height:ScreenUtils.scaleSize(48), width:ScreenUtils.scaleSize(55)}, {tintColor: tintColor}]}
                />
            ),
        }
    },
    personalCenter: {
        screen: personalCenter,
        navigationOptions: {
            //tab 的属性
            tabBarLabel: '个人中心',
            tabBarIcon: ({tintColor}) => (
                <Image
                    resizeMode={'stretch'}
                    source={require('./images/bottomTabBar/personal_center.png')}
                    style={[{height:ScreenUtils.scaleSize(48), width:ScreenUtils.scaleSize(55)}, {tintColor: tintColor}]}
                />
            ),
        }
    },

}, {
    //设置TabNavigator的位置
    tabBarPosition: 'bottom',
    //是否在更改标签时显示动画
    animationEnabled: true,
    //是否允许在标签之间进行滑动
    swipeEnabled: true,
    //按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    backBehavior: "none",
    //设置Tab标签的属性
    lazy: true,
    //懒加载
    tabBarOptions: {
        //Android属性
        upperCaseLabel: false,//是否使标签大写，默认为true
        //共有属性
        showIcon: true,//是否显示图标，默认关闭
        showLabel: true,//是否显示label，默认开启
        activeTintColor: '#F7A93C',//label和icon的前景色 活跃状态下（选中）
        inactiveTintColor: '#080808',//label和icon的前景色 活跃状态下（未选中）
        style: { //TabNavigator 的背景颜色
            backgroundColor: 'white',
            height:ScreenUtils.scaleSize(110),
        },
        indicatorStyle: {//标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题
            height: 0,
        },
        labelStyle: {//文字的样式
            fontSize: ScreenUtils.setSpText(6),
            top:-ScreenUtils.scaleSize(5)
        },
        iconStyle: {//图标的样式
            marginTop: ScreenUtils.scaleSize(5),
            width:ScreenUtils.scaleSize(55),
            height:ScreenUtils.scaleSize(55),
        },
        tabStyle:{
            width:ScreenUtils.scaleSize(150),
            height:ScreenUtils.scaleSize(130),
        },
    },
});

/*
 * 初始化StackNavigator
 */
export default Navi = StackNavigator({
    Tab: {
        screen: Tab,
        navigationOptions:{
            header: null,
        }
    },
});

const styles = StyleSheet.create({
  mainView: {
    width:ScreenUtils.scaleSize(750),
    height:ScreenUtils.scaleSize(26),
    backgroundColor: 'white',
  },
  neirongView: {
    top:ScreenUtils.scaleSize(30),
    width:ScreenUtils.scaleSize(750),
  },
});
