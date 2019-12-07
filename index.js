const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({ app: 'React Bot' });
});

require('./routes/dialogFlowRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Runing on http://127.0.0.1:${PORT}`));