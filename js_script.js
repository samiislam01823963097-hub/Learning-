// আপনার দেওয়া Google Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyUKUZNa5fpFug3KkoBUlEsN_2GrtGBTJ51kakJ58VBT5xtYZI25iWNohkusslKGWTzQQ/exec";

// গ্লোবাল ডাটাবেস ভেরিয়েবল
let users = [], courses = [], settings = {}, withdrawRequests = [], transactions = [], supportTickets = [], notifications = [], pendingPayments = [], certificates = {}, quizResults = {}, chats = [];

// ১. গুগল শিট থেকে ডাটা লোড করা
async function loadAllData() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        if (data) {
            users = data.users || [];
            courses = data.courses || [];
            settings = data.settings || {};
            withdrawRequests = data.withdrawRequests || [];
            transactions = data.transactions || [];
            supportTickets = data.supportTickets || [];
            notifications = data.notifications || [];
            pendingPayments = data.pendingPayments || [];
            certificates = data.certificates || {};
            quizResults = data.quizResults || {};
            chats = data.chats || [];
        }
    } catch (error) {
        console.error("ডাটা লোড করতে সমস্যা হয়েছে:", error);
    }
    render();
}

// ২. গুগল শিটে ডাটা সেভ করা (প্যাকেট সিস্টেম)
async function saveAll() {
    const fullDatabase = {
        users, courses, settings, withdrawRequests, transactions,
        supportTickets, notifications, pendingPayments, certificates,
        quizResults, chats
    };

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // CORS ইস্যু এড়াতে
            body: JSON.stringify({ action: "save", db: JSON.stringify(fullDatabase) })
        });
        console.log("ডাটা গুগল শিটে সফলভাবে সংরক্ষিত হয়েছে।");
    } catch (error) {
        console.error("ডাটা সেভ করতে সমস্যা হয়েছে:", error);
    }
}

// ৩. রেন্ডার এবং অন্যান্য ফাংশন (সংক্ষিপ্ত)
function render() {
    const u = localStorage.getItem("lms_current");
    const currentUser = users.find(user => user.email === u);
    
    let appDiv = document.getElementById("app");
    if(!u) {
        appDiv.innerHTML = `
            <div class="dashboard-card" style="max-width:400px;margin:auto;text-align:center;">
                <h2>লগইন</h2>
                <input type="email" id="loginEmail" placeholder="ইমেইল" class="control-input">
                <input type="password" id="loginPass" placeholder="পাসওয়ার্ড" class="control-input">
                <button class="btn btn-primary" onclick="handleLogin()">লগইন</button>
            </div>`;
    } else {
        appDiv.innerHTML = `
            <div class="dashboard-card">
                <h2>স্বাগতম, ${currentUser.fullName}</h2>
                <p>আপনার ওয়ালেট: ${currentUser.wallet} টাকা</p>
                <button class="btn btn-primary" onclick="logout()">লগআউট</button>
            </div>`;
    }
}

function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;
    const user = users.find(u => u.email === email && btoa(pass) === u.password);
    
    if(user) {
        localStorage.setItem("lms_current", email);
        render();
    } else {
        alert("ভুল ইমেইল বা পাসওয়ার্ড!");
    }
}

function logout() {
    localStorage.removeItem("lms_current");
    render();
}

// পেজ লোড হলে ডাটাবেস কল করা
window.onload = loadAllData;