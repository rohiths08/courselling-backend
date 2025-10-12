const JWT_userSECRET=process.env.JWT_userSECRET//jwt secret for user
const JWT_adminSECRET=process.env.JWT_adminSECRET//different jwt secret for admin

module.exports ={
    JWT_userSECRET,
    JWT_adminSECRET
}