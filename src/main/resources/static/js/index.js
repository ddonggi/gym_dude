window.onload = () => {
    console.log('index.js')


    async function postData(url, data = {},csrf_header,csrf_token) {
        // 옵션 기본 값은 *로 강조
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE 등
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
/*            beforeSend : function(xhr){/!*데이터를 전송하기 전에 헤더에 csrf값을 설정한다*!/
                xhr.setRequestHeader(csrf_header, csrf_token);
            },*/
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
    let setOptionEvent = (optionButton,optionMenu)=>{
        optionButton.addEventListener('click',(e)=>{
            e.preventDefault();
            optionButton.classList.toggle("rotate90");
            optionMenu.classList.toggle("option-toggle");
        })
    }

    let csrf_header = document.querySelector("meta[name='_csrf_header']").getAttribute("content");
    let csrf_token = document.querySelector("meta[name='_csrf']").getAttribute("content");
    console.log('header:',csrf_header)
    console.log('token:',csrf_token)

    document.querySelectorAll(".feed").forEach((feed)=>{
        if(feed.querySelector(".option-button")) {
            let optionButton = feed.querySelector(".option-button");
            let optionMenu = feed.querySelector(".option-menu");
            setOptionEvent(optionButton,optionMenu);
        }
        let id = feed.id;
        if(feed.querySelector(".delete-button")) {
            let deleteButton = feed.querySelector(".delete-button");
            console.log('게시물 id:', id);
            setDeleteEvent(deleteButton,id,feed);
        }
    })

    /*...높이 설정*/
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
