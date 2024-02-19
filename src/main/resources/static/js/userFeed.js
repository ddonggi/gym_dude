import {userFeedIo, observeLastItem, setHeaderProfileEvent, setUserFeedEvent} from './utils/commonUtils.js';

setHeaderProfileEvent();
let userFeedList = document.querySelectorAll(".my-feed");
setUserFeedEvent();
observeLastItem(userFeedIo,userFeedList);
