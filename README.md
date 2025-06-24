# woolbankApi
본 프로젝트는 woolbank 서비스의 Backend api 서버입니다. 프로젝트 세팅 구성은 ts + koa + typeorm 으로 구성되어있습니다.


## local 환경 설정 가이드

해당 서비스에서는 로그인 데이터에 대한 정보를 cookie를 사용하여 관리합니다.
때문에 로컬 환경에서도 cookie 공유를 위해 `https` 설정이 필요합니다. (사용포트 443, 4200)

### 패키지 설치
> npm install

### vhost 세팅
도메인 등록을 위해 `localhost` 와 `bank-api-local.woolta.com` 의 도메인 vhost를 세팅합니다.

### local-ssl-proxy 적용
로컬에서의 ssl 사용을 위해 `local-ssl-proxy` 을 적용합니다.

우선 아래와 같이 글로벌 설치를 진행합니다. (기호에 따라 설치안하고 npx로 처리해도 무방합니다.)
 > npm install -g local-ssl-proxy

이후 아래의 스크립트를 실행하여 FE local 4000번 포트를 ssl 8000포트에 할당처리 합니다.  
 > local-ssl-proxy --source 8000 --target 4000

### 프로젝트 기동

아래의 실행 명령을 통해 실행한 이후 `https://bank-api-local.woolta.com:8000` 링크를 통해 api를 호출하실 수 있습니다.

> npm run dev


## 운영환경 가이드
운영환경에서는 forever가 global 설치 되어야 합니다.
> npm install -global forever


### production 
> 운영환경 에서는 npm run start:fovever &
