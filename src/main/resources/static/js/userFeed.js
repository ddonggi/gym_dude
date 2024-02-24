import {userFeedIo, observeLastItem, setHeaderProfileEvent, setUserFeedEvent} from './utils/commonUtils.js';

setHeaderProfileEvent();
let userFeedList = document.querySelectorAll(".my-feed");
observeLastItem(userFeedIo,userFeedList,"userFeed");
setUserFeedEvent();


