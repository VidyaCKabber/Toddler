//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Surface, FAB} from 'react-native-paper';
// create a component
export function HomeScreen(props) {

    function test (){
        alert("Hi")
    }

    return (
        <View style={styles.container}>
            <Surface style={styles.pageInfoContainer}>
                <View style={styles.displayItem}>
                    <Text>Good Morning, Vidya</Text>
                </View>
            </Surface>
            <TouchableOpacity 
                style={styles.surfaceContainer}
                onPress={() => props.navigation.navigate("TodoScreen")}>
                <Surface style={styles.surface}>
                <View style={styles.displayItem}>
                    <Text> Today </Text>
                </View>
                </Surface>
            </TouchableOpacity>
            <TouchableOpacity style={styles.surfaceContainer}>
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
            <FAB
                style={styles.fab}
                medium
                icon="plus"
                onPress={() => test()}
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
