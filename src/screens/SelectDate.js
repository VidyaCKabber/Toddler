//import liraries
import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import DatePicker from 'react-native-modal-datetime-picker';
import {FAB} from 'react-native-paper';
import {db} from './config/SqliteConnect';

// create a component
export function SelectDate(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const saveUpcommingTasks = getDay => {
    //get the chosen date
    var day = ('0' + getDay.getDate()).slice(-2); // months from 1-12
    var month = ('0' + (getDay.getMonth() + 1)).slice(-2);

    var year = getDay.getFullYear();
    const newdate = `${year}-${month}-${day}`;

    //store upcomming task date
    return new Promise(() => {
      db.transaction(tx => {
        console.log('newdate', newdate);
        const squery = 'INSERT INTO `upcomming`(`id`,`created_on`) VALUES(?,?)';
        tx.executeSql(
          squery,
          [Date.now(), newdate],
          (tx, results) => {
            console.log('result rowAffected', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Created successfully!');
              setIsloading(true);

              setTimeout(() => {
                setIsloading(false);
              }, 1000);
              setIsVisible(false);

              props.navigation.navigate('Upcomming', {
                todoDate: newdate,
                isUpcomming: true,
              });
            } else {
              console.log('failed!');
            }
          },
          error => {
            console.log('failed because', error);
          },
        );
      });
    });
  };

  const showDatePicker = () => setIsVisible(true);

  const hideDatePicker = () => setIsVisible(false);

  return isLoading ? (
    <View style={{flex: 1, paddingTop: 20, marginTop: '50%'}}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={{flex: 1}}>
      <DatePicker
        mode="date"
        minimumDate={new Date()}
        isVisible={isVisible}
        onConfirm={saveUpcommingTasks}
        onCancel={hideDatePicker}
      />
      <FAB style={styles.fab} icon="plus" onPress={() => showDatePicker()} />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0278ae',
  },
});
