const MACHINE_API_URL = "https://default17c419df66aa405abf9e9ce76f2304.8e.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/13/workflows/54cf97a8fefb4b26847304b6ad70b117/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual/run&sv=1.0&sig=n-YzPO5jgA2MnqJ7N7Btr8hYjX_B4YI_ihneIIAeIWg";

let machines = [];
let priority = "ปานกลาง";

let repairHistory = [
  {id:"WO-260901",machineId:"MC-001",date:"2026-09-01",point:"Control Panel",symptom:"หน้าจอ HMI ค้างและไม่ตอบสนอง",cause:"หน่วยความจำชั่วคราวเต็ม",action:"รีสตาร์ตระบบและอัปเดตโปรแกรม HMI",technician:"ธนกร",duration:35,status:"เสร็จสิ้น"},
  {id:"WO-260828",machineId:"MC-001",date:"2026-08-28",point:"Photo Sensor",symptom:"เซนเซอร์ไม่ตรวจจับชิ้นงาน",cause:"หน้าสัมผัสสกปรก",action:"ทำความสะอาดและปรับตำแหน่ง",technician:"สมชาย",duration:25,status:"เสร็จสิ้น"},
  {id:"WO-260815",machineId:"MC-001",date:"2026-08-15",point:"Sealing Unit",symptom:"อุณหภูมิชุดซีลไม่ถึงค่าที่กำหนด",cause:"ฮีตเตอร์เสื่อมสภาพ",action:"เปลี่ยนฮีตเตอร์และทดสอบอุณหภูมิ",technician:"อนันต์",duration:70,status:"เสร็จสิ้น"},
  {id:"WO-260722",machineId:"MC-001",date:"2026-07-22",point:"Conveyor",symptom:"สายพานเคลื่อนที่ไม่สม่ำเสมอ",cause:"สายพานหย่อน",action:"ปรับความตึงสายพาน",technician:"วิชัย",duration:45,status:"เสร็จสิ้น"},
  {id:"WO-260614",machineId:"MC-001",date:"2026-06-14",point:"Motor",symptom:"มอเตอร์มีความร้อนสูง",cause:"ลูกปืนเริ่มสึกหรอ",action:"เปลี่ยนลูกปืนมอเตอร์",technician:"อนันต์",duration:80,status:"เสร็จสิ้น"},
  {id:"WO-260902",machineId:"MC-002",date:"2026-09-02",point:"Tool Changer",symptom:"ชุดเปลี่ยนทูลหยุดกลางตำแหน่ง",cause:"รอตรวจสอบสัญญาณ Servo",action:"เปิดใบงานและรอผู้เชี่ยวชาญตรวจสอบ",technician:"ประสิทธิ์",duration:40,status:"กำลังดำเนินการ"},
  {id:"WO-260825",machineId:"MC-002",date:"2026-08-25",point:"Spindle",symptom:"มีเสียงดังขณะเดินเครื่อง",cause:"Bearing หลวม",action:"ตั้งระยะและตรวจสอบแรงสั่นสะเทือน",technician:"ประสิทธิ์",duration:65,status:"เสร็จสิ้น"},
  {id:"WO-260811",machineId:"MC-002",date:"2026-08-11",point:"Servo Motor",symptom:"แกน X เคลื่อนที่กระตุก",cause:"ค่าการจูน Servo คลาดเคลื่อน",action:"ปรับค่า Servo Gain และทดสอบ",technician:"ธนกร",duration:90,status:"เสร็จสิ้น"},
  {id:"WO-260730",machineId:"MC-002",date:"2026-07-30",point:"Lubrication Unit",symptom:"แรงดันน้ำมันต่ำ",cause:"ตัวกรองอุดตัน",action:"เปลี่ยนตัวกรอง",technician:"สมชาย",duration:35,status:"เสร็จสิ้น"},
  {id:"WO-260829",machineId:"MC-003",date:"2026-08-29",point:"Cylinder",symptom:"กระบอกลมเคลื่อนที่ช้า",cause:"ซีลรั่ว",action:"รออะไหล่เปลี่ยน Seal Kit",technician:"วิชัย",duration:120,status:"รอดำเนินการ"},
  {id:"WO-260817",machineId:"MC-003",date:"2026-08-17",point:"Proximity Sensor",symptom:"เครื่องไม่ยืนยันตำแหน่งชิ้นงาน",cause:"สายสัญญาณขาดภายใน",action:"เปลี่ยนสายและทดสอบสัญญาณ",technician:"สมชาย",duration:40,status:"เสร็จสิ้น"},
  {id:"WO-260724",machineId:"MC-003",date:"2026-07-24",point:"Robot Arm",symptom:"แขนกลหยุดก่อนถึงตำแหน่งวาง",cause:"ตำแหน่ง Teaching คลาดเคลื่อน",action:"สอนตำแหน่งใหม่และทดสอบ Cycle",technician:"ธนกร",duration:85,status:"เสร็จสิ้น"},
  {id:"WO-260703",machineId:"MC-003",date:"2026-07-03",point:"Feeder",symptom:"ชิ้นงานติดในรางป้อน",cause:"รางป้อนมีคราบน้ำมัน",action:"ทำความสะอาดและปรับแรงสั่น",technician:"อนันต์",duration:30,status:"เสร็จสิ้น"}
];

