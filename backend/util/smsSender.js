import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.SMS_ACCOUNTSID;
const authToken = process.env.SMS_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(messageBody, fromNumber, toNumber) {
    try {
        const message = await client.messages.create({
            body: messageBody,
            from: fromNumber,
            to: toNumber
        });
        console.log("Message sent successfully. SID:", message.sid);
        return message.sid; // Returning message SID for reference
    } catch (error) {
        console.error("Error sending message:", error);
        throw error; // Propagate error to handle it in the main application
    }
}


export { sendSMS };
