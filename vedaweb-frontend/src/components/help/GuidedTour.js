import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

import { Icon } from 'antd';
import Tour from '../help/Tour';


class GuidedTour extends Component {

    render() {

        const tourCheckpoints = [
            {
                id: "nav-browse",
                title: "Browse the Rigveda",
                text: "Jump right into one of the books using this button!",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "quick-search",
                title: "Quick search",
                text: "This is the Quick Search. It's always accessible at top of the page and lets you search text versions in many different, efficient ways. Click the help button to the right to learn about the details, as the quick search has plenty of useful features!",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "quick-search-osk",
                title: "ISO-15919 on-screen keyboard",
                text: "Our data is transliterated in ISO-15919. If you don't want to use Harvard-Kyoto or SLP1 as an intermediate transliteration scheme for your search, the Quick Search (and any other search input fields in VedaWeb) has this small button that toggles an on-screen keyboard to directly type ISO-15919 characters.",
                icon: <Icon type="edit"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "general-search-settings",
                title: "General search settings",
                text: "This lets you choose some general settings for your searches. These apply to every appropriate search feature throughout the application. Again, use the little help buttons if you aren't sure what the different options do.",
                icon: <Icon type="setting"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "content-location",
                title: "Stanza navigation",
                text: "You'll find this atop any data set you look at. By choosing a different location, you will be redirected to it. You can also click the arrows for next/previous stanza or even use the arrow keys on your keyboard!",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "toggle-content",
                title: "Select what you want to see",
                text: "By clicking here here, you can toggle on/off all the different kinds of views for the current data set!",
                icon: <Icon type="eye-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0"),
                noScroll: true
            },
            {
                id: "toggle-condensed-view",
                title: "Condensed reading view",
                text: "Toggle this to get a reduced, one-liner view, making it more comfortable to read and browse through the data.",
                icon: <Icon type="book"/>,
                execBefore: () => this.props.history.replace("/view/index/0"),
                noScroll: true
            },
            {
                id: "toggle-export",
                title: "Export stanza data",
                text: "Click here to choose an export format and download the currently selected data!",
                icon: <Icon type="export"/>,
                execBefore: () => this.props.history.replace("/view/index/0"),
                noScroll: true
            },
            {
                id: "nav-search",
                title: "Advanced search",
                text: "This is how you get to the advanced search modes (e.g. Grammar Search, Metrical Search). Let's have a look at what you can do there...",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "advanced-search-settings",
                title: "General search settings",
                text: "You know these already from the beginning of this tour. The same settings can be changed at the top of the page. They're here again just to emphasize the fact that these setting also apply to the search modes found under \"Advanced Search\"",
                icon: <Icon type="setting"/>,
                execBefore: () => this.props.history.replace("/search")
            },
            {
                id: "search-modes",
                title: "The search modes",
                text: "Here you can choose which one of the \"advanced\" search modes you want to use. The Grammar Search, for example, lets you define multiple word forms or lemmas with associated grammatical features to search for.",
                icon: <Icon type="search"/>,
                execBefore: () => this.props.history.replace("/search")
            },
            {
                id: "search-filters",
                title: "Additional search filters",
                text: "These filters apply to all of the \"advanced\" search modes. They help you to narrow down your search based on text sections or meta data.",
                icon: <Icon type="filter"/>,
                execBefore: () => this.props.history.replace("/search")
            },
            {
                id: "help-buttons",
                title: "The help buttons",
                text: "Don't forget to use the little help buttons you can find everywhere. They provide detailed information on all aspects of VedaWeb!",
                icon: <Icon type="question-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "nav-help",
                title: "Help & Instructions",
                text: "If you'd rather read all the help buttons' texts at once to get an overview of the apps features, the section \"Help & Instructions\" might, well, help and instruct you.",
                icon: <Icon type="question-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
            {
                id: "nav-tour",
                title: "That's about it",
                text: "Thank you for taking the guided tour! Whenever you want to repeat it, just click here!",
                icon: <Icon type="smile-o"/>,
                execBefore: () => this.props.history.replace("/view/index/0")
            },
        ];

        return (

            <Tour
            checkpoints={tourCheckpoints}
            enabled={this.props.enabled}
            onCloseTour={this.props.onCloseTour}
            bubbleTitleStyle={{fontSize: "110%", fontWeight: "normal", color: "#931111"}}
            bubbleIconStyle={{color: "#931111"}}
            config={{
                progressBarColor: "#931111",
            }}/>
            
        );
    }
}

export default withRouter(GuidedTour);