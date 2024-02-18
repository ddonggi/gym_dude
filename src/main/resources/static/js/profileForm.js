import {setHeaderProfileEvent,setTextChangeTrackingEvent,setAsyncNickNameCheckEvent} from './utils/commonUtils.js';

setHeaderProfileEvent();

/** 텍스트 입력에 따른 글자 수 확인 및 화면에 뿌리는 이벤트 등록*/

let nicknameInput = document.querySelector(".nickname-input");
let introduceInput = document.querySelector(".my-profile-introduce-input");

setTextChangeTrackingEvent(nicknameInput);
setTextChangeTrackingEvent(introduceInput);
setAsyncNickNameCheckEvent(nicknameInput);
