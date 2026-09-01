// ============================================================
// DATA SISWA (dari screenshot)
// ============================================================
const siswaData = [
    { nama: "ADE MUSTOPA", nisn: "3139453861", jenjang: "SD" },
    { nama: "AGUS RAMDANI", nisn: "0104915906", jenjang: "SMP" },
    { nama: "AHMAD PADILAH", nisn: "3137836817", jenjang: "SD" },
    { nama: "AI SITI NUROHMAH", nisn: "3158260386", jenjang: "SD" },
    { nama: "ANDIKA NUROHMAN", nisn: "0141419382", jenjang: "SD" },
    { nama: "ANISA SAPUTRI", nisn: "0123595071", jenjang: "SMP" },
    { nama: "ARDIANSYAH SAPUTRA", nisn: "3162522983", jenjang: "SD" },
    { nama: "ARIF FIRMANSYAH", nisn: "3120690349", jenjang: "SD" },
    { nama: "ARMAN MAULANA", nisn: "3132152714", jenjang: "SMP" },
    { nama: "DEPAHRI PUTRA RAMADAN", nisn: "3111636292", jenjang: "SMP" },
    { nama: "DERIMUHAMMAD", nisn: "3122527422", jenjang: "SMP" },
    { nama: "DEWANGGNA NUGRAHA", nisn: "3124835417", jenjang: "SMP" },
    { nama: "DEWI TANIA", nisn: "3124764226", jenjang: "SD" },
    { nama: "ELSA SABILA NURHALIMAH", nisn: "3130228888", jenjang: "SMP" },
    { nama: "EVA FAUZIAH", nisn: "0094884752", jenjang: "SMP" },
    { nama: "FANESA ANASTASYA", nisn: "0106857181", jenjang: "SMP" },
    { nama: "FEBI", nisn: "0129226857", jenjang: "SD" },
    { nama: "HISMA HOLIPATUL PADILAH", nisn: "0113316745", jenjang: "SMP" },
    { nama: "IHSAN MAULANA", nisn: "3126090468", jenjang: "SMP" },
    { nama: "INDRIA DELIA PUTRI", nisn: "97311050", jenjang: "SMP" },
    { nama: "IRNA RAODOTUL ZANAH", nisn: "3133143373", jenjang: "SMP" },
    { nama: "IRSAL KHAERUNA", nisn: "3146716444", jenjang: "SD" },
    { nama: "LESTI JULIANTI", nisn: "3128365677", jenjang: "SMP" },
    { nama: "M RIZKY MAULANA", nisn: "3172776475", jenjang: "SD" },
    { nama: "M. FATIR", nisn: "0102903616", jenjang: "SMP" },
    { nama: "MOCH AKBAR TRI HERMAWAN", nisn: "0106566909", jenjang: "SMP" },
    { nama: "MOH PAISAL APRILIANSAH", nisn: "0147560005", jenjang: "SD" },
    { nama: "MUHAMAD FATTAN SAPUTRA", nisn: "3155276593", jenjang: "SD" },
    { nama: "MUHAMAD HANIF ALIYUDIN", nisn: "102243542", jenjang: "SMP" },
    { nama: "MUHAMAD HASANUDIN", nisn: "0113191027", jenjang: "SMP" },
    { nama: "MUHAMAD REHAN NURUL JANAH", nisn: "0111987988", jenjang: "SMP" },
    { nama: "MUHAMAD RISKI ABDULLOH", nisn: "3161059263", jenjang: "SD" },
    { nama: "MUHAMAD RIVAL ALFARIZI", nisn: "3169279715", jenjang: "SD" },
    { nama: "MUHAMAD SAMIN NUGRAHA", nisn: "0119673298", jenjang: "SMP" },
    { nama: "MUHAMAD SANDI", nisn: "0115109325", jenjang: "SMP" },
    { nama: "MUHAMMAD IDRUS PAHMI JAHARSAH", nisn: "0115015547", jenjang: "SMP" },
    { nama: "MUHAMMAD RAEHAN", nisn: "3094108589", jenjang: "SMP" },
    { nama: "MUHAMMAD ZAKI ARIPIN", nisn: "0127300770", jenjang: "SMP" },
    { nama: "MUSNAN FIRDAUS", nisn: "3108593390", jenjang: "SMP" },
    { nama: "NAZHAN", nisn: "0102332909", jenjang: "SD" },
    { nama: "NOVI RAHMADANI", nisn: "0127825608", jenjang: "SMP" },
    { nama: "PARHAN HERIYANSAH", nisn: "3137252816", jenjang: "SMP" },
    { nama: "PERDIANSAH PRATAMA", nisn: "0128988677", jenjang: "SMP" },
    { nama: "PIRMANSYAH RAMDANI", nisn: "3108187441", jenjang: "SMP" },
    { nama: "PONI YULIA", nisn: "0124893928", jenjang: "SD" },
    { nama: "RAIHAN SAPUTRA", nisn: "0119552685", jenjang: "SMP" },
    { nama: "RAISA AURELIA PUTRI", nisn: "3142169447", jenjang: "SD" },
    { nama: "RAISYA NURPADILAH", nisn: "0104449370", jenjang: "SMP" },
    { nama: "RANI", nisn: "3128636723", jenjang: "SMP" },
    { nama: "RAYAA RAFSANJANI", nisn: "3151327926", jenjang: "SD" },
    { nama: "REGI", nisn: "0092815396", jenjang: "SMP" },
    { nama: "REHAN", nisn: "0098060608", jenjang: "SMP" },
    { nama: "REZA HANAFIYAH", nisn: "3129196277", jenjang: "SMP" },
    { nama: "RINA", nisn: "3129604730", jenjang: "SMP" },
    { nama: "RISKY", nisn: "0103304248", jenjang: "SMP" },
    { nama: "RIYAD FADILAH", nisn: "0131133087", jenjang: "SD" },
    { nama: "RIYAN AGUNG FAUZI", nisn: "3129425558", jenjang: "SD" },
    { nama: "RIZKI MIRAJ NAWAWI", nisn: "3120958649", jenjang: "SD" },
    { nama: "SABIT MAULANA", nisn: "3117684281", jenjang: "SMP" },
    { nama: "SALMAN SAEPUL BAGRI", nisn: "0115635878", jenjang: "SMP" },
    { nama: "SALSA BILA", nisn: "0124232598", jenjang: "SMP" },
    { nama: "SALWA AULIA ZAKIAWAN", nisn: "0109385868", jenjang: "SMP" },
    { nama: "SELLI KHAIRUNNISA", nisn: "3124008773", jenjang: "SMP" },
    { nama: "SIFA NURAINI", nisn: "0103955647", jenjang: "SMP" },
    { nama: "SITI FADILAH", nisn: "3154325333", jenjang: "SD" },
    { nama: "SITIMASITOH", nisn: "3125474904", jenjang: "SMP" },
    { nama: "SITIPASWA", nisn: "3131493765", jenjang: "SMP" },
    { nama: "SRIMULYANI", nisn: "0108334564", jenjang: "SMP" },
    { nama: "SUDIRMAN", nisn: "0119440168", jenjang: "SMP" },
    { nama: "SYIFANURHAYATI", nisn: "0103927661", jenjang: "SMP" },
    { nama: "YAN YAN ABDUL HADI", nisn: "0106183939", jenjang: "SMP" },
    { nama: "YANA MULYANA", nisn: "3138754482", jenjang: "SD" },
    { nama: "YUSUP AWALUDIN", nisn: "0114870689", jenjang: "SMP" },
    { nama: "ZAKI MUHAMAD KUSUMAH", nisn: "3133946425", jenjang: "SD" },
    { nama: "ZIDAN ABDUL JAILANI", nisn: "3169526039", jenjang: "SD" }
];

