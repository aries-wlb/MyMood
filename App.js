import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, SafeAreaView, Dimensions,Button } from 'react-native'
import Mood from './src/page/Mood'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="查看历史心情指数"
        onPress={() => navigation.navigate('Mood')}
      />
    </View>
  );
}

function MoodScreen() {
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

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: '首页' }} component={HomeScreen} />
        <Stack.Screen name="Mood" options={{ title: '历史心情指数' }} component={MoodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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

export default App;