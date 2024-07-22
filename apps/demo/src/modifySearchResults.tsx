import {
  LanguageData,
  ScriptData,
  fieldsToSearch,
} from "@languagepicker/ethnolib";
import { FuseResult } from "fuse.js";

import { cloneDeep } from "lodash";

export const START_OF_MATCH = "[";
export const END_OF_MATCH = "]";

function demarcateResults(results: FuseResult<LanguageData>[]) {
  const resultsCopy = cloneDeep(results);
  for (const result of resultsCopy) {
    for (const match of result.matches) {
      let lastTrasnferredIndex = 0;
      const newValue = [];
      for (const [matchStart, matchEnd] of match.indices) {
        newValue.push(match.value.slice(lastTrasnferredIndex, matchStart));
        newValue.push(START_OF_MATCH);
        newValue.push(match.value.slice(matchStart, matchEnd + 1));
        newValue.push(END_OF_MATCH);
        lastTrasnferredIndex = matchEnd + 1;
      }
      newValue.push(match.value.slice(lastTrasnferredIndex));
      result.item[match.key] = newValue.join("");
    }
  }
  return resultsCopy;
}

export function stripDemarcation(str: string): string {
  if (!str) return str;
  return str.replaceAll(START_OF_MATCH, "").replaceAll(END_OF_MATCH, "");
}

export function stripResultMetadata(
  results: FuseResult<LanguageData>[]
): LanguageData[] {
  return results.map((result) => result.item);
}

export function filterScripts(
  scriptFilter: (value: ScriptData) => boolean,
  results: LanguageData[]
): LanguageData[] {
  return results.map((result) => ({
    ...result,
    scripts: result.scripts.filter(scriptFilter),
  }));
}

const SCRIPT_CODES_TO_EXCLUDE = new Set([
  "Brai",
  "Zyyy",
  "Zxxx",
  "Zinh",
  "Zmth",
  "Zsye",
  "Zsym",
]);

const scriptFilter = (script: ScriptData) =>
  !SCRIPT_CODES_TO_EXCLUDE.has(script.code);

export function bloomModifySearchResults(
  results: FuseResult<LanguageData>[],
  searchString: string
): LanguageData[] {
  let modifiedResults = demarcateResults(results);
  modifiedResults = stripResultMetadata(modifiedResults);
  modifiedResults = prioritizeLangByKeywords(
    ["english"],
    searchString,
    "eng",
    modifiedResults
  );
  modifiedResults = prioritizeLangByKeywords(
    ["french", "francais", "français"],
    searchString,
    "fra",
    modifiedResults
  );
  modifiedResults = simplifyEnglishResult(searchString, modifiedResults);
  modifiedResults = simplifyFrenchResult(searchString, modifiedResults);
  modifiedResults = filterSpecialEntries(modifiedResults);
  modifiedResults = filterScripts(scriptFilter, modifiedResults);
  return modifiedResults;
}

const latinScriptData = { code: "Latn", name: "Latin" } as ScriptData;

// Replace the English result with a simpler version that only has "English" and the code on it
function simplifyEnglishResult(
  searchString: string,
  results: LanguageData[]
): LanguageData[] {
  return results.map((result) =>
    codeMatches(result.code, "eng")
      ? demarcateExactMatches(searchString, {
          autonym: undefined, // because exonym is mandatory and we don't want to repeat it
          exonym: result.exonym, // "English",
          code: "eng",
          regionNames: "",
          regionCodes: [],
          names: "",
          scripts: [latinScriptData],
        } as LanguageData)
      : result
  );
}

// Replace the French result with a simpler version that only has "Francais", "French" and the code on it
function simplifyFrenchResult(
  searchString: string,
  results: LanguageData[]
): LanguageData[] {
  return results.map((result) =>
    codeMatches(result.code, "fra")
      ? demarcateExactMatches(searchString, {
          autonym: result.autonym, // this will be "Français", but we want to keep demarcation in case user typed "Francais"
          exonym: result.exonym, // "French"
          code: "fra",
          regionNames: "",
          regionCodes: [],
          names: "",
          scripts: [latinScriptData],
        } as LanguageData)
      : result
  );
}

