const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

window.addEventListener('load', () => {
    document.getElementById('searchBtn').addEventListener('click', async () => {
        const searchId = document.getElementById('searchId').value.trim().toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;

        try {
            const response = await axios.get(`${BASE_URL}/logistics`);
            const filteredData = response.data.filter(item => {
                const matchId = !searchId || item.productid.toLowerCase().includes(searchId);
                const matchStatus = !statusFilter || item.deliverystatus === statusFilter;
                return matchId && matchStatus;
            });

            renderFilteredData(filteredData); // ใช้ฟังก์ชันนี้ในการแสดงข้อมูลที่ค้นหา
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    document.getElementById('searchId').addEventListener('input', (event) => {
        if (event.target.value === '') {
            loadData(); // ถ้าลบการค้นหา จะโหลดข้อมูลทั้งหมด
        }
    });
});

const loadData = async () => {
    console.log('loaded');
    const response = await axios.get(`${BASE_URL}/logistics`);
    console.log(response.data);

    renderFilteredData(response.data); // เรียกใช้ renderFilteredData โดยตรงในฟังก์ชัน loadData
}

function renderFilteredData(data) {
    const logisticTable = document.getElementById('logistic');
    logisticTable.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        let logistic = data[i];
        let row = `<tr>
                        <td>${logistic.productid}</td>
                        <td>${logistic.origindestination}</td>
                        <td>${logistic.deliverystatus}</td>
                        <td>
                            <a href='index.html?id=${logistic.id}'><button class='edit-btn'>Edit</button></a>
                            <button class='delete-btn' data-id='${logistic.id}'>Delete</button>
                        </td>
                   </tr>`;
        logisticTable.innerHTML += row;
    }

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/logistics/${id}`);
                loadData(); // เมื่อทำการลบแล้ว โหลดข้อมูลใหม่
            } catch (error) {
                console.log(error);
            }
        });
    });
}
