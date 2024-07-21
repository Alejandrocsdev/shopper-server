const backUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.BACK_PROD_BASE_URL
    : process.env.BACK_DEV_BASE_URL

const frontUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONT_PROD_BASE_URL
    : process.env.FRONT_DEV_BASE_URL

module.exports = { backUrl, frontUrl }
