const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');


const asyncHandler = require('express-async-handler');

const partnerCode = process.env.PARTNERCODE;
const accessKey = process.env.ACCESSKEY;
const secretKey = process.env.SECRETKEY;

const createPayment = asyncHandler(async (req, res) => {
    // const { _id } = req.user;
    const {
        requestId,
        orderId,
        requestType,
        notifyUrl,
        returnUrl,
        amount,
        orderInfo,
        extraData
    } = req.body;

    const variables = {
        requestId: requestId,
        orderId: orderId,
        requestType: requestType,
        notifyUrl: notifyUrl,
        returnUrl: returnUrl,
        amount: amount,
        orderInfo: orderInfo,
        extraData: extraData,
        partnerCode: partnerCode,
        accessKey: accessKey,
        secretKey: secretKey,
    };

    for (const [key, value] of Object.entries(variables)) {
        console.log(`${key}: ${value}`);
    }

    var signature = "accessKey=" + accessKey
        + "&amount=" + amount + "&extraData=" + extraData
        + "&ipnUrl=" + notifyUrl + "&orderId=" + orderId
        + "&orderInfo=" + orderInfo + "&partnerCode="
        + partnerCode + "&redirectUrl="
        + returnUrl + "&requestId=" + requestId
        + "&requestType=" + requestType;

    const hash = CryptoJS.HmacSHA256(signature, secretKey);
    signature = CryptoJS.enc.Hex.stringify(hash);

    const payload = {
        partnerCode,
        partnerName: "Test",
        storeId: partnerCode,
        requestType,
        ipnUrl: notifyUrl,
        redirectUrl: returnUrl,
        orderId,
        amount,
        lang: 'vi',
        orderInfo,
        requestId,
        extraData,
        signature,
    }

    const requestEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    try {
        const response = await fetch(requestEndpoint, fetchOptions);
        const jsonResponse = await response.json();

        console.log("jsonResponseXXXX:::", jsonResponse);

        return res.json({
            success: jsonResponse ? true : false,
            jsonResponse: jsonResponse ? jsonResponse : 'Something went wrong'
        })
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
})

const createPaymentQrCode = asyncHandler(async (req, res) => {
    // const { _id } = req.user;
    const {
        requestId,
        orderId,
        requestType,
        notifyUrl,
        returnUrl,
        amount,
        orderInfo,
        extraData
    } = req.body;

    const variables = {
        requestId: requestId,
        orderId: orderId,
        requestType: requestType,
        notifyUrl: notifyUrl,
        returnUrl: returnUrl,
        amount: amount,
        orderInfo: orderInfo,
        extraData: extraData,
        partnerCode: partnerCode,
        accessKey: accessKey,
        secretKey: secretKey,
    };

    for (const [key, value] of Object.entries(variables)) {
        console.log(`${key}: ${value}`);
    }

    var signature = "accessKey=" + accessKey
        + "&amount=" + amount + "&extraData=" + extraData
        + "&ipnUrl=" + notifyUrl + "&orderId=" + orderId
        + "&orderInfo=" + orderInfo + "&partnerCode="
        + partnerCode + "&redirectUrl="
        + returnUrl + "&requestId=" + requestId
        + "&requestType=" + requestType;

    const hash = CryptoJS.HmacSHA256(signature, secretKey);
    signature = CryptoJS.enc.Hex.stringify(hash);

    const payload = {
        partnerCode,
        partnerName: "Test",
        storeId: partnerCode,
        requestType,
        ipnUrl: notifyUrl,
        redirectUrl: returnUrl,
        orderId,
        amount,
        lang: 'vi',
        autoCapture: true,
        orderInfo,
        requestId,
        extraData,
        signature,
    }

    const requestEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    try {
        const response = await fetch(requestEndpoint, fetchOptions);
        const jsonResponse = await response.json();

        console.log("jsonResponseXXXX:::", jsonResponse);

        return res.json({
            success: jsonResponse ? true : false,
            jsonResponse: jsonResponse ? jsonResponse : 'Something went wrong'
        })
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
})


module.exports = {
    createPayment,
    createPaymentQrCode
}
