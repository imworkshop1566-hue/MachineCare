const API_URL =
"https://default17c419df66aa405abf9e9ce76f2304.8e.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/20/workflows/cf9bab4fbc8e4742a49181c9360d75f0/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nNmLzDjUxX6fZoABuSAaKxS5Ho6SYytT6DIz9BFV-30";

let repairData = [];

function excelDateToJSDate(serial) {

    if (!serial) return "";

    const utc_days =
        Math.floor(serial - 25569);

    const utc_value =
        utc_days * 86400;

    const date =
        new Date(utc_value * 1000);

    return date.toLocaleDateString("th-TH");

}

async function loadExcelData() {

    try {

        const response =
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: "{}"
            });

        const json =
            await response.json();

        const rows =
            Array.isArray(json)
                ? json
                : (
                    json.value ||
                    json.body ||
                    json.data ||
                    []
                );

        repairData = rows.map(row => ({

            date:
                excelDateToJSDate(
                    Number(
                        row["วัน/เดือน/ปี"]
                    )
                ),

            machine:
                (
                    row["Machine"] || ""
                ).trim(),

            point:
                (
                    row["ส่วนที่เกิดปัญหา"] ||
                    ""
                ).trim(),

            symptom:
                row["อาการเสีย"] || "",

            cause:
                row["สาเหตุ"] || "",

            action:
                row["วิธีการแก้ไข"] || "",

            repairBy:
                row["ผู้ทำการแก้ไข"] || "",

            spare:
                row["รายการอะไหล่"] || "",

            repairTime:
                Number(
                    row["เวลาซ่อม (min)"]
                ) || 0

        }));

        console.log(
            "Total Records",
            repairData.length
        );

        initFilters();

        render(repairData);

    }
    catch (error) {

        console.error(error);

        alert(
            "ไม่สามารถโหลดข้อมูลจาก Power Automate ได้"
        );

    }

}

function initFilters() {

    const machineFilter =
        document.getElementById(
            "machineFilter"
        );

    machineFilter.innerHTML =
        '<option value="">🔧 เลือกหมายเลขเครื่อง</option>';

    const machines =
        [...new Set(
            repairData
                .map(
                    item => item.machine
                )
                .filter(Boolean)
        )]
        .sort();

    machines.forEach(machine => {

        machineFilter.innerHTML += `
            <option value="${machine}">
                ${machine}
            </option>
        `;

    });

    const damageFilter =
        document.getElementById(
            "damageFilter"
        );

    damageFilter.innerHTML =
        '<option value="">⚠️ เลือกจุดที่เสีย</option>';

}

function updateDamagePoint() {

    const machine =
        document.getElementById(
            "machineFilter"
        ).value;

    const damageFilter =
        document.getElementById(
            "damageFilter"
        );

    damageFilter.innerHTML =
        '<option value="">⚠️ เลือกจุดที่เสีย</option>';

    if (!machine) {
        return;
    }

    const machineData =
        repairData.filter(item =>
            item.machine === machine
        );

    const points =
        [...new Set(
            machineData
                .map(item => item.point)
                .filter(Boolean)
        )]
        .sort();

    points.forEach(point => {

        damageFilter.innerHTML += `
            <option value="${point}">
                ${point}
            </option>
        `;

    });

}

function filterData() {

    const machine =
        document.getElementById(
            "machineFilter"
        ).value.trim();

    const point =
        document.getElementById(
            "damageFilter"
        ).value.trim();

    const filtered =
        repairData.filter(item => {

            const machineMatch =
                !machine ||
                item.machine === machine;

            const pointMatch =
                !point ||
                item.point === point;

            return (
                machineMatch &&
                pointMatch
            );

        });

    render(filtered);

}

function render(data) {

    renderTable(data);

    renderMobileCards(data);

}

function renderTable(data) {

    const tableBody =
        document.getElementById(
            "tableBody"
        );

    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach(item => {

        const encoded =
            encodeURIComponent(
                JSON.stringify(item)
            );

        tableBody.innerHTML += `
        <tr>
            <td>${item.date}</td>
            <td>${item.machine}</td>
            <td>${item.point}</td>
            <td>${item.symptom}</td>
            <td>
                <button
                    onclick="showDetail('${encoded}')">
                    View
                </button>
            </td>
        </tr>
        `;

    });

}

function renderMobileCards(data) {

    const mobileHistory =
        document.getElementById(
            "mobileHistory"
        );

    if (!mobileHistory) return;

    mobileHistory.innerHTML = "";

    data.forEach(item => {

        const encoded =
            encodeURIComponent(
                JSON.stringify(item)
            );

        mobileHistory.innerHTML += `

        <div class="repair-card">

            <div>
                📅 ${item.date}
            </div>

            <h4>
                ${item.machine}
            </h4>

            <div>
                ${item.point}
            </div>

            <p>
                ${item.symptom}
            </p>

            <button
                onclick="showDetail('${encoded}')">

                View Detail

            </button>

        </div>

        `;

    });

}

function showDetail(encoded) {

    const item =
        JSON.parse(
            decodeURIComponent(
                encoded
            )
        );

    document.getElementById(
        "detailContent"
    ).innerHTML = `

        <h3>${item.machine}</h3>

        <p><b>วันที่</b><br>
        ${item.date}</p>

        <p><b>จุดเสีย</b><br>
        ${item.point}</p>

        <p><b>อาการเสีย</b><br>
        ${item.symptom}</p>

        <p><b>สาเหตุ</b><br>
        ${item.cause}</p>

        <p><b>วิธีแก้ไข</b><br>
        ${item.action}</p>

        <p><b>ผู้ซ่อม</b><br>
        ${item.repairBy}</p>

        <p><b>อะไหล่</b><br>
        ${item.spare || "-"}</p>

        <p><b>เวลาซ่อม</b><br>
        ${item.repairTime} นาที</p>

    `;

    document.getElementById(
        "detailModal"
    ).style.display = "flex";

}

function closeModal() {

    document.getElementById(
        "detailModal"
    ).style.display = "none";

}

window.onload = loadExcelData;