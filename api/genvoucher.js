// Example: /api/genvoucher.js (backend code)
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';

// Initialize Firebase Admin SDK using environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix line breaks
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    }),
  });
}

// API logic here...

// Create an Express app (even though it's running as serverless, we can use express)
const app = express();

// Middleware for CORS
app.use(cors({
  origin: '*',  // Allow any origin, you can modify this to be more secure
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware to parse JSON body
app.use(express.json());

// Function to generate a random PIN
function generateRandomPin() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

// Function to generate a serial number
function generateSerialNumber() {
  const prefix = "DPZSN";
  const randomNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000); 
  return `${prefix}${randomNumber}`;
}

// Middleware to check for the Bearer token in headers
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract Bearer token

  if (!token) {
    return res.status(403).json({ success: false, message: 'Authorization token is required' });
  }

  // For now, let's just check if the token matches a predefined string (e.g., env variable)
  const validToken = process.env.BEARER_TOKEN;  // Store your token securely in Vercel's environment variables

  if (token !== validToken) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }

  next(); // Token is valid, proceed to the route
};

// Use the token verification middleware for the voucher generation route
app.post('/api/genvoucher', verifyToken, async (req, res) => {
  try {
    const { originalAmount } = req.body;

    if (!originalAmount || isNaN(originalAmount) || originalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount provided' });
    }

    const pin = generateRandomPin();
    const serialNumber = generateSerialNumber();

    const transactionFee = 25;
    let securityFee = 0;

    if (originalAmount > 350) {
      securityFee = originalAmount * 0.02;
    }

    const totalTransactionFee = transactionFee + securityFee;
    const finalAmount = originalAmount - totalTransactionFee;
    const status = "active";
    const productDescription = "Voucher for purchase";

    const currentDate = new Date();
    const time = currentDate.toLocaleTimeString();
    const date = currentDate.toLocaleDateString();

    const voucherRef = admin.firestore().collection('vouchers').doc();
    await voucherRef.set({
      pin,
      originalAmount,
      transactionFee: totalTransactionFee,
      securityFee,
      finalAmount,
      status,
      serialNumber,
      productDescription,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      time,
      date,
    });

    res.status(200).json({
      success: true,
      voucherId: voucherRef.id,
      serialNumber,
      pin,
      originalAmount,
      transactionFee,
      finalAmount,
      status,
      productDescription,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      time,
      date,
    });
  } catch (error) {
    console.error('Error generating voucher:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export the function as a handler for Vercel
export default app;
