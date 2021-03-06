//import liraries
import React from 'react';
import {View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import {Todo} from './src/screens/Todo';
import {HomeScreen} from './src/screens/Home';
import {showUpcommingTodos} from './src/screens/UpcommingTodos';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0278ae',
    accent: '#2b3595',
    //#a7e9af
    //#2b3595
  },
};

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
        headerTintColor:'white',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        }
      }),
    },
    Tomorrow: {
      screen: Todo,
      navigationOptions: () => ({
        title: 'Tomorrow',
        headerTintColor:'white',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        }
      }),
    },
    Upcomming: {
      screen: Todo,
      navigationOptions: () => ({
        headerTintColor:'white',
        title: 'Upcomming',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        }
      }),
    },
    showUpcomming: {
      screen: showUpcommingTodos,
      navigationOptions: () => ({
        title: 'All Upcomming Todos',
        headerTintColor:'white',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        }
      }),
    }
  },
  {initialRouteName: 'HomeScreen'},
);



const AppContainer = createAppContainer(AppNavigator);

// create a component
export default function App() {
  console.disableYellowBox = true;
  return (
    <PaperProvider theme={theme}>
      <AppContainer />
    </PaperProvider>
  );
}
