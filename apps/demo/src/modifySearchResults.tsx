import { LanguageData } from "@languagepicker/ethnolib";

export function bloomModifySearchResults(
  results: LanguageData[]
): LanguageData[] {
  return simplifyEnglish(results);
}

function substituteInSpecialEntry(
  specialEntry: LanguageData,
  results: LanguageData[]
): LanguageData[] {
  console.log("here");
  return results.map((result) =>
    // result.code === specialEntry.code ? specialEntry : result
    {
      if (result.code === specialEntry.code) console.log("result", result);
      return result.code === specialEntry.code ? specialEntry : result;
    }
  );
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
