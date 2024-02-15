import {
    setDeleteEvent,
    setModifyFormEvent,
    setModifySaveEvent,
    setOptionToggleEvent,
    setModifyCancelEvent,
    setHeaderProfileEvent,
    setCarouselEvent,
    setFollowEvent,
    setFeedContentHeight,
    setCommentToggleEvent,
    setLikeToggleEvent,
    setFeedEvent,
    io,
    observeLastItem
} from './utils/commonUtils.js';

//로그인된 유저의 헤더 프로필 이미지에 토글 이벤트 등록
setHeaderProfileEvent();
setFeedEvent();
setFeedContentHeight();
/*옵저빙 등록*/
observeLastItem(io, document.querySelectorAll('.feed'));

//피드의 '...' 줄임말 높이 설정
setFeedContentHeight();
