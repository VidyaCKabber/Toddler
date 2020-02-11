//import liraries
import React from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Todo} from './src/screens/Todo';
import {HomeScreen} from './src/screens/Home';
import {showUpcommingTodos} from './src/screens/UpcommingTodos';

const AppNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerShown: false,
      }),
    },
    Today: {
      screen: Todo,
      navigationOptions: () => ({
        title: 'Today',
      }),
    },
    Tomorrow: {
      screen: Todo,
      navigationOptions: () => ({
        title: 'Tomorrow',
      }),
    },
    Upcomming: {
      screen: Todo,
      navigationOptions: () => ({
        title: 'Upcomming',
      }),
    },
    showUpcomming : {
      screen:showUpcommingTodos,
      navigationOptions : () => ({
        title: 'All Upcomming Todos',
      })
    }
  },
  {initialRouteName: 'HomeScreen'},
);

const AppContainer = createAppContainer(AppNavigator);

// create a component
export default function App() {
  return (
    <View style={{flex: 1}}>
      <AppContainer />
    </View>
  );
}
