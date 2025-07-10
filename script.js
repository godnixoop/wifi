// Device detection and WiFi connection functionality
class WiFiConnector {
    constructor() {
        this.connectBtn = document.getElementById('connectBtn');
        this.status = document.getElementById('status');
        this.deviceModal = document.getElementById('deviceModal');
        this.confirmBtn = document.getElementById('confirmBtn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.detectDevice();
        this.startSubtleAnimations();
    }

    setupEventListeners() {
        this.connectBtn.addEventListener('click', () => this.handleConnect());
        this.confirmBtn.addEventListener('click', () => this.confirmConnection());
        
        // Close modal on outside click
        this.deviceModal.addEventListener('click', (e) => {
            if (e.target === this.deviceModal) {
                this.hideModal();
            }
        });
    }

    detectDevice() {
        this.deviceInfo = {
            name: this.getDeviceName(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    getDeviceName() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.includes('iPhone')) {
            return 'iPhone';
        } else if (userAgent.includes('iPad')) {
            return 'iPad';
        } else if (userAgent.includes('Android')) {
            return 'Android Device';
        } else if (userAgent.includes('Mac')) {
            return 'Mac';
        } else if (userAgent.includes('Windows')) {
            return 'Windows PC';
        } else if (userAgent.includes('Linux')) {
            return 'Linux PC';
        } else {
            return 'Unknown Device';
        }
    }

    async handleConnect() {
        // Add loading state
        this.setButtonLoading(true);
        
        // Show device info modal
        this.showDeviceModal();
        
        // Simulate connection delay
        await this.delay(1500);
        
        this.setButtonLoading(false);
    }

    async confirmConnection() {
        this.hideModal();
        this.setButtonLoading(true);
        
        try {
            const response = await fetch('/api/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceName: this.deviceInfo.name,
                    userAgent: this.deviceInfo.userAgent,
                    platform: this.deviceInfo.platform,
                    language: this.deviceInfo.language,
                    screenResolution: this.deviceInfo.screenResolution,
                    timezone: this.deviceInfo.timezone
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSuccess(`Connected to WiFi successfully! Device ID: ${data.deviceId}`);
                this.animateSuccess();
            } else {
                this.showError('Network Error.');
            }
        } catch (error) {
            this.showError('Network Error.');
        }
        
        this.setButtonLoading(false);
    }

    showDeviceModal() {
        document.getElementById('deviceName').textContent = this.deviceInfo.name;
        document.getElementById('userAgent').textContent = this.deviceInfo.userAgent.substring(0, 50) + '...';
        document.getElementById('connectionTime').textContent = new Date().toLocaleString();
        
        this.deviceModal.classList.remove('hidden');
        this.animateModalIn();
    }

    hideModal() {
        this.deviceModal.classList.add('hidden');
    }

    setButtonLoading(loading) {
        const buttonText = this.connectBtn.querySelector('.button-text');
        
        if (loading) {
            buttonText.innerHTML = '<span class="loading"></span> Connecting...';
            this.connectBtn.disabled = true;
        } else {
            buttonText.textContent = 'Connect to WiFi';
            this.connectBtn.disabled = false;
        }
    }

    showSuccess(message) {
        this.status.className = 'status success';
        this.status.querySelector('.status-text').textContent = message;
        this.status.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.status.classList.add('hidden');
        }, 5000);
    }

