/* 비동기통신을 위한 fetch API */
let postData = async (url, data = {}, csrf_header, csrf_token) => {
    // 옵션 기본 값은 *로 강조
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE 등
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            header: csrf_header,
            'X-CSRF-Token': csrf_token
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
    });
    return response.json(); // JSON 응답을 네이티브 JavaScript 객체로 파싱
}
/* 게시물 삭제 이벤트 등록 */
let setDeleteEvent = (feed) => {
    let id = feed.id;
    let deleteButton = feed.querySelector(".delete-button");
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("정말 삭제 하시겠습니까? 삭제 후엔 되돌릴 수 없습니다")) {
            console.log("예 삭제 눌렀슴더");
            // deleteQuestion(id).then(data=>console.log('data:',data));
            let url = "/delete/question/" + id;
            console.log('url:', url)

            let data = {"{request": "delete}"};
            postData(url, data, csrf_header, csrf_token).then((data) => {
                console.log('res data', data);
                location.reload();
                // feed.remove();
                // location.href="/";
            });
        }
    })
}

let setModifyFormEvent = (feed) => {
    let modifyButton = feed.querySelector(".modify-button");
    let content = feed.querySelector(".feed-content");
    // let optionMenu = feed.querySelector(".option-menu");
    /* 현재 피드를 수정을 위한 폼으로 바꾸기 */
    modifyButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("modify button click");
        let originText = content.innerText;
        // content.innerHtml="<input>'${content.innerText}'</input>";
        console.log('text:', content.innerText);
        content.innerHTML = `<textarea rows="5" class="question-input" minLength="8" maxLength="600" name="content">${content.innerText}</textarea>`;
        // content.innerText='떼잉';
        //수정버튼 숨김
        // modifyButton.classList.toggle("hide");
        feed.querySelector(".modify-button").classList.toggle("hide");
        //삭제버튼 숨김
        feed.querySelector(".delete-button").classList.toggle("hide");
        //저장, 취소버튼 생성 => todo : 토글
        //optionMenu.innerHTML += `<input type="submit" value="저장" class="edit-save-button"></input><a class="edit-cancel-button">취소</a>`;
        feed.querySelector(".edit-save-button").classList.toggle("hide");
        feed.querySelector(".edit-cancel-button").classList.toggle("hide");
        console.log('originText:', originText);
    })
}

let setModifySaveEvent = (feed) => {
    let id = feed.id;
    let url = `/modify/${id}`;
    let saveButton = feed.querySelector(".edit-save-button");
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        let input = feed.querySelector(".question-input");
        console.log('modified text:', input.value);
        let data = {"content": `${input.value}`};
        console.log('글자 수:', input.value.length);
        if (input.value.length < 5) {
            alert("최소 5글자 이상으로 작성해 주세요");
        } else {
            postData(url, data, csrf_header, csrf_token).then((resData) => {
                // let response = JSON.parse(resData)
                console.log('res data:', resData);
                console.log('res data:', resData.content);
                // console.log('res data:', resData);
                feed.querySelector(".feed-content").innerText = resData.content;
                feed.querySelector(".modify-button").classList.toggle("hide");
                feed.querySelector(".delete-button").classList.toggle("hide");
                feed.querySelector(".edit-save-button").classList.toggle("hide");
                feed.querySelector(".edit-cancel-button").classList.toggle("hide");
                feed.querySelector(".option-menu").classList.toggle("option-toggle");
                // location.reload();
                // feed.remove();
                // location.href="/";
            });
        }
    })
}
let setModifyCancelEvent = (feed) => {
    let optionMenu = feed.querySelector(".option-menu");
    let content = feed.querySelector(".feed-content");
    let originText = content.innerText;
    //아직 수정버튼 클릭하기 전엔 없음;
    let cancelButton = optionMenu.querySelector(".edit-cancel-button");

    cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            content.innerText = `${originText}`;
            //옵션버튼 토글
            feed.querySelector(".option-menu").classList.toggle("option-toggle");
            //수정버튼 나타냄
            feed.querySelector(".modify-button").classList.toggle("hide");
            //삭제버튼 나타냄
            feed.querySelector(".delete-button").classList.toggle("hide");
            //수정,삭제 이벤트 재등록
            // setModifyEvent(modifyButton,id,feed);
            // 저장,취소버튼 삭제 => 숨기기
            let saveButton = optionMenu.querySelector(".edit-save-button");
            // saveButton.remove();
            // cancelButton.remove();
            saveButton.classList.toggle("hide");
            cancelButton.classList.toggle("hide");
        }
    )
}
/* 게시물 옵션 버튼 토글 이벤트 (수정,삭제버튼 노출비노출 토글)*/
let setOptionToggleEvent = (feed) => {
    let optionButton = feed.querySelector(".option-button");
    let optionMenu = feed.querySelector(".option-menu");
    optionButton.addEventListener('click', (e) => {
        e.preventDefault();
        optionButton.classList.toggle("rotate90");
        //옵션메뉴 보이기,숨기기 -> 생성,삭제??
        optionMenu.classList.toggle("option-toggle");
    })
}

