const dialogflow = require('dialogflow');

const {googleProjectID, sessionID, sessionLanguageCode} = require('../config/dialogflow');

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(googleProjectID, sessionID);

module.exports = app => {
    app.post('/api/df_text_query', async (req, res) => {
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.text,
                    languageCode: sessionLanguageCode
                }
            }
        };

        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`Query: ${result.queryText}`);
        console.log(`Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`Intent: ${result.intent.displayName}`);
        } else {
            console.log(`No intent matched.`);
        }

        res.send({ result });
    });
    
    app.post('/api/df_event_query', (req, res) => {
        res.send({ do: 'event query' });
    });
};
