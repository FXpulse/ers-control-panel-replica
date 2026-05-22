// ERS Control Panel - Full Interactive JavaScript

// =================== TAB SWITCHING ===================
function switchTab(tabName, el) {
  document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('#ers_navbar_tabs li').forEach(function(li){ li.classList.remove('active'); });
  var panel = document.getElementById('tab_' + tabName);
  if (panel) panel.classList.add('active');
  if (el) el.classList.add('active');
  var subnav = document.getElementById('admin_subnav');
  if (subnav) subnav.style.display = tabName === 'admin' ? 'flex' : 'none';
  if (tabName === 'reports') setTimeout(renderReportsCharts, 100);
  if (tabName === 'home') setTimeout(function(){ renderHomeCalendar(); renderHomeBestSellers(); renderHomeMonthly(); }, 100);
  if (tabName === 'scheduling') setTimeout(renderSchedCalendar, 100);
  if (tabName === 'delivery') setTimeout(renderDeliveryCalendar, 100);
  if (tabName === 'customers') renderCustomersTable();
}

// =================== SUBNAV DROPDOWNS ===================
function toggleGroup(btn) {
  var group = btn.closest ? btn.closest('.subnav_group') : btn.parentElement;
  var links = group.querySelector('.subnav_group_links');
  var allLinks = document.querySelectorAll('.subnav_group_links');
  allLinks.forEach(function(l){ if (l !== links) l.style.display = 'none'; });
  links.style.display = links.style.display === 'block' ? 'none' : 'block';
}

// =================== MODAL SYSTEM ===================
function openModal(id) {
  document.getElementById('modal_overlay').style.display = 'block';
  document.getElementById(id).style.display = 'block';
}
function closeModal() {
  document.getElementById('modal_overlay').style.display = 'none';
  document.querySelectorAll('.ers-modal').forEach(function(m){ m.style.display = 'none'; });
}
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });

// =================== CALENDAR DATA ===================
var calOrders = {
  '2026-05-08': [{id:43, type:'delivery', label:'DEL', customer:'Creekside Christian Preschool', products:'Fire Fighter Station x1, Unicorn Dreamland x1', time:'Fri May 08, 2026 9:00am - 1:30pm', total:475, paid:true, contact:'Mrs. Tanya Bagwell', email:'preschool@creeksidechristian.com', phone:'904-429-9945', address:'92 Life Spring Way, Saint Johns FL 32259'}],
  '2026-05-09': [{id:44, type:'delivery', label:'DEL', customer:'Il Murali', products:'Bounce House x1', time:'Sat May 09, 2026 10:00am - 4:00pm', total:350, paid:true, contact:'Il Murali', email:'admin@ilmurali.com', phone:'866-884-7494', address:'123 Main St, St. Johns, FL'}],
  '2026-05-10': [{id:45, type:'service', label:'1', customer:'Abby Weiss', products:'Bounce & Slide x1', time:'Sun May 10, 2026 2:00pm - 6:00pm', total:275, paid:false, contact:'Abby Weiss', email:'abby.weiss@acesschurch.com', phone:'904-647-1200', address:'Access Church, St. Johns, FL'}],
  '2026-05-11': [{id:46, type:'service', label:'1', customer:'Henry Nardone', products:'Dry Slide x1', time:'Mon May 11, 2026 11:00am - 3:00pm', total:225, paid:true, contact:'Henry Nardone', email:'ludmilayhenry@gmail.com', phone:'786-307-2711', address:'Miami, FL'}],
  '2026-05-12': [{id:47, type:'service', label:'1', customer:'Monique Buchanan', products:'Water Slide x1', time:'Tue May 12, 2026 1:00pm - 5:00pm', total:300, paid:false, contact:'Monique Buchanan', email:'mbuchanan@primrosejuling.com', phone:'904-230-2828', address:'Primrose School, St. Johns, FL'}],
  '2026-05-13': [{id:48, type:'service', label:'1', customer:'Abby Weiss', products:'Bounce House x1', time:'Wed May 13, 2026 3:00pm - 7:00pm', total:250, paid:true, contact:'Abby Weiss', email:'abby.weiss@acesschurch.com', phone:'904-647-1200', address:'Access Church, St. Johns, FL'}],
  '2026-05-14': [{id:49, type:'service', label:'1', customer:'test ers', products:'Combo Unit x1', time:'Thu May 14, 2026 2:00pm - 6:00pm', total:400, paid:false, contact:'test ers', email:'junk@eventrentalsystems.com', phone:'123-456-7890', address:'Test Location, FL'}],
  '2026-05-15': [{id:50, type:'service', label:'1', customer:'Roderick Pitti', products:'Bounce House x1', time:'Fri May 15, 2026 4:00pm - 8:00pm', total:275, paid:true, contact:'Roderick Pitti', email:'roderick.pitti@fxtradeelite.com', phone:'+507-635-597-22', address:'Social Click Media, FL'}],
  '2026-05-16': [{id:51, type:'service', label:'1', customer:'Ludmila Mendoza', products:'Slide x1', time:'Sat May 16, 2026 10:00am - 2:00pm', total:325, paid:false, contact:'Ludmila Mendoza', email:'ludmilafernandamendoza@gmail.com', phone:'', address:'St. Johns, FL'}],
  '2026-05-17': [{id:52, type:'service', label:'1', customer:'Creekside Christian', products:'Fire Fighter Station x1', time:'Sun May 17, 2026 9:00am - 1:00pm', total:450, paid:true, contact:'Mrs. Tanya Bagwell', email:'preschool@creeksidechristian.com', phone:'904-429-9945', address:'92 Life Spring Way, Saint Johns FL 32259'}],
  '2026-05-18': [{id:53, type:'pickup', label:'PKP', customer:'Abby Weiss', products:'Bounce House Pickup', time:'Mon May 18, 2026 9:00am - 11:00am', total:0, paid:true, contact:'Abby Weiss', email:'abby.weiss@acesschurch.com', phone:'904-647-1200', address:'Access Church, St. Johns, FL'}],
  '2026-05-19': [{id:54, type:'service', label:'1', customer:'Henry Nardone', products:'Dry Slide x1', time:'Tue May 19, 2026 2:00pm - 6:00pm', total:225, paid:true, contact:'Henry Nardone', email:'ludmilayhenry@gmail.com', phone:'786-307-2711', address:'Miami, FL'}],
  '2026-05-25': [{id:55, type:'holiday', label:'*', customer:'Memorial Day', products:'Holiday', time:'Mon May 25, 2026', total:0, paid:true, contact:'', email:'', phone:'', address:''}]
};

