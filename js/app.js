// ============================================================
// STATE & DATA
// ============================================================
let currentUser = null;
let currentUserRole = null; // 'guru' atau 'murid'
let currentUserNISN = null;

let kehadiranData = JSON.parse(localStorage.getItem('kehadiranPancasila')) || [];
let agendaData = JSON.parse(localStorage.getItem('agendaPancasila')) || [];
let catatanData = JSON.parse(localStorage.getItem('catatanPancasila')) || [];
let nilaiData = JSON.parse(localStorage.getItem('nilaiPancasila')) || [];
let materiFiles = JSON.parse(localStorage.getItem('materiFilesPancasila')) || [];
let qrScannerInstance = null;
let scannedSiswa = null;

// ============================================================
// TOGGLE LOGIN FORM
// ============================================================
function toggleLoginForm() {
    const role = document.getElementById('loginRole').value;
    document.getElementById('loginGuruForm').style.display = role === 'guru' ? 'block' : 'none';
    document.getElementById('loginMuridForm').style.display = role === 'murid' ? 'block' : 'none';
    document.getElementById('loginError').style.display = 'none';
}

// ============================================================
// LOGIN
// ============================================================
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
    } else { // murid
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

    // Update tampilan header
    const nameEl = document.querySelector('.app-header .user-info .name');
    if (role === 'guru') {
        nameEl.innerHTML = '<i class="fas fa-chalkboard-teacher"></i> Guru Pancasila';
    } else {
        nameEl.innerHTML = `<i class="fas fa-user-graduate"></i> ${siswa.nama} (${siswa.jenjang})`;
        // Sembunyikan menu yang tidak diakses murid
        document.querySelectorAll('.sidebar .menu-item').forEach(item => {
            const page = item.dataset.page;
            if (['qr', 'admin', 'impor', 'kartu-pelajar'].includes(page)) {
                item.style.display = 'none';
            }
        });
        // Tampilkan hanya yang relevan
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
        // Reset role form
        document.getElementById('loginRole').value = 'guru';
        toggleLoginForm();
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
    renderMateri();
    updateTotalSiswa();
    // Sembunyikan elemen admin untuk murid
    if (currentUserRole === 'murid') {
        document.querySelectorAll('.admin-card .btn-danger, .admin-card .btn-primary, .admin-card .btn-success').forEach(el => {
            if (el.closest('#page-admin') || el.closest('#page-impor')) {
                el.style.display = 'none';
            }
        });
    }
}

// ============================================================
// UPDATE STATS (disesuaikan untuk murid)
// ============================================================
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
    // Jika murid, filter hanya untuk dirinya
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

// ============================================================
// NAVIGATION
// ============================================================
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
}

// ============================================================
// QR CODE SCANNER (hanya untuk guru)
// ============================================================
function startQrScanner() {
    if (currentUserRole !== 'guru') {
        showToast('Fitur ini hanya untuk guru.', 'warning');
        return;
    }
    // ... kode scanner sama seperti sebelumnya ...
}

// ============================================================
// UPLOAD MATERI (diperbaiki)
// ============================================================
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

    const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (!allowedTypes.includes(file.type)) {
        showToast('Hanya file PDF atau PPT yang diperbolehkan.', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB.', 'error');
        return;
    }

    // Tampilkan progress
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
                uploader: currentUser || 'Guru'
            };

            materiFiles.push(newMateri);
            localStorage.setItem('materiFilesPancasila', JSON.stringify(materiFiles));

            // Reset form
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

// ============================================================
// RENDER MATERI (diperbaiki)
// ============================================================
function renderMateri() {
    const filterJenjang = document.getElementById('filterMateriJenjang').value;
    const filterKelas = document.getElementById('filterMateriKelas').value;
    const container = document.getElementById('materiList');

    let filtered = [...materiFiles];

    if (filterJenjang !== 'all') filtered = filtered.filter(m => m.jenjang === filterJenjang);
    if (filterKelas !== 'all') filtered = filtered.filter(m => m.kelas == filterKelas);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="admin-card" style="text-align:center; padding:32px;">
                <i class="fas fa-file-alt" style="font-size:32px; color:var(--gray-400);"></i>
                <p class="text-muted" style="margin-top:8px;">Belum ada materi yang diunggah.</p>
                ${currentUserRole === 'guru' ? '<p class="text-muted">Silakan unggah file PDF/PPT menggunakan form di bawah.</p>' : ''}
            </div>
        `;
        return;
    }

    // Urutkan berdasarkan kelas
    filtered.sort((a, b) => a.kelas - b.kelas);

    let html = '';
    filtered.forEach((m) => {
        const fileIcon = m.fileType.includes('pdf') ? 'fa-file-pdf' : 'fa-file-powerpoint';
        const iconColor = m.fileType.includes('pdf') ? 'var(--danger)' : 'var(--warning)';
        const sizeKB = (m.fileSize / 1024).toFixed(1);
        const isOwner = m.uploader === currentUser || currentUserRole === 'guru';

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
                    <small><i class="far fa-file"></i> ${m.fileName} (${sizeKB} KB)</small>
                    <small><i class="far fa-calendar-alt"></i> ${m.tanggalUpload}</small>
                    ${m.uploader ? `<small><i class="fas fa-user"></i> ${m.uploader}</small>` : ''}
                </div>
                <div class="material-actions">
                    <button class="btn btn-primary btn-sm" onclick="downloadMateri(${m.id})"><i class="fas fa-download"></i> Unduh</button>
                    ${isOwner ? `<button class="btn btn-danger btn-sm" onclick="hapusMateri(${m.id})"><i class="fas fa-trash"></i> Hapus</button>` : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
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
    if (currentUserRole !== 'guru') {
        showToast('Hanya guru yang dapat menghapus materi.', 'warning');
        return;
    }
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
// KEHADIRAN (filter untuk murid)
// ============================================================
function renderKehadiran() {
    const kelas = document.getElementById('filterKelas').value;
    const tanggal = document.getElementById('filterTanggal').value;
    const tbody = document.getElementById('kehadiranTableBody');

    let data = [...kehadiranData];

    // Jika murid, hanya tampilkan data dirinya
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

// ============================================================
// AGENDA, CATATAN, NILAI (dengan filter murid)
// ============================================================
// ... (fungsi lainnya tetap, dengan tambahan filter jika diperlukan)

// ============================================================
// INIT PADA DOMContentLoaded
// ============================================================
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

    // Load materi files dari localStorage
    const stored = localStorage.getItem('materiFilesPancasila');
    if (stored) {
        try {
            materiFiles = JSON.parse(stored);
        } catch (e) { console.warn('Gagal load materiFiles'); }
    }
});

document.getElementById('loginPage').style.display = 'flex';
document.getElementById('app').style.display = 'none';

console.log('📚 e-Learning Pendidikan Pancasila SRT 39 Garut');
console.log('👨‍🏫 Login Guru: guru / pancasila');
console.log('👨‍🎓 Login Murid: gunakan NISN dan nama sesuai data');
console.log('📊 Total siswa:', siswaData.length);
console.log('🔹 QR Code via qrzap.fun');
console.log('📤 Fitur upload materi dengan progress bar');
