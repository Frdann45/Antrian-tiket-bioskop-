document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMEN DOM ---
    const customerNameInput = document.getElementById('customerName');
    const ticketCountInput = document.getElementById('ticketCount');
    const addQueueBtn = document.getElementById('addQueueBtn');
    const queueList = document.getElementById('queueList');
    const processFifoBtn = document.getElementById('processFifoBtn');
    const processRRBtn = document.getElementById('processRRBtn');
    const timeQuantumInput = document.getElementById('timeQuantum');
    const resultContainer = document.getElementById('result-container');
    const helpBtn = document.getElementById('helpBtn');
    const modal = document.getElementById('helpModal');
    const closeBtn = document.querySelector('.close-btn');

    // --- STATE APLIKASI ---
    let queue = []; // Array untuk menyimpan data antrian { name, tickets }

    // --- FUNGSI ---

    /**
     * Merender ulang daftar antrian di UI berdasarkan state `queue` terkini.
     */
    const renderQueue = () => {
        queueList.innerHTML = ''; // Kosongkan list sebelum render ulang
        if (queue.length === 0) {
            queueList.innerHTML = '<p>Antrian masih kosong.</p>';
            return;
        }
        queue.forEach((customer, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><i class="fas fa-user"></i> ${customer.name}</span>
                <span>${customer.tickets} Tiket</span>
            `;
            queueList.appendChild(li);
        });
    };

    /**
     * Menampilkan notifikasi hasil proses di UI.
     * @param {string} message - Pesan yang akan ditampilkan.
     * @param {string} type - Tipe notifikasi ('success' atau 'info').
     */
    const showNotification = (message, type = 'info') => {
        resultContainer.innerHTML = `<p class="${type}">${message}</p>`;
        resultContainer.style.backgroundColor = type === 'success' ? '#d4edda' : '#cce5ff';
    };
    
    /**
     * Menambahkan pelanggan baru ke dalam antrian.
     */
    const addCustomerToQueue = () => {
        const name = customerNameInput.value.trim();
        const tickets = parseInt(ticketCountInput.value);

        if (name === '' || isNaN(tickets) || tickets <= 0) {
            showNotification('Nama dan jumlah tiket harus diisi dengan benar.', 'error');
            resultContainer.style.backgroundColor = '#f8d7da';
            return;
        }

        queue.push({ name, tickets });
        renderQueue();
        showNotification(`<strong>${name}</strong> dengan <strong>${tickets}</strong> tiket telah ditambahkan ke antrian.`, 'success');
        
        // Reset input fields
        customerNameInput.value = '';
        ticketCountInput.value = 1;
    };

    /**
     * Memproses antrian menggunakan algoritma FIFO (First-In, First-Out).
     * Memproses pelanggan pertama dalam antrian.
     */
    const processFIFO = () => {
        if (queue.length === 0) {
            showNotification('Antrian kosong, tidak ada yang bisa diproses.');
            return;
        }

        const processedCustomer = queue.shift(); // Ambil dan hapus elemen pertama
        renderQueue();
        showNotification(`<b>[FIFO]</b> Pelanggan <strong>${processedCustomer.name}</strong> (${processedCustomer.tickets} tiket) telah selesai dilayani.`, 'success');
    };

    /**
     * Memproses antrian menggunakan algoritma Round Robin.
     * Setiap pelanggan dilayani sejumlah 'quantum' tiket secara bergantian.
     */
    const processRoundRobin = () => {
        const quantum = parseInt(timeQuantumInput.value);

        if (queue.length === 0) {
            showNotification('Antrian kosong, tidak ada yang bisa diproses.');
            return;
        }
        if (isNaN(quantum) || quantum <= 0) {
            showNotification('Nilai Quantum harus angka positif.', 'error');
            return;
        }
        
        let customer = queue.shift(); // Ambil pelanggan pertama
        let ticketsToProcess = Math.min(customer.tickets, quantum);
        
        customer.tickets -= ticketsToProcess;

        let message = `<b>[Round Robin]</b> Pelanggan <strong>${customer.name}</strong> dilayani untuk <strong>${ticketsToProcess}</strong> tiket.`;

        if (customer.tickets > 0) {
            queue.push(customer); // Masukkan kembali ke akhir antrian jika belum selesai
            message += ` Sisa tiket: <strong>${customer.tickets}</strong>. Kembali ke akhir antrian.`;
        } else {
            message += ` Pesanan selesai.`;
        }

        renderQueue();
        showNotification(message, 'info');
    };


    // --- EVENT LISTENERS ---
    addQueueBtn.addEventListener('click', addCustomerToQueue);
    processFifoBtn.addEventListener('click', processFIFO);
    processRRBtn.addEventListener('click', processRoundRobin);
    
    // Event listener untuk modal petunjuk
    helpBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- INISIALISASI ---
    renderQueue(); // Render antrian saat halaman pertama kali dimuat
});