const $ = id => document.getElementById(id);
const text = (value, fallback = "-") => value === undefined || value === null || value === "" ? fallback : String(value);
const dateText = date => new Intl.DateTimeFormat("th-TH", {day:"numeric", month:"short", year:"numeric"}).format(new Date(date + "T00:00:00"));

function firstValue(object, keys, fallback = "") {
  for (const key of keys) {
    if (object && object[key] !== undefined && object[key] !== null && object[key] !== "") return object[key];
  }
  return fallback;
}

function parseDamagePoints(value) {
  if (Array.isArray(value)) {
    return value.map(item => typeof item === "object" ? firstValue(item, ["Value","value","Title","title","Name","name"]) : item).filter(Boolean).map(String);
  }
  if (typeof value === "string") return value.split(/[,;|]/).map(item => item.trim()).filter(Boolean);
  return [];
}

function extractRows(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [payload?.value, payload?.data, payload?.machines, payload?.result, payload?.body, payload?.body?.value, payload?.body?.data, payload?.body?.machines];
  const rows = candidates.find(Array.isArray);
  if (rows) return rows;
  if (payload && typeof payload === "object" && (payload.MCName || payload.mcName || payload.MachineNo || payload.machineNo || payload.id || payload.ID)) return [payload];
  throw new Error("รูปแบบข้อมูลตอบกลับไม่ใช่ Array และไม่พบ value/data/machines/body");
}

function normalizeMachine(row, index) {
  // รูปแบบข้อมูลจริงจาก Power Automate:
  // { "ItemInternalId": "...", "MCName": "IM.MDL.FFAPP.2023-001" }
  const mcName = text(
    firstValue(
      row,
      ["MCName", "mcName", "MachineNo", "MachineNumber", "machineNo", "MachineID", "machineId"],
      `MC-${String(index + 1).padStart(3, "0")}`
    )
  );

  return {
    id: mcName,
    internalId: text(firstValue(row, ["ItemInternalId", "itemInternalId", "ID", "Id", "id"]), ""),
    name: mcName,
    model: text(firstValue(row, ["Model", "model", "MachineModel", "machineModel"]), "ไม่มีข้อมูล"),
    line: text(firstValue(row, ["Line", "line", "ProductionLine", "productionLine"]), "ไม่มีข้อมูล"),
    area: text(firstValue(row, ["Area", "area", "Location", "location", "Building", "building"]), "ไม่มีข้อมูล"),
    status: text(firstValue(row, ["Status", "status", "MachineStatus", "machineStatus"]), "พร้อมใช้งาน"),
    damagePoints: parseDamagePoints(
      firstValue(row, ["DamagePoints", "damagePoints", "DamagePoint", "damagePoint", "Parts", "parts"], [])
    )
  };
}

