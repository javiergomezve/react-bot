const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send({ app: 'React Bot' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Runing on http://127.0.0.1:${PORT}`));