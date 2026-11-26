import { findOrder } from '@/lib/orders';
import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText, tool, toUIMessageStream,
  type UIMessage
} from "ai";
import { z } from 'zod';

const CURRENT_CUSTOMER_ID = "CUST-1"


export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3.5-flash-lite"),
    instructions: "You are ShopBuddy, the friendly support assistant fro Gadget Hub, a small gadget online shop. Keep your answer small and helpful.",
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
    tools: {

      getOrderStatus: tool({
        description: "Get the status of a Gadget Hub order by its orderId",
        inputSchema: z.object({
          orderId: z.string().describe("The order ID, for example ORD-1042")
        }),
        execute: async ({ orderId }) => {
          const order = findOrder(orderId);
          if (!order || order.customerId !== CURRENT_CUSTOMER_ID) {
            return { error: "Order not found." }
          }
          return { item: order.item, status: order.status, eta: order.eta };
        }
      }),

      refundOrder: tool({
        description: "Refund as a Gadget Hub order. Use it only when the customer asks for refund order.",
        inputSchema: z.object({
          orderId: z.string().describe("The Order ID to refund.")
        }),
        execute: async ({ orderId }) => {
          const order = findOrder(orderId);
          if (!order || order.customerId !== CURRENT_CUSTOMER_ID) {
            return { error: "Order not found." }
          }
          return { refunded: true, orderId: order.id, amount: order.price }
        }
      })

    },
    toolApproval: {
      refundOrder: "user-approval"
    }
  });


  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream })
  })
}