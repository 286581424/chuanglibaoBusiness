import { AppRegistry } from 'react-native';
import React, {Component} from 'react';
import shopInfo from './reactNative/login/shopInfo';
import homepage from './reactNative/index/homepage';
import storage from './reactNative/database/storage';
import startView from './reactNative/login/startView';
import registerBusinessQualification from './reactNative/login/registerBusinessQualification';

global.storage = storage;

  AppRegistry.registerComponent('chuanglibaoBusiness', () => startView);
