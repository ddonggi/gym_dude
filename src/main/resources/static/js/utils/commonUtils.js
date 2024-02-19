/* 비동기 통신에 쓰일 보안용 CSRF 정보 */
let csrf_header = document.querySelector("meta[name='_csrf_header']").getAttribute("content");
let csrf_token = document.querySelector("meta[name='_csrf']").getAttribute("content");
let siteURL = "";
let formatter = new Intl.RelativeTimeFormat(navigator.geolocation,{numeric:'auto'});

let getRelativeDate = (originRawDate) => {
    let now = new Date();
    let originDate = new Date(originRawDate);
    let resultYear = originDate.getFullYear()-now.getFullYear();
    let resultMonth = originDate.getMonth()-now.getMonth();
    let resultDate = originDate.getDate()-now.getDate();
    let resultHours = originDate.getHours()-now.getHours();
    let resultMinutes = originDate.getMinutes()-now.getMinutes();
    let resultSeconds = originDate.getSeconds()-now.getSeconds();
    if(resultYear<0) return formatter.format(resultYear,'year');
    else if(resultMonth<0) return formatter.format(resultMonth,'month');
    else if(resultDate<0) return formatter.format(resultDate,'day');
    else if(resultHours<0) return formatter.format(resultHours,'hour');
    else if(resultMinutes<0) return formatter.format(resultMinutes,'minute');
    else return formatter.format(resultSeconds,'second');
}


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
let postFileData = async (url, data = {}, csrf_header, csrf_token) => {
    // 옵션 기본 값은 *로 강조
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE 등
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // "Content-Type": "multipart/form-data",
            header: csrf_header,
            'X-CSRF-Token': csrf_token
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: data // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
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

let setFeedModifySaveEvent = (feed) => {
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
                //수정된 내용 반영
                // let response = JSON.parse(resData)
                console.log('res data:', resData);
                console.log('res content:', resData.content);
                console.log('res date:', resData.modifiedDate);
                let modifiedDate = getRelativeDate(resData.modifiedDate);
                //날짜 변경
                // feed.
                feed.querySelector(".feed-timestamps").innerHTML = `${modifiedDate} (수정됨)`; //날짜 변경
                feed.querySelector(".feed-content").innerText = resData.content; //내용 변경
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
let setTextChangeTrackingEvent = (element) =>{
    let maxLength = element.maxLength;
    console.log('maxLength:',maxLength)
    let minLength = element.minLength;
    console.log('minLength:',minLength)
    element.parentElement.parentElement.querySelector(".text-limit-max").textContent='/'+maxLength;
    let currentContainer = element.parentElement.parentElement.querySelector(".text-limit-current");
    currentContainer.textContent = element.value.length;
    element.addEventListener('input',()=>{
        console.log('change textContent:',element.value.length)
        currentContainer.textContent = element.value.length;
        if(element.value.length>=maxLength)currentContainer.classList.add("text-warning")
        else if(element.value.length<minLength)currentContainer.classList.add("text-warning")
        else currentContainer.classList.remove("text-warning")
    })
}
let setAsyncNickNameCheckEvent = (element)=>{
    element.addEventListener('input', debounce(() => saveInput(element)))
}

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
let regex = /^[가-힣a-zA-Z0-9]*$/;
function saveInput(element) {
    // console.log('Saving data:',element);
    // element.value
    // console.log(inputText.indexOf(" "))
    let submitButton = document.querySelector(".submit-button");
    let inputText = element.value;
    if(!regex.test(inputText)){
        console.log('공백은 안되염')
        //저장 비활 //disable /pointer
        submitButton.setAttribute('disabled',true);
        submitButton.classList.add("disabled");
        element.nextElementSibling.classList.remove("text-good");
        element.nextElementSibling.textContent='사용할 수 없는 패턴 입니다';
    } else if(inputText.length<2){
        submitButton.setAttribute('disabled',true);
        submitButton.classList.add("disabled");
        element.nextElementSibling.classList.remove("text-good");
        element.nextElementSibling.textContent='닉네임은 최소 2글자 이상 필요합니다';
    }
    else{
        //저장버튼 활성
        // pointer
        submitButton.classList.remove("disabled");
        submitButton.removeAttribute('disabled');
        postData('/user/name/check',{username:inputText},csrf_header,csrf_token).then(response => {
            if(response.result==="positive") {
                element.nextElementSibling.classList.add("text-good");
            }else {
                element.nextElementSibling.classList.remove("text-good");
            }
            element.nextElementSibling.textContent=response.message;
        })
        //
    }
}
// const processChange = debounce((inputText) => saveInput(inputText));

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

/*로그인된 유저의 헤더 프로필 이미지에 옵션(내정보/내피드/로그아웃) 토글 이벤트 등록*/
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
    if(principalEmail!=='anonymousUser'){ // 로그인한 유저 일 경우
        likeButton.addEventListener('click', () => {
            likeButton.classList.toggle("like-text-color");
            likeButton.querySelectorAll(".like-img").forEach(button => {
                button.classList.toggle("hide");
            })
        })
    }else{
        likeButton.addEventListener('click', () => {
            alert('로그인 후 이용해 주세요')
        })
    }
}

let page = 0;
const ioCallback = (entries, io) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // if (entry.isIntersecting) {
        console.log('is observed!!!')
        io.unobserve(entry.target);//옵저빙했던 아이템 해제
        // postData("/question",{page:page}).then(response=>{
        if(principalEmail==='anonymousUser'&&page>=1){
            let signInContainer = document.createElement("div");
            signInContainer.classList.add("signin-container","feed-width","flex","justify-content-center");
            signInContainer.innerHTML=`<div class="flex-column">로그인 후 이용해 주세요<div onclick="location.href='/user/login'">로그인</div><div onclick="location.href='/user/signup'">회원가입</div></div>`
            document.querySelector(".index-container").append(signInContainer);
            setTimeout(()=>{signInContainer.classList.add("slide-up");},300)
        }else {
            getData("feed?page=" + (++page)).then(response => {
                console.log("target page:", page)
                console.log('response:', response)
                renderFeedList(response);
                // 마지막 페이지가 아니면 계속 옵저빙
                console.log('콘텐츠 길이(피드갯수):', response.content.length)
                if (response.content.length === 10)
                    observeLastItem(io, document.querySelectorAll('.feed'));

                setFeedEvent();
                setFeedContentHeight();
            });
        }
    });
};

