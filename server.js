const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const products = [
    { id: 1, name: 'Letra "A"', price: 10000, category: 'letras', imagePath: 'Alfabeto Lore/A/Lore_A.png' },
    { id: 2, name: 'Letra "F"', price: 15000, category: 'letras', imagePath: 'Alfabeto Lore/F/Lore_F_2.jpg' },
    { id: 3, name: 'Bluey', price: 15000, category: 'bluey', imagePath: 'Bluey/Bluey_2_new.png' },
    { id: 4, name: 'Bingo', price: 10000, category: 'bluey', imagePath: 'Bluey/Bingo_2.jpg' },
    { id: 5, name: 'Bluey y Bingo', price: 10000, category: 'bluey', imagePath: 'Bluey/BlueyBingo.jpg' },
    { id: 6, name: 'Cupphead', price: 10000, category: 'cuphead', imagePath: 'Cuphead/Cuphead_3.png' },
    { id: 7, name: 'Rengoku', price: 10000, category: 'demonSLayer', imagePath: 'Demon Slayer/Pelo Amarillo/pelo_Amarillo.png' },
    { id: 8, name: 'Gato Palta', price: 10000, category: 'gato', imagePath: 'Gato Palta/Gato_palta.png' },
    { id: 9, name: 'Hello Kitty', price: 10000, category: 'kitty', imagePath: 'Hello Kitty/Kitty_0.jpg' },
    { id: 10, name: 'Bart Simpson', price: 10000, category: 'bart', imagePath: 'Los Simpsons/Bart_2.jpg' },
    { id: 11, name: 'Bowser', price: 10000, category: 'mario', imagePath: 'Mario Bros/Bowser/Bowser_2_new.png' },
    { id: 12, name: 'Peach ', price: 10000, category: 'mario', imagePath: 'Mario Bros/Peach/Peach.jpg' },
    { id: 13, name: 'Masha Vestido Fucsia', price: 10000, category: 'masha', imagePath: 'Masha y el Oso/Masha_fucsia.png' },
    { id: 14, name: 'Masha Vestido Rojo ', price: 10000, category: 'masha', imagePath: 'Masha y el Oso/Masha_rojo_lunares.jpg' },
    { id: 15, name: 'Minnie 35 cm', price: 10000, category: 'mickey', imagePath: 'minnie y mickey/35 cm/Minnie_35.png' },
    { id: 16, name: 'Minnie y Mickey 40 cm', price: 10000, category: 'mickey', imagePath: 'minnie y mickey/40 cm/mickey_40cm.png' },
    { id: 17, name: 'Oso Panda', price: 10000, category: 'osos', imagePath: 'Pandas/panda_0.jpg' },
    { id: 18, name: 'Pantera Rosa', price: 10000, category: 'pantera', imagePath: 'Pantera Rosa/rosa.png' },
    { id: 19, name: 'Payaso Pim Plin', price: 10000, category: 'payaso', imagePath: 'Payaso/1.jpg' },
    { id: 20, name: 'Pochita', price: 10000, category: 'pochita', imagePath: 'Pochita/pochita-PhotoRoom.png' },
    { id: 21, name: 'Camera Man - Skibidi Toilet', price: 10000, category: 'skibidi', imagePath: 'Skibidi/camera_new.png' },
    { id: 22, name: 'Skibidi Toilet', price: 10000, category: 'skibidi', imagePath: 'Skibidi/IMG_20230919_201121.png' },
    { id: 23, name: 'Red Loudspeaker Man - Skibidi Toilet', price: 10000, category: 'skibidi', imagePath: 'Skibidi/IMG_20230919_201142.png' },
    { id: 24, name: 'Speaker Man - Skibidi Toilet', price: 10000, category: 'skibidi', imagePath: 'Skibidi/IMG_20230919_201204.png' },
    { id: 25, name: 'Skibidi Toilet', price: 10000, category: 'skibidi', imagePath: 'Skibidi/IMG_20230919_205512.png' },
    { id: 26, name: 'Pokemon Snorlax', price: 10000, category: 'pokemon', imagePath: 'Snorlax/1_snorlax.jpg' },
    { id: 27, name: 'Spider Gwen', price: 10000, category: 'spiderVerse', imagePath: 'SpiderVerso/blanco.jpg' },
    { id: 28, name: 'Spider-man - Miles Morales', price: 10000, category: 'spiderVerse', imagePath: 'SpiderVerso/negro.jpg' },
    { id: 29, name: 'Spider-Man - Peter Parker', price: 10000, category: 'spiderVerse', imagePath: 'SpiderVerso/rojo.jpg' },
    { id: 30, name: 'Stich - Lilo & Stitch', price: 10000, category: 'stitchAngela', imagePath: 'Stitch/stitch_2_new.png' },
    { id: 31, name: 'Angela - Lilo & Stitch', price: 10000, category: 'stitchAngela', imagePath: 'Stitch/angela.png' },
    { id: 32, name: 'Tom - Tom & Jerry', price: 10000, category: 'tom&Jerry', imagePath: 'Tom y Jerry/Tom_jerry_2.jpg' },
    { id: 33, name: 'Jerry - Tom & Jerry', price: 10000, category: 'tom&Jerry', imagePath: 'Tom y Jerry/Tom_jerry_3.jpg' },
    { id: 34, name: 'Donatello - Tortugas Ninja', price: 10000, category: 'ninjaTurtle', imagePath: 'Tortugas Ninja/Donatello.jpg' },
    { id: 35, name: 'Leonardo - Tortugas Ninja', price: 10000, category: 'ninjaTurtle', imagePath: 'Tortugas Ninja/Leonardo.png' },
    { id: 36, name: 'Miguel Angel - Tortugas Ninja', price: 10000, category: 'ninjaTurtle', imagePath: 'Tortugas Ninja/MiguelAngel.png' },


    // Agrega más productos según sea necesario
];

app.get('/api/products', (req, res) => {
    res.json(products);
});
app.post('/api/add-product', (req, res) => {
    // Lógica para agregar nuevos productos
    // ...

    res.json({ message: 'Producto agregado con éxito' });
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});