// ===== GOOGLE DRIVE INTEGRATION =====

const DRIVE_FOLDER_ID = '1Wbd9hG_rQEcaCPfQE_A7YfONNC2ibPrC';
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Ganti dengan Client ID Anda
const API_KEY = 'YOUR_GOOGLE_API_KEY';     // Ganti dengan API Key Anda

let tokenClient;
let accessToken = null;

// Inisialisasi Google Identity Services
function initGoogleDrive() {
    return new Promise((resolve) => {
        if (typeof google === 'undefined') {
            console.warn('Google API belum dimuat. Pastikan script gapi dimuat.');
            resolve(false);
            return;
        }

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.file',
            callback: (resp) => {
                if (resp.error) {
                    console.error('Error OAuth:', resp.error);
                    resolve(false);
                } else {
                    accessToken = resp.access_token;
                    resolve(true);
                }
            }
        });
    });
}

// Minta token akses
function requestAccessToken() {
    return new Promise((resolve) => {
        if (accessToken) {
            resolve(accessToken);
            return;
        }
        if (tokenClient) {
            tokenClient.requestAccessToken();
            // Token akan diberikan melalui callback
            // Kita gunakan polling sederhana
            let attempts = 0;
            const interval = setInterval(() => {
                if (accessToken) {
                    clearInterval(interval);
                    resolve(accessToken);
                }
                attempts++;
                if (attempts > 20) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 300);
        } else {
            resolve(null);
        }
    });
}

// Upload file ke Google Drive
async function uploadToDrive(fileName, content, contentType = 'application/json') {
    try {
        const token = await requestAccessToken();
        if (!token) {
            alert('Gagal mendapatkan akses Google Drive. Silakan login ulang.');
            return false;
        }

        const metadata = {
            name: fileName,
            parents: [DRIVE_FOLDER_ID]
        };

        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', new Blob([content], { type: contentType }));

        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('Upload error:', error);
            return false;
        }

        const result = await response.json();
        console.log('Upload berhasil:', result);
        return result.id;
    } catch (e) {
        console.error('Upload error:', e);
        return false;
    }
}

// Load data dari Google Drive
async function loadFromDrive(fileName) {
    try {
        const token = await requestAccessToken();
        if (!token) return null;

        // Cari file berdasarkan nama
        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${DRIVE_FOLDER_ID}' in parents&fields=files(id,name)`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        const searchResult = await searchResponse.json();
        if (!searchResult.files || searchResult.files.length === 0) {
            return null;
        }

        const fileId = searchResult.files[0].id;

        // Download konten file
        const downloadResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!downloadResponse.ok) return null;
        const content = await downloadResponse.text();
        return JSON.parse(content);
    } catch (e) {
        console.error('Load from drive error:', e);
        return null;
    }
}

// Backup semua data ke Google Drive
async function backupToDrive() {
    try {
        // Kumpulkan semua data
        const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '[]');
        const agendaData = JSON.parse(localStorage.getItem('agendaData') || '[]');
        const semesterData = JSON.parse(localStorage.getItem('semesterData') || '[]');

        const backup = {
            timestamp: new Date().toISOString(),
            attendance: attendanceData,
            agenda: agendaData,
            semesters: semesterData
        };

        const jsonContent = JSON.stringify(backup, null, 2);
        const fileName = `backup_pancasila_${new Date().toISOString().slice(0,10)}.json`;

        const result = await uploadToDrive(fileName, jsonContent);
        if (result) {
            alert('✅ Backup berhasil disimpan ke Google Drive!');
        } else {
            alert('❌ Gagal backup ke Google Drive.');
        }
    } catch (e) {
        console.error('Backup error:', e);
        alert('Terjadi kesalahan saat backup.');
    }
}