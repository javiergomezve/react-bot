import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';
import Card from "./Card";
import QuickReplies from "./QuickReplies";

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

    _handleQuickReplyPayload = (text) => {
        this.df_text_query(text);
    };

    renderMessages = messages => {
        if (messages) {
            return messages.map((message, i) => this.renderOneMessage(message, i));
        }

        return null;
    };

    renderOneMessage = (message, i) => {
        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        }

        else if (message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards) {
            return (
                <div key={i}>
                    <div className="card-panel grey lighten-5 z-depth-1">
                        <div style={{ overflow: 'hidden' }}>
                            <div className="col s2">
                                <a className="btn-floating btn-large waves-effect waves-light red">
                                    {message.speaks}
                                </a>
                            </div>
                            <div style={{ overflow: 'hidden', overflowX: 'scroll', minHeight: 350, maxHeight: 350 }}>
                                <div style={{
                                    height: 300,
                                    width: message.msg.payload.fields.cards.listValue.values.length * 300
                                }}>
                                    {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.quick_replies) {
            return <QuickReplies
                key={i}
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values}
            />;
        }

        return null;
    };

    renderCards = cards => {
        return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
    };

    render() {
        return (
            <div style={{ minHeight: 500, maxHeight: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgrey' }}>
                <nav>
                    <div className="nav-wrapper">
                        <a className="brand-logo">
                            ChatBot
                        </a>
                    </div>
                </nav>

                <div id="chatbot" style={{ height: 388, maxHeight: 388, width: '100%', overflow: 'auto'}}>
                    {this.renderMessages(this.state.messages)}
                    <div
                        ref={(el) => { this.messagesEnd = el; }}
                        style={{ float: 'left', clear: 'both'}}
                    />
                </div>

                <div className="col s12">
                    <input
                        type="text" onKeyPress={this._handleInputKeyPress}
                        style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}}
                        placeholder="Type a message"
                    />
                </div>
            </div>
        );
    }
}

export default Chatbot;
