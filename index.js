const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send({ app: 'React Bot '});
});

app.listen(5000, () => console.log('Runing on http://127.0.0.1:5000'));