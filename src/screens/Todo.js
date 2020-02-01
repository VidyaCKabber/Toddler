//import liraries
import React, {Component, useState, useEffect} from 'react';
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

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({
  name: 'test.sqlite3',
  createFromLocation: '~example.sqlite3',
});
// create a component
export function MyComponent() {
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([]);

  const addToto = () => {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'INSERT INTO `first` (`name`) VALUES (?)';
        tx.executeSql(
          squery,
          [value],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              setValue('');
              setTodos(todos => [
                ...todos,
                {text: value, key: Date.now(), checked: false},
              ]);
              console.log('Created successfully!');
            } else {
              console.log('failed!');
            }
          },
          error => {
            console.log('failed!', error);
          },
        );
      });
    });
  };

  function getAllTasks() {
    db.transaction(tx => {
      const squery = 'SELECT * FROM `first`;';
      tx.executeSql(squery, [], (tx, results) => {
        var len = results.rows.length;
        /**make todos array empty on each load*/
        setTodos([]);
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            /**store all created tasks in todos array */
            setTodos(todos => [
              ...todos,
              {
                text: results.rows.item(i).name,
                key: Date.now(),
                checked: false,
              },
            ]);
          }
        }
      });
    });
  }

  useEffect(() => {
    getAllTasks();
  }, [db]);

  
  const checkTodo = id => {
    setTodos(
      todos.map(todo => {
        if (todo.key === id) todo.checked = !todo.checked;
        return todo;
      }),
    );
  };

  /**Delete the task using task name */
  const deleteTodo = task_name => {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'DELETE FROM `first` WHERE `name`=?;';
        tx.executeSql(
          squery,
          [task_name],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              
              setTodos(todos.filter(todos => todos !== task_name));/**Remove deleted item from the array */
              
              getAllTasks();/**Reload all tasks */
              console.log('Deleted successfully!');
            } else {
              console.log('failed!');
            }
          },
          error => {
            console.log('failed!', error);
          },
        );
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Plan</Text>
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
        {todos.length > 0 ? (
          todos.map(item => (
            <TodoList
              text={item.text}
              key={item.key}
              checked={item.checked}
              setChecked={() => checkTodo(item.key)}
              deleteTodo={() => deleteTodo(item.text)}
            />
          ))
        ) : (
          <View style={styles.noTask}>
              <Text style={styles.noTaskTitle}> No tasks planned for today</Text>
          </View>
        )}
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
    fontSize: 25,
    color: 'blue',
    fontWeight:'bold',
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
  noTask : {
    marginTop:'50%',
    alignItems:'center',
  },
  noTaskTitle : {
    fontSize:20,
    fontWeight:'bold',
  }
});
