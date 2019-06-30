const router = require("express").Router();
const devController = require("../controllers/developer");
router.post("/create", devController.registerDeveloper);
router.put("/:id", devController.updateDeveloper);
router.get("/:id", devController.getDeveloper);

module.exports = router;
