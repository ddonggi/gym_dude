import {
    setFollowEvent,
    setHeaderProfileEvent,
    followCheck,
    postData,
    csrf_header,
    csrf_token
} from './utils/commonUtils.js';

let profileBlock = document.querySelector(".my-profile-block");
setHeaderProfileEvent();
// document.querySelector()
setFollowEvent(profileBlock);
followCheck(profileBlock);

let accountQuitButton = document.querySelector(".account-quit-button");
accountQuitButton.addEventListener('click',()=>{
    let id = profileUser.id;
    if(confirm('탈퇴하시면 게시글도 없어집니다. 그래도 탈퇴하시겠습니까??')){
        postData('/user/account/quit/'+id,null,csrf_header,csrf_token).then(response=>{
            console.log('response.result:',response.result)
            console.log('response.message:',response.message)
            alert(response.message)
            if(response.result===true){
                location.href='/user/logout';
            }
        })
    }
})
