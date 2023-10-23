const router = require("express").Router();
const {getAccessToken} = require("../controllers/auth");


router.get("/access_token", getAccessToken);

module.exports = router;