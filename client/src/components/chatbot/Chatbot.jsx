import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';

const cookies = new Cookies();

class Chatbot extends Component {

    messagesEnd;

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
        };

        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    }

    componentDidMount() {
        this.df_event_query('Welcome');
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behaviort: "smooth" });
    }

    df_text_query = async queryText => {
        let says = {
            speaks: 'me',
            msg: {
                text: {
                    text: queryText
                }
            }
        };

        this.setState({
            messages: [
                ...this.state.messages,
                says
            ]
        });

        const res = await axios.post('/api/df_text_query', {
            text: queryText,
            userID: cookies.get('userID')
        });

        for (let msg of res.data.fulfillmentMessages) {
            says = {
                speaks: 'bot',
                msg: msg
            };

            this.setState({
                messages: [
                    ...this.state.messages,
                    says
                ]
            }); 
        }
    };

    df_event_query = async eventName => {
        const res = await axios.post('/api/df_event_query', {
            event: eventName,
            userID: cookies.get('userID')
        });

        for(let msg of res.data.fulfillmentMessages) {
            let says = {
                speaks: 'bot',
                msg: msg
            };

            this.setState({
                messages: [
                    ...this.state.messages,
                    says
                ]
            });
        }
    };

    _handleInputKeyPress = event => {
        if (event.key === 'Enter') {
            this.df_text_query(event.target.value);
            event.target.value = '';
        }
    };

    renderMessages = messages => {
        if (messages) {
            return messages.map((message, i) => {
                return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
            });
        }

        return null;
    };

    render() {
        return (
            <div style={{ height: 400, width: 400, float: 'right'}}>
                <div id="chatbot" style={{ height: '100%', width: '100%', overflow: 'auto'}}>
                    <h2>Chatbot</h2>
                    {this.renderMessages(this.state.messages)}
                    <div ref={(el) => { this.messagesEnd = el; }} style={{ float: 'left', clear: 'both'}} />
                    <input type="text" onKeyPress={this._handleInputKeyPress}/>
                </div>
            </div>
        );
    }    
}

export default Chatbot;
