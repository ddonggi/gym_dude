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
    io,
    observeLastItem
} from './utils/commonUtils.js';

//로그인된 유저의 헤더 프로필 이미지에 토글 이벤트 등록
setHeaderProfileEvent();

// 피드(게시물)에 이벤트 등록
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
/*옵저빙 등록*/
observeLastItem(io, document.querySelectorAll('.feed'));

//피드의 '...' 줄임말 높이 설정
setFeedContentHeight();
