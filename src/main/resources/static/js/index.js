import {
    setHeaderProfileEvent,
    setFeedContentHeight,
    setFeedEvent,
    io,
    observeLastItem,
    setFeedSaveEvent,
    setFileThumbnailEvent,
    getRelativeDate, setTextChangeTrackingEvent
} from './utils/commonUtils.js';

let feedList = document.querySelectorAll('.feed');
let questionInput = document.querySelector(".question-input");
setTextChangeTrackingEvent(questionInput);
let changeFirstPageDate = (feedList) =>{
    feedList.forEach((feed)=>{
        feed.querySelectorAll(".feed-timestamps").forEach((date)=>{
            let targetDate = date.innerText;
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
changeFirstPageDate(feedList);
setHeaderProfileEvent();//로그인된 유저의 헤더 프로필 이미지에 토글 이벤트 등록
setFeedSaveEvent();//작성 폼 이벤트 등록
setFileThumbnailEvent();//파일 선택시 썸네일 미리보기 이벤트 등록
setFeedEvent();//피드에 이벤트 등록
setFeedContentHeight(); //피의 글자 줄임말 높이 설정

/*옵저빙 등록*/
observeLastItem(io,feedList);

//피드의 '...' 줄임말 높이 설정
setFeedContentHeight();
