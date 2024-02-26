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
    else if(resultDate<0) {
        if(formatter.format(resultDate,'day')==='어제'){
         return formatter.format(resultDate,'day')+' '+String.fromCodePoint(0x1F195);//new
        }
        return formatter.format(resultDate,'day');
    }
    else if(resultHours<0) return formatter.format(resultHours,'hour')+String.fromCodePoint(0x1F195);//new
    // else if(resultMinutes<0) return '&#x1F195;'+formatter.format(resultMinutes,'minute');
    else if(resultMinutes<0) return formatter.format(resultMinutes,'minute')+' '+String.fromCodePoint(0x1F195);//new
    else return formatter.format(resultSeconds,'second')+' '+String.fromCodePoint(0x1F195);//new
}
// U+1F525 fileU+1F195
//String.fromCodePoint(0x1F525)//fire
//String.fromCodePoint(0x1F195)//new

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

// let getFollowingList = ()=>{
//     if(principalEmail !== 'anonymousUser'){
//         console.log('--------my site id:-----',siteUser.id)
//         postData('/following/list?id='+siteUser.id,null,csrf_header,csrf_token).then(response=>{
//             console.log('my following list',response.followingList);
//             return response.followingList;
//         })
//     }
// }
// let followList = getFollowingList();

/* 게시물 삭제 이벤트 등록 */
let setDeleteEvent = (feed) => {
    let id = feed.id;
    let deleteButton = feed.querySelector(".delete-button");
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("정말 삭제 하시겠습니까? 삭제 후엔 되돌릴 수 없습니다")) {
            // console.log("예 삭제 눌렀슴더");
            // deleteQuestion(id).then(data=>console.log('data:',data));
            let url = "/delete/question/" + id;
            console.log('url:', url)

            let data = {"{request": "delete}"};
            postData(url, data, csrf_header, csrf_token).then((data) => {
                console.log('res data', data);
                location.reload();
                // feed.remove();
                // location.href="/";
            })
                // .then(()=>alert('삭제되었습니다'));
        }
    })
}

let setDeleteCommentEvent = (feed) =>{
    if(feed.querySelector(".answer-list")){
        feed.querySelectorAll('.answer').forEach((comment)=>{
            let commentId = comment.id;
            if(comment.querySelector(".comment-delete-button")) {
                comment.querySelector(".comment-delete-button").addEventListener('click', () => {
                    console.log('commentId:', commentId)
                    commentId=commentId.replace("comment","")
                    if (confirm("정말 삭제 하시겠습니까? 삭제 후엔 되돌릴 수 없습니다")) {
                        postData('/answer/delete/' + commentId,null,csrf_header,csrf_token).then(response => {
                            if(response.message){
                                // alert('삭제가 완료되었습니다')
                                feed.querySelector(".answer-list").removeChild(comment);
                            }
                        })
                    }
                })
            }
        })
    }
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
        //저장, 취소버튼 생성
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
    element.addEventListener('input', inputDebounce(() => saveInput(element)))
}

function inputDebounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}
function clickDebounce(func, timeout = 200) {
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
        // submitButton.classList.remove("disabled");
        // submitButton.removeAttribute('disabled');
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

        //모바일 터치 슬라이드 이벤트
        if(window.innerWidth<=768){

            let carouselWrapper = feed.querySelector(".carousel-wrapper");
            let carouselSlide = feed.querySelector(".carousel-slide");
            let itemCount = feed.querySelectorAll('.carousel-slide').length;
            console.log('itemCount.',itemCount)

            console.log('모바일 입니다.')
            console.log('carouselWrapper:',carouselWrapper)
            console.log('carouselSlide:',carouselSlide)

            let curPos = 0;
            let postion = 0;
            let start_x, end_x;
            // const IMAGE_WIDTH = 375;
            const IMAGE_WIDTH = carouselSlide.clientWidth;
            console.log('wrapper WIDTH:',carouselWrapper.clientWidth)
            console.log('IMAGE_WIDTH:',IMAGE_WIDTH)

            function prev(){
                if(curPos > 0){
                    postion += IMAGE_WIDTH;
                    carouselWrapper.style.transform = `translateX(${postion}px)`;
                    curPos = curPos - 1;

                    bullets.forEach((bullet, index) => {
                        if (index === curPos) {
                            bullet.classList.add('active');
                        } else {
                            bullet.classList.remove('active');
                        }
                    });
                }
            }
            function next(){
                if(curPos < itemCount-1){
                    postion -= IMAGE_WIDTH;
                    carouselWrapper.style.transform = `translateX(${postion}px)`;
                    curPos = curPos + 1;


                    bullets.forEach((bullet, index) => {
                        if (index === curPos) {
                            bullet.classList.add('active');
                        } else {
                            bullet.classList.remove('active');
                        }
                    });
                }
            }

            function touch_start(event) {
                start_x = event.touches[0].pageX
                console.log('start_x',start_x)
            }

            function touch_end(event) {
                end_x = event.changedTouches[0].pageX;
                console.log('start_x',start_x)

                if(start_x > end_x){
                    next();
                }else{
                    prev();
                }
            }
            carouselWrapper.addEventListener('touchstart',touch_start)
            carouselWrapper.addEventListener('touchend',touch_end)

        }
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
            // console.log('follow button:', feed.querySelector(".follow-button").value)
            // console.log('followingId:',followButton.value)
            let followId = followButton.value;
            postData('/follow?followingId='+followId,null,csrf_header,csrf_token).then(response=> {
                console.log('follow response:', response)
                if(response.follow===true) { //팔로우 된 상황
                    //팔로우취소 버튼 삽입
                    followButton.innerText='팔로우 취소';
                } else {//팔로우 취소된 상황
                    //팔로우 버튼 삽입
                    followButton.innerText='팔로우';
                }
            })
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

let likeClickEvent = (feed,likeContainer,e) =>{
    console.log('좋아요 클릭.')
    e.preventDefault()
    // likeButton.querySelectorAll(".like-img").forEach(button => {
    console.log('like feed id',feed.id);
    postData('/like/'+feed.id).then((response)=>{
        console.log('like res:',response)
        if(response.like){ //누른 상태면
            likeContainer.querySelector(".like-img").setAttribute('src','/resource/apps/heart.png');
        }else{
            likeContainer.querySelector(".like-img").setAttribute('src','/resource/apps/heartBorder.png');
        }
        likeContainer.querySelector(".like-button").classList.toggle("like-text-color");
        likeContainer.querySelector(".like-button").innerText=`${response.likeCount}`;
    })
    // button.classList.toggle("hide");
    // })
}
let loginAlert = () => {
    alert('로그인 후 이용해 주세요')
}
let setLikeToggleEvent = (feed) => {
    let likeContainer = feed.querySelector(".like");
    if(principalEmail!=='anonymousUser'){ // 로그인한 유저 일 경우
        console.log('likeContainer:',likeContainer);
        likeContainer.addEventListener('click', clickDebounce((e) => likeClickEvent(feed,likeContainer,e)));
    }else{
        likeContainer.addEventListener('click',loginAlert)
    }
}



// 메인화면 피드 리스트
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
        let likeList = feed.likes;
        console.log('likeList:',likeList)
        let createDate = getRelativeDate(feed.createDate);
        if(likeList.length>2) createDate+=String.fromCodePoint(0x1F525);
        let category = author.category;
        if(category===null)category='';
        feedContainer.innerHTML +=
            `<div class="feed" id="${feed.id}">
                <!--피드 헤더-->
                <div class="">-------------------------------</div>
                <div class="feed-header padding-default">
                    <div class="flex gap-half" aria-label="${author.userName}의 프로필">
                        <a class="feed-profile-image" href='/user/profile/${author.id}'>
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
        console.log('접속한사람 : ',principalEmail,'/ 글 작성자 : ',author.email)
        // if (principalEmail === author.email) { //현재 접속한 사람의 닉네임과, 글 작성자의 닉네임이 동일할 경우
        if (principalEmail!=='anonymousUser'&&(siteUser.id === author.id)) { //현재 접속한 사람의 닉네임과, 글 작성자의 닉네임이 동일할 경우
            currentFeed.querySelector(".feed-header").innerHTML += `<div class="option-container flex align-center">
                        <div class="option-menu">
                            <button class="modify-button">수정</button>
                            <button class="delete-button">삭제</button>
                            <button class="edit-save-button hide">저장</button>
                            <button class="edit-cancel-button hide">취소</button>
                        </div>
                        <button class="option-button flex justify-content-center align-center">
                            ⁝
                        </button></div>`;
        } else if (principalEmail === 'anonymousUser') {

        } else {
            currentFeed.querySelector(".feed-header").innerHTML += `
                        <button class="follow-button" value="${author.id}">팔로우</button>`;
        }
        let feedBody = currentFeed.querySelector(".feed-body");

        //피드 미디어 출력
        if (fileList.length > 0) {
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
/*                    carouselWrapper.innerHTML += `
                        <div class="carousel-slide">
                            <video
                                src="${siteURL}/resource/${formatDate}/${file.saveName}"
                                alt="${file.originalName}" controls></video>
                        </div>`;*/
                    carouselWrapper.innerHTML +=`<div class="carousel-slide">
                                <video controls>
                                <source src="${siteURL}/resource/${formatDate}/${file.saveName}" type="video/mpeg">
                                <source src="${siteURL}/resource/${formatDate}/${file.saveName}" type="video/ogg">
                                <source src="${siteURL}/resource/${formatDate}/${file.saveName}" type="video/webm">
                                ${file.originalName}
                            </video></div>`;
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
        feedBody.innerHTML+=`<div class="feed-content">${feed.content}</div>`;
        feedBody.innerHTML+=`<input type="checkbox" class="more-btn">`;
        //피드 푸터 출력(좋아요, 댓글)

        let isLike=false;
        //유저
        if (likeList.length > 0) {
            if(principalEmail !== 'anonymousUser') {//로그인 한 사람
                // console.log("----------you are not anonymous")
                for(let i=0; i<likeList.length; i++) {
                    // console.log('like user id:', likeList[i].author.id, '/user id:', siteUser.id)
                    if(likeList[i].author.id===siteUser.id){
                        // console.log('당신이 좋아요 눌렀네요');
                        isLike=true;
                        break;
                    }
                }
            }
        }
        if(isLike===true){ //좋아요 누른 상태
            // currentFeed.querySelector(".like").innerHTML=`<img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
            //                 <div class="like-button">${likeList.length}</div>`;
            currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
                            <img class="like-img" src="${siteURL}/resource/apps/heart.png" alt="좋아요이미지"/>
                            <div class="like-button like-text-color">${likeList.length}</div>
                        </div>
                    </div>`;

        }else{
            //기본상태
            currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
                            <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
                            <div class="like-button">${likeList.length}</div>
                        </div>
                    </div>`;
        }
        if (answerList.length > 0) {
            let feedFooter = currentFeed.querySelector(".feed-footer");
            feedFooter.innerHTML += `
                            <span class="answer-count flex align-center">
                    <img class="chat-img" src="${siteURL}/resource/apps/chat.png" alt="채팅이미지"/>
                댓글 <strong>${answerList.length}</strong>
                </span>`;
        }

        //-----------------------------
        //댓글 영역
        currentFeed.innerHTML += `<div class="answer-container hide"></div>`;
        // currentFeed.innerHTML += `<div class="answer-container"></div>`;
        // console.log('answer conatainer?:',currentFeed.querySelector(".answer-container"));
        let answerContainer = currentFeed.querySelector(".answer-container");


        //댓글 출력
        if (answerList.length > 0) {
            answerContainer.innerHTML += `<div class="answer-list"></div>`;
            let answerListContainer = answerContainer.querySelector(".answer-list");
            answerList.forEach((answer) => {
                let answerAuthor = answer.author;
                let answerId = answer.id;
                console.log('answer id:',answerId)
                let answerCreateDate = getRelativeDate(answer.createDate);

                //수정기능은 보류 삭제만
/*                if (answer.modifiedDate !== null) {
                    console.log('answer modified date:',answer.modifiedDate);
                    answerCreateDate = getRelativeDate(answer.modifiedDate)+' ';
                    currentFeed.querySelector(".answer-header div:last-child").innerHTML = `<div class="feed-timestamps text-xs">${answer.modifiedDate} (수정됨)</div>`;
                }*/

                let defaultProfileElem = `<img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource/apps/defaultProfile.png">`;
                if (answerAuthor.hasProfile) {
                    console.log('이 유저는 프로필이 있습니다')
                    defaultProfileElem = `<img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource/userProfiles/${answerAuthor.id}.png">`;
                }
                let defaultOptionButton = `<div></div>`;

                if(siteUser) {
                    if (siteUser.id === answerAuthor.id) { //현재 접속한 사람의 닉네임과, 글 작성자의 닉네임이 동일할 경우
                        console.log('principalEmail === author.email:', siteUser.id === answerAuthor.id)
                        console.log('내가 작성한 댓글이에요!!')
                        defaultOptionButton = `<div class="option-container flex align-center ${answerAuthor.id}">
                        <div>
                            <button class="comment-delete-button ">삭제</button>
                        </div>
                        </div>`;
                    }
                }

                answerListContainer.innerHTML += `
                <div class="answer padding-half" id="comment${answerId}">
                    <div class="answer-profile-image ${answerAuthor.id}" onclick="location.href='/user/feed/${answerAuthor.id}'">
                        ${defaultProfileElem}
                    </div>
                    <div class="flex-column width100">
                        <div class="answer-header flex width100">
                            <div>
                                <div class="text-sm">${answerAuthor.userName}</div>
                                <div class="feed-timestamps text-xs">${answerCreateDate}</div>
                            </div>
                            <div>
                                ${defaultOptionButton}         
                            </div>
                        </div>
                        <div class="answer-body">
                            <div class="answer-content text-sm">${answer.content}</div>
                        </div>
                    </div>
                </div>
                `;

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
let page = 0;
let searchPage = 0;
const ioCallback = (entries, io) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // if (entry.isIntersecting) {
        console.log('is observed!!!')
        io.unobserve(entry.target);//옵저빙했던 아이템 해제
        // postData("/question",{page:page}).then(response=>{
        if(principalEmail==='anonymousUser'&&page>=1){ //
            let signInContainer = document.createElement("div");
            signInContainer.classList.add("signin-container","feed-width","flex","justify-content-center");
            signInContainer.innerHTML=`<div class="flex-column gap-rem"><h2>로그인 후 이용해 주세요</h2>
                <button onclick="location.href='/user/login'">로그인</button>
                <button onclick="location.href='/user/signup'">회원가입</button>
            </div>`
            document.querySelector(".index-container").append(signInContainer);
            setTimeout(()=>{signInContainer.classList.add("slide-up");},300)
        }else {
            let feedUrl = "feed?page=" + (++page)
            console.log('keyword length',keyword.length)
            if(keyword.length>=2){
                feedUrl = "search/feed?page=" + (++searchPage)+"&keyword="+keyword
            }
            console.log('feedUrl:',feedUrl)
            getData(feedUrl).then(response => {
                console.log("target page:", page)
                console.log('response:', response)
                renderFeedList(response);
                // 마지막 페이지가 아니면 계속 옵저빙
                console.log('콘텐츠 길이(피드갯수):', response.content.length)
                if (response.content.length === 10) {
                    observeLastItem(io, document.querySelectorAll('.feed'),"feed");
                    // setFeedEvent();
                }
                setFeedEventAfterRender(response.content.length)
                setFeedContentHeight();
            })
        }
    });
};
const userFeedIoCallback = (entries, io) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // if (entry.isIntersecting) {
        // console.log('is observed!!!')
        io.unobserve(entry.target);//옵저빙했던 아이템 해제
        // postData("/question",{page:page}).then(response=>{
        if(principalEmail==='anonymousUser'&&page>=1){ //
            let signInContainer = document.createElement("div");
            signInContainer.classList.add("signin-container","feed-width","flex","justify-content-center");
            signInContainer.innerHTML=`<div class="flex-column gap-rem">로그인 후 이용해 주세요<button onclick="location.href='/user/login'">로그인</button><button onclick="location.href='/user/signup'">회원가입</button></div>`
            document.querySelector(".my-feed-container").append(signInContainer);
            setTimeout(()=>{signInContainer.classList.add("slide-up");},300)
        }else {
            getData("/user/feed/list/"+feedUser.id+"?page=" + (++page)).then(response => {
                // console.log("target page:", page)
                // console.log('response:', response)
                renderUserFeedList(response);
                // 마지막 페이지가 아니면 계속 옵저빙
                // console.log('콘텐츠 길이(피드갯수):', response.content.length)
                if (response.content.length === 9)
                    observeLastItem(io, document.querySelectorAll('.my-feed'),"userFeed");

                setUserFeedEvent();
                // setFeedContentHeight();
            });
        }
    });
};
const observeLastItem = (io, items, type) => {
    console.log('feed type:',type)
    let observingMinLength = 10; //일반적인 피드는 10개 불러오기때문에
    if(type==="userFeed")//유저 피드는 9개
        observingMinLength=9
    if(items.length>=observingMinLength) {
        const lastItem = items[items.length - 4]; //관찰 대상
        if (items.length > 4) {
            io.observe(lastItem); // 관찰 대상 등록
        }
    }
};

