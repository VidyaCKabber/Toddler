//import liraries
import React from 'react';
import {View}  from "react-native";
import {Todo} from './src/screens/Todo';
import {HomeScreen} from './src/screens/Home';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen:HomeScreen,
      navigationOptions:() => ({
        headerShown: false
      })
    },
    TodoScreen: {
      screen:Todo,
      navigationOptions:() => ({
        title:"Today"
      })
    },
  },
  {initialRouteName: "HomeScreen"},
);

const AppContainer = createAppContainer(AppNavigator);

// create a component
export default function App() {
  return (
    <View style={{flex:1}}>
      <AppContainer />
    </View>
  );
}

