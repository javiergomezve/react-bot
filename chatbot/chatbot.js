'use strict';

const dialogflow = require('dialogflow');

const {googleProjectID, sessionID, sessionLanguageCode} = require('../config/dialogflow');

const sessionClient = new dialogflow.SessionsClient();
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

    handleAction: function(responses) {
        return responses;
    }
};