async function loadMachines() {
  const select = $("machineSelect");
  const status = $("machineApiStatus");
  select.disabled = true;
  select.innerHTML = '<option value="">กำลังโหลดข้อมูลเครื่องจักร...</option>';
  status.className = "api-status loading";
  status.textContent = "กำลังเชื่อมต่อ Power Automate...";

  try {
    const response = await fetch(MACHINE_API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Accept": "application/json"},
      body: JSON.stringify({requestType: "GetMachines"})
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    const rawText = await response.text();
    if (!rawText.trim()) throw new Error("Flow ตอบกลับสำเร็จ แต่ไม่มีข้อมูลใน Response Body");
    const payload = JSON.parse(rawText);
    machines = extractRows(payload).map(normalizeMachine).filter(machine => machine.id);
    if (!machines.length) throw new Error("ไม่พบหมายเลขเครื่องจักรในข้อมูลตอบกลับ");

    select.innerHTML = machines.map(machine => `<option value="${escapeHtml(machine.id)}" data-internal-id="${escapeHtml(machine.internalId || "")}">${escapeHtml(machine.id)}</option>`).join("");
    select.disabled = false;
    status.className = "api-status success";
    status.textContent = `โหลดข้อมูลเครื่องจักรสำเร็จ ${machines.length} รายการ`;
    renderMachine();
  } catch (error) {
    console.error("Load machines failed:", error);
    machines = [];
    select.innerHTML = '<option value="">ไม่สามารถโหลดข้อมูลเครื่องจักร</option>';
    status.className = "api-status error";
    status.innerHTML = `โหลดข้อมูลไม่สำเร็จ: ${escapeHtml(error.message)} <button id="retryMachines" class="retry-button" type="button">ลองอีกครั้ง</button>`;
    $("retryMachines").onclick = loadMachines;
    clearMachineDetail();
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
}

function currentMachine() { return machines.find(machine => machine.id === $("machineSelect").value) || null; }
function fillOptions(select, items, firstText, firstValue = "") { select.innerHTML = `<option value="${firstValue}">${firstText}</option>` + items.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join(""); }
function clearMachineDetail() { $("machineName").textContent = "รอข้อมูลเครื่องจักร"; $("machineModel").textContent = "Model: -"; $("machineLine").textContent = "-"; $("machineArea").textContent = "📍 -"; $("machineStatus").textContent = "-"; $("machineStatus").className = "status"; fillOptions($("damagePoint"), [], "เลือกจุดที่เสียหาย"); fillOptions($("historyPoint"), [], "ทุกจุดที่เสียหาย", "ทั้งหมด"); $("historyCaption").textContent = "รอข้อมูลเครื่องจักร"; renderHistory(); }

function renderMachine() {
  const machine = currentMachine();
  if (!machine) return clearMachineDetail();
  $("machineName").textContent = machine.name;
  $("machineModel").textContent = `Model: ${machine.model}`;
  $("machineLine").textContent = machine.line;
  $("machineArea").textContent = `📍 ${machine.area}`;
  const running = /running|เดินเครื่อง|active|พร้อมใช้งาน|available/i.test(machine.status);
  $("machineStatus").textContent = running ? "เดินเครื่อง" : machine.status;
  $("machineStatus").className = `status ${running ? "running" : "maintenance"}`;
  const availablePoints = machine.damagePoints.length
    ? machine.damagePoints
    : ["Electrical", "Mechanical", "Pneumatic", "Sensor", "Motor", "Control Panel", "อื่นๆ"];
  fillOptions($("damagePoint"), availablePoints, "เลือกจุดที่เสียหาย");
  fillOptions($("historyPoint"), availablePoints, "ทุกจุดที่เสียหาย", "ทั้งหมด");
  $("historyCaption").textContent = `รายการของเครื่อง ${machine.id} พร้อมตัวกรองหลายเงื่อนไข`;
  renderHistory();
}

function filtered() {
  const id=$("machineSelect").value, point=$("historyPoint").value, start=$("startDate").value, end=$("endDate").value, query=$("searchInput").value.trim().toLowerCase();
  if(start && end && start > end) return [];
  return repairHistory.filter(r=>r.machineId===id).filter(r=>point==="ทั้งหมด"||r.point===point).filter(r=>!start||r.date>=start).filter(r=>!end||r.date<=end).filter(r=>!query||[r.id,r.point,r.symptom,r.cause,r.action,r.technician,r.status].join(" ").toLowerCase().includes(query)).sort((a,b)=>b.date.localeCompare(a.date));
}
function statusClass(status){return status==="เสร็จสิ้น"?"done":status==="กำลังดำเนินการ"?"progress":"wait";}
function renderHistory(){const start=$("startDate").value,end=$("endDate").value,invalid=start&&end&&start>end;$("filterMessage").textContent=invalid?"วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด":"ระบบจะกรองและคำนวณ KPI ใหม่โดยอัตโนมัติ";$("filterMessage").parentElement.classList.toggle("error",Boolean(invalid));const rows=filtered();$("repairCount").textContent=rows.length;$("mttr").textContent=rows.length?Math.round(rows.reduce((sum,row)=>sum+row.duration,0)/rows.length):0;$("latestPoint").textContent=rows[0]?.point||"-";$("historyList").innerHTML=rows.length?rows.map(r=>`<button class="history-item" data-id="${escapeHtml(r.id)}"><div class="history-top"><div class="history-title">🔧 ${escapeHtml(r.point)}<span class="badge ${statusClass(r.status)}">${escapeHtml(r.status)}</span></div><span class="history-date">${dateText(r.date)}</span></div><p class="history-symptom">${escapeHtml(r.symptom)}</p><div class="history-meta"><span>${escapeHtml(r.id)}</span><span>👤 ${escapeHtml(r.technician)}</span><span>◷ ${r.duration} นาที</span></div></button>`).join(""):`<div class="empty"><strong>ไม่พบประวัติการซ่อม</strong><p>ตรวจสอบช่วงวันที่หรือปรับเงื่อนไขตัวกรอง</p></div>`;document.querySelectorAll(".history-item").forEach(button=>button.onclick=()=>openModal(repairHistory.find(r=>r.id===button.dataset.id)));}
function openModal(r){if(!r)return;$("modalId").textContent=r.id;$("modalContent").innerHTML=`<div class="detail"><small>วันที่ซ่อม</small><strong>${dateText(r.date)}</strong></div><div class="detail"><small>จุดที่ซ่อม</small><strong>${escapeHtml(r.point)}</strong></div><div class="detail"><small>สถานะ</small><span class="badge ${statusClass(r.status)}">${escapeHtml(r.status)}</span></div><div class="detail"><small>อาการเสีย</small><strong>${escapeHtml(r.symptom)}</strong></div><div class="detail"><small>สาเหตุ</small><strong>${escapeHtml(r.cause)}</strong></div><div class="detail"><small>การแก้ไข</small><strong>${escapeHtml(r.action)}</strong></div><div class="detail"><small>ผู้ซ่อม / เวลาซ่อม</small><strong>${escapeHtml(r.technician)} / ${r.duration} นาที</strong></div>`;$("modal").classList.remove("hidden");}
function closeModal(){$("modal").classList.add("hidden");}

$("machineSelect").onchange=()=>{["startDate","endDate","searchInput"].forEach(id=>$(id).value="");renderMachine();};
["historyPoint","startDate","endDate","searchInput"].forEach(id=>$(id).addEventListener("input",renderHistory));
$("clearFilters").onclick=()=>{$("historyPoint").value="ทั้งหมด";$("startDate").value="";$("endDate").value="";$("searchInput").value="";renderHistory();};
document.querySelectorAll(".priority").forEach(button=>button.onclick=()=>{priority=button.dataset.level;document.querySelectorAll(".priority").forEach(item=>item.classList.remove("active"));button.classList.add("active");});
$("photoInput").onchange=event=>$("fileName").textContent=event.target.files[0]?`ไฟล์ที่เลือก: ${event.target.files[0].name}`:"";
$("repairForm").onsubmit=event=>{event.preventDefault();const machine=currentMachine();if(!machine)return;const id=`WO-${Date.now().toString().slice(-6)}`,today=new Date().toISOString().slice(0,10);repairHistory.unshift({id,machineId:machine.id,date:today,point:$("damagePoint").value,symptom:$("symptom").value.trim(),cause:"รอตรวจสอบ",action:`เปิดใบแจ้งซ่อมระดับความเร่งด่วน: ${priority}`,technician:"รอมอบหมาย",duration:0,status:"รอดำเนินการ"});$("successText").textContent=`สร้างใบแจ้งซ่อม ${id} เรียบร้อยแล้ว`;$("successMessage").classList.remove("hidden");$("repairForm").reset();$("fileName").textContent="";priority="ปานกลาง";document.querySelectorAll(".priority").forEach(item=>item.classList.toggle("active",item.dataset.level==="ปานกลาง"));renderMachine();};
$("closeSuccess").onclick=()=>$("successMessage").classList.add("hidden");$("closeModal").onclick=closeModal;$("closeModalBottom").onclick=closeModal;$("modal").onclick=event=>{if(event.target===$("modal"))closeModal();};document.addEventListener("keydown",event=>{if(event.key==="Escape")closeModal();});

loadMachines();
