package de.unikoeln.vedaweb.search.metrical;

import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.AbstractSearchData;
import io.swagger.annotations.ApiModelProperty;


public class MetricalSearchData extends AbstractSearchData {
	
	@JsonProperty("input")
	@ApiModelProperty(notes = "Search input field value")
	private String input;
	
	@JsonProperty("field")
	@ApiModelProperty(notes = "Text version field to search in",
		example = "'version_' for all versions, 'translation_' for all translations")
	private String field;


	public String getInput() {
		return input;
	}


	public void setInput(String input) {
		this.input = input.trim();
	}
	
	
	public String getField() {
		return field;
	}


	public void setField(String field) {
		this.field = field;
	}


	@Override
	public String toString() {
		return "QuickSearch:" + (input != null ? " input:" + input : "");
	}
	
}