// 관찰자 초기화
const io = new IntersectionObserver(ioCallback, {threshold: 0.7}); //인덱스페이지 피드 옵저버
const userFeedIo = new IntersectionObserver(userFeedIoCallback, {threshold: 0.7}); //유저 피드 옵저버

let setUserFeedEvent = () => {
    console.log('set feed event')
    if (document.querySelectorAll(".pseudo-container")) {
        console.log('pseudo-container is exist')
        document.querySelectorAll(".pseudo-container").forEach((feed) => {
            console.log('each element:',feed)
            // element.querySelector('click', (e) => {
            let userFeed;
            if(feed.querySelector(".my-feed")) {
                userFeed = feed.querySelector(".my-feed");
                userFeed.addEventListener('click', (e) => {
                    e.preventDefault()

                    let id = userFeed.id;
                    postData('/feed/'+id,null,csrf_header,csrf_token).then(response=>{
                        console.log('feed res:',response)
                        renderUserFeed(response.feed)
                    }).then(()=>{
                        //여백 부분 눌렀을때 창 꺼짐 이벤트
                        setCloseEvent();

                        feed = document.querySelector(".feed");

                        /* 본인 게시물 : 옵션 토글, 게시물 수정,삭제 이벤트 등록 */
                        if (document.querySelector(".option-button")) {
                            console.log('it is optionbutton')
                            setOptionToggleEvent(feed);
                            setModifyFormEvent(feed);
                            setModifyCancelEvent(feed);
                            setFeedModifySaveEvent(feed);
                            setDeleteEvent(feed);
                        }
                        followCheck(feed);
                        setFollowEvent(feed);
                        setCarouselEvent(feed);
                        setLikeToggleEvent(feed);
                        setFeedContentHeight();//피드의 '...' 줄임말 높이 설정
                        //댓글 영역
                        setCommentToggleEvent(feed);
                        setCommentEvent(feed);
                        setDeleteCommentEvent(feed); // 내가 쓴 댓글일 경우 삭제
                    })
                    // console.log('hi!!!!', id)


                })
            }
        })
    }
}