/*로그인된 유저의 헤더 프로필 이미지에 토글 이벤트 등록*/
let setHeaderProfileEvent = () => {
    if (document.querySelector(".my-menu-container")) {
        document.querySelector(".my-menu-container").addEventListener('click', () => {
            document.querySelector(".my-menu-wrapper").classList.toggle("hide");
        })

    }
}
/** 피드의 캐러셀에 슬라이드 이벤트를 등록하는 함수
* @param feed
* */
let setCarouselEvent = (feed) => {
    if (feed.querySelector(".carousel-main")) {
        let carouselMain = feed.querySelector(".carousel-main");
        carouselMain.style.maxHeight = `${carouselMain.clientWidth / 3 * 4}px`;

        let swiper = feed.querySelector('.carousel-wrapper');
        let prevButtons = feed.querySelectorAll('.carousel-prev');
        let nextButtons = feed.querySelectorAll('.carousel-next');
        let bullets = feed.querySelectorAll('.carousel-circle');
        let carousels = feed.querySelectorAll(".carousel-slide");
        let slideCount = carousels.length;
        // console.log(slideCount)
        let currentSlide = 0;

        let showSlide = (slideIndex) => {
            // swiper.style.transform = `translateX(-${slideIndex * 300}px)`;
            // console.log(swiper.clientWidth)
            swiper.style.transform = `translateX(-${slideIndex * swiper.clientWidth}px)`;
            currentSlide = slideIndex;
            // console.log('current:', currentSlide)
            bullets.forEach((bullet, index) => {
                if (index === currentSlide) {
                    bullet.classList.add('active');
                } else {
                    bullet.classList.remove('active');
                }
            });
        }

        carousels.forEach((carouselSlide) => {
            carouselSlide.style.maxHeight = `${carouselSlide.clientWidth / 3 * 4}px`;
        })

        prevButtons.forEach((prevButton) => {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentSlide > 0) {
                    showSlide(currentSlide - 1);
                }
            });
        });

        nextButtons.forEach((nextButton) => {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                // if (currentSlide < 3) {
                if (currentSlide < slideCount - 1) {
                    showSlide(currentSlide + 1);
                }
            });
        });

        bullets.forEach((bullet, index) => {
            bullet.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide(index);
            });
        });

        showSlide(0);
    }
}

/**
 * 피드의 사용자 팔로우 이베트 등록하는 함수
 * @param feed
 * 피드(게시물) 하나
 * */
let setFollowEvent = (feed) => {
    if (feed.querySelector(".follow-button")) {
        let followButton = feed.querySelector(".follow-button");
        followButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('follow button:',feed.id)
        })
    }
}

/** 피드의 '...' 줄임말 높이 설정*/
let setFeedContentHeight = () => {
    if (document.querySelectorAll(".feed-body")) {
        document.querySelectorAll(".feed-body").forEach((feedBody) => {
            if (feedBody.querySelector(".feed-content").offsetHeight < 96) {
                feedBody.querySelector(".more-btn").style.display = "none";
            }
        })
    }
}

/* 비동기 통신에 쓰일 보안용 CSRF 정보 */
let csrf_header = document.querySelector("meta[name='_csrf_header']").getAttribute("content");
let csrf_token = document.querySelector("meta[name='_csrf']").getAttribute("content");
// console.log('header:',csrf_header)
// console.log('token:',csrf_token)

export {
    postData,
    csrf_token,
    csrf_header,
    setDeleteEvent,
    setModifyFormEvent,
    setOptionToggleEvent,
    setModifyCancelEvent,
    setModifySaveEvent,
    setHeaderProfileEvent,
    setCarouselEvent,
    setFollowEvent,
    setFeedContentHeight
};