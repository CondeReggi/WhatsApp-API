require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios').default;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
// const Whatsapp = new WhatsappCloudAPI({
//     accessToken: `Bearer ${process.env.TOKEN}`,
//     senderPhoneNumberId: process.env.FROM_PHONE_NUMBER_ID,
//     WABA_ID: process.env.BUSSINES_ACCOUNT,
// });

// console.log(Whatsapp)

//Is not allowed for trial accounts :(

/* client.validationRequests
  .create({friendlyName: 'Camila', phoneNumber: '+59899257154'})
  .then(validation_request => console.log(validation_request.friendlyName))
  .catch(err => console.log(err)); */

const FROM_PHONE_NUMBER_ID = process.env.FROM_PHONE_NUMBER_ID;
const PHONE_TO_SEND = process.env.PHONE_TO_SEND;
const MESSAGE_TO_SEND = process.env.MESSAGE_TO_SEND;

console.log("Phone Number: ", FROM_PHONE_NUMBER_ID);

const url = `https://graph.facebook.com/v13.0/${FROM_PHONE_NUMBER_ID}/messages`;

app.use(cors());

const exposeHeaders = (req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

const postMessage = (res) => {
    const body = {
        messaging_product: "whatsapp",
        preview_url: false,
        recipient_type: "individual",
        to: `${PHONE_TO_SEND}`,
        type: "template",
        template: {
            name: "juga_duolingo",
            language: {
                code: "en_US"
            }
        }
    }

    const headers = {
        Authorization : "Bearer " +  process.env.TOKEN
    }

    axios.post(url, body , { headers : headers })
    .then((result) => {
        res.json({
            ...headers,
            ...body,
            url
        });
    })
    .catch((error) => {
        res.json(error);
    })
}

// app.use(exposeHeaders);

app.post('/enviar', exposeHeaders, async (req, res) => {
    postMessage(res);
});

app.get('/meta_wa_callbackurl', (req, res) => {
    try {
        console.log('GET: Someone is pinging me!');

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token && mode === 'subscribe' && process.env.TOKEN === token) {
            return res.status(200).send(challenge);
        }
        
        return res.sendStatus(403);
        
    } catch (error) {
        console.error({error})
        return res.sendStatus(500);
    }
});

app.post('/meta_wa_callbackurl', async (req, res) => {
    try {
        return res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
});

app.listen(3000, () => {
    console.log("Puerto abierto con exito!")
});