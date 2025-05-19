danhSachnv = JSON.parse(localStorage.getItem('tasks'))??[]
const $ = document.querySelector.bind(document);
const nhiemVus = $("#task-list");
const nhap = $("#todo-input");
const xuat = $("#todo-form");
function escapeHTML(html){
    const div = document.createElement('div')
    div.innerText = html
    return div.innerHTML
}
function saveTasks(){
    localStorage.setItem('tasks',JSON.stringify(danhSachnv))
}
function isDuplicate(newTitle, excludeIndex = -1) {
    const isDuplicate = danhSachnv.some(
        (task, index) =>
            task.tieuDe.toLowerCase() === newTitle.toLowerCase() &&
            excludeIndex !== index
    );
    return isDuplicate;
}
nhiemVus.onclick = function (e) {
    const danhSach = e.target.closest(".task-item");
    if(!danhSach) return 
    // const viTri = +danhSach.getAttribute("data-index");
    const viTri = +danhSach.dataset.index
    const nhiemVu = danhSachnv[viTri];
    console.log(nhiemVu);
    if (e.target.closest(".edit")) {
        let nhiemVuMoi = prompt("Nhập Công việc Mới", nhiemVu.tieuDe);
        if (nhiemVuMoi === null) return;

        if (isDuplicate(nhiemVuMoi, viTri))
            return alert("Không nhập trùng công việc vui lòng nhập lại");
        nhiemVuMoi = nhiemVuMoi.trim();
        if (!nhiemVuMoi) return alert("Nhập lại");
        nhiemVu.tieuDe = nhiemVuMoi;
        renderTask();
        saveTasks()
        return;
    }
    if (e.target.closest(".done")) {
        nhiemVu.hoanThanh = !nhiemVu.hoanThanh;
        renderTask();
        saveTasks()
        return;
    }
    if (e.target.closest(".delete")) {
        if (confirm("Bạn có chắc muốn xóa?")) {
            danhSachnv.splice(viTri, 1);
            renderTask();
            saveTasks()
        }
    }
};
xuat.onsubmit = function (e) {
    e.preventDefault();
    const value = nhap.value.trim();
    if (!value) return alert("nhap lai");

    if (isDuplicate(value))
        return alert("Không nhập trùng công việc vui lòng nhập lại");
    danhSachnv.push({
        tieuDe: value,
        hoanThanh: false,
    });
    renderTask();
    saveTasks()
    nhap.value = "";
};
function renderTask() {
    if (!danhSachnv.length) {
        nhiemVus.innerHTML = `
                <div class="message-empty">Không Có Nhiệm Vụ Nào</div>
        
        `;
        return;
    }
    
    const html = danhSachnv
        .map(
            (nhiemVu, viTri) =>
                `<li class="task-item ${
                    nhiemVu.hoanThanh ? "completed" : ""
                }" data-index=${viTri}>
                    <span class="task-title">${escapeHTML(nhiemVu.tieuDe)}</span>
                    <div class="task-action">
                        <button class="task-btn edit">Chỉnh Sửa</button>
                        <button class="task-btn done">${
                            nhiemVu.hoanThanh ? "Chưa Hoàn Thành" : "Hoàn Thành"
                        }</button>
                        <button class="task-btn delete">Xóa</button>
                    </div>
        </li>`
        )
        .join("");
    nhiemVus.innerHTML = html;
}
renderTask();
