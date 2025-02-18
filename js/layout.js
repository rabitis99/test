
//스크롤 기능 작업
function scrollPage(target) {
    let position = document.querySelector(target).offsetTop;
    window.scroll({
        top: position - 80,
        behavior: 'smooth'
    });
}
$("#close-btn").click(async function () {
    $("#modal-card").empty();
    $("#modal-cardwrap").hide();
    $("#modal-card").hide();
});



// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    FieldPath,
    documentId,
    getDocs,
    orderBy,
    where,
    collection,
    addDoc,
    query,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



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
//const db1 = firebase.firestore();


//프로필 카드 -각 카드의 더보기 버튼 클릭 시, 모달배경과 모달 열기
//멤버별 데이터 가져오기
//1.모달창을 보여주며(document.style.display = "block")
$(".cardBtn1").click(async function (event) {
    //event.currentTarget으로 클릭한 타겟을 인지 시켜주고
    //클릭해서 event.currentTarget에 들어온 dataset의 id값 가져오기
    $("#modal-card").empty();
    const cardId =
        event.currentTarget.getElementsByClassName("cardId")[0].dataset.id;

    // window.selectedId =
    document.getElementById("modal-cardwrap").style.display = "block";
    document.getElementById("modal-card").style.display = "block";

    //더보기 클릭 시, 파이어 베이스 데이터 가져오기
    //모달창-가져온 모달 컨텐츠들 담기
    //member 컬렉션 가져오기
    const memberColl = await getDocs(collection(db, "member"));
    //2.데이터를 가져오고========================================
    //가져온 member컬렉션- 문서 꺼내기
    const memberDocs = memberColl.docs;
    //문서를 하나씩 훑어보면서 안에 if문 조건에 해당하는 값 도출하기
    for (let i = 0; i < memberDocs.length; i++) {
        //문서들
        let modaldata =
            memberColl.docs[i]._document.data.value.mapValue.fields;

        //꺼낸 자료 console.log로 어떤 값이 들었는 지 파악하기
        const id = modaldata["id"].stringValue;
        const name = modaldata["name"].stringValue;
        const photo = modaldata["photo"].stringValue;
        const goodPoint1 = modaldata["goodPoint1"].stringValue;
        const goodPoint2 = modaldata["goodPoint2"].stringValue;
        const workStyle = modaldata["workStyle"].stringValue;
        const tmiPhoto1 = modaldata["tmiPhoto1"].stringValue;
        const tmiPhoto2 = modaldata["tmiPhoto2"].stringValue;
        const tmiText1 = modaldata["tmiText1"].stringValue;
        const tmiText2 = modaldata["tmiText2"].stringValue;

        let data_html = `
            <h3>${name}</h3>
            <!-- <div class="modal-idValue">id : ${id}</div> -->
            <!-- <div class="closebtn" id="close-btn">&times;</div> -->
            <button name="close" type="button" class="closebtn" id="close-btn">&times;</button>
  
            <div class="modal-profile">
              <!-- 모달창 - 프로필사진 -->
              <div class="modal-pic">
                <img
                  src="${photo}"
                />
              </div>
              <!-- 모달창 - 장점과 협업스타일 -->
              <div class="twopoint">
                <!-- 모달창 - 장점 -->
                <div class="good-point">
                  <h4>장점</h4>
                  <ul>
                    <li>${goodPoint1}</li>
                    <li>${goodPoint2}</li>
                  </ul>
                </div>
                <!-- 모달창 - 협업스타일 -->
                <div class="style-point">
                  <h4>협업스타일</h4>
                  <ul>
                    <li>${workStyle}</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- 모달창 - TMI -->
            <div class="tmi-info">
              <h4>TMI</h4>
              <div class="tmi-content">
                <div class="modal-tmiphoto">
                  <img
                    src="${tmiPhoto1}"
                    alt="tmi사진"
                  />
                </div>
                <div class="tmi-comment">
                  <ul>
                    <li>${tmiText1}</li>
                    <li>${tmiText2}</li>
                  </ul>
                </div>
              </div>
            </div>
          `;

        //3.클릭한 더보기의 카드 id와 데이터 id가 같으면========
        //4.모달창의 데이터를 붙여넣는다
        //id가 다르면 보여주지 말고 같으면 내용물으 보여줘.
        console.log({ i, cardId, id });
        if (id === cardId) {
            $("#modal-card").empty();
            $("#modal-card").append(data_html);
        } else {
            // return;
        }
    }
});

//모달 -닫기버튼 클릭 시, 모달 배경과 모달 닫기
$(document).on("click", "button[id='close-btn']", function () {
    document.getElementById("modal-cardwrap").style.display = "none";
    document.getElementById("modal-card").style.display = "none";
});
//모달 - 모달 배경 클릭 시, 모달 배경과 모달 닫기
$("#modal-cardwrap").click(async function () {
    // $("#modal-card").empty();
    document.getElementById("modal-cardwrap").style.display = "none";
    document.getElementById("modal-card").style.display = "none";
});

//모달 & 방명록 구분============================================

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
