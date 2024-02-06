window.onload = () => {
    console.log('index.js')
    let deleteQuestion = async(questionId) =>{
        const response = await fetch("/delete/"+questionId);
        const jsonData = await response.json();
        console.log('jsondata:',jsonData);
    }

    // console.log('page test');
// let size = [[${paging.size}]];
    console.log('size of page:', size);
    console.log('total pages:', totalPages);
    console.log('total elements:', totalElements);
    console.log('page number:', number);
    console.log('page has pre:', hasPrevious);
    console.log('page has next:', hasNext);
// let paging = "[[${paging}]]";
//     console.log('paging:', paging);
    document.querySelectorAll(".option-button").forEach(optionButton=> {
        optionButton.addEventListener('click', () => {
            optionButton.classList.toggle("rotate90");
            optionButton.previousElementSibling.classList.toggle("option-toggle");
            optionButton.parentElement.querySelector(".delete-button").addEventListener('click',()=>{
                if(confirm("정말 삭제 하시겠습니까? 삭제 후엔 되돌릴 수 없습니다")) {
                    console.log("예 눌렀슴더");
                    let id=optionButton.parentElement.id;
                    console.log(optionButton.parentElement.id);
                    deleteQuestion(id).then(data=>console.log('data:',data));
                    // alert("삭제 완료");
                }
                // }else{
                    // alert("제출실패");
                // }
            })
        })
    })

    document.querySelectorAll(".feed-body").forEach((feedBody)=>{
        console.log('feedContent.offsetHeight:',feedBody.querySelector(".feed-content").offsetHeight);

        if(feedBody.querySelector(".feed-content").offsetHeight<96){
            feedBody.querySelector(".more-btn").style.display="none";
        }
    })
}
/*
document.querySelector(".signup").addEventListener('click',()=>{
    location.href="/signup";
})
document.querySelector(".board").addEventListener('click',()=>{
    location.href="/question/list";
})
*/
