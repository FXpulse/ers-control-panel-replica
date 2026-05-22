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


// =================== ADMIN SUBPAGE SYSTEM ===================
var adminPageTitles = {
  company_info:'Company Info', company_timezone:'Company Time Zone',
  routing_settings:'Routing Settings', google_integration:'Google Integration Settings',
  quickbooks:'Quickbooks Online', mailchimp:'Mailchimp Settings',
  aweber:'AWeber Settings', constant_contact:'Constant Contact Settings',
  text_messaging_settings:'Text Messaging Settings', text_messaging_logs:'Text Messaging Logs',
  taxcloud:'TaxCloud Settings', misc_settings:'Misc Settings',
  api_info:'Api Info', users:'Users', system_setup:'System Setup',
  system_settings:'System Settings', locations:'Locations',
  company_types:'Company Types', company_roles:'Company Roles',
  highlevel_connect:'HighLevel Connect',
  reminders:'Reminders', order_options:'Order Options',
  misc_order_settings:'Misc Order Settings', coupons:'Coupons',
  service_areas:'Service Areas', damage_waiver:'Damage Waiver',
  taxes:'Taxes', discount_groups:'Discount Groups',
  general_documents:'General Documents', contracts:'Contracts',
  invoices_admin:'Invoices', quotes:'Quotes', surveys:'Surveys',
  ersmail_templates:'ERSMail Templates', packing_lists:'Packing Lists',
  merge_fields:'Merge Fields', digital_signatures:'Digital Signatures',
  ersmail_log:'ERSMail Log',
  categories:'Categories', items:'Items', addons:'Add-ons',
  packages:'Packages', upsells:'Upsells', price_sheets:'Price Sheets',
  delivery_rates:'Delivery Rates', product_pricing:'Product Pricing',
  inventory:'Inventory', item_groups:'Item Groups', variants:'Variants',
  adjustments:'Adjustments', deposits:'Deposits', pricing:'Pricing',
  availability:'Availability',
  website_pages:'Website Pages', images_admin:'Images', gallery:'Gallery',
  navigation_editor:'Navigation Editor', blogs:'Blogs', testimonials:'Testimonials',
  seo_settings:'SEO Settings', domain_settings:'Domain Settings'
};

function loadAdminPage(pageKey) {
  var panel = document.getElementById('admin_subpage');
  var grid = document.querySelector('#tab_admin .admin-grid');
  var titleEl = document.getElementById('subpage_title');
  var contentEl = document.getElementById('subpage_content');
  if (!panel || !contentEl) return;
  var title = adminPageTitles[pageKey] || pageKey;
  titleEl.textContent = title;
  contentEl.innerHTML = buildAdminPageContent(pageKey, title);
  if (grid) grid.style.display = 'none';
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth', block:'start'});
  // Close subnav dropdowns
  document.querySelectorAll('.subnav_group_links').forEach(function(l){l.style.display='none';});
}

function closeAdminPage() {
  var panel = document.getElementById('admin_subpage');
  var grid = document.querySelector('#tab_admin .admin-grid');
  if (panel) panel.style.display = 'none';
  if (grid) grid.style.display = 'grid';
}

