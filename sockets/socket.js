const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init server');

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Green day'));
bands.addBand( new Band('Metallica'));
bands.addBand( new Band('Pop'));


//Mensajes de sockets
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload )=>{
        console.log('Mensaje!!!', payload);

        io.emit('mensaje', {admin: 'Nuevo Mensaje'});
    });

    client.on('vote-band', (payload) =>{

        bands.voteBands( payload.id);
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payload) => {
        const newBand = new Band( payload.name);
        bands.addBand( newBand );
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
    // client.on('nuevo-mensaje', (payload) => {
    //     //io.emit('nuevo-mensaje', payload);//Emite a todos
    //     // console.log('Data recivid', payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);//Emite a todos
    // });
});
