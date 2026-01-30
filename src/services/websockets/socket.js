// src/services/websockets/socket.js
import { Client } from "@stomp/stompjs"

let client = null

export function connectWorkerSocket(onOrderReceived) {
  client = new Client({
    brokerURL: "ws://localhost:8088/ws", // ✅ WebSocket NATIF

    reconnectDelay: 5000,
    debug: () => {},

    onConnect: () => {
      console.log("✅ WebSocket connecté")

      client.subscribe("/topic/orders", message => {
        onOrderReceived(JSON.parse(message.body))
      })
    },

    onStompError: frame => {
      console.error("❌ STOMP error", frame)
    }
  })

  client.activate()
}

export function disconnectSocket() {
  client?.deactivate()
}