function buildAdminPageContent(pageKey, title) {
  // Table-based pages
  var tablePages = {
    users: {
      cols: ['Username','Group','First Name','Last Name','Phone','Email'],
      rows: [
        ['ERS','Administrator','ERS','ERS','','junk@eventrentalsystems.com'],
        ['LudmillaM','Administrator','Ludmila','Mendoza','(786) 307-2711','ludmilayhenry@gmail.com']
      ]
    },
    general_documents: {
      cols: ['Name'],
      rows: [['Auto Message Do Not Send List'],['Virtual Terminal Receipt'],['Receipt Bottom'],
             ['Payment Header'],['Contract Page 1'],['Contract Page 2'],['Quote'],
             ['Raincheck'],['Quick Quote'],['Invoice'],['Cancel'],['Thank You Page']]
    },
    contracts: {
      cols: ['Name','Type'],
      rows: [['Standard Rental Contract','Contract'],['Commercial Contract','Contract'],
             ['Damage Waiver Agreement','Document'],['Privacy Policy','Document']]
    },
    invoices_admin: {
      cols: ['Name','Type'],
      rows: [['Standard Invoice','Invoice'],['Commercial Invoice','Invoice'],
             ['Deposit Receipt','Receipt'],['Final Invoice','Invoice']]
    },
    quotes: {
      cols: ['Name','Type'],
      rows: [['Standard Quote','Quote'],['Package Quote','Quote'],
             ['Corporate Quote','Quote']]
    },
    surveys: {
      cols: ['Name','Status'],
      rows: [['Post-Event Customer Satisfaction','Active'],
             ['Pre-Event Requirements','Active'],['Safety Checklist','Draft']]
    },
    ersmail_templates: {
      cols: ['Name','Type'],
      rows: [['Order Confirmation','Email'],['Payment Receipt','Email'],
             ['Quote Follow-up','Email'],['Cancellation Notice','Email'],
             ['Event Reminder','Email'],['Thank You After Event','Email']]
    },
    packing_lists: {
      cols: ['Name'],
      rows: [['Standard Packing List'],['Commercial Event List'],['Indoor Event List']]
    },
    categories: {
      cols: ['Name','Display Name','Quantity','Active'],
      rows: [['Bounce Houses','Bounce Houses','12','Yes'],
             ['Dry Slides','Dry Slides','6','Yes'],
             ['Water Slides','Water Slides','4','Yes'],
             ['Combo Units','Combo Units','5','Yes'],
             ['Hidden Category','Hidden Category','2','Yes'],
             ['Generators','Generators','3','Yes']]
    },
    items: {
      cols: ['Name','Type','Cost','Quantity','Category'],
      rows: [
        ['Blue Raspberry (Sugar Floss)','Regular','15','100','Hidden Category'],
        ['Pink Vanilla','Regular','15','100','Hidden Category'],
        ['All Star Sports Arena','','299','1','Bounce Houses'],
        ['Carnival Kingdom','Regular','449','1','Bounce Houses'],
        ['Dig and Dash Dozer','Regular','349','1','Bounce Houses'],
        ['Game On','Regular','349','1','Bounce Houses'],
        ['Mega Monster','Regular','349','1','Bounce Houses'],
        ['Unicorn Dreamland','Regular','349','1','Bounce Houses'],
        ['Fire Fighter Station','Regular','350','1','Bounce Houses'],
        ['Bounce & Slide Combo','Regular','399','1','Combo Units'],
        ['Classic Dry Slide','Regular','249','1','Dry Slides'],
        ['Giant Wave Slide','Regular','299','1','Water Slides']
      ]
    },
    addons: {
      cols: ['Name','Price','Type'],
      rows: [['Generator Rental','75','Add-on'],['Extension Cord','15','Add-on'],
             ['Extra Hour','50','Add-on'],['Delivery Fee','35','Add-on']]
    },
    packages: {
      cols: ['Name','Price','Items'],
      rows: [['Party Starter Pack','499','Bounce House + Generator'],
             ['Ultimate Fun Package','799','2 Bounce Houses + Generator'],
             ['Wet & Wild Bundle','649','Water Slide + Generator']]
    },
    coupons: {
      cols: ['Code','Discount','Type','Expires'],
      rows: [['SUMMER10','10%','Percentage','12/31/2026'],
             ['SAVE50','50','Fixed','06/30/2026'],
             ['NEWCUST','15%','Percentage','Never']]
    },
    service_areas: {
      cols: ['Name','Zip Codes','Delivery Fee'],
      rows: [['St. Johns','32259, 32081, 32082','$35'],
             ['Jacksonville','32202, 32204, 32205','$45'],
             ['Fleming Island','32003, 32068','$40']]
    },
    taxes: {
      cols: ['Name','Rate','State'],
      rows: [['Florida Sales Tax','7%','FL'],['St Johns County','0.5%','FL']]
    },
    locations: {
      cols: ['Name','Address','Phone'],
      rows: [['Main Warehouse','92 Life Spring Way, Saint Johns FL 32259','904-429-9945']]
    },
    website_pages: {
      cols: ['Page Name','URL','Status'],
      rows: [['Home','/','Published'],['About Us','/about','Published'],
             ['Products','/products','Published'],['Contact','/contact','Published'],
             ['Blog','/blog','Published'],['FAQ','/faq','Draft']]
    },
    blogs: {
      cols: ['Title','Date','Status'],
      rows: [['Tips for Planning Your Kids Party','05/01/2026','Published'],
             ['Top 10 Inflatables for Summer 2026','04/15/2026','Published'],
             ['Safety Tips for Bounce Houses','03/22/2026','Published']]
    },
    testimonials: {
      cols: ['Name','Rating','Date'],
      rows: [['Sarah M.','5/5','05/10/2026'],['John D.','5/5','04/28/2026'],
             ['Lisa K.','4/5','04/15/2026']]
    },
    adjustments: {
      cols: ['Name','Type','Amount'],
      rows: [['Weekend Surcharge','Percentage','10%'],
             ['Holiday Rate','Percentage','25%'],
             ['Last Minute Booking','Fixed','$50']]
    },
    deposits: {
      cols: ['Name','Type','Amount','When Due'],
      rows: [['Standard Deposit','Percentage','25%','At Booking'],
             ['Full Payment','Percentage','100%','7 Days Before']]
    },
    pricing: {
      cols: ['Name','Type','Applies To'],
      rows: [['Peak Season','Percentage (+15%)','All Products'],
             ['Corporate Discount','Percentage (-10%)','Commercial Orders']]
    },
    availability: {
      cols: ['Name','Days','Hours'],
      rows: [['Weekdays','Mon-Fri','9am-6pm'],
             ['Weekends','Sat-Sun','8am-8pm'],
             ['Holidays','Closed','N/A']]
    }
  };

  if (tablePages[pageKey]) {
    return buildTablePage(title, tablePages[pageKey].cols, tablePages[pageKey].rows, pageKey);
  }

  // Form-based pages
  var formPages = {
    company_info: buildCompanyInfoForm(),
    company_timezone: buildSimpleForm('Company Time Zone', [
      {label:'Time Zone', type:'select', options:['Eastern Time (US & Canada)','Central Time (US & Canada)','Mountain Time (US & Canada)','Pacific Time (US & Canada)']},
      {label:'Date Format', type:'select', options:['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD']},
      {label:'Time Format', type:'select', options:['12 Hour (AM/PM)','24 Hour']}
    ]),
    routing_settings: buildSimpleForm('Routing Settings', [
      {label:'Default Driver', type:'text', value:'LudmillaM'},
      {label:'Routing Version', type:'select', options:['V3 (Current)','V2 (Legacy)']},
      {label:'Auto-assign Drivers', type:'checkbox', value:true},
      {label:'Show Driver Notes', type:'checkbox', value:true}
    ]),
    google_integration: buildSimpleForm('Google Integration Settings', [
      {label:'Google Calendar ID', type:'text', value:''},
      {label:'Google Maps API Key', type:'text', value:'AIza...'},
      {label:'Sync Orders to Calendar', type:'checkbox', value:true},
      {label:'Show Delivery Routes', type:'checkbox', value:false}
    ]),
    quickbooks: buildSimpleForm('Quickbooks Online', [
      {label:'Status', type:'text', value:'Connected'},
      {label:'Sync Frequency', type:'select', options:['Real-time','Hourly','Daily']},
      {label:'Auto-sync Invoices', type:'checkbox', value:true},
      {label:'Auto-sync Customers', type:'checkbox', value:true}
    ]),
    misc_settings: buildSimpleForm('Misc Settings', [
      {label:'Company Display Name', type:'text', value:"It's Always Fun"},
      {label:'Default Currency', type:'select', options:['USD - US Dollar','EUR - Euro','CAD - Canadian Dollar']},
      {label:'Allow Online Payments', type:'checkbox', value:true},
      {label:'Require Signature', type:'checkbox', value:true},
      {label:'Send Confirmation Emails', type:'checkbox', value:true}
    ]),
    api_info: buildApiInfoPage(),
    system_settings: buildSimpleForm('System Settings', [
      {label:'Max Orders Per Day', type:'text', value:'20'},
      {label:'Default Order Status', type:'select', options:['Active','Pending','Draft']},
      {label:'Allow Partial Payments', type:'checkbox', value:false},
      {label:'Enable Online Booking', type:'checkbox', value:true}
    ]),
    seo_settings: buildSimpleForm('SEO Settings', [
      {label:'Meta Title', type:'text', value:"It's Always Fun - Event Rentals"},
      {label:'Meta Description', type:'textarea', value:'Best bounce house and inflatable rentals in St. Johns, FL'},
      {label:'Google Analytics ID', type:'text', value:'GA-XXXXXXXXX'},
      {label:'Facebook Pixel ID', type:'text', value:''}
    ]),
    domain_settings: buildSimpleForm('Domain Settings', [
      {label:'Primary Domain', type:'text', value:'itsalwaysfun.com'},
      {label:'SSL Certificate', type:'text', value:'Active - Expires 12/2026'},
      {label:'WWW Redirect', type:'checkbox', value:true},
      {label:'Custom 404 Page', type:'checkbox', value:false}
    ]),
    merge_fields: buildMergeFieldsPage(),
    highlevel_connect: buildSimpleForm('HighLevel Connect', [
      {label:'API Key', type:'text', value:'hl_...'},
      {label:'Location ID', type:'text', value:''},
      {label:'Sync Contacts', type:'checkbox', value:true},
      {label:'Sync Opportunities', type:'checkbox', value:false},
      {label:'Enable SMS via HighLevel', type:'checkbox', value:true}
    ])
  };

  if (formPages[pageKey]) {
    return formPages[pageKey];
  }

  // Default: generic page
  return buildGenericPage(title, pageKey);
}

