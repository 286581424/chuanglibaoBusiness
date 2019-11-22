import React,{Component} from 'react';
 
//这里引入了一个md5加密的库，Github https://github.com/kmend/react-native-md5
//引入方式很简单，npm install react-native-md5 --save
//然后打开项目的package.json 查看，发现此时多了一个依赖    
 
import MD5 from "react-native-md5";
import {
    Alert,
} from 'react-native';
import { NavigationActions } from "react-navigation";
 
 // var url = 'http://39.108.86.81:8090/';
 // var url = 'http://m.chuanglibao.net.cn:8090/'
 var url = 'http://test.chuanglibao.net.cn:8090/'
   // var url = 'http://sunny.nat300.top/';
 // var url = 'http://192.168.0.105:8080/';
 
/**
 * 网络请求的工具类
 */
export default class NetUtils extends Component{
 
    //构造函数，默认的props，以及state 都可以在这里初始化了
    constructor(props){
        super(props); 
    }
 
    /**
     * 普通的get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    static get(Interface,params,callback){
      let str = '&equipment=app'
      if (params == '') {
        str = '?equipment=app'
      }
       let InterfaceUrl = url+Interface+params+str;
       fetch(InterfaceUrl,{
        headers:{
          "Accept": "application/json;charset=utf-8",
          'Content-Type': 'application/json',
        },
       })
        .then((response) => response.json())
        .then((responseBody) => {
            if(responseBody.flag == true){
              callback(responseBody.data);
            }else{
                //否则不正确，则进行消息提示
                if (responseBody.errMsg == 'token is error' || responseBody.errMsg == '请先登录！！！') {
                    Alert.alert('提示','你的账号已在别的设备登录，请重新登录',[{text:'确定'}]);
                }else{
                    Alert.alert('提示',responseBody.errMsg);
                }
            }
        }).catch(error => {
            alert(error);
        });
    };

    static get_back(Interface,params,callback,errorBack){
      let str = '&equipment=app'
      if (params == '') {
        str = '?equipment=app'
      }
       let InterfaceUrl = url+Interface+params+str;
       fetch(InterfaceUrl,{
        headers:{
          "Accept": "application/json;charset=utf-8",
          'Content-Type': 'application/json',
        },
       })
        .then((response) => response.json())
        .then((responseBody) => {
            if(responseBody.flag == true){
              callback(responseBody.data);
            }else{
                errorBack(responseBody.error)
            }
        }).catch(error => {
            alert(error);
        });
    };

    /**
     * 普通的get请求 
     * @param {*} url 地址
     * @param {*} params  参数
     * @param {*} callback  成功后的回调
     */
    static getInterUrl(){
      return url;
    };
 
    /**
     * post key-value 形式 hader为'Content-Type': 'application/x-www-form-urlencoded'
     * @param {*} url 
     * @param {*} service 
     * @param {*} params 
     * @param {*} callback 
     */
    static post(Interface,formData,callback){
        fetch(url+Interface+'?equipment=app',{
        method:'POST',
        headers:{
          'Accept': 'application/json;charset=utf-8',
          'Content-Type': 'multipart/form-data',
        },
        body:formData
        })
        .then((response) => response.json())
        .then((responseBody) => {
            if(responseBody.flag == true){
              callback(responseBody.data);
            }else{
                //否则不正确，则进行消息提示
                Alert.alert('提示',JSON.stringify(responseBody));
            }
        }).catch(error => {
            alert(error);
            //ToastAndroid.show("netword error",ToastAndroid.SHORT);
        });
    };
 
    /**
     * post json形式  header为'Content-Type': 'application/json'
     * @param {*} url 
     * @param {*} service 
     * @param {*} jsonObj 
     * @param {*} callback 
     */
    static postJson(Interface,jsonObj,params,callback){
        let str = '&equipment=app'
        if (params == '') {
          str = '?equipment=app'
        }
        fetch(url+Interface+params+str,{
        method:'POST',
        headers:{
          'Accept': 'application/json;charset=utf-8',
          'Content-Type': 'application/json;',
        },
        body:JSON.stringify(jsonObj),//json对象转换为string
        })
        .then((response) => response.json())
        .then((responseBody) => {
            if(responseBody.flag == true){
                callback(responseBody.data);
            }else{
                //否则不正确，则进行消息提示
                Alert.alert('提示',JSON.stringify(responseBody));
            }
        }).catch(error => {
            alert(error);
        });
    };

    /**
     * post json形式  header为'Content-Type': 'application/json'
     * @param {*} url 
     * @param {*} service 
     * @param {*} jsonObj 
     * @param {*} callback 
     */
    static postJson_backErr(Interface,jsonObj,params,callback,errBack,errorBack){
      let str = '&equipment=app'
      if (params == '') {
        str = '?equipment=app'
      }
        fetch(url+Interface+params+str,{
        method:'POST',
        headers:{
          'Accept': 'application/json;charset=utf-8',
          'Content-Type': 'application/json;',
        },
        body:JSON.stringify(jsonObj),//json对象转换为string
        })
        .then((response) => response.json())
        .then((responseBody) => {
            if(responseBody.flag == true){
                callback(responseBody.data);
            }else{
                //否则不正确，则进行消息提示
                let err = '服务器繁忙，请稍候再试'
                if (responseBody.errMsg != null) {
                  err = responseBody.errMsg
                }
                errBack(err)
            }
        }).catch(error => {
            errorBack(error)
        });
    };

