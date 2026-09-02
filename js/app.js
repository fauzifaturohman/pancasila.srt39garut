// ============================================================
// STATE
// ============================================================
let currentUser = null;
let kehadiranData = JSON.parse(localStorage.getItem('kehadiranPancasila')) || [];
let agendaData = JSON.parse(localStorage.getItem('agendaPancasila')) || [];
let catatanData = JSON.parse(localStorage.getItem('catatanPancasila')) || [];
let nilaiData = JSON.parse(localStorage.getItem('nilaiPancasila')) || [];
let materiFiles = JSON.parse(localStorage.getItem('materiFilesPancasila')) || [];
let qrScannerInstance = null;
let scannedSiswa = null;
let editingMateriId = null;

// ============================================================
// LOGIN
// ============================================================
function handleLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value.trim();
    if (u === 'guru' && p === 'pancasila') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        currentUser = 'guru';
        initApp();
        showToast('Login berhasil! Selamat datang, Guru Pancasila.', 'success');
    } else {
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => { document.getElementById('loginError').style.display = 'none'; }, 3000);
    }
}

function handleLogout() {
    if (confirm('Yakin ingin logout?')) {
        document.getElementById('app').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
        currentUser = null;
        stopQrScanner();
        showToast('Logout berhasil.', 'warning');
    }
}

// ============================================================
// INIT
// ============================================================
function initApp() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterTanggal').value = today;
    document.getElementById('agendaTanggal').value = today;
    updateStats();
    renderKehadiran();
    renderAgenda();
    renderCatatan();
    renderNilai();
    renderUploadedMateri();
    updateTotalSiswa();
}