let renderFeedList = (response) => {
    //피드 불러오기
    let feedContainer = document.querySelector(".feed-container");
    let feedList = response.content;
    console.log('feedlist length;',feedList.length);
    feedList.forEach((feed) => {
        let author = feed.author;
        console.log('author.userName:', author.userName)
        let fileList = feed.fileList;
        let answerList = feed.answerList;
        let createDate = getRelativeDate(feed.createDate);
        let category = author.category;
        if(category===null)category='';
        feedContainer.innerHTML +=
            `<div class="feed" id="${feed.id}">
                <!--피드 헤더-->
                <div class="feed-header padding-default">
                    <div class="flex gap-half" aria-label="${author.userName}의 프로필">
                        <a class="feed-profile-image" href='/user/feed/${author.id}'>
                            <img alt="피드프로필" class="img object-cover border-full" src="${siteURL}/resource/apps/defaultProfile.png">
                        </a>
                        <div>
                            <div class="feed-writer text-sm font-bold">${author.userName}</div>
                            <div class="feed-tag text-xs">${category}</div>
                            <!-- 날짜 객체를 날짜 포맷에 맞게 변환 -->
                            <div class="feed-timestamps text-xs">${createDate}</div>
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
            currentFeed.querySelector(".feed-profile-image").innerHTML = `<img alt="피드프로필" class="img object-cover border-full" src="${siteURL}/resource/userProfiles/${author.id}.png">`;
        }

        // 더보기 | 팔로우
        if (principalEmail === author.userName) { //현재 접속한 사람의 닉네임과, 글 작성자의 닉네임이 다를 경우
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
        } else if (principalEmail === 'anonymousUser') {

        } else {
            currentFeed.querySelector(".feed-header").innerHTML += `
                        <button class="follow-button" value="${author.id}">팔로우</button>`;
        }

        //피드 미디어 출력
        if (fileList.length > 0) {
            let feedBody = currentFeed.querySelector(".feed-body");
            // let fragment = document.createDocumentFragment();

            let carouselMain = document.createElement('div');
            carouselMain.classList.add("carousel-main");
            let carouselWrapper = document.createElement('div');
            carouselWrapper.classList.add("flex", "carousel-wrapper");
            // let carouselButtonContainer = document.createElement('div');
            // let carouselPagination = document.createElement('div');
            // carousel

            fileList.forEach(file => {
                let date = new Date(file.createDate);
                let formatDate = getFormatDate(date);
                if (file.fileType === "image") {
                    console.log('fileType is image')

                    carouselWrapper.innerHTML += `
                        <div class="carousel-slide">
                            <img
                                src="${siteURL}/resource/${formatDate}/${file.saveName}"
                                alt="${file.originalName}"/>
                        </div>`;
                } else if (file.fileType === "video") {
                    console.log('filetype video')
                    carouselWrapper.innerHTML += `
                        <div class="carousel-slide">
                            <video
                                th:src="${siteURL}/resource/${formatDate}/${file.saveName}"
                                th:alt="${file.originalName}" controls></video>
                        </div>`;
                }
            })
            carouselMain.appendChild(carouselWrapper);
            feedBody.appendChild(carouselMain);
            // carouselMain.appendChild(carouselButtonContainer);
            // feedBody.appendChild(carouselPagination);
            if (fileList.length > 1) {
                carouselMain.innerHTML +=
                    `<div class="carousel-button-container">
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
                </div>`;

                //캐러셀 중앙 버튼
                feedBody.innerHTML += `<div class="carousel-pagination"></div>`;
                let carouselCircle = currentFeed.querySelector(".carousel-pagination");
                fileList.forEach(() => {
                    carouselCircle.innerHTML += `
                    <div class="carousel-circle"></div>
                    `;
                })
            }
        }
        //피드 푸터 출력(좋아요, 댓글)
        currentFeed.innerHTML += `
        <div class="feed-footer padding-half text-xs gap-half">
            <div class="like flex align-center">
                <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
                <img class="like-img hide" src="${siteURL}/resource/apps/heart.png" alt="좋아요이미지"/>
                좋아요 N
            </div>
        </div>`;
        if (answerList.length > 0) {
            let feedFooter = currentFeed.querySelector(".feed-footer");
                feedFooter.innerHTML += `
                            <span class="answer-count flex align-center">
                    <img class="chat-img" src="${siteURL}/resource/apps/chat.png" alt="채팅이미지"/>
                댓글 <strong>${answerList.length}</strong>
                </span>`;
        }

        //댓글 영역
        currentFeed.innerHTML += `<div class="answer-container hide"></div>`;
        currentFeed.innerHTML += `<!--<div class="answer-container"></div>-->`;
        console.log('answer conatainer?:',currentFeed.querySelector(".answer-container"));
        let answerContainer = currentFeed.querySelector(".answer-container");


        //댓글 출력
        if (answerList.length > 0) {
            answerContainer.innerHTML += `<div class="answer-list"></div>`;
            let answerListContainer = answerContainer.querySelector(".answer-list");
            answerList.forEach((answer) => {
                let answerAuthor = answer.author;
                let answerCreateDate = getRelativeDate(answer.createDate);

                answerListContainer.innerHTML += `
                <div class="answer padding-half">
                    <div class="answer-profile-image" onclick="location.href='/user/feed/${answerAuthor.id}'">
                        <img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource/apps/defaultProfile.png">
                    </div>
                    <div>
                        <div class="answer-header">
                            <div class="text-sm">${answerAuthor.userName}</div>
                            <div class="feed-timestamps text-xs">${answerCreateDate}</div>
                        </div>
                        <div class="answer-body">
                            <div class="answer-content text-sm">${answer.content}</div>
                        </div>
                    </div>
                </div>
                `;
                if (answerAuthor.hasProfile) {
                    currentFeed.querySelector(".answer-profile-image").innerHTML = `<img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource/userProfiles/${answerAuthor.id}.png">`;
                }
                if (answer.modifiedDate !== null) {
                    console.log('answer modified date:',answer.modifiedDate);

                    currentFeed.querySelector(".answer-header div:last-child").innerHTML = `<div class="feed-timestamps text-xs">${answer.modifiedDate} (수정됨)</div>`;
                }
            })
        }
        //댓글 폼
        let profileImage ="";
        if (principalEmail === 'anonymousUser') { // 방문자
            profileImage="/apps/defaultProfile";
            answerContainer.innerHTML += `
            <div class="answer-form padding-default flex">
                <div class="answer-profile-image">
                    <img class="img object-cover border-full" alt="게스트댓글프로필" src="${siteURL}/resource${profileImage}.png">
                </div>
                <div class="flex-column width100 align-flex-end">
                    <textarea placeholder="로그인 후 작성해 주세요" disabled name="content" rows="3" class="answer-input" minlength="3" maxlength="600"></textarea>
                </div>
            </div>`;
        } else { //접속자
            // console.log('접속자 mail:',principalEmail)
            if(siteUser.hasProfile)
                profileImage="/userProfiles/"+siteUser.id; //프로필 있는사람
            else
                profileImage = "/apps/defaultProfile"; //없는사람

            answerContainer.innerHTML += `
            <div class="answer-form padding-default flex">
                <input type="hidden" name="${csrf_header}" value="${csrf_token}"/>
                <div class="answer-profile-image">
                    <img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource${profileImage}.png">
                </div>
                <div class="flex-column width100 align-flex-end">
                    <textarea placeholder="여러분의 생각을 적어주세요" name="content" rows="3" class="answer-input" minlength="3" maxlength="600"></textarea>
                    <input type="submit" class="padding-half comment-submit-button" value="등록"/>
                </div>
            </div>`;
        }
    })
}