function buildTablePage(title, cols, rows, pageKey) {
  var colsHTML = cols.map(function(c){return '<th>'+c+'</th>';}).join('');
  var rowsHTML = rows.map(function(row){
    var tds = row.map(function(cell){return '<td>'+cell+'</td>';}).join('');
    return '<tr>' + tds +
      '<td class="action-cell">' +
        '<button class="btn-tbl-edit" onclick="alert(\"Edit: ' + row[0] + '\")"><i class="fa-solid fa-pen"></i></button>' +
        '<button class="btn-tbl-del" onclick="confirm(\"Delete ' + row[0] + '?\")"><i class="fa-solid fa-trash"></i></button>' +
      '</td></tr>';
  }).join('');

  return '<div class="subpage-toolbar">' +
    '<button class="btn-primary" onclick="alert(\"Add New ' + title + '\")"><i class="fa-solid fa-plus"></i> Add New</button>' +
    '<button class="btn-secondary" onclick="alert(\"Customize columns\")">Customize</button>' +
    '<input type="text" class="form-control search-inline" placeholder="Search..." oninput="filterSubpageTable(this)">' +
    '<button class="btn-icon-search"><i class="fa-solid fa-magnifying-glass"></i></button>' +
    '<span class="record-count">1 - ' + rows.length + ' of ' + rows.length + ' records</span>' +
  '</div>' +
  '<table class="subpage-table" id="subpage_table">' +
    '<thead><tr><th></th>' + colsHTML + '<th>Actions</th></tr></thead>' +
    '<tbody>' + rowsHTML + '</tbody>' +
  '</table>';
}

