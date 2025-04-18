document.querySelector('.change-view').addEventListener('click', function () {
  const menu = document.querySelector('.dropdown-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Optional: Close the menu when clicking outside of it
window.addEventListener('click', function (event) {
  if (!event.target.matches('.change-view')) {
    const menu = document.querySelector('.dropdown-menu');
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    }
  }
});

window.addEventListener('click', function (event) {
  const itemOne = document.getElementById('item1');
  // Check if the click is outside of item-1
  if (itemOne && !itemOne.contains(event.target)) {
    itemOne.classList.remove('expanded');
  }
});

function loadView(view) {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = ''; // Xóa nội dung hiện tại

  return fetch(view)
    .then((response) => response.text())
    .then((data) => {
      calendarContainer.innerHTML = data; // Thay thế nội dung của container
    })
    .catch((error) => console.error('Error loading view:', error));
}

function changeWeekView(){
    currentView = 'week-view';
    loadView('week_view').then(() => {
        // Sau khi load hoàn tất, chạy renderCalendar
        initializeCalendar();
        document.querySelector('.view-text').textContent = 'Week';
    }); 
}

function changeMonthView(){
    currentView = 'month-view';
    loadView('month_view').then(() => {
        // Sau khi load hoàn tất, chạy renderCalendar
        renderCalendar(currentWeek.getFullYear(), currentWeek.getMonth());
        document.querySelector('.view-text').textContent = 'Month';
    });
}

document.getElementById('change-week').addEventListener('click', changeWeekView);

document.getElementById('change-month').addEventListener('click', changeMonthView);

document.getElementById('btn-today').addEventListener('click', function(){
  console.log("asdfa");
  currentWeek = getStartOfCenteredWeek(new Date());
  endWeek.setDate(currentWeek.getDate() + 6);
  initializeCalendar();
});