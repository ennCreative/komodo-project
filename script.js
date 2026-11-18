// Data awal (Contoh promosi yang sudah tayang di platform)
const initialPromos = [
    {
        id: 1,
        brand: "Kopi Flores Roastery",
        title: "Paket Bundling Biji Kopi Arabika Bajawa 500gr",
        category: "Kuliner & F&B",
        price: "Rp 115.000",
        image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80",
        description: "Nikmati cita rasa autentik kopi dataran tinggi Flores. Gratis ongkir khusus pemesanan minggu ini.",
        whatsapp: "6281234567890"
    },
    {
        id: 2,
        brand: "Nusantara Web Studio",
        title: "Jasa Pembuatan Landing Page UMKM Terima Beres",
        category: "Jasa & Digital",
        price: "Mulai Rp 499.000",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        description: "Tingkatkan kepercayaan pelanggan dengan website profesional. Sudah termasuk desain responsif dan optimasi kecepatan.",
        whatsapp: "6281234567890"
    },
    {
        id: 3,
        brand: "Tenun Ikat Timur",
        title: "Kemeja Etnik Tenun Asli Motif Komodo",
        category: "Fashion & Kecantikan",
        price: "Rp 280.000",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
        description: "Ditenun secara tradisional oleh pengrajin lokal. Nyaman dipakai untuk acara formal maupun kasual.",
        whatsapp: "6281234567890"
    }
];

// Mengambil data dari LocalStorage atau menggunakan data awal
let promos = JSON.parse(localStorage.getItem('komodoPromos')) || initialPromos;

// Elemen DOM
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const resultCount = document.getElementById('resultCount');

// Modal Elemen
const modal = document.getElementById('promoModal');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnOpenModalSecondary = document.getElementById('btnOpenModalSecondary');
const btnCloseModal = document.getElementById('btnCloseModal');
const promoForm = document.getElementById('promoForm');

// Fungsi Menampilkan Kartu Promosi
function renderPromos(data) {
    productGrid.innerHTML = '';
    resultCount.textContent = `Menampilkan ${data.length} promosi aktif`;

    if (data.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">Tidak ada promosi yang sesuai dengan pencarian Anda.</p>`;
        return;
    }

    data.forEach(item => {
        const defaultImg = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80";
        const imgSrc = item.image && item.image.trim() !== "" ? item.image : defaultImg;
        const waMessage = encodeURIComponent(`Halo ${item.brand}, saya melihat promosi "${item.title}" di Komodo Project dan tertarik untuk bertanya lebih lanjut.`);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${imgSrc}" alt="${item.title}" class="card-img" onerror="this.src='${defaultImg}'">
            <div class="card-body">
                <div class="card-meta">
                    <span class="card-category">${item.category}</span>
                    <span class="card-brand">${item.brand}</span>
                </div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.description}</p>
                <div class="card-footer">
                    <span class="card-price">${item.price}</span>
                    <a href="https://wa.me/${item.whatsapp}?text=${waMessage}" target="_blank" class="btn-wa">Hubungi Penjual</a>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Fungsi Filter & Pencarian
function filterPromos() {
    const keyword = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = promos.filter(item => {
        const matchKeyword = item.title.toLowerCase().includes(keyword) || 
                             item.brand.toLowerCase().includes(keyword) || 
                             item.description.toLowerCase().includes(keyword);
        const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchKeyword && matchCategory;
    });

    renderPromos(filtered);
}

// Event Listener Pencarian
searchInput.addEventListener('input', filterPromos);
categoryFilter.addEventListener('change', filterPromos);

// Kontrol Modal Popup
btnOpenModal.onclick = () => modal.style.display = 'block';
btnOpenModalSecondary.onclick = () => modal.style.display = 'block';
btnCloseModal.onclick = () => modal.style.display = 'none';

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Menangani Submit Form Penjual
promoForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Membersihkan format nomor WA jika user mengetik 08... menjadi 628...
    let rawWa = document.getElementById('whatsapp').value.replace(/\D/g, '');
    if (rawWa.startsWith('0')) {
        rawWa = '62' + rawWa.substring(1);
    }

    const newPromo = {
        id: Date.now(),
        brand: document.getElementById('brandName').value,
        title: document.getElementById('productTitle').value,
        category: document.getElementById('category').value,
        price: document.getElementById('priceTag').value,
        image: document.getElementById('imageUrl').value,
        description: document.getElementById('description').value,
        whatsapp: rawWa
    };

    // Tambahkan ke urutan paling atas
    promos.unshift(newPromo);
    
    // Simpan ke LocalStorage
    localStorage.setItem('komodoPromos', JSON.stringify(promos));

    // Reset form, tutup modal, dan perbarui tampilan
    promoForm.reset();
    modal.style.display = 'none';
    filterPromos();
    
    alert('Selamat! Promosi Anda berhasil ditayangkan di Komodo Project.');
});

// Jalankan render pertama kali saat halaman dimuat
renderPromos(promos);
