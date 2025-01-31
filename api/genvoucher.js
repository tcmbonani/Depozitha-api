// Example: /api/genvoucher.js (backend code)
import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
     "type": "service_account",
    "project_id": "depozitha-merchants",
    "private_key_id": "1cdd9eb646bafd92d113325f0a6e4abaf40f5a42",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3S3YrLWdhJPr4\nkCxFKgryQ5pX1AXx3jltEYqOLeSC9QQPQ/bNWT2NvfcMNIY0hTfgqW3vvn826hke\nmoBkoOJ5KxOQYXKhzy5lKqmHRVsLfcL/eJLc+m9cPSq2CDelq6/8CsQ9voUZU4vt\nzPr2zsqLa6piNZHznN0jBnlZ2FHl16G0BmT4TtKPQUft8la+zzI4I3RALrC9Jm8O\nGhQgUXsPUcE8tB/yZcBO7xlNwmQNpfsyIA5IVl866e8+y/tqOjdwMCTbs3VRYVKE\n8WEdh8vqp0xxcG5JLq0gW3UWrLUQu3nV0nbZZtHK50E3ULJJmj4tS9wvIIAK8vTL\nH8aPa9j1AgMBAAECggEACl5VLKuYl7zzCnkDXBU9AcfTtQisHmq69mHB4/mSHdtU\n07U9Qo/8BKbckP7uoY1wo/+JlcCBqz5SVfIY9bhJH2ARrv7oMGGLJxNi/CEu/Ycr\nbu6n5iKvhnj6T8pGtZMw9RG52KFMn6pjdbv87VW0zO61+HC91RlIRBkzZ6LuPRFd\nU//Q4kBAzIxlvzRhDm4cL+C1oiC3s4l/bEjznhz0+B1z7/I3TlXiJ/j/AmJQPhYi\nS0yK4ZObQWqMh94WRS8salakEKNwfHB/+eoZufKHrWfBV7EzhAHj65XzqTQ/0PbB\ngXsKsFelHmExdei9lBcJymReIexADPv/ru6j5ll/uQKBgQDc4eorGyLbBWQ7jNkg\nWoSV6WmRBR1TrF9i72GpnfTRuCLYe44FX7pCkOjE3eSFvP7pY8XChh5N/8c9ansG\nl5MWDuil4CpQBCZmXupUyuvPUwb+7qtxJPPi891m9e5S+NddYreFJ6tfbqYvmg4l\nQbbkk7ojC3P90QJTeAn0AlmIDQKBgQDUb7LSx3ZMzJuVB6XSmtUf4/nZF07nABZX\nWhkdj7xqkMv8Y9ixunL4nciHIXxJWwCAqNDiLy/YHzMQZ4fuVJB5TVGefILEUukr\nIbBpCp7GVnGoMw+fKXv23t4OvRZ+mQ0mA7fSpTFx+pcnztx9eIqbU6QorQNLQrBq\nbnXEZU2yiQKBgCqf8heFchGAFdqkEJZ8wU9IrtWMfh9SiUnHVjpsP/1kolzSYxLI\naWJFIpYzF9FzKmIRne0vApQcwu8oKDuaboj4MY8pFiFA28QvltrsGdt1c0ko966q\n6eGnG9etp+MdIDpmPXIVuK1+5dUTzp0D9G5hz67JnAWkGuXOqWUMOwjVAoGAS6zm\ntPNdDwqsObCZv6ZsWYnqzQzijKOZUdDEtaUoZ4XhRK2E2fsjTbFXZ9vj3HXQfgSl\nNI2+q2yh0iwvXhU9yhhjBOQx6SHn8fd0Ulb4LItKvbJC1F4AzPajf/iX9M0sw+f7\nKcyzCnlMM2AbZ47zQVXQWrUXQU4mbiOfTDESNpECgYEAuV4xwCfjVm17lLxhl0K/\nsKp2S1gpF6kNnTezhQswhNSYibEMhDrnpMqE19aa0UMJq7CWGyzal7e23AnHG/NC\nNqAqeJNORTH30NnhpqQAolQYGJqd0bNY+XT+gWVaYCeRqLYDGA0eRKVYtMMFt0+r\npg+OWfbEbK7gilP+43qwXc0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ayhu9@depozitha-merchants.iam.gserviceaccount.com",
    "client_id": "103271628589851448746",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ayhu9%40depozitha-merchants.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
    })
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