    showError(message) {
        this.status.className = 'status error';
        this.status.querySelector('.status-text').textContent = message;
        this.status.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.status.classList.add('hidden');
        }, 5000);
    }

    animateSuccess() {
        // Add success animation to the entire page
        document.body.style.animation = 'successPulse 0.5s ease-in-out';
        
        // Create success particles
        this.createSuccessParticles();
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    createSuccessParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'success-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #00ff00;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: particleFloat 2s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    animateModalIn() {
        const modalContent = this.deviceModal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease';
    }

    startSubtleAnimations() {
        // Add subtle floating animation to the entire content
        const content = document.querySelector('.content');
        content.style.animation = 'contentFloat 6s ease-in-out infinite';
        
        // Add CSS for the new animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes contentFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
            }
            
            @keyframes successPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(0);
                }
            }
            
            .success-particle {
                box-shadow: 0 0 10px #00ff00;
            }
        `;
        document.head.appendChild(style);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// PIN and Statistics functionality
class StatsManager {
    constructor() {
        this.pinModal = document.getElementById('pinModal');
        this.statsModal = document.getElementById('statsModal');
        this.pinInput = document.getElementById('pinInput');
        this.pinDots = document.querySelectorAll('.pin-dot');
        this.currentPin = '';
        this.correctPin = '1234'; // You can change this PIN
        
        this.init();
    }

    init() {
        this.setupPinEventListeners();
        this.setupModalEventListeners();
    }

    setupPinEventListeners() {
        // Close modals on outside click
        this.pinModal.addEventListener('click', (e) => {
            if (e.target === this.pinModal) {
                this.hidePinModal();
            }
        });

        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.hideStatsModal();
            }
        });

        // PIN input handling
        this.pinInput.addEventListener('input', (e) => {
            this.currentPin = e.target.value;
            this.updatePinDots();
        });

        // Keyboard support
        this.pinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitPin();
            }
        });
    }

    setupModalEventListeners() {
        // Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hidePinModal();
                this.hideStatsModal();
            });
        });
    }

    showPinModal() {
        this.pinModal.classList.remove('hidden');
        this.pinInput.focus();
        this.currentPin = '';
        this.pinInput.value = '';
        this.updatePinDots();
    }

    hidePinModal() {
        this.pinModal.classList.add('hidden');
        this.pinInput.blur();
    }

    showStatsModal() {
        this.statsModal.classList.remove('hidden');
        this.loadStatistics();
    }

    hideStatsModal() {
        this.statsModal.classList.add('hidden');
    }

    addPinDigit(digit) {
        if (this.currentPin.length < 4) {
            this.currentPin += digit;
            this.pinInput.value = this.currentPin;
            this.updatePinDots();
        }
    }

    clearPin() {
        this.currentPin = '';
        this.pinInput.value = '';
        this.updatePinDots();
        this.pinInput.focus();
    }

    updatePinDots() {
        this.pinDots.forEach((dot, index) => {
            if (index < this.currentPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    async submitPin() {
        if (this.currentPin === this.correctPin) {
            this.hidePinModal();
            this.showStatsModal();
        } else {
            // Wrong PIN animation
            this.pinInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                this.pinInput.style.animation = '';
            }, 500);
            this.clearPin();
        }
    }

    async loadStatistics() {
        try {
            const response = await fetch('/api/statistics');
            const data = await response.json();
            
            if (data.success) {
                this.updateStatisticsDisplay(data.statistics);
            } else {
                alert('Network Error.');
            }
        } catch (error) {
            alert('Network Error.');
        }
    }

    updateStatisticsDisplay(stats) {
        // Update summary cards
        document.getElementById('totalConnections').textContent = stats.totalConnections;
        document.getElementById('todayConnections').textContent = stats.todayConnections;
        document.getElementById('uniqueDevices').textContent = stats.uniqueDevices;
        
        // Update connections table
        const tableBody = document.getElementById('connectionsTableBody');
        tableBody.innerHTML = '';
        
        stats.recentConnections.forEach(connection => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${connection.deviceName}</td>
                <td>${new Date(connection.timestamp).toLocaleTimeString()}</td>
                <td>${new Date(connection.timestamp).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    async exportData() {
        try {
            const response = await fetch('/api/export');
            const data = await response.json();
            
            if (data.success) {
                const blob = new Blob([data.csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wifi-connections-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Network Error.');
            }
        } catch (error) {
            alert('Network Error.');
        }
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear all connection data? This action cannot be undone.')) {
            try {
                const response = await fetch('/api/clear', { method: 'DELETE' });
                const data = await response.json();
                
                if (data.success) {
                    this.loadStatistics(); // Refresh the display
                    alert('All data cleared successfully!');
                } else {
                    alert('Network Error.');
                }
            } catch (error) {
                alert('Network Error.');
            }
        }
    }
}

// Global functions for PIN modal
function showPinModal() {
    statsManager.showPinModal();
}

function hidePinModal() {
    statsManager.hidePinModal();
}

function addPinDigit(digit) {
    statsManager.addPinDigit(digit);
}

function clearPin() {
    statsManager.clearPin();
}

function submitPin() {
    statsManager.submitPin();
}

function hideStatsModal() {
    statsManager.hideStatsModal();
}

function exportData() {
    statsManager.exportData();
}

function clearAllData() {
    statsManager.clearAllData();
}

// Initialize the WiFi connector and Stats manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.wifiConnector = new WiFiConnector();
    window.statsManager = new StatsManager();
    
    // Add some additional interactive effects
    addInteractiveEffects();
});

function addInteractiveEffects() {
    // Add mouse trail effect
    let mouseTrail = [];
    const maxTrailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
        
        if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
        }
        
        // Create subtle glow effect at mouse position
        createMouseGlow(e.clientX, e.clientY);
    });
    
    // Add keyboard interaction
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            document.getElementById('connectBtn').click();
        }
    });
}

function createMouseGlow(x, y) {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${x - 50}px;
        top: ${y - 50}px;
        animation: mouseGlow 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(glow);
    
    setTimeout(() => {
        glow.remove();
    }, 500);
}

// Add the mouse glow animation
const mouseGlowStyle = document.createElement('style');
mouseGlowStyle.textContent = `
    @keyframes mouseGlow {
        0% {
            opacity: 0.3;
            transform: scale(0.5);
        }
        50% {
            opacity: 0.1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }
`;
document.head.appendChild(mouseGlowStyle); 