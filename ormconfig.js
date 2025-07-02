const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, `ormconfig.${env}.json`);

// 환경별 설정 파일이 존재하는지 확인
if (!fs.existsSync(configPath)) {
  console.error(`TypeORM config file not found: ${configPath}`);
  process.exit(1);
}

// 환경별 설정 파일 로드
const config = require(configPath);

module.exports = config; 