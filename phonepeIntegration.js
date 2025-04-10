// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// PhonePe configuration
const MERCHANT_ID = 'YOUR_MERCHANT_ID'; // Replace with your actual Merchant ID
const SALT_KEY = 'YOUR_SALT_KEY'; // Replace with your actual Salt Key
const SALT_INDEX = 1; // Usually 1, but check with PhonePe
const PHONEPE_HOST = 'https://api.phonepe.com/apis/hermes'; // Use 'https://api-preprod.phonepe.com/apis/hermes' for testing

// Helper function to generate SHA256 hash
const generateSHA256 = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex');
};

// Helper function to create base64 string
const getBase64 = (input) => {
  return Buffer.from(input).toString('base64');
};

// Endpoint to initiate a payment
app.post('/initiate-payment', async (req, res) => {
  try {
    const { amount, transactionId, callbackUrl, customerName, customerEmail, customerPhone } = req.body;
    
    if (!amount || !transactionId || !callbackUrl) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create payload for PhonePe
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      amount: amount * 100, // Convert to paise
      redirectUrl: callbackUrl,
      redirectMode: 'POST',
      callbackUrl: callbackUrl,
      mobileNumber: customerPhone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Add customer details if provided
    if (customerName || customerEmail || customerPhone) {
      payload.merchantUserId = `MUID_${transactionId}`;
      payload.userDetail = {};
      
      if (customerName) payload.userDetail.name = customerName;
      if (customerEmail) payload.userDetail.email = customerEmail;
      if (customerPhone) payload.userDetail.mobileNumber = customerPhone;
    }

    // Convert payload to base64
    const payloadBase64 = getBase64(JSON.stringify(payload));
    
    // Generate checksum (SHA256(base64(payload) + "/pg/v1/pay" + salt_key) + ### + salt_index)
    const checksum = generateSHA256(`${payloadBase64}/pg/v1/pay${SALT_KEY}`) + '###' + SALT_INDEX;

    // Make API call to PhonePe
    const response = await axios.post(
      `${PHONEPE_HOST}/pg/v1/pay`,
      {
        request: payloadBase64
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    // Store transaction details in Firestore
    await admin.firestore().collection('transactions').doc(transactionId).set({
      amount,
      status: 'initiated',
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Endpoint to check payment status
app.post('/check-status', async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    // Create payload
    const payload = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
    
    // Generate checksum
    const checksum = generateSHA256(`${payload}${SALT_KEY}`) + '###' + SALT_INDEX;

    // Make API call to PhonePe
    const response = await axios.get(
      `${PHONEPE_HOST}${payload}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID
        }
      }
    );

    // Update transaction status in Firestore
    if (response.data && response.data.code === 'PAYMENT_SUCCESS') {
      await admin.firestore().collection('transactions').doc(transactionId).update({
        status: 'completed',
        paymentDetails: response.data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else if (response.data) {
      await admin.firestore().collection('transactions').doc(transactionId).update({
        status: 'failed',
        paymentDetails: response.data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error checking payment status:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Callback endpoint for PhonePe to notify about payment status
app.post('/callback', async (req, res) => {
  try {
    const { merchantTransactionId, transactionId, amount, paymentInstrument } = req.body;
    
    // Verify the callback by checking transaction status with PhonePe
    const payload = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
    const checksum = generateSHA256(`${payload}${SALT_KEY}`) + '###' + SALT_INDEX;

    const response = await axios.get(
      `${PHONEPE_HOST}${payload}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': MERCHANT_ID
        }
      }
    );

    // Update transaction in Firestore
    if (response.data && response.data.code === 'PAYMENT_SUCCESS') {
      await admin.firestore().collection('transactions').doc(merchantTransactionId).update({
        status: 'completed',
        phonepeTransactionId: transactionId,
        paymentMode: paymentInstrument ? paymentInstrument.type : 'unknown',
        paymentDetails: response.data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await admin.firestore().collection('transactions').doc(merchantTransactionId).update({
        status: 'failed',
        phonepeTransactionId: transactionId || null,
        paymentDetails: response.data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Always return success to PhonePe
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error in callback:', error.response ? error.response.data : error.message);
    // Still return success to PhonePe to prevent retries
    return res.status(200).json({ status: 'success' });
  }
});

exports.phonePe = functions.https.onRequest(app);
