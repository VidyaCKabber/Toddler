//import liraries
import React, { Component,useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyComponent } from './src/screens/Todo';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({
  name: 'test.sqlite3',
  createFromLocation: '~example.sqlite3',
});

// create a component
export default function App(){

  useEffect(() =>{
    const user_name = "Tanu";
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO first (name) VALUES (?)',
              ["Heema"],
        (tx, results) => {
          console.log('asdfasd', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok'
                },
              ],
              { cancelable: false }
            );
          } else {
            alert('Please insert a valid User Id');
          }
        }
      );

      //===========
      const squery = 'SELECT `name` FROM `first`;';
      tx.executeSql(squery, [], (tx, results) => {
        var len = results.rows.length;
        console.log('len : ', len);
        if (len > 0) {
          for (let i = 0; i < 10; i++) {
            console.log(results.rows.item(i));
            
          }
        }
      });

    });
    
    })

        

  return (
    <MyComponent/>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#2c3e50',
  },
});

//====================================================================

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

    // db.transaction(tx => {
    //   try{
    //     setCount(count+1);
    //     console.log('testing');
    //     tx.executeSql(
    //       'INSERT INTO mytask (id,task_name) VALUES (?,?)',
    //             [count,value],
    //       (tx, results) => {
    //         console.log('number of row afcted', results.rowsAffected);
    //         if (results.rowsAffected > 0) {
    //           alert(
    //             'Success',
    //             'User created successfully',
    //             [
    //               {
    //                 text: 'Ok'
    //               },
    //             ],
    //             { cancelable: false }
    //           );
    //         } else {
    //           alert('Please insert a valid User Id');
    //         }
    //       }
    //     );
    //   }
    //   catch(err){
    //     alert(err);
    //   }
    //   //===========
    //   const squery = 'SELECT * FROM `mytask`;';
    //   tx.executeSql(squery, [], (tx, results) => {
    //     var len = results.rows.length;
    //     console.log('len : ', len);
    //     if (len > 0) {
    //       for (let i = 50; i < len; i++) {
    //         console.log(i,' : ',results.rows.item(i).name);
            
    //       }
    //     }
    //   });
    // })

    return new Promise(() => {
    
      db.transaction((tx) => {
          tx.executeSql('INSERT INTO `first` (`name`) VALUES (?)', [value], (tx, results) => {
            if (results.rowsAffected > 0) {
                  setValue('');
                  getAllTasks();
                  console.log('Created successfully!');
              } else {
                  console.log('failed!');
              }
          }, (error) => {
                console.log('failed!',error);
          });
      })
  })
  };

  function getAllTasks(){
    db.transaction((tx) => {
      const squery = 'SELECT * FROM `first`;';
        tx.executeSql(squery, [], (tx, results) => {
          var len = results.rows.length;
          console.log('sssssssssssss : ', len);
          if (len > 0) {
            for (let i = 15; i < 22; i++) {
              setTodos([...todos, {text: results.rows.item(i).name, key: Date.now(), checked: false}]);
            }
          }
        });
      })
  }
  useEffect(()=>{
    getAllTasks();
},[db])

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

