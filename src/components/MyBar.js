import React, {Component, Fragment, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient'
import { StyleSheet, Text, View, Image,Animated, TouchableWithoutFeedback } from 'react-native'
import { week } from '../constant/constant';
const defaultHeight = 1.5
const validateValue = (value) => {
  if(typeof value !== 'number' || value < 30) return defaultHeight * 30
  if(value > 100)return defaultHeight *100
  return value * defaultHeight
}
const points = {
  90: {
    color: 'rgb(255,120,30)',
    img: require('../assets/happyWink.png'),
    liner: ['rgb(255,165,70)', 'rgb(255,201,69)']
  },
  60: {
    color: 'rgb(82,200,115)',
    img: require('../assets/happy.png'),
    liner: ['rgb(53,219,113)', 'rgb(151,233,65)']
  },
  0: {
    color: 'black',
    img: require('../assets/unhappy.png'),
    liner: ['black', 'grey']
  },
}

export default class MyBar extends Component {
  constructor(props) {
    super(props)
    const { value, barIdx } = props
    let point = value || value === 0
      ? points[
          Object.keys(points).reduce((pre, cur) =>
            value >= Number(pre) && value < Number(cur) ? pre : cur,
          )
        ]
      : {
          color: 'grey',
          img: require('../assets/question.png'),
          liner: ['grey', 'rgb(208,207,208)']
        }
    this.state = {
      heightAmin: new Animated.Value(28),
      barOpacityAnim: new Animated.Value(0),
      imgScale: new Animated.Value(0),
      opacityAnim: new Animated.Value(0),
      weekOpacityAnim: new Animated.Value(0),
      weekShadowAnim: new Animated.Value(0),
      weekColorAnim: new Animated.Value(0),
      barScalAnim: new Animated.Value(1),
      touched: false,
      value,
      barIdx,
      point
    }
  }

  componentDidMount() {
    const {
      heightAmin,
      barOpacityAnim,
      imgScale,
      opacityAnim,
      weekOpacityAnim,
      barIdx,
      value
    } = this.state
    let toValue = validateValue(value)
    Animated.sequence([
      Animated.timing(
        barOpacityAnim,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
          delay: barIdx * 200
        }
      ),
      Animated.timing(
        imgScale,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }
      ),
      Animated.timing(
        heightAmin,
        {
          toValue: toValue,
          duration: 500,
          useNativeDriver: false,
        }
      ),
      Animated.timing(
        opacityAnim,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }
      )
    ]).start()
    Animated.timing(
      weekOpacityAnim,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
        delay: barIdx * 200 + 750
      }
    ).start()
  }

  _onPress() {
    this.props.onPress(this)
    if (this.state.touched) return
    this.pressAnim()
  }

  pressAnim() {
    Animated.parallel([
      Animated.timing(
        this.state.barScalAnim,
        {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: false
        }
      ),
      Animated.timing(
        this.state.weekShadowAnim,
        {
          toValue: 10,
          duration: 300,
          useNativeDriver: false
        }
      ),
      Animated.timing(
        this.state.weekColorAnim,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: false
        }
      )
    ]).start()
    this.setState((state) => {
      return {
        ...state,
        touched: true
      }
    })
  }

  _cancelPress() {
    if (!this.state.touched) return
    this.cancelAnim()
  }

  cancelAnim() {
    Animated.parallel([
      Animated.timing(
        this.state.barScalAnim,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }
      ),
      Animated.timing(
        this.state.weekShadowAnim,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: false
        }
      ),
      Animated.timing(
        this.state.weekColorAnim,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: false
        }
      )
    ]).start()
    this.setState((state) => {
      return {
        ...state,
        touched: false
      }
    })
  }

  render() {
    let {
      heightAmin,
      barOpacityAnim,
      barScalAnim,
      imgScale,
      opacityAnim,
      weekOpacityAnim,
      weekShadowAnim,
      point,
      touched,
      barIdx,
      value
    } = this.state
    let weekTextColor = this.state.weekColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [barIdx === 6 ? 'white' : 'black', point.color],
    });
    let styleProps = {
      height: heightAmin,
      backgroundColor: point.color,
      opacity: barOpacityAnim
      // transform: [{translateY: scaleAnim}]
    }
    let fridayProps = {
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white'
    }
    return (
      <TouchableWithoutFeedback onPress={this._onPress.bind(this)}>
        <View style={styles.myBar}>
          <Animated.View style={[styles.normalBar, styleProps, ,{transform: [{scale:barScalAnim}]}]}>
            {touched ? (<LinearGradient colors={this.state.point.liner} style={styles.linerBar}>
              <Animated.Text style={[styles.text,{opacity: opacityAnim}]}>{value}</Animated.Text>
              <Animated.Image source={this.state.point.img} style={[styles.img, {transform: [{scaleX:imgScale},{scaleY: imgScale}]}]} />
            </LinearGradient>) : [
              <Animated.Text key='text' style={[styles.text,{opacity: opacityAnim}]}>{value}</Animated.Text>,
              <Animated.Image key='image' source={this.state.point.img} style={[styles.img, {transform: [{scaleX:imgScale},{scaleY: imgScale}]}]} />
              ]}
          </Animated.View>
          <Animated.View style={[styles.textBlock, barIdx === 6 && fridayProps, {opacity: weekOpacityAnim,
            elevation: weekShadowAnim
            }]}>
            <Animated.Text style={[{color: barIdx === 6 && fridayProps.color}],{color: weekTextColor}}>{week[barIdx]}</Animated.Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
const styles = StyleSheet.create({
  normalBar: {
    borderRadius: 50,
    width: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  linerBar: {
    width: 25,
    height: '100%',
    borderRadius:50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    borderColor: 'white',
    borderWidth: 1.5
  },
  text: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    top: 4,
  },
  img: {
    width: 20,
    height: 20,
    opacity: 0.8,
    position: 'absolute',
    bottom: 3
  },
  textBlock: {
    width: 25,
    height: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: {
      height: 10,
      width: 0
    }
  },
  myBar: {
    display: 'flex',
    justifyContent: 'flex-end',
  }
})