function updateTotalSiswa() {
    const total = siswaData.length;
    const sd = siswaData.filter(s => s.jenjang === 'SD').length;
    const smp = siswaData.filter(s => s.jenjang === 'SMP').length;
    document.getElementById('totalSiswa').textContent = total;
    document.getElementById('totalSiswa2').textContent = total;
    document.getElementById('totalSD').textContent = sd;
    document.getElementById('totalSMP').textContent = smp;
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayHadir = kehadiranData.filter(k => k.tanggal === today && k.status === 'Hadir');
    const todayIzinSakit = kehadiranData.filter(k => k.tanggal === today && (k.status === 'Izin' || k.status === 'Sakit'));
    const todayAlpha = kehadiranData.filter(k => k.tanggal === today && k.status === 'Alpha');
    document.getElementById('hadirHariIni').textContent = todayHadir.length || 0;
    document.getElementById('izinSakit').textContent = todayIzinSakit.length || 0;
    document.getElementById('alpha').textContent = todayAlpha.length || 0;
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.sidebar .menu-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.sidebar .menu-item[data-page="${page}"]`).classList.add('active');
    if (page !== 'qr') stopQrScanner();
    if (page === 'kehadiran') renderKehadiran();
    if (page === 'agenda') renderAgenda();
    if (page === 'admin') { renderCatatan(); renderNilai(); }
    if (page === 'dashboard') updateStats();
}

// ============================================================
// QR CODE SCANNER
// ============================================================
function startQrScanner() {
    if (qrScannerInstance) { showToast('Scanner sudah berjalan.', 'warning'); return; }
    document.getElementById('qrStatus').textContent = '⏳ Mengaktifkan kamera...';
    document.getElementById('qrResult').textContent = '';
    try {
        qrScannerInstance = new Html5Qrcode("qr-reader");
        qrScannerInstance.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } },
            onQrScanSuccess, onQrScanError);
        document.getElementById('qrStatus').textContent = '✅ Kamera aktif. Arahkan ke QR Code siswa.';
        document.getElementById('qrStatus').style.color = 'var(--success)';
    } catch (err) {
        document.getElementById('qrStatus').textContent = '❌ Gagal memulai kamera: ' + err.message;
        document.getElementById('qrStatus').style.color = 'var(--danger)';
        showToast('Gagal mengakses kamera: ' + err.message, 'error');
    }
}

function stopQrScanner() {
    if (qrScannerInstance) {
        qrScannerInstance.stop().then(() => {
            qrScannerInstance.clear();
            qrScannerInstance = null;
            document.getElementById('qrStatus').textContent = '⏸️ Scanner dimatikan.';
            document.getElementById('qrStatus').style.color = 'var(--gray-600)';
        }).catch(err => console.warn(err));
    }
}

function onQrScanSuccess(decodedText) {
    try {
        const parts = decodedText.split('|');
        if (parts.length !== 3) { showToast('QR Code tidak valid!', 'error'); return; }
        const nisn = parts[0].trim(), nama = parts[1].trim(), jenjang = parts[2].trim();
        const siswa = siswaData.find(s => s.nisn === nisn && s.nama === nama && s.jenjang === jenjang);
        if (!siswa) {
            document.getElementById('qrResult').innerHTML = `<span style="color:var(--danger);">❌ Siswa tidak terdaftar: ${nama}</span>`;
            showToast('Siswa tidak terdaftar!', 'error');
            return;
        }
        scannedSiswa = siswa;
        document.getElementById('qrNamaSiswa').textContent = siswa.nama;
        document.getElementById('qrNisnSiswa').textContent = siswa.nisn;
        document.getElementById('qrJenjangSiswa').textContent = siswa.jenjang;
        document.getElementById('qrAbsenForm').style.display = 'block';
        document.getElementById('qrEmptyState').style.display = 'none';
        document.getElementById('qrResult').innerHTML = `<span style="color:var(--success);">✅ Scan berhasil: ${siswa.nama}</span>`;
        stopQrScanner();
        showToast(`QR Code terdeteksi: ${siswa.nama}`, 'success');
    } catch (e) { showToast('Gagal memproses QR Code: ' + e.message, 'error'); }
}

function onQrScanError(err) {}

function konfirmasiAbsenQR() {
    if (!scannedSiswa) { showToast('Scan QR Code terlebih dahulu!', 'error'); return; }
    const status = document.getElementById('qrStatusAbsen').value;
    const today = new Date().toISOString().split('T')[0];
    const sudah = kehadiranData.some(k => k.nisn === scannedSiswa.nisn && k.tanggal === today);
    if (sudah) { showToast(`${scannedSiswa.nama} sudah absen hari ini.`, 'warning'); return; }
    kehadiranData.push({
        nama: scannedSiswa.nama,
        nisn: scannedSiswa.nisn,
        jenjang: scannedSiswa.jenjang,
        status: status,
        tanggal: today,
        metode: 'QR Code',
        bukti: 'qr_scan'
    });
    localStorage.setItem('kehadiranPancasila', JSON.stringify(kehadiranData));
    updateStats();
    renderKehadiran();
    showToast(`✅ Absen ${status} untuk ${scannedSiswa.nama} berhasil!`, 'success');
    scannedSiswa = null;
    document.getElementById('qrAbsenForm').style.display = 'none';
    document.getElementById('qrEmptyState').style.display = 'block';
    document.getElementById('qrResult').innerHTML = '';
}

// ============================================================
// GENERATE QR CODE - Menggunakan API qrzap.fun
// ============================================================
function generateQRForClass() {
    const jenjang = document.getElementById('qrGenerateKelas').value;
    const siswaJenjang = siswaData.filter(s => s.jenjang === jenjang);
    const container = document.getElementById('qrGeneratedArea');
    const status = document.getElementById('qrGenStatus');

    if (siswaJenjang.length === 0) {
        showToast('Tidak ada siswa untuk jenjang ini.', 'warning');
        status.textContent = '⚠️ Tidak ada siswa untuk jenjang ini.';
        return;
    }

    container.innerHTML = '';
    status.textContent = `⏳ Menghasilkan ${siswaJenjang.length} QR Code via qrzap.fun...`;

    let count = 0;
    siswaJenjang.forEach((s) => {
        const data = `${s.nisn}|${s.nama}|${s.jenjang}`;
        const card = document.createElement('div');
        card.className = 'qr-card';

        const img = document.createElement('img');
        img.src = `https://qrzap.fun/api/generate?type=text&text=${encodeURIComponent(data)}&size=200&margin=4`;
        img.alt = `QR Code ${s.nama}`;
        img.loading = 'lazy';

        const label = document.createElement('p');
        label.className = 'qr-name';
        label.textContent = s.nama;

        const nisnLabel = document.createElement('p');
        nisnLabel.className = 'qr-nisn';
        nisnLabel.textContent = `NISN: ${s.nisn}`;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn-download';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Unduh';
        downloadBtn.onclick = function(e) {
            e.stopPropagation();
            downloadQRCode(img.src, s.nama, s.nisn);
        };

        card.appendChild(img);
        card.appendChild(label);
        card.appendChild(nisnLabel);
        card.appendChild(downloadBtn);
        container.appendChild(card);
        count++;
    });

    if (count > 0) {
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'btn btn-success btn-download-all';
        downloadAllBtn.innerHTML = `<i class="fas fa-download"></i> Unduh Semua QR Code (${count})`;
        downloadAllBtn.onclick = function() { downloadAllQRCodes(); };
        container.appendChild(downloadAllBtn);
        status.innerHTML = `<span style="color:var(--success);">✅ ${count} QR Code berhasil dibuat via qrzap.fun.</span>`;
        showToast(`✅ ${count} QR Code berhasil dibuat!`, 'success');
    } else {
        status.innerHTML = `<span style="color:var(--danger);">❌ Gagal membuat QR Code. Coba lagi.</span>`;
    }
}

