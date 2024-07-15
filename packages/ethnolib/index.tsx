import Fuse from "fuse.js";
import languages from "./langs.json";
export type LanguageData = {
  autonym: string;
  code: string; // ISO 639-3
  regionNames: string; // comma-joined
  regionCodes: string[];
  names: string; // comma-joined
  scripts: string[];
};

// const languages: LanguageData[] = parseLangtagsJson();

export function searchForLanguage(queryString: string) {
  // TODO make sure it is case insensitive
  // const langTags2 = langTags as any[]; // TODO clean up

  const fuseOptions = {
    isCaseSensitive: false,
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.3,

    // to make matches that start with the query string appear first
    location: 0,
    distance: 10000, // we want match score to fall off very slowly, really use distance from the beginning only as a tie breaker
    // useExtendedSearch: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: [
      { name: "autonym", weight: 10 },
      { name: "code", weight: 10 },
      { name: "names", weight: 8 },
      { name: "regionNames", weight: 1 },
    ],
  };
  const fuse = new Fuse(languages as LanguageData[], fuseOptions);

  const results = fuse.search(queryString);
  console.log(results);
  const resultsToReturn = [];
  for (const result of results) {
    for (const match of result.matches) {
      for (const matchInstanceLocation of match.indices) {
        const [start, end] = matchInstanceLocation;
        const matchInstance = match.value.slice(start, end + 1);
        console.log(matchInstance);
      }
    }
  }
}