// ============================================================
// DATA MATERI AJAR LENGKAP PER KELAS + E-BOOK
// Sumber: Buku Pendidikan Pancasila Kemendikbudristek Kurikulum Merdeka
// ============================================================
const defaultMateriPancasila = [
    // ============================================================
    // SD (SRD) - Fase A (Kelas 1-2), Fase B (3-4), Fase C (5-6)
    // ============================================================
    // Kelas 1
    {
        id: 1,
        kelas: 1,
        jenjang: "SD",
        judul: "Aku dan Teman Temanku",
        deskripsi: "Mengenal diri sendiri, teman, dan pentingnya berteman tanpa membeda-bedakan.",
        konten: `<p><strong>A. Mengenal Diri Sendiri</strong><br>Setiap anak memiliki nama, ciri fisik, dan kesukaan yang berbeda. Kita harus saling menghargai perbedaan.</p>
                <p><strong>B. Berteman dengan Semua Orang</strong><br>Berteman tidak boleh membeda-bedakan. Semua teman adalah sahabat.</p>
                <p><strong>C. Bermain Bersama</strong><br>Bermain bersama mengajarkan kerja sama dan saling membantu.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas I, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-i"
    },
    {
        id: 2,
        kelas: 1,
        jenjang: "SD",
        judul: "Aku Patuh Pada Aturan",
        deskripsi: "Mematuhi aturan di rumah dan sekolah sebagai wujud disiplin.",
        konten: `<p><strong>A. Aturan di Rumah</strong><br>Aturan di rumah dibuat oleh orang tua untuk kebaikan anak. Contoh: bangun pagi, membereskan mainan.</p>
                <p><strong>B. Aturan di Sekolah</strong><br>Aturan sekolah dibuat agar belajar nyaman. Contoh: datang tepat waktu, memakai seragam.</p>
                <p><strong>C. Manfaat Mematuhi Aturan</strong><br>Hidup menjadi tertib, aman, dan nyaman.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas I, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-i"
    },
    {
        id: 3,
        kelas: 1,
        jenjang: "SD",
        judul: "Aku Mengenal Indonesia",
        deskripsi: "Mengenal identitas bangsa Indonesia, lambang negara, bendera, dan lagu kebangsaan.",
        konten: `<p><strong>A. Lambang Negara Garuda Pancasila</strong><br>Garuda Pancasila adalah lambang negara Indonesia. Terdiri dari 5 sila.</p>
                <p><strong>B. Bendera Merah Putih</strong><br>Bendera Indonesia berwarna merah dan putih. Merah melambangkan keberanian, putih melambangkan kesucian.</p>
                <p><strong>C. Lagu Kebangsaan Indonesia Raya</strong><br>Lagu Indonesia Raya dinyanyikan pada upacara bendera.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas I, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-i"
    },
    {
        id: 4,
        kelas: 1,
        jenjang: "SD",
        judul: "Aku dan Lingkunganku",
        deskripsi: "Menjaga kebersihan dan kelestarian lingkungan sekitar.",
        konten: `<p><strong>A. Lingkungan Rumah</strong><br>Menjaga kebersihan rumah adalah tanggung jawab semua anggota keluarga.</p>
                <p><strong>B. Lingkungan Sekolah</strong><br>Membuang sampah pada tempatnya, merawat tanaman di sekolah.</p>
                <p><strong>C. Menjaga Alam</strong><br>Mencintai alam berarti tidak merusak pohon dan menjaga kebersihan sungai.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas I, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-i"
    },

    // Kelas 2
    {
        id: 5,
        kelas: 2,
        jenjang: "SD",
        judul: "Aku Patuh Aturan",
        deskripsi: "Kedisiplinan dalam kehidupan sehari-hari di berbagai tempat.",
        konten: `<p><strong>A. Aturan di Tempat Umum</strong><br>Di tempat umum seperti pasar dan taman, kita harus menjaga ketertiban.</p>
                <p><strong>B. Aturan Berlalu Lintas</strong><br>Mematuhi rambu-rambu lalu lintas untuk keselamatan bersama.</p>
                <p><strong>C. Akibat Tidak Mematuhi Aturan</strong><br>Dapat membahayakan diri sendiri dan orang lain.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas II, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-ii"
    },
    {
        id: 6,
        kelas: 2,
        jenjang: "SD",
        judul: "Aku Berperilaku Pancasila",
        deskripsi: "Menerapkan nilai-nilai Pancasila dalam tindakan sehari-hari.",
        konten: `<p><strong>A. Sila Pertama: Ketuhanan</strong><br>Beribadah sesuai agama masing-masing.</p>
                <p><strong>B. Sila Kedua: Kemanusiaan</strong><br>Menolong teman yang kesulitan.</p>
                <p><strong>C. Sila Ketiga: Persatuan</strong><br>Bermain dengan semua teman tanpa membeda-bedakan.</p>
                <p><strong>D. Sila Keempat: Kerakyatan</strong><br>Musyawarah saat memilih permainan.</p>
                <p><strong>E. Sila Kelima: Keadilan</strong><br>Memberi giliran bermain secara adil.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas II, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-ii"
    },
    {
        id: 7,
        kelas: 2,
        jenjang: "SD",
        judul: "Aku dan Teman-Temanku",
        deskripsi: "Hubungan pertemanan yang baik dan saling menghargai.",
        konten: `<p><strong>A. Sifat Teman yang Baik</strong><br>Jujur, tidak sombong, suka menolong.</p>
                <p><strong>B. Menyelesaikan Konflik</strong><br>Jika bertengkar, selesaikan dengan bicara baik-baik.</p>
                <p><strong>C. Kerja Sama</strong><br>Mengerjakan tugas kelompok bersama-sama.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas II, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-ii"
    },
    {
        id: 8,
        kelas: 2,
        jenjang: "SD",
        judul: "Aku Peduli Lingkungan",
        deskripsi: "Kepedulian terhadap lingkungan alam dan sosial.",
        konten: `<p><strong>A. Peduli Sampah</strong><br>Membuang sampah pada tempatnya dan memilah sampah organik dan anorganik.</p>
                <p><strong>B. Peduli Tanaman</strong><br>Menyiram tanaman dan menanam pohon.</p>
                <p><strong>C. Peduli Sesama</strong><br>Menjenguk teman yang sakit, berbagi makanan.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas II, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-ii"
    },

    // Kelas 3
    {
        id: 9,
        kelas: 3,
        jenjang: "SD",
        judul: "Aku Anak Indonesia",
        deskripsi: "Identitas sebagai anak Indonesia dan kebanggaan terhadap bangsa.",
        konten: `<p><strong>A. Ciri-Ciri Anak Indonesia</strong><br>Berbudi pekerti luhur, cinta tanah air, dan menjunjung tinggi persatuan.</p>
                <p><strong>B. Keberagaman Indonesia</strong><br>Indonesia memiliki beragam suku, agama, dan budaya.</p>
                <p><strong>C. Bangga Menjadi Anak Indonesia</strong><br>Menggunakan produk dalam negeri, melestarikan budaya.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas III, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iii"
    },
    {
        id: 10,
        kelas: 3,
        jenjang: "SD",
        judul: "Aku Patuh Aturan",
        deskripsi: "Kepatuhan pada aturan sebagai wujud tanggung jawab di masyarakat.",
        konten: `<p><strong>A. Aturan di Masyarakat</strong><br>Aturan dibuat untuk kepentingan bersama.</p>
                <p><strong>B. Akibat Melanggar Aturan</strong><br>Dapat merugikan diri sendiri dan orang lain.</p>
                <p><strong>C. Menjadi Teladan</strong><br>Dengan mematuhi aturan, kita menjadi contoh bagi orang lain.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas III, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iii"
    },
    {
        id: 11,
        kelas: 3,
        jenjang: "SD",
        judul: "Berbeda Itu Indah",
        deskripsi: "Menghargai perbedaan suku, agama, dan budaya sebagai kekayaan bangsa.",
        konten: `<p><strong>A. Perbedaan Suku dan Budaya</strong><br>Setiap suku memiliki bahasa dan adat istiadat yang unik.</p>
                <p><strong>B. Toleransi Beragama</strong><br>Menghormati teman yang berbeda agama.</p>
                <p><strong>C. Semboyan Bhinneka Tunggal Ika</strong><br>Berbeda-beda tetapi tetap satu.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas III, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iii"
    },
    {
        id: 12,
        kelas: 3,
        jenjang: "SD",
        judul: "Ayo Mengenal Pancasila",
        deskripsi: "Mengenal lebih dalam tentang Pancasila sebagai dasar negara.",
        konten: `<p><strong>A. Sejarah Singkat Pancasila</strong><br>Pancasila dirumuskan oleh para pendiri bangsa pada tahun 1945.</p>
                <p><strong>B. Makna 5 Sila</strong><br>Setiap sila memiliki makna yang dalam untuk kehidupan berbangsa.</p>
                <p><strong>C. Pancasila dalam Kehidupan</strong><br>Pancasila menjadi pedoman dalam bertindak sehari-hari.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas III, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iii"
    },

    // Kelas 4
    {
        id: 13,
        kelas: 4,
        jenjang: "SD",
        judul: "Mengenal Lingkungan Sekitar",
        deskripsi: "Memahami lingkungan alam dan sosial di sekitar.",
        konten: `<p><strong>A. Lingkungan Alam</strong><br>Mengenal ekosistem, flora, dan fauna di sekitar.</p>
                <p><strong>B. Lingkungan Sosial</strong><br>Hubungan antar warga masyarakat.</p>
                <p><strong>C. Menjaga Lingkungan</strong><br>Melestarikan alam untuk generasi mendatang.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas IV, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iv"
    },
    {
        id: 14,
        kelas: 4,
        jenjang: "SD",
        judul: "Aku Anak yang Disiplin",
        deskripsi: "Membangun kedisiplinan sejak dini dalam berbagai aspek kehidupan.",
        konten: `<p><strong>A. Disiplin Waktu</strong><br>Mengatur waktu belajar dan bermain.</p>
                <p><strong>B. Disiplin dalam Tugas</strong><br>Menyelesaikan tugas tepat waktu.</p>
                <p><strong>C. Disiplin dalam Berperilaku</strong><br>Berkata sopan dan bertindak santun.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas IV, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iv"
    },
    {
        id: 15,
        kelas: 4,
        jenjang: "SD",
        judul: "Kerja Sama di Lingkunganku",
        deskripsi: "Gotong royong dan kerja sama dalam kehidupan di rumah, sekolah, dan masyarakat.",
        konten: `<p><strong>A. Kerja Sama di Rumah</strong><br>Membantu orang tua membersihkan rumah.</p>
                <p><strong>B. Kerja Sama di Sekolah</strong><br>Piket kelas, belajar kelompok.</p>
                <p><strong>C. Kerja Sama di Masyarakat</strong><br>Kerja bakti membersihkan lingkungan.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas IV, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iv"
    },
    {
        id: 16,
        kelas: 4,
        jenjang: "SD",
        judul: "Pancasila dalam Diriku",
        deskripsi: "Menginternalisasi dan mengamalkan nilai-nilai Pancasila dalam diri.",
        konten: `<p><strong>A. Mengamalkan Sila Pancasila</strong><br>Menerapkan nilai-nilai Pancasila dalam tindakan sehari-hari.</p>
                <p><strong>B. Menjadi Warga Negara Baik</strong><br>Cerdas dan berakhlak mulia.</p>
                <p><strong>C. Kebanggaan sebagai Bangsa Indonesia</strong><br>Menjaga nama baik bangsa.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas IV, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-iv"
    },

    // Kelas 5
    {
        id: 17,
        kelas: 5,
        jenjang: "SD",
        judul: "Pancasila dalam Kehidupanku",
        deskripsi: "Memahami Pancasila sebagai dasar negara, pandangan hidup, dan ideologi negara.",
        konten: `<p><strong>A. Pancasila sebagai Ideologi</strong><br>Pancasila adalah ideologi yang mempersatukan bangsa.</p>
                <p><strong>B. Pancasila dan UUD 1945</strong><br>Hubungan antara Pancasila dan konstitusi.</p>
                <p><strong>C. Pancasila dalam Kehidupan Berbangsa</strong><br>Penerapan Pancasila dalam berbagai bidang kehidupan.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas V, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-v"
    },
    {
        id: 18,
        kelas: 5,
        jenjang: "SD",
        judul: "Norma dan Keadilan",
        deskripsi: "Memahami norma-norma yang berlaku di masyarakat dan pentingnya keadilan.",
        konten: `<p><strong>A. Norma Agama</strong><br>Aturan yang bersumber dari ajaran agama.</p>
                <p><strong>B. Norma Kesusilaan</strong><br>Aturan tentang baik dan buruk.</p>
                <p><strong>C. Norma Kesopanan</strong><br>Aturan tentang sopan santun.</p>
                <p><strong>D. Norma Hukum</strong><br>Aturan yang mengikat dan memiliki sanksi.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas V, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-v"
    },
    {
        id: 19,
        kelas: 5,
        jenjang: "SD",
        judul: "Kebebasan yang Bertanggung Jawab",
        deskripsi: "Menjalankan kebebasan berpendapat dengan penuh tanggung jawab.",
        konten: `<p><strong>A. Hak dan Kewajiban</strong><br>Setiap hak diiringi dengan kewajiban.</p>
                <p><strong>B. Kebebasan Berpendapat</strong><br>Bebas berpendapat namun harus menghargai orang lain.</p>
                <p><strong>C. Tanggung Jawab Sosial</strong><br>Bertanggung jawab terhadap lingkungan dan masyarakat.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas V, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-v"
    },
    {
        id: 20,
        kelas: 5,
        jenjang: "SD",
        judul: "Menjaga Keutuhan NKRI",
        deskripsi: "Memahami pentingnya menjaga keutuhan Negara Kesatuan Republik Indonesia.",
        konten: `<p><strong>A. NKRI Harga Mati</strong><br>Mempertahankan keutuhan NKRI.</p>
                <p><strong>B. Peran Warga Negara</strong><br>Menjaga persatuan dan kesatuan.</p>
                <p><strong>C. Cinta Tanah Air</strong><br>Mewujudkan rasa cinta tanah air dalam tindakan nyata.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas V, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-v"
    },

    // Kelas 6
    {
        id: 21,
        kelas: 6,
        jenjang: "SD",
        judul: "Belajar Pancasila dengan Menyenangkan",
        deskripsi: "Mempelajari nilai-nilai Pancasila sebagai kebaikan yang saling berhubungan.",
        konten: `<p><strong>A. Nilai-nilai Pancasila</strong><br>Pancasila terdiri dari 5 nilai yang saling berkaitan.</p>
                <p><strong>B. Penerapan dalam Kehidupan</strong><br>Mengamalkan nilai-nilai Pancasila dalam kegiatan sehari-hari.</p>
                <p><strong>C. Menjadi Pribadi yang Baik</strong><br>Dengan mengamalkan Pancasila, kita menjadi pribadi yang lebih baik.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas VI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-vi"
    },
    {
        id: 22,
        kelas: 6,
        jenjang: "SD",
        judul: "Mengamalkan Pancasila untuk Kebahagiaan Bersama",
        deskripsi: "Mengamalkan nilai-nilai Pancasila dalam kehidupan sehari-hari di sekolah dan masyarakat.",
        konten: `<p><strong>A. Di Sekolah</strong><br>Menghormati guru, mengikuti pelajaran, bekerja sama dengan teman.</p>
                <p><strong>B. Di Masyarakat</strong><br>Bergotong royong, saling menghormati, menjaga kerukunan.</p>
                <p><strong>C. Kebahagiaan Bersama</strong><br>Dengan mengamalkan Pancasila, kehidupan menjadi lebih harmonis.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas VI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-vi"
    },
    {
        id: 23,
        kelas: 6,
        jenjang: "SD",
        judul: "Mengenal Norma dalam Kehidupanku",
        deskripsi: "Mengenal dan mematuhi norma-norma yang berlaku.",
        konten: `<p><strong>A. Norma Agama</strong><br>Aturan yang berasal dari ajaran agama.</p>
                <p><strong>B. Norma Kesusilaan</strong><br>Aturan tentang baik dan buruk.</p>
                <p><strong>C. Norma Kesopanan</strong><br>Aturan tentang sopan santun.</p>
                <p><strong>D. Norma Hukum</strong><br>Aturan yang mengikat dan memiliki sanksi tegas.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas VI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-vi"
    },
    {
        id: 24,
        kelas: 6,
        jenjang: "SD",
        judul: "Belajar Bermusyawarah",
        deskripsi: "Menerapkan prinsip musyawarah untuk mencapai mufakat.",
        konten: `<p><strong>A. Pengertian Musyawarah</strong><br>Musyawarah adalah diskusi untuk mencari solusi bersama.</p>
                <p><strong>B. Manfaat Musyawarah</strong><br>Menghasilkan keputusan yang adil dan diterima semua pihak.</p>
                <p><strong>C. Contoh Musyawarah</strong><br>Memilih ketua kelas, menentukan kegiatan bersama.</p>
                <div class="sumber">Sumber: Buku Siswa Pendidikan Pancasila SD/MI Kelas VI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-sdmi-kelas-vi"
    },

    // ============================================================
    // SMP (SRMP) - Fase D (Kelas 7-9)
    // ============================================================
    // Kelas 7
    {
        id: 25,
        kelas: 7,
        jenjang: "SMP",
        judul: "Sejarah Kelahiran Pancasila",
        deskripsi: "Proses perumusan Pancasila oleh para pendiri bangsa dan penetapannya sebagai dasar negara.",
        konten: `<p><strong>A. Latar Belakang</strong><br>BPUPKI dibentuk untuk mempersiapkan kemerdekaan Indonesia.</p>
                <p><strong>B. Sidang BPUPKI</strong><br>Ir. Soekarno mengusulkan Pancasila pada 1 Juni 1945.</p>
                <p><strong>C. Pengesahan Pancasila</strong><br>PPKI mengesahkan Pancasila sebagai dasar negara pada 18 Agustus 1945.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-vii"
    },
    {
        id: 26,
        kelas: 7,
        jenjang: "SMP",
        judul: "Pancasila dan UUD 1945",
        deskripsi: "Hubungan antara Pancasila dengan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.",
        konten: `<p><strong>A. Pancasila sebagai Sumber Hukum</strong><br>Pancasila adalah sumber dari segala sumber hukum di Indonesia.</p>
                <p><strong>B. UUD 1945</strong><br>Undang-Undang Dasar yang menjadi konstitusi negara.</p>
                <p><strong>C. Keterkaitan</strong><br>UUD 1945 merupakan penjabaran dari nilai-nilai Pancasila.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-vii"
    },
    {
        id: 27,
        kelas: 7,
        jenjang: "SMP",
        judul: "Bhinneka Tunggal Ika",
        deskripsi: "Keberagaman Indonesia sebagai kekayaan bangsa dan pentingnya toleransi.",
        konten: `<p><strong>A. Makna Bhinneka Tunggal Ika</strong><br>Berbeda-beda tetapi tetap satu.</p>
                <p><strong>B. Keberagaman Budaya</strong><br>Indonesia memiliki beragam suku, bahasa, dan budaya.</p>
                <p><strong>C. Toleransi</strong><br>Sikap saling menghormati antar sesama.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-vii"
    },
    {
        id: 28,
        kelas: 7,
        jenjang: "SMP",
        judul: "Semangat Kebangsaan",
        deskripsi: "Menumbuhkan semangat kebangsaan dan cinta tanah air.",
        konten: `<p><strong>A. Pengertian Semangat Kebangsaan</strong><br>Rasa bangga dan cinta terhadap bangsa dan negara.</p>
                <p><strong>B. Wujud Semangat Kebangsaan</strong><br>Menggunakan produk dalam negeri, melestarikan budaya.</p>
                <p><strong>C. Peran Generasi Muda</strong><br>Menjaga persatuan dan kesatuan bangsa.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-vii"
    },

    // Kelas 8
    {
        id: 29,
        kelas: 8,
        jenjang: "SMP",
        judul: "Pancasila sebagai Ideologi Terbuka",
        deskripsi: "Pancasila sebagai ideologi yang dinamis dan terbuka terhadap perubahan zaman.",
        konten: `<p><strong>A. Pengertian Ideologi Terbuka</strong><br>Ideologi yang mampu beradaptasi dengan perkembangan zaman.</p>
                <p><strong>B. Ciri-Ciri</strong><br>Bersumber dari nilai-nilai luhur bangsa, mampu menyesuaikan dengan dinamika masyarakat.</p>
                <p><strong>C. Pancasila dan Globalisasi</strong><br>Pancasila sebagai filter budaya asing.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VIII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-viii"
    },
    {
        id: 30,
        kelas: 8,
        jenjang: "SMP",
        judul: "Hak dan Kewajiban Warga Negara",
        deskripsi: "Hak dan kewajiban warga negara dalam kehidupan berbangsa dan bernegara.",
        konten: `<p><strong>A. Hak Warga Negara</strong><br>Hak atas pendidikan, kesehatan, pekerjaan, dan partisipasi politik.</p>
                <p><strong>B. Kewajiban Warga Negara</strong><br>Membayar pajak, menjaga ketertiban, membela negara.</p>
                <p><strong>C. Keseimbangan Hak dan Kewajiban</strong><br>Setiap hak diimbangi dengan kewajiban.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VIII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-viii"
    },
    {
        id: 31,
        kelas: 8,
        jenjang: "SMP",
        judul: "Demokrasi dan Musyawarah",
        deskripsi: "Demokrasi Pancasila dan musyawarah sebagai budaya bangsa.",
        konten: `<p><strong>A. Demokrasi Pancasila</strong><br>Demokrasi yang berdasarkan musyawarah dan mufakat.</p>
                <p><strong>B. Prinsip Musyawarah</strong><br>Menghargai pendapat, mencari solusi bersama.</p>
                <p><strong>C. Pemilu</strong><br>Pemilihan umum sebagai sarana demokrasi.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VIII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-viii"
    },
    {
        id: 32,
        kelas: 8,
        jenjang: "SMP",
        judul: "Semangat Kebangkitan Nasional",
        deskripsi: "Memahami semangat kebangkitan nasional dalam memperjuangkan kemerdekaan.",
        konten: `<p><strong>A. Latar Belakang Kebangkitan Nasional</strong><br>Budi Utomo sebagai organisasi pertama yang memicu semangat nasional.</p>
                <p><strong>B. Peran Tokoh</strong><br>Ir. Soekarno, Moh. Hatta, dan tokoh lainnya.</p>
                <p><strong>C. Semangat Kebangkitan Nasional</strong><br>Menumbuhkan rasa persatuan dan kesatuan.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas VIII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-viii"
    },

    // Kelas 9
    {
        id: 33,
        kelas: 9,
        jenjang: "SMP",
        judul: "Pancasila dan Ketahanan Nasional",
        deskripsi: "Peran Pancasila dalam memperkuat ketahanan nasional di berbagai bidang.",
        konten: `<p><strong>A. Ketahanan Nasional</strong><br>Kemampuan bangsa untuk bertahan dan mengatasi ancaman.</p>
                <p><strong>B. Dimensi Ketahanan</strong><br>Ideologi, politik, ekonomi, sosial budaya, pertahanan keamanan.</p>
                <p><strong>C. Implementasi</strong><br>Menerapkan Pancasila dalam kehidupan sehari-hari.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas IX, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-ix"
    },
    {
        id: 34,
        kelas: 9,
        jenjang: "SMP",
        judul: "Pancasila dan Wawasan Kebangsaan",
        deskripsi: "Memperkuat wawasan kebangsaan melalui nilai-nilai Pancasila.",
        konten: `<p><strong>A. Wawasan Kebangsaan</strong><br>Cara pandang bangsa Indonesia tentang diri dan lingkungannya.</p>
                <p><strong>B. Unsur-Unsur</strong><br>Cinta tanah air, kesadaran berbangsa, semangat persatuan.</p>
                <p><strong>C. Peran Generasi Muda</strong><br>Mengamalkan Pancasila sebagai generasi penerus.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas IX, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-ix"
    },
    {
        id: 35,
        kelas: 9,
        jenjang: "SMP",
        judul: "Pancasila dan Politik Luar Negeri",
        deskripsi: "Landasan Pancasila dalam politik luar negeri Indonesia yang bebas aktif.",
        konten: `<p><strong>A. Politik Bebas Aktif</strong><br>Indonesia tidak memihak blok manapun dan aktif dalam perdamaian dunia.</p>
                <p><strong>B. Landasan Pancasila</strong><br>Sila ke-2 dan ke-3 sebagai dasar hubungan internasional.</p>
                <p><strong>C. Peran Indonesia di Dunia</strong><br>ASEAN, PBB, Gerakan Non-Blok.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas IX, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-ix"
    },
    {
        id: 36,
        kelas: 9,
        jenjang: "SMP",
        judul: "Pancasila dan Masyarakat Global",
        deskripsi: "Penerapan Pancasila di tengah arus globalisasi.",
        konten: `<p><strong>A. Peluang dan Tantangan</strong><br>Globalisasi membawa kemudahan akses informasi namun juga ancaman budaya asing.</p>
                <p><strong>B. Peran Pancasila</strong><br>Pancasila sebagai pedoman dalam menyaring pengaruh global.</p>
                <p><strong>C. Sikap yang Diperlukan</strong><br>Memperkuat identitas nasional, kritis terhadap budaya asing.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMP/MTs Kelas IX, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-ix"
    },

    // ============================================================
    // SMA / MA / SMK (SRMA) - Fase E (Kelas 10-11), Fase F (Kelas 12)
    // ============================================================
    // Kelas 10
    {
        id: 37,
        kelas: 10,
        jenjang: "SMA",
        judul: "Pancasila sebagai Pemersatu Bangsa",
        deskripsi: "Pancasila sebagai ideologi pemersatu dalam keberagaman Indonesia.",
        konten: `<p><strong>A. Pancasila dalam Keberagaman</strong><br>Pancasila menjadi perekat berbagai suku, agama, dan budaya.</p>
                <p><strong>B. Nilai Persatuan</strong><br>Sila ke-3 sebagai dasar untuk menjaga keutuhan NKRI.</p>
                <p><strong>C. Implementasi</strong><br>Mengamalkan Pancasila dalam kehidupan berbangsa.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas X, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-x"
    },
    {
        id: 38,
        kelas: 10,
        jenjang: "SMA",
        judul: "Membangun Budaya Taat Hukum",
        deskripsi: "Kesadaran hukum dan kepatuhan terhadap hukum di Indonesia.",
        konten: `<p><strong>A. Hukum di Indonesia</strong><br>Sistem hukum berdasarkan Pancasila dan UUD 1945.</p>
                <p><strong>B. Pentingnya Ketaatan Hukum</strong><br>Menciptakan ketertiban dan keadilan.</p>
                <p><strong>C. Peran Warga Negara</strong><br>Menjadi warga negara yang taat hukum.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas X, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-x"
    },
    {
        id: 39,
        kelas: 10,
        jenjang: "SMA",
        judul: "Mengelola Kebinekaan sebagai Modal Sosial",
        deskripsi: "Keberagaman sebagai modal sosial pembangunan nasional.",
        konten: `<p><strong>A. Kekayaan Budaya</strong><br>Keberagaman budaya, suku, dan agama sebagai aset bangsa.</p>
                <p><strong>B. Tantangan Kebinekaan</strong><br>Konflik, intoleransi, dan radikalisme.</p>
                <p><strong>C. Memperkuat Kebinekaan</strong><br>Dialog, toleransi, dan kerja sama antarumat beragama.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas X, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-x"
    },
    {
        id: 40,
        kelas: 10,
        jenjang: "SMA",
        judul: "Menjadi Warga Negara yang Baik",
        deskripsi: "Peran serta warga negara dalam kehidupan berbangsa dan bernegara.",
        konten: `<p><strong>A. Hak dan Kewajiban</strong><br>Mengetahui dan melaksanakan hak dan kewajiban sebagai warga negara.</p>
                <p><strong>B. Partisipasi Politik</strong><br>Berpartisipasi dalam pemilu, menyampaikan pendapat.</p>
                <p><strong>C. Tanggung Jawab Sosial</strong><br>Peduli terhadap lingkungan dan masyarakat.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas X, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-x"
    },

    // Kelas 11
    {
        id: 41,
        kelas: 11,
        jenjang: "SMA",
        judul: "Menjiwai Pancasila",
        deskripsi: "Menginternalisasi nilai-nilai Pancasila sebagai jiwa bangsa.",
        konten: `<p><strong>A. Pancasila sebagai Jiwa Bangsa</strong><br>Pancasila adalah kepribadian bangsa Indonesia.</p>
                <p><strong>B. Implementasi Pancasila</strong><br>Menerapkan Pancasila dalam berbagai bidang kehidupan.</p>
                <p><strong>C. Tantangan Implementasi</strong><br>Menghadapi tantangan global dengan berpegang pada Pancasila.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xi"
    },
    {
        id: 42,
        kelas: 11,
        jenjang: "SMA",
        judul: "Demokrasi Berdasarkan UUD NRI Tahun 1945",
        deskripsi: "Demokrasi Indonesia dalam kerangka UUD 1945.",
        konten: `<p><strong>A. Demokrasi Konstitusional</strong><br>Demokrasi yang berlandaskan konstitusi.</p>
                <p><strong>B. Hak dan Kewajiban Warga Negara</strong><br>Dalam sistem demokrasi.</p>
                <p><strong>C. Partisipasi Politik</strong><br>Peran serta masyarakat dalam proses demokrasi.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xi"
    },
    {
        id: 43,
        kelas: 11,
        jenjang: "SMA",
        judul: "Harmoni dalam Keberagaman",
        deskripsi: "Menjaga harmoni di tengah keberagaman Indonesia.",
        konten: `<p><strong>A. Keberagaman sebagai Kekuatan</strong><br>Keberagaman adalah aset bangsa.</p>
                <p><strong>B. Tantangan Keberagaman</strong><br>Konflik, intoleransi, dan radikalisme.</p>
                <p><strong>C. Memperkuat Harmoni</strong><br>Dialog, toleransi, dan kerja sama.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xi"
    },
    {
        id: 44,
        kelas: 11,
        jenjang: "SMA",
        judul: "Pancasila dan Tantangan Global",
        deskripsi: "Menghadapi tantangan global dengan berpegang pada Pancasila.",
        konten: `<p><strong>A. Peluang Globalisasi</strong><br>Kemudahan akses informasi dan teknologi.</p>
                <p><strong>B. Tantangan Globalisasi</strong><br>Masuknya budaya asing yang bertentangan dengan Pancasila.</p>
                <p><strong>C. Peran Pancasila</strong><br>Pancasila sebagai filter dan pedoman dalam menghadapi globalisasi.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XI, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xi"
    },

    // Kelas 12
    {
        id: 45,
        kelas: 12,
        jenjang: "SMA",
        judul: "Pancasila dalam Pusaran Globalisasi",
        deskripsi: "Pancasila sebagai filter dalam menghadapi arus globalisasi.",
        konten: `<p><strong>A. Dampak Globalisasi</strong><br>Perubahan sosial, budaya, ekonomi, dan politik.</p>
                <p><strong>B. Pancasila sebagai Filter</strong><br>Menyaring nilai-nilai asing yang sesuai dengan kepribadian bangsa.</p>
                <p><strong>C. Strategi Menghadapi Globalisasi</strong><br>Memperkuat identitas nasional dan nilai-nilai Pancasila.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xii"
    },
    {
        id: 46,
        kelas: 12,
        jenjang: "SMA",
        judul: "Pancasila dan Pembangunan Berkelanjutan",
        deskripsi: "Implementasi Pancasila dalam pembangunan berkelanjutan.",
        konten: `<p><strong>A. Konsep Pembangunan Berkelanjutan</strong><br>Memenuhi kebutuhan masa kini tanpa mengorbankan generasi mendatang.</p>
                <p><strong>B. Pancasila dan SDGs</strong><br>Keterkaitan nilai-nilai Pancasila dengan Tujuan Pembangunan Berkelanjutan.</p>
                <p><strong>C. Peran Generasi Muda</strong><br>Mewujudkan pembangunan yang berkeadilan sosial.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xii"
    },
    {
        id: 47,
        kelas: 12,
        jenjang: "SMA",
        judul: "Pancasila dan Ketahanan Nasional",
        deskripsi: "Memperkuat ketahanan nasional melalui Pancasila.",
        konten: `<p><strong>A. Ketahanan Nasional</strong><br>Kemampuan bangsa untuk menghadapi ancaman.</p>
                <p><strong>B. Dimensi Ketahanan</strong><br>Ideologi, politik, ekonomi, sosial budaya, dan pertahanan.</p>
                <p><strong>C. Implementasi</strong><br>Mengamalkan Pancasila untuk memperkuat ketahanan nasional.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xii"
    },
    {
        id: 48,
        kelas: 12,
        jenjang: "SMA",
        judul: "Pancasila dan Perdamaian Dunia",
        deskripsi: "Peran Indonesia dalam mewujudkan perdamaian dunia berdasarkan Pancasila.",
        konten: `<p><strong>A. Politik Luar Negeri Bebas Aktif</strong><br>Landasan Pancasila dalam hubungan internasional.</p>
                <p><strong>B. Peran Indonesia</strong><br>Misi perdamaian PBB, ASEAN, dan Gerakan Non-Blok.</p>
                <p><strong>C. Pancasila sebagai Inspirasi</strong><br>Nilai-nilai Pancasila dapat menjadi contoh bagi dunia.</p>
                <div class="sumber">Sumber: Buku Pendidikan Pancasila SMA/MA Kelas XII, Kemendikbudristek</div>`,
        ebook: "https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xii"
    }
];
