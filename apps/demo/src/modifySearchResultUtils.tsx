import { LanguageData } from "@languagepicker/ethnolib";

export function substituteInSpecialEntry(
  specialEntry: LanguageData,
  results: LanguageData[]
): LanguageData[] {
  return results.map((result) =>
    result.code === specialEntry.code ? specialEntry : result
  );
}

export function filterScripts(
  scriptFilter: (value: string) => boolean,
  results: LanguageData[]
): LanguageData[] {
  return results.map((result) => ({
    ...result,
    scripts: result.scripts.filter(scriptFilter),
  }));
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
  "fron", // Old French
  "frm", // Middle French
  "oko", // old korean
  "sga", // Old Irish
  "goh", // Old High German
  "peo", // Old Persian
  // TODO there are a bunch more - search for things like (to 1500), (up to 700), BCE, B.C., ca., etc
]);

export function filterSpecialEntries(results: LanguageData[]): LanguageData[] {
  return filterLangCodes(
    (code) =>
      !NOT_A_LANGUAGE_ENTRY_CODES.has(code) &&
      !ANCIENT_LANGUAGE_ENTRY_CODES.has(code),
    results
  );
}