function downloadQRCode(src, nama, nisn) {
    try {
        const link = document.createElement('a');
        const sanitizedNama = nama.replace(/\s+/g, '_').substring(0, 30);
        link.download = `QR_${sanitizedNama}_${nisn}.png`;
        link.href = src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`✅ QR Code ${nama} berhasil diunduh!`, 'success');
    } catch (err) {
        showToast('Gagal mengunduh: ' + err.message, 'error');
    }
}

function downloadAllQRCodes() {
    const cards = document.querySelectorAll('.qr-card');
    const validCards = [];
    cards.forEach(card => {
        const img = card.querySelector('img');
        const nameEl = card.querySelector('.qr-name');
        if (img && nameEl) {
            validCards.push({ src: img.src, nama: nameEl.textContent });
        }
    });

    if (validCards.length === 0) {
        showToast('Tidak ada QR Code untuk diunduh.', 'warning');
        return;
    }

    let idx = 0;
    function downloadNext() {
        if (idx >= validCards.length) {
            showToast(`✅ Semua ${validCards.length} QR Code berhasil diunduh!`, 'success');
            return;
        }
        const item = validCards[idx];
        try {
            const link = document.createElement('a');
            const sanitized = item.nama.replace(/\s+/g, '_').substring(0, 30);
            link.download = `QR_${sanitized}.png`;
            link.href = item.src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) { console.error(err); }
        idx++;
        setTimeout(downloadNext, 400);
    }
    showToast(`⏳ Mengunduh ${validCards.length} QR Code...`, 'warning');
    downloadNext();
}

function clearQRCards() {
    document.getElementById('qrGeneratedArea').innerHTML = '';
    document.getElementById('qrGenStatus').textContent = '';
    showToast('Semua QR Code telah dihapus.', 'warning');
}

