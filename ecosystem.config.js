
const ecosystem = process.env.ECOSYSTEM || 'prod'

/**
 * Process file
 * @description 파일 기준으로 환경 구성을 동적으로 로드합니다.
 *              추후 필요에 따라 일부 옵션을 동적으로 구성하기 위한 부분입니다.
 */
const processConfig = require(`./ecoConfig/process.${ecosystem}.config`)

/**
 * Module Exports
 */
module.exports = processConfig
