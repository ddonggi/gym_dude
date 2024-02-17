import {
    setHeaderProfileEvent,
    setFeedContentHeight,
    setFeedEvent,
    io,
    observeLastItem,
    setFeedSaveEvent,
    setFileThumbnailEvent
} from './utils/commonUtils.js';
/*import { format } from 'timeago.js';

console.log(format('2016-06-12','ko'));*/
//로그인된 유저의 헤더 프로필 이미지에 토글 이벤트 등록
setHeaderProfileEvent();
setFeedSaveEvent();//작성 폼 이벤트 등록
setFileThumbnailEvent();//파일 선택시 썸네일 미리보기 이벤트 등록
setFeedEvent();//피드에 이벤트 등록
setFeedContentHeight(); //피의 글자 줄임말 높이 설정

/*옵저빙 등록*/
observeLastItem(io, document.querySelectorAll('.feed'));

//피드의 '...' 줄임말 높이 설정
setFeedContentHeight();
