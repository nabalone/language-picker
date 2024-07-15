import { LanguageData } from "@languagepicker/ethnolib";
import {
  filterScripts,
  substituteInSpecialEntry,
} from "./modifySearchResultUtils";

export function bloomModifySearchResults(
  results: LanguageData[]
): LanguageData[] {
  let modifiedResults = simplifyEnglish(results);
  modifiedResults = filterScripts(scriptFilter, modifiedResults);
  return modifiedResults;
}

const simpleEnglishResult: LanguageData = {
  autonym: "English",
  code: "eng",
  regionNames: "",
  regionCodes: [],
  names: "English",
  scripts: ["Latin"],
};
function simplifyEnglish(results: LanguageData[]): LanguageData[] {
  return substituteInSpecialEntry(simpleEnglishResult, results);
}

const SCRIPTS_TO_EXCLUDE = new Set([
  "Brai",
  "Zyyy",
  "Zxxx",
  "Zinh",
  "Zmth",
  "Zsye",
  "Zsym",
]);
const scriptFilter = (script: string) => !SCRIPTS_TO_EXCLUDE.has(script);

// function filterLangCodes(langCode: string): boolean {
