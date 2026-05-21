/* ERS Control Panel - app.js */

// ===== GLOBAL STATE =====
var currentYear = 2026;
var currentMonth = 4; // 0-indexed: 4 = May
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var dayNames = ["S","M","T","W","T","F","S"];

// Sample orders data
var ordersData = {
  "2026-05-08": [{type:"delivery", count:1}],
  "2026-05-09": [{type:"delivery", count:1}],
  "2026-05-10": [{type:"active", count:1}],
  "2026-05-11": [{type:"active", count:1}],
  "2026-05-12": [{type:"active", count:1}],
  "2026-05-13": [{type:"active", count:1}],
  "2026-05-14": [{type:"active", count:1}],
  "2026-05-15": [{type:"active", count:1}],
  "2026-05-16": [{type:"active", count:1}],
  "2026-05-17": [{type:"active", count:1}],
  "2026-05-18": [{type:"pickup", count:1}],
  "2026-05-19": [{type:"active", count:1}],
  "2026-05-25": [{type:"holiday", count:0}]
};

var holidays = {
  "2026-05-08": "Truman Day",
  "2026-05-25": "Memorial Day"
};

// ===== TAB SWITCHING =====
function switchTab(tabName, clickedEl) {
  // Update navbar active state
  var tabs = document.querySelectorAll('#ers_navbar_tabs li');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }
  if (clickedEl) clickedEl.classList.add('active');

  // Hide all tab content
  var contents = document.querySelectorAll('.tab_content');
  for (var i = 0; i < contents.length; i++) {
    contents[i].style.display = 'none';
    contents[i].classList.remove('active_tab');
  }

  // Show selected tab
  var target = document.getElementById('tab_' + tabName);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active_tab');
  }

  // Show/hide admin subnav
  var adminSubnav = document.getElementById('admin_subnav');
  if (adminSubnav) {
    adminSubnav.style.display = (tabName === 'admin') ? 'flex' : 'none';
  }

  // Render secondary calendars if needed
  if (tabName === 'scheduling') {
    renderSecondaryCalendar('sched-grid', 'sched_month_label', 'sched_prev', 'sched_next');
  }
  if (tabName === 'delivery') {
    renderSecondaryCalendar('del-grid', 'del_month_label', 'del_prev', 'del_next');
  }
  if (tabName === 'reports') {
    renderReportsCharts();
  }
}

// ===== ADMIN SUBNAV DROPDOWN TOGGLE =====
function toggleGroup(btn) {
  var linksDiv = btn.nextElementSibling;
  if (linksDiv) {
    var isOpen = linksDiv.classList.contains('open');
    // Close all others
    var allLinks = document.querySelectorAll('.subnav_group_links');
    for (var i = 0; i < allLinks.length; i++) {
      allLinks[i].classList.remove('open');
    }
    if (!isOpen) linksDiv.classList.add('open');
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.subnav_group')) {
    var allLinks = document.querySelectorAll('.subnav_group_links');
    for (var i = 0; i < allLinks.length; i++) {
      allLinks[i].classList.remove('open');
    }
  }
});

// ===== CALENDAR RENDERING =====
function renderCalendar(year, month, gridId, labelId) {
  gridId = gridId || 'calendar-grid';
  labelId = labelId || 'calendar_month_display';

  var grid = document.getElementById(gridId);
  if (!grid) return;

  var label = document.getElementById(labelId);
  if (label) label.textContent = monthNames[month] + ' ' + year;

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var today = new Date();

  var html = '';

  // Fill header row if needed
  var headId = gridId.replace('grid', 'grid-head');
  var headEl = document.getElementById(headId);
  if (headEl && headEl.innerHTML === '') {
    var headHtml = '';
    dayNames.forEach(function(d) { headHtml += '<th>' + d + '</th>'; });
    headEl.innerHTML = headHtml;
  }

  var dayCount = firstDay;
  html += '<tr>';

  // Empty cells before first day
  for (var i = 0; i < firstDay; i++) {
    html += '<td class="cal_other_month"></td>';
  }

  for (var d = 1; d <= daysInMonth; d++) {
    if (dayCount % 7 === 0 && d > 1) html += '</tr><tr>';

    var dateKey = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d);
    var cellClass = isToday ? 'cal_today' : '';
    var isHoliday = holidays[dateKey];
    if (isHoliday) cellClass += ' cal_holiday';

    var events = ordersData[dateKey] || [];
    var eventsHtml = '';
    if (isHoliday) {
      eventsHtml += '<span class="cal_holiday_icon">&#9728;</span> ';
    }
    events.forEach(function(ev) {
      var cls = 'cal_event cal_event_' + ev.type;
      var label = ev.type === 'delivery' ? 'DEL' : ev.type === 'pickup' ? 'PKP' : ev.type === 'active' ? ev.count : '';
      if (ev.count > 0) eventsHtml += '<span class="' + cls + '">' + label + '</span>';
    });

    html += '<td class="' + cellClass + '">';
    html += '<a href="#" class="cal_day_num">' + d + '</a>';
    html += eventsHtml;
    html += '</td>';
    dayCount++;
  }

  // Fill remaining cells
  var remaining = 7 - (dayCount % 7);
  if (remaining < 7) {
    for (var i = 0; i < remaining; i++) {
      html += '<td class="cal_other_month"></td>';
    }
  }
  html += '</tr>';

  grid.innerHTML = html;
}

