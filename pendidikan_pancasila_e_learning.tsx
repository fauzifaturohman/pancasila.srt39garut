import React, { useState, useEffect, useRef } from 'react';

/* 
 * CATATAN UNTUK PENGEMBANG:
 * Aplikasi ini dibangun dalam satu file untuk kompabilitas lingkungan, 
 * namun dibagi menjadi beberapa blok komponen agar seolah-olah 
 * terpisah dalam beberapa file berbeda (Modular).
 * 
 * Library eksternal (SheetJS untuk Excel & HTML5-QRCode untuk Scanner) 
 * dimuat secara otomatis menggunakan useEffect di komponen utama.
 * 
 * Referensi data awal: PKPD FIX.xlsx
 * Referensi layout kartu: Kartu Pelajar SRT 39 Garut.pdf
 */

/* =====================================================================
 * FILE VIRTUAL 1: ICONS & HELPERS
 * ===================================================================== */
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
    lock: <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" />,
    book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
    calendar: <path d="M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4z M16 2v4 M8 2v4 M3 10h18" />,
    qrcode: <path d="M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h6v6h-6z" />,
    upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
    download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />,
    check: <path d="M20 6L9 17l-5-5" />,
    plus: <path d="M12 5v14 M5 12h14" />,
    fileText: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};


/* =====================================================================
 * FILE VIRTUAL 2: DATA & STATE MANAGEMENT
 * ===================================================================== */
const defaultStudents = [
  { id: 1, nama: 'Budi Santoso', nisn: '0051234567', kelas: 'SRMA 1', ttl: 'Garut, 12 Agustus 2005', alamat: 'Jl. Mawar No. 5, Samarang', status: 'Hadir' },
  { id: 2, nama: 'Siti Aminah', nisn: '0059876543', kelas: 'SRMA 1', ttl: 'Garut, 03 Maret 2006', alamat: 'Desa Cintarakyat, RT 02/01', status: '-' },
  { id: 3, nama: 'Ahmad Fadil', nisn: '0061122334', kelas: 'SRMP 2', ttl: 'Bandung, 10 Oktober 2007', alamat: 'Jl. Melati No. 12', status: '-' },
];

const defaultMaterials = [
  { id: 1, title: 'Modul 1: Sejarah Pancasila', type: 'pdf', level: 'SRMA', date: '2023-10-01' },
  { id: 2, title: 'Presentasi: Nilai-Nilai Sila ke-3', type: 'pptx', level: 'SRMP', date: '2023-10-05' },
  { id: 3, title: 'Video Dokumenter Kemerdekaan', type: 'mp4', level: 'SRD', date: '2023-10-10' },
];

const defaultAgendas = [
  { id: 1, date: '2023-10-12', class: 'SRMA 1', title: 'Diskusi Sila Ke-1', notes: 'Siswa aktif bertanya mengenai toleransi beragama.' }
];

