//import liraries
import React, {useState, useEffect} from 'react';
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
import {db} from './config/SqliteConnect';
import {appColor,notaskMsg, startMsg, completedMsg} from './config/constVars';

// create a component
export function Todo(props) {
  const todoDate = props.navigation.getParam('todoDate');
  const isUpcomming = props.navigation.getParam('isUpcomming');
  const [count, setCount] = useState(0);
  const [value, setValue] = useState('');
  const [todos, setTodos] = useState([]);
  const [percent, setPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  console.log(' isUpcomming => ', isUpcomming);

  const createTodo = () => {
    if(value != ''){
      return new Promise(() => {
        db.transaction(tx => {
          const squery =
            'INSERT INTO `mytask` (`id`,`name`,`created_on`,`completed_on`) VALUES (?,?,?,?)';
          tx.executeSql(
            squery,
            [Date.now(), value, todoDate, 0],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                setValue('');
                setTodos(todos => [
                  ...todos,
                  {text: value, key: Date.now(), checked: false},
                ]);
                console.log('Created successfully!');
                setIsLoading(false);
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
    } else {
      alert("Field cannot empty!!")
    }
  };

  //get completed task count, incrementing and decrementing both handled in the same function
  async function completedTodo(count, value) {
    await setCount(count => count + parseInt(value));
  }

  /** get all created tasks*/

  function getAllTasks() {
    return new Promise(() => {
      db.transaction(tx => {
        const squery = 'SELECT * FROM `mytask` WHERE `created_on`=?;';
        tx.executeSql(squery, [todoDate], (tx, results) => {
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
                    isCompleted == 0
                      ? false
                      : true /** isCompleted == 0 incomplete task */,
                },
              ]);
              //get count of completed task,isCompleted != 0, completed tasks
              if (isCompleted != 0) {
                completedTodo(count, '+1');
              }
            }
            setIsLoading(false); /**all the tasks are loaded */
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
  function completionPercentage() {
    const result = (count / todos.length) * 100;
    setPercent(parseInt(result));
  }

  const completeTodo = async (task_name, isChecked) => {
    setTodos(
      todos.map(todo => {
        if (todo.text === task_name) todo.checked = !todo.checked;
        return todo;
      }),
    );

    return new Promise(() => {
      db.transaction(tx => {
        const squery =
          'UPDATE `mytask` SET `completed_on`=?  WHERE `name`=? AND `created_on`=?;';
        tx.executeSql(
          squery,
          [isChecked ? todoDate : 0, task_name, todoDate],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Successfully Updated');

              //change completed tasks status
              if (isChecked) {
                completedTodo(count, '+1');
              } else {
                completedTodo(count, '-1');
              }
            }
          },
          error => {
            console.log('updation failed!', error);
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

              /**Reload all tasks */
              getAllTasks();
              console.log(task_name, 'deleted successfully');
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
  return (
    <View style={styles.container}>
      <Text style={styles.header}>TASKS</Text>
      {isUpcomming ? <Text style={styles.upcomming}>{todoDate}</Text> : false}
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder="What do you want to do?"
          placeholderTextColor="#abbabb"
          value={value}
          onChangeText={value => setValue(value)}
        />
        <TouchableOpacity onPress={() => createTodo()}>
          <Icon name="plus" size={30} color={appColor}  style={{marginLeft: 15}} />
        </TouchableOpacity>
      </View>

      {todos.length > 0 ? (
        <View style={styles.displayContent}>
          <View style={styles.completionPercentage}>
            {percent == 0 ? (
              <Text style={styles.message}>{startMsg}</Text>
            ) : percent < 100 ? (
              <Text style={styles.message}>
                {' '}
                {percent}% tasks are completed{' '}
              </Text>
            ) : (
              <Text style={styles.message}>{completedMsg}</Text>
            )}
          </View>
          <ScrollView>
            {isLoading ? (
              <View style={{flex: 1, paddingTop: 20}}>
                <ActivityIndicator />
              </View>
            ) : (
              todos.map(item => (
                <TodoList
                  text={item.text}
                  key={item.key}
                  checked={item.checked}
                  setChecked={() =>
                    completeTodo(
                      item.text,
                      (status = item.checked ? 0 : todoDate),
                    )
                  }
                  deleteTodo={() => deleteTodo(item.text)}
                />
              ))
            )}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.noTask}>
          <Text style={styles.noTaskTitle}> {notaskMsg} </Text>
        </View>
      )}
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
  displayContent: {
    flex: 1,
    width: '100%',
  },
  message: {
    fontSize: 20,
  },
  completionPercentage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    borderColor: appColor,
    borderBottomWidth: 3,
    width: '100%',
    alignItems: 'stretch',
    //minHeight: 50,
  },
  header: {
    marginTop: 20,
    fontSize: 25,
    color: appColor,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  textInputContainer: {
    marginTop: 10,
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
    paddingLeft: 20,
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
  upcomming: {
    backgroundColor: appColor,
    borderRadius: 20,
    fontSize: 20,
  },
});
