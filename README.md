# 🌟 WiFi Connect App

A beautiful, minimal WiFi connection website with device tracking and statistics. Features stunning animations with shooting stars, glitter effects, and a sophisticated PIN-protected admin panel.

## ✨ Features

- **🌐 One-tap WiFi connection** with QR code generation
- **📊 Device tracking** with timestamps and statistics
- **🔐 PIN-protected admin panel** (click .xilk logo)
- **✨ Beautiful animations** - shooting stars, glitter, floating particles
- **📱 Mobile-optimized** with responsive design
- **🎨 Minimal black theme** with navy blue accents
- **📈 Real-time statistics** and data export

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure WiFi
Edit `config.js` with your WiFi details:
```javascript
module.exports = {
    wifi: {
        ssid: 'YOUR_WIFI_SSID',
        password: 'YOUR_WIFI_PASSWORD',
        security: 'WPA3', // or WPA2, WPA, WEP
        hidden: false
    }
};
```

### 3. Run the App
```bash
npm start
```

### 4. Access the App
- **Main App**: http://localhost:3000
- **Mobile Version**: http://localhost:3000/mobile
- **Admin Panel**: Click the .xilk logo and enter PIN (default: 1234)

## 📁 File Structure

```
WIFI/
├── server.js              # Main server file
├── config.js              # WiFi configuration
├── package.json           # Dependencies
├── vercel.json           # Vercel deployment config
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/               # Frontend files
    ├── index.html        # Desktop version
    ├── mobile.html       # Mobile version
    ├── styles.css        # Desktop styles
    ├── mobile-styles.css # Mobile styles
    ├── script.js         # Desktop JavaScript
    └── mobile-script.js  # Mobile JavaScript
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Deploy to Heroku
```bash
heroku create your-wifi-app
git push heroku main
```

## 🔧 Configuration

### Change Admin PIN
Edit `public/script.js` line 6:
```javascript
this.correctPin = '1234'; // Change to your preferred PIN
```

### Customize Appearance
Edit `config.js` appearance section:
```javascript
appearance: {
    title: 'WiFi Connect',
    subtitle: 'Seamless connection in one tap',
    primaryColor: '#4a90e2',
    backgroundColor: '#000000'
}
```

## 📱 Mobile Features

- **Touch-optimized** interface
- **Responsive design** for all screen sizes
- **Mobile-specific** animations and effects
- **Swipe gestures** and touch feedback

## 🎨 Design Features

- **Shooting stars** with glowing trails
- **Glitter background** effects
- **Floating particles** animation
- **Glowing WiFi icon** with .xilk branding
- **Smooth transitions** and hover effects
- **Dark theme** with navy blue accents

## 🔐 Security

- **PIN protection** for admin access
- **Device tracking** with unique IDs
- **Secure WiFi** credential handling
- **Input validation** and sanitization

## 📊 Statistics Dashboard

- **Total connections** counter
- **Today's connections** 
- **Unique devices** count
- **Recent connections** table
- **CSV export** functionality
- **Data clearing** with confirmation

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite
- **Frontend**: Vanilla JavaScript + CSS3
- **Animations**: CSS3 + JavaScript
- **Deployment**: Vercel/Heroku ready

## 📄 License

MIT License - feel free to use and modify!

---

**Created with ❤️ by .xilk** 