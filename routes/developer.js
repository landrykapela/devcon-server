const router = require("express").Router();
const devController = require("../controllers/developer");
router.post("/create", devController.registerDeveloper);
router.put("/:id", devController.updateDeveloper);
router.put("/:id/edit", devController.updateDeveloperItem);
router.get("/:id", devController.getDeveloper);
router.get("/", devController.getAll);

module.exports = router;
