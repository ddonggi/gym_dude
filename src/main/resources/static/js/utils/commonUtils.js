/* 비동기 통신에 쓰일 보안용 CSRF 정보 */
let csrf_header = document.querySelector("meta[name='_csrf_header']").getAttribute("content");
let csrf_token = document.querySelector("meta[name='_csrf']").getAttribute("content");
// console.log('header:',csrf_header)
// console.log('token:',csrf_token)

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
/* 비동기통신을 위한 fetch API */
let getData = async (url, page_, csrf_header, csrf_token) => {
    // 옵션 기본 값은 *로 강조
    const response = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE 등
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            header: csrf_header,
            'X-CSRF-Token': csrf_token,
            page: page_
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
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
            console.log('follow button:', feed.querySelector(".follow-button").value)
        })
    }
}

/** 피드의 '...' 줄임말 높이 설정*/
let setFeedContentHeight = () => {
    if (document.querySelectorAll(".feed-body")) {
        document.querySelectorAll(".feed-body").forEach((feedBody) => {
            if (feedBody.querySelector(".feed-content").offsetHeight < 120) {
                feedBody.querySelector(".more-btn").style.display = "none";
            }
        })
    }
}

let setCommentToggleEvent = (feed) => {
    let answerContainer = feed.querySelector(".answer-container");
    if (feed.querySelector(".answer-count")) {
        feed.querySelector(".answer-count").addEventListener('click', () => {
            answerContainer.classList.toggle("hide");
        })
    } else {
        answerContainer.classList.remove("hide");
    }
}

let setLikeToggleEvent = (feed) => {
    let likeButton = feed.querySelector(".like");
    likeButton.addEventListener('click', () => {
        likeButton.classList.toggle("like-text-color");
        likeButton.querySelectorAll(".like-img").forEach(button => {
            button.classList.toggle("hide");
        })
    })
}

let page = 0;
const ioCallback = (entries, io) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // if (entry.isIntersecting) {
        console.log('is observed!!!')
        io.unobserve(entry.target);//옵저빙했던 아이템 해제
        // postData("/question",{page:page}).then(response=>{
        getData("question?page=" + (++page)).then(response => {
            console.log("target page:", page)
            console.log('response:', response)
            renderFeedList(response);
            // 마지막 페이지가 아닐때만
            console.log('콘텐츠 길이:', response.content.length)
            if (response.content.length === 10)
                observeLastItem(io, document.querySelectorAll('.feed'));

            setFeedEvent();
            setFeedContentHeight();
        });
        // }
    });
};

