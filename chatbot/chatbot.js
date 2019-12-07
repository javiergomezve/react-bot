'use strict';

const dialogflow = require('dialogflow');

const {googleProjectID, sessionID, sessionLanguageCode, clientEmail, privateKey} = require('../config/dialogflow');
const structjson = require('./structjson');

const sessionClient = new dialogflow.SessionsClient({
    projectID: googleProjectID,
    credentials: { client_email: clientEmail, private_key: privateKey }
});
const sessionPath = sessionClient.sessionPath(googleProjectID, sessionID);

module.exports = {
    textQuery: async function(text, parameters = {}) {
        let self = module.exports;

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: sessionLanguageCode
                }
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        };

        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses)
        return responses;
    },

    eventQuery: async function(event, parameters = {}) {
        let self = module.exports;

        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters),
                    languageCode: sessionLanguageCode
                }
            }
        };

        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses)
        return responses;
    },

    handleAction: function(responses) {
        return responses;
    }
};
