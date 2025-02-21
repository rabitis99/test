// ✅ 스크롤 기능 (전역 함수)
window.scrollPage = function (target) {
    let element = document.querySelector(target);
    if (element) {
        window.scroll({
            
            top: element.offsetTop - 80,
            behavior: 'smooth'
        });
    } else {
        console.error("Element not found: " + target);
    }
};
//아래 코드 구현 안됩니다. 수정부탁드립니다.


window.copyText=function(text) {
    navigator.clipboard.writeText(text).then(() => {
        swal("복사되었습니다: " + text);
    }).catch(err => {
        console.error("복사 실패:", err);
        swal("복사에 실패했습니다.");
    });
}
//✅Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

//✅Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBdTpmbAmUdJPvpFpX0APheKqa6ek0u_L4",
    authDomain: "sparta-8a7c9.firebaseapp.com",
    projectId: "sparta-8a7c9",
    storageBucket: "sparta-8a7c9.firebasestorage.app",
    messagingSenderId: "398990449652",
    appId: "1:398990449652:web:9933698cde0d81148777a1",
    measurementId: "G-0EZRY5MPXF"
};

//✅Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 이모티콘 입력 기능
document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.getElementById("dropdown-emoji");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const emojiPicker = document.querySelector("emoji-picker");
    const inputField = document.getElementById("content");
    // ✅Bootstrap javaScript API 사용, 드롭다운 인스턴스 생성
    const dropdownInstance = new bootstrap.Dropdown(dropdownButton, { autoClose: false });

    // ✅드롭다운 버튼을 눌렀을 때만 열리고 닫히도록 설정
    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (dropdownMenu.classList.contains("show")) {
            dropdownInstance.hide();
        } else {
            dropdownInstance.show();
        }
    });

    // ✅클릭된 이모지 입력
    emojiPicker.addEventListener("emoji-click", (event) => {
        inputField.value += event.detail.unicode;
        dropdownInstance.hide();
    });

    // ✅드롭다운 내부 클릭 시 닫히지 않도록 설정
    dropdownMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });
});

// ✅ 방명록 남기기 기능 
$('#savebtn').click(async function () {
    const nickname = $('#nickname').val().trim();
    const pw = $('#pw').val().trim();
    const content = $('#content').val().trim();

    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        $('#nickname').css("border", "1px solid black").focus();
        return;
    } else if (!pw) {
        alert('비밀번호를 입력해주세요.');
        $('#pw').css("border", "1px solid black").focus();
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

    let docData = { nickname, pw, content, datelist, now_date };

    await addDoc(collection(db, "guestbook_contents"), docData);

    alert("방명록을 남겼어요.");
    $('#content').val('');
    loadGuestbook();
});

// ✅ 방명록 불러오기 (최신순 정렬) - 
async function loadGuestbook() {
    $('#recorded-comments').empty();

    const doc_sort = collection(db, "guestbook_contents");
    const sortedComments = query(doc_sort, orderBy("now_date", "desc"));
    const docs = await getDocs(sortedComments);

    docs.forEach((doc) => {
        let data = doc.data();
        let temp_html = `
            <div class="recorded-comments-box">
                <div class="userinfo">
                    <div class="name">${data.nickname}</div>
                    <div class="date">${data.datelist.slice(0, 3).join('-')} ${data.datelist.slice(3, 5).join(':')}</div>
                </div>
                <textarea class="comments-area" readonly>${data.content}</textarea>
                <input class="docId" type="hidden" value="${doc.id}">
                <div class="delete">
                    <input class="pw-check" type="password" placeholder="비밀번호">  <!-- 🔥 비밀번호 유지 -->
                    <button type="button" class="deletebtn">삭제</button>
                    <button type="button" class="modifyBtn">수정</button>
                    <button type="button" class="confirmBtn" style="display: none;">수정완료</button>
                    <button type="button" class="cancelBtn" style="display: none;">수정취소</button>
                </div>
            </div>`;
        $('#recorded-comments').append(temp_html);
    });
}

// ✅ 방명록 수정 기능 
$(document).on('click', '.modifyBtn', function () {
    const parent = $(this).closest('.recorded-comments-box');
    parent.find('.comments-area').removeAttr("readonly").focus();
    parent.find('.modifyBtn, .deletebtn').hide();
    parent.find('.confirmBtn, .cancelBtn').show();
});

// ✅ 수정 완료 
$(document).on('click', '.confirmBtn', async function () {
    const parent = $(this).closest('.recorded-comments-box');
    const password = parent.find('.pw-check').val();
    const id = parent.find('.docId').val();
    const newContent = parent.find('.comments-area').val();
    const docRef = doc(db, "guestbook_contents", id);
    const docSnap = await getDoc(docRef);

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }

    if (docSnap.exists() && docSnap.data().pw === password) {
        await updateDoc(docRef, { content: newContent });
        alert('수정이 완료되었습니다.');
        loadGuestbook();
    } else {
        alert('비밀번호가 다릅니다.');
    }
});

// ✅ 방문횟수 기능
const visitCountElement = document.getElementById('visitCount');
let visits = Number(localStorage.getItem("visits")) || 0;
localStorage.setItem("visits", ++visits);
visitCountElement.textContent = visits;


// ✅ 방명록 삭제 기능 
$(document).on('click', '.deletebtn', async function () {
    const parent = $(this).closest('.recorded-comments-box');
    const password = parent.find('.pw-check').val();
    const id = parent.find('.docId').val();
    const docRef = doc(db, "guestbook_contents", id);
    const docSnap = await getDoc(docRef);

    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }

    if (docSnap.exists() && docSnap.data().pw === password) {
        await deleteDoc(docRef);
        alert('댓글이 삭제되었습니다.');
        loadGuestbook();
    } else {
        alert('비밀번호가 다릅니다.');
    }
});

// ✅ 블로그 타입 alert 기능
$('.velog').click(() => alert('📘 저는 velog를 사용합니다. 📘'));
$('.tistory').click(() => alert('📙 저는 tistory를 사용합니다. 📙'));

// ✅ 초기 방명록 데이터 불러오기
$(document).ready(function () {
    loadGuestbook();
});