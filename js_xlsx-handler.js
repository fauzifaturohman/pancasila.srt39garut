// ===== XLSX HANDLER (menggunakan SheetJS) =====

// Load SheetJS dari CDN
function loadSheetJS() {
    return new Promise((resolve) => {
        if (typeof XLSX !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = () => resolve();
        script.onerror = () => {
            alert('Gagal memuat library XLSX. Periksa koneksi internet.');
            resolve();
        };
        document.head.appendChild(script);
    });
}

// Download template .xlsx
async function downloadTemplate() {
    await loadSheetJS();
    if (typeof XLSX === 'undefined') {
        alert('Library XLSX belum siap.');
        return;
    }

    const jenjang = document.getElementById('filterJenjang')?.value || 'SD';
    const semester = document.getElementById('filterSemester')?.value || 'Semester 2 2026/2027';

    // Buat data template
    const data = [
        ['No', 'Nama', ...Array.from({ length: 20 }, (_, i) => `Tgl ${i+1}`), '% Kehadiran']
    ];

    // Tambahkan 5 contoh baris kosong
    for (let i = 1; i <= 5; i++) {
        const row = [i, '', ...Array(20).fill(''), ''];
        data.push(row);
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set lebar kolom
    ws['!cols'] = [{ wch: 5 }, { wch: 25 }, ...Array(20).fill({ wch: 8 }), { wch: 12 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Hadir');
    XLSX.writeFile(wb, `template_hadir_${jenjang}_${semester.replace(/\s/g, '_')}.xlsx`);
}

// Impor file .xlsx
async function importFile() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Pilih file .xlsx terlebih dahulu!');
        return;
    }

    await loadSheetJS();
    if (typeof XLSX === 'undefined') {
        alert('Library XLSX belum siap.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Parse data
            const jenjang = document.getElementById('filterJenjang')?.value || 'SD';
            const semester = document.getElementById('filterSemester')?.value || '';

            if (!semester) {
                alert('Pilih semester terlebih dahulu sebelum impor!');
                return;
            }

            let imported = 0;
            // Mulai dari baris 2 (indeks 1) karena baris 1 adalah header
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!row || !row[1]) continue; // skip jika nama kosong

                const nama = String(row[1]).trim();
                if (!nama) continue;

                const dates = {};
                for (let d = 0; d < 20; d++) {
                    const val = row[2 + d];
                    if (val !== undefined && val !== '') {
                        dates[d + 1] = String(val);
                    }
                }

                const persen = row[22] ? String(row[22]) : '0%';

                // Cek apakah sudah ada
                const existing = attendanceData.find(item =>
                    item.jenjang === jenjang &&
                    item.semester === semester &&
                    item.nama === nama
                );

                if (existing) {
                    // Update data yang sudah ada
                    existing.dates = dates;
                    existing.persen = persen;
                } else {
                    attendanceData.push({
                        jenjang: jenjang,
                        semester: semester,
                        nama: nama,
                        dates: dates,
                        persen: persen
                    });
                }
                imported++;
            }

            saveAttendanceData();
            document.getElementById('importStatus').innerHTML =
                `<div class="alert alert-success">✅ Berhasil mengimpor ${imported} data!</div>`;
            loadAttendance();
        } catch (err) {
            console.error(err);
            document.getElementById('importStatus').innerHTML =
                `<div class="alert alert-danger">❌ Gagal mengimpor file: ${err.message}</div>`;
        }
    };

    reader.readAsArrayBuffer(file);
}

// Ekspor data ke .xlsx
async function exportData() {
    await loadSheetJS();
    if (typeof XLSX === 'undefined') {
        alert('Library XLSX belum siap.');
        return;
    }

    if (attendanceData.length === 0) {
        alert('Tidak ada data untuk diekspor.');
        return;
    }

    // Siapkan data untuk diekspor
    const jenjang = document.getElementById('filterJenjang')?.value || 'SD';
    const semester = document.getElementById('filterSemester')?.value || '';

    const filtered = attendanceData.filter(item =>
        item.jenjang === jenjang &&
        (semester ? item.semester === semester : true)
    );

    if (filtered.length === 0) {
        alert('Tidak ada data untuk jenjang/semester ini.');
        return;
    }

    const data = [
        ['No', 'Nama', ...Array.from({ length: 20 }, (_, i) => `Tgl ${i+1}`), '% Kehadiran']
    ];

    filtered.forEach((item, idx) => {
        const row = [idx + 1, item.nama];
        for (let d = 1; d <= 20; d++) {
            row.push(item.dates && item.dates[d] ? item.dates[d] : '');
        }
        row.push(item.persen || '0%');
        data.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 5 }, { wch: 25 }, ...Array(20).fill({ wch: 8 }), { wch: 12 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Hadir');
    XLSX.writeFile(wb, `kehadiran_${jenjang}_${new Date().toISOString().slice(0,10)}.xlsx`);
}