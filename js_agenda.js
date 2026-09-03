// ===== AGENDA LOGIC =====

let agendaData = [];

// Load agenda dari storage
async function loadAgenda() {
    const driveData = await loadFromDrive('agenda_data.json');
    if (driveData) {
        agendaData = driveData;
        localStorage.setItem('agendaData', JSON.stringify(driveData));
    } else {
        const localData = localStorage.getItem('agendaData');
        agendaData = localData ? JSON.parse(localData) : [];
    }
    renderAgenda();
}

// Render daftar agenda
function renderAgenda() {
    const container = document.getElementById('agendaContainer');
    if (agendaData.length === 0) {
        container.innerHTML = '<p style="color:#6c757d;padding:20px;">Belum ada catatan agenda.</p>';
        return;
    }

    // Urutkan dari yang terbaru
    const sorted = [...agendaData].reverse();
    let html = '';
    sorted.forEach((item, idx) => {
        const originalIdx = agendaData.length - 1 - idx;
        html += `
            <div class="agenda-item">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;">
                    <div>
                        <strong>${item.guru}</strong> (${item.nip})
                        <span style="color:#6c757d;font-size:0.85rem;"> • ${item.mapel}</span>
                    </div>
                    <div style="font-size:0.85rem;color:#6c757d;">
                        ${item.tanggal} • Jam ke-${item.jam} • ${item.kelas}
                    </div>
                </div>
                <div style="margin-top:6px;font-size:0.9rem;">
                    <strong>Semester:</strong> ${item.semester} &nbsp;|&nbsp;
                    <strong>CP/TP:</strong> ${item.cp || '-'}
                </div>
                <div style="margin-top:6px;color:#444;">${item.keterangan || '-'}</div>
                <button class="btn btn-danger btn-sm" style="margin-top:8px;" onclick="deleteAgenda(${originalIdx})">Hapus</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Tambah agenda
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('agendaForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const newAgenda = {
                guru: document.getElementById('agGuru').value.trim(),
                nip: document.getElementById('agNip').value.trim(),
                mapel: document.getElementById('agMapel').value.trim(),
                semester: document.getElementById('agSemester').value,
                tanggal: document.getElementById('agTanggal').value,
                jam: document.getElementById('agJam').value,
                kelas: document.getElementById('agKelas').value.trim(),
                cp: document.getElementById('agCp').value.trim(),
                keterangan: document.getElementById('agKeterangan').value.trim(),
                createdAt: new Date().toISOString()
            };

            if (!newAgenda.guru || !newAgenda.nip || !newAgenda.tanggal || !newAgenda.kelas) {
                alert('Harap isi semua field yang wajib!');
                return;
            }

            agendaData.push(newAgenda);
            await saveAgendaData();
            renderAgenda();
            form.reset();
            alert('✅ Agenda berhasil disimpan!');
        });
    }
});

// Hapus agenda
async function deleteAgenda(index) {
    if (!confirm('Yakin ingin menghapus agenda ini?')) return;
    agendaData.splice(index, 1);
    await saveAgendaData();
    renderAgenda();
}

// Simpan agenda
async function saveAgendaData() {
    localStorage.setItem('agendaData', JSON.stringify(agendaData));
    try {
        await uploadToDrive('agenda_data.json', JSON.stringify(agendaData));
    } catch (e) {
        console.log('Auto backup agenda ke drive gagal.');
    }
}

// Load opsi semester untuk agenda
function loadSemesterOptionsAgenda() {
    const select = document.getElementById('agSemester');
    if (!select) return;
    const semesters = JSON.parse(localStorage.getItem('semesterData') || '[]');
    select.innerHTML = '<option value="">Pilih Semester</option>';
    semesters.forEach(s => {
        select.innerHTML += `<option value="${s}">${s}</option>`;
    });
}