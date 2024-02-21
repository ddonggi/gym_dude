import {setFollowEvent, setHeaderProfileEvent,followCheck} from './utils/commonUtils.js';

let profileBlock = document.querySelector(".my-profile-block");
setHeaderProfileEvent();
// document.querySelector()
setFollowEvent(profileBlock);
followCheck(profileBlock);
