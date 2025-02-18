//스크롤 기능 작업
// Define the function in the global scope
function scrollPage(target) {
    let element = document.querySelector(target);
    if (element) {
        let position = element.offsetTop;
        window.scroll({
            top: position - 80,
            behavior: 'smooth'
        });
    } else {
        console.error("Element not found: " + target);
    }
}
// Expose function globally
window.scrollPage = scrollPage;






// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// Firebase 구성 정보 설정
//임비 DB로 교체 부탁 - /member 컬렉션 존재
const firebaseConfig = {
    apiKey: "AIzaSyBFdIOtbPNQSA3Kc1QuQrY4yYeTUO5E9cw",
    authDomain: "team1-mini-project-6e821.firebaseapp.com",
    projectId: "team1-mini-project-6e821",
    storageBucket: "team1-mini-project-6e821.appspot.com",
    messagingSenderId: "890610614383",
    appId: "1:890610614383:web:f8c969ada04ee4d31a4d9a",
    measurementId: "G-J1SET2NDRK",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
/* 방명록 남기기 기능 */
$('#savebtn').click(async function () {

    const nickname = document.getElementById("nickname");
    const pw = document.getElementById("pw");

    /* 유효성 체크 */
    if ($('#nickname').val() === "") { //닉네임 값이 없으면

        nickname.style.border = "1px solid black"; //테두리색 검은색으로 변경
        alert('닉네임을 입력해주세요.');

    } else if (($('#nickname').val() !== "") && ($('#pw').val() === "")) {  //닉네임 값이 있고 pw값이 없으면
        pw.style.border = "1px solid black";
        nickname.style.border = "1px solid lightgray";
        alert('비밀번호를 입력해주세요.');

    } else { //닉네임 pw값 모두 있을때
        let nickname = $('#nickname').val();
        let pw = $('#pw').val();
        let content = $('#content').val();

        /* 입력 당시 날짜 데이터 생성 */
        let now_date = new Date(); //order용
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let date = new Date().getDate();
        let hour = new Date().getHours();
        let minute = new Date().getMinutes();

        minute = minute < 10 ? '0' + minute : minute; //minute이 10보다 작으면 0붙이기
        hour = hour < 10 ? '0' + hour : hour; //hour이 10보다 작으면 0붙이기

        let datelist = [year, month, date, hour, minute] //date 리스트 생성

        let doc = {
            'nickname': nickname,
            'pw': pw,
            'content': content,
            'datelist': datelist,
            'now_date': now_date
        }

        await addDoc(collection(db, "guestbook_contents"), doc)

        alert("방명록을 남겼어요.")
        window.location.reload();
        //plan b 새로고침 안해도 리로드

        //남기기 누르면 썼던 내용만 지워지게
        $('#content').val('');
    }
});

// const doctest = collection(db, "guesbook_contents");
// doctest.doc("nickname").onSnapshot((doc) => {
//     console.log("Current data: ", doc.data());
// });

//db.collection("guestbook_contents").doc("nickname")


/* 방명록 날짜순으로 정렬 */
const doc_sort = collection(db, "guestbook_contents"); //doc에 방명록 컬렉션 데이터 저장
const sortedComments = query(doc_sort, orderBy("now_date", "desc")); //날짜 내림차순 정렬

/* 날짜순 정렬된 방명록 데이터 가져와서 append */
let docs = await getDocs(sortedComments);

docs.forEach((doc) => {
    let row = doc.data();
    let nickname = row['nickname'];
    let datelist = row['datelist'];
    let content = row['content'];
    let pw = row['pw'];

    /* 연월일, 시간 구분표시 */
    let y_m_d = datelist.slice(0, 3).join('-'); // ex) 2023-12-12
    let h_m = datelist.slice(3, 5).join(':'); // ex) 13:22

    let temp_html = `
            <div class="recorded-comments-box">
                <div class="userinfo">
                    <div class="name">${nickname}</div>
                    <div class="date">${y_m_d + ' ' + h_m}</div>
                </div>
                <textarea class="comments-area" readonly>${content}</textarea>
                <input class="docId" type="hidden" value="${doc.id}">
                <div class="delete">
                    <input class="pw-check" type="password" placeholder="비밀번호"></input>
                    <button type="button" class="deletebtn">삭제</button>
                    <button type="button" class="modifyBtn">수정</button>
                    <button type="button" class="confirmBtn">수정완료</button>
                    <button type="button" class="cancelBtn">수정취소</button>
                </div>
            </div>
            `;
    $('#recorded-comments').append(temp_html);
});

let prevData = ''; //수정 전 데이터

// 방명록 수정
$('.modifyBtn').on('click', async function (e) {
    const target = e.target;
    const parent = target.parentElement.parentElement;
    prevData = parent.querySelector('.comments-area').value;
    target.style.display = "none";
    parent.querySelector('.comments-area').removeAttribute("readonly");
    parent.querySelector('.comments-area').focus();
    parent.querySelector('.cancelBtn').style.display = "inline-block";
    parent.querySelector('.confirmBtn').style.display = "inline-block";

});

//방명록 수정완료
$('.confirmBtn').on('click', async function (e) {
    const target = e.target;
    const parent = target.parentElement.parentElement;
    const password = parent.querySelector('.pw-check').value;
    const id = parent.querySelector('.docId').value;
    const contents = parent.querySelector('.comments-area').value;
    const docRef = doc(db, "guestbook_contents", id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    //내용 변경사항 유무 체크
    if (prevData === contents) {
        alert('변경 사항이 없습니다. 수정 후 완료를 눌러주세요.');
        parent.querySelector('.comments-area').focus();
        return;
    }
    //비밀번호 입력 유무 체크
    if (!password) {
        alert('비밀번호를 입력해주세요.');
        parent.querySelector('.pw-check').focus();
        return;
    }
    //비밀번호 검증
    if (password != data.pw) {
        alert('비밀번호가 다릅니다. 비밀번호 확인 후 다시 입력해주세요.');
        parent.querySelector('.pw-check').focus();
        return;
    }

    await updateDoc(doc(db, "guestbook_contents", id), {
        content: contents
    });

    alert('수정이 완료되었습니다.');
    window.location.reload();
});

//방명록 수정 취소
$('.cancelBtn').on('click', function (e) {
    const target = e.target;
    const parent = target.parentElement.parentElement;
    parent.querySelector('.comments-area').value = prevData;
    prevData = '';
    target.style.display = "none";
    parent.querySelector('.confirmBtn').style.display = "none";
    parent.querySelector('.comments-area').setAttribute('readonly', true);
    parent.querySelector('.pw-check').value = '';
    parent.querySelector('.modifyBtn').style.display = "inline-block";
});

// 방명록 삭제
$('.deletebtn').on('click', async function (e) {
    const target = e.target;
    const parent = target.closest('.recorded-comments-box');
    const password = $(parent).find('.pw-check').val();
    const id = $(parent).find('.docId').val();
    const docRef = doc(db, "guestbook_contents", id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    // 비밀번호 입력 유무 체크
    if (!password) {
        alert('비밀번호를 입력해주세요.');
        return;
    }
    // 비밀번호 검증
    if (password != data.pw) {
        alert('비밀번호가 다릅니다. 비밀번호 확인 후 다시 입력해주세요.');
        return;
    }

    // 비밀번호가 맞으면 삭제
    await deleteDoc(docRef);

    alert('댓글이 삭제되었습니다.');
    window.location.reload();
});



// 프로필카드 블로그 타입 alert 띄우기
$('.velog').click(async function () {
    alert('📘 저는 velog를 사용합니다. 📘');
})

$('.tistory').click(async function () {
    alert('📙 저는 tistory를 사용합니다. 📙');
})