function renderSecondaryCalendar(gridId, labelId, prevId, nextId) {
  renderCalendar(currentYear, currentMonth, gridId, labelId);

  var prevBtn = document.getElementById(prevId);
  var nextBtn = document.getElementById(nextId);

  if (prevBtn && !prevBtn._ersListener) {
    prevBtn._ersListener = true;
    prevBtn.addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar(currentYear, currentMonth, gridId, labelId);
    });
  }
  if (nextBtn && !nextBtn._ersListener) {
    nextBtn._ersListener = true;
    nextBtn.addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar(currentYear, currentMonth, gridId, labelId);
    });
  }
}

// ===== HIGHCHARTS - HOME ===== 
function renderMonthlyChart() {
  if (typeof Highcharts === 'undefined') return;
  var el = document.getElementById('monthly_chart_container');
  if (!el) return;
  Highcharts.chart('monthly_chart_container', {
    chart: { type: 'bar', style: { fontFamily: 'Segoe UI, Arial, sans-serif' } },
    title: { text: 'Monthly Payments Received', style: { fontSize: '13px', fontWeight: '600' } },
    xAxis: { categories: ['Mar 26'], labels: { style: { fontSize: '11px' } } },
    yAxis: { title: { text: 'Values', style: { fontSize: '11px' } }, min: 0, max: 500, labels: { style: { fontSize: '11px' } } },
    series: [{ name: 'Payments', data: [475], color: '#3a7bd5', showInLegend: false }],
    credits: { enabled: false },
    plotOptions: { bar: { dataLabels: { enabled: false } } }
  });
}

function renderBestSellersChart() {
  if (typeof Highcharts === 'undefined') return;
  var el = document.getElementById('chart_container');
  if (!el) return;
  Highcharts.chart('chart_container', {
    chart: { type: 'pie', style: { fontFamily: 'Segoe UI, Arial, sans-serif' } },
    title: { text: 'Best Sellers over the past 60 days', style: { fontSize: '13px', fontWeight: '600' } },
    series: [{
      name: 'Orders',
      innerSize: '40%',
      data: [
        { name: 'Bounce Houses', y: 45, color: '#27ae60' },
        { name: 'Dry Slides', y: 20, color: '#2c3e50' },
        { name: 'Bounce & Slide Combos', y: 15, color: '#3498db' },
        { name: 'Hidden Category', y: 10, color: '#e67e22' }
      ]
    }],
    credits: { enabled: false },
    plotOptions: { pie: { dataLabels: { enabled: true, style: { fontSize: '11px' } } } }
  });
}

