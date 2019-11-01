import React, {Component,PropTypes} from 'react';
import {ScrollView,FlatList,View,Text,Image,StyleSheet,DimenSions,TouchableOpacity,SectionList,PanResponder} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import StarRating from 'react-native-star-rating';
import Button from 'apsl-react-native-button';
import ScreenUtils from '../PublicComponents/ScreenUtils';

const Dimensions = require('Dimensions');
const {width,height}=Dimensions.get('window');
var ViewPropTypes = View.propTypes;

export default class DraggableView extends Component{

  constructor(props) {
    super(props);
    this.state={
      businessTab : 0,  //0为推荐商家，1为附近商家，2为用户好评
      isActive : false,
      nowidex: 0,
    }
    this.names = ['Android','iOS','前端','拓展资源','休息视频'];
    this.items = [];
    this.order = [];
  }

  componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                const {pageY, locationY} = evt.nativeEvent;
                this.index = this._getIdByPosition(pageY);
                this.preY = pageY - locationY;
                //get the taped item and highlight it
                let item = this.items[this.index];
                item.setNativeProps({
                    style: {
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        shadowOffset: {height: 0, width: 2},
                        elevation: 5
                    }
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                let top = this.preY + gestureState.dy;
                let item = this.items[this.index];
                item.setNativeProps({
                    style: {top: top}
                });

                let collideIndex = this._getIdByPosition(evt.nativeEvent.pageY);
                if(collideIndex !== this.index && collideIndex !== -1) {
                    let collideItem = this.items[collideIndex];
                    collideItem.setNativeProps({
                        style: {top: this._getTopValueYById(this.index)}
                    });
                    //swap two values
                    [this.items[this.index], this.items[collideIndex]] = [this.items[collideIndex], this.items[this.index]];
                    [this.order[this.index], this.order[collideIndex]] = [this.order[collideIndex], this.order[this.index]];
                    this.index = collideIndex;
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                const shadowStyle = {
                    shadowColor: "#000",
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    shadowOffset: {height: 0, width: 0,},
                    elevation: 0
                };
                let item = this.items[this.index];
                //go back the correct position
                item.setNativeProps({
                    style: {...shadowStyle, top: this._getTopValueYById(this.index)}
                });
                console.log(this.order);
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            }
        });
    }

      _getIdByPosition(pageY){
          var id = -1;
          const height = ScreenUtils.scaleSize(49);

          if(pageY >= height && pageY < height*2)
              id = 0;
          else if(pageY >= height*2 && pageY < height*3)
              id = 1;
          else if(pageY >= height*3 && pageY < height*4)
              id = 2;
          else if(pageY >= height*4 && pageY < height*5)
              id = 3;
          else if(pageY >= height*5 && pageY < height*6)
              id = 4;

          return id;
      }

      _getTopValueYById(id){
          const height = ScreenUtils.scaleSize(49);
          return (id + 1) * height;
      }

      _renderView(item){
        return (
            <Text style={styles.itemTitle}>{item}</Text>
          );
      }


  render() {
    var data = this.props.dataSource;
    var heightLine = this.props.heightLine;
    return (
       <View style={this.props.style}>
          {this.names.map((item, i)=>{
              this.order.push(item);
              return (
                  <View
                      {...this._panResponder.panHandlers}
                      ref={(ref) => this.items[i] = ref}
                      key={i}
                      style={[this.props.itemStyle, {top: ScreenUtils.scaleSize((i+1)*49)}]}>
                      {this.props.renderItem()}
                  </View>
              );
          })}
       </View>
      )
  }
}
const styles = StyleSheet.create({
  item: {
        flexDirection: 'row',
        backgroundColor :'red',
        height: ScreenUtils.scaleSize(49),
        width: ScreenUtils.scaleSize(750),
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: ScreenUtils.scaleSize(20),
        borderBottomColor: 'red',
        borderBottomWidth: 2,
        position: 'absolute',
    },
    itemTitle: {
        fontSize: ScreenUtils.setSpText(8),
        color: '#000',
        marginLeft: ScreenUtils.scaleSize(20)
    }
});