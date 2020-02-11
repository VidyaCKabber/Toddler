//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-modal-datetime-picker';
import {Surface, FAB} from 'react-native-paper';
import {db} from './config/SqliteConnect';

// create a component
export function HomeScreen(props) {

    const [isVisible,setIsVisible] = useState(false);

        const setDate = (getDay) =>{
        //get the date in data/month/year format
        var date = new Date();
        if(getDay === "Today"){
            var day = date.getDate();
        } else if (getDay === "Tomorrow"){
            var day = date.getDate()+1;
        } else if (getDay === "showUpcomming"){
            props.navigation.navigate(getDay);
        }
        else{
            //store upcomming task date
            saveUpcommingTasks(getDay);
        }

        //set the task todo date
        const todoDate =
                    date.getFullYear()+'-'+
                    ("0" + (date.getMonth() + 1)).slice(-2) +'-'+
                    ("0" + (day)).slice(-2);
                    
           
        props.navigation.navigate(getDay,{todoDate:todoDate,isUpcomming:false});        
    }


    const saveUpcommingTasks = (getDay) => {
         //get the chosen date
         var day = ("0" + (getDay.getDate())).slice(-2)// months from 1-12
         var month =("0" + (getDay.getMonth() + 1)).slice(-2);

         var year = getDay.getFullYear();
         const newdate = `${year}-${month}-${day}`;

         console.log("newdate",newdate)
         //store upcomming task date
         return new Promise(() => {
             db.transaction(tx => {
                 console.log("newdate",newdate)
               const squery = 'INSERT INTO `upcomming`(`id`,`created_on`) VALUES(?,?)';
               tx.executeSql(
                 squery,
                 [Date.now(), newdate],
                 (tx, results) => {
                   console.log('result rowAffected', results.rowsAffected);
                   if (results.rowsAffected > 0) {
                     console.log('Created successfully!');
                     props.navigation.navigate("Upcomming",{todoDate:newdate,isUpcomming:true});
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
    }

    const showDatePicker = () => setIsVisible(true);

    const hideDatePicker = () => setIsVisible(false);

    return (
        <View style={styles.container}>
            <Surface style={styles.pageInfoContainer}>
                <View style={styles.displayItem}>
                    <Text>Good Morning, Vidya</Text>
                </View>
            </Surface>
            <TouchableOpacity 
                style={styles.surfaceContainer}
                onPress={() => setDate("Today")}>
                <Surface style={styles.surface}>
                <View style={styles.displayItem}>
                    <Text> Today </Text>
                </View>
                </Surface>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.surfaceContainer}
                onPress={() => setDate("Tomorrow")}>
                <Surface style={styles.surface}>
                <View style={styles.displayItem}>
                    <Text> Tomorrow</Text>
                </View>
                </Surface>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.surfaceContainer}
                onPress={() =>  setDate("showUpcomming")}>
                <Surface style={styles.surface}>
                <View style={styles.displayItem}>
                    <Text> Upcomming </Text>
                </View>
                </Surface>
            </TouchableOpacity>
            <DatePicker
                mode="date"
                isVisible={isVisible}
                onConfirm={setDate}
                onCancel={hideDatePicker}
              />
            <FAB
                style={styles.fab}
                medium
                icon="plus"
                onPress={() => showDatePicker()}
            />
        </View>
    );  
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        marginTop:15,
        marginLeft:20,
        marginRight:20
    },
    surfaceContainer : {
        marginTop:15
    },
    pageInfoContainer:{
        padding: 8,
        height: 80,
        width: 'auto',
        marginTop:20,
        marginBottom:30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    surface: {
        padding: 8,
        height: 80,
        width: 'auto',
        borderBottomEndRadius:50,
        borderTopStartRadius:50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    fab: {
        marginTop:50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:'#00a8b5'
      },
});
