// defaultActivities.js
import Activity from './Activity.js';

const defaultActivities = [
    new Activity("Ciclismo", "Salir en bicicleta al parque", 22, 10, 0, 4, 4, 1, 1, 3),
    new Activity("Picnic", "Picnic con amigos", 25, 8, 0, 6, 4, 1, 1, 1),
    new Activity("Senderismo", "Subida al cerro", 18, 12, 1, 7, 4, 1, 1, 3),
    new Activity("Lectura", "Leer en el balcón", 20, 5, 0, 3, 3, 4, 5, 1),
    new Activity("Fútbol", "Jugar fútbol con amigos", 24, 9, 0, 5, 4, 1, 1, 4),
];

export {defaultActivities};
