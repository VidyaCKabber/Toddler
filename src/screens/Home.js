//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DatePicker from 'react-native-modal-datetime-picker';
import {Surface, FAB, withTheme} from 'react-native-paper';
import {db} from './config/SqliteConnect';
import {quote,appColor} from './config/constVars';

// create a component
export function HomeScreen(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [isloading, setIsloading] = useState(false);

  const setDate = getDay => {
    //get the date in data/month/year format
    var date = new Date();
    if (getDay === 'Today') {
      var day = date.getDate();
    } else if (getDay === 'Tomorrow') {
      var day = date.getDate() + 1;
    } else if (getDay === 'showUpcomming') {
      props.navigation.navigate(getDay);
    } else {
      //store upcomming task date
      saveUpcommingTasks(getDay);
    }

    //set the task todo date
    const todoDate =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + day).slice(-2);

    hideDatePicker();
    //navigate to todo page
    props.navigation.navigate(getDay, {todoDate: todoDate, isUpcomming: false});
  };

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
              hideDatePicker();
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

  useEffect(() => {
    //set intervals for 1 minute
    setInterval(() => {
      const hrs = new Date().getHours();
      var greet;

      if (hrs < 12) greet = 'Good Morning..';
      else if (hrs >= 12 && hrs < 17) greet = 'Good Afternoon..';
      else if (hrs >= 17 && hrs <= 21) greet = 'Good Evening..';
      else greet = 'Good Night..';

      setGreeting(greet); /**set the state variable */
    }, 5000);

    if(greeting != ''){
      setIsloading(false);
    }
    
  });
  return isloading ? (
    <View style={{flex: 1, paddingTop: 20, marginTop:'50%'}}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={styles.container}>
      <Surface style={styles.pageInfoContainer}>
        <View style={styles.greetMsg}>
          <Text style={{fontSize:20,fontWeight: 'bold',color: '#2b3595'}}>{greeting}</Text>
        </View>
        <View style={styles.quote}>
          <Text style={{fontSize:17,fontWeight: 'bold',color: '#2b3595'}}>" {quote} "</Text>
        </View>
      </Surface>

      <TouchableOpacity
        style={styles.surfaceContainer}
        onPress={() => setDate('Today')}>
        <Surface style={styles.surface}>
          <View>
            <Text> TODAY </Text>
          </View>
        </Surface>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.surfaceContainer}
        onPress={() => setDate('Tomorrow')}>
        <Surface style={styles.surface}>
          <View>
            <Text> TOMORROW</Text>
          </View>
        </Surface>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.surfaceContainer}
        onPress={() => setDate('showUpcomming')}>
        <Surface style={styles.surface}>
          <View>
            <Text> UPCOMMING </Text>
          </View>
        </Surface>
      </TouchableOpacity>
      <DatePicker
        mode="date"
        minimumDate={new Date()}
        isVisible={isVisible}
        onConfirm={setDate}
        onCancel={hideDatePicker}
      />
      <FAB style={styles.fab} icon="plus" onPress={() => showDatePicker()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginTop: 16,
    width: 350,
  },
  surfaceContainer: {
    marginTop: 15,
  },
  pageInfoContainer: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    elevation: 8,
    backgroundColor: '#fcf9ea',
  },
  surface: {
    padding: 8,
    height: 80,
    width: 'auto',
    borderBottomEndRadius: 100,
    borderTopStartRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    backgroundColor: appColor,
  },
  fab: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0278ae',
  },
  quote: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  greetMsg: {
    marginTop: 5,
    padding: 2,
  },
});
