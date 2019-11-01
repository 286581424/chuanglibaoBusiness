import React, {Component} from 'react';
import {View,Text,TextInput,Image,StyleSheet,DimenSions,TouchableOpacity} from 'react-native';
import Button from 'apsl-react-native-button';

const Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');

export default class NativeSearchView extends Component{

  constructor(props) {
    super(props);
    this.state={
      textInputValue : 0,
    }
  }

  _moreBtn(){

  }

  render(){
  	return(
              //头部导航
	        <View style={{width:width,height:height*120/1334}}>
	          <Button style={styles.backBtn} onPress={() => this.props.backBtnPress()}>
	              <Image
	                source={require('../index/images/Home/index_searchView_back.png')}
	                style={{height:height*46/1334, width:width*26/750}}/>
	          </Button>

	            <View style={styles.searchBox}>

	                 <Image source={require('../index/images/Home/index_Home_top_find.png')} style={styles.searchBoxImg}/>

	                 <TextInput style={styles.searchBoxTextInput}
	                            value={this.state.textInputValue}
	                            onChangeText={(textInputValue) => this.props.searchTextInputOnchange(textInputValue)}
	                            keyboardType='web-search'
	                            placeholder={this.props.placeholder} />

	                  <Button onPress={() => this._moreBtn()} style={{height:height*60/1334, width:width*100/750,left:width*540/750,top:-height*80/1334,borderColor:'white'}}>
	                     <Image source={require('../index/images/Home/index_Home_more.png')} style={styles.moreImg}/>
	                  </Button>
	            </View>
	          </View>

  		);
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backBtn:{
        borderColor: 'rgba(255, 255, 255, 0.0)',
        width:width*46/750,
        height:height*46/1334,
        top:height*42/1334,
        left:width*36/750,
    },
    searchBox: {
        backgroundColor:'#F1EDDF',
        borderRadius:10,
        width:width*530/750,
        height:height*60/1334,
        top:-height*30/1334,
        left:width*105/750,
    },
    searchBoxImg:{
        width:width*30/750,
        height:width*30/750,
        top:height*15/1334,
        left:width*55/750,
    },
    moreImg:{
    	width:width*42/750,
        height:width*8/750,
    },
    searchBoxTextInput:{
        width:width*470/750,
        height:width*50/750,
        top:-height*25/1334,
        left:width*115/750,
    },
});