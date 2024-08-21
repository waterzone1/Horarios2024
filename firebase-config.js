import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3FUYiVZpP9F943aCLJZJ3N8J7RcpRfDY",
    authDomain: "horarios2024-657a6.firebaseapp.com",
    databaseURL: "https://horarios2024-657a6-default-rtdb.firebaseio.com",
    projectId: "horarios2024-657a6",
    storageBucket: "horarios2024-657a6.appspot.com",
    messagingSenderId: "445570564452",
    appId: "1:445570564452:web:287f3f2326b2722f437a71",
    measurementId: "G-ZQRHDR7STP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
