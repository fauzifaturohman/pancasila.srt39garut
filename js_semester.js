// ===== SEMESTER LOGIC =====

let semesterData = [];

// Load semester
async function loadSemesterList() {
    const driveData = await loadFromDrive('semester_data.json');
    if (driveData) {
        semesterData = driveData;
        localStorage.setItem('semesterData', JSON.stringify(driveData));
    } else {
        const localData = localStorage.getItem('semesterData');
        semesterData = localData ? JSON.parse(localData) : [];
    }
    renderSemesterList();
}

// Render daftar semester
function renderSemesterList() {
    const container = document.getElementById('semesterList');
    if (semesterData.length === 0) {
        container.innerHTML = '<p style="color:#6c757d;">Belum ada semester. Tambahkan semester baru!</p>';
        return;
    }

    let html = '';
    semesterData.forEach((s, idx) => {
        html += `
            <div class="semester-item">
                <span><strong>${s}</strong></span>
                <button class="btn btn-danger btn-sm" onclick="deleteSemester(${idx})">Hapus</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Tambah semester
async function addSemester() {
    const input = document.getElementById('newSemesterName');
    const name = input.value.trim();
    if (!name) {
        alert('Masukkan nama semester!');
        return;
    }

    if (semesterData.includes(name)) {
        alert('Semester sudah ada!');
        return;
    }

    semesterData.push(name);
    await saveSemesterData();
    renderSemesterList();
    input.value = '';
    alert('✅ Semester berhasil ditambahkan!');
}

// Hapus semester
async function deleteSemester(index) {
    if (!confirm(`Yakin ingin menghapus semester "${semesterData[index]}"?`)) return;
    semesterData.splice(index, 1);
    await saveSemesterData();
    renderSemesterList();
}

// Simpan semester
async function saveSemesterData() {
    localStorage.setItem('semesterData', JSON.stringify(semesterData));
    try {
        await uploadToDrive('semester_data.json', JSON.stringify(semesterData));
    } catch (e) {
        console.log('Auto backup semester ke drive gagal.');
    }
}