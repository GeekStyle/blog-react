import React, { Component } from 'react';
import './Menu.css';
import 'whatwg-fetch';
import Content from '../content/Content';
import Editor from '../content/Editor';

export class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            content: "content",
            contentUrl: ""
        };
    }

    render() {
        var self = this;

        let content;
        if (this.state.content === "content") {
            content = <Content contentUrl={this.state.contentUrl} />;
        } else if (this.state.content === "editor") {
            content = <Editor />;
        }

        return (
            <div>
                <div id="left">
                    <div className="nav-side-menu">
                        <div className="brand">
                            <b><span i18n_key="longduGlobalMgr">Learn React</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="a_i18n_cn" className='menu-link'><span className='menu-link-span'>中</span></a>
                            <span className='menu-link-span'>|</span>
                            <a id="a_i18n_en" className='menu-link'><span className='menu-link-span'>EN</span></a>
                        </div>
                        <div className="menu-list">
                            <ul id="menu-content" className="menu-content collapse in">
                                {this.state.menu.map(function (mainMenu, index) {
                                    return (
                                        <div key={mainMenu.id}>
                                            <li data-toggle="collapse" data-target={'#mainNav' + mainMenu.id} className="collapsed"><a href=""><i className={mainMenu.icon}></i><span i18n_key={mainMenu.i18nKey}>{mainMenu.name}</span><span className="arrow"></span></a></li>
                                            <ul className="sub-menu collapse" id={'mainNav' + mainMenu.id}>
                                                {mainMenu.subMenuList.map(function (subMenu, subIndex) {
                                                    return <li style={{ background: subMenu.background }} onClick={(e) => self.handleClick(subMenu.id, subMenu.url, e)} key={subMenu.id} focused={subMenu.focused}><a i18n_key={subMenu.i18nKey} target="mainFrame">{subMenu.name}</a></li>;
                                                })}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="right">
                    {content}
                </div>
            </div>
        );
    }

    componentDidMount() {
        var self = this;

        fetch('https://blog.geekstylecn.com/menu')
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                json.forEach((mainMenu, index) => {
                    mainMenu.subMenuList.forEach((subMenu, subIndex) => {
                        subMenu.focused = "false";
                        subMenu.background = "#181c20";
                    });
                });
                self.setState({ menu: json });
                //console.log("state value:" + JSON.stringify(self.state.menu));
            }).catch(function (ex) {
                console.log('parsing failed', ex)
            })
    }

    handleClick = (id, url, e) => {
        var self = this;
        if (url === 'contentmanage') {
            self.setState({
                content: "editor"
            });
        } else {
            var menu = self.state.menu;
            menu.forEach((mainMenu, index) => {
                mainMenu.subMenuList.forEach((subMenu, subIndex) => {
                    if (subMenu.id === id) {
                        subMenu.focused = "true";
                        subMenu.background = "#020203";
                    } else {
                        subMenu.focused = "false";
                        subMenu.background = "#181c20";
                    }
                });
            });
            self.setState({
                contentUrl: url,
                content: "content",
                menu: menu
            });
        }

    }

}