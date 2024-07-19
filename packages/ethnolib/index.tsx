import Fuse, { FuseResult } from "fuse.js";
import languages from "./langs.json";
import { LanguageData, ScriptData } from "./dataHolderTypes";

const fuseSearchKeys = [
  { name: "autonym", weight: 10 },
  { name: "exonym", weight: 10 },
  { name: "code", weight: 8 },
  { name: "names", weight: 8 },
  { name: "regionNames", weight: 1 },
];

export const fieldsToSearch = fuseSearchKeys.map((key) => key.name);

export function searchForLanguage(
  queryString: string
): FuseResult<LanguageData>[] {
  console.log(languages[10]);
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
    keys: fuseSearchKeys,
  };
  const fuse = new Fuse(languages as LanguageData[], fuseOptions);

  return fuse.search(queryString);
}

// TODO do I need to do it this way?
export { LanguageData, ScriptData };
