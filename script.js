// ============================================
// DATA MANAGEMENT
// ============================================

class ApplicationTracker {
    constructor() {
        this.applications = this.loadData();
        this.editingId = null;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentSection = 'dashboard';
        this.calendarDate = new Date();
        this.deleteTargetId = null;
        this.detailTargetId = null;

        this.init();
    }

    // ----------------------------------------
    // INITIALIZATION
    // ----------------------------------------
    init() {
        this.bindEvents();
        this.loadTheme();
        this.renderAll();
        this.seedDemoData();
    }

    loadData() {
        try {
            const data = localStorage.getItem('careerTrackerApps');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveData() {
        localStorage.setItem('careerTrackerApps', JSON.stringify(this.applications));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    seedDemoData() {
        if (this.applications.length > 0) return;

        const demoData = [
            {
                id: this.generateId(), company: 'Google', position: 'Software Engineer Intern',
                applicationDate: '2025-01-15', status: 'Interview', interviewDate: '2025-02-20',
                notes: 'Phone screen completed, on-site next', jobUrl: 'https://careers.google.com',
                salary: '$8000/month', location: 'Mountain View, CA', createdAt: Date.now()
            },
            {
                id: this.generateId(), company: 'Amazon', position: 'SDE Intern',
                applicationDate: '2025-01-10', status: 'Applied', interviewDate: '',
                notes: 'Applied through referral', jobUrl: 'https://amazon.jobs',
                salary: '$7500/month', location: 'Seattle, WA', createdAt: Date.now() - 86400000
            },
            {
                id: this.generateId(), company: 'Microsoft', position: 'Frontend Developer Intern',
                applicationDate: '2025-01-08', status: 'Selected', interviewDate: '2025-01-25',
                notes: 'Received offer! Start date March 2025', jobUrl: 'https://careers.microsoft.com',
                salary: '$7000/month', location: 'Redmond, WA', createdAt: Date.now() - 172800000
            },
            {
                id: this.generateId(), company: 'Meta', position: 'Full Stack Engineer',
                applicationDate: '2025-01-05', status: 'Rejected', interviewDate: '2025-01-18',
                notes: 'Made it to final round', jobUrl: '', salary: '',
                location: 'Menlo Park, CA', createdAt: Date.now() - 259200000
            },
            {
                id: this.generateId(), company: 'Apple', position: 'iOS Developer Intern',
                applicationDate: '2025-01-20', status: 'Applied', interviewDate: '',
                notes: 'Waiting for response', jobUrl: 'https://jobs.apple.com',
                salary: '$7500/month', location: 'Cupertino, CA', createdAt: Date.now() - 345600000
            },
            {
                id: this.generateId(), company: 'Netflix', position: 'Backend Engineer',
                applicationDate: '2024-12-28', status: 'Interview', interviewDate: '2025-02-15',
                notes: 'System design interview scheduled', jobUrl: '',
                salary: '$9000/month', location: 'Los Gatos, CA', createdAt: Date.now() - 432000000
            },
            {
                id: this.generateId(), company: 'Stripe', position: 'Software Engineer',
                applicationDate: '2024-12-20', status: 'Rejected', interviewDate: '2025-01-05',
                notes: 'Coding challenge not passed', jobUrl: '',
                salary: '', location: 'San Francisco, CA', createdAt: Date.now() - 518400000
            },
            {
                id: this.generateId(), company: 'Spotify', position: 'Data Engineer Intern',
                applicationDate: '2025-01-18', status: 'Applied', interviewDate: '',
                notes: 'Applied online', jobUrl: '',
                salary: '$6500/month', location: 'New York, NY', createdAt: Date.now() - 604800000
            },
            {
                id: this.generateId(), company: 'Uber', position: 'Mobile Developer',
                applicationDate: '2025-01-12', status: 'Interview', interviewDate: '2025-02-25',
                notes: 'Technical phone screen next week', jobUrl: '',
                salary: '', location: 'San Francisco, CA', createdAt: Date.now() - 691200000
            },
            {
                id: this.generateId(), company: 'Tesla', position: 'Embedded Systems Intern',
                applicationDate: '2024-12-15', status: 'Selected', interviewDate: '2024-12-28',
                notes: 'Accepted offer for summer 2025', jobUrl: '',
                salary: '$6000/month', location: 'Palo Alto, CA', createdAt: Date.now() - 777600000
            }
        ];

        this.applications = demoData;
        this.saveData();
        this.renderAll();
    }

    // ----------------------------------------
    // EVENT BINDING
    // ----------------------------------------
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        document.querySelectorAll('.view-all').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(link.dataset.section);
            });
        });

        // Sidebar toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        document.getElementById('sidebarClose').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Add application
        document.getElementById('addNewBtn').addEventListener('click', () => this.openModal());
        const emptyAddBtn = document.getElementById('emptyAddBtn');
        if (emptyAddBtn) emptyAddBtn.addEventListener('click', () => this.openModal());

        // Modal
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // Form submit
        document.getElementById('appForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveApplication();
        });

        // Company suggestions
        document.getElementById('companyName').addEventListener('input', (e) => {
            this.showCompanySuggestions(e.target.value);
        });

        // Search
        document.getElementById('globalSearch').addEventListener('input', () => {
            this.currentPage = 1;
            this.renderApplications();
        });

        // Filters
        document.getElementById('filterStatus').addEventListener('change', () => {
            this.currentPage = 1;
            this.renderApplications();
        });

        document.getElementById('sortBy').addEventListener('change', () => {
            this.renderApplications();
        });

        document.getElementById('filterDateFrom').addEventListener('change', () => {
            this.currentPage = 1;
            this.renderApplications();
        });

        document.getElementById('filterDateTo').addEventListener('change', () => {
            this.currentPage = 1;
            this.renderApplications();
        });

        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());

        // View toggle
        document.getElementById('tableViewBtn').addEventListener('click', () => this.setView('table'));
        document.getElementById('cardViewBtn').addEventListener('click', () => this.setView('cards'));

        // Detail modal
        document.getElementById('detailClose').addEventListener('click', () => this.closeDetailModal());
        document.getElementById('detailOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeDetailModal();
        });
        document.getElementById('detailEditBtn').addEventListener('click', () => {
            this.closeDetailModal();
            this.openModal(this.detailTargetId);
        });
        document.getElementById('detailDeleteBtn').addEventListener('click', () => {
            this.closeDetailModal();
            this.confirmDelete(this.detailTargetId);
        });

        // Delete modal
        document.getElementById('deleteCancelBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('deleteConfirmBtn').addEventListener('click', () => this.deleteApplication());
        document.getElementById('deleteOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeDeleteModal();
        });

        // Calendar navigation
        document.getElementById('calPrev').addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('calNext').addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Export/Import
        document.getElementById('exportBtn').addEventListener('click', () => {
            document.getElementById('fabMenu').classList.toggle('active');
        });

        document.getElementById('exportCSV').addEventListener('click', () => this.exportCSV());
        document.getElementById('exportJSON').addEventListener('click', () => this.exportJSON());
        document.getElementById('importJSON').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => this.importJSON(e));

        // Close fab menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.export-fab')) {
                document.getElementById('fabMenu').classList.remove('active');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDetailModal();
                this.closeDeleteModal();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openModal();
            }
        });

        // Status change triggers interview date visibility
        document.getElementById('status').addEventListener('change', (e) => {
            const interviewGroup = document.getElementById('interviewDate').closest('.form-group');
            if (e.target.value === 'Interview' || e.target.value === 'Selected') {
                interviewGroup.style.display = 'flex';
            }
        });
    }

    // ----------------------------------------
    // SECTION NAVIGATION
    // ----------------------------------------
    switchSection(sectionName) {
        this.currentSection = sectionName;

        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionName);
        });

        // Update sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        const titles = {
            dashboard: 'Dashboard',
            applications: 'Applications',
            calendar: 'Interview Calendar',
            analytics: 'Analytics'
        };

        document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
        document.getElementById(`${sectionName}Section`).classList.add('active');

        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');

        // Re-render section
        if (sectionName === 'dashboard') this.renderDashboard();
        if (sectionName === 'applications') this.renderApplications();
        if (sectionName === 'calendar') this.renderCalendar();
        if (sectionName === 'analytics') this.renderAnalytics();
    }

    // ----------------------------------------
    // THEME
    // ----------------------------------------
    loadTheme() {
        const theme = localStorage.getItem('careerTrackerTheme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('careerTrackerTheme', next);
        this.updateThemeIcon(next);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ----------------------------------------
    // MODAL OPERATIONS
    // ----------------------------------------
    openModal(editId = null) {
        this.editingId = editId;
        const overlay = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('appForm');

        if (editId) {
            const app = this.applications.find(a => a.id === editId);
            if (!app) return;

            title.innerHTML = '<i class="fas fa-edit"></i> Edit Application';
            document.getElementById('companyName').value = app.company;
            document.getElementById('position').value = app.position;
            document.getElementById('applicationDate').value = app.applicationDate;
            document.getElementById('status').value = app.status;
            document.getElementById('interviewDate').value = app.interviewDate || '';
            document.getElementById('notes').value = app.notes || '';
            document.getElementById('jobUrl').value = app.jobUrl || '';
            document.getElementById('salary').value = app.salary || '';
            document.getElementById('location').value = app.location || '';
        } else {
            title.innerHTML = '<i class="fas fa-plus-circle"></i> Add Application';
            form.reset();
            document.getElementById('applicationDate').value = new Date().toISOString().split('T')[0];
        }

        overlay.classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        document.getElementById('companySuggestions').classList.remove('visible');
        this.editingId = null;
    }

    openDetailModal(id) {
        const app = this.applications.find(a => a.id === id);
        if (!app) return;

        this.detailTargetId = id;

        const statusClass = `status-${app.status.toLowerCase()}`;
        const title = document.getElementById('detailTitle');
        title.innerHTML = `<i class="fas fa-building"></i> ${app.company}`;

        const content = document.getElementById('detailContent');
        content.innerHTML = `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-building"></i> Company</span>
                <span class="detail-value">${app.company}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-user-tie"></i> Position</span>
                <span class="detail-value">${app.position}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-calendar"></i> Applied</span>
                <span class="detail-value">${this.formatDate(app.applicationDate)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-info-circle"></i> Status</span>
                <span class="detail-value"><span class="status-badge ${statusClass}">${app.status}</span></span>
            </div>
            ${app.interviewDate ? `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-calendar-check"></i> Interview</span>
                <span class="detail-value">${this.formatDate(app.interviewDate)}</span>
            </div>` : ''}
            ${app.location ? `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Location</span>
                <span class="detail-value">${app.location}</span>
            </div>` : ''}
            ${app.salary ? `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-dollar-sign"></i> Salary</span>
                <span class="detail-value">${app.salary}</span>
            </div>` : ''}
            ${app.jobUrl ? `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-link"></i> URL</span>
                <span class="detail-value"><a href="${app.jobUrl}" target="_blank" style="color: var(--primary)">${app.jobUrl}</a></span>
            </div>` : ''}
            ${app.notes ? `
            <div class="detail-row">
                <span class="detail-label"><i class="fas fa-sticky-note"></i> Notes</span>
                <span class="detail-value">${app.notes}</span>
            </div>` : ''}
        `;

        document.getElementById('detailOverlay').classList.add('active');
    }

    closeDetailModal() {
        document.getElementById('detailOverlay').classList.remove('active');
        this.detailTargetId = null;
    }

    confirmDelete(id) {
        this.deleteTargetId = id;
        document.getElementById('deleteOverlay').classList.add('active');
    }

    closeDeleteModal() {
        document.getElementById('deleteOverlay').classList.remove('active');
        this.deleteTargetId = null;
    }

    // ----------------------------------------
    // CRUD OPERATIONS
    // ----------------------------------------
    saveApplication() {
        const data = {
            company: document.getElementById('companyName').value.trim(),
            position: document.getElementById('position').value.trim(),
            applicationDate: document.getElementById('applicationDate').value,
            status: document.getElementById('status').value,
            interviewDate: document.getElementById('interviewDate').value || '',
            notes: document.getElementById('notes').value.trim(),
            jobUrl: document.getElementById('jobUrl').value.trim(),
            salary: document.getElementById('salary').value.trim(),
            location: document.getElementById('location').value.trim()
        };

        if (!data.company || !data.position || !data.applicationDate) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        if (this.editingId) {
            const index = this.applications.findIndex(a => a.id === this.editingId);
            if (index !== -1) {
                this.applications[index] = { ...this.applications[index], ...data };
                this.showToast('Application updated successfully!', 'success');
            }
        } else {
            const newApp = {
                id: this.generateId(),
                ...data,
                createdAt: Date.now()
            };
            this.applications.unshift(newApp);
            this.showToast('Application added successfully!', 'success');
        }

        this.saveData();
        this.closeModal();
        this.renderAll();
    }

    deleteApplication() {
        if (!this.deleteTargetId) return;

        this.applications = this.applications.filter(a => a.id !== this.deleteTargetId);
        this.saveData();
        this.closeDeleteModal();
        this.showToast('Application deleted!', 'info');
        this.renderAll();
    }

    // ----------------------------------------
    // COMPANY SUGGESTIONS
    // ----------------------------------------
    showCompanySuggestions(query) {
        const container = document.getElementById('companySuggestions');
        if (!query || query.length < 2) {
            container.classList.remove('visible');
            return;
        }

        const existing = [...new Set(this.applications.map(a => a.company))];
        const popularCompanies = [
            'Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'Tesla',
            'Uber', 'Lyft', 'Airbnb', 'Stripe', 'Spotify', 'Twitter', 'LinkedIn',
            'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'Nvidia', 'PayPal',
            'Snap', 'Pinterest', 'Dropbox', 'Shopify', 'Slack', 'Zoom',
            'Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'Deloitte', 'McKinsey'
        ];

        const all = [...new Set([...existing, ...popularCompanies])];
        const matches = all.filter(c => c.toLowerCase().includes(query.toLowerCase())).slice(0, 6);

        if (matches.length === 0) {
            container.classList.remove('visible');
            return;
        }

        container.innerHTML = matches.map(c => `
            <div class="suggestion-item" data-company="${c}">${c}</div>
        `).join('');

        container.classList.add('visible');

        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('companyName').value = item.dataset.company;
                container.classList.remove('visible');
            });
        });
    }

    // ----------------------------------------
    // FILTERING & SORTING
    // ----------------------------------------
    getFilteredApplications() {
        let filtered = [...this.applications];

        // Global search
        const search = document.getElementById('globalSearch').value.toLowerCase().trim();
        if (search) {
            filtered = filtered.filter(a =>
                a.company.toLowerCase().includes(search) ||
                a.position.toLowerCase().includes(search) ||
                (a.notes && a.notes.toLowerCase().includes(search)) ||
                (a.location && a.location.toLowerCase().includes(search))
            );
        }

        // Status filter
        const status = document.getElementById('filterStatus').value;
        if (status !== 'all') {
            filtered = filtered.filter(a => a.status === status);
        }

        // Date range filter
        const dateFrom = document.getElementById('filterDateFrom').value;
        const dateTo = document.getElementById('filterDateTo').value;
        if (dateFrom) {
            filtered = filtered.filter(a => a.applicationDate >= dateFrom);
        }
        if (dateTo) {
            filtered = filtered.filter(a => a.applicationDate <= dateTo);
        }

        // Sorting
        const sortBy = document.getElementById('sortBy').value;
        switch (sortBy) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
                break;
            case 'company-asc':
                filtered.sort((a, b) => a.company.localeCompare(b.company));
                break;
            case 'company-desc':
                filtered.sort((a, b) => b.company.localeCompare(a.company));
                break;
            case 'status':
                const statusOrder = { 'Selected': 0, 'Interview': 1, 'Applied': 2, 'Rejected': 3 };
                filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
        }

        return filtered;
    }

    clearFilters() {
        document.getElementById('globalSearch').value = '';
        document.getElementById('filterStatus').value = 'all';
        document.getElementById('sortBy').value = 'date-desc';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        this.currentPage = 1;
        this.renderApplications();
        this.showToast('Filters cleared', 'info');
    }

    // ----------------------------------------
    // VIEW TOGGLE
    // ----------------------------------------
    setView(view) {
        document.getElementById('tableViewBtn').classList.toggle('active', view === 'table');
        document.getElementById('cardViewBtn').classList.toggle('active', view === 'cards');
        document.getElementById('tableView').style.display = view === 'table' ? 'block' : 'none';
        document.getElementById('cardView').style.display = view === 'cards' ? 'grid' : 'none';

        if (view === 'cards') this.renderCardView();
    }

    // ----------------------------------------
    // RENDER ALL
    // ----------------------------------------
    renderAll() {
        this.renderDashboard();
        this.renderApplications();
        this.renderCalendar();
        this.renderAnalytics();
    }

    // ----------------------------------------
    // DASHBOARD
    // ----------------------------------------
    renderDashboard() {
        this.renderStats();
        this.renderStatusChart();
        this.renderTimelineChart();
        this.renderRecentList();
        this.renderUpcomingList();
    }

    renderStats() {
        const total = this.applications.length;
        const applied = this.applications.filter(a => a.status === 'Applied').length;
        const interview = this.applications.filter(a => a.status === 'Interview').length;
        const selected = this.applications.filter(a => a.status === 'Selected').length;
        const rejected = this.applications.filter(a => a.status === 'Rejected').length;
        const rate = total > 0 ? Math.round((selected / total) * 100) : 0;

        this.animateCounter('statTotal', total);
        this.animateCounter('statInterview', interview);
        this.animateCounter('statSelected', selected);
        this.animateCounter('statRejected', rejected);
        this.animateCounter('statPending', applied);
        document.getElementById('statRate').textContent = rate + '%';
    }

    animateCounter(id, target) {
        const el = document.getElementById(id);
        const current = parseInt(el.textContent) || 0;
        if (current === target) return;

        const duration = 600;
        const steps = 30;
        const increment = (target - current) / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            if (step >= steps) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.round(current + increment * step);
            }
        }, duration / steps);
    }

    renderStatusChart() {
        const canvas = document.getElementById('statusChart');
        const ctx = canvas.getContext('2d');

        const applied = this.applications.filter(a => a.status === 'Applied').length;
        const interview = this.applications.filter(a => a.status === 'Interview').length;
        const selected = this.applications.filter(a => a.status === 'Selected').length;
        const rejected = this.applications.filter(a => a.status === 'Rejected').length;
        const total = applied + interview + selected + rejected;

        // Set canvas size
        const size = 200;
        canvas.width = size * 2;
        canvas.height = size * 2;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(2, 2);

        const data = [
            { value: applied, color: '#f59e0b', label: 'Applied' },
            { value: interview, color: '#3b82f6', label: 'Interview' },
            { value: selected, color: '#10b981', label: 'Selected' },
            { value: rejected, color: '#ef4444', label: 'Rejected' }
        ].filter(d => d.value > 0);

        // Draw donut
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = 70;
        const innerRadius = 45;
        let startAngle = -Math.PI / 2;

        ctx.clearRect(0, 0, size, size);

        if (total === 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
            ctx.fillStyle = '#e5e7eb';
            ctx.fill();

            ctx.font = 'bold 14px Inter';
            ctx.fillStyle = '#9ca3af';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No Data', centerX, centerY);
        } else {
            data.forEach(segment => {
                const sliceAngle = (segment.value / total) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
                ctx.closePath();
                ctx.fillStyle = segment.color;
                ctx.fill();
                startAngle += sliceAngle;
            });

            // Center text
            ctx.font = 'bold 24px Inter';
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(total, centerX, centerY - 8);

            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
            ctx.fillText('Total', centerX, centerY + 12);
        }

        // Legend
        const legend = document.getElementById('statusLegend');
        legend.innerHTML = [
            { label: 'Applied', value: applied, color: '#f59e0b' },
            { label: 'Interview', value: interview, color: '#3b82f6' },
            { label: 'Selected', value: selected, color: '#10b981' },
            { label: 'Rejected', value: rejected, color: '#ef4444' }
        ].map(item => `
            <div class="legend-item">
                <span class="legend-dot" style="background: ${item.color}"></span>
                <span>${item.label}</span>
                <span class="legend-value">${item.value}</span>
            </div>
        `).join('');
    }

    renderTimelineChart() {
        const canvas = document.getElementById('timelineChart');
        const ctx = canvas.getContext('2d');

        // Get last 12 weeks data
        const weeks = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            const count = this.applications.filter(a => {
                const d = new Date(a.applicationDate);
                return d >= weekStart && d < weekEnd;
            }).length;

            weeks.push({
                label: `W${12 - i}`,
                value: count
            });
        }

        const width = canvas.parentElement.clientWidth - 48;
        const height = 250;
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(2, 2);
        ctx.clearRect(0, 0, width, height);

        const padding = { top: 20, right: 20, bottom: 40, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxVal = Math.max(...weeks.map(w => w.value), 1);
        const barWidth = chartWidth / weeks.length * 0.6;
        const gap = chartWidth / weeks.length * 0.4;

        // Grid lines
        const gridLines = 4;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.font = '10px Inter';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#9ca3af';
        ctx.textAlign = 'right';

        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            const val = Math.round(maxVal - (maxVal / gridLines) * i);
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            ctx.fillText(val, padding.left - 8, y + 4);
        }

        // Bars
        weeks.forEach((week, i) => {
            const x = padding.left + (chartWidth / weeks.length) * i + gap / 2;
            const barHeight = (week.value / maxVal) * chartHeight;
            const y = padding.top + chartHeight - barHeight;

            // Bar gradient
            const gradient = ctx.createLinearGradient(0, y, 0, padding.top + chartHeight);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#818cf8');

            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Value on top
            if (week.value > 0) {
                ctx.font = 'bold 10px Inter';
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#1a1a2e';
                ctx.textAlign = 'center';
                ctx.fillText(week.value, x + barWidth / 2, y - 6);
            }

            // Label
            ctx.font = '10px Inter';
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#9ca3af';
            ctx.textAlign = 'center';
            ctx.fillText(week.label, x + barWidth / 2, padding.top + chartHeight + 20);
        });
    }

    renderRecentList() {
        const container = document.getElementById('recentList');
        const recent = [...this.applications]
            .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
            .slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = `
                <div class="no-upcoming">
                    <i class="fas fa-inbox"></i>
                    <p>No applications yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recent.map(app => `
            <div class="recent-item" data-id="${app.id}">
                <div class="recent-company-logo">${app.company.charAt(0).toUpperCase()}</div>
                <div class="recent-info">
                    <div class="recent-company">${app.company}</div>
                    <div class="recent-position">${app.position}</div>
                </div>
                <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span>
                <span class="recent-date">${this.formatDate(app.applicationDate)}</span>
            </div>
        `).join('');

        container.querySelectorAll('.recent-item').forEach(item => {
            item.addEventListener('click', () => this.openDetailModal(item.dataset.id));
        });
    }

    renderUpcomingList() {
        const container = document.getElementById('upcomingList');
        const today = new Date().toISOString().split('T')[0];

        const upcoming = this.applications
            .filter(a => a.interviewDate && a.interviewDate >= today && a.status === 'Interview')
            .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
            .slice(0, 5);

        if (upcoming.length === 0) {
            container.innerHTML = `
                <div class="no-upcoming">
                    <i class="fas fa-calendar-times"></i>
                    <p>No upcoming interviews</p>
                </div>
            `;
            return;
        }

        container.innerHTML = upcoming.map(app => {
            const date = new Date(app.interviewDate + 'T00:00:00');
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            const daysUntil = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));

            return `
                <div class="upcoming-item">
                    <div class="upcoming-date-badge">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <div class="upcoming-info">
                        <div class="upcoming-company">${app.company}</div>
                        <div class="upcoming-position">${app.position}</div>
                    </div>
                    <span class="upcoming-time">${daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}</span>
                </div>
            `;
        }).join('');
    }

    // ----------------------------------------
    // APPLICATIONS LIST
    // ----------------------------------------
    renderApplications() {
        const filtered = this.getFilteredApplications();
        const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
        this.currentPage = Math.min(this.currentPage, Math.max(totalPages, 1));

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const paginated = filtered.slice(start, start + this.itemsPerPage);

        this.renderTableView(paginated);
        this.renderCardView(paginated);
        this.renderPagination(filtered.length, totalPages);

        // Empty state
        const emptyState = document.getElementById('emptyState');
        const tableBody = document.getElementById('appTableBody');
        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            tableBody.parentElement.querySelector('thead').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            tableBody.parentElement.querySelector('thead').style.display = '';
        }
    }

    renderTableView(apps) {
        const tbody = document.getElementById('appTableBody');
        tbody.innerHTML = apps.map(app => `
            <tr data-id="${app.id}">
                <td>
                    <div class="company-cell">
                        <div class="company-logo">${app.company.charAt(0).toUpperCase()}</div>
                        <span class="company-name">${app.company}</span>
                    </div>
                </td>
                <td>${app.position}</td>
                <td>${this.formatDate(app.applicationDate)}</td>
                <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
                <td>${app.interviewDate ? this.formatDate(app.interviewDate) : '—'}</td>
                <td class="notes-cell" title="${app.notes || ''}">${app.notes || '—'}</td>
                <td>
                    <div class="actions-cell">
                        <button class="action-btn view" title="View" data-action="view" data-id="${app.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" title="Edit" data-action="edit" data-id="${app.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Delete" data-action="delete" data-id="${app.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Row click for detail
        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                this.openDetailModal(row.dataset.id);
            });
        });

        // Action buttons
        tbody.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                if (action === 'view') this.openDetailModal(id);
                if (action === 'edit') this.openModal(id);
                if (action === 'delete') this.confirmDelete(id);
            });
        });
    }

    renderCardView(apps) {
        const container = document.getElementById('cardView');
        if (!apps) apps = this.getFilteredApplications();

        container.innerHTML = apps.map(app => `
            <div class="app-card status-${app.status.toLowerCase()}-card" data-id="${app.id}">
                <div class="card-header">
                    <div class="card-company">
                        <div class="company-logo">${app.company.charAt(0).toUpperCase()}</div>
                        <span class="card-company-name">${app.company}</span>
                    </div>
                    <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span>
                </div>
                <div class="card-position">${app.position}</div>
                <div class="card-details">
                    <div class="card-detail">
                        <i class="fas fa-calendar"></i>
                        Applied: ${this.formatDate(app.applicationDate)}
                    </div>
                    ${app.interviewDate ? `
                    <div class="card-detail">
                        <i class="fas fa-calendar-check"></i>
                        Interview: ${this.formatDate(app.interviewDate)}
                    </div>` : ''}
                    ${app.location ? `
                    <div class="card-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        ${app.location}
                    </div>` : ''}
                    ${app.salary ? `
                    <div class="card-detail">
                        <i class="fas fa-dollar-sign"></i>
                        ${app.salary}
                    </div>` : ''}
                </div>
                ${app.notes ? `<div class="card-notes">${app.notes}</div>` : ''}
                <div class="card-actions">
                    <button class="action-btn view" data-action="view" data-id="${app.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" data-action="edit" data-id="${app.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-action="delete" data-id="${app.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.app-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                this.openDetailModal(card.dataset.id);
            });
        });

        container.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                if (action === 'view') this.openDetailModal(id);
                if (action === 'edit') this.openModal(id);
                if (action === 'delete') this.confirmDelete(id);
            });
        });
    }

    renderPagination(totalItems, totalPages) {
        const container = document.getElementById('pagination');

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';

        html += `<button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>`;

        for (let i = 1; i <= totalPages; i++) {
            if (totalPages > 7) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
                } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    html += `<button class="page-btn" disabled>...</button>`;
                }
            } else {
                html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }

        html += `<button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>`;

        container.innerHTML = html;

        container.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.renderApplications();
                document.getElementById('applicationsSection').scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // ----------------------------------------
    // CALENDAR
    // ----------------------------------------
    renderCalendar() {
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        document.getElementById('calMonthYear').textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Get events for this month
        const events = {};
        this.applications.forEach(app => {
            // Application dates
            if (app.applicationDate) {
                const d = new Date(app.applicationDate);
                if (d.getMonth() === month && d.getFullYear() === year) {
                    const key = d.getDate();
                    if (!events[key]) events[key] = [];
                    events[key].push({ type: 'applied', app });
                }
            }
            // Interview dates
            if (app.interviewDate) {
                const d = new Date(app.interviewDate + 'T00:00:00');
                if (d.getMonth() === month && d.getFullYear() === year) {
                    const key = d.getDate();
                    if (!events[key]) events[key] = [];
                    events[key].push({ type: 'interview', app });
                }
            }
        });

        let html = '';

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="cal-day other-month"><span class="day-number">${daysInPrevMonth - i}</span></div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const dayEvents = events[day] || [];
            const hasEvent = dayEvents.length > 0;

            let eventHTML = '';
            dayEvents.slice(0, 2).forEach(e => {
                const color = e.type === 'interview' ? '#3b82f6' : '#f59e0b';
                eventHTML += `
                    <div class="cal-event-label" style="background: ${color}20; color: ${color}; font-weight: 600;">
                        ${e.type === 'interview' ? '💬' : '📤'} ${e.app.company}
                    </div>
                `;
            });

            if (dayEvents.length > 2) {
                eventHTML += `<div class="cal-event-label" style="color: var(--text-tertiary)">+${dayEvents.length - 2} more</div>`;
            }

            html += `
                <div class="cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                    <span class="day-number">${day}</span>
                    ${eventHTML}
                </div>
            `;
        }

        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remaining = 7 - (totalCells % 7);
        if (remaining < 7) {
            for (let i = 1; i <= remaining; i++) {
                html += `<div class="cal-day other-month"><span class="day-number">${i}</span></div>`;
            }
        }

        document.getElementById('calendarDays').innerHTML = html;
    }

    // ----------------------------------------
    // ANALYTICS
    // ----------------------------------------
    renderAnalytics() {
        this.renderMonthlyChart();
        this.renderTopCompanies();
        this.renderTopPositions();
        this.renderFunnel();
        this.renderMetrics();
    }

    renderMonthlyChart() {
        const canvas = document.getElementById('monthlyChart');
        const ctx = canvas.getContext('2d');

        const months = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            const monthStr = d.toLocaleString('default', { month: 'short' });

            const applied = this.applications.filter(a => {
                const ad = new Date(a.applicationDate);
                return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
            });

            months.push({
                label: monthStr,
                total: applied.length,
                selected: applied.filter(a => a.status === 'Selected').length,
                rejected: applied.filter(a => a.status === 'Rejected').length,
                interview: applied.filter(a => a.status === 'Interview').length
            });
        }

        const width = canvas.parentElement.clientWidth - 48;
        const height = 280;
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(2, 2);
        ctx.clearRect(0, 0, width, height);

        const padding = { top: 30, right: 30, bottom: 50, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const maxVal = Math.max(...months.map(m => m.total), 1);

        // Grid
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.font = '10px Inter';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#9ca3af';

        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 10, y + 4);
        }

        // Grouped bars
        const groupWidth = chartWidth / months.length;
        const barWidth = groupWidth * 0.15;

        const categories = [
            { key: 'total', color: '#6366f1', label: 'Total' },
            { key: 'interview', color: '#3b82f6', label: 'Interview' },
            { key: 'selected', color: '#10b981', label: 'Selected' },
            { key: 'rejected', color: '#ef4444', label: 'Rejected' }
        ];

        months.forEach((month, i) => {
            const groupX = padding.left + groupWidth * i + groupWidth * 0.1;

            categories.forEach((cat, j) => {
                const x = groupX + j * (barWidth + 3);
                const barHeight = (month[cat.key] / maxVal) * chartHeight;
                const y = padding.top + chartHeight - barHeight;

                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
                ctx.fillStyle = cat.color;
                ctx.fill();

                if (month[cat.key] > 0) {
                    ctx.font = 'bold 8px Inter';
                    ctx.fillStyle = cat.color;
                    ctx.textAlign = 'center';
                    ctx.fillText(month[cat.key], x + barWidth / 2, y - 4);
                }
            });

            // Month label
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6c757d';
            ctx.textAlign = 'center';
            ctx.fillText(month.label, groupX + (categories.length * (barWidth + 3)) / 2, padding.top + chartHeight + 20);
        });

        // Legend
        const legendY = height - 10;
        let legendX = padding.left;
        categories.forEach(cat => {
            ctx.fillStyle = cat.color;
            ctx.beginPath();
            ctx.arc(legendX + 5, legendY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '10px Inter';
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6c757d';
            ctx.textAlign = 'left';
            ctx.fillText(cat.label, legendX + 14, legendY + 3);
            legendX += ctx.measureText(cat.label).width + 30;
        });
    }

    renderTopCompanies() {
        const container = document.getElementById('topCompanies');
        const counts = {};
        this.applications.forEach(a => {
            counts[a.company] = (counts[a.company] || 0) + 1;
        });

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const max = sorted.length > 0 ? sorted[0][1] : 1;

        if (sorted.length === 0) {
            container.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">No data</p>';
            return;
        }

        container.innerHTML = sorted.map(([name, count], i) => `
            <div class="top-item">
                <span class="top-rank">${i + 1}</span>
                <div style="flex: 1">
                    <div class="top-name">${name}</div>
                    <div class="top-bar">
                        <div class="top-bar-fill" style="width: ${(count / max) * 100}%"></div>
                    </div>
                </div>
                <span class="top-count">${count}</span>
            </div>
        `).join('');
    }

    renderTopPositions() {
        const container = document.getElementById('topPositions');
        const counts = {};
        this.applications.forEach(a => {
            counts[a.position] = (counts[a.position] || 0) + 1;
        });

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const max = sorted.length > 0 ? sorted[0][1] : 1;

        if (sorted.length === 0) {
            container.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">No data</p>';
            return;
        }

        container.innerHTML = sorted.map(([name, count], i) => `
            <div class="top-item">
                <span class="top-rank">${i + 1}</span>
                <div style="flex: 1">
                    <div class="top-name">${name}</div>
                    <div class="top-bar">
                        <div class="top-bar-fill" style="width: ${(count / max) * 100}%"></div>
                    </div>
                </div>
                <span class="top-count">${count}</span>
            </div>
        `).join('');
    }

    renderFunnel() {
        const container = document.getElementById('funnelChart');
        const total = this.applications.length;
        const interview = this.applications.filter(a => a.status === 'Interview' || a.status === 'Selected').length;
        const selected = this.applications.filter(a => a.status === 'Selected').length;

        const maxWidth = 100;

        const steps = [
            { label: 'Applied', count: total, color: '#6366f1', width: maxWidth },
            { label: 'Interview', count: interview, color: '#3b82f6', width: total > 0 ? Math.max((interview / total) * maxWidth, 30) : 30 },
            { label: 'Selected', count: selected, color: '#10b981', width: total > 0 ? Math.max((selected / total) * maxWidth, 20) : 20 }
        ];

        container.innerHTML = steps.map(step => `
            <div class="funnel-step" style="background: ${step.color}; width: ${step.width}%">
                <span class="funnel-count">${step.count}</span>
                <span class="funnel-label">${step.label}</span>
            </div>
        `).join('');
    }

    renderMetrics() {
        // Average response time (days between application and interview)
        const withInterview = this.applications.filter(a => a.applicationDate && a.interviewDate);
        if (withInterview.length > 0) {
            const totalDays = withInterview.reduce((sum, a) => {
                const diff = (new Date(a.interviewDate) - new Date(a.applicationDate)) / (1000 * 60 * 60 * 24);
                return sum + Math.abs(diff);
            }, 0);
            const avg = Math.round(totalDays / withInterview.length);
            document.querySelector('#avgResponseTime .metric-value').textContent = avg;
        }

        // Application streak
        const dates = [...new Set(this.applications.map(a => a.applicationDate))].sort().reverse();
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            if (dates.includes(dateStr)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        document.querySelector('#appStreak .metric-value').textContent = streak;
    }

    // ----------------------------------------
    // UTILITIES
    // ----------------------------------------
    formatDate(dateStr) {
        if (!dateStr) return '—';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // ----------------------------------------
    // EXPORT / IMPORT
    // ----------------------------------------
    exportCSV() {
        const headers = ['Company', 'Position', 'Application Date', 'Status', 'Interview Date', 'Location', 'Salary', 'Notes', 'Job URL'];
        const rows = this.applications.map(a => [
            `"${a.company}"`,
            `"${a.position}"`,
            a.applicationDate,
            a.status,
            a.interviewDate || '',
            `"${a.location || ''}"`,
            `"${a.salary || ''}"`,
            `"${(a.notes || '').replace(/"/g, '""')}"`,
            a.jobUrl || ''
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        this.downloadFile(csv, 'career-tracker-export.csv', 'text/csv');
        this.showToast('Exported as CSV!', 'success');
        document.getElementById('fabMenu').classList.remove('active');
    }

    exportJSON() {
        const json = JSON.stringify(this.applications, null, 2);
        this.downloadFile(json, 'career-tracker-export.json', 'application/json');
        this.showToast('Exported as JSON!', 'success');
        document.getElementById('fabMenu').classList.remove('active');
    }

    importJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    const imported = data.filter(item =>
                        item.company && item.position && item.applicationDate && item.status
                    );

                    imported.forEach(item => {
                        if (!item.id) item.id = this.generateId();
                        if (!item.createdAt) item.createdAt = Date.now();
                    });

                    this.applications = [...this.applications, ...imported];
                    this.saveData();
                    this.renderAll();
                    this.showToast(`Imported ${imported.length} applications!`, 'success');
                } else {
                    this.showToast('Invalid file format', 'error');
                }
            } catch (err) {
                this.showToast('Error reading file', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
        document.getElementById('fabMenu').classList.remove('active');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ============================================
// CANVAS POLYFILL for roundRect
// ============================================
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radii) {
        if (typeof radii === 'number') radii = [radii];
        const r = radii[0] || 0;

        this.moveTo(x + r, y);
        this.lineTo(x + width - r, y);
        this.quadraticCurveTo(x + width, y, x + width, y + r);
        this.lineTo(x + width, y + height - r);
        this.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        this.lineTo(x + r, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        this.closePath();
    };
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new ApplicationTracker();
});