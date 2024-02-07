window.onload = () => {
    /* 비동기 통신에 쓰일 보안용 CSRF 정보 */
    let csrf_header = document.querySelector("meta[name='_csrf_header']").getAttribute("content");
    let csrf_token = document.querySelector("meta[name='_csrf']").getAttribute("content");
    // console.log('header:',csrf_header)
    // console.log('token:',csrf_token)

    /* 비동기통신을 위한 fetch API */
    async function postData(url, data = {},csrf_header,csrf_token) {
        // 옵션 기본 값은 *로 강조
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE 등
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
                header:csrf_header,
                'X-CSRF-Token':csrf_token
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
        });
        return response.json(); // JSON 응답을 네이티브 JavaScript 객체로 파싱
    }

    /* 게시물 삭제 이벤트 등록 */
    let setDeleteEvent = (deleteButton,id,feed) =>{
        deleteButton.addEventListener('click',(e)=> {
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

    let setModifyEvent = (modifyButton,id,feed) =>{
        let content = feed.querySelector(".feed-content");
        let optionMenu = feed.querySelector(".option-menu");
        /* 현재 피드를 수정을 위한 폼으로 바꾸기 */
        modifyButton.addEventListener('click',()=> {
            console.log("modify button click")
            // content.innerHtml="<input>'${content.innerText}'</input>";
            content.innerHTML = `<textarea rows="5" class="question-input" minLength="5" maxLength="600" name="content">${content.innerText}</textarea>`;
            console.log('text:', content.innerText);
            // content.innerText='떼잉';
            //수정버튼 숨김
            modifyButton.classList.toggle("hide")
            //삭제버튼 숨김
            feed.querySelector(".delete-button").classList.toggle("hide");
            //저장버튼 생성
            //취소버튼 생성
            optionMenu.innerHTML += `<input type="submit" value="저장"></input><button class="edit-cancel-button">취소</button>`;

        })
    }

    /* 게시물 옵션 버튼 토글 이벤트 (수정,삭제버튼 노출비노출 토글)*/
    let setOptionEvent = (optionButton, optionMenu) => {
        optionButton.addEventListener('click',(e)=>{
            e.preventDefault();
            optionButton.classList.toggle("rotate90");
            //옵션메뉴 보이기,숨기기 -> 생성,삭제??
            optionMenu.classList.toggle("option-toggle");
        })
    }

    /* 피드(게시물)에 이벤트 등록 */
    document.querySelectorAll(".feed").forEach((feed)=>{
        let id = feed.id;
        /* 본인 게시물 : 게시물 수정,삭제 이벤트 등록 */
        if(feed.querySelector(".option-button")) {
            let optionButton = feed.querySelector(".option-button");
            let optionMenu = feed.querySelector(".option-menu");
            let deleteButton = feed.querySelector(".delete-button");
            let modifyButton =feed.querySelector(".modify-button");
            setOptionEvent(optionButton,optionMenu);
            setModifyEvent(modifyButton,id,feed);
            setDeleteEvent(deleteButton,id,feed);
            // console.log('게시물 id:', id);
        }
        /* 타인 게시물 : 팔로우 이벤트 등록*/
        if(feed.querySelector(".follow-button")){

        }
    })

    /* ...높이 설정*/
    document.querySelectorAll(".feed-body").forEach((feedBody)=>{
        if(feedBody.querySelector(".feed-content").offsetHeight<96){
            feedBody.querySelector(".more-btn").style.display="none";
        }
    })
}

// console.log('page test');
// let size = [[${paging.size}]];
//     console.log('size of page:', size);
//     console.log('total pages:', totalPages);
//     console.log('total elements:', totalElements);
//     console.log('page number:', number);
//     console.log('page has pre:', hasPrevious);
//     console.log('page has next:', hasNext);
// let paging = "[[${paging}]]";
//     console.log('paging:', paging);

    /** @deprecated */
    let deleteQuestion = async(questionId) =>{
        const response = await fetch("/delete/"+questionId);
        const jsonData = await response.json();
        console.log('jsondata:',jsonData);
    }
/*
document.querySelector(".signup").addEventListener('click',()=>{
    location.href="/signup";
})
document.querySelector(".board").addEventListener('click',()=>{
    location.href="/question/list";
})
*/
