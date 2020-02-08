//import liraries
import React, {Component, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TodoList from './TodoList';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({
  name: 'test2.sqlite3',
  createFromLocation: '~todo.sqlite3',
});

//get the date in data/month/year format
var date = new Date();
today =
  date.getDate() +
  '/' +
  parseInt(date.getMonth() + 1) +
  '/' +
  date.getFullYear();

// create a component
export function MyComponent() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([]);
  const [percent, setPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tasDonedOn, setTasDonedOn] = useState(today);

  const createTodo = () => {
    return new Promise(() => {
      db.transaction(tx => {
        const squery =
          'INSERT INTO `mytask` (`id`,`name`,`created_on`,`completed_on`) VALUES (?,?,?,?)';
        tx.executeSql(
          squery,
          [Date.now(), value, today, ''],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              setValue('');
              setTodos(todos => [
                ...todos,
                {text: value, key: Date.now(), checked: false},
              ]);
              console.log('Created successfully!');
            } else {
              console.log('failed!');
            }
          },
          error => {
            console.log('failed!', error);
          },
        );
      });
    });
  };

  //get completed task count
  async function completedTodo(count, value) {
    console.log(" parseInt(value) ",parseInt(value))
    await setCount(count => count + parseInt(value));
  }

  function getAllTasks() {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'SELECT * FROM `mytask`;';
        tx.executeSql(squery, [], (tx, results) => {
          var len = results.rows.length;
          /**make todos array empty on each load*/
          setTodos([]);
          //set initial completed tasks count to  zero
          setCount(0);
          //setCount(0);
          if (len > 0) {
            console.log('len : ', len);
            for (let i = 0; i < len; i++) {
              const isCompleted = results.rows.item(i).completed_on;

              /**store all created tasks in todos array */
              setTodos(todos => [
                ...todos,
                {
                  text: results.rows.item(i).name,
                  key: Date.now(),
                  checked:
                    isCompleted == ''
                      ? false
                      : true /** check the completed tasks */,
                },
              ]);
              //get count of completed task
              if (isCompleted !== '') {
                  completedTodo(count, '+1');
              }
            }
            setIsLoading(true); /**all the tasks are loaded */
          }
        });
      });
    });
  }

  useEffect(() => {
    getAllTasks();
  }, [db]);

  
  useEffect(() => {
    completionPercentage();
  });

  //calculate the completed tasks percentage
  function completionPercentage () {
    console.log(" count in ",count);
    const result = (count / (todos.length)) * 100;
    setPercent(parseInt(result));
    console.log('percentage : ', percent);
  }
  const completeTodo = async (task_name, isCompleted) => {
    setTodos(
      todos.map(todo => {
        if (todo.text === task_name) todo.checked = !todo.checked;
        return todo;
      }),
    );

    return new Promise(() => {
      //if tasks is completed then update the completed date
      if (!isCompleted) {
        setTasDonedOn('');
       
      } else {
        setTasDonedOn(today);
        
      }

      console.log("tasDonedOn",tasDonedOn);
      db.transaction(tx => {
        const squery = 'UPDATE `mytask` SET `completed_on`=?  WHERE `name`=?;';
        tx.executeSql(
          squery,
          [tasDonedOn, task_name],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Successfully Updated');
              //change completed tasks status
              if (!isCompleted) {
                completedTodo(count,'+1');
              } else {
                completedTodo(count,'-1');
              }
            }
          },
          error => {
            console.log('update failed!', error);
          },
        );
      });
      
    });
    
  };

  /**Delete the task using task_name */
  const deleteTodo = task_name => {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'DELETE FROM `mytask` WHERE `name`=?;';
        tx.executeSql(
          squery,
          [task_name],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              /**Remove deleted item from the array */
              setTodos(todos.filter(todos => todos !== task_name));

              getAllTasks(); /**Reload all tasks */
              console.log('Deleted task is : ', task_name);
            } else {
              console.log('failed!');
            }
          },
          error => {
            console.log('failed!', error);
          },
        );
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Plan</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder="What do you want to do today?"
          placeholderTextColor="#abbabb"
          value={value}
          onChangeText={value => setValue(value)}
        />
        <TouchableOpacity onPress={() => createTodo()}>
          <Icon name="plus" size={30} color="blue" style={{marginLeft: 15}} />
        </TouchableOpacity>
      </View>

      <View style={styles.completionPercentage}>
        {percent == 0 ? (
          <Text> Start working on your tasks </Text>
        ) : percent < 100 ? (
          <Text> {percent}% tasks are completed </Text>
        ) : (
          <Text>
            Congratulation, you met your mile stone!!!. Good going, keep it up.{' '}
          </Text>
        )}
      </View>
     
        <ScrollView style={{width: '100%'}}>
          {todos.length > 0 ? (
            todos.map(item => (
              <TodoList
                text={item.text}
                key={item.key}
                checked={item.checked}
                setChecked={() => completeTodo(item.text, item.checked)}
                deleteTodo={() => deleteTodo(item.text)}
              />
            ))
          ) : (
            <View style={styles.noTask}>
              <Text style={styles.noTaskTitle}>
                {' '}
                No tasks planned for today
              </Text>
            </View>
          )}
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
  completionPercentage: {
    marginTop: '5%',
    flexDirection: 'row',
    borderColor: 'blue',
    borderBottomWidth: 3,
    width: '100%',
    alignItems: 'stretch',
    minHeight: 40,
  },
  header: {
    marginTop: '15%',
    fontSize: 25,
    color: 'blue',
    fontWeight: 'bold',
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
  noTask: {
    marginTop: '50%',
    alignItems: 'center',
  },
  noTaskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});



const insetBillDetails = () => {
  return new Promise(() => {
    db.transaction(tx => {
      const squery =
        'INSERT INTO `tablename` (`ItemId`,`ItemName`,`Price`,`Quantity`,`CategoryId`,`printId`,`storeId`,`printed`,`kitchenId`,`taxId`,`taxSet`,`TaxAmt`,`pmttype`,`datebill`,`uploaded`,`cooked1`,`cooked2`,`cookedby`,`cooked1time`,`cooked2time`,`partnername`,`orderid`,`delivered`,`deltime`) VALUES (?,?,?,?)';
      tx.executeSql(
        squery,
        [value1,value2,value3,value4,],
        (tx, results) => {
          /** on success, Results = 1 */
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Inserted successfully!');
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

`ItemId`,`ItemName`,`Price`,`Quantity`,`CategoryId`,`printId`,`storeId`,
`printed`,`kitchenId`,`taxId`,`taxSet`,`TaxAmt`,`pmttype`,`datebill`,`uploaded`,`cooked1`,`cooked2`,
`cookedby`,`cooked1time`,`cooked2time`,`partnername`,`orderid`,`delivered`,`deltime`



