// ===== HIGHCHARTS - REPORTS ===== 
function renderReportsCharts() {
  if (typeof Highcharts === 'undefined') return;

  var rPie = document.getElementById('reports_pie');
  if (rPie && !rPie._rendered) {
    rPie._rendered = true;
    Highcharts.chart('reports_pie', {
      chart: { type: 'pie', style: { fontFamily: 'Segoe UI, Arial, sans-serif' } },
      title: { text: null },
      series: [{ name: 'Orders', innerSize: '40%', data: [
        { name: 'Bounce Houses', y: 45, color: '#27ae60' },
        { name: 'Dry Slides', y: 20, color: '#2c3e50' },
        { name: 'Bounce & Slide Combos', y: 15, color: '#3498db' },
        { name: 'Hidden Category', y: 10, color: '#e67e22' }
      ]}],
      credits: { enabled: false },
      plotOptions: { pie: { dataLabels: { enabled: true, style: { fontSize: '11px' } } } }
    });
  }

  var rBar = document.getElementById('reports_bar');
  if (rBar && !rBar._rendered) {
    rBar._rendered = true;
    Highcharts.chart('reports_bar', {
      chart: { type: 'bar', style: { fontFamily: 'Segoe UI, Arial, sans-serif' } },
      title: { text: null },
      xAxis: { categories: ['Mar 26'] },
      yAxis: { title: { text: 'Values' }, min: 0, max: 500 },
      series: [{ name: 'Payments', data: [475], color: '#3a7bd5', showInLegend: false }],
      credits: { enabled: false }
    });
  }
}

