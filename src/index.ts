import amqplib from 'amqplib';
import axios from 'axios';


const mainBroker = async() => {
    try {
        let coneccion = await amqplib.connect('amqp://44.192.200.94');
        let ch = await coneccion.createChannel();

        ch.consume('pagos', async (msg: any) => {
            try {
                const descripcion = msg.content.toString();
                

                const res = await axios.post('http://localhost:3001/pagado', {descripcion});

                console.log('Datos que envia la API: ', res.data);
            } catch (error) {
                console.error('Error al enviar los datos a la API: ', error);
            }
            ch.ack(msg);
        })

        console.log('El broker se inicializo de manera correcta');
    } catch (error) {
        console.log('Hubo un error al iniciar el broker', error);
    }
};

mainBroker();