// Compare codes, ignoring any demarcation or casing
function codeMatches(code1: string, code2: string) {
  return (
    code1.replace(START_OF_MATCH, "").replace(END_OF_MATCH, "") ===
    code2.replace(START_OF_MATCH, "").replace(END_OF_MATCH, "")
  );
}

export function substituteInSpecialEntry(
  specialEntry: LanguageData,
  results: LanguageData[]
): LanguageData[] {
  return results.map((result) =>
    result.code === specialEntry.code ? specialEntry : result
  );
}

export function filterLangCodes(
  langCodeFilter: (value: string) => boolean,
  results: LanguageData[]
): LanguageData[] {
  return results.filter((result) => langCodeFilter(result.code));
}

const NOT_A_LANGUAGE_ENTRY_CODES = new Set([
  "mis", //Uncoded languages
  "mul", // Multiple languages
  "zxx", // no linguistic content
  "und", // Undetermined
]);

const ANCIENT_LANGUAGE_ENTRY_CODES = new Set([
  "ang", // Old English
  "enm", // Middle English
  "fro", // Old French
  "frm", // Middle French
  "oko", // old korean
  "sga", // Old Irish
  "goh", // Old High German
  "peo", // Old Persian
  // TODO there are a bunch more - search for things like (to 1500), (up to 700), BCE, B.C., ca., etc
]);

const OTHER_EXCLUDED_LANGUAGE_CODES = new Set([
  "frc", // Francais cadien/Cajun french/Louisiana french, spoken in the U.S.
  // TODO not sure if this is okay to exclude but seems like it will cause confusion
]);

export function filterSpecialEntries(results: LanguageData[]): LanguageData[] {
  return filterLangCodes(
    (code) =>
      !NOT_A_LANGUAGE_ENTRY_CODES.has(code) &&
      !ANCIENT_LANGUAGE_ENTRY_CODES.has(code) &&
      !OTHER_EXCLUDED_LANGUAGE_CODES.has(code),
    results
  );
}

// if user starts typing keyword, lang should come up first. Note that this re-orders results but does not add any new results; if lang is not in the fuzzy-match results no change will be made
function prioritizeLangByKeywords(
  keywords: string[],
  searchString: string,
  langCodeToPrioritize: string,
  results: LanguageData[]
): LanguageData[] {
  // if any of hte keywords (lowercased) start with the searchstring (lowercased), prioritize the lang
  if (
    searchString.length > 0 &&
    keywords.some((keyword) =>
      keyword.toLowerCase().startsWith(searchString.toLowerCase())
    )
  ) {
    const indexOfLang = results.findIndex((result) =>
      codeMatches(result.code, langCodeToPrioritize)
    );
    if (indexOfLang !== -1) {
      const lang = results[indexOfLang];
      results.splice(indexOfLang, 1);
      results.unshift(lang);
    }
  }
  return results;
}

// TODO turn all the methods into modifiers
function demarcateExactMatches(searchString: string, result: LanguageData) {
  // I think we'll live with only exact matches for this
  const lowerCasedSearchString = searchString.toLowerCase();
  // TODO export this list of fields from
  for (const field of fieldsToSearch) {
    if (!result[field]) {
      continue;
    }
    const lowerCasedValue = result[field].toLowerCase();
    // TODO is it worth it to find additional matches? probably not
    const indexOfSearchString = lowerCasedValue.indexOf(lowerCasedSearchString);
    if (indexOfSearchString !== -1) {
      result[field] =
        result[field].slice(0, indexOfSearchString) +
        START_OF_MATCH +
        result[field].slice(
          indexOfSearchString,
          indexOfSearchString + searchString.length
        ) +
        END_OF_MATCH +
        result[field].slice(indexOfSearchString + searchString.length);
    }
  }
  return result;
}
