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

// ✅ Firebase SDK 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ✅ Firebase 설정
const firebaseConfig = {
            apiKey: "AIzaSyAqxEPu2QuKmFe9e5XLi72PSjNxq06wpUo",
            authDomain: "sparta-34b51.firebaseapp.com",
            projectId: "sparta-34b51",
            storageBucket: "sparta-34b51.firebasestorage.app",
            messagingSenderId: "1041591175270",
            appId: "1:1041591175270:web:c9b6a77663418b166ac5a7",
            measurementId: "G-1PN0G55DDF"
        };

// ✅ Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    location.reload();
});

// ✅ 방명록 불러오기 (최신순 정렬)
const doc_sort = collection(db, "guestbook_contents");
const sortedComments = query(doc_sort, orderBy("now_date", "desc"));

let docs = await getDocs(sortedComments);

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
                <input class="pw-check" type="password" placeholder="비밀번호">
                <button type="button" class="deletebtn">삭제</button>
                <button type="button" class="modifyBtn">수정</button>
                <button type="button" class="confirmBtn">수정완료</button>
                <button type="button" class="cancelBtn">수정취소</button>
            </div>
        </div>`;
    $('#recorded-comments').append(temp_html);
});

// ✅ 방명록 수정 기능
$('.modifyBtn').on('click', function (e) {
    const parent = $(e.target).closest('.recorded-comments-box');
    parent.find('.comments-area').removeAttr("readonly").focus();
    parent.find('.modifyBtn, .deletebtn').hide();
    parent.find('.confirmBtn, .cancelBtn').show();
});

// ✅ 수정 완료
$('.confirmBtn').on('click', async function (e) {
    const parent = $(e.target).closest('.recorded-comments-box');
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
        location.reload();
    } else {
        alert('비밀번호가 다릅니다.');
    }
});

// ✅ 방명록 삭제 기능
$('.deletebtn').on('click', async function (e) {
    const parent = $(e.target).closest('.recorded-comments-box');
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
        location.reload();
    } else {
        alert('비밀번호가 다릅니다.');
    }
});

// ✅ 블로그 타입 alert 기능
$('.velog').click(() => alert('📘 저는 velog를 사용합니다. 📘'));
$('.tistory').click(() => alert('📙 저는 tistory를 사용합니다. 📙'));
