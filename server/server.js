const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://172.20.3.28:3000', 'http://anotherdomain.com'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'), false);
        }
    }
}));

app.use(express.json());

app.get('/fetch-google-places', async (req, res) => {
    const { lat, lng } = req.query;
    const fetch = (await import('node-fetch')).default;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=locality&key=YOUR_API_KEY`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        console.error('Error fetching Google Places:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/fetch-google-photo', async (req, res) => {
    const { photoreference, maxheight } = req.query;
    const fetch = (await import('node-fetch')).default;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxheight=${maxheight}&photoreference=${photoreference}&key=YOUR_API_KEY`;

    try {
        const photoResponse = await fetch(url);
        const blob = await photoResponse.blob();
        res.type('image/jpeg').send(blob);
    } catch (error) {
        console.error('Error fetching Google Photo:', error);
        res.status(500).send('Error fetching photo');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
