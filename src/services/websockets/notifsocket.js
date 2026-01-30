import { Client } from "@stomp/stompjs"

let client = null

export function connectNotificationSocket(userId, onNotification) {
  client = new Client({
    brokerURL: "ws://localhost:8088/ws",
    reconnectDelay: 5000,
    debug: () => {},

    onConnect: () => {
      console.log("✅ Notification socket connected")

      client.subscribe(`/topic/notifications/${userId}`, message => {
        onNotification(JSON.parse(message.body))
      })
    },

    onStompError: frame => {
      console.error("❌ STOMP error", frame)
    }
  })

  client.activate()
}

export function disconnectNotificationSocket() {
  client?.deactivate()
}