    /**
     * 日期加一天
     */
    static getTimeAddOneDay(date){
        var space = "-";
        var dateTime=new Date();
        if(date!=''){
          date = date.replace(/-/g,':').replace(' ',':');
          date = date.split(':');
          dateTime = new Date(date[0],(date[1]-1),date[2]);
        }
        dateTime = dateTime.setDate(dateTime.getDate()+1);
        dateTime = new Date(dateTime);
        console.log(dateTime.getDate())
        var years = dateTime.getFullYear();
        var months = dateTime.getMonth()+1;
        if(months<10){
            months = "0"+months;
        }
 
        var days = dateTime.getDate();
        if(days<10){
            days = "0"+days;
        }

        var hours = dateTime.getHours();
        if(hours<10){
            hours = "0"+hours;
        }
 
        var mins = dateTime.getMinutes(); 
        if(mins<10){
            mins = "0"+mins;
        }
 
        var secs = dateTime.getSeconds();
        if(secs<10){
            secs = "0"+secs;
        }

        var time = years+space+months+space+days;
        return time;
    };

    /**
     * 获取vip到期时间 yyyy-MM-dd +30天
     */
    static getExpireTime(){
        var space = ".";
        var dateTime=new Date();
        dateTime = dateTime.setDate(dateTime.getDate()+30);
        dateTime = new Date(dateTime);
        console.log(dateTime.getDate())
        var years = dateTime.getFullYear();
        var months = dateTime.getMonth()+1;
        if(months<10){
            months = "0"+months;
        }
 
        var days = dateTime.getDate();
        if(days<10){
            days = "0"+days;
        }

        var hours = dateTime.getHours();
        if(hours<10){
            hours = "0"+hours;
        }
 
        var mins =dateTime.getMinutes(); 
        if(mins<10){
            mins = "0"+mins;
        }
 
        var secs = dateTime.getSeconds();
        if(secs<10){
            secs = "0"+secs;
        }

        var time = years+space+months+space+days;
        return time;
    };
 
    /**
     * 获取当前系统时间 yyyyMMddHHmmss
     */
    static getCurrentDate(){
        var space = "-";
        var space1 = ":";
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth()+1;
        if(months<10){
            months = "0"+months;
        }
 
        var days = dates.getDate();
        if(days<10){
            days = "0"+days;
        }
 
        var hours = dates.getHours();
        if(hours<10){
            hours = "0"+hours;
        }
 
        var mins =dates.getMinutes(); 
        if(mins<10){
            mins = "0"+mins;
        }
 
        var secs = dates.getSeconds();
        if(secs<10){
            secs = "0"+secs;
        }
        var time = years+space+months+space+days+'_'+hours+space1+mins+space1+secs;
        return time;
    };
 
    /**
     * 设置公共参数
     * @param {*} service  服务资源类型
     * @param {*} oldParams 参数 key-value形式的字符串 
     * @return 新的参数
     */
    static getNewParams(service,oldParams){
        var newParams = "";
        var currentDate = this.getCurrentDate();
        var MD5KEY = "XXXXXX";
        var digestStr = MD5KEY+service+currentDate+MD5KEY;
        newParams = oldParams+"&timestamp="+currentDate+"&digest="+this.MD5(digestStr);
        return newParams;
    };
 
    /**
     * 字符串加密
     * @param {*} str 
     */
    static MD5(str){
        return MD5.hex_md5(str);
    };

    /**
     * 获取当前系统时间 yyyy-MM-dd
     */
    static getTime(){
        var space = "-";
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth()+1;
        if(months<10){
            months = "0"+months;
        }
 
        var days = dates.getDate();
        if(days<10){
            days = "0"+days;
        }

        var hours = dates.getHours();
        if(hours<10){
            hours = "0"+hours;
        }
 
        var mins =dates.getMinutes(); 
        if(mins<10){
            mins = "0"+mins;
        }
 
        var secs = dates.getSeconds();
        if(secs<10){
            secs = "0"+secs;
        }

        var time = years+space+months+space+days+' '+hours+':'+mins+':'+secs;
        return time;
    };
 
 
    /**
     * 获取当前系统时间 yyyyMMddHH
     */
    static getCurrentDateFormat(){
        var space = "-";
        var dates = new Date();
        var years = dates.getFullYear();
        var months = dates.getMonth()+1;
        if(months<10){
            months = "0"+months;
        }
 
        var days = dates.getDate();
        if(days<10){
            days = "0"+days;
        }
        var time = years+space+months+space+days;
        return time;
    };
}