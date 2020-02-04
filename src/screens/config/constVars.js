//get the date in data/month/year format
var date = new Date();
export const today =
  date.getDate() +
  '/' +
  parseInt(date.getMonth() + 1) +
  '/' +
  date.getFullYear();

export const notaskMsg   = 'No tasks planned for today';
export const  startMsg    = 'Start working on your tasks';
export const  completedMsg = 'Congratulation, you met your mile stone!!!. Good going, keep it up';
