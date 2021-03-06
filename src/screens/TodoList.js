//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// create a component
export default function TodoList(props) {
  return (
    <View style={styles.listContainer}>
      <Icon
        name={props.checked ? 'check-square' : 'square'}
        size={30}
        color={props.checked ? 'green' : 'black'}
        style={{marginLeft: 15}}
        onPress={props.setChecked}
      />
      <View style={styles.taskContainer}>
        <Text style={styles.listItem}>{props.text}</Text>
      </View>
      {/** disable the delete icon when the task is completed */}
      <Icon
        name="trash-2"
        size={30}
        color={props.checked ? 'gray' : 'red'}
        disabled={props.checked}
        style={styles.deleteIcon}
        onPress={props.deleteTodo}
      />
    </View>
  );
}

// define your styles
const styles = StyleSheet.create({
  listContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    borderColor: '#aaaaaa',
    borderBottomWidth: 1.5,
    width: '100%',
    alignItems: 'stretch',
    minHeight: 40,
  },
  listItem: {
    paddingBottom: 20,
    paddingLeft: 10,
    borderColor: 'green',
    borderBottomWidth: 1,
    fontSize: 17,
  },
  deleteIcon: {
    marginLeft: 'auto',
    marginRight: 15,
    marginLeft: 15,
  },
  taskContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
