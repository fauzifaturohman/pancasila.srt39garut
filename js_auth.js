// ===== AUTHENTICATION =====

const VALID_USERS = {
    // Guru
    'gurupancasila': { password: 'srt39garut', role: 'guru' },
    // Siswa — dinamis, semua password = 'pancasila'
};

function handleLogin(username, password, role) {
    // Cek login guru
    if (role === 'guru') {
        if (username === 'gurupancasila' && password === 'srt39garut') {
            return { success: true, role: 'guru' };
        }
        return { success: false };
    }

    // Cek login siswa — username = namalengkap, password = pancasila
    if (role === 'siswa') {
        // Validasi: username tidak boleh kosong, password harus 'pancasila'
        if (username.length >= 3 && password === 'pancasila') {
            return { success: true, role: 'siswa' };
        }
        return { success: false };
    }

    return { success: false };
}

// Cek status login di setiap halaman
function checkAuth() {
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
    }
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}