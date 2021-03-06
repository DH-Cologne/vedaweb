import React, { Component } from "react";
import { Row, Col, Button, Icon, Tabs, Collapse, Checkbox } from 'antd';

import SearchGrammar from "./grammar/SearchGrammar";
import SearchMetrical from "./metrical/SearchMetrical";
import SearchMetricalPosition from "./metricalPosition/SearchMetricalPosition";
import SearchScopeContainer from "./settings/SearchScopeContainer";
import SearchTransliteration from "./settings/SearchTransliteration";
import SearchScopeIndicator from "./settings/SearchScopeIndicator";
import SearchMetaFilterList from "./settings/SearchMetaFilterList";
import HelpButton from "../help/HelpButton";

import './SearchView.css';

import { view } from 'react-easy-state';

import { withRouter } from 'react-router-dom';
import { Base64 } from 'js-base64';

import stateStore from "../../stateStore";

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

class SearchView extends Component {

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        document.title = "VedaWeb | Advanced Search";
    }

    handleSubmit(e){
        let query = stateStore.search[stateStore.search.meta.mode].getQuery();
        query.mode = stateStore.search.meta.mode;
        query.scopes = stateStore.search.meta.scopes;
        query.meta = stateStore.search.meta.meta;
        query.accents = stateStore.settings.accents;

        query.scopes = query.scopes.filter(scope => (
            (scope.fromBook + scope.toBook + scope.fromHymn + scope.toHymn) > 0
        ));
        
        this.props.history.push("/results/" + Base64.encodeURI(JSON.stringify(query)));
        e.preventDefault();
    }

    handleReset(e){
        stateStore.search.meta.reset();
        stateStore.search.grammar.reset();
        stateStore.search.metrical.reset();
        stateStore.search.metricalPosition.reset();
    }


    render() {

        const customPanelStyle = {
            background: '#fafafa',
            borderRadius: 2,
            marginBottom: 24,
            border: '1px solid #b4b1ae',
            overflow: 'hidden',
            fontSize: '18px'
        };

        const searchScopePanelHeader =
            <div>
                {"Delimit Search Range: "}
                <span className="red">
                    <SearchScopeIndicator />
                </span>
            </div>

        const customMetaFilterPanelHeader =
            <div>
                Meta Filters: 
                <HelpButton align="right" type="searchMetaFilters" style={{margin:"0 .3rem"}} inline/> 
                {stateStore.search.meta.hasMetas() ?
                    <span className="red">
                        {" "}
                        Adressee ({stateStore.search.meta.meta.hymnAddressee.length}),
                        Group ({stateStore.search.meta.meta.hymnGroup.length}),
                        Strata ({stateStore.search.meta.meta.strata.length}),
                        Type ({stateStore.search.meta.meta.stanzaType.length}),
                        Addition ({stateStore.search.meta.meta.lateAdditions.length})
                    </span>
                    : <span className="red"> none</span>
                }
            </div>

        return (

            <Row
            type="flex"
            justify="center"
            id="search-view"
            className="page-content"
            key="search-view">

                <Col xl={14} lg={18} md={20} sm={24}>
                    <div className="card">
                        <h1>Advanced Search</h1>

                        <div data-tour-id="advanced-search-settings">
                            <h3 className="top-gap-big">
                                <Icon type="setting" className="gap-right"/>
                                General search settings
                            </h3>
                            <Row className="bottom-gap">
                                <Col span={8}>
                                    Input transliteration:
                                    <HelpButton inline type="transliteration" style={{marginLeft: '.5rem'}} />
                                </Col>
                                <Col span={16}>
                                    <SearchTransliteration/>
                                </Col>
                            </Row>
                            <Row className="bottom-gap">
                                <Col span={8}>
                                    Accent-sensitive search:
                                    <HelpButton inline type="accentSensitive" style={{marginLeft: '.5rem'}} />
                                </Col>
                                <Col span={16}>
                                    <Checkbox
                                    onChange={e => stateStore.settings.accents = e.target.checked}
                                    checked={stateStore.settings.accents} >
                                        Accent-sensitive
                                    </Checkbox>
                                </Col>
                            </Row>
                        </div>

                        <form onSubmit={this.handleSubmit}>

                            <h3 className="top-gap-big"><Icon type="search" className="gap-right"/>Advanced Search Modes</h3>

                            <Tabs
                            data-tour-id="search-modes"
                            onChange={(key) => stateStore.search.meta.mode = key}
                            activeKey={stateStore.search.meta.mode}
                            type="card"
                            id="search-mode-selector"
                            tabBarGutter={8}
                            className="bottom-gap">
                                <TabPane tab="Grammar" key="grammar">
                                    <SearchGrammar />
                                </TabPane>
                                <TabPane tab="Metrical Pattern" key="metrical">
                                    <SearchMetrical />
                                </TabPane>
                                <TabPane tab="Metrical Position" key="metricalPosition">
                                    <SearchMetricalPosition />
                                </TabPane>
                            </Tabs>

                            <h3 className="top-gap"><Icon type="filter" className="gap-right"/>Additional search filters</h3>

                            <div data-tour-id="search-filters">
                                <Collapse
                                bordered={false}
                                style={{backgroundColor: "transparent"}}>
                                    <Panel
                                    header={searchScopePanelHeader}
                                    key="scope"
                                    style={customPanelStyle}
                                    forceRender={true}>
                                        <HelpButton align="left" type="searchScope" />
                                        <SearchScopeContainer/>
                                    </Panel>

                                    <Panel
                                    header={customMetaFilterPanelHeader}
                                    key="metafilters"
                                    style={customPanelStyle} >
                                        <SearchMetaFilterList
                                        label="Hymn Addressee"
                                        placeholder="Any Addressee"
                                        items={stateStore.ui.meta.hymnAddressee}
                                        selected={stateStore.search.meta.meta.hymnAddressee}
                                        handleChange={v => {stateStore.search.meta.meta.hymnAddressee = v}}
                                        helpButtonId="metaAdrGroup" />
                                        <SearchMetaFilterList
                                        label="Hymn Group"
                                        placeholder="Any Group"
                                        items={stateStore.ui.meta.hymnGroup}
                                        selected={stateStore.search.meta.meta.hymnGroup}
                                        handleChange={v => {stateStore.search.meta.meta.hymnGroup = v}}
                                        helpButtonId="metaAdrGroup" />
                                        <SearchMetaFilterList
                                        label="Stanza Strata"
                                        placeholder="Any Strata"
                                        items={stateStore.ui.meta.strata}
                                        itemLabels={stateStore.ui.abbreviations.strata}
                                        selected={stateStore.search.meta.meta.strata}
                                        handleChange={v => {stateStore.search.meta.meta.strata = v}}
                                        helpButtonId="metaStrata" />
                                        <SearchMetaFilterList
                                        label="Stanza Type"
                                        placeholder="Any Stanza Type"
                                        items={stateStore.ui.meta.stanzaType}
                                        itemLabels={stateStore.ui.abbreviations.stanzaType}
                                        selected={stateStore.search.meta.meta.stanzaType}
                                        handleChange={v => {stateStore.search.meta.meta.stanzaType = v}}
                                        helpButtonId="metaStanzaType" />
                                        <SearchMetaFilterList
                                        label="Late Addition"
                                        placeholder="Not specified"
                                        items={stateStore.ui.meta.lateAdditions}
                                        selected={stateStore.search.meta.meta.lateAdditions}
                                        handleChange={v => {stateStore.search.meta.meta.lateAdditions = v}}
                                        helpButtonId="lateAdditions" />
                                    </Panel>
                                </Collapse>
                            </div>

                            <Row>
                                <Col span={24} className="content-right">
                                    <Button
                                    icon="delete"
                                    size="large"
                                    className={"secondary-font"}
                                    htmlType="reset"
                                    onClick={this.handleReset}>
                                        Reset
                                    </Button>

                                    <Button
                                    type="primary"
                                    icon="search"
                                    size="large"
                                    htmlType="submit"
                                    className={"secondary-font gap-left-big"}
                                    onClick={this.handleSubmit}>
                                        Search
                                    </Button>
                                </Col>
                            </Row>

                        </form>
                    
                    </div>
                </Col>
            </Row>
        );

    }

}

export default withRouter(view(SearchView));