const observeLastItem = (io, items) => {
    const lastItem = items[items.length - 5]; //관찰 대상
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
                setFeedModifySaveEvent(feed);
                setDeleteEvent(feed);
            }
            setFollowEvent(feed);
            setCarouselEvent(feed);
            setLikeToggleEvent(feed);
            setCommentToggleEvent(feed);
            setCommentEvent(feed);
        })
    }
}

let setCommentEvent = (currentFeed)=>{
    if(currentFeed.querySelector(".comment-submit-button")){
        let submitButton = currentFeed.querySelector(".comment-submit-button");
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('comment-submit-button clicked')
            let url = `/answer/create/${currentFeed.id}`;
            let input = currentFeed.querySelector(".answer-input");
            console.log('comment text:', input.value);
            if (input.value.length < 5) {
                alert("최소 5글자 이상으로 작성해 주세요");
            } else {
                let data = {"content": `${input.value}`};
                postData(url, data, csrf_header, csrf_token).then((resData) => {
                    console.log('comment res data:', resData);
                    input.value='';
                    let content=resData.content;
                    let author=resData.author;
                    let profileImage ="";
                    let answerCreateDate = getRelativeDate(resData.createDate);
                    if(author.hasProfile){ // 댓글 작성자 정보
                        profileImage="/userProfiles/"+author.id;
                    }else{
                        profileImage="/apps/defaultProfile";
                    }
                    let responseComment=`<div class="answer padding-half">
                        <div class="answer-profile-image" onclick="location.href='/user/feed/${author.id}'">
                            <img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource${profileImage}.png">
                        </div>
                        <div>
                            <div class="answer-header">
                                <div class="text-sm">${author.userName}</div>
                                <div class="feed-timestamps text-xs">${answerCreateDate}</div>
                            </div>
                            <div class="answer-body">
                                <div class="answer-content text-sm">${content}</div>
                            </div>
                        </div>
                    </div>`;

                        if(currentFeed.querySelector(".answer-list")){
                            currentFeed.querySelector(".answer-list").innerHTML+=responseComment;
                        }else{
                            currentFeed.querySelector(".answer-container").insertAdjacentHTML("afterbegin",`<div class="answer-list">${responseComment}</div>`);
                        }

                })
            }
        })
    }
}

