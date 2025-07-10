// Mobile-optimized WiFi connector
class MobileWiFiConnector {
    constructor() {
        this.mobileConnectBtn = document.getElementById('mobileConnectBtn');
        this.mobileStatus = document.getElementById('mobileStatus');
        this.mobileModal = document.getElementById('mobileModal');
        this.mobileConfirmBtn = document.getElementById('mobileConfirmBtn');
        this.mobileCloseBtn = document.getElementById('mobileCloseBtn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.detectDevice();
        this.startMobileAnimations();
        this.setupTouchOptimizations();
    }

    setupEventListeners() {
        // Touch events for better mobile performance
        this.mobileConnectBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.mobileConnectBtn.addEventListener('touchend', (e) => this.handleConnect(e));
        
        this.mobileConfirmBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.mobileConfirmBtn.addEventListener('touchend', (e) => this.handleConfirmConnection(e));
        
        this.mobileCloseBtn.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.mobileCloseBtn.addEventListener('touchend', (e) => this.hideModal(e));
        
        // Close modal on backdrop tap
        this.mobileModal.addEventListener('touchstart', (e) => {
            if (e.target === this.mobileModal) {
                this.hideModal(e);
            }
        });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    handleTouchStart(e) {
        // Add touch feedback
        e.target.style.transform = 'scale(0.95)';
        e.target.style.transition = 'transform 0.1s ease';
    }

    detectDevice() {
        this.deviceInfo = {
            name: this.getMobileDeviceName(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            isMobile: this.isMobileDevice()
        };
    }

    getMobileDeviceName() {
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

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    async handleConnect(e) {
        e.preventDefault();
        
        // Reset touch feedback
        this.resetTouchFeedback(e.target);
        
        // Add loading state
        this.setMobileButtonLoading(true);
        
        // Show device info modal
        this.showMobileModal();
        
        // Simulate connection delay
        await this.delay(1200);
        
        this.setMobileButtonLoading(false);
    }

    async handleConfirmConnection(e) {
        e.preventDefault();
        
        // Reset touch feedback
        this.resetTouchFeedback(e.target);
        
        this.hideModal();
        this.setMobileButtonLoading(true);
        
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
                    timezone: this.deviceInfo.timezone,
                    isMobile: this.deviceInfo.isMobile
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.showMobileSuccess(`Connected! Device ID: ${data.deviceId}`);
                this.animateMobileSuccess();
            } else {
                this.showMobileError('Connection failed. Try again.');
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.showMobileError('Network error. Check connection.');
        }
        
        this.setMobileButtonLoading(false);
    }

    resetTouchFeedback(element) {
        element.style.transform = '';
        element.style.transition = '';
    }

    showMobileModal() {
        document.getElementById('mobileDeviceName').textContent = this.deviceInfo.name;
        document.getElementById('mobileConnectionTime').textContent = new Date().toLocaleString();
        
        this.mobileModal.classList.remove('hidden');
        this.animateMobileModalIn();
    }

    hideModal(e) {
        if (e) {
            e.preventDefault();
            this.resetTouchFeedback(e.target);
        }
        this.mobileModal.classList.add('hidden');
    }

    setMobileButtonLoading(loading) {
        const buttonText = this.mobileConnectBtn.querySelector('.mobile-button-text');
        const buttonIcon = this.mobileConnectBtn.querySelector('.mobile-button-icon');
        
        if (loading) {
            buttonText.innerHTML = '<span class="mobile-loading"></span> Connecting...';
            buttonIcon.style.display = 'none';
            this.mobileConnectBtn.disabled = true;
        } else {
            buttonText.textContent = 'Connect';
            buttonIcon.style.display = 'block';
            this.mobileConnectBtn.disabled = false;
        }
    }

    showMobileSuccess(message) {
        this.mobileStatus.className = 'mobile-status success';
        this.mobileStatus.querySelector('.mobile-status-text').textContent = message;
        this.mobileStatus.classList.remove('hidden');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.mobileStatus.classList.add('hidden');
        }, 4000);
    }

    showMobileError(message) {
        this.mobileStatus.className = 'mobile-status error';
        this.mobileStatus.querySelector('.mobile-status-text').textContent = message;
        this.mobileStatus.classList.remove('hidden');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.mobileStatus.classList.add('hidden');
        }, 4000);
    }

    animateMobileSuccess() {
        // Add success animation to the entire page
        document.body.style.animation = 'mobileSuccessPulse 0.6s ease-in-out';
        
        // Create mobile success particles
        this.createMobileSuccessParticles();
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 600);
    }

    createMobileSuccessParticles() {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'mobile-success-particle';
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #00ff00;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: mobileParticleFloat 2.5s ease-out forwards;
                box-shadow: 0 0 10px #00ff00;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2500);
        }
    }

    animateMobileModalIn() {
        const modalContent = this.mobileModal.querySelector('.mobile-modal-content');
        modalContent.style.animation = 'mobileModalSlideIn 0.4s ease';
    }

    startMobileAnimations() {
        // Add mobile-specific animations
        this.addMobileAnimationStyles();
        
        // Add subtle vibration feedback (if supported)
        if ('vibrate' in navigator) {
            this.addVibrationFeedback();
        }
    }

    addMobileAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mobileSuccessPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            @keyframes mobileParticleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-150px) scale(0);
                }
            }
            
            .mobile-success-particle {
                box-shadow: 0 0 15px #00ff00;
            }
        `;
        document.head.appendChild(style);
    }

    addVibrationFeedback() {
        // Add vibration on button press
        const buttons = [this.mobileConnectBtn, this.mobileConfirmBtn];
        
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                navigator.vibrate(50);
            });
        });
    }

    setupTouchOptimizations() {
        // Prevent pull-to-refresh on mobile
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.mobile-modal')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Add haptic feedback for iOS
        if (window.navigator && window.navigator.vibrate) {
            this.setupHapticFeedback();
        }
    }

    setupHapticFeedback() {
        // Light haptic feedback for interactions
        const hapticElements = document.querySelectorAll('.mobile-connect-button, .mobile-confirm-button');
        
        hapticElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                if (window.navigator.vibrate) {
                    window.navigator.vibrate(20);
                }
            });
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize mobile WiFi connector when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MobileWiFiConnector();
    
    // Add mobile-specific optimizations
    addMobileOptimizations();
});

function addMobileOptimizations() {
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.fontSize = '16px';
        });
    });
    
    // Add mobile-specific meta tags
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(viewport);
    }
    
    // Optimize for mobile performance
    if ('serviceWorker' in navigator) {
        // Register service worker for offline functionality
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, continue without it
        });
    }
    
    // Add mobile-specific touch events
    addMobileTouchEvents();
}

function addMobileTouchEvents() {
    // Add swipe gestures for modal
    let startY = 0;
    let currentY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const diffY = startY - currentY;
        
        // Swipe down to close modal
        if (diffY < -50 && document.getElementById('mobileModal').classList.contains('hidden') === false) {
            document.getElementById('mobileModal').classList.add('hidden');
        }
    }, { passive: true });
} 