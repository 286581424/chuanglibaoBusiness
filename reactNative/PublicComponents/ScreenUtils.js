/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */
import React,{Component} from 'react';
import {
  PixelRatio,
  Platform,
} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
var Dimensions = require('Dimensions');
var screenW = Dimensions.get('window').width;
var screenH = Dimensions.get('window').height;
var fontScale = PixelRatio.getFontScale();
var pixelRatio = PixelRatio.get();
const r2=2;
const w2 = 750/r2;
const h2 = 1334/r2;
const DEFAULT_DENSITY=2;
 
const defaultPixel = 2;                           //iphone6的像素密度
//px转换成dp
const w1 = 750 / defaultPixel;
const h1 = 1334 / defaultPixel;
const scale = Math.min(screenH / h1, screenW / w1);   //获取缩放比例

export default class ScreenUtils extends Component{
 
 
    //构造函数，默认的props，以及state 都可以在这里初始化了
    constructor(props){
        super(props); 
    }

    /**
     * 设置text为sp
     * @param size  sp
     * @returns {Number} dp
     */
    static setSpText(size){
        let pixel = 3;
        size = Math.round((size * scale + 0.5) * pixel / fontScale);
        return size / defaultPixel;
    };

    static getHeight(){
        if (Platform.OS === 'android'){
            let height = ExtraDimensions.getRealWindowHeight()
            return height
        }else{
            return screenH;
        }
    }

    /**
     * 屏幕适配,缩放size
     * @param size
     * @returns {Number}
     * @constructor
     */
    // static scaleSize(size){
    //     var scaleWidth = screenW / w2;
    //     var scaleHeight = screenH / h2;
    //     var scale = Math.min(scaleWidth, scaleHeight);
    //     size = Math.round((size * scale + 0.5));
    //     return size/DEFAULT_DENSITY;
    // };
    static scaleSize(size){
        return screenW*size/750;
    }



}