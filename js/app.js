/* ERS Control Panel - app.js */
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