let easyDate = (formatter) =>{
    console.log('');
}

//YYmmdd
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

let setFeedSaveEvent = ()=>{
    const form = document.querySelector('#feed-form');
    if(document.querySelector(".feed-save-button")) {
        // let saveButton = document.querySelector(".feed-save-button");
        form.addEventListener('submit', (e) => {
            console.log('save click')
            e.preventDefault();

            const form = e.currentTarget;
            const url = new URL(form.action);

            // console.log('target action:',form.action)
            // console.log('target method:',form.method)
            // console.log('target enctype:',form.enctype)

            let content = form.querySelector(".question-input").value;
            if(content.length<5){
                alert('최소5자 이상은 써주세요')
                return
            }
            if(confirm("제출하시겠습니까?")){
                console.log('content:',content)
                const formData = new FormData();
                if(document.querySelector("#files").files.length>0) {
                    let files = document.querySelector("#files").files;
                    for(let file of files) {
                        formData.append("files", file);
                    }
                }
                formData.append("content",new Blob([JSON.stringify({"content":content})],{type: "application/json"}));
                postFileData(url,formData,csrf_header,csrf_token).then((response)=>{
                    console.log('response:',response)
                }).then(()=>alert("정상적으로 제출되었습니다")).then(()=>location.reload())
            }
        })
    }
}
/** 내정보 이미지 썸네일 이벤트*/
let setProfileThumbnailEvent = ()=> {
    const fileInput = document.getElementById("file");
    const handleFile = () => {
        const fileReader = new FileReader();
        let file = fileInput.files;
        fileReader.readAsDataURL(file[0]);
        fileReader.onload = () => {
            document.querySelector("#profile-image").setAttribute('src',fileReader.result);
        }
    }
    if (fileInput) fileInput.addEventListener("change", handleFile);
}
/** 피드 파일 썸네일 이벤트*/
let setFileThumbnailEvent = () =>{
    const fileInput = document.getElementById("files");
    const handleFiles = (e) => {
        document.querySelector(".file-thumbnail-container").innerHTML='';
        const selectedFile = [...fileInput.files];
        // console.log('selectedFile',selectedFile)

        // fileReader.readAsDataURL(selectedFile[0]);
        //갯수 제한 5개
        console.log('파일 갯수:',selectedFile.length);
        if(selectedFile.length>5){
            alert('파일은 최대 5개 선택 가능합니다.');
            document.querySelector(".file-thumbnail-container").innerHTML='';
            return
        }
        // if(selectedFile.){
        //     alert('파일 용량은 최대 XXMB 까지 됩니다.');
        //     document.querySelector(".file-thumbnail-container").innerHTML='';
        // }
        //용량 제한 ( 총용량 or 개당 용량)
        selectedFile.forEach((file)=>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = ()=> {
                let fileThumbnails = document.querySelector(".file-thumbnail-container");
                if(file.type.indexOf('video')===0){
                    fileThumbnails.innerHTML += `
            <video class="file-thumbnail-image" alt="파일썸네일" src ='${fileReader.result}'/>
            `;
                }else {
                    fileThumbnails.innerHTML += `
            <img class="file-thumbnail-image" alt="파일썸네일" src ='${fileReader.result}'/>
            `;
                }
            };
        })
    };
    if(fileInput)fileInput.addEventListener("change", handleFiles);
}

export {
    postData,
    csrf_token,
    csrf_header,
    setDeleteEvent,
    setModifyFormEvent,
    setOptionToggleEvent,
    setModifyCancelEvent,
    setFeedModifySaveEvent,
    setHeaderProfileEvent,
    setCarouselEvent,
    setFollowEvent,
    setFeedContentHeight,
    setCommentToggleEvent,
    setLikeToggleEvent,
    io,
    setFeedEvent,
    observeLastItem,
    setFeedSaveEvent,
    setFileThumbnailEvent,
    getRelativeDate,
    setTextChangeTrackingEvent,
    setAsyncNickNameCheckEvent,
    setProfileThumbnailEvent
};
