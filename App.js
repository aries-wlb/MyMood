import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, TextInput, View, SafeAreaView, Dimensions,Button,Text } from 'react-native'
import Mood from './src/page/Mood'

function HomeScreen({ navigation }) {
  const [mood, onMoodChange] = React.useState('86,80,,90,92,100,81');
  const [name, onNameChange] = React.useState('李强');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        输入姓名
      </Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, minWidth: 200, marginBottom: 20 }}
        onChangeText={text => onNameChange(text)}
        value={name}
      />
      <Text>
        输入历史心情指数,逗号分隔
      </Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, minWidth: 200, marginBottom: 20 }}
        onChangeText={text => onMoodChange(text)}
        value={mood}
      />
      <Button
        title="查看历史心情指数"
        onPress={() => navigation.navigate('Mood', {
          moods:mood,
          name
        })}
      />
    </View>
  );
}

function MoodScreen({ route }) {
  // const moods = [96,20]
  let moods = [86,80,null,90,92,97,81]
  if(route.params.moods){
    moods = route.params.moods.split(',').map(item => {
      if(parseFloat(item) == item)return parseInt(item)
      return item
    })
    
  }
  const name = route.params.name || '李强'
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
        <Stack.Screen
          name="Mood"
          options={{
            title: '历史心情指数',
            headerStyle:{
              borderBottomWidth: 0,
              elevation: 0,
            },
            headerShadowVisible: false,
        }}
          component={MoodScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  layer: {
    display: 'flex',
    backgroundColor: 'white',
  }
})

export default App;