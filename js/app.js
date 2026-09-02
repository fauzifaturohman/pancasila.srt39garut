// ============================================================
// APP.JS - LOGIKA UTAMA e-LEARNING PANCASILA
// ============================================================

// ===== STATE =====
let currentUser = null;
let currentUserRole = null;
let currentUserNISN = null;
let kehadiranData = JSON.parse(localStorage.getItem('kehadiranPancasila')) || [];
let agendaData = JSON.parse(localStorage.getItem('agendaPancasila')) || [];
let catatanData = JSON.parse(localStorage.getItem('catatanPancasila')) || [];
let nilaiData = JSON.parse(localStorage.getItem('nilaiPancasila')) || [];
let materiFiles = JSON.parse(localStorage.getItem('materiFilesPancasila')) || [];
let kartuData = JSON.parse(localStorage.getItem('kartuPelajarData')) || {};
let qrScannerInstance = null;
let scannedSiswa = null;

// ===== TOGGLE LOGIN =====
function toggleLoginForm() {
    const role = document.getElementById('loginRole').value;
    document.getElementById('loginGuruForm').style.display = role === 'guru' ? 'block' : 'none';
    document.getElementById('loginMuridForm').style.display = role === 'murid' ? 'block' : 'none';
    document.getElementById('loginError').style.display = 'none';
}

// ===== LOGIN =====
function handleLogin() {
    const role = document.getElementById('loginRole').value;
    if (role === 'guru') {
        const u = document.getElementById('loginUser').value.trim();
        const p = document.getElementById('loginPass').value.trim();
        if (u === 'guru' && p === 'pancasila') {
            loginSuccess('guru', null);
        } else {
            showLoginError();
        }
    } else {
        const nisn = document.getElementById('loginNISN').value.trim();
        const nama = document.getElementById('loginNamaMurid').value.trim().toUpperCase();
        const siswa = siswaData.find(s => s.nisn === nisn && s.nama.toUpperCase() === nama);
        if (siswa) {
            loginSuccess('murid', siswa);
        } else {
            showLoginError('NISN atau nama tidak ditemukan!');
        }
    }
}

function loginSuccess(role, siswa) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    currentUser = role === 'guru' ? 'guru' : siswa.nama;
    currentUserRole = role;
    currentUserNISN = siswa ? siswa.nisn : null;

    const nameEl = document.querySelector('.app-header .user-info .name');
    if (role === 'guru') {
        nameEl.innerHTML = '<i class="fas fa-chalkboard-teacher"></i> Guru Pancasila';
    } else {
        nameEl.innerHTML = `<i class="fas fa-user-graduate"></i> ${siswa.nama} (${siswa.jenjang})`;
        document.querySelectorAll('.sidebar .menu-item').forEach(item => {
            const page = item.dataset.page;
            if (['qr', 'admin', 'impor', 'kartu-pelajar'].includes(page)) {
                item.style.display = 'none';
            }
        });
        navigateTo('dashboard');
    }
    initApp();
    showToast(`Login berhasil! Selamat datang, ${currentUser}.`, 'success');
}

