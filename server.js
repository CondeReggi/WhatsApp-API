require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios').default;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

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

// app.use(exposeHeaders);

app.post('/enviar', exposeHeaders, async (req, res) => {
    console.log("Entre")

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

    // client.messages 
    //   .create({ 
    //      from: 'whatsapp:+${ID_CLIENT}',       
    //      body: MESSAGE_TO_SEND, 
    //      to: `whatsapp:${PHONE_TO_SEND}` 
    //    }) 
    //   .then(message => res.json(message)) 
    //   .catch(err => console.log(err))
    //   .done();

    // client.messages
    //     .create({
    //         body: MESSAGE_TO_SEND,
    //         mediaUrl: ['https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'],
    //         from: `whatsapp:${process.env.EXTENSION}${FROM_PHONE_NUMBER_ID}`,
    //         to: `whatsapp:${process.env.EXTENSION}${PHONE_TO_SEND}`
    //     })
    //     .then(message => console.log(message.sid))
    //     .done();

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
});

app.listen(3000, () => {
    console.log("Puerto abierto con exito!")
});