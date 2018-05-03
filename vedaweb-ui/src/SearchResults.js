import React, { Component } from "react";
import { Table } from 'antd';
import Spinner from "./Spinner";

import { Link, withRouter } from 'react-router-dom';

import './css/SearchResults.css';

import { view } from 'react-easy-state';

import axios from 'axios';
import { Base64 } from 'js-base64';


class SearchResults extends Component {


    constructor(props) {
        super(props)
        this.state ={
            data: {},
            isLoaded: false
        }
    }

    componentDidMount(){
        this.loadData(this.props.match.params.querydata);
    }

    componentWillReceiveProps(newProps){
        this.loadData(newProps.match.params.querydata);
    }

    loadData(queryData){
        let queryJson = {};

        try {
            queryJson = JSON.parse(Base64.decode(queryData));
        } catch (e) {
            this.setState({
                isLoaded: true,
                error: "Invalid search data."
            });
            return;
        }

        console.log("QUERY: " + JSON.stringify(queryJson));

        this.setState({
            isLoaded: false,
            error: undefined
        });

        if (queryJson.hasOwnProperty("smart")){
            this.loadSmartSearchData(queryJson);
        } else {
            this.loadAdvancedSearchData(queryJson);
        }
    }

    loadSmartSearchData(queryJson){
        axios.get("/api/search/smart/" + queryJson.smart)
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }

    loadAdvancedSearchData(queryJson){
        axios.get("/api/search/smart/blablabla")
            .then((response) => {
                this.setState({
                    isLoaded: true,
                    data: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }


    render() {

        const { error, isLoaded, data } = this.state;

        console.log(JSON.stringify(data));

        //define table columns
        const columns = [{
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: loc => <Link to={"/view/id/" + loc}>{loc}</Link>,
          }, {
            title: 'Text',
            dataIndex: 'text',
            key: 'text'
          }, {
            title: 'Relevance',
            dataIndex: 'relevance',
            key: 'relevance'
          }];
          
        //map table data
        const tableData = data.hits === undefined ? {} :
            data.hits.hits.map( (hit, i) => ({
                key: 'result_' + i,
                location:   
                    (hit._source.book + "").padStart(2, "0") + "." +
                    (hit._source.hymn + "").padStart(3, "0") + "." +
                    (hit._source.verse + "").padStart(2, "0"),
                text: hit._source.form,
               // text: hit.highlight.form[0],  // <---- how to force react to render this???
                relevance: hit._score
            }));

            

        return (

            <div className="page-content">
                <div id="search-results" className="content card">

                    <h4>Search Results</h4>

                    {/** LOADING SPINNER **/}
                    {!isLoaded &&
                        <Spinner/>
                    }

                    {/** ERROR **/}
                    {isLoaded && error !== undefined &&
                        <div className="card">
                            There was an error requesting this data: {error}
                        </div>
                    }

                    {/** SEARCH STATS **/}
                    { isLoaded && error === undefined && data.hits.hits !== undefined &&
                        <div className="search-stats bottom-gap">
                            Hits: {data.hits.hits.length} &mdash; Took: {data.took} ms
                        </div>
                    }

                    {/** RESULTS **/}
                    { isLoaded
                        && error === undefined
                        && data.hits.hits !== undefined
                        && data.hits.hits.length > 0 &&
                        
                        //JSON.stringify(data.hits.hits)

                        <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false} />
                    }

                    {/** NO RESULTS **/}
                    { isLoaded
                        && error === undefined
                        && data.hits.hits !== undefined
                        && data.hits.hits.length === 0 &&
                        
                        "Sorry, there are no results for this search."
                    }

                </div>
            </div>
        );
    }

}

export default withRouter(view(SearchResults));