function showLoginError(msg) {
    const el = document.getElementById('loginError');
    el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg || 'Username/password atau NISN/nama salah!'}`;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
}

function handleLogout() {
    if (confirm('Yakin ingin logout?')) {
        document.getElementById('app').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';
        currentUser = null;
        currentUserRole = null;
        currentUserNISN = null;
        stopQrScanner();
        document.getElementById('loginRole').value = 'guru';
        toggleLoginForm();
        showToast('Logout berhasil.', 'warning');
    }
}

// ===== INIT =====
function initApp() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterTanggal').value = today;
    document.getElementById('agendaTanggal').value = today;
    updateStats();
    renderKehadiran();
    renderAgenda();
    renderCatatan();
    renderNilai();
    renderMateri();
    updateTotalSiswa();
    populateKartuSelect();
    renderKartuSavedList();
    if (currentUserRole === 'murid') {
        document.querySelectorAll('#page-admin .btn, #page-impor .btn').forEach(el => el.style.display = 'none');
    }
}

// ===== NAVIGASI =====
function navigateTo(page) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.sidebar .menu-item').forEach(el => el.classList.remove('active'));
    const menuItem = document.querySelector(`.sidebar .menu-item[data-page="${page}"]`);
    if (menuItem) menuItem.classList.add('active');
    if (page !== 'qr') stopQrScanner();
    if (page === 'kehadiran') renderKehadiran();
    if (page === 'agenda') renderAgenda();
    if (page === 'admin') { renderCatatan(); renderNilai(); }
    if (page === 'materi') renderMateri();
    if (page === 'dashboard') updateStats();
    if (page === 'kartu-pelajar') { populateKartuSelect(); renderKartuSavedList(); }
}

// ===== STATS =====
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
    let data = kehadiranData;
    if (currentUserRole === 'murid' && currentUserNISN) {
        data = data.filter(k => k.nisn === currentUserNISN);
    }
    const todayHadir = data.filter(k => k.tanggal === today && k.status === 'Hadir');
    const todayIzinSakit = data.filter(k => k.tanggal === today && (k.status === 'Izin' || k.status === 'Sakit'));
    const todayAlpha = data.filter(k => k.tanggal === today && k.status === 'Alpha');
    document.getElementById('hadirHariIni').textContent = todayHadir.length || 0;
    document.getElementById('izinSakit').textContent = todayIzinSakit.length || 0;
    document.getElementById('alpha').textContent = todayAlpha.length || 0;
}

// ===== QR CODE SCANNER (GURU ONLY) =====
function startQrScanner() {
    if (currentUserRole !== 'guru') {
        showToast('Fitur ini hanya untuk guru.', 'warning');
        return;
    }
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

// ===== GENERATE QR CODE (GURU) =====
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
        status.innerHTML = `<span style="color:var(--success);">✅ ${count} QR Code berhasil dibuat.</span>`;
        showToast(`✅ ${count} QR Code berhasil dibuat!`, 'success');
    } else {
        status.innerHTML = `<span style="color:var(--danger);">❌ Gagal membuat QR Code.</span>`;
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

// ===== KEHADIRAN =====
function renderKehadiran() {
    const kelas = document.getElementById('filterKelas').value;
    const tanggal = document.getElementById('filterTanggal').value;
    const tbody = document.getElementById('kehadiranTableBody');
    let data = [...kehadiranData];
    if (currentUserRole === 'murid' && currentUserNISN) {
        data = data.filter(k => k.nisn === currentUserNISN);
    }
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

// ===== AGENDA =====
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

// ===== MATERI (dengan upload file) =====
function getAllMateri() {
    const map = new Map();
    defaultMateriPancasila.forEach(m => {
        m.isUploaded = false;
        m.isEdited = false;
        map.set(m.id, { ...m });
    });
    materiFiles.forEach(m => {
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
    let allMateri = getAllMateri();
    if (filterJenjang !== 'all') allMateri = allMateri.filter(m => m.jenjang === filterJenjang);
    if (filterKelas !== 'all') allMateri = allMateri.filter(m => m.kelas == filterKelas);
    if (allMateri.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada materi untuk filter ini.</p>';
        return;
    }
    allMateri.sort((a, b) => a.kelas - b.kelas);
    let html = '';
    allMateri.forEach(m => {
        const badgeClass = m.jenjang === 'SD' ? 'badge-sd' : m.jenjang === 'SMP' ? 'badge-smp' : 'badge-sma';
        const isEdited = m.isEdited || m.isUploaded;
        const editBadge = isEdited ? '<span class="badge-level badge-edited" style="font-size:10px;">✏️ Diedit</span>' : '';
        const uploadBadge = m.isUploaded && !m.isEdited ? '<span class="badge-level" style="background:var(--success);font-size:10px;">📤 Upload</span>' : '';
        html += `<div class="material-card">
                    <div class="material-title">
                        <span>${m.judul}</span>
                        <span>
                            <span class="badge-level ${badgeClass}">${m.jenjang}</span>
                            <span class="badge-level" style="background:var(--gray-600);">Kelas ${m.kelas}</span>
                            ${uploadBadge}
                            ${editBadge}
                        </span>
                    </div>
                    <div class="material-desc">${m.deskripsi}</div>
                    <div class="material-body" id="materiBody_${m.id}">
                        ${m.konten || ''}
                        ${m.fileName ? `<div class="sumber"><i class="fas fa-file"></i> File: ${m.fileName}</div>` : ''}
                        ${m.sumber ? `<div class="sumber">${m.sumber}</div>` : ''}
                    </div>
                    <div class="material-actions">
                        <button class="btn btn-primary btn-sm" onclick="toggleMateri(${m.id})"><i class="fas fa-eye"></i> Lihat</button>
                        <button class="btn btn-warning btn-sm" onclick="bukaEditMateri(${m.id})"><i class="fas fa-edit"></i> Edit</button>
                        ${m.isUploaded ? `<button class="btn btn-danger btn-sm" onclick="hapusMateriUpload(${m.id})"><i class="fas fa-trash"></i> Hapus</button>` : ''}
                        ${!m.isUploaded ? `<button class="btn btn-outline btn-sm" onclick="duplikatMateri(${m.id})"><i class="fas fa-copy"></i> Duplikat</button>` : ''}
                        ${m.fileName ? `<button class="btn btn-success btn-sm" onclick="downloadMateriFile(${m.id})"><i class="fas fa-download"></i> Unduh File</button>` : ''}
                    </div>
                </div>`;
    });
    container.innerHTML = html;
}

function toggleMateri(id) {
    const body = document.getElementById('materiBody_' + id);
    if (body) body.classList.toggle('open');
}

function bukaEditMateri(id) {
    const all = getAllMateri();
    const materi = all.find(m => m.id === id);
    if (!materi) { showToast('Materi tidak ditemukan!', 'error'); return; }
    document.getElementById('editMateriId').value = id;
    document.getElementById('editJudul').value = materi.judul || '';
    document.getElementById('editKelas').value = materi.kelas || 1;
    document.getElementById('editJenjang').value = materi.jenjang || 'SD';
    document.getElementById('editDeskripsi').value = materi.deskripsi || '';
    document.getElementById('editIsi').value = materi.konten ? materi.konten.replace(/<[^>]+>/g, '') : '';
    document.getElementById('modalEditMateri').classList.add('show');
}

function tutupModalEditMateri() {
    document.getElementById('modalEditMateri').classList.remove('show');
}

function simpanEditMateri() {
    const id = parseInt(document.getElementById('editMateriId').value);
    const judul = document.getElementById('editJudul').value.trim();
    const kelas = parseInt(document.getElementById('editKelas').value);
    const jenjang = document.getElementById('editJenjang').value;
    const deskripsi = document.getElementById('editDeskripsi').value.trim();
    const isi = document.getElementById('editIsi').value.trim();
    if (!judul || !isi) { showToast('Judul dan isi materi wajib diisi!', 'error'); return; }
    const idx = materiFiles.findIndex(m => m.id === id);
    if (idx !== -1) {
        materiFiles[idx] = { ...materiFiles[idx], judul, kelas, jenjang, deskripsi: deskripsi || materiFiles[idx].deskripsi, konten: `<p>${isi.replace(/\n/g, '<br>')}</p>`, isEdited: true };
    } else {
        materiFiles.push({ id, judul, kelas, jenjang, deskripsi: deskripsi || 'Materi yang telah diedit.', konten: `<p>${isi.replace(/\n/g, '<br>')}</p>`, isUploaded: true, isEdited: true });
    }
    localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));
    tutupModalEditMateri();
    renderMateri();
    showToast('✅ Materi berhasil diperbarui!', 'success');
}

function duplikatMateri(id) {
    const all = getAllMateri();
    const materi = all.find(m => m.id === id);
    if (!materi) { showToast('Materi tidak ditemukan!', 'error'); return; }
    const newId = Date.now() + Math.random() * 1000;
    const newMateri = { id: newId, kelas: materi.kelas, jenjang: materi.jenjang, judul: materi.judul + ' (Salinan)', deskripsi: materi.deskripsi + ' (Salinan)', konten: materi.konten, isUploaded: true, isEdited: true };
    materiFiles.push(newMateri);
    localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));
    renderMateri();
    showToast('✅ Duplikat materi berhasil dibuat!', 'success');
}

function hapusMateriUpload(id) {
    if (!confirm('Hapus materi yang diunggah ini?')) return;
    const idx = materiFiles.findIndex(m => m.id === id);
    if (idx !== -1) {
        materiFiles.splice(idx, 1);
        localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));
        renderMateri();
        showToast('Materi dihapus.', 'warning');
    } else {
        showToast('Materi tidak ditemukan di daftar unggahan.', 'error');
    }
}

function downloadMateriFile(id) {
    const materi = materiFiles.find(m => m.id === id);
    if (!materi || !materi.fileData) { showToast('File tidak tersedia.', 'error'); return; }
    try {
        const link = document.createElement('a');
        link.href = materi.fileData;
        link.download = materi.fileName || 'materi.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`✅ File ${materi.fileName} diunduh.`, 'success');
    } catch (err) {
        showToast('Gagal mengunduh file.', 'error');
    }
}

// ===== UPLOAD MATERI (dengan file) =====
function uploadMateri() {
    if (currentUserRole !== 'guru') {
        showToast('Hanya guru yang dapat mengunggah materi.', 'warning');
        return;
    }
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
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Hanya file PDF atau PPT yang diperbolehkan.', 'error');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB.', 'error');
        return;
    }

    const progressContainer = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('uploadProgressBar');
    const statusText = document.getElementById('uploadStatusText');
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    statusText.textContent = 'Membaca file...';

    const reader = new FileReader();
    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 50);
            progressBar.style.width = percent + '%';
            statusText.textContent = `Membaca file... ${percent}%`;
        }
    };
    reader.onload = function(e) {
        try {
            progressBar.style.width = '75%';
            statusText.textContent = 'Menyimpan data...';
            const fileData = e.target.result;
            const newMateri = {
                id: Date.now() + Math.random() * 1000,
                judul,
                kelas,
                jenjang,
                deskripsi: deskripsi || 'Tidak ada deskripsi',
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: fileData,
                tanggalUpload: new Date().toISOString().split('T')[0],
                uploader: currentUser || 'Guru',
                isUploaded: true,
                isEdited: true,
                konten: `<p>File: ${file.name} (${(file.size/1024).toFixed(1)} KB)</p>`
            };
            materiFiles.push(newMateri);
            localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));
            document.getElementById('uploadJudul').value = '';
            document.getElementById('uploadDeskripsi').value = '';
            fileInput.value = '';
            progressBar.style.width = '100%';
            statusText.textContent = '✅ Selesai!';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
            }, 1500);
            renderMateri();
            showToast(`✅ Materi "${judul}" berhasil diunggah!`, 'success');
        } catch (err) {
            showToast('Gagal menyimpan: ' + err.message, 'error');
            progressContainer.style.display = 'none';
        }
    };
    reader.onerror = function() {
        showToast('Gagal membaca file.', 'error');
        progressContainer.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// ===== CATATAN =====
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

// ===== NILAI =====
function renderNilai() {
    const kelas = document.getElementById('nilaiKelas').value;
    const tbody = document.getElementById('nilaiTableBody');
    let data = [...nilaiData];
    if (currentUserRole === 'murid' && currentUserNISN) {
        data = data.filter(n => n.nisn === currentUserNISN);
    }
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

// ===== KARTU PELAJAR =====
function populateKartuSelect() {
    const select = document.getElementById('kartuSelectSiswa');
    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Pilih Siswa --</option>';
    const sorted = [...siswaData].sort((a, b) => a.nama.localeCompare(b.nama));
    sorted.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.nisn;
        opt.textContent = `${s.nama} (${s.jenjang}) - ${s.nisn}`;
        select.appendChild(opt);
    });
    if (currentVal) select.value = currentVal;
    onKartuSiswaChange();
}

function onKartuSiswaChange() {
    const nisn = document.getElementById('kartuSelectSiswa').value;
    if (!nisn) {
        document.getElementById('kartuTempatLahir').value = '';
        document.getElementById('kartuTanggalLahir').value = '';
        document.getElementById('kartuKelasDetail').value = '';
        document.getElementById('kartuAlamat').value = '';
        return;
    }
    const saved = kartuData[nisn] || {};
    document.getElementById('kartuTempatLahir').value = saved.tempatLahir || '';
    document.getElementById('kartuTanggalLahir').value = saved.tanggalLahir || '';
    document.getElementById('kartuKelasDetail').value = saved.kelasDetail || '';
    document.getElementById('kartuAlamat').value = saved.alamat || '';
}

function generateKartuPelajar() {
    const nisn = document.getElementById('kartuSelectSiswa').value;
    if (!nisn) { showToast('Pilih siswa terlebih dahulu!', 'error'); return; }
    const siswa = siswaData.find(s => s.nisn === nisn);
    if (!siswa) { showToast('Siswa tidak ditemukan!', 'error'); return; }

    const tempatLahir = document.getElementById('kartuTempatLahir').value.trim();
    const tanggalLahir = document.getElementById('kartuTanggalLahir').value;
    const kelasDetail = document.getElementById('kartuKelasDetail').value.trim();
    const alamat = document.getElementById('kartuAlamat').value.trim();

    kartuData[nisn] = { tempatLahir, tanggalLahir, kelasDetail, alamat, lastGenerated: new Date().toISOString() };
    localStorage.setItem('kartuPelajarData', JSON.stringify(kartuData));

    let ttl = tempatLahir;
    if (tanggalLahir) {
        const date = new Date(tanggalLahir);
        ttl += `, ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }
    const kelasDisplay = kelasDetail || `${siswa.jenjang}`;
    const qrData = `${siswa.nisn}|${siswa.nama}|${siswa.jenjang}`;
    const qrUrl = `https://qrzap.fun/api/generate?type=text&text=${encodeURIComponent(qrData)}&size=250&margin=4`;

    const container = document.getElementById('kartuPreviewContainer');
    container.innerHTML = `
        <div class="kartu-pelajar-card" id="kartuPelajarCard">
            <div class="card-header">
                <div class="kemdikbud"><i class="fas fa-flag"></i> KEMENTERIAN SOSIAL REPUBLIK INDONESIA</div>
                <div class="school-name">Sekolah Rakyat Terintegrasi <span>39 Garut</span></div>
                <div class="school-address">Jl. Raya Samarang, Cintarakyat, Kec. Samarang, Kab. Garut, Jawa Barat 44161</div>
            </div>
            <div class="card-body">
                <div class="card-title">KARTU PELAJAR SISWA</div>
                <div class="card-field"><span class="label">Nama</span><span class="value">${siswa.nama}</span></div>
                <div class="card-field"><span class="label">NISN</span><span class="value">${siswa.nisn}</span></div>
                <div class="card-field"><span class="label">T.T.L</span><span class="value">${ttl || '-'}</span></div>
                <div class="card-field"><span class="label">Kelas</span><span class="value">${kelasDisplay}</span></div>
                <div class="card-field"><span class="label">Alamat</span><span class="value">${alamat || '-'}</span></div>
                <div class="card-qr-section">
                    <div class="card-qr-box">
                        <img src="${qrUrl}" alt="QR Code ${siswa.nama}" id="kartuQrImg" crossorigin="anonymous" />
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <i class="fas fa-id-card"></i> Identitas Resmi • SRT 39 Garut • ${new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
            </div>
        </div>
    `;
    showToast(`✅ Kartu pelajar untuk ${siswa.nama} berhasil dibuat!`, 'success');
    renderKartuSavedList();
}

