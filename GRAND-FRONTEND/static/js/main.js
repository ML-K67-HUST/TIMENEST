
let currentView = 'week-view';

document.addEventListener('DOMContentLoaded', function () {
  getUserTasks().then((tasks) => {
    console.log("tasks from api ");
    console.log(tasks);
    addTaskFromDB(tasks);
  });
  changeWeekView();
  initializeChat();
  initializeModal();
  initializeProgressTracker();

  const logout = document.getElementById('logoutBtn');
  logout.onclick = function () {
    window.location.href = '/create-account';
  };

});
function convertTimestampToDateTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}
function addTaskFromDB(tasks) {
  // getUserTasks().then((tasks) => {
  //   tasks.forEach((task) => {
  //     addTaskToCalendarFromDB(task);
  //   });
  // });
  const container = document.querySelector('.time-slots');
  if (!container) {
    console.error("Cannot add tasks because .time-slots container does not exist.");
    return;
  }
  console.log("insert vao db thui")
  console.log(tasks)
  tasks.forEach((task) => {
    console.log("1 task")
    console.log(task)
    task.startTime = convertTimestampToDateTime(task.start_time)
    task.endTime = convertTimestampToDateTime(task.end_time)
    task.taskName = task.task_name
    task.taskDescription = task.task_description
    if (taskOccursInCurrentWeek(task)) {
      addTaskToCalendarFromDB(task);
    }
  });
}

function nextPeriod() {
  if (currentView === 'week-view'){
    nextWeek();
  }else{
    nextMonth();
  }
}

function previousPeriod() {
  if (currentView === 'week-view'){
    previousWeek();
  }else{
    previousMonth();
  }
}