import {
    setTextChangeTrackingEvent,
    setAsyncNickNameCheckEvent, postData, csrf_header, csrf_token
}
    from './utils/commonUtils.js';


let nicknameInput = document.querySelector(".nickname-input");
let passwordInput = document.querySelector(".password-input");

setTextChangeTrackingEvent(nicknameInput);
setTextChangeTrackingEvent(passwordInput);
setAsyncNickNameCheckEvent(nicknameInput,false);

let emailRequest = () =>{
    document.querySelector(".email-request").addEventListener('click',()=>{
        let email_ = document.getElementById("email").value;
        console.log('email:',email_);
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

        if(email_.length<1){
            alert('이메일 형식을 지켜주세요')
            return
        }
        // console.log(regex.test(email_))
        if(!regex.test(email_)){
            alert('이메일 형식을 지켜주세요')
            return
        }
        document.body.style.cursor='wait';
        postData("/user/mail-request",{email:email_},csrf_header,csrf_token)
            .then(
            response => {
                console.log('response:',response)
                alert(response.message)
            }
        ).then(()=>document.body.style.cursor='default');
        console.log('바보')
    });
}
let emailVerification = () =>{
    document.querySelector(".email-verification").addEventListener('click',()=>{
        let email_ = document.getElementById("email").value;
        let code = document.getElementById("email-verification-input").value;

        console.log('code:',code);
        let regex = new RegExp('[0-9]');

        if(code.length<1){
            alert('코드를 입력해 주세요')
            return;
        }
        console.log(regex.test(code))
        if(!regex.test(code)){
            alert('코드는 숫자만 가능합니다')
            return
        }
        postData("/user/mail-verification",{email: email_,code:code}, csrf_header,csrf_token).then(
            response => {
                console.log('response:',response)
                alert(response.message)
                if(response.verification){
                    document.getElementById("email-verification-input").disabled=true;
                    document.getElementById("mail-checkbox").value="verificated";
                    document.getElementById("mail-checkbox").checked=true;
                }
            }
        )
    })
}
emailRequest()
emailVerification()

let allAgree = document.getElementById("all-agree");
let ageAgree = document.getElementById("age-over-14-agree")
let termsAgree = document.getElementById("terms-agree")
let policyAgree = document.getElementById("privacy-policy-agree")

let allCheckedEvent = () =>{
    allAgree.addEventListener('click',()=>{
        if(allAgree.checked===true){
            console.log('all checked')
            ageAgree.checked= true;
            termsAgree.checked=true;
            policyAgree.checked= true;
        } else{
            console.log('all uncheked')
            ageAgree.checked= false;
            termsAgree.checked=false;
            policyAgree.checked= false;
        }
    })
}
let submitButton = document.querySelector(".submit-button");
let checkBoxChangeEvent = ()=>{
    document.querySelectorAll(".custom-checkbox").forEach((checkbox)=>{
        checkbox.addEventListener('change',()=>{
            console.log('change ageAgree')
            if(ageAgree.checked=== true &&
                termsAgree.checked===true &&
                policyAgree.checked=== true){
                submitButton.disabled=false;
            }else{
                submitButton.disabled=true;
            }
    })
    })
    // termsAgree.addEventListener('change',()=>console.log('change termsAgree'))
    // policyAgree.addEventListener('change',()=>console.log('change policyAgree'))


}
allCheckedEvent()
checkBoxChangeEvent()

