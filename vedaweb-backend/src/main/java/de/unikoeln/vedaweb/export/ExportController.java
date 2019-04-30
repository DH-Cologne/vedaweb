package de.unikoeln.vedaweb.export;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.document.StanzaXmlRepository;
import de.unikoeln.vedaweb.search.ElasticSearchService;
import de.unikoeln.vedaweb.search.SearchData;
import de.unikoeln.vedaweb.search.SearchHitsConverter;

@RestController
@RequestMapping("api/export")
public class ExportController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private StanzaXmlRepository repo;
	
	
	@PostMapping(value = "/search", produces = MediaType.TEXT_PLAIN_VALUE)
    public String exportSearchCSV(@RequestBody SearchData searchData) {
		searchData.setSize(20000);	//get ALL results
		return CsvExport.searchHitsAsCsv(
				SearchHitsConverter.processSearchResponse(
						search.search(searchData)));
    }
	
	@GetMapping(value = "/doc/{docId}/xml", produces = MediaType.TEXT_XML_VALUE)
    public String exportDoc(@PathVariable("docId") String docId) {
		return repo.findById(docId).get().getXml();
    }

}