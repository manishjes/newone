const plivo = require("plivo");
import SMS from "../models/sms";
import { createSlug } from "../helpers/helper";

const addPayload = async (data: any, payload: any) => {
  try {
    const template = data.replace(/message/i, payload);
    return template;
  } catch (err) {
    console.log(err);
  }
};

const sendMessage = async (payload: any) => {
  SMS.findOne({
    slug: await createSlug(payload.title),
  })
    .then(async (data: any) => {
      if (data) {
        const client = new plivo.Client(
          process.env.AUTH_ID,
          process.env.AUTH_TOKEN
        );

        await client.messages
          .create({
            src: process.env.SENDER_SOURCE,
            dst: payload.to,
            text: await addPayload(data.body, payload.data),
          })
          .then((response: any) => {
            if (response) {
              return true;
            }
          })
          .catch((err: any) => {
            //console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default sendMessage;
