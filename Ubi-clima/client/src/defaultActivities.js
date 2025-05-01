// defaultActivities.js
import Activity from './Activity.js';

const defaultActivities = [
    new Activity("Ciclismo", "Salir en bicicleta al parque", 22, 10, 0, 4, 5, 1, 1, 5),
    new Activity("Picnic", "Picnic con amigos", 25, 8, 0, 6, 3, 1, 1, 1),
    new Activity("Senderismo", "Subida al cerro", 18, 12, 0, 1, 4, 1, 1, 3),
    new Activity("Lectura", "Leer en el balcón", 20, 5, 0, 1, 3, 4, 5, 1),
    new Activity("Fútbol", "Jugar fútbol con amigos", 24, 9, 0, 1, 4, 1, 1, 5),
];

export {defaultActivities};
