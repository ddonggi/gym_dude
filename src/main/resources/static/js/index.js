window.onload = () => {
    console.log('index.js')

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
    document.querySelector(".option-button").addEventListener('click',()=>{
        console.log('option-button click')
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