function printKartuPelajar() {
    const card = document.getElementById('kartuPelajarCard');
    if (!card) { showToast('Buat kartu terlebih dahulu!', 'error'); return; }
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) {
        showToast('Mohon izinkan pop-up untuk mencetak.', 'warning');
        return;
    }
    const styles = document.querySelector('style').innerHTML;
    printWindow.document.write(`
        <html><head><title>Kartu Pelajar</title>
        <style>${styles}</style>
        <style>
            body { background: #f0f0f0; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; padding:20px; }
            .kartu-pelajar-card { max-width:400px; margin:0 auto; }
            .card-qr-box img { width:120px; height:120px; }
        </style>
        </head><body>
            ${card.outerHTML}
            <script>
                window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 600); };
            <\/script>
        </body></html>
    `);
    printWindow.document.close();
}

function downloadKartuPelajar() {
    const card = document.getElementById('kartuPelajarCard');
    if (!card) { showToast('Buat kartu terlebih dahulu!', 'error'); return; }
    const nama = card.querySelector('.card-field .value')?.textContent || 'siswa';
    showToast('⏳ Mengunduh kartu pelajar...', 'warning');

    loadLibrary('html2canvas').then(() => {
        html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Kartu_Pelajar_${nama.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('✅ Kartu pelajar berhasil diunduh!', 'success');
        }).catch(err => {
            showToast('Gagal mengunduh: ' + err.message, 'error');
        });
    }).catch(() => {
        showToast('❌ Gagal memuat html2canvas. Coba gunakan Cetak.', 'error');
    });
}

