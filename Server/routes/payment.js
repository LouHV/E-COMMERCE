const express = require("express");
const router = express.Router();

const MomoPaymentController = require("../controllers/paymentController");
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/create-payment', [verifyAccessToken], MomoPaymentController.createPayment);
router.post('/create-payment-qrcode', [verifyAccessToken], MomoPaymentController.createPaymentQrCode);

// router.post('/create-payment', [verifyAccessToken], (req, res) => {
//     const { orderId, amount, orderInfo, returnUrl } = req.body; // Sửa các tham số ở đây
//     MomoPaymentController.createPayment({ orderId, amount, orderInfo, returnUrl })
//         .then(result => res.json(result))
//         .catch(error => res.status(500).json({ error: error.message }));
// });

// router.post('/refund-payment', [verifyAccessToken], (req, res) => {
//     const { requestId, orderId, amount, transId } = req.body; // Sửa các tham số ở đây
//     MomoPaymentController.refundPayment({ requestId, orderId, amount, transId })
//         .then(result => res.json(result))
//         .catch(error => res.status(500).json({ error: error.message }));
// });

// router.post('/verify-signature', [verifyAccessToken], (req, res) => { // Sửa tên route và phương thức ở đây
//     const { signature, requestId, orderId, amount, orderInfo, orderType, transId, message, localMessage, responseTime, errorCode, payType } = req.body;
//     MomoPaymentController.verifySignature({ signature, requestId, orderId, amount, orderInfo, orderType, transId, message, localMessage, responseTime, errorCode, payType })
//         .then(result => res.json(result))
//         .catch(error => res.status(500).json({ error: error.message }));
// });

module.exports = router