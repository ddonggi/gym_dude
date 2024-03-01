// 1RM 계산 함수
import {setHeaderProfileEvent} from "./commonUtils.js";

let calculate1RM = (exercise, weight, reps) =>{
    let benchCoefficient = [1.000, 1.035, 1.08, 1.115, 1.15, 1.18, 1.22, 1.255, 1.29, 1.325];
    let squatCoefficient = [1.000, 1.0475, 1.13, 1.1575, 1.2, 1.242, 1.284, 1.326, 1.368, 1.41];
    let deadCoefficient = [1.000, 1.065, 1.13, 1.147, 1.164, 1.181, 1.198, 1.22, 1.232, 1.24];
    let coefficient;
    console.log('excercise:',exercise)
    switch (exercise) {
        case '벤치프레스':
            coefficient = benchCoefficient;
            break;
        case '스쿼트':
            coefficient = squatCoefficient;
            break;
        case '데드리프트':
            coefficient = deadCoefficient;
            break;
        default:
    }
    if (reps <= 10) {
        return (weight * coefficient[reps - 1]).toFixed(2);
    } else {
        return "10회 이하의 반복만 입력하세요.";
    }
}

let exercise;
let weight;
let reps=1;
let oneRM;
let result = document.getElementById('result')
let rms = document.querySelector(".rms");

// 각 RM에 대한 계수 정의
const coefficients =
/*    {
    1: 1,
    2: 1.06,
    3: 1.13,
    4: 1.18,
    5: 1.24,
    6: 1.30,
    7: 1.33,
    8: 1.36,
    9: 1.40,
    10: 1.43
}*/
{
    1: 1,
    2: 0.943,
    3: 0.906,
    4: 0.881,
    5: 0.856,
    6: 0.831,
    7: 0.807,
    8: 0.786,
    9: 0.76,
    10: 0.744
}
;

// 1RM부터 10RM까지를 계산하는 함수
let calculateRM = (oneRM, rm) =>{
    // return (oneRM / coefficients[rm]).toFixed(2);
    return (oneRM * coefficients[rm]).toFixed(2);
}

// 라디오 버튼을 클릭할 때 실행될 함수
function simulateChange() {
    // change 이벤트를 수동으로 생성하여 호출
    const event = new Event('change', {
        bubbles: true,
        cancelable: true,
    });
    this.dispatchEvent(event); // 라디오 버튼에 이벤트 전달
}
document.querySelectorAll(".workout-tab").forEach((tab)=>{
    tab.addEventListener('click',()=>{
        document.querySelectorAll(".workout-tab").forEach((tab)=>tab.style.background='white')
        // console.log('clicked!',tab)
        tab.querySelector("input[type=radio]").checked=true;
        // tab.querySelector("input[type=radio]").dispatchEvent(new Event('change'));

        // 라디오 버튼에 대해 change 이벤트를 수동으로 호출
        simulateChange.call(tab.querySelector("input[type=radio]"));
        tab.style.background='silver';
        // exercise = tab.querySelector("input[type=radio]").value;
        // console.log('excersice:',exercise)
    })
})

let interval = 200;
document.getElementById('1rmCalculator').addEventListener('change', (e) => {
    console.log('change!!')
    console.log('target', e.target.name)
    if (e.target.name === "workout") {
        exercise = e.target.value;
        console.log('exercise!!',exercise)
    } else if (e.target.name === "weight") {
        weight = e.target.value;
        console.log('weight!!',weight)

    } else if (e.target.name === "reps") {
        reps = e.target.value;
        console.log('reps!!',reps)

    }
    if (exercise.length > 0 && weight.length > 0 && reps > 0) {
        oneRM = calculate1RM(exercise,weight,reps);
    }
    rms.innerHTML='';
    if(oneRM>0) {
        let startValue = 0;

        // result.innerHTML = `<strong>${oneRM}</string>`;
        if(oneRM>=200) interval=100;
        let duration = Math.floor(interval/oneRM);
        let counter= setInterval(()=>{
            startValue+=1;
            result.textContent=startValue;
            if(startValue>=oneRM) {
                clearInterval(counter)
            }
        },duration)

        console.log('exercise:', exercise, '/ 1rm:', oneRM)
        // 예시: 1RM이 100kg일 때 각 RM 계산
        // let oneRM = 100; // 예시로 100kg의 1RM 사용
        // let docFragment = document.createDocumentFragment();

        for (let i = 1; i <= 10; i++) {
            let rmWeight = calculateRM(oneRM, i);
            // console.log(i + "RM: " + rmWeight + " kg");
            rms.innerHTML+=`<div>${i} RM: ${rmWeight} kg</div>`;
            // docFragment.append(`<div>${i} RM: ${rmWeight} kg</div>`)
        }

        // rms.append(docFragment);
    }
})

setHeaderProfileEvent();


// 예시: 1RM이 100kg일 때 각 RM 계산
// let oneRM = 100; // 예시로 100kg의 1RM 사용
/*
for (let i = 2; i <= 10; i++) {
    let rmWeight = calculateRM(oneRM, i);
    console.log(i + "RM: " + rmWeight + " kg");
}
*/
