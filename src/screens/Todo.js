//import liraries
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TodoList from './TodoList';
// create a component
export function MyComponent() {
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([]);

  const addToto = () => {
    if (value.length > 0) {
      setTodos([...todos, {text: value, key: Date.now(), checked: false}]);
      setValue('');
    }
  };

  const checkTodo = id => {
    setTodos(
      todos.map(todo => {
        if (todo.key === id) todo.checked = !todo.checked;
        return todo;
      }),
    );
  };

  const deleteTodo = id => {
    setTodos(
      todos.filter(todo => {
        if (todo.key !== id) {
          return true;
        }
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Test</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder="What do you want to do today?"
          placeholderTextColor="#abbabb"
          value={value}
          onChangeText={value => setValue(value)}
        />
        <TouchableOpacity onPress={() => addToto()}>
          <Icon name="plus" size={30} color="blue" style={{marginLeft: 15}} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{width: '100%'}}>
        {todos.map(item => (
          <TodoList
            text={item.text}
            key={item.key}
            checked={item.checked}
            setChecked={() => checkTodo(item.key)}
            deleteTodo={() => deleteTodo(item.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    marginTop: '15%',
    fontSize: 20,
    color: 'red',
    paddingBottom: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingRight: 10,
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
    minHeight: '3%',
  },
});