// ===== CALENDAR NAV - HOME ===== 
function initCalendarNav() {
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar(currentYear, currentMonth);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar(currentYear, currentMonth);
    });
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  // Render home calendar
  renderCalendar(currentYear, currentMonth);
  initCalendarNav();

  // Render home charts
  renderMonthlyChart();
  renderBestSellersChart();
});/* ERS Control Panel - app.js */
(function() {
  'use strict';

  // ===== CALENDAR =====
  var currentYear = 2026;
  var currentMonth = 4; // 0-indexed: 4 = May

  var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dayNames = ["S","M","T","W","T","F","S"];

  // Sample orders data (simulates backend data)
  var ordersData = {
    "2026-05-08": [{type:"delivery", count:1}],
    "2026-05-09": [{type:"delivery", count:1}],
    "2026-05-10": [{type:"active", count:1}],
    "2026-05-11": [{type:"active", count:1}],
    "2026-05-12": [{type:"active", count:1}],
    "2026-05-13": [{type:"active", count:1}],
    "2026-05-14": [{type:"active", count:1}],
    "2026-05-15": [{type:"active", count:1}],
    "2026-05-16": [{type:"active", count:1}],
    "2026-05-17": [{type:"active", count:1}],
    "2026-05-18": [{type:"pickup", count:1}],
    "2026-05-19": [{type:"active", count:1}],
    "2026-05-25": [{type:"holiday", count:0}] // Memorial Day
  };

  var holidays = {
    "2026-05-08": "Truman Day",
    "2026-05-25": "Memorial Day"
  };

  function renderCalendar(year, month) {
    var grid = document.getElementById('calendar-grid');
    if(!grid) return;

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date();

    var html = '<table><thead><tr>';
    dayNames.forEach(function(d) { html += '<th>' + d + '<\/th>'; });
    html += '<\/tr><\/thead><tbody><tr>';

    // Empty cells before first day
    for(var i = 0; i < firstDay; i++) {
      html += '<td><\/td>';
    }

    var dayCount = firstDay;
    for(var d = 1; d <= daysInMonth; d++) {
      if(dayCount % 7 === 0) html += '<\/tr><tr>';

      var dateKey = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      var isToday = (today.getFullYear()===year && today.getMonth()===month && today.getDate()===d);
      var isWeekend = (dayCount % 7 === 0 || dayCount % 7 === 6);
      var orders = ordersData[dateKey] || [];
      var holiday = holidays[dateKey];

      var classes = 'cal-day';
      if(isToday) classes += ' today';
      if(isWeekend) classes += ' weekend';
      if(orders.length > 0) classes += ' has-orders';

      html += '<td class="' + classes + '">';
      html += '<a href="#">' + d + '<\/a>';
      if(holiday) html += ' <i class="fas fa-sun cal-holiday" title="' + holiday + '"><\/i>';
      orders.forEach(function(order) {
        var color = '#43b41c';
        if(order.type === 'pickup') color = '#e03642';
        if(order.type === 'active') color = 'rgb(115,139,202)';
        html += ' <span class="cal-badge" style="background:' + color + '">' + order.count + '<\/span>';
      });
      html += '<\/td>';
      dayCount++;
    }

    // Fill remaining cells
    while(dayCount % 7 !== 0) {
      html += '<td><\/td>';
      dayCount++;
    }

    html += '<\/tr><\/tbody><\/table>';
    grid.innerHTML = html;

    // Update display
    var display = document.getElementById('calendar_month_display');
    if(display) display.textContent = monthNames[month] + ' ' + year;

    var select = document.getElementById('calendar_month_select');
    if(select) select.value = year + '-' + String(month+1).padStart(2,'0');
  }

  // ===== HIGHCHARTS - Monthly Payments Bar =====
  function renderMonthlyChart() {
    var container = document.getElementById('monthly_chart_container');
    if(!container || typeof Highcharts === 'undefined') return;

    Highcharts.chart('monthly_chart_container', {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: 'Monthly Payments Received', style: { color: '#333', fontSize: '18px' } },
      xAxis: { categories: ['Mar 26'], crosshair: true },
      yAxis: { min: 0, title: { text: 'Values' } },
      series: [{
        name: 'Monthly Sales',
        data: [475],
        color: '#337ab7'
      }],
      legend: { enabled: false },
      credits: { enabled: false }
    });
  }

  // ===== HIGHCHARTS - Best Sellers Pie =====
  function renderBestSellersChart() {
    var container = document.getElementById('chart_container');
    if(!container || typeof Highcharts === 'undefined') return;

    Highcharts.chart('chart_container', {
      chart: { type: 'pie' },
      title: { text: 'Best Sellers over the past 60 days', style: { color: '#333', fontSize: '18px' } },
      series: [{
        name: 'Sales by Category',
        colorByPoint: true,
        data: [
          { name: 'Bounce Houses', y: 19542, color: '#5cb85c' },
          { name: 'Dry Slides', y: 4939, color: '#333333' },
          { name: 'Bounce & Slide Combos', y: 5763, color: '#5b9bd5' },
          { name: 'Hidden Category', y: 825, color: '#f97316' }
        ]
      }],
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: { enabled: true, format: '{point.name}' },
          showInLegend: false,
          innerSize: '40%'
        }
      }
    });
  }

  // ===== NAVBAR TAB SWITCHING =====
  function initNavTabs() {
    var navLinks = document.querySelectorAll('.nav-link-item');
    var adminSubnav = document.getElementById('admin-subnav');

    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var tab = this.dataset.tab;

        // Remove active from all
        document.querySelectorAll('.navbar-ers .nav > li').forEach(function(li) {
          li.classList.remove('active');
        });

        // Set active on clicked
        this.closest('li').classList.add('active');

        // Show/hide admin subnav
        if(adminSubnav) {
          adminSubnav.style.display = (tab === 'admin') ? 'block' : 'none';
        }
      });
    });
  }

  // ===== CALENDAR NAVIGATION =====
  function initCalendarNav() {
    var prevBtn = document.getElementById('cal-prev');
    var nextBtn = document.getElementById('cal-next');
    var monthSelect = document.getElementById('calendar_month_select');

    if(prevBtn) {
      prevBtn.addEventListener('click', function() {
        currentMonth--;
        if(currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar(currentYear, currentMonth);
      });
    }

    if(nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentMonth++;
        if(currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentYear, currentMonth);
      });
    }

    if(monthSelect) {
      monthSelect.addEventListener('change', function() {
        var parts = this.value.split('-');
        currentYear = parseInt(parts[0]);
        currentMonth = parseInt(parts[1]) - 1;
        renderCalendar(currentYear, currentMonth);
      });
    }
  }

  // ===== BOOTSTRAP DROPDOWNS (fallback if Bootstrap JS loaded) =====
  function initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var menu = this.nextElementSibling;
        var isOpen = menu.style.display === 'block';
        // Close all menus
        document.querySelectorAll('.dropdown-menu').forEach(function(m) { m.style.display = 'none'; });
        // Toggle this one
        if(!isOpen) menu.style.display = 'block';
      });
    });

    document.addEventListener('click', function() {
      document.querySelectorAll('.dropdown-menu').forEach(function(m) { m.style.display = 'none'; });
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', function() {
    renderCalendar(currentYear, currentMonth);
    initCalendarNav();
    initNavTabs();
    initDropdowns();
    
    // Charts - wait a bit for Highcharts to load
    setTimeout(function() {
      renderMonthlyChart();
      renderBestSellersChart();
    }, 300);
  });

})();
