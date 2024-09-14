const { MomoPayment } = require('momo-payment-gateway');

/* HOST_WEBHOOK => Partner API. Used by MoMo to submit payment results by IPN method (server-to-server) method */
const HOST_WEBHOOK = process.env.HOST_WEBHOOK;

const partnerCode = process.env.PARTNERCODE;
const accessKey = process.env.ACCESSKEY;
const secretKey = process.env.SECRETKEY;
const apiEndpoint = process.env.APIENDPOINT;
console.log('partnerCode :>> ', partnerCode);
class MomoPaymentController {
    constructor(partnerCode, accessKey, secretKey, apiEndpoint) {
        this.momoPayment = new MomoPayment({
            partnerCode,
            accessKey,
            secretKey,
            apiEndpoint,
        });
    }

    async createPayment({
        partnerCode,
        orderId,
        amount,
        orderInfo,
        returnUrl
    }) {
        console.log(partnerCode,orderId, amount, orderInfo, returnUrl, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX1");
        try {
            console.log(orderId, amount, orderInfo, returnUrl, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX2");
            if (!orderId || !amount || !returnUrl || !orderInfo) {
                throw new Error('invalid input');
            }
            const result = await this.momoPayment.createPayment({
                partnerCode,
                requestId: `ID-${orderId}-${Math.round(Date.now() / 1000)}`,
                orderId: `${orderId}-${Math.round(Date.now() / 1000)}`,
                amount,
                orderInfo,
                returnUrl,
                ipnUrl: 'http://localhost:3000/',
            });
            return result;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    async refundPayment({ requestId, orderId, amount, transId }) {
        try {
            if (!orderId || !amount || !transId) {
                throw new Error('invalid input');
            }
            const result = await this.momoPayment.refundPayment({
                requestId,
                orderId,
                amount,
                transId,
            });
            return result.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    verifySignature({
        signature,
        requestId,
        orderId,
        amount,
        orderInfo,
        orderType,
        transId,
        message,
        localMessage,
        responseTime,
        errorCode,
        payType,
    }) {
        try {
            const result = this.momoPayment.verifySignature({
                signature,
                requestId,
                orderId,
                amount,
                orderInfo,
                orderType,
                transId,
                message,
                localMessage,
                responseTime,
                errorCode,
                payType,
            });
            return result;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}

module.exports = new MomoPaymentController(partnerCode, accessKey, secretKey, apiEndpoint);