let setFeedEvent = () => {
    console.log('----------feed event 등록 -------------')
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
            followCheck(feed);
            setFollowEvent(feed);
            setCarouselEvent(feed);
            setLikeToggleEvent(feed);
            //댓글 영역
            setCommentToggleEvent(feed); //여러개일 경우 보기 접기
            setDeleteCommentEvent(feed); // 내가 쓴 댓글일 경우 삭제
            setCommentEvent(feed); //댓글 등록 이벤트
        })
    }
}

//io 콜백 이후 render 한 만큼만 이벤트 등록
let setFeedEventAfterRender = (feedLength) => {
    console.log('----------render after feed event 등록 -------------')
    console.log('받아온 피드 갯수:',feedLength)
    if (document.querySelectorAll(".feed")) {
        // console.log('총 피드 갯수:',document.querySelectorAll(`.feed:nth-last-child(-n+${feedLength})`).length)
        if(feedLength>0) {
            document.querySelectorAll(".feed").forEach((feed, index) => {
                // document.querySelectorAll(`.feed:nth-last-child(-n+${feedLength})`).forEach((feed,index) => {
                console.log('index:', index)
                /* 본인 게시물 : 옵션 토글, 게시물 수정,삭제 이벤트 등록 */
                if (feed.querySelector(".option-button")) {
                    setOptionToggleEvent(feed);
                    setModifyFormEvent(feed);
                    setModifyCancelEvent(feed);
                    setFeedModifySaveEvent(feed);
                    setDeleteEvent(feed);
                }
                followCheck(feed);
                setFollowEvent(feed);
                setCarouselEvent(feed);
                setLikeToggleEvent(feed);
                //댓글 영역
                setCommentToggleEvent(feed); //여러개일 경우 보기 접기
                setDeleteCommentEvent(feed); // 내가 쓴 댓글일 경우 삭제
                setCommentEvent(feed); //댓글 등록 이벤트
            })
        }
    }
}


