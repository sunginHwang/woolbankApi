# woolbankApi
woolBank api server for koa


# 운영환경 가이드
운영환경에서는 forever가 global 설치 되어야 함.
> npm install -global forever

# 프로젝트 기동

## local 환경 설정 가이드
cookie 공유를 위해 `https` 설정이 필요합니다. (사용포트 8000, 4000)

1. `localhost` 와 `bank-api-local.woolta.com` 의 도메인 vhost를 세팅합니다.
2. 프로덕트 최상위 경로로 이동 합니다.
3. 아래의 명령어를 실행하여 https 와 http 의 세팅을 진행합니다.

> npx local-ssl-proxy --key cert/bank-api-local.woolta.com-key.pem --cert cert/bank-api-local.woolta.com --source 8000 --target 400

4. 이후 `npm run dev` 스크립트를 통해 local 프로덕트를 기동합니다.


## production 
> 운영환경 에서는 npm run start:fovever &