// ============================================================
// DAFTAR KEHADIRAN
// ============================================================
function renderKehadiran() {
    const kelas = document.getElementById('filterKelas').value;
    const tanggal = document.getElementById('filterTanggal').value;
    const tbody = document.getElementById('kehadiranTableBody');
    let data = [...kehadiranData];
    if (kelas !== 'all') data = data.filter(d => d.jenjang === kelas);
    if (tanggal) data = data.filter(d => d.tanggal === tanggal);
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Belum ada data kehadiran</td></tr>';
        document.getElementById('kehadiranCount').textContent = '0 siswa';
        return;
    }
    data.sort((a, b) => a.nama.localeCompare(b.nama));
    let html = '';
    data.forEach((d, i) => {
        const badge = `<span class="badge-status ${d.status.toLowerCase()}">${d.status}</span>`;
        html += `<tr><td>${i+1}</td><td>${d.nama}</td><td>${d.jenjang}</td><td>${badge}</td><td>${d.tanggal}</td><td>${d.metode || '-'}</td></tr>`;
    });
    tbody.innerHTML = html;
    document.getElementById('kehadiranCount').textContent = data.length + ' siswa';
}

// ============================================================
// AGENDA
// ============================================================
function renderAgenda() {
    const container = document.getElementById('agendaList');
    if (agendaData.length === 0) {
        container.innerHTML = '<p class="text-muted">Belum ada agenda. Tambahkan agenda baru.</p>';
        return;
    }
    const sorted = [...agendaData].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    let html = '';
    sorted.forEach((a, idx) => {
        html += `<div class="agenda-item">
            <div class="agenda-info">
                <div class="agenda-date"><i class="far fa-calendar-alt"></i> ${a.tanggal}</div>
                <div class="agenda-title">${a.judul}</div>
                <div class="agenda-desc">${a.deskripsi || ''}</div>
            </div>
            <div class="agenda-actions">
                <button class="btn btn-danger btn-sm" onclick="hapusAgenda(${idx})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function tampilkanModalAgenda() {
    document.getElementById('modalAgenda').classList.add('show');
    document.getElementById('agendaJudul').value = '';
    document.getElementById('agendaDeskripsi').value = '';
    document.getElementById('agendaTanggal').value = new Date().toISOString().split('T')[0];
}

function tutupModalAgenda() { document.getElementById('modalAgenda').classList.remove('show'); }

function simpanAgenda() {
    const judul = document.getElementById('agendaJudul').value.trim();
    const deskripsi = document.getElementById('agendaDeskripsi').value.trim();
    const tanggal = document.getElementById('agendaTanggal').value;
    if (!judul || !tanggal) { showToast('Judul dan tanggal wajib diisi!', 'error'); return; }
    agendaData.push({ judul, deskripsi, tanggal });
    localStorage.setItem('agendaPancasila', JSON.stringify(agendaData));
    renderAgenda();
    tutupModalAgenda();
    showToast('Agenda berhasil ditambahkan!', 'success');
}

function hapusAgenda(idx) {
    if (confirm('Hapus agenda ini?')) {
        agendaData.splice(idx, 1);
        localStorage.setItem('agendaPancasila', JSON.stringify(agendaData));
        renderAgenda();
        showToast('Agenda dihapus.', 'warning');
    }
}

// ============================================================
// MATERI AJAR - Lengkap per Kelas + Edit + Hapus
// ============================================================
function getAllMateri() {
    const map = new Map();
    defaultMateriPancasila.forEach(m => {
        m.isUploaded = false;
        m.isEdited = false;
        map.set(m.id, { ...m });
    });
    uploadedMateri.forEach(m => {
        if (map.has(m.id)) {
            const existing = map.get(m.id);
            map.set(m.id, { ...existing, ...m, isUploaded: true, isEdited: m.isEdited || true });
        } else {
            map.set(m.id, { ...m, isUploaded: true, isEdited: m.isEdited || false });
        }
    });
    return Array.from(map.values());
}

function renderMateri() {
    const filterJenjang = document.getElementById('filterMateriJenjang').value;
    const filterKelas = document.getElementById('filterMateriKelas').value;
    const container = document.getElementById('materiList');

    let filtered = [...materiFiles];
    if (filterJenjang !== 'all') filtered = filtered.filter(m => m.jenjang === filterJenjang);
    if (filterKelas !== 'all') filtered = filtered.filter(m => m.kelas == filterKelas);

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted">Belum ada materi yang diunggah. Silakan unggah file PDF/PPT.</p>';
        return;
    }

    let html = '';
    filtered.forEach((m, idx) => {
        const fileIcon = m.fileType.includes('pdf') ? 'fa-file-pdf' : 'fa-file-powerpoint';
        const iconColor = m.fileType.includes('pdf') ? 'var(--danger)' : 'var(--warning)';
        html += `
            <div class="material-card">
                <div class="material-title">
                    <span><i class="fas ${fileIcon}" style="color:${iconColor}; margin-right:8px;"></i> ${m.judul}</span>
                    <span>
                        <span class="badge-level ${m.jenjang === 'SD' ? 'badge-sd' : m.jenjang === 'SMP' ? 'badge-smp' : 'badge-sma'}">${m.jenjang}</span>
                        <span class="badge-level" style="background:var(--gray-600);">Kelas ${m.kelas}</span>
                    </span>
                </div>
                <div class="material-desc">${m.deskripsi || 'Tidak ada deskripsi'}</div>
                <div class="material-meta">
                    <small><i class="far fa-file"></i> ${m.fileName}</small>
                    <small><i class="far fa-calendar-alt"></i> ${m.tanggalUpload}</small>
                </div>
                <div class="material-actions">
                    <button class="btn btn-primary btn-sm" onclick="downloadMateri(${m.id})"><i class="fas fa-download"></i> Unduh</button>
                    <button class="btn btn-danger btn-sm" onclick="hapusMateri(${m.id})"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function toggleMateri(id) {
    const body = document.getElementById('materiBody_' + id);
    if (body) body.classList.toggle('open');
}

// ============================================================
// UPLOAD MATERI (FILE)
// ============================================================
function uploadMateri() {
    const judul = document.getElementById('uploadJudul').value.trim();
    const kelas = parseInt(document.getElementById('uploadKelas').value);
    const jenjang = document.getElementById('uploadJenjang').value;
    const deskripsi = document.getElementById('uploadDeskripsi').value.trim();
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];

    if (!judul || !file) {
        showToast('Judul dan file wajib diisi!', 'error');
        return;
    }

    // Validasi tipe file
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Hanya file PDF atau PPT yang diperbolehkan.', 'error');
        return;
    }

    // Batas ukuran file (misal 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const fileData = e.target.result; // base64
        const newMateri = {
            id: Date.now() + Math.random() * 1000,
            judul,
            kelas,
            jenjang,
            deskripsi: deskripsi || 'Tidak ada deskripsi',
            fileName: file.name,
            fileType: file.type,
            fileData: fileData,
            tanggalUpload: new Date().toISOString().split('T')[0]
        };
        materiFiles.push(newMateri);
        localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));
        // Reset form
        document.getElementById('uploadJudul').value = '';
        document.getElementById('uploadDeskripsi').value = '';
        fileInput.value = '';
        renderMateri();
        showToast(`✅ Materi "${judul}" berhasil diunggah!`, 'success');
    };
    reader.onerror = function() {
        showToast('Gagal membaca file.', 'error');
    };
    reader.readAsDataURL(file);
}

