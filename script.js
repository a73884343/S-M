// ===== بيانات الإدارة =====
let MASTER_OWNER = { name: "Azoz", pass: "Mnqw0912", role: "owner", expiry: 9999999999999 };
let DEPUTY_OWNER = { name:"", pass:"", role:"deputy", expiry: 9999999999999 };
let users = JSON.parse(localStorage.getItem('sm_users')) || [];
let codes = JSON.parse(localStorage.getItem('sm_codes')) || [];
let cur = null;
let adminAlerts = [];

// ===== وظائف Auth =====
let isLogin = true;
function switchMode(){isLogin=!isLogin; document.getElementById('auth-title').innerText = isLogin?"تسجيل الدخول":"تسجيل جديد بكود"; document.getElementById('toggle-p').innerText = isLogin?"ليس لديك حساب؟ سجل الآن":"عندك حساب؟ ادخل";}

function runBot(type){
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    if(u===MASTER_OWNER.name && p===MASTER_OWNER.pass){ cur=MASTER_OWNER; alert("حيوووو عمنا 🙌"); start(); return; }
    if(u===DEPUTY_OWNER.name && p===DEPUTY_OWNER.pass){ cur=DEPUTY_OWNER; alert("حيوووو عمنا 🙌"); start(); return; }

    if(isLogin){
        let user=users.find(x=>x.name===u && x.pass===p);
        if(user){ cur=user; start(); } else { alert("خطأ في البيانات!"); }
    } else {
        let c=codes.find(x=>x.key===u && !x.used);
        if(c){
            let n={name:"User_"+Math.floor(Math.random()*99), pass:p, expiry:Date.now()+c.duration, role:"user"};
            c.used=true; users.push(n); cur=n; save(); start();
            addAlert(`تم تسجيل مستخدم جديد: ${n.name}`);
        } else { alert("الكود غلط!"); }
    }
}

// ===== وظائف Owner/Admin =====
function start(){
    document.getElementById('auth-screen').style.display='none';
    document.getElementById('app').style.display='block';

    if(cur.role==='owner'){ document.getElementById('admin-only').style.display='block'; document.getElementById('owner-tag').style.display='inline'; document.getElementById('owner-tag').innerText="OWNER"; }
    else if(cur.role==='deputy'){ document.getElementById('admin-only').style.display='block'; document.getElementById('owner-tag').style.display='inline'; document.getElementById('owner-tag').innerText="DEPUTY"; }
    else if(cur.role==='admin'){ document.getElementById('admin-only').style.display='block'; document.getElementById('owner-tag').style.display='inline'; document.getElementById('owner-tag').innerText="ADMIN"; }

    renderHome();
    renderDemoContent();
    renderUsers();
    renderAlerts();
    setInterval(updateTimer,1000);
}

// ===== التسلسل الإداري =====
function addDeputy(){
    if(cur.role!=='owner') return alert("فقط Owner يمكنه إضافة نائب!");
    let uname=prompt("ادخل اسم نائب Owner:");
    let pass=prompt("كلمة المرور:");
    if(!uname||!pass) return alert("يجب إدخال البيانات");
    DEPUTY_OWNER={name:uname,pass:pass,role:"deputy",expiry:9999999999999};
    alert("تم تعيين نائب Owner بنجاح!");
    renderUsers();
}

function addNewAdmin(){
    if(cur.role!=='owner' && cur.role!=='deputy') return alert("فقط Owner أو Deputy يمكنهم إضافة أدمن!");
    let uname=prompt("ادخل اسم الأدمن الجديد:");
    let pass=prompt("كلمة المرور:");
    if(!uname||!pass) return alert("يجب إدخال البيانات");
    let newAdmin={name:uname,pass:pass,role:"admin",expiry:Date.now()+9999999999999};
    users.push(newAdmin); save(); alert("تم إضافة أدمن جديد!"); renderUsers();
}

function changeOwnerPass(){
    if(cur.role!=='owner') return alert("فقط Owner يمكنه تغيير كلمة المرور!");
    let newPass=prompt("ادخل كلمة المرور الجديدة للـ Owner:");
    if(!newPass) return alert("يجب إدخال كلمة المرور");
    MASTER_OWNER.pass=newPass; alert("تم تغيير كلمة مرور Owner بنجاح!");
}

function renderUsers(){
    const tbody=document.querySelector("#users-table tbody");
    tbody.innerHTML="";
    tbody.innerHTML+=`<tr><td>${MASTER_OWNER.name}</td><td>Owner</td><td>∞</td><td>---</td></tr>`;
    if(DEPUTY_OWNER.name) tbody.innerHTML+=`<tr><td>${DEPUTY_OWNER.name}</td><td>Deputy</td><td>∞</td><td>---</td></tr>`;
    users.forEach(u=>{
        let d=new Date(u.expiry);
        tbody.innerHTML+=`<tr><td>${u.name}</td><td>${u.role}</td><td>${u.role==='user'?d.toLocaleString():'∞'}</td><td>${u.role==='user'?`<button class="btn" onclick="deleteUser('${u.name}')">حذف</button>`:''}</td></tr>`;
    });
}

