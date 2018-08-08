import React, { Component } from 'react';
import 'whatwg-fetch';
import Quill from 'quill';
import 'react-quill/dist/quill.bubble.css';

export default class Content extends Component {

    constructor(props) {
        super(props);
        this.state = {
            readOnly: true,
            theme: "bubble"
        };
    }

    render() {
        return (
            <div id="content" className='content'>

            </div>
        );
    }

    componentDidMount() {
        this.setState({
            quill: new Quill('#content', {
                readOnly: this.state.readOnly,
                theme: this.state.theme
            })
        });
    }

    componentDidUpdate(prevProps) {
        let self = this;
        if (this.props.contentUrl && this.props.contentUrl.length > 0) {
            fetch(this.props.contentUrl)
                .then(function (response) {
                    return response.json()
                }).then(function (json) {
                    self.state.quill.setContents(json);
                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })
        }
    }

}