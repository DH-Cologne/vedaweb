package de.unikoeln.vedaweb.util;

import java.text.Normalizer;
import java.text.Normalizer.Form;

/**
 * Utility class for project specific string operations
 * 
 * @author bkis
 *
 */
public class StringUtils {
	
//	private static final String REGEX_VOWEL_W_ACCENT =
//			"([aeiourAEIOUR]\\P{L}*?)[\\u0301\\u0300]";
	
	public static int normalizeIndex(int index, int docCount){
		if (index < 0)
			index = docCount + index;
		else if (index >= docCount)
			index = index - docCount;
		return index;
	}
	
	
	public static boolean containsAccents(String text) {
		if (text == null) return false;
		text = normalizeNFC(text);
		for (String va : IsoChars.VOWELS_WITH_TO_NO_ACCENTS_NFC.keySet()) {
			if (text.contains(normalizeNFC(va))) return true;
		}
	    return false;
	}
	
	
	public static String removeVowelAccents(String text) {
		if (text == null) return text;
		text = normalizeNFC(text);
		for (String va : IsoChars.VOWELS_WITH_TO_NO_ACCENTS_NFC.keySet()) {
			text = text.replaceAll(va, IsoChars.VOWELS_WITH_TO_NO_ACCENTS_NFC.get(va));
		}
		return normalizeNFC(text);
	}
	
	
//	public static boolean containsAccents(String text) {
//		if (text == null) return false;
//	    return normalizeNFD(text).matches(".*" + REGEX_VOWEL_W_ACCENT + ".*");
//	}
//	
//	
//	public static String removeVowelAccents(String text) {
//		if (text == null) return text;
//		return normalizeNFC(
//			normalizeNFD(text)
//				.replaceAll(REGEX_VOWEL_W_ACCENT, "$1")
//		);
//	}
	
	
	public static String normalizeNFC(String s){
		return s == null ? "" :
			Normalizer.normalize(s, Form.NFC);
	}
	
	
	public static String normalizeNFD(String s){
		return s == null ? "" :
			Normalizer.normalize(s, Form.NFD);
	}


	public static String removeMetaChars(String form) {
		return form.replaceAll("[\\/\\_\\+\\}\\=\\{\\-\\\\]", "");
	}
	
	
	public static String cleanLemma(String in) {
		return in
			.replaceAll("\\u221A", "") // √ square root symbol
			.replaceAll("~", "") // Tilde ~
			.replaceAll("-(?=(\\s|$))", "") // hyphen followed by space or at end of string
			.replaceAll("\\s+", " ") // replace multiple spaces by single space
			.trim()
			;
	}
	
	public static String retainLatinBaseChars(String in) {
		return normalizeNFC(
				normalizeNFD(in)
				.replaceAll("[^a-zA-Z]", "")
			);
	}
	

}
