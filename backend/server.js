const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ CRITICAL SETUP ERROR: MONGO_URI missing from .env file.");
    process.exit(1);
}

// 🛰️ Cloud Database Fast Handshake Routine
mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 4000 })
    .then(() => {
        console.log("🚀 Successfully connected to MongoDB Atlas Cloud Database!");
        initializeAccount(); 
    })
    .catch(err => {
        console.error("❌ MONGODB CONNECTION CRASH DETAIL:");
        console.error(err.message);
    });

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true }, 
    pin: { type: String, required: true },
    balance: { type: Number, default: 5000 } 
});
const Account = mongoose.model('Account', accountSchema);

async function initializeAccount() {
    try {
        const count = await Account.countDocuments();
        if (count === 0) {
            await Account.create({ name: "Demo Client", accountNumber: "12345", pin: "1234", balance: 5000 });
            console.log("🌱 Database empty. Seeded initial demo profile (Acc: 12345, PIN: 1234)");
        }
    } catch (err) {
        console.error("Initialization warning:", err.message);
    }
}

// 🔐 Route: Register / Signup Account
app.post('/api/signup', async (req, res) => {
    const { name, accountNumber, pin } = req.body;
    if (!name || !accountNumber || !pin) {
        return res.status(400).json({ success: false, message: "All input fields are required." });
    }
    try {
        const existingAccount = await Account.findOne({ accountNumber });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: "Account number already registered!" });
        }
        const newAccount = await Account.create({ name, accountNumber, pin, balance: 5000 });
        res.status(201).json({ success: true, message: "Account created successfully!", account: newAccount });
    } catch (err) {
        res.status(500).json({ success: false, message: "Cloud database profile compilation error." });
    }
});

// 🔏 Route: Authenticate / Login
app.post('/api/auth', async (req, res) => {
    const { accountNumber, pin } = req.body;
    try {
        const account = await Account.findOne({ accountNumber, pin });
        if (account) {
            return res.json({ success: true, name: account.name, accountNumber: account.accountNumber, balance: account.balance });
        }
        return res.status(401).json({ success: false, message: "Incorrect Account Number or PIN!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server authentication failure." });
    }
});

// 📩 Route: Cash Vault Deposit
app.post('/api/deposit', async (req, res) => {
    const { accountNumber, amount } = req.body;
    const value = parseFloat(amount);
    try {
        const account = await Account.findOne({ accountNumber });
        if (!account) return res.status(404).json({ success: false, message: "Profile missing context." });

        account.balance += value;
        await account.save();
        res.json({ success: true, balance: account.balance, message: `Successfully deposited $${value.toFixed(2)}` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Deposit processing failure." });
    }
});

// 💵 Route: Cash Vault Withdrawal
app.post('/api/withdraw', async (req, res) => {
    const { accountNumber, amount } = req.body;
    const value = parseFloat(amount);
    try {
        const account = await Account.findOne({ accountNumber });
        if (!account) return res.status(404).json({ success: false, message: "Profile missing context." });

        if (value > account.balance) {
            return res.status(400).json({ success: false, message: "Insufficient account balance." });
        }

        account.balance -= value;
        await account.save();
        res.json({ success: true, balance: account.balance, message: `Successfully withdrew $${value.toFixed(2)}` });
    } catch (err) {
        res.status(500).json({ success: false, message: "Withdrawal processing failure." });
    }
});

const server = app.listen(PORT, () => console.log(`Backend server securely initialized on http://localhost:${PORT}`));

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the other process or set a different PORT.`);
        process.exit(1);
    }
    console.error('Server error:', err);
});