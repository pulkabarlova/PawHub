import { onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { WS_URL } from '../config/api';
import { useNotificationsStore } from '../stores/notifications';

/**
 * Open the Socket.IO connection for the app lifetime and route the mandatory
 * server -> client `new_adoption_alert` event into the notifications store.
 * Call once from the root component.
 */
export function useSocket() {
  const notifications = useNotificationsStore();
  let socket = null;

  onMounted(() => {
    socket = io(WS_URL);
    socket.on('new_adoption_alert', (pet) => notifications.pushAdoptionAlert(pet));
  });

  onUnmounted(() => {
    if (socket) socket.disconnect();
  });
}
