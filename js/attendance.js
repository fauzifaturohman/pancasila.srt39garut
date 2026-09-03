// ===== ATTENDANCE LOGIC =====

// Data kehadiran disimpan di localStorage
let attendanceData = [];
let currentJenjang = 'SD';
let currentSemester = '';

// Load data dari localStorage atau Google Drive
async function loadAttendance() {
    const jenjang = document.getElementById('filterJenjang').value;
    const semester = document.getElementById('filterSemester').value;

    currentJenjang = jenjang;
    currentSemester = semester;

    // Coba load dari Google Drive dulu
    const driveData = await loadFromDrive('attendance_data.json');
    if (driveData) {
        attendanceData = driveData;
        localStorage.setItem('attendanceData', JSON.stringify(driveData));
    } else {
        const localData = localStorage.getItem('attendanceData');
        attendanceData = localData ? JSON.parse(localData) : [];
    }

    renderAttendanceTable(jenjang, semester);
}

// Render tabel
function renderAttendanceTable(jenjang, semester) {
    const tbody = document.getElementById('attendanceBody');
    const filtered = attendanceData.filter(item =>
        item.jenjang === jenjang &&
        (semester ? item.semester === semester : true)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="23" style="text-align:center;padding:30px;">Belum ada data untuk jenjang ini.</td></tr>`;
        return;
    }

    let html = '';
    filtered.forEach((item, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td><strong>${item.nama}</strong></td>`;
        // 20 kolom tanggal (simulasi)
        for (let i = 1; i <= 20; i++) {
            const val = item.dates && item.dates[i] ? item.dates[i] : '';
            html += `<td><input type="text" class="attendance-input" data-idx="${index}" data-date="${i}" value="${val}" style="width:30px;text-align:center;border:1px solid #ddd;border-radius:4px;" /></td>`;
        }
        const persen = item.persen || '0%';
        html += `<td>${persen}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteAttendance(${index})">Hapus</button></td>
        </tr>`;
    });

    tbody.innerHTML = html;

    // Event listener untuk perubahan input
    document.querySelectorAll('.attendance-input').forEach(input => {
        input.addEventListener('change', function() {
            const idx = parseInt(this.dataset.idx);
            const dateIdx = parseInt(this.dataset.date);
            const val = this.value;
            // Cari item yang sesuai
            const filteredItems = attendanceData.filter(item =>
                item.jenjang === jenjang &&
                (semester ? item.semester === semester : true)
            );
            if (filteredItems[idx]) {
                const originalItem = attendanceData.find(item =>
                    item.jenjang === filteredItems[idx].jenjang &&
                    item.semester === filteredItems[idx].semester &&
                    item.nama === filteredItems[idx].nama
                );
                if (originalItem) {
                    if (!originalItem.dates) originalItem.dates = {};
                    originalItem.dates[dateIdx] = val;
                    saveAttendanceData();
                }
            }
        });
    });
}

// Tambah baris murid baru
function addAttendanceRow() {
    const jenjang = document.getElementById('filterJenjang').value;
    const semester = document.getElementById('filterSemester').value;

    if (!semester) {
        alert('Pilih semester terlebih dahulu!');
        return;
    }

    const nama = prompt('Masukkan nama murid:');
    if (!nama || nama.trim() === '') return;

    attendanceData.push({
        jenjang: jenjang,
        semester: semester,
        nama: nama.trim(),
        dates: {},
        persen: '0%'
    });

    saveAttendanceData();
    renderAttendanceTable(jenjang, semester);
}

// Hapus data murid
function deleteAttendance(index) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    const jenjang = document.getElementById('filterJenjang').value;
    const semester = document.getElementById('filterSemester').value;

    const filtered = attendanceData.filter(item =>
        item.jenjang === jenjang &&
        (semester ? item.semester === semester : true)
    );

    if (filtered[index]) {
        const target = filtered[index];
        const idx = attendanceData.indexOf(target);
        if (idx !== -1) {
            attendanceData.splice(idx, 1);
            saveAttendanceData();
            renderAttendanceTable(jenjang, semester);
        }
    }
}

// Simpan data ke localStorage dan Google Drive
async function saveAttendanceData() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    // Backup ke Google Drive secara otomatis (opsional)
    try {
        await uploadToDrive('attendance_data.json', JSON.stringify(attendanceData));
    } catch (e) {
        console.log('Auto backup ke drive gagal, data tetap tersimpan di lokal.');
    }
}

// Load opsi semester ke dropdown
function loadSemesterOptions() {
    const select = document.getElementById('filterSemester');
    const semesters = JSON.parse(localStorage.getItem('semesterData') || '[]');
    select.innerHTML = '<option value="">Pilih Semester</option>';
    semesters.forEach(s => {
        select.innerHTML += `<option value="${s}">${s}</option>`;
    });
}
