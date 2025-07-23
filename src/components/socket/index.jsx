import config from 'config';
import { refesh_neo_token } from 'config';
import { _check_and_get_token } from 'config';
import io from 'socket.io-client';

  const socket = io(
    `${config.MQTT_URL}/iiot`, {
    // 'http://localhost:5544/iiot', {
    reconnection: true,
    reconnectionAttempts: Infinity,
    // reconnectionDelay: 1000,
    // reconnectionDelayMax: 5000,
    // randomizationFactor: 0.5,
    autoConnect: false,
    // auth: {
    //     token: token
    // }
  });


export { socket }