import React, { Component } from 'react';
import 'whatwg-fetch';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import OSS from 'ali-oss';
import co from 'co';
import './Editor.css';

export default class Editor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: "snow",
            menuList: [],
            contentUrl: ""
        };
    }

    render() {
        return (
            <div className='content'>
                <div className='editor-menu'>
                    <select className='editor-select' onChange={this.handleChange} value={this.state.contentUrl}>
                        {this.state.menuList.map(function (menu, subIndex) {
                            return <option className='editor-select-option' key={menu.id} value={menu.url}>{menu.name}</option>;
                        })}
                    </select>
                    <button type="button" onClick={this.uploadContent} className='editor-submit'>submit</button>
                </div>

                <div id="editor" className='content'>

                </div>
            </div>
        );
    }

    componentDidMount() {
        var self = this;
        this.setState({
            quill: new Quill('#editor', {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'link'],
                        ['blockquote', 'code-block'],
                        ['image'],
                        [{ list: 'ordered' }, { list: 'bullet' }]
                    ]
                },
                placeholder: 'Compose an epic...',
                theme: this.state.theme
            })
        });

        fetch('https://blog.geekstylecn.com/menu/sub')
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                self.setState({ menuList: json });
                self.changeContent(json[0].url);
                self.setState({ contentUrl: json[0].url });
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    handleChange = (e) => {
        var url = e.target.value;
        this.setState({ contentUrl: url });
        console.log(url);
        var self = this;
        fetch(url)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                self.state.quill.setContents(json);
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    changeContent = (url) => {
        console.log(url);
        var self = this;
        fetch(url)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                self.state.quill.setContents(json);
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    uploadContent = () => {
        console.log(this.state.contentUrl);
        var delta = this.state.quill.getContents();
        var jsonContent = JSON.stringify(delta);

        var client = new OSS({
            region: 'oss-ap-southeast-1',
            accessKeyId: 'LTAItQEDWBysUYmb',
            accessKeySecret: 'snFH59ekiamm4zu1E0dttjRLkdBDAu',
            bucket: 'geekstyle-singapore'
        });

        var filePath = this.state.contentUrl;
        var index = filePath.lastIndexOf("/");
        var fileKey = 'blog/' + filePath.substr(index + 1);
        console.log("fileKey: " + fileKey);
        co(function* () {
            var result = yield client.put(fileKey, new Buffer(jsonContent));
            console.log(result);
        }).catch(function (err) {
            console.log(err);
        });
    }

}