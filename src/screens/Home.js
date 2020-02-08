//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-modal-datetime-picker';
import {Surface, FAB} from 'react-native-paper';
// create a component
export function HomeScreen(props) {

    const [isVisible,setIsVisible] = useState(false);

    function test (){
        alert("Hi")
    }

        const setDate = (getDay) =>{
        //get the date in data/month/year format
        var date = new Date();
        if(getDay === "Today"){
            var day = date.getDate();
        } else if (getDay === "Tomorrow"){
            var day = date.getDate()+1;
        } else{
            //get the chosen date
            var day = getDay.getDate();
            var month = getDay.getMonth() + 1; // months from 1-12
            var year = getDay.getFullYear();
            const newdate = `${day}/${month}/${year}`;

            props.navigation.navigate("Upcomming",{todoDate:newdate,isUpcomming:true});
        }

        //set the task todo date
        const todoDate =
                    day +
                    '/' +
                    parseInt(date.getMonth() + 1) +
                    '/' +
                    date.getFullYear();
           
        props.navigation.navigate(getDay,{todoDate:todoDate,isUpcomming:false});        
    }

    const showDatePicker = () => setIsVisible(true);

    const hideDatePicker = () => setIsVisible(false);

    const handleDatePicked = date => {
        

        
        const day = date.getDate();
        const month = date.getMonth() + 1; // months from 1-12
        const year = date.getFullYear();
        const newdate = `${day}/${month}/${year}`
        `${year}-${month}-${day}`;
        
        alert(newdate);
        hideDatePicker();
    };

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
            <TouchableOpacity style={styles.surfaceContainer}>
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
