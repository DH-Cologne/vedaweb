import React, { Component } from "react";
import { Row, Col, Icon, Input, Tooltip, Checkbox } from 'antd';

import stateStore from "../../../stateStore";
import { view } from 'react-easy-state';

import SearchAttributeField from "./SearchAttributeField";
import TransliterationPreview from "../../widgets/TransliterationPreview";

import OSK from "../../widgets/OSK";

import './SearchBlock.css';

//const Option = Select.Option;

// const distanceOptions = Array(10).fill(0).map((e, i) => (
//     i === 0 ? "none" : i + " token" + (i > 1 ? "s" : "")
// ));


class SearchBlock extends Component {


    render() {

        const transliterationTerm = (
            <TransliterationPreview
            input={this.props.term}
            transliteration={stateStore.settings.transliteration}/>
        );

        const transliterationLemma = (
            <TransliterationPreview
            input={this.props.lemma}
            transliteration={stateStore.settings.transliteration}/>
        );

        return (

                <Row type="flex" align="middle" className="search-block">
                    
                    <Col span={1}>
                        <div
                        className={'search-block-tab content-center' + (!this.props.showRemoveButton ? ' hidden' : '')}
                        onClick={() => this.props.onRemoveBlock(this.props.id)}>
                            <Icon type="close"/>
                        </div>
                    </Col>

                    <Col span={22} offset={1}>

                        <Row
                        type="flex"
                        align="middle"
                        justify="start">
                            <Col span={9}>Word Form (optional):</Col>
                            <Col span={9}>Lemma (optional):</Col>
                        </Row>

                        <Row
                        type="flex"
                        align="middle"
                        justify="start">

                            <Col span={9}>
                                <Tooltip
                                title={transliterationTerm}
                                overlayClassName="transliteration-tooltip"
                                trigger="focus"
                                placement="bottom">
                                    <Input
                                    value={this.props.term}
                                    onChange={e => stateStore.search.grammar.setTerm(this.props.id, e.target.value)}
                                    placeholder={"word form (optional)"}
                                    className="search-block-input"
                                    prefix={<OSK value={this.props.term} updateInput={v => stateStore.search.grammar.setTerm(this.props.id, v)}/>}
                                    style={{ width: '98%' }} />
                                </Tooltip>
                            </Col>

                            <Col span={9}>
                                <Tooltip
                                title={transliterationLemma}
                                overlayClassName="transliteration-tooltip"
                                trigger="focus"
                                placement="bottom">
                                    <Input
                                    value={this.props.lemma}
                                    onChange={e => stateStore.search.grammar.setLemma(this.props.id, e.target.value)}
                                    placeholder={"lemma (optional)"}
                                    className="search-block-input"
                                    prefix={<OSK value={this.props.lemma} updateInput={v => stateStore.search.grammar.setLemma(this.props.id, v)}/>}
                                    style={{ width: '98%' }} />
                                </Tooltip>
                            </Col>

                            <Col span={5} offset={1}>
                                <Checkbox
                                onChange={e => stateStore.search.grammar.setRequired(this.props.id, e.target.checked)}
                                checked={this.props.required} >
                                    required
                                </Checkbox>
                            </Col>

                        </Row>

                        {/**
                        <Row
                        type="flex"
                        align="middle"
                        justify="start"
                        className={this.props.isFirstBlock ? "hidden" : ""}>
                            <Col span={9} className="content-right">
                                <span className="secondary-font">Maximum distance to previous term:</span>
                            </Col>
                            <Col span={9} className="search-block-input">
                                <Select
                                value={this.props.distance}
                                onSelect={(value, o) => stateStore.search.grammar.updateDistance(this.props.id, value)}
                                disabled={this.props.isFirstBlock}
                                style={{ width: '100%' }} >
                                    {distanceOptions.map((e, i) => (
                                        <Option
                                        key={'distance_' + this.props.id + '_' + i}
                                        value={i}>{e}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={4}></Col>
                        </Row> */}

                        <Row
                        type="flex"
                        align="middle"
                        justify="start">
                            <Col span={9}>Grammar:</Col>
                        </Row>

                        {this.props.fields.map((field, i) => (
                            <SearchAttributeField
                            key={field.id}
                            id={field.id}
                            parentBlockId={this.props.id}
                            fieldName={field.name}
                            fieldValue={field.value}
                            isRemovable={this.props.fields.length > 1}
                            isLastField={this.props.fields.length < 6 && this.props.fields.length === i + 1}
                            grammarData={this.props.grammarData} />
                        ))}

                    </Col>

                </Row>
            
        );
    }
}

export default view(SearchBlock);