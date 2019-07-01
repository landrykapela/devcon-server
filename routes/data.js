const express = require("express");
const router = express.Router();

const dataController = require("../controllers/data");

router.get("/languages", dataController.getLanguages);
router.get("/frameworks", dataController.getFrameworks);
router.get("/skills", dataController.getSkills);
router.get("/professions", dataController.getProfessions);

module.exports = router;