function filterSubpageTable(input) {
  var val = input.value.toLowerCase();
  var rows = document.querySelectorAll('#subpage_table tbody tr');
  rows.forEach(function(row){
    row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
  });
}

function buildCompanyInfoForm() {
  return '<form class="settings-form" onsubmit="return false;">' +
    '<div class="form-section"><h4>Company Information</h4>' +
    '<div class="form-row"><div class="form-group"><label>Company Name</label><input type="text" class="form-control" value="Its Always Fun"></div>' +
    '<div class="form-group"><label>Phone</label><input type="text" class="form-control" value="904-429-9945"></div></div>' +
    '<div class="form-row"><div class="form-group"><label>Email</label><input type="email" class="form-control" value="info@itsalwaysfun.com"></div>' +
    '<div class="form-group"><label>Website</label><input type="text" class="form-control" value="www.itsalwaysfun.com"></div></div>' +
    '</div>' +
    '<div class="form-section"><h4>Address</h4>' +
    '<div class="form-group"><label>Street Address</label><input type="text" class="form-control" value="92 Life Spring Way"></div>' +
    '<div class="form-row"><div class="form-group"><label>City</label><input type="text" class="form-control" value="Saint Johns"></div>' +
    '<div class="form-group"><label>State</label><input type="text" class="form-control" value="FL"></div>' +
    '<div class="form-group"><label>Zip</label><input type="text" class="form-control" value="32259"></div></div>' +
    '</div>' +
    '<div class="form-section"><h4>Branding</h4>' +
    '<div class="form-group"><label>Logo URL</label><input type="text" class="form-control" value="https://itsalwaysfun.ourers.com/images/logo.png"></div>' +
    '<div class="form-group"><label>Primary Color</label><input type="color" class="form-control" value="#17a589" style="height:40px"></div>' +
    '</div>' +
    '<button type="submit" class="btn-primary" onclick="alert(\"Settings saved!\")">Save Changes</button>' +
    '</form>';
}

