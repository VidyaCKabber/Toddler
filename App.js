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
      
      return new Promise(() => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO `first`(`name`) VALUES (?)', ['hima'], (tx, results) => {
              console.log("results.rowsAffected",results.rowsAffected);  
              if (results.rowsAffected > 0) {
                    console.log('Created successfully!');
                } else {
                  console.log('failed!');
                }
               
            }, (error) => {
              console.log('failed!',error);
            });
        })
    })

    
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