/* =====================================================================
 * FILE VIRTUAL 3: AUTHENTICATION / LOGIN COMPONENT
 * ===================================================================== */
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    
    // Autentikasi Guru (Rahasia, tanpa petunjuk)
    if (cleanUsername === 'gurupancasila' && password === 'srt39garut') {
      onLogin({ role: 'teacher', name: 'Guru Pendidikan Pancasila' });
      return;
    }
    
    // Autentikasi Siswa
    if (password === 'pancasila') {
      // Simulasikan pencarian siswa berdasarkan nama lengkap (username)
      const studentName = cleanUsername.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(); 
      onLogin({ role: 'student', name: cleanUsername, username: cleanUsername });
      return;
    }

    setError('Username atau Password tidak valid!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Dekorasi BG */}
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-50">
            <Icon name="book" size={40} className="text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">E-Learning Pancasila</h1>
          <p className="text-gray-500 text-sm mt-1">Sekolah Rakyat Terintegrasi 39 Garut</p>
        </div>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="user" className="text-gray-400" size={18} />
              </div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Masukkan username" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="lock" className="text-gray-400" size={18} />
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Masukkan password" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg flex justify-center items-center gap-2">
            Masuk <Icon name="check" size={18} />
          </button>
        </form>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 font-semibold mb-1">Panduan Login Siswa:</p>
          <p className="text-xs text-gray-600">user: <span className="font-mono bg-white px-1 border rounded">namalengkap</span> (tanpa spasi)</p>
          <p className="text-xs text-gray-600 mt-1">pass: <span className="font-mono bg-white px-1 border rounded">pancasila</span></p>
        </div>
      </div>
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 4: FEATURE - KEHADIRAN (ATTENDANCE)
 * ===================================================================== */
const TeacherAttendance = ({ students, setStudents }) => {
  const handleDownloadTemplate = () => {
    if (typeof XLSX === 'undefined') {
      alert("Library Excel belum dimuat, silakan tunggu sebentar atau muat ulang halaman.");
      return;
    }
    const ws = XLSX.utils.aoa_to_sheet([
      ["No", "Nama", "NISN", "Kelas", "Kehadiran (Hadir/Sakit/Izin/Alpa)"],
      [1, "Contoh Siswa", "0012345678", "SRMA 1", "Hadir"]
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Presensi");
    XLSX.writeFile(wb, "Template_Presensi_Siswa.xlsx");
  };

  const handleExport = () => {
    if (typeof XLSX === 'undefined') return;
    const data = [["No", "Nama", "NISN", "Kelas", "Kehadiran"]];
    students.forEach((s, i) => {
      data.push([i + 1, s.nama, s.nisn, s.kelas, s.status]);
    });
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Presensi");
    XLSX.writeFile(wb, "Data_Presensi_Pancasila.xlsx");
  };

  const handleImport = (e) => {
    if (typeof XLSX === 'undefined') return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      // Parse data (skip header row)
      const importedStudents = [];
      for (let i = 1; i < data.length; i++) {
        if (data[i].length > 1) {
          importedStudents.push({
            id: Date.now() + i,
            nama: data[i][1] || 'Unknown',
            nisn: data[i][2] || '-',
            kelas: data[i][3] || '-',
            ttl: '-', 
            alamat: '-',
            status: data[i][4] || '-'
          });
        }
      }
      if(importedStudents.length > 0){
        setStudents(importedStudents);
        alert(`Berhasil mengimpor ${importedStudents.length} data siswa.`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const updateStatus = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daftar Kehadiran Murid</h2>
          <p className="text-sm text-gray-500">Kelola absensi siswa secara manual atau melalui file Excel.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <Icon name="download" size={16} /> Template
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors">
            <Icon name="upload" size={16} /> Impor
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Icon name="download" size={16} /> Ekspor Data
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-semibold">Nama Siswa</th>
              <th className="p-4 font-semibold">NISN</th>
              <th className="p-4 font-semibold">Kelas</th>
              <th className="p-4 font-semibold text-center">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">{student.nama}</td>
                <td className="p-4 text-gray-600 text-sm">{student.nisn}</td>
                <td className="p-4 text-gray-600 text-sm">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{student.kelas}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {['Hadir', 'Sakit', 'Izin', 'Alpa'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => updateStatus(student.id, status)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          student.status === status 
                            ? (status === 'Hadir' ? 'bg-green-500 text-white shadow-sm' : 
                               status === 'Alpa' ? 'bg-red-500 text-white shadow-sm' : 
                               'bg-yellow-500 text-white shadow-sm')
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">Belum ada data siswa. Silakan impor dari Excel.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 5: FEATURE - SCANNER QR
 * ===================================================================== */
const TeacherQRScanner = ({ students, setStudents }) => {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Memastikan html5-qrcode sudah dimuat
    if (typeof Html5QrcodeScanner !== 'undefined' && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner("reader", { 
        qrbox: { width: 250, height: 250 }, 
        fps: 5 
      });
      
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          
          // Cari siswa berdasarkan NISN dari QR Code
          const studentIndex = students.findIndex(s => s.nisn === decodedText);
          if(studentIndex !== -1) {
             const updated = [...students];
             updated[studentIndex].status = 'Hadir';
             setStudents(updated);
             alert(`Berhasil! ${updated[studentIndex].nama} ditandai Hadir.`);
             
             // Hentikan scan sesaat setelah berhasil
             setTimeout(() => setScanResult(null), 3000);
          } else {
             alert(`Gagal. NISN ${decodedText} tidak ditemukan di sistem.`);
          }
        },
        (error) => {
          // Abaikan error saat sedang mencari QR
        }
      );
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
         scannerRef.current.clear().catch(e => console.error(e));
         scannerRef.current = null;
      }
    };
  }, [students, setStudents]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Icon name="qrcode" className="text-blue-600" /> Scan Presensi Siswa
        </h2>
        <p className="text-sm text-gray-500 mt-2">Arahkan Kartu Pelajar siswa ke kamera untuk mencatat kehadiran otomatis.</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-xl overflow-hidden p-2 bg-gray-50">
        <div id="reader" className="w-full"></div>
      </div>

      {scanResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 animate-pulse">
          <p className="font-bold">Terakhir di-scan:</p>
          <p className="font-mono mt-1 text-lg">{scanResult}</p>
        </div>
      )}
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 6: FEATURE - MATERI AJAR
 * ===================================================================== */
const Materials = ({ isTeacher, materials, setMaterials }) => {
  const [activeTab, setActiveTab] = useState('SRMA');
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState('SRMA');
  const [newType, setNewType] = useState('pdf');

  const levels = ['SRD', 'SRMP', 'SRMA'];

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newMaterial = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      level: newLevel,
      date: new Date().toISOString().split('T')[0]
    };
    setMaterials([...materials, newMaterial]);
    setNewTitle('');
    setShowUpload(false);
  };

  const filteredMaterials = materials.filter(m => m.level === activeTab);

  const getTypeColor = (type) => {
    switch(type) {
      case 'pdf': return 'bg-red-100 text-red-700 border-red-200';
      case 'pptx': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'mp4': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Materi Ajar Pendidikan Pancasila</h2>
          <p className="text-sm text-gray-500">Akses modul pembelajaran berdasarkan jenjang pendidikan.</p>
        </div>
        {isTeacher && (
          <button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Icon name="plus" size={16} /> Unggah Materi
          </button>
        )}
      </div>

      {showUpload && isTeacher && (
        <form onSubmit={handleUpload} className="mb-8 p-5 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-4">Form Unggah Materi Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Judul Materi</label>
              <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Cth: Sejarah Pancasila" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Jenjang</label>
              <select value={newLevel} onChange={(e)=>setNewLevel(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 outline-none">
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Format</label>
              <select value={newType} onChange={(e)=>setNewType(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 outline-none">
                <option value="pdf">PDF Dokumen</option>
                <option value="pptx">PPTX Presentasi</option>
                <option value="mp4">MP4 Video</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition-colors">Simpan Materi</button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {levels.map(level => (
          <button 
            key={level} 
            onClick={() => setActiveTab(level)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === level ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Jenjang {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(mat => (
          <div key={mat.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow flex items-start gap-4">
            <div className={`p-3 rounded-lg border ${getTypeColor(mat.type)}`}>
              <Icon name="fileText" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 leading-tight mb-1">{mat.title}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="uppercase font-bold tracking-wider">{mat.type}</span>
                <span>•</span>
                <span>{mat.date}</span>
              </div>
              <button className="mt-3 text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                <Icon name="download" size={12} /> Unduh File
              </button>
            </div>
          </div>
        ))}
        {filteredMaterials.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-400">
            Belum ada materi untuk jenjang {activeTab}.
          </div>
        )}
      </div>
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 7: FEATURE - AGENDA GURU
 * ===================================================================== */
const TeacherAgenda = ({ agendas, setAgendas }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [className, setClassName] = useState('SRMA 1');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    const newAgenda = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      class: className,
      title: title,
      notes: notes
    };
    setAgendas([newAgenda, ...agendas]);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icon name="calendar" className="text-blue-600" /> Tambah Agenda
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kelas</label>
              <select value={className} onChange={(e)=>setClassName(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 outline-none">
                <option value="SRD 1">SRD 1</option>
                <option value="SRMP 1">SRMP 1</option>
                <option value="SRMA 1">SRMA 1</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Kejadian / Topik</label>
              <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 outline-none" placeholder="Cth: Diskusi tertib" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Catatan Tambahan</label>
              <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows="3" className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 outline-none" placeholder="Deskripsikan kejadian..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors">
              Catat Agenda
            </button>
          </form>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Riwayat Agenda Mengajar</h2>
          <div className="space-y-4">
            {agendas.map(agenda => (
              <div key={agenda.id} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{agenda.title}</h4>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">{agenda.date}</span>
                </div>
                <div className="text-xs font-bold text-gray-500 mb-2">Kelas: {agenda.class}</div>
                <p className="text-sm text-gray-700">{agenda.notes}</p>
              </div>
            ))}
            {agendas.length === 0 && <p className="text-center text-gray-400 py-8">Belum ada catatan agenda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 8: FEATURE - KARTU PELAJAR (STUDENT ID CARD)
 * ===================================================================== */
const StudentIDCard = ({ user, students }) => {
  // Cari data detail murid berdasarkan username (simulasi database)
  const studentData = students.find(s => s.nama.toLowerCase() === user.name.toLowerCase()) || 
    { nama: user.name, nisn: '0050000000', kelas: 'SRMA 1', ttl: 'Garut, 01 Jan 2005', alamat: 'Jl. Raya Samarang, Garut' };

  // Menggunakan API pihak ketiga yang aman dan ringan untuk generate QR Code secara instan
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${studentData.nisn}&color=000000&bgcolor=ffffff`;

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Kartu Pelajar Elektronik</h2>
        <p className="text-gray-500">Dapat digunakan untuk scan presensi kelas.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* BAGIAN DEPAN KARTU */}
        <div className="relative w-[340px] h-[520px] rounded-xl overflow-hidden shadow-2xl border border-gray-700 font-sans" style={{ backgroundColor: '#0f3a58' }}>
          {/* Header Kartu */}
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            {/* Logo Kemensos (Simulasi Shape) */}
            <div className="w-10 h-10 relative flex items-center justify-center">
               <div className="absolute w-6 h-6 bg-blue-500 rounded-full top-0 left-2"></div>
               <div className="absolute w-8 h-4 bg-green-500 rounded-full top-4 right-0 transform -rotate-45"></div>
               <div className="absolute w-10 h-5 bg-yellow-400 rounded-full bottom-0" style={{ borderRadius: '0 0 20px 20px' }}></div>
            </div>
            {/* Logo Sekolah Rakyat (Simulasi Shape) */}
            <div className="w-10 h-10 relative flex items-center justify-center text-red-500">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                 <path d="M9 22V12h6v10" />
               </svg>
            </div>
          </div>
          
          <div className="text-center px-4 mb-4">
            <h3 className="text-[11px] font-black text-red-500 tracking-wide">KEMENTERIAN SOSIAL REPUBLIK INDONESIA</h3>
            <h4 className="text-[13px] font-bold text-white mt-1">Sekolah Rakyat Terintegrasi 39 Garut</h4>
            <p className="text-[7px] text-gray-300 mt-1 px-2">Jl. Raya Samarang, Cintarakyat, Kec. Samarang, Kabupaten Garut, Jawa Barat 44161</p>
          </div>

          <div className="bg-yellow-500 text-[#0f3a58] text-center py-1 mb-4">
            <h2 className="text-sm font-black tracking-widest">KARTU PELAJAR SISWA</h2>
          </div>

          <div className="px-4 flex gap-3 h-[180px]">
             {/* Foto Placeholder */}
             <div className="w-[90px] h-[120px] bg-blue-100 rounded-md border-2 border-white overflow-hidden flex flex-col items-center justify-center text-gray-400">
               <div className="w-10 h-10 bg-white rounded-full mb-1 opacity-80"></div>
               <div className="w-16 h-10 bg-white rounded-t-xl opacity-80"></div>
             </div>
             
             {/* Detail */}
             <div className="flex-1 text-[10px] text-white space-y-1.5 pt-1">
                <div>
                  <span className="block text-gray-300">Nama :</span>
                  <span className="font-bold text-[11px]">{studentData.nama}</span>
                </div>
                <div>
                  <span className="block text-gray-300">NISN :</span>
                  <span className="font-bold">{studentData.nisn}</span>
                </div>
                <div>
                  <span className="block text-gray-300">T.T.L :</span>
                  <span className="font-bold">{studentData.ttl}</span>
                </div>
                <div>
                  <span className="block text-gray-300">Kelas :</span>
                  <span className="font-bold">{studentData.kelas}</span>
                </div>
                <div>
                  <span className="block text-gray-300">Alamat :</span>
                  <span className="font-bold leading-tight line-clamp-2">{studentData.alamat}</span>
                </div>
             </div>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-4 right-4 bg-white p-1 rounded shadow-lg border-2 border-yellow-500">
             <img src={qrUrl} alt="QR Code" className="w-[70px] h-[70px]" crossOrigin="anonymous" />
          </div>
        </div>


        {/* BAGIAN BELAKANG KARTU */}
        <div className="relative w-[340px] h-[520px] rounded-xl overflow-hidden shadow-2xl border border-gray-700 font-sans flex flex-col" style={{ backgroundColor: '#0f3a58' }}>
          {/* Header Kartu Sama */}
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <div className="w-10 h-10 relative flex items-center justify-center">
               <div className="absolute w-6 h-6 bg-blue-500 rounded-full top-0 left-2"></div>
               <div className="absolute w-8 h-4 bg-green-500 rounded-full top-4 right-0 transform -rotate-45"></div>
               <div className="absolute w-10 h-5 bg-yellow-400 rounded-full bottom-0" style={{ borderRadius: '0 0 20px 20px' }}></div>
            </div>
            <div className="w-10 h-10 relative flex items-center justify-center text-red-500">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
            </div>
          </div>
          
          <div className="text-center px-4 mb-6">
            <h3 className="text-[11px] font-black text-red-500 tracking-wide">KEMENTERIAN SOSIAL REPUBLIK INDONESIA</h3>
            <h4 className="text-[13px] font-bold text-white mt-1">Sekolah Rakyat Terintegrasi 39 Garut</h4>
          </div>

          <div className="px-6 flex-1 text-white text-[11px] leading-relaxed">
             <h3 className="text-yellow-400 font-bold text-center text-sm mb-4 border-b border-gray-500 pb-2">SYARAT DAN KETENTUAN</h3>
             <ul className="list-disc pl-3 space-y-3 text-justify">
               <li>Kartu ini merupakan identitas resmi pemegang kartu selama menjadi siswa aktif dan tidak dapat dipindahtangankan kepada pihak lain.</li>
               <li>Pemegang kartu wajib membawa dan menunjukkan kartu ini saat menggunakan fasilitas sekolah atau mengikuti kegiatan resmi kependidikan.</li>
               <li>Apabila kartu ini hilang atau rusak, pemegang kartu segera melapor ke bagian tata usaha, dan bagi yang menemukan harap mengembalikan ke alamat sekolah yang tertera.</li>
             </ul>
          </div>

          <div className="text-center pb-4 text-[7px] text-gray-400 px-8">
            Jl. Raya Samarang, Cintarakyat, Kec. Samarang, Kabupaten Garut, Jawa Barat 44161
          </div>
        </div>

      </div>
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 9: DASHBOARDS
 * ===================================================================== */
const Dashboard = ({ user, onLogout }) => {
  const isTeacher = user.role === 'teacher';
  const [activeMenu, setActiveMenu] = useState(isTeacher ? 'attendance' : 'materials');
  
  // State Global
  const [students, setStudents] = useState(defaultStudents);
  const [materials, setMaterials] = useState(defaultMaterials);
  const [agendas, setAgendas] = useState(defaultAgendas);

  const teacherMenus = [
    { id: 'attendance', label: 'Kehadiran Murid', icon: 'fileText' },
    { id: 'scanner', label: 'Scan Presensi', icon: 'qrcode' },
    { id: 'materials', label: 'Materi Ajar', icon: 'book' },
    { id: 'agenda', label: 'Agenda Guru', icon: 'calendar' }
  ];

  const studentMenus = [
    { id: 'materials', label: 'Materi Pembelajaran', icon: 'book' },
    { id: 'idcard', label: 'Kartu Pelajar', icon: 'user' }
  ];

  const menus = isTeacher ? teacherMenus : studentMenus;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-900 text-white flex flex-col md:min-h-screen shadow-xl z-10">
        <div className="p-6 text-center border-b border-blue-800">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
             <Icon name="book" size={24} className="text-blue-800" />
          </div>
          <h2 className="font-bold text-lg leading-tight">E-Learning Pancasila</h2>
          <p className="text-xs text-blue-300 mt-1">SRT 39 Garut</p>
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-xs font-bold text-blue-400 mb-4 uppercase tracking-wider pl-2">Menu Utama</p>
          <nav className="space-y-1">
            {menus.map(menu => (
              <button 
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeMenu === menu.id ? 'bg-blue-800 text-white shadow-inner' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}
              >
                <Icon name={menu.icon} size={18} />
                {menu.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-950 rounded-lg mb-4">
             <div className="bg-blue-700 p-2 rounded-full">
               <Icon name="user" size={16} />
             </div>
             <div className="text-left flex-1 overflow-hidden">
                <p className="text-xs text-blue-300">Masuk sebagai</p>
                <p className="text-sm font-bold truncate">{user.name}</p>
             </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-bold transition-colors">
            <Icon name="logout" size={16} /> Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {menus.find(m => m.id === activeMenu)?.label}
          </h1>
          <p className="text-gray-500 mt-1">Selamat datang, {user.name}!</p>
        </header>

        {/* Dynamic Rendering Komponen */}
        <div className="animate-fade-in-up">
          {activeMenu === 'attendance' && <TeacherAttendance students={students} setStudents={setStudents} />}
          {activeMenu === 'scanner' && <TeacherQRScanner students={students} setStudents={setStudents} />}
          {activeMenu === 'materials' && <Materials isTeacher={isTeacher} materials={materials} setMaterials={setMaterials} />}
          {activeMenu === 'agenda' && <TeacherAgenda agendas={agendas} setAgendas={setAgendas} />}
          {activeMenu === 'idcard' && <StudentIDCard user={user} students={students} />}
        </div>
      </main>
    </div>
  );
};


/* =====================================================================
 * FILE VIRTUAL 10: APP ENTRY POINT
 * ===================================================================== */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Memuat script SheetJS (Excel) dan HTML5-QRCode secara dinamis agar kompatibel tanpa mengedit index.html
  useEffect(() => {
    const loadScript = (id, src) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    };
    
    // Load dependensi
    loadScript('xlsx-script', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    loadScript('html5-qrcode-script', 'https://unpkg.com/html5-qrcode');

    // Load Tailwind (hanya jaga-jaga jika environment belum menyertakannya)
    if (!document.getElementById('tailwind-script')) {
        const tw = document.createElement('script');
        tw.id = 'tailwind-script';
        tw.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tw);
    }
  }, []);

  return (
    <>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {!currentUser ? (
        <LoginScreen onLogin={setCurrentUser} />
      ) : (
        <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
      )}
    </>
  );
}