function buildSimpleForm(title, fields) {
  var html = '<form class="settings-form" onsubmit="return false;"><div class="form-section">';
  fields.forEach(function(f){
    html += '<div class="form-group"><label>' + f.label + '</label>';
    if (f.type === 'select') {
      html += '<select class="form-control">' + f.options.map(function(o){return '<option>'+o+'</option>';}).join('') + '</select>';
    } else if (f.type === 'checkbox') {
      html += '<label class="toggle-switch"><input type="checkbox"' + (f.value?' checked':'') + '><span class="toggle-slider"></span></label>';
    } else if (f.type === 'textarea') {
      html += '<textarea class="form-control" rows="3">' + (f.value||'') + '</textarea>';
    } else {
      html += '<input type="' + f.type + '" class="form-control" value="' + (f.value||'') + '">';
    }
    html += '</div>';
  });
  html += '</div><button type="submit" class="btn-primary" onclick="alert(\"Settings saved!\")">Save Changes</button></form>';
  return html;
}

function buildApiInfoPage() {
  return '<div class="api-info-panel">' +
    '<div class="api-key-card"><h4>API Key</h4><div class="api-key-display"><code id="api_key_val">sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>' +
    '<button class="btn-icon" onclick="alert(\"API key copied!\")"><i class="fa-solid fa-copy"></i></button>' +
    '<button class="btn-danger-sm" onclick="confirm(\"Regenerate API key? This will invalidate the current key.\")">Regenerate</button></div>' +
    '<p class="api-note">Use this key to authenticate API requests. Keep it secret.</p></div>' +
    '<div class="api-endpoints"><h4>Available Endpoints</h4>' +
    '<table class="subpage-table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>' +
    '<tbody>' +
    '<tr><td><span class="badge-get">GET</span></td><td><code>/api/orders</code></td><td>List all orders</td></tr>' +
    '<tr><td><span class="badge-post">POST</span></td><td><code>/api/orders</code></td><td>Create new order</td></tr>' +
    '<tr><td><span class="badge-get">GET</span></td><td><code>/api/customers</code></td><td>List customers</td></tr>' +
    '<tr><td><span class="badge-post">POST</span></td><td><code>/api/customers</code></td><td>Create customer</td></tr>' +
    '<tr><td><span class="badge-get">GET</span></td><td><code>/api/products</code></td><td>List products</td></tr>' +
    '</tbody></table></div></div>';
}

function buildMergeFieldsPage() {
  var fields = [
    ['{{customer_name}}','Customer full name'],['{{customer_email}}','Customer email'],
    ['{{order_number}}','Order number'],['{{order_date}}','Event date'],
    ['{{order_total}}','Order total amount'],['{{company_name}}','Your company name'],
    ['{{company_phone}}','Your company phone'],['{{event_address}}','Event location address'],
    ['{{products_list}}','List of rented products'],['{{payment_due}}','Payment due amount']
  ];
  return '<div class="merge-fields-panel"><p class="merge-intro">Use these merge fields in your email templates, contracts, and documents:</p>' +
    '<table class="subpage-table"><thead><tr><th>Field Code</th><th>Description</th><th></th></tr></thead><tbody>' +
    fields.map(function(f){
      return '<tr><td><code>' + f[0] + '</code></td><td>' + f[1] + '</td>' +
        '<td><button class="btn-copy-field" onclick="alert(\"Copied: ' + f[0] + '\")"><i class="fa-solid fa-copy"></i> Copy</button></td></tr>';
    }).join('') +
    '</tbody></table></div>';
}

function buildGenericPage(title, pageKey) {
  return '<div class="generic-page-content">' +
    '<div class="generic-page-icon"><i class="fa-solid fa-gear fa-3x" style="color:#17a589"></i></div>' +
    '<h3>' + title + '</h3>' +
    '<p>Configure your ' + title.toLowerCase() + ' settings here.</p>' +
    '<form class="settings-form" onsubmit="return false;"><div class="form-section">' +
    '<div class="form-group"><label>Name</label><input type="text" class="form-control" placeholder="Enter name..."></div>' +
    '<div class="form-group"><label>Description</label><textarea class="form-control" rows="3" placeholder="Description..."></textarea></div>' +
    '<div class="form-group"><label>Status</label><select class="form-control"><option>Active</option><option>Inactive</option></select></div>' +
    '</div>' +
    '<button type="submit" class="btn-primary" onclick="alert(\"Saved!\")">Save</button> ' +
    '<button type="button" class="btn-secondary" onclick="closeAdminPage()">Cancel</button>' +
    '</form></div>';
}