let renderFeedList = (response) => {
    //피드 불러오기
    let feedContainer = document.querySelector(".feed-container");
    let feedList = response.content;
    feedList.forEach((feed) => {
        let author = feed.author;
        console.log('author.userName:', author.userName)
        let fileList = feed.fileList;
        let answerList = feed.answerList;
        feedContainer.innerHTML +=
            `<div class="feed" id="${feed.id}">
    <!--피드 헤더-->
    <div class="feed-header padding-default">
        <div class="flex gap-half" aria-label="${author.userName}의 프로필">
            <a class="feed-profile-image" href='/user/feed/${author.id}'>
                <img alt="피드프로필" class="img object-cover border-full" src="http://localhost:8080/resource/apps/defaultProfile.png">
            </a>
            <div>
                <div class="feed-writer text-sm font-bold">${author.userName}</div>
                <div class="feed-tag text-xs">${author.category}</div>
                <!-- 날짜 객체를 날짜 포맷에 맞게 변환 -->
                <div class="feed-timestamps text-xs">${feed.createDate}</div>
            </div>
        </div>
    </div>
    <!--피드 헤더-->
            
    <!--피드 바디-->
    <div class="feed-body padding-default flex-column gap-half">
        <!--피드 글 출력-->
        <div class="feed-content">${feed.content}</div>
        <input type="checkbox" class="more-btn">
    </div>
    <!--피드 바디-->
    
    <!--피드 푸터-->
    <!--피드 푸터-->
    <!--댓글-->
    <!--댓글-->
</div>`;

        let currentFeed = document.querySelector(".feed:last-child");
        //프로필
        if (author.hasProfile === true) {
            console.log(author.hasProfile)
            console.log('has profile')
            console.log('current feed:', currentFeed)
            currentFeed.querySelector(".feed-profile-image").innerHTML = `<img alt="피드프로필" class="img object-cover border-full" src="http://localhost:8080/resource/userProfiles/${author.id}.png">`;
        }

        // 더보기 | 팔로우
        if (siteUser === author.userName) {
            currentFeed.querySelector(".feed-header").innerHTML += `
                        <div class="option-menu">
                            <button class="modify-button">수정</button>
                            <button class="delete-button">삭제</button>
                            <button class="edit-save-button hide">저장</button>
                            <button class="edit-cancel-button hide">취소</button>
                        </div>
                        <button class="option-button flex justify-content-center align-center">
                            ⁝
                        </button>`;
        } else if (siteUser === 'anonymousUser') {

        } else {
            currentFeed.querySelector(".feed-header").innerHTML += `
                        <button class="follow-button" value="${author.id}">팔로우</button>`;
        }

        //피드 미디어 출력
        if (fileList.length > 0) {
            let feedBody = currentFeed.querySelector(".feed-body");
            // const fragment = document.createDocumentFragment();

            let carouselMain = document.createElement('div');
            carouselMain.classList.add("carousel-main");
            let carouselWrapper = document.createElement('div');
            carouselWrapper.classList.add("flex","carousel-wrapper");

            fileList.forEach(file=> {
                let date = new Date(file.createDate);
                let formatDate = getFormatDate(date);
                if (file.fileType === "image") {
                    console.log('fileType is image')

                    carouselWrapper.innerHTML+=`
                        <div class="carousel-slide">
                            <img
                                src="http://localhost:8080/resource/${formatDate}/${file.saveName}"
                                alt="${file.originalName}"/>
                        </div>`;
                } else if (file.fileType === "video") {
                    console.log('filetype video')
                    carouselWrapper.innerHTML+=`
                        <div class="carousel-slide">
                            <video
                                th:src="http://localhost:8080/resource/${formatDate}/${file.saveName}"
                                th:alt="${file.originalName}" controls></video>
                        </div>`;
                }
/*
                let originHTML = `<div th:if="${question.fileList.size>0}" class="carousel-main">
                    <!--피드 영상 출력 -->
                    <div class="flex carousel-wrapper">
                        <!--캐러셀 미디어 삽입-->
                        <div th:if="${file.getFileType()=='image'}" th:each="file,loop : ${question.fileList}"
                             class="carousel-slide">
                            <img
                                th:src="|http://localhost:8080/resource/${#temporals.format(file.createDate,'yyMMdd')}/${file.saveName}|"
                                th:alt="${file.originalName}"/>
                        </div>
                        <div th:if="${file.getFileType()=='video'}" th:each="file,loop : ${question.fileList}"
                             class="carousel-slide">
                            <video
                                th:src="|http://localhost:8080/resource/${#temporals.format(file.createDate,'yyMMdd')}/${file.saveName}|"
                                th:alt="${file.originalName}" controls></video>
                        </div>
                    </div>
                    <!--캐러셀 사이드 버튼 : 미디어 사이즈가 2 이상일 경우만-->
                    <div th:if="${question.fileList.size>1}" class="carousel-button-container">
                        <button type="button" class="carousel-prev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 class="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                                <path fill-rule="evenodd"
                                      d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                            </svg>
                        </button>
                        <button type="button" class="carousel-next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                 class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                                <path fill-rule="evenodd"
                                      d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- 캐러셀 중앙 버튼 -->
                <div th:if="${question.fileList.size>1}" class="carousel-pagination">
                    <div th:each="file,loop : ${question.fileList}" class="carousel-circle"></div>
                </div>
                `;
                */

            })
            carouselMain.appendChild(carouselWrapper);
            feedBody.appendChild(carouselMain);
        }

        //댓글 출력
        if (answerList.length > 0) {

        }
    })
}

const observeLastItem = (io, items) => {
    const lastItem = items[items.length - 4]; //관찰 대상
    io.observe(lastItem); // 관찰 대상 등록
};

// 관찰자 초기화
const io = new IntersectionObserver(ioCallback, {threshold: 0.7});

let setFeedEvent = () => {
    if (document.querySelectorAll(".feed")) {
        document.querySelectorAll(".feed").forEach((feed) => {
            /* 본인 게시물 : 옵션 토글, 게시물 수정,삭제 이벤트 등록 */
            if (feed.querySelector(".option-button")) {
                setOptionToggleEvent(feed);
                setModifyFormEvent(feed);
                setModifyCancelEvent(feed);
                setModifySaveEvent(feed);
                setDeleteEvent(feed);
            }
            setFollowEvent(feed);
            setCarouselEvent(feed);
            setLikeToggleEvent(feed);
            setCommentToggleEvent(feed);
        })
    }
}

let getFormatDate = (date)=> {
    let year = date.getFullYear().toString();
    console.log('year',year)
    let formatYear = year.substring(2,4);
    console.log('format year:',formatYear)
    //2번 포맷
    return formatYear +
        ((date.getMonth() + 1) < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
        ((date.getDate()) < 9 ? "0" + (date.getDate()) : (date.getDate()));
}

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
    setFeedContentHeight,
    setCommentToggleEvent,
    setLikeToggleEvent,
    io,
    setFeedEvent,
    observeLastItem
};
