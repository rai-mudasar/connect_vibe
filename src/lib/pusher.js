import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// 1. Initialize Pusher on the Server (for Server Actions)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

// 2. Initialize Pusher on the Client (for your Chat UI)
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  }
);