var SQLite = require('react-native-sqlite-storage');
export const db = SQLite.openDatabase({
  name: 'test2.sqlite3',
  createFromLocation: '~todo.sqlite3',
});