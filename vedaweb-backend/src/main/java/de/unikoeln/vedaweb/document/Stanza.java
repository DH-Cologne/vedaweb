package de.unikoeln.vedaweb.document;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import io.swagger.annotations.ApiModelProperty;

/**
 * Stanza POJO
 * 
 * @author bkis
 *
 */
@Document(collection="stanzas")
public class Stanza implements Comparable<Stanza> {
	
	@Id
	@ApiModelProperty(notes = "Auto-generated ID based on stanza location (e.g. 0200304 for 02.003.04)")
	private String id;
	
	@ApiModelProperty(notes = "Internal index number of this stanza")
	private int index;
	
	@ApiModelProperty(notes = "Rigveda book number")
	private int book;
	
	@ApiModelProperty(notes = "Rigveda hymn number (relative to book)")
	private int hymn;
	
	@ApiModelProperty(notes = "Rigveda stanza number (relative to hymn)")
	private int stanza;
	
	@ApiModelProperty(notes = "Rigveda hymn number (absolute)")
	private int hymnAbs;
	
	@ApiModelProperty(notes = "Addressee of the hymn containing this stanza")
	private String hymnAddressee;
	
	@ApiModelProperty(notes = "Hymn group the hymn containing this stanza belongs to")
	private String hymnGroup;
	
	@ApiModelProperty(notes = "Strata property of this stanza")
	private String strata;
	
	@ApiModelProperty(notes = "List of late additions")
	private List<String> lateAdditions;
	
	@ApiModelProperty(notes = "Stanza type (via metrical analysis)")
	private String stanzaType;
	
	@ApiModelProperty(notes = "References to relevant external resources")
	private List<ExternalResource> externalResources;
	
//	@ApiModelProperty(notes = "Metrical data for this stanza based on Lubotsky (Zurich)")
//	private String[] metricalData;
	
	@ApiModelProperty(notes = "List of pada objects containing the grammar data for each pada's tokens")
	private List<Pada> padas;
	
	@ApiModelProperty(notes = "List of versions of this stanza (text versions and translations)")
	private List<StanzaVersion> versions;
	
	
	public Stanza(){
		versions = new ArrayList<StanzaVersion>();
		padas = new ArrayList<Pada>();
	}
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public int getBook() {
		return book;
	}

	public void setBook(int book) {
		this.book = book;
	}

	public int getHymn() {
		return hymn;
	}

	public void setHymn(int hymn) {
		this.hymn = hymn;
	}

	public int getStanza() {
		return stanza;
	}

	public void setStanza(int stanza) {
		this.stanza = stanza;
	}
	
	public int getHymnAbs() {
		return hymnAbs;
	}

	public void setHymnAbs(int hymnAbs) {
		this.hymnAbs = hymnAbs;
	}


	public String getHymnAddressee() {
		return hymnAddressee;
	}
	
	public void setHymnAddressee(String hymnAddressee) {
		this.hymnAddressee = hymnAddressee;
	}

	public String getHymnGroup() {
		return hymnGroup;
	}

	public void setHymnGroup(String hymnGroup) {
		this.hymnGroup = hymnGroup;
	}
	
	public String getStrata() {
		return strata;
	}

	public void setStrata(String strata) {
		this.strata = strata;
	}
	
	public List<String> getLateAdditions() {
		return lateAdditions;
	}

	public void setLateAdditions(List<String> lateAdditions) {
		this.lateAdditions = lateAdditions;
	}

	public void addLateAddition(String lateAddition) {
		if (lateAdditions == null)
			lateAdditions = new ArrayList<String>();
		lateAdditions.add(lateAddition);
	}
	
	public String getStanzaType() {
		return stanzaType;
	}

	public void setStanzaType(String stanzaType) {
		this.stanzaType = stanzaType;
	}

//	public List<StanzaVersion> getTranslations(){
//		List<StanzaVersion> translations = new ArrayList<StanzaVersion>();
//		for (StanzaVersion vv : versions)
//			if (vv.getType().equals("translation"))
//				translations.add(vv);
//		return translations;
//	}
	
//	public String[] getMetricalData() {
//		return metricalData;
//	}
//
//
//	public void setMetricalData(String[] metricalData) {
//		this.metricalData = metricalData;
//	}


	public List<ExternalResource> getExternalResources() {
		return externalResources;
	}

	public void setExternalResources(List<ExternalResource> externalResources) {
		this.externalResources = externalResources;
	}
	
	public void addExternalResource (ExternalResource externalResource) {
		if (externalResources == null)
			externalResources = new ArrayList<ExternalResource>();
		externalResources.add(externalResource);
	}

	public List<StanzaVersion> getVersions() {
		return versions;
	}
	
	public void addVersion(StanzaVersion version) {
		if (version != null) versions.add(version);
	}
	
	public List<Pada> getPadas() {
		return padas;
	}

	public void setPadas(List<Pada> padas) {
		this.padas = padas;
	}
	
	public void addPada(Pada pada) {
		padas.add(pada);
	}
	
	/**
	 * Returns the location notation of this stanza
	 * in the form "01.001.01"
	 * @return
	 */
	public String getLocation() {
		return String.format("%1$02d.%2$03d.%3$02d",
				getBook(), getHymn(), getStanza());
	}

	@Override
	public String toString() {
		return index + ";" + id + ";" + getLocation() + ":\t" +
				"(" + hymnAddressee + " / " + hymnGroup + ")\t" + versions;
	}

	@Override
	public int compareTo(Stanza o) {
		return id.compareTo(o.getId());
	}
	
}
