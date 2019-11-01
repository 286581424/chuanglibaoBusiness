'use strict';

import React, {Component} from 'react';
var {ReactNative,
    StyleSheet,
    View,
    ScrollView,
    Animated,
} = require('react-native');
var PropTypes = require('prop-types');
var Dimensions = require('Dimensions');

/**
 * BlurView temporarily removed until semver stuff is set up properly
 */
//var BlurView /* = require('react-native-blur').BlurView */;
var ScrollableMixin = require('react-native-scrollable-mixin');
var screen = Dimensions.get('window');
var ScrollViewPropTypes = ScrollView.propTypes;

class ParallaxView extends Component{

    propTypes = {
        ...ScrollViewPropTypes,
        windowHeight: PropTypes.number,
        backgroundSource: PropTypes.oneOfType([
          PropTypes.shape({
            uri: PropTypes.string,
          }),
          PropTypes.number,
        ]),
        header: PropTypes.node,
        blur: PropTypes.string,
        contentInset: PropTypes.object,
    }

    getDefaultProps() {
        return {
            windowHeight: 300,
            contentInset: {
                top: screen.scale
            }
        };
    }

    getInitialState() {
        return {
            scrollY: new Animated.Value(0)
        };
    }

    /**
     * IMPORTANT: You must return the scroll responder of the underlying
     * scrollable component from getScrollResponder() when using ScrollableMixin.
     */
    getScrollResponder() {
      return this._scrollView.getScrollResponder();
    }

    setNativeProps(props) {
      this._scrollView.setNativeProps(props);
    }

    renderBackground() {
        var { windowHeight, backgroundSource, blur } = this.props;
        if (!windowHeight || !backgroundSource) {
            return null;
        }
        return (
            <Animated.Image
                style={[styles.background, {
                    height: windowHeight,
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [ -windowHeight, 0, windowHeight],
                            outputRange: [windowHeight/2, 0, -windowHeight/3]
                        })
                    },{
                        scale: scrollY.interpolate({
                            inputRange: [ -windowHeight, 0, windowHeight],
                            outputRange: [2, 1, 1]
                        })
                    }]
                }]}
                source={backgroundSource}>
                {/*
                    !!blur && (BlurView || (BlurView = require('react-native-blur').BlurView)) &&
                    <BlurView blurType={blur} style={styles.blur} />
                */}
            </Animated.Image>
        );
    }

    renderHeader() {
        var { windowHeight, backgroundSource } = this.props;
        var { scrollY } = this.state;
        if (!windowHeight || !backgroundSource) {
            return null;
        }
        return (
            <Animated.View style={{
                position: 'relative',
                height: windowHeight,
                opacity: scrollY.interpolate({
                    inputRange: [-windowHeight, 0, windowHeight / 1.2],
                    outputRange: [1, 1, 0]
                }),
            }}>
                {this.props.header}
            </Animated.View>
        );
    }

    render() {
        var { style, ...props } = this.props;
        var { scrollY } = this.state;
        return (
            <View style={[styles.container, style]}>
                {this.renderBackground()}
                <ScrollView
                    ref={component => { this._scrollView = component; }}
                    {...props}
                    style={styles.scrollView}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                    )}
                    scrollEventThrottle={16}>
                    {this.renderHeader()}
                    <View style={[styles.content, props.scrollableViewStyle]}>
                        {this.props.children}
                    </View>
                </ScrollView>
            </View>
        );
    }
};

var styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: 'transparent',
    },
    scrollView: {
        backgroundColor: 'transparent',
    },
    background: {
        position: 'absolute',
        backgroundColor: '#2e2f31',
        width: screen.width,
        resizeMode: 'cover'
    },
    blur: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    content: {
        shadowColor: '#222',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'column'
    }
});

module.exports = ParallaxView;
