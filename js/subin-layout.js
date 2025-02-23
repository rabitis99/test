function typeWriter(element, text, index = 0) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        setTimeout(() => typeWriter(element, text, index + 1), 100);
    } else {
        element.style.borderRight = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    //타이핑 애니메이션
    document.querySelectorAll(".typing").forEach((element, i) => {
        const text = element.getAttribute("data-text"); // 요소의 data-text 속성에서 텍스트 가져옴
        setTimeout(() => typeWriter(element, text), i * 1000); // 요소별로 딜레이 추가
    });

    const navItems = document.querySelectorAll(".nav-item");

    // 각 .nav-item에 클릭 이벤트 추가
    navItems.forEach(item => {
        item.addEventListener("click", function () {
            let target = this.getAttribute("data-target");
            if (target) {
                scrollMainContent(target);
            }
        });
    });

    // 스크롤 함수 정의
    function scrollMainContent(target) {
        let element = document.querySelector(target);
        let container = document.querySelector(".main-content");

        if (element && container) {
            container.scroll({
                top: element.offsetTop - 20,
                behavior: 'smooth'
            });
        } else {
            console.error("Element not found: " + target);
        }
    }

    //특정 영역에 진입 시, 요소 변경
    const box3 = document.getElementById("box3");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // box3가 화면에 보이면 변경
                $(".sidebar").css("background-color", "#ddd9ff");
                $(".sidebar").css("color", "#353535");
                $("#profile-pic").attr("src", "./images-subin/personalProfile-subin.jpg"); 
            } else {
                // box3에서 벗어나면 원래대로
                $(".sidebar").css("background-color","");
                $(".sidebar").css("color", "");
                $("#profile-pic").attr("src", "./images-subin/jobProfile-subin.jpg");
            }
        });
    }, { threshold: 0.3 });

    observer.observe(box3); 
});  

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

//Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCAQofITuhAwGWwEP4ktp40KleJ-FGUGNw",
    authDomain: "introduce-subin.firebaseapp.com",
    projectId: "introduce-subin",
    storageBucket: "introduce-subin.firebasestorage.app",
    messagingSenderId: "948716762421",
    appId: "1:948716762421:web:3e0d040dc852070a22c87c",
    measurementId: "G-3FPQJF8990"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//포트폴리오 내용 불러오기
$("#portfolio").empty();
const fetchPortfolio = async () => {
    const querySnapshot = await getDocs(collection(db, "portfolio"));
    querySnapshot.forEach(doc => {
        const data = doc.data();

        //timestamp로 저장된 날짜 데이터 가공
        let formattedDate = "날짜 없음";
        if (data.date && data.date.toDate) {
            const dateObj = data.date.toDate();
            formattedDate = dateObj.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit" });
        }

        // HTML 내용 설정
        let experienceHTML = `<li><p id="experience-date">${formattedDate}</p>${data.title}</li>`
        let innerHTML = `
          <div class="portfolio-box">
            <div id="portfolio-date">${formattedDate}</div><br>
            <div id="portfolio-title">${data.title}</div><br><hr><br>
            <div id="description">${data.description}</div><br>
            <div id="process">${data.process}</div><br>
            <div id="result">${data.result}</div><br>
          </div><br><br>
        `;

        //experience에 날짜와 타이틀만 추가
        $("#skills").append(experienceHTML);
        //포트폴리오 내용 추가
        $("#portfolio").append(innerHTML);
    });
};

fetchPortfolio();