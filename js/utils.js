// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function loadQRCodeLibrary() {
    if (typeof QRCode !== 'undefined') {
        showToast('Library QR Code sudah tersedia.', 'success');
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = function() {
        showToast('✅ Library QR Code berhasil dimuat!', 'success');
        document.getElementById('qrGenStatus').textContent = '✅ Library siap digunakan.';
    };
    script.onerror = function() {
        showToast('❌ Gagal memuat library QR Code. Periksa koneksi internet.', 'error');
    };
    document.head.appendChild(script);
}
