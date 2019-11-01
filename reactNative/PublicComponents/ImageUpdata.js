import React,{Component} from 'react';

//这里引入了一个md5加密的库，Github https://github.com/kmend/react-native-md5
//引入方式很简单，npm install react-native-md5 --save
//然后打开项目的package.json 查看，发现此时多了一个依赖

import {
    Alert,
} from 'react-native';

import NetUtils from './NetUtils';

import * as qiniu from 'qiniu-js'

import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';

 var downloadImageUrl = 'http://img.chuanglibao.net.cn/';

/**
 * 七牛云的工具类
 */

export default class ImageUpdata extends Component{

    //构造函数，默认的props，以及state 都可以在这里初始化了
    constructor(props){
        super(props); 
    }

    static upload(file,key,onloaded,callback){
         //上传参数
        let params = {
            uri: file,//图片路径  可以通过第三方工具 如:ImageCropPicker等获取本地图片路径
            key: key,//要上传的key
        }
        //构建上传策略
        let policy = {
            scope: "chuanglibao:"+key,//记得这里如果格式为<bucket>:<key>形式的话,key要与params里的key保持一致,详见七牛上传策略
            returnBody://returnBody 详见上传策略
                {
                    name: "$(fname)",//获取文件名
                    size: "$(fsize)",//获取文件大小
                    w: "$(imageInfo.width)",//...
                    h: "$(imageInfo.height)",//...
                    hash: "$(etag)",//...
                },
        }
        NetUtils.get('public/getUploadToken','',(token) => {
            //进行文件上传 
            Rpc.uploadFile(params, token.uploadToken, policy, (a,b,c) => {
                  onloaded(a+','+b+','+c);
                },
                (responseObj) => {
                    callback(responseObj);
                }
            )
        });

    };

    static getImageName(modelName,phoneNum,id){
        let time = NetUtils.getCurrentDate();
        let name = modelName+'/'+phoneNum+'/'+time+'_'+id;
        return name;
    }

    static getName(modelName,phoneNum,id){
        let time = NetUtils.getCurrentDate();
        let name = downloadImageUrl + modelName+'/'+phoneNum+'/'+time+'_'+id;
        return name;
    }

    static downloadImage(fileName){
        str = fileName.replace(' ','%20');
        let url = downloadImageUrl + str;
        return url;
    }

    static hasImgUrl(url){
        if (url.indexOf(downloadImageUrl) != -1) {
            return true;
        }
        return false;
    }

    static separateUrl(url){
        let arr = url.split(downloadImageUrl);
        if (arr.length > 2) {
            return arr[arr.length-1];
        }
        return arr[0];
    }

}