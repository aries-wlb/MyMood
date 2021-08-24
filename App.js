import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native'
import Mood from './src/page/Mood'

const App = () => {
  const moods = [86,80,null,90,92,97,81]
  const name = '李强'
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layer}>
        <Mood name={name} moods={moods}></Mood>
      </View>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height
  },
  layer: {
    display: 'flex',
    flexDirection: 'row',
  }
})
