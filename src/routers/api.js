const express = require ('express');
const router = express.Router();

router.get ("/product/:id", controller.product);
router.post ("/checkout", controller.checkout);

module.exports = router;