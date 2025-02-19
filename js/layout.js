// ✅ 스크롤 기능 (전역 함수)
window.scrollPage = function (target) {
    let element = document.querySelector(target);
    if (element) {
        window.scroll({ top: element.offsetTop - 80, behavior: 'smooth' });
    } else {
        console.error("Element not found: " + target);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", function () {
            let target = this.getAttribute("data-target");
            if (target) {
                let targetElement = document.querySelector(target);
                if (targetElement) {
                    let scrollTo = targetElement.offsetTop - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);
                    window.scrollTo({ top: scrollTo, behavior: "smooth" });
                }
            }
        });
    });

    // ✅ Firebase SDK 가져오기
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

    // ✅ Firebase 설정 및 초기화
    const firebaseConfig = {
        apiKey: "AIzaSyBdTpmbAmUdJPvpFpX0APheKqa6ek0u_L4",
        authDomain: "sparta-8a7c9.firebaseapp.com",
        projectId: "sparta-8a7c9",
        storageBucket: "sparta-8a7c9.firebasestorage.app",
        messagingSenderId: "398990449652",
        appId: "1:398990449652:web:9933698cde0d81148777a1",
        measurementId: "G-0EZRY5MPXF"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // ✅ 이모티콘 입력 기능
    const dropdownButton = document.getElementById("dropdown-emoji");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const emojiPicker = document.querySelector("emoji-picker");
    const inputField = document.getElementById("content");
    const dropdownInstance = new bootstrap.Dropdown(dropdownButton, { autoClose: false });

    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownMenu.classList.contains("show") ? dropdownInstance.hide() : dropdownInstance.show();
    });

    emojiPicker.addEventListener("emoji-click", (event) => {
        inputField.value += event.detail.unicode;
    });

    dropdownMenu.addEventListener("click", (event) => event.stopPropagation());

    // ✅ 방명록 저장 기능
    document.getElementById("savebtn").addEventListener("click", async function () {
        const nickname = document.getElementById("nickname").value.trim();
        const pw = document.getElementById("pw").value.trim();
        const content = document.getElementById("content").value.trim();

        if (!nickname || !pw) {
            alert(`${!nickname ? "닉네임" : "비밀번호"}을 입력해주세요.`);
            return;
        }

        let now_date = new Date();
        let datelist = [
            now_date.getFullYear(),
            now_date.getMonth() + 1,
            now_date.getDate(),
            now_date.getHours().toString().padStart(2, '0'),
            now_date.getMinutes().toString().padStart(2, '0')
        ];

        await addDoc(collection(db, "guestbook_contents"), { nickname, pw, content, datelist, now_date });

        alert("방명록을 남겼어요.");
        document.getElementById("content").value = '';
        loadGuestbook();
    });

    // ✅ 방명록 불러오기 (최신순 정렬)
    async function loadGuestbook() {
        const container = document.getElementById("recorded-comments");
        container.innerHTML = '';

        const docs = await getDocs(query(collection(db, "guestbook_contents"), orderBy("now_date", "desc")));

        docs.forEach((doc) => {
            let data = doc.data();
            let commentHTML = `
                <div class="recorded-comments-box">
                    <div class="userinfo">
                        <div class="name">${data.nickname}</div>
                        <div class="date">${data.datelist.slice(0, 3).join('-')} ${data.datelist.slice(3, 5).join(':')}</div>
                    </div>
                    <textarea class="comments-area" readonly>${data.content}</textarea>
                    <input class="docId" type="hidden" value="${doc.id}">
                    <div class="delete">
                        <input class="pw-check" type="password" placeholder="비밀번호">
                        <button class="deletebtn">삭제</button>
                        <button class="modifyBtn">수정</button>
                        <button class="confirmBtn" style="display: none;">수정완료</button>
                        <button class="cancelBtn" style="display: none;">수정취소</button>
                    </div>
                </div>`;
            container.insertAdjacentHTML("beforeend", commentHTML);
        });
    }

    // ✅ 방명록 수정 기능
    document.addEventListener("click", async function (event) {
        const target = event.target;
        const parent = target.closest(".recorded-comments-box");
        if (!parent) return;

        if (target.classList.contains("modifyBtn")) {
            parent.querySelector(".comments-area").removeAttribute("readonly");
            parent.querySelector(".modifyBtn").style.display = "none";
            parent.querySelector(".deletebtn").style.display = "none";
            parent.querySelector(".confirmBtn").style.display = "inline-block";
            parent.querySelector(".cancelBtn").style.display = "inline-block";
        }

        if (target.classList.contains("confirmBtn")) {
            const password = parent.querySelector(".pw-check").value;
            const id = parent.querySelector(".docId").value;
            const newContent = parent.querySelector(".comments-area").value;
            const docRef = doc(db, "guestbook_contents", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().pw === password) {
                await updateDoc(docRef, { content: newContent });
                alert("수정이 완료되었습니다.");
                loadGuestbook();
            } else {
                alert("비밀번호가 다릅니다.");
            }
        }
    });

    // ✅ 방문 횟수 기능
    const visitCountElement = document.getElementById('visitCount');
    let visits = Number(localStorage.getItem("visits")) || 0;
    localStorage.setItem("visits", ++visits);
    visitCountElement.textContent = visits;

    // ✅ 블로그 타입 alert 기능
    document.querySelectorAll(".velog, .tistory").forEach((el) => {
        el.addEventListener("click", () => {
            alert(`📘 저는 ${el.classList.contains("velog") ? "velog" : "tistory"}를 사용합니다. 📘`);
        });
    });

    // ✅ 초기 방명록 데이터 불러오기
    loadGuestbook();
});
