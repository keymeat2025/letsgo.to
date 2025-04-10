// payment.js

// Function to generate a unique transaction ID
function generateTransactionId() {
    return 'TXN_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
}

// Function to initiate payment
async function initiatePhonePePayment(amount, customerName, customerEmail, customerPhone) {
    try {
        // Generate a unique transaction ID
        const transactionId = generateTransactionId();
        
        // Your website's callback URL
        const callbackUrl = window.location.origin + '/payment-callback.html';
        
        // Make API call to your Firebase function
        const response = await fetch('https://YOUR_FIREBASE_PROJECT.cloudfunctions.net/phonePe/initiate-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                transactionId: transactionId,
                callbackUrl: callbackUrl,
                customerName: customerName,
                customerEmail: customerEmail,
                customerPhone: customerPhone
            }),
        });
        
        const data = await response.json();
        
        if (data && data.success && data.data && data.data.instrumentResponse && data.data.instrumentResponse.redirectInfo) {
            // Store transaction ID in localStorage for later use
            localStorage.setItem('currentTransactionId', transactionId);
            
            // Redirect to PhonePe payment page
            window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
            throw new Error('Failed to initiate payment');
        }
    } catch (error) {
        console.error('Payment initiation error:', error);
        alert('Failed to initiate payment. Please try again.');
    }
}

// Function to check payment status
async function checkPaymentStatus(transactionId) {
    try {
        const response = await fetch('https://YOUR_FIREBASE_PROJECT.cloudfunctions.net/phonePe/check-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transactionId: transactionId
            }),
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
}
