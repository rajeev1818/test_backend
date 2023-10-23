const router = require("express").Router();

const {getRepositoryList, getDependencies} = require("../controllers/parse");

router.get("/repo", getRepositoryList);
router.get("/dependencies", getDependencies);

module.exports = router;