const express = require ('express');
const router = express.Router();

const apiController = require("../controllers/apiController");

router.get ("/product/:id", apiController.product);
router.post ("/checkout", apiController.checkout);

module.exports = router;