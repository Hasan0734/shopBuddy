import { google } from "@ai-sdk/google";
import { Output } from "ai";
import { generateText } from "ai";
import {z} from 'zod'

const email = `Hi there, I got my order ORD-1043 yesterday but the phone case is the wrong colour.
I ordered black and got a bright pink one. My cat's love it. I don't. Can I get my money back? Thanks, Jahid`;

const { output } = await generateText({
  model: google("gemini-3.5-flash-lite"),
  output: Output.object({
    schema: z.object({
        orderId: z.string(),
        product: z.string(),
        reason: z.enum(["damaged", "wrong-item", "not-needed", "other"]),
        wantesRefund: z.boolean()
    })
  }),
  prompt: `Extract the return request from this customer email: \n\n${email}`,
});

if(output.reason === "wrong-item" && output.wantesRefund) {
    console.log(`Create a refund for ${output.orderId} and send a return label.`)
}

console.log(output)