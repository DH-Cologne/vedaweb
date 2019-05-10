import React, { Component } from "react";
import { Table, Button, Modal } from 'antd';

import { withRouter } from 'react-router-dom';

import ErrorMessage from "../errors/ErrorMessage";

import './SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';

import stateStore from "../../stateStore";

import fileDownload from "js-file-download";
import RelevanceMeter from "./RelevanceMeter";

const fieldDisplayMapping = {
    "form": "Stanza text",
    "form_raw": "Stanza text",
    "translation": "Translation"
}


class SearchResults extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            isExportLoaded: true,
            isOccCountLoaded: true,
            occCount: null
        }
        document.title = "VedaWeb | Search Results";
        this.loadData = this.loadData.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleNewQuery = this.handleNewQuery.bind(this);
        this.export = this.export.bind(this);
        this.occCount = this.occCount.bind(this);
    }


    componentDidMount(){
        this.handleNewQuery(this.props.match.params.querydata);
    }


    componentDidUpdate(){
        if (stateStore.results.queryEncoded !== this.props.match.params.querydata)
            this.handleNewQuery(this.props.match.params.querydata);
    }


    handleTableChange(pagination, filters, sorter) {
        stateStore.results.sortBy = sorter.field ? sorter.field : null;
        stateStore.results.sortOrder = sorter.order ? sorter.order : null;
        stateStore.results.page = pagination.current;
        stateStore.results.size = pagination.pageSize;
        this.loadData(stateStore.results.queryJSON);
    }


    handleNewQuery(queryData) {
        //scroll to top
        window.scrollTo(0, 0);

        this.setState({ isLoaded: false });

        stateStore.results.queryEncoded = queryData;
        stateStore.results.page = 1;

        let queryJSON = {};

        try {
            queryJSON = JSON.parse(Base64.decode(queryData));
            //console.log(JSON.stringify(queryJSON)); //TEMP DEV
            queryJSON.from = 0;
            queryJSON.size = stateStore.results.size;
            queryJSON.sortBy = stateStore.results.sortBy;
            stateStore.results.queryJSON = queryJSON;
        } catch (e) {
            this.setState({
                isLoaded: true,
                error: "Invalid search data."
            });
            return;
        }

        this.loadData(queryJSON);
    }


    loadData(queryJSON) {
        if (!queryJSON) queryJSON = stateStore.results.queryJSON;

        //construct "Search Results for ..." data
        let queryDisplay = {
            query: queryJSON.mode === "grammar"
                ? "[" + queryJSON.blocks.map(b =>
                    Object.keys(b).filter(k => k !== 'distance' && k !== 'lemma' && b[k] !== undefined && b[k] !== '')
                        .map(k => k + ': ' + b[k]).join(', ')).join('] & [') + "]"
                : queryJSON.input,
            field:  queryJSON.mode === "grammar" ? "grammar data"
                : stateStore.ui.layers.find(l => l.id === queryJSON.field).label
        };

        //enable view for searched field automatically
        if (queryJSON.mode === "quick")
            stateStore.ui.toggleLayer(queryJSON.field, true);
        else if (queryJSON.mode === "grammar")
            stateStore.ui.toggleLayer("glossing_", true);
            
        this.setState({
            isLoaded: false,
            error: undefined,
            queryDisplay: queryDisplay
        });

        //set page title
        document.title = "VedaWeb | Search Results for '" + queryDisplay.query + "'";

        //pagination and request size
        queryJSON.from = ((stateStore.results.page - 1) * stateStore.results.size);
        queryJSON.size = stateStore.results.size;

        //sorting
        queryJSON.sortBy = stateStore.results.sortBy;
        queryJSON.sortOrder = stateStore.results.sortOrder;

        //console.log(queryJSON);

        //request search api data
        axios.post(process.env.PUBLIC_URL + "/api/search", queryJSON)
            .then((response) => {
                //console.log(JSON.stringify(response.data));
                stateStore.results.resultsData = response.data;
                stateStore.results.total = response.data.total;
                stateStore.results.maxScore = response.data.maxScore;
                
                this.setState({
                    isLoaded: true,
                    tableData: response.data.hits === undefined ? {} :
                        response.data.hits.map( (hit, i) => ({
                            key: 'result_' + i,
                            _doc: hit.docId,
                            context: <div dangerouslySetInnerHTML={this.createHighlightHTML(hit)}></div>,
                            hymnAddressee: hit.hymnAddressee,
                            hymnGroup: hit.hymnGroup,
                            strata: hit.stanzaStrata,
                            _score: hit.score
                        }))
                });

                stateStore.results.queryJSON = queryJSON;
                window.scrollTo(0, 0);
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }


    createHighlightHTML(hit) {
        let html = "";

        if (hit.highlight !== undefined && Object.keys(hit.highlight).length > 0){
            Object.keys(hit.highlight).forEach(highlightField => {
                html +=
                    "<span class='red text-font bold'>" +
                    (fieldDisplayMapping[highlightField] !== undefined ? fieldDisplayMapping[highlightField] : highlightField) +
                    ":</span> " +
                    hit.highlight[highlightField]
                    + "<br/>";
            });
        } else {
            html += "<i>no preview available</i>";
        }

        return {__html: html};
    }


    onResultClick(location){
        this.props.history.push("/view/id/" + location);
    }


    export(){
        this.setState({ isExportLoaded: false });

        axios.post(process.env.PUBLIC_URL + "/api/export/search", stateStore.results.queryJSON)
            .then((response) => {
                this.setState({
                    isExportLoaded: true
                });
                fileDownload(response.data, "vedaweb-search-results.csv");
            })
            .catch((error) => {
                this.setState({
                    isExportLoaded: true
                });
                Modal.error({ title: 'Error', content: 'There was an error generating the data', okText: 'OK' });
            });
    }


    occCount(){
        this.setState({ isOccCountLoaded: false });

        axios.post(process.env.PUBLIC_URL + "/api/search/occ", stateStore.results.queryJSON)
            .then((response) => {
                this.setState({
                    isOccCountLoaded: true,
                    occCount: response.data.count
                });
            })
            .catch((error) => {
                this.setState({
                    isOccCountLoaded: true,
                    occCount: null
                });
                Modal.error({ title: "Error", content: 'There was an error generating the data', okText: 'OK' });
            });
    }


    occCountAvailable(){
        return stateStore.results.queryJSON.mode === "grammar"
            && stateStore.results.queryJSON.blocks.length === 1;
    }


    render() {

        const { error, isLoaded } = this.state;
        const data = stateStore.results.resultsData;

        //define table columns
        const columns = [{
            title: 'Location',
            dataIndex: '_doc',
            key: '_doc',
            className: 'loc-col',
            sorter: true,
            render: loc => <span className="primary-font bold red">{loc}</span>,
          }, {
            title: 'Context',
            dataIndex: 'context',
            key: 'context',
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Addressee',
            dataIndex: 'hymnAddressee',
            key: 'hymnAddressee',
            sorter: true,
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Group',
            dataIndex: 'hymnGroup',
            key: 'hymnGroup',
            sorter: true,
            render: content => <span className="text-font">{content}</span>
          }, {
            title: 'Strata',
            dataIndex: 'strata',
            key: 'strata',
            sorter: true,
            
          }, {
            title: 'Relevance',
            dataIndex: '_score',
            key: '_score',
            render: content => <RelevanceMeter max={stateStore.results.maxScore} value={content}/>
          }];
          
        return (

                <div className="page-content">

                    {/** ERROR **/}
                    { isLoaded && error !== undefined &&
                        <ErrorMessage/>
                    }

                    {/** SEARCH RESULT VIEW **/}
                    { error === undefined &&

                        <div id="search-results" className="card">

                            {/** SEARCH RESULTS HEADING **/}

                            { this.state.queryDisplay !== undefined &&
                                <h1>
                                    Search Results for
                                    <span className="text-font grey"> "{this.state.queryDisplay.query}" </span>
                                    in<span className="text-font grey"> "{this.state.queryDisplay.field}"</span>

                                    {/** EXPORT AND OCCURRENCES FUNCTIONS **/}
                                    <Button
                                    type="secondary"
                                    icon={this.state.isExportLoaded ? "export" : "loading"}
                                    onClick={this.export}
                                    title="Export results as CSV"
                                    style={{marginLeft:"1rem", float:"right"}}/>
                                    {this.occCountAvailable() &&
                                        <Button
                                        type="secondary"
                                        icon={!this.state.isOccCountLoaded ? "loading" : !this.state.occCount ? "bar-chart" : null}
                                        children={this.state.occCount}
                                        disabled={this.state.isOccCountLoaded && this.state.occCount}
                                        onClick={this.occCount}
                                        title="Request occurrences info for this search"
                                        style={{marginLeft:"1rem", float:"right"}}/>
                                    }
                                </h1>
                            }


                            {/** SEARCH META INFO **/}
                            
                            <div className="search-stats secondary-font bottom-gap top-gap">
                                { isLoaded && data.hits !== undefined ?
                                    data.total > 0 ?
                                        <span>
                                            Found <span className="bold">{data.total}</span> matching stanzas in { data.took } ms
                                        </span> : ""
                                     : <span>Searching ...</span>
                                }
                            </div>


                            {/** DISPLAY SEARCH RESULTS TABLE **/}

                            <Table
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={!this.state.isLoaded}
                            locale={{emptyText: 'There are no results for this search.'}}
                            onRow={(record) => ({ onClick: () => { this.onResultClick(record.location) } })}
                            sortDirections={['ascend', 'descend']}
                            pagination={{
                                pageSize: stateStore.results.size,
                                current: stateStore.results.page,
                                total: stateStore.results.total,
                                position: 'both',
                                showSizeChanger: true,
                                pageSizeOptions: ['10','25','50','100']
                            }}
                            onChange={this.handleTableChange} />

                        </div>
                    }
                </div>
        );
    }

}

export default withRouter(view(SearchResults));