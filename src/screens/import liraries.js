//import liraries
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import {db} from './config/SqliteConnect';
import {notaskMsg} from './config/constVars';

// create a component
export function showUpcommingTodos(props) {
  const [upcomming, setUpcomming] = useState([]);
  const [isloading,setIsloading] = useState(true);
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
      'Saturday',
    ];
    const d = new Date(date);
    const dayName = gsDayNames[d.getDay()];
    return dayName;
  }

  function getAllUpcommingTasks() {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'SELECT DISTINCT `created_on` FROM `upcomming`';
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
          setIsloading(false);
        });
      });
    });
  }

  const deleteUpcomming = date => {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'DELETE FROM `upcomming` WHERE `created_on`=?';
        tx.executeSql(
          squery,
          [date],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              setUpcomming(upcomming.filter(upcomming => upcomming !== date));
              console.log('Deleted successfully');
            } else {
              console.log('failed');
            }
          },
          error => {
            console.log('failed because', error);
          },
        );
      });
    });
  };
  return isloading ?
    <View style={{flex: 1, paddingTop: 20, marginTop:'50%'}}>
      <ActivityIndicator />
    </View>
  :
  upcomming.length > 0 ? (
    <FlatList
      data={upcomming}
      extraData={upcomming}
      renderItem={({item, index}) => (
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('Upcomming', {
              todoDate: item,
              isUpcomming: true,
            })
          }>
          <ListItem
            key={index}
            title={item}
            subtitle={getDayOfWeek(item)}
            leftIcon={
              <Icon
                name="trash-2"
                size={30}
                color="red"
                style={{marginLeft: 15}}
                onPress={() => deleteUpcomming(item)}
              />
            }
            rightIcon={
              <Icon
                name="chevron-right"
                size={30}
                color="gray"
                style={{marginLeft: 15}}
              />
            }
            bottomDivider
          />
        </TouchableOpacity>
      )}
    />
  ) : (
    <View style={styles.noTask}>
      <Text style={styles.noTaskTitle}> {notaskMsg} </Text>
    </View>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTask: {
    marginTop: '50%',
    alignItems: 'center',
  },
  noTaskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
