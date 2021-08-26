import React, {Component, Fragment, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient'
import { StyleSheet, Text, View, Image,Animated, TouchableWithoutFeedback } from 'react-native'
import { week } from '../constant/constant';
const defaultHeight = 1.8
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

const myBar = (props) => {
  const { value, barIdx, onPress } = props
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

  const heightAmin = useRef(new Animated.Value(28)).current
  const barOpacityAnim = useRef(new Animated.Value(0)).current
  const imgScale = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const weekOpacityAnim = useRef(new Animated.Value(0)).current
  const weekShadowAnim = useRef(new Animated.Value(0)).current
  const weekColorAnim = useRef(new Animated.Value(0)).current
  const barScalAnim = useRef(new Animated.Value(1)).current
  const [touched, setTouched] = useState(false)
  React.useEffect(() => {
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
  }, [heightAmin,barOpacityAnim,imgScale,opacityAnim,weekOpacityAnim])
  React.useEffect(() => {
    function _onPress() {
      onPress(setTouched)
      Animated.parallel([
        Animated.timing(
          barScalAnim,
          {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: false
          }
        ),
        Animated.timing(
          weekShadowAnim,
          {
            toValue: 10,
            duration: 300,
            useNativeDriver: false
          }
        ),
        Animated.timing(
          weekColorAnim,
          {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
          }
        )
      ]).start()
    }
    function _cancelPress() {
      Animated.parallel([
        Animated.timing(
          barScalAnim,
          {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }
        ),
        Animated.timing(
          weekShadowAnim,
          {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
          }
        ),
        Animated.timing(
          weekColorAnim,
          {
            toValue: 0,
            duration: 300,
            useNativeDriver: false
          }
        )
      ]).start()
    }
    touched ? _onPress() : _cancelPress()
  }, [touched,weekColorAnim,weekShadowAnim,barScalAnim])

  let weekTextColor = weekColorAnim.interpolate({
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
    <TouchableWithoutFeedback onPress={() => setTouched(!touched)}>
      <View style={styles.myBar}>
        <Animated.View style={[styles.normalBar, styleProps, ,{transform: [{scale:barScalAnim}]}]}>
          {touched ? (<LinearGradient colors={point.liner} style={styles.linerBar}>
            <Animated.Text style={[styles.text,{opacity: opacityAnim}]}>{value}</Animated.Text>
            <Animated.Image source={point.img} style={[styles.img, {transform: [{scaleX:imgScale},{scaleY: imgScale}]}]} />
          </LinearGradient>) : [
            <Animated.Text key='text' style={[styles.text,{opacity: opacityAnim}]}>{value}</Animated.Text>,
            <Animated.Image key='image' source={point.img} style={[styles.img, {transform: [{scaleX:imgScale},{scaleY: imgScale}]}]} />
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

export default myBar

const styles = StyleSheet.create({
  normalBar: {
    borderRadius: 50,
    width: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  linerBar: {
    width: 30,
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
    width: 30,
    height: 30,
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