function deleteUser(name){ if(confirm("هل تريد حذف المستخدم؟")){ users=users.filter(u=>u.name!==name); save(); renderUsers(); } }

// ===== الأكواد =====
function makeKey(ms){
    let k="SM-"+Math.random().toString(36).substr(2,5).toUpperCase();
    codes.push({key:k,duration:ms,used:false}); save(); addAlert(`تم إنشاء كود جديد: ${k}`);
}

// ===== محتوى تجريبي =====
const demoMovies=[],demoSeries=[],demoAnime=[];
for(let i=1;i<=50;i++){demoMovies.push({title:"فيلم S&M الحصري "+i,year:2020+(i%4),type:"أكشن",rating:(6+Math.random()*4).toFixed(1),poster:`https://picsum.photos/seed/movie${i}/200/300`,desc:"وصف قصير للفيلم "+i});}
for(let i=1;i<=50;i++){demoSeries.push({title:"مسلسل S&M الحصري "+i,year:2018+(i%5),type:"دراما",rating:(6+Math.random()*4).toFixed(1),poster:`https://picsum.photos/seed/series${i}/200/300`,desc:"وصف قصير للمسلسل "+i});}
for(let i=1;i<=50;i++){demoAnime.push({title:"أنمي S&M الحصري "+i,year:2015+(i%6),type:"مغامرات",rating:(6+Math.random()*4).toFixed(1),poster:`https://picsum.photos/seed/anime${i}/200/300`,desc:"وصف قصير للأنمي "+i});}

function renderDemoContent(){
    const moviesPage=document.getElementById('movies-page');
    const seriesPage=document.getElementById('series-page');
    const animePage=document.getElementById('anime-page');
    demoMovies.forEach(f=>moviesPage.innerHTML+=createCardHTML(f));
    demoSeries.forEach(s=>seriesPage.innerHTML+=createCardHTML(s));
    demoAnime.forEach(a=>animePage.innerHTML+=createCardHTML(a));
    renderStats();
}

function createCardHTML(content){return `<div class="card"><img src="${content.poster}" alt="${content.title}"><div class="card-body"><h4>${content.title}</h4><p>${content.year} | ${content.type} | ⭐ ${content.rating}</p><p>${content.desc}</p></div></div>`;}

function renderStats(){
    let moviesCount=document.getElementById('movies-page').children.length;
    let seriesCount=document.getElementById('series-page').children.length;
    let animeCount=document.getElementById('anime-page').children.length;
    document.getElementById('stats-counts').innerText=`الأفلام: ${moviesCount} | المسلسلات: ${seriesCount} | الأنمي: ${animeCount}`;
}

// ===== التنبيهات =====
function addAlert(msg){adminAlerts.push(msg); renderAlerts();}
function renderAlerts(){
    const box=document.getElementById('alerts-box');
    box.innerHTML=adminAlerts.join("<br>");
}

// ===== القائمة + صفحات =====
function toggleMenu(){document.getElementById('side-menu').classList.toggle('active');}
function page(p){
    document.getElementById('home-page').style.display=p==='home'?'grid':'none';
    document.getElementById('movies-page').style.display=p==='movies'?'grid':'none';
    document.getElementById('series-page').style.display=p==='series'?'grid':'none';
    document.getElementById('anime-page').style.display=p==='anime'?'grid':'none';
    toggleMenu();
}

// ===== حفظ البيانات =====
function save(){localStorage.setItem('sm_users',JSON.stringify(users)); localStorage.setItem('sm_codes',JSON.stringify(codes));}

// ===== تحديث المؤقت =====
function updateTimer(){
    if(!cur) return;
    let diff=cur.expiry-Date.now();
    if(diff<=0 && cur.name!=='Azoz') document.getElementById('owaida-blocker').style.display='flex';
    else document.getElementById('timer-display').innerText=`الوقت: ${Math.floor(diff/60000)}د`;
}

// ===== صفحة الرئيسية =====
function renderHome(){const h=document.getElementById('home-page'); h.innerHTML=""; demoMovies.slice(0,10).forEach(f=>h.innerHTML+=createCardHTML(f)); demoSeries.slice(0,10).forEach(s=>h.innerHTML+=createCardHTML(s)); demoAnime.slice(0,10).forEach(a=>h.innerHTML+=createCardHTML(a));}