var homeMonth = {y:2026, m:4};
var schedMonth = {y:2026, m:4};
var deliveryMonth = {y:2026, m:4};
var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDateKey(y, m, d) {
  return y + '-' + String(m+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
}

// =================== HOME CALENDAR ===================
function changeHomeMonth(dir) {
  homeMonth.m += dir;
  if (homeMonth.m > 11) { homeMonth.m = 0; homeMonth.y++; }
  if (homeMonth.m < 0)  { homeMonth.m = 11; homeMonth.y--; }
  renderHomeCalendar();
}
function renderHomeCalendar() {
  var el = document.getElementById('home_cal_grid');
  var lbl = document.getElementById('home_month_label');
  if (!el) return;
  lbl.textContent = MONTHS[homeMonth.m] + ' ' + homeMonth.y;
  el.innerHTML = buildCalendarHTML(homeMonth.y, homeMonth.m, 'showHomeOrder');
}
function showHomeOrder(dateKey) {
  var orders = calOrders[dateKey];
  if (!orders || orders.length === 0) return;
  showOrderModal(orders[0]);
}

// =================== SCHEDULING CALENDAR ===================
function changeSchedMonth(dir) {
  schedMonth.m += dir;
  if (schedMonth.m > 11) { schedMonth.m = 0; schedMonth.y++; }
  if (schedMonth.m < 0)  { schedMonth.m = 11; schedMonth.y--; }
  renderSchedCalendar();
}
function renderSchedCalendar() {
  var el = document.getElementById('sched_cal_grid');
  var lbl = document.getElementById('sched_month_label');
  if (!el) return;
  lbl.textContent = MONTHS[schedMonth.m] + ' ' + schedMonth.y;
  el.innerHTML = buildCalendarHTML(schedMonth.y, schedMonth.m, 'showSchedOrder');
}
function showSchedOrder(dateKey) {
  var orders = calOrders[dateKey];
  var detail = document.getElementById('sched_order_detail');
  if (!orders || orders.length === 0) { if(detail) detail.style.display='none'; return; }
  if (detail) {
    detail.style.display = 'block';
    detail.innerHTML = buildOrderDetailHTML(orders[0]);
    detail.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

// =================== DELIVERY CALENDAR ===================
function changeDeliveryMonth(dir) {
  deliveryMonth.m += dir;
  if (deliveryMonth.m > 11) { deliveryMonth.m = 0; deliveryMonth.y++; }
  if (deliveryMonth.m < 0)  { deliveryMonth.m = 11; deliveryMonth.y--; }
  renderDeliveryCalendar();
}
function renderDeliveryCalendar() {
  var el = document.getElementById('delivery_cal_grid');
  var lbl = document.getElementById('delivery_month_label');
  if (!el) return;
  lbl.textContent = MONTHS[deliveryMonth.m] + ' ' + deliveryMonth.y;
  el.innerHTML = buildCalendarHTML(deliveryMonth.y, deliveryMonth.m, 'showDeliveryOrder');
}
function showDeliveryOrder(dateKey) {
  var orders = calOrders[dateKey];
  var detail = document.getElementById('delivery_order_detail');
  if (!orders || orders.length === 0) { if(detail) detail.style.display='none'; return; }
  if (detail) {
    detail.style.display = 'block';
    detail.innerHTML = buildOrderDetailHTML(orders[0]);
    detail.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

// =================== CALENDAR BUILDER ===================
function buildCalendarHTML(y, m, clickFn) {
  var today = new Date();
  var firstDay = new Date(y, m, 1).getDay();
  var daysInMonth = new Date(y, m+1, 0).getDate();
  var html = '';
  var day = 1;
  for (var row = 0; row < 6; row++) {
    html += '<tr>';
    for (var col = 0; col < 7; col++) {
      var cellNum = row * 7 + col;
      if (cellNum < firstDay || day > daysInMonth) {
        html += '<td class="cal-empty"></td>';
      } else {
        var dateKey = getDateKey(y, m, day);
        var orders = calOrders[dateKey] || [];
        var isToday = (y === today.getFullYear() && m === today.getMonth() && day === today.getDate());
        var cellClass = 'cal-day' + (isToday ? ' cal-today' : '');
        html += '<td class="' + cellClass + '" onclick="' + clickFn + '(\'' + dateKey + '\')">';
        html += '<div class="cal-day-num">' + day + '</div>';
        orders.forEach(function(o){
          var color = o.type==='delivery'?'#1d6b44': o.type==='pickup'?'#ed7d31': o.type==='holiday'?'#ffd966':'#4472c4';
          html += '<div class="cal-event" style="background:' + color + '">' + o.label + '</div>';
        });
        html += '</td>';
        day++;
      }
    }
    html += '</tr>';
    if (day > daysInMonth) break;
  }
  return html;
}

// =================== ORDER DETAIL ===================
function buildOrderDetailHTML(o) {
  var paidClass = o.paid ? 'badge-paid' : 'badge-unpaid';
  var paidLabel = o.paid ? 'Paid in Full' : 'Pending Payment';
  var notesBtn = '<button class="btn-add-notes" onclick="alert(\"Add notes to Order #' + o.id + '\")" style="margin-top:10px">Add Notes</button>';
  return '<div class="order-detail">' +
    '<div class="order-detail-header order-header-green">Order #' + o.id + '</div>' +
    '<div class="order-detail-body">' +
      '<div class="order-detail-left">' +
        '<div class="order-products">' + o.products + '</div>' +
        '<div><span class="' + paidClass + '">' + paidLabel + '</span></div>' +
        (o.total > 0 ? '<div class="order-total"><span class="badge-amount">$' + o.total.toFixed(2) + ' (paid)</span></div>' : '') +
        notesBtn +
      '</div>' +
      '<div class="order-detail-right">' +
        '<div>' + o.time + '</div>' +
        '<div class="order-customer-name">' + o.customer + '</div>' +
        (o.contact ? '<div>' + o.contact + '</div>' : '') +
        (o.email ? '<div><a href="mailto:' + o.email + '">' + o.email + '</a></div>' : '') +
        (o.phone ? '<div><a href="tel:' + o.phone + '">' + o.phone + '</a></div>' : '') +
        (o.address ? '<div>' + o.address + '</div>' : '') +
      '</div>' +
    '</div>' +
    '<div class="order-actions">' +
      '<button onclick="alert(\"View Customer\")" title="Customer"><i class="fa-solid fa-user"></i></button>' +
      '<button onclick="alert(\"Process Payment\")" title="Payment" class="btn-green"><i class="fa-solid fa-dollar-sign"></i></button>' +
      '<button onclick="alert(\"View Contract\")" title="Contract"><i class="fa-solid fa-file-contract"></i></button>' +
      '<button onclick="alert(\"View Invoice\")" title="Invoice"><i class="fa-solid fa-file-invoice"></i></button>' +
      '<button onclick="alert(\"View Products\")" title="Products"><i class="fa-solid fa-boxes-stacked"></i></button>' +
      '<button onclick="alert(\"Settings\")" title="Settings"><i class="fa-solid fa-gear"></i></button>' +
    '</div>' +
  '</div>';
}

function showOrderModal(o) {
  document.getElementById('modal_order_title').textContent = 'Order #' + o.id;
  document.getElementById('modal_order_body').innerHTML = buildOrderDetailHTML(o);
  openModal('order_modal');
}

// =================== CUSTOMERS ===================
var customersData = [
  {name:'Il Murali', email:'admin@ilmurali.com', phone:'866-884-7494', company:'', complete:0, last:'', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Monique Buchanan', email:'mbuchanan@primrosejuling.com', phone:'904-230-2828', company:'Primrose School of Julington Creek', complete:0, last:'', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Abby Weiss', email:'abby.weiss@acesschurch.com', phone:'904-647-1200', company:'Access Church', complete:1, last:'03/29/2026', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Mrs. Tanya Bagwell', email:'preschool@creeksidechristian.com', phone:'904-429-9945', company:'Creekside Christian Preschool', complete:1, last:'05/08/2026', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Abby Weiss (2)', email:'ludmilafernandamendoza@gmail.com', phone:'', company:'Access Church', complete:0, last:'', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Ludmila Mendoza', email:'ludmilafernandamendoza@gmail.com', phone:'', company:'', complete:0, last:'', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Henry Nardone', email:'ludmilayhenry@gmail.com', phone:'786-307-2711', company:'', complete:2, last:'05/09/2026', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'test ers', email:'junk@eventrentalsystems.com', phone:'123-456-7890', company:'', complete:0, last:'', upcoming:0, nextOrder:'', quotes:0, nextQuote:''},
  {name:'Roderick Pitti', email:'roderick.pitti@fxtradeelite.com', phone:'+507-635-597-22', company:'Social Click Media', complete:0, last:'', upcoming:0, nextOrder:'', quotes:0, nextQuote:''}
];
var filteredCustomers = customersData.slice();
var sortDir = {};

function renderCustomersTable() {
  var tbody = document.getElementById('customers_tbody');
  if (!tbody) return;
  tbody.innerHTML = filteredCustomers.map(function(c){
    var nm = c.name.replace(/'/g, "\'");
    return '<tr>' +
      '<td><i class="fa-solid fa-circle-user" style="color:#17a589;font-size:1.4rem"></i></td>' +
      '<td><a href="#" onclick="openCustomerDetail(\'' + nm + '\');return false;">' + c.name + '</a></td>' +
      '<td>' + (c.email.length>28?c.email.substring(0,26)+'...':c.email) + '</td>' +
      '<td>' + c.phone + '</td>' +
      '<td>' + c.company + '</td>' +
      '<td>' + (c.complete > 0 ? '<span class="badge-complete">' + c.complete + '</span>' : c.complete) + '</td>' +
      '<td>' + c.last + '</td>' +
      '<td>' + c.upcoming + '</td>' +
      '<td>' + c.nextOrder + '</td>' +
      '<td>' + c.quotes + '</td>' +
      '<td>' + c.nextQuote + '</td>' +
      '<td><button class="btn-new-quote" onclick="alert(\"New Quote for ' + c.name + '\")">New Quote</button></td>' +
    '</tr>';
  }).join('');
}

function openCustomerDetail(name) {
  var c = customersData.find(function(x){return x.name===name;});
  if (!c) return;
  document.getElementById('modal_order_title').textContent = c.name;
  document.getElementById('modal_order_body').innerHTML =
    '<div class="customer-detail">' +
    '<p><strong>Email:</strong> ' + c.email + '</p>' +
    '<p><strong>Phone:</strong> ' + (c.phone||'—') + '</p>' +
    '<p><strong>Company:</strong> ' + (c.company||'—') + '</p>' +
    '<p><strong>Complete Orders:</strong> ' + c.complete + '</p>' +
    '<p><strong>Last Order:</strong> ' + (c.last||'—') + '</p>' +
    '<div style="margin-top:15px">' +
      '<button class="btn-primary" onclick="closeModal()">New Quote</button> ' +
      '<button class="btn-secondary" onclick="closeModal()">Send ERSMail</button>' +
    '</div></div>';
  openModal('order_modal');
}

function filterCustomers() {
  var name = (document.getElementById('filter_name')||{value:''}).value;
  var email = (document.getElementById('filter_email')||{value:''}).value;
  var phone = (document.getElementById('filter_phone')||{value:''}).value;
  var company = (document.getElementById('filter_company')||{value:''}).value;
  filteredCustomers = customersData.filter(function(c){
    return (!name || c.name.toLowerCase().indexOf(name.toLowerCase())>=0) &&
           (!email || c.email.toLowerCase().indexOf(email.toLowerCase())>=0) &&
           (!phone || c.phone.indexOf(phone)>=0) &&
           (!company || c.company.toLowerCase().indexOf(company.toLowerCase())>=0);
  });
  renderCustomersTable();
}

function clearFilters() {
  ['filter_name','filter_email','filter_phone','filter_company'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  filteredCustomers = customersData.slice();
  renderCustomersTable();
}

function toggleFilters() {
  var p = document.getElementById('filters_panel');
  if (p) p.style.display = p.style.display==='none'?'block':'none';
}

function sortCustomers(field) {
  sortDir[field] = !sortDir[field];
  filteredCustomers.sort(function(a,b){
    var va = String(a[field]||'').toLowerCase();
    var vb = String(b[field]||'').toLowerCase();
    return sortDir[field] ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  renderCustomersTable();
}

// =================== REPORTS ===================
function renderReportsCharts() {
  if (typeof Highcharts === 'undefined') return;
  var bs = document.getElementById('rpt_best_sellers');
  if (bs && !bs._hc) {
    bs._hc = true;
    Highcharts.chart('rpt_best_sellers', {
      chart:{type:'pie', backgroundColor:'#fff'},
      title:{text:'Best Sellers over the past 60 days', style:{fontSize:'13px'}},
      series:[{name:'Orders', colorByPoint:true, data:[
        {name:'Bounce & Slide', y:12},{name:'Dry Slides', y:8},
        {name:'Bounce Houses', y:15},{name:'Water Slides', y:6},{name:'Combo Units', y:4}
      ]}], credits:{enabled:false}
    });
  }
  var rmy = document.getElementById('rpt_monthly');
  if (rmy && !rmy._hc) {
    rmy._hc = true;
    Highcharts.chart('rpt_monthly', {
      chart:{type:'bar', backgroundColor:'#fff'},
      title:{text:'Monthly Payments Received', style:{fontSize:'13px'}},
      xAxis:{categories:['Mar 26']},
      yAxis:{title:{text:'Values'}, min:0, max:500},
      series:[{name:'Payments', data:[475], color:'#4472c4'}],
      credits:{enabled:false}
    });
  }
}

// =================== HOME CHARTS ===================
function renderHomeBestSellers() {
  if (typeof Highcharts === 'undefined') return;
  var el = document.getElementById('home_best_sellers_chart');
  if (el && !el._hc) {
    el._hc = true;
    Highcharts.chart('home_best_sellers_chart', {
      chart:{type:'pie', backgroundColor:'transparent', margin:[0,0,0,0]},
      title:{text:''},
      plotOptions:{pie:{dataLabels:{enabled:true, format:'{point.name}', style:{fontSize:'10px'}}}},
      series:[{name:'Orders', colorByPoint:true, data:[
        {name:'Bounce & Slide', y:12},{name:'Dry Slides', y:8},
        {name:'Bounce Houses', y:15},{name:'Hidden Category', y:3}
      ]}], credits:{enabled:false}, legend:{enabled:false}
    });
  }
}

function renderHomeMonthly() {
  if (typeof Highcharts === 'undefined') return;
  var el = document.getElementById('home_monthly_chart');
  if (el && !el._hc) {
    el._hc = true;
    Highcharts.chart('home_monthly_chart', {
      chart:{type:'bar', backgroundColor:'transparent'},
      title:{text:''},
      xAxis:{categories:['Mar 26']},
      yAxis:{title:{text:'Values'}, min:0, max:500},
      series:[{name:'Payments', data:[475], color:'#4472c4'}],
      credits:{enabled:false}
    });
  }
}

// =================== INIT ===================
document.addEventListener('DOMContentLoaded', function(){
  renderHomeCalendar();
  renderHomeBestSellers();
  renderHomeMonthly();
  renderCustomersTable();
});