let followCheck = (feed) => {
    if(feed.querySelector(".follow-button")) {
        let followButton = feed.querySelector(".follow-button");
        let followerId = feed.querySelector(".follow-button").value;
        // console.log(followingList)
        for(let i =0; i<followingList.length; i++) {
            // console.log('feeds follow id:',followerId,'/ my following user id:',followingList[i])
            if (Number(followerId) ===followingList[i]) {
                followButton.innerText = '팔로우 취소';
            }
        }
    }
}

let setCommentEvent = (currentFeed)=>{
    if(currentFeed.querySelector(".comment-submit-button")){
        let submitButton = currentFeed.querySelector(".comment-submit-button");
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            // console.log('comment-submit-button clicked')
            let url = `/answer/create/${currentFeed.id}`;
            let input = currentFeed.querySelector(".answer-input");
            // console.log('comment text:', input.value);
            if (input.value.length < 5) {
                alert("최소 5글자 이상으로 작성해 주세요");
            } else {
                let data = {"content": `${input.value}`};
                postData(url, data, csrf_header, csrf_token).then((resData) => {
                    // console.log('comment res data:', resData);
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
/*                    let responseComment=`<div class="answer padding-half">
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
                    </div>`;*/

                let responseComment=`<div class="answer padding-half" id="comment${resData.id}">
                    <div class="answer-profile-image ${author.id}" onclick="location.href='/user/feed/${author.id}'">
                            <img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource${profileImage}.png">
                    </div>
                    <div class="flex-column width100">
                        <div class="answer-header flex width100">
                            <div>
                                <div class="text-sm">${author.userName}</div>
                                <div class="feed-timestamps text-xs">${answerCreateDate}</div>
                            </div>
                            <div>
                                <div class="option-container flex align-center ${author.id}">
                        <div>
                            <button class="comment-delete-button ">삭제</button>
                        </div>
                        </div>
                            </div>
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

                }).then(()=>setDeleteCommentEvent(currentFeed))
            }
        })
    }
}

//YYmmdd
let getFormatDate = (date)=> {
    let year = date.getFullYear().toString();
    // console.log('year',year)
    let formatYear = year.substring(2,4);
    // console.log('format year:',formatYear)
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
            if(confirm("저장 하시겠습니까?")){
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
                })
                    // .then(()=>alert("정상적으로 제출되었습니다"))
                    .then(()=>location.reload())
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

let renderUserFeedList =(response) =>{
    let userFeedWrapper = document.querySelector(".my-feed-wrapper");
    let userFeedList = response.content;
    userFeedList.forEach((userFeed)=>{
        let fileList = userFeed.fileList;
        let answerList = userFeed.answerList;
        let feedId = userFeed.id;
        let content = userFeed.content;
        let createDate = userFeed.createDate;
        let isHide = userFeed.isHide;
        if(userFeed.modifiedDate!==null){
            createDate = userFeed.modifiedDate;
        };
        // console.log('author:',author)
        // console.log('fileList:',fileList)
        // console.log('answerList:',answerList)
        // console.log('feedId:',feedId)
        // console.log('content:',content)
        // console.log('createDate:',createDate)
        // console.log('isHide:',isHide)
        // console.log('before return')
        if(isHide){
            if(principalEmail==='anonymousUser')
                return
            if(siteUser.userName!==feedUser.userName)
                return;
        }
        // console.log('after return')
        let mediaWrapper;
        userFeedWrapper.innerHTML += `<div class="pseudo-container" >
                                            <div class='my-feed flex-column' id="${feedId}">
                                            </div>
                                    </div>`;
        if(fileList.length>0) {
            let firstFile = fileList[0];
            let fileCreateDate = firstFile.createDate;
            let filename = firstFile.saveName;
            let originName = firstFile.originalName;
            let date = new Date(fileCreateDate);
            let formatDate = getFormatDate(date);
            // console.log('formdate:',formatDate)
            if(firstFile.fileType==='image') {
                mediaWrapper = `<div class="my-feed-media-wrapper"><img src="/resource/${formatDate}/${filename}" alt="${originName}"/></div>`;
            }else {
                mediaWrapper = `<div class="my-feed-media-wrapper"><video src="/resource/${formatDate}/${filename}" alt="${originName}"></video></div>`;
            }
            document.querySelector(".pseudo-container:last-child").querySelector('.my-feed').innerHTML+=mediaWrapper;
            document.querySelector(".pseudo-container:last-child").querySelector('.my-feed').innerHTML+=`<div class="my-feed-content-wrapper">${content}</div>`;
        }else {
            document.querySelector(".pseudo-container:last-child").querySelector('.my-feed').innerHTML+=`<div class="my-feed-content-wrapper">${content}</div>`;
        }

    })
}

let renderUserFeed = (feed) => {
    let author = feedUser;
    console.log('author.userName:', author.userName)
    let fileList = feed.fileList;
    console.log('fileList:',feed.fileList)
    let answerList = feed.answerList;
    console.log('answerList:',feed.answerList)
    console.log('createDate:',feed.createDate)
    let createDate = getRelativeDate(feed.createDate);
    let category = author.category;
    let likeList = feed.likes;
    // let category = feedUser.category;
    console.log('feeduser category:',category)
    let feedContainer = document.querySelector(".feed-pop");
    if(category===null)category='';
    feedContainer.innerHTML =
        `<div class="feed feed-pop-style feed-width" id="${feed.id}">
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
<!--                    <div class="feed-content">${feed.content}</div>-->
<!--                    <input type="checkbox" class="more-btn">-->
                </div>
                <!--피드 바디-->
                
                <!--피드 푸터-->
                <!--피드 푸터-->
                <!--댓글-->
                <!--댓글-->
            </div>`;

    let currentFeed = document.querySelector(".feed:last-child");
    let feedBody = currentFeed.querySelector(".feed-body");
    //프로필
    if (author.hasProfile === true) {
        console.log(author.hasProfile)
        console.log('has profile')
        console.log('current feed:', currentFeed)
        currentFeed.querySelector(".feed-profile-image").innerHTML = `<img alt="피드프로필" class="img object-cover border-full" src="${siteURL}/resource/userProfiles/${author.id}.png">`;
    }

    // 더보기 | 팔로우
    else if (principalEmail === 'anonymousUser') {
    }
    // if (principalEmail === author.email) { //현재 접속한 사람의 이메일과 작성자의 이메일이 동일할경우
    else if (siteUser.id === author.id) { //현재 접속한 사람의 이메일과 작성자의 이메일이 동일할경우
        currentFeed.querySelector(".feed-header").innerHTML += `<div class="option-container flex align-center">
                        <div class="option-menu">
                            <button class="modify-button">수정</button>
                            <button class="delete-button">삭제</button>
                            <button class="edit-save-button hide">저장</button>
                            <button class="edit-cancel-button hide">취소</button>
                        </div>
                        <button class="option-button flex justify-content-center align-center">
                            ⁝
                        </button></div>
                    `;
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
/*                carouselWrapper.innerHTML += `
                        <div class="carousel-slide">
                            <video controls>
                                src="${siteURL}/resource/${formatDate}/${file.saveName}"
                                alt="${file.originalName}"
                            </video>
                        </div>`;*/
                carouselWrapper.innerHTML +=`<div class="carousel-slide">
                                <video controls>
                                <source src="${siteURL}/resource/${formatDate}/${file.saveName}" type="video/mpeg">
                                <source src="${siteURL}/resource/${formatDate}/${file.saveName}" type="video/ogg">
                                <source src="${siteURL}/resource/${formatDate}/${file.saveName}" type="video/webm">
                                ${file.originalName}
                            </video></div>`;
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
    feedBody.innerHTML+=`<div class="feed-content">${feed.content}</div>`;
    feedBody.innerHTML+=`<input type="checkbox" class="more-btn">`;
    //피드 푸터 출력(좋아요, 댓글)
/*    currentFeed.innerHTML += `
        <div class="feed-footer padding-half text-xs gap-half">
            <div class="like flex align-center">
                <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
                <img class="like-img hide" src="${siteURL}/resource/apps/heart.png" alt="좋아요이미지"/>
                좋아요 N
            </div>
        </div>`;*/

/*    if (likeList.length > 0) {
        likeList.forEach((like) => {
            if(principalEmail !== 'anonymousUser') {//로그인 한 사람
                if (like.author.id === siteUser.id) { // 유저가 좋아요 누른 상태
                    currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
<!--                            <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>-->
                            <img class="like-img hide" src="${siteURL}/resource/apps/heart.png" alt="좋아요이미지"/>
                            <div class="like-button like-text-color">${likeList.length}</div>
                        </div>
                    </div>`;
                } else { // 유저가 좋아요 안누른 상태
                    currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
                            <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
<!--                            <img class="like-img hide" src="${siteURL}/resource/apps/heart.png" alt="좋아요이미지"/>-->
                            <div class="like-button">${likeList.length}</div>
                        </div>
                    </div>`;
                }
            }
        })
    } else { //아무런 좋아요 없을때
        currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
                            <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
                            <div class="like-button">${likeList.length}</div>
                        </div>
                    </div>`;
    }*/

    let isLike=false;
    //유저
    if (likeList.length > 0) {
        if(principalEmail !== 'anonymousUser') {//로그인 한 사람
            console.log("----------you are not anonymous")
            for(let i=0; i<likeList.length; i++) {
                console.log('like user id:', likeList[i].author.id, '/user id:', siteUser.id)
                if(likeList[i].author.id===siteUser.id){
                    console.log('당신이 좋아요 눌렀네요');
                    isLike=true;
                    break;
                }
            }
        }
    }
    if(isLike===true){ //좋아요 누른 상태
        // currentFeed.querySelector(".like").innerHTML=`<img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
        //                 <div class="like-button">${likeList.length}</div>`;
        currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
                            <img class="like-img" src="${siteURL}/resource/apps/heart.png" alt="좋아요이미지"/>
                            <div class="like-button like-text-color">${likeList.length}</div>
                        </div>
                    </div>`;

    }else{
        //기본상태
        currentFeed.innerHTML += `
                    <div class="feed-footer padding-half text-xs gap-half">
                        <div class="like flex align-center">
                            <img class="like-img" src="${siteURL}/resource/apps/heartBorder.png" alt="좋아요이미지"/>
                            <div class="like-button">${likeList.length}</div>
                        </div>
                    </div>`;
    }

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
            let answerId = answer.id;
            console.log('answer id:',answerId)
            let defaultOptionButton = `<div></div>`;

            let defaultProfileElem = `<img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource/apps/defaultProfile.png">`;
            if (answerAuthor.hasProfile) {
                console.log('이 유저는 프로필이 있습니다')
                defaultProfileElem = `<img alt="댓글프로필" class="img object-cover border-full" src="${siteURL}/resource/userProfiles/${answerAuthor.id}.png">`;
            }

            if(principalEmail!=='anonymousUser') {
                if (siteUser.id === answerAuthor.id) { //현재 접속한 사람의 닉네임과, 글 작성자의 닉네임이 동일할 경우
                    console.log('principalEmail === author.email:', siteUser.id === answerAuthor.id)
                    console.log('내가 작성한 댓글이에요!!')
                    defaultOptionButton = `<div class="option-container flex align-center ${answerAuthor.id}">
                        <div>
                            <button class="comment-delete-button ">삭제</button>
                        </div>
                        </div>`;
                }
            }
            answerListContainer.innerHTML += `
                <div class="answer padding-half" id="comment${answerId}">
                    <div class="answer-profile-image ${answerAuthor.id}" onclick="location.href='/user/feed/${answerAuthor.id}'">
                        ${defaultProfileElem}
                    </div>
                    <div class="flex-column width100">
                        <div class="answer-header flex width100">
                            <div>
                                <div class="text-sm">${answerAuthor.userName}</div>
                                <div class="feed-timestamps text-xs">${answerCreateDate}</div>
                            </div>
                            <div>
                                ${defaultOptionButton}         
                            </div>
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
    if(!document.querySelector(".popped"))
        document.querySelector(".feed-pop").innerHTML+=`<div class="popped"></div>`;
}
let setCloseEvent = () => {
    let feedPop = document.querySelector(".popped");
    // feedPop.classList.add("");
    feedPop.addEventListener('click',()=>{
        console.log('clicked')
        // feedPop.classList.remove("popped");
        document.querySelector(".feed-pop").innerHTML=``;
        // document.querySelector(".my-feed-container").removeChild(document.querySelector(".popped"));
        setUserFeedEvent();
    })
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
    setProfileThumbnailEvent,
    userFeedIo,
    setUserFeedEvent,
    followCheck
};
