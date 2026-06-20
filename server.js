require("dotenv").config();

const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* CREATE ORDER */

app.post("/api/create-order", async (req, res) => {

    try {

        const { amount } = req.body;

        if (!amount || amount < 100) {

            return res.status(400).json({
                success: false,
                message: "Minimum amount is 100 paise"
            });

        }

        const options = {
            amount: amount,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order =
        await razorpay.orders.create(options);

        console.log("Order Created:", order.id);

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {

    console.log("========== RAZORPAY ERROR ==========");

    console.dir(error, { depth: null });

    console.log("STATUS:", error.statusCode);

    console.log("MESSAGE:", error.message);

    console.log("ERROR:", error.error);

    res.status(500).json({
        success: false,
        message: "Order creation failed"
    });

}

});

/* VERIFY PAYMENT */

app.post("/api/verify-payment", (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Missing payment details"
            });

        }

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =
            crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (
            expectedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid Signature"
            });

        }

        res.json({
            success: true,
            message: "Payment Verified Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Verification Failed"
        });

    }

});

/* TEST ROUTE */

app.get("/", (req, res) => {

    res.send("Razorpay Server Running");

});

/* START SERVER */

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});

console.log("SERVER FILE LOADED");