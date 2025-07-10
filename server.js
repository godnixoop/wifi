const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// WiFi Configuration
const WIFI_CONFIG = {
    ssid: 'Elevate_2Ghz',
    password: '9999999997',
    security: 'WPA3'
};

// Database setup
const db = new sqlite3.Database('wifi_connections.db', (err) => {
    if (err) {
        console.error('Database error:', err);
    } else {
        console.log('📊 Database connected');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT UNIQUE,
            device_name TEXT,
            mac_address TEXT,
            ip_address TEXT,
            connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'connected'
        )`);
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

// Connect to WiFi endpoint
app.post('/api/connect', (req, res) => {
    try {
        const { deviceName } = req.body;
        const deviceId = uuidv4();
        const clientIP = req.ip || req.connection.remoteAddress;
        const macAddress = generateMacAddress();
        
        console.log(`📱 Device ${deviceName} (${deviceId}) attempting to connect`);
        
        // Simulate WiFi connection with realistic timing
        setTimeout(() => {
            // Store connection in database
            const stmt = db.prepare(`
                INSERT INTO connections (device_id, device_name, mac_address, ip_address, status)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            stmt.run(deviceId, deviceName, macAddress, clientIP, 'connected', function(err) {
                if (err) {
                    console.error('❌ Database error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to record connection'
                    });
                }
                
                console.log(`✅ Successfully connected to ${WIFI_CONFIG.ssid}`);
                
                res.json({
                    success: true,
                    message: `Successfully connected to ${WIFI_CONFIG.ssid}`,
                    deviceId: deviceId,
                    wifiInfo: {
                        ssid: WIFI_CONFIG.ssid,
                        status: 'connected',
                        security: WIFI_CONFIG.security
                    }
                });
            });
            
            stmt.finalize();
        }, 1500); // Realistic connection time
        
    } catch (error) {
        console.error('❌ Connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Connection failed'
        });
    }
});

// Get statistics
app.get('/api/statistics', (req, res) => {
    db.all('SELECT * FROM connections ORDER BY connected_at DESC', (err, rows) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch statistics'
            });
        }
        
        const totalConnections = rows.length;
        const today = new Date().toISOString().split('T')[0];
        const todayConnections = rows.filter(row => 
            row.connected_at && row.connected_at.includes(today)
        ).length;
        
        const uniqueDevices = new Set(rows.map(row => row.device_name)).size;
        const recentConnections = rows.slice(0, 20).map(row => ({
            deviceName: row.device_name,
            timestamp: row.connected_at
        }));
        
        res.json({
            success: true,
            statistics: {
                totalConnections,
                todayConnections,
                uniqueDevices,
                recentConnections
            }
        });
    });
});

// Export data
app.get('/api/export', (req, res) => {
    db.all('SELECT device_name, connected_at, status FROM connections ORDER BY connected_at DESC', (err, rows) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to export data'
            });
        }
        
        let csvContent = 'Device Name,Connection Time,Status\n';
        rows.forEach(row => {
            csvContent += `"${row.device_name}","${row.connected_at}","${row.status}"\n`;
        });
        
        res.json({
            success: true,
            csvData: csvContent
        });
    });
});

// Clear all data
app.delete('/api/clear', (req, res) => {
    db.run('DELETE FROM connections', (err) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to clear data'
            });
        }
        res.json({
            success: true,
            message: 'All data cleared successfully'
        });
    });
});

// Helper function to generate MAC address
function generateMacAddress() {
    const hexDigits = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
        mac += hexDigits[Math.floor(Math.random() * 16)];
        mac += hexDigits[Math.floor(Math.random() * 16)];
        if (i < 5) mac += ':';
    }
    return mac;
}



// Start server
app.listen(PORT, () => {
    console.log(`🚀 WiFi Connect Server running on port ${PORT}`);
    console.log(`📡 WiFi Network: ${WIFI_CONFIG.ssid}`);
    console.log(`🔐 Security: ${WIFI_CONFIG.security}`);
    console.log(`🌐 Access the website at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('❌ Error closing database:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
}); 