// ============================================================
// DOWNLOAD MATERI
// ============================================================
function downloadMateri(id) {
    const materi = materiFiles.find(m => m.id === id);
    if (!materi) {
        showToast('Materi tidak ditemukan.', 'error');
        return;
    }
    try {
        const link = document.createElement('a');
        link.href = materi.fileData;
        link.download = materi.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Mengunduh ${materi.fileName}`, 'success');
    } catch (err) {
        showToast('Gagal mengunduh file.', 'error');
    }
}

// ============================================================
// HAPUS MATERI
// ============================================================
function hapusMateri(id) {
    if (!confirm('Hapus materi ini?')) return;
    const idx = materiFiles.findIndex(m => m.id === id);
    if (idx !== -1) {
        materiFiles.splice(idx, 1);
        localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));
        renderMateri();
        showToast('Materi dihapus.', 'warning');
    }
}

// ============================================================
// INIT - panggil renderMateri() di DOMContentLoaded
// ============================================================
// Pastikan di bagian initApp() atau DOMContentLoaded ada renderMateri()
// dan update total siswa, dll.

// ============================================================
// CATATAN
// ============================================================
function simpanCatatan() {
    const judul = document.getElementById('catatanJudul').value.trim();
    const isi = document.getElementById('catatanIsi').value.trim();
    if (!judul || !isi) { showToast('Judul dan isi catatan wajib diisi!', 'error'); return; }
    catatanData.push({ judul, isi, tanggal: new Date().toISOString().split('T')[0] });
    localStorage.setItem('catatanPancasila', JSON.stringify(catatanData));
    document.getElementById('catatanJudul').value = '';
    document.getElementById('catatanIsi').value = '';
    renderCatatan();
    showToast('Catatan berhasil disimpan!', 'success');
}

function renderCatatan() {
    const container = document.getElementById('catatanList');
    if (catatanData.length === 0) {
        container.innerHTML = '<p class="text-muted">Belum ada catatan.</p>';
        return;
    }
    let html = '';
    [...catatanData].reverse().forEach((c, idx) => {
        html += `<div class="agenda-item" style="border-left-color:var(--success);">
            <div class="agenda-info">
                <div class="agenda-date"><i class="far fa-calendar-alt"></i> ${c.tanggal}</div>
                <div class="agenda-title">${c.judul}</div>
                <div class="agenda-desc">${c.isi}</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="hapusCatatan(${idx})"><i class="fas fa-trash"></i></button>
        </div>`;
    });
    container.innerHTML = html;
}

function hapusCatatan(idx) {
    if (confirm('Hapus catatan ini?')) {
        catatanData.splice(idx, 1);
        localStorage.setItem('catatanPancasila', JSON.stringify(catatanData));
        renderCatatan();
        showToast('Catatan dihapus.', 'warning');
    }
}

// ============================================================
// NILAI
// ============================================================
function renderNilai() {
    const kelas = document.getElementById('nilaiKelas').value;
    const tbody = document.getElementById('nilaiTableBody');
    let data = [...nilaiData];
    if (kelas !== 'all') data = data.filter(d => d.jenjang === kelas);
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada data nilai</td></tr>';
        return;
    }
    let html = '';
    data.forEach((d, i) => {
        const color = d.nilai >= 75 ? 'var(--success)' : d.nilai >= 60 ? 'var(--warning)' : 'var(--danger)';
        html += `<tr><td>${i+1}</td><td>${d.nama}</td><td>${d.jenjang}</td><td><strong style="color:${color};">${d.nilai}</strong></td><td>${d.keterangan || '-'}</td></tr>`;
    });
    tbody.innerHTML = html;
}

// ============================================================
// IMPOR / EKSPOR
// ============================================================
function imporData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            let imported = 0;
            json.forEach(row => {
                const nama = (row['Nama'] || row['nama'] || '').toString().trim();
                const nisn = (row['NISN'] || row['nisn'] || '').toString().trim();
                const jenjang = (row['Jenjang'] || row['jenjang'] || '').toString().trim().toUpperCase();
                if (nama && jenjang && (jenjang === 'SD' || jenjang === 'SMP')) {
                    const exists = siswaData.some(s => s.nisn === nisn && s.nama === nama);
                    if (!exists) { siswaData.push({ nama, nisn, jenjang }); imported++; }
                }
            });
            document.getElementById('imporStatus').innerHTML = `<span style="color:var(--success);">✅ Berhasil mengimpor ${imported} data siswa baru.</span>`;
            updateTotalSiswa();
            showToast(`Impor selesai! ${imported} siswa ditambahkan.`, 'success');
        } catch (err) {
            document.getElementById('imporStatus').innerHTML = `<span style="color:var(--danger);">❌ Gagal membaca file: ${err.message}</span>`;
            showToast('Gagal impor data: ' + err.message, 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
}

function eksporSiswa() {
    const data = siswaData.map(s => ({ Nama: s.nama, NISN: s.nisn, Jenjang: s.jenjang }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Siswa');
    XLSX.writeFile(wb, 'Data_Siswa_SRT39Garut.xlsx');
    showToast('Ekspor data siswa berhasil!', 'success');
}

function eksporKehadiran() {
    const data = kehadiranData.map(k => ({ Nama: k.nama, NISN: k.nisn, Jenjang: k.jenjang, Status: k.status, Tanggal: k.tanggal, Metode: k.metode || '-' }));
    if (data.length === 0) { showToast('Tidak ada data kehadiran.', 'warning'); return; }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kehadiran');
    XLSX.writeFile(wb, 'Kehadiran_SRT39Garut.xlsx');
    showToast('Ekspor kehadiran berhasil!', 'success');
}

function eksporNilai() {
    const data = nilaiData.map(n => ({ Nama: n.nama, NISN: n.nisn, Jenjang: n.jenjang, Nilai: n.nilai, Keterangan: n.keterangan || '-' }));
    if (data.length === 0) { showToast('Tidak ada data nilai.', 'warning'); return; }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nilai');
    XLSX.writeFile(wb, 'Nilai_SRT39Garut.xlsx');
    showToast('Ekspor nilai berhasil!', 'success');
}

function unduhTemplateSiswa() {
    const template = [{ Nama: 'Contoh Siswa SD', NISN: '1234567890', Jenjang: 'SD' }, { Nama: 'Contoh Siswa SMP', NISN: '0987654321', Jenjang: 'SMP' }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Template_Siswa_SRT39Garut.xlsx');
    showToast('Template siswa diunduh!', 'success');
}

function unduhTemplateKehadiran() {
    const template = [{ Nama: 'Contoh Siswa', NISN: '1234567890', Jenjang: 'SD', Status: 'Hadir', Tanggal: '2026-09-01', Metode: 'QR Code' }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Kehadiran');
    XLSX.writeFile(wb, 'Template_Kehadiran_SRT39Garut.xlsx');
    showToast('Template kehadiran diunduh!', 'success');
}

function unduhTemplateNilai() {
    const template = [{ Nama: 'Contoh Siswa', NISN: '1234567890', Jenjang: 'SD', Nilai: 85, Keterangan: 'Baik' }];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Nilai');
    XLSX.writeFile(wb, 'Template_Nilai_SRT39Garut.xlsx');
    showToast('Template nilai diunduh!', 'success');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterTanggal').value = today;
    document.getElementById('agendaTanggal').value = today;
    updateTotalSiswa();
    renderMateri();
    renderKehadiran();
    renderAgenda();
    renderCatatan();
    renderNilai();
    renderUploadedMateri();
    updateStats();
});

document.getElementById('loginPage').style.display = 'flex';
document.getElementById('app').style.display = 'none';

console.log('📚 e-Learning Pendidikan Pancasila SRT 39 Garut');
console.log('👨‍🏫 Login: guru / pancasila');
console.log('📊 Total siswa:', siswaData.length);
console.log('📖 Materi lengkap per kelas (SD I-VI, SMP VII-IX, SMA X-XII)');
console.log('🔹 QR Code via qrzap.fun (gratis, tanpa API key)');
console.log('📤 Fitur unggah materi & edit materi tersedia');