function generateAllKartu() {
    const total = siswaData.length;
    if (total === 0) { showToast('Tidak ada siswa.', 'warning'); return; }
    showToast(`⏳ Membuat kartu untuk ${total} siswa...`, 'warning');
    let count = 0;
    siswaData.forEach(s => {
        const saved = kartuData[s.nisn] || {};
        kartuData[s.nisn] = {
            tempatLahir: saved.tempatLahir || '',
            tanggalLahir: saved.tanggalLahir || '',
            kelasDetail: saved.kelasDetail || `${s.jenjang}`,
            alamat: saved.alamat || '',
            lastGenerated: new Date().toISOString()
        };
        count++;
    });
    localStorage.setItem('kartuPelajarData', JSON.stringify(kartuData));
    renderKartuSavedList();
    const firstNisn = siswaData[0]?.nisn;
    if (firstNisn) {
        document.getElementById('kartuSelectSiswa').value = firstNisn;
        onKartuSiswaChange();
        generateKartuPelajar();
    }
    showToast(`✅ Kartu untuk ${count} siswa berhasil disimpan!`, 'success');
}

function renderKartuSavedList() {
    const container = document.getElementById('kartuSavedList');
    const keys = Object.keys(kartuData);
    if (keys.length === 0) {
        container.innerHTML = '<p class="text-muted">Belum ada kartu yang disimpan.</p>';
        return;
    }
    let html = '';
    keys.forEach(nisn => {
        const siswa = siswaData.find(s => s.nisn === nisn);
        if (!siswa) return;
        const data = kartuData[nisn];
        html += `<div class="kartu-list-item" onclick="loadKartu('${nisn}')">
                    <div>
                        <div class="kartu-list-name">${siswa.nama}</div>
                        <div class="kartu-list-meta">${nisn} • ${data.kelasDetail || siswa.jenjang}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); loadKartu('${nisn}')"><i class="fas fa-eye"></i></button>
                </div>`;
    });
    container.innerHTML = html;
}

function loadKartu(nisn) {
    document.getElementById('kartuSelectSiswa').value = nisn;
    onKartuSiswaChange();
    generateKartuPelajar();
}

// ===== IMPOR / EKSPOR =====
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

// ===== INISIALISASI AWAL =====
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterTanggal').value = today;
    document.getElementById('agendaTanggal').value = today;
    document.getElementById('loginRole').value = 'guru';
    toggleLoginForm();
    updateTotalSiswa();
    renderMateri();
    renderKehadiran();
    renderAgenda();
    renderCatatan();
    renderNilai();
    updateStats();
    populateKartuSelect();
    renderKartuSavedList();
});

document.getElementById('loginPage').style.display = 'flex';
document.getElementById('app').style.display = 'none';

console.log('📚 e-Learning Pendidikan Pancasila SRT 39 Garut');
console.log('👨‍🏫 Login Guru: guru / pancasila');
console.log('👨‍🎓 Login Murid: gunakan NISN dan nama');
console.log('📊 Total siswa:', siswaData.length);
console.log('🔹 QR Code via qrzap.fun');
console.log('📤 Upload materi dengan progress bar');
