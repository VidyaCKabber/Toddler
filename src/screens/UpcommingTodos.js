//import liraries
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { List,ListItem } from 'react-native-elements'
import {db} from './config/SqliteConnect';

// create a component
export function showUpcommingTodos(props) {
  const [upcomming, setUpcomming] = useState([]);
  /** get all created tasks*/
  useEffect(() => {
    getAllUpcommingTasks();
  }, [db]);

  function getDayOfWeek(date) {
    const gsDayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    const d = new Date(date);
    const dayName = gsDayNames[d.getDay()];
    return dayName;
  }

  function getAllUpcommingTasks() {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'SELECT * FROM `upcomming`';
        tx.executeSql(squery, [], (tx, results) => {
          var len = results.rows.length;
          console.log('length of upcomming', len);
          /**make todos array empty on each load*/
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              //console.log("upcomming.date => ",results.rows.item(i).created_on);
              setUpcomming(upcomming => [
                ...upcomming,
              results.rows.item(i).created_on,
              ]);
            }
          }
        });
      });
    });
  }
  return (
      <FlatList
        data={upcomming}
        renderItem={({ item,index }) => (
          <TouchableOpacity onPress={() => props.navigation.navigate("Upcomming",{todoDate:item,isUpcomming:true})}>
            <ListItem
              key={index}
              title={item}
              subtitle={getDayOfWeek(item)}
              bottomDivider
            />
          </TouchableOpacity>
        )}
      />
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});
