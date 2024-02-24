import {
    setHeaderProfileEvent,
    setFeedContentHeight,
    setFeedEvent,
    setFeedSaveEvent,
    setFileThumbnailEvent,
    getRelativeDate, setTextChangeTrackingEvent, postData, csrf_header, csrf_token
} from './utils/commonUtils.js';

let feedList = document.querySelectorAll('.feed');
let questionInput = document.querySelector(".question-input");
setTextChangeTrackingEvent(questionInput);
let changeFirstPageDate = (feedList) => {
    feedList.forEach((feed) => {
        feed.querySelector(".feed-header").querySelectorAll(".feed-timestamps").forEach((date)=>{
            let targetDate = date.innerText;
            let likeButton = feed.querySelector(".like-button");
            // console.log('likeButton.value:::',likeButton.textContent)
            if(targetDate.indexOf("(수정됨)")>-1) {
                targetDate = targetDate.replaceAll(" (수정됨)", "");
                targetDate = getRelativeDate(targetDate)
                if(likeButton.textContent>2) targetDate+=String.fromCodePoint(0x1F525);
                date.innerText = targetDate+" (수정됨)";
            }else{
                targetDate = getRelativeDate(targetDate)
                if(likeButton.textContent>2) targetDate+=String.fromCodePoint(0x1F525);
                date.innerText = targetDate;
            }
        })
        feed.querySelector(".answer-list").querySelectorAll(".feed-timestamps").forEach((date)=>{
            let targetDate = date.innerText;
            // console.log('likeButton.value:::',likeButton.textContent)
            if(targetDate.indexOf("(수정됨)")>-1) {
                targetDate = targetDate.replaceAll(" (수정됨)", "");
                targetDate = getRelativeDate(targetDate)
                date.innerText = targetDate+" (수정됨)";
            }else{
                targetDate = getRelativeDate(targetDate)
                date.innerText = targetDate;
            }
        })
    })
}

let changeFirstPageLikeStatus = (pageContentList) => {
    pageContentList.forEach((content) => {
        let contentId = content.id;
        console.log('contentId:', contentId)
        let likeList = content.likes;
        console.log('likeList:', likeList)
        let isLike = false;
        if (likeList.length > 0 && principalEmail !== 'anonymousUser') {
            for (let i = 0; i < likeList.length; i++) {
                console.log('like user id:', likeList[i].author.id, '/user id:', siteUser.id)
                if (likeList[i].author.id === siteUser.id) {
                    console.log('당신이 좋아요 눌렀네요');
                    isLike = true;
                    break;
                }
            }
        }
        if (isLike === true) {
            document.getElementById(contentId).querySelector(".like-img").setAttribute('src', '/resource/apps/heart.png');
            document.getElementById(contentId).querySelector(".like-button").classList.add("like-text-color");
        }
    })
}

/*let setFirstPageFollowEvent = () =>{
    document.querySelectorAll('.follow-button').forEach((followButton)=>{
        followButton.addEventListener('click',()=>{
            console.log('followingId:',followButton.value)
            let data = {'followingId':followButton.value}
            postData('/follow',data,csrf_header,csrf_token).then(response=>{
                console.log('follow response:',response)
            })
        })
    })
}*/

// console.log('res fol:',followList)
changeFirstPageDate(feedList);
changeFirstPageLikeStatus(contentList);
// setFirstPageFollowEvent();
setHeaderProfileEvent();//로그인된 유저의 헤더 프로필 이미지에 토글 이벤트 등록
setFeedSaveEvent();//작성 폼 이벤트 등록
setFileThumbnailEvent();//파일 선택시 썸네일 미리보기 이벤트 등록
setFeedEvent();//피드에 이벤트 등록
setFeedContentHeight(); //피의 글자 줄임말 높이 설정

/*옵저빙 등록*/
// observeLastItem(io,feedList);

//피드의 '...' 줄임말 높이 설정
setFeedContentHeight();
