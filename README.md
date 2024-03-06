# Gym_dude (가제)

---

### 헬스인을 위한 SNS 커뮤니티

![gym_dude](https://github.com/ddonggi/gym_dude/assets/61221172/417bca29-d9a7-417a-a0ad-2ec02ba6d73d)


## [기술 스택]
- `Springboot` / `Spring Security` / `JPA` / `PostgreSQL`

- `Thymeleaf` / `Vanilla JS`

## [구현 완료]

- Sign-up / Sign-out / Login / Logout / 
Feed CRUD(with Multipart) / Comment / Like / Follow

- Search / Infinite Scrolling / relative Date /
async nickname check(with debounce) / image carousel

- Mobile view
  
[2024/ 02 / 24]
- Mail certification (w. redis)

[2024/ 02/ 25]
- Social(OAuth) Login (Google,Naver,KaKao)

[2024/ 02 /26]
- user quit logic / account delete
- File Upload size Limit

[2024/03/01]
- 1RM Calculator

### [구현예정]
- Chatting
- BookMark / Report / Barbell Path Tracking / Body Before After

### [+@구현 후보]

- Exercise Youtuber List(Rank) / Push / Meetup(partner workout) / Mention

### 고도화를 위한 여정
- 서버 부하 테스트
> 수많은 요청 처리 / 동시성 처리 : 현실에서 실제로 있을 수 있는 문제 상황을 가정하고 기술적으로 해결해 나가보기

- CI/CD
> Jenkins, Kubernates, Docker 등 오케스트레이션 툴로 CI/DC 파이프라인 구성해보기


- MSA
> Spring cloud로 게이트웨이 서비스와 라우팅기능을 구축하고, 서비스기능 별로 분할 해보기
