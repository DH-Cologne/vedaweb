package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.services.ElasticIndexService;
import de.unikoeln.vedaweb.services.JsonUtilService;
import de.unikoeln.vedaweb.services.UiDataService;



@RestController
@RequestMapping("api")
public class UiDataController {
	
	@Autowired
	private UiDataService uiDataService;
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Autowired
	private JsonUtilService json;
	
	@RequestMapping(value = "/uidata", produces = {"application/json"})
    public String getUiDataJSON() {
		return uiDataService.getUiDataJSON().toString();
    }

	@RequestMapping(value = "/uidata/count/stanzas/{book}/{hymn}", produces = {"application/json"})
    public String getHymnCountJSON(@PathVariable("book") int book, @PathVariable("hymn") int hymn) {
		ObjectNode response = json.newNode();
		response.put("count", indexService.countStanzas(book, hymn));
		return response.toString();
    }
	
}
