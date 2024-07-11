import Fuse from "fuse.js";

import langTags from "./langtags.json";

const COMMA_SEPARATOR = ", ";

// turn "Uzbek, Northern" into "Northern Uzbek"
function uncomma(str: string) {
  if (!str) {
    return ""; // TODO or undefined?
  }
  const parts = str.split(COMMA_SEPARATOR);
  if (parts.length === 1) {
    return str;
  }
  return parts[1] + " " + parts[0];
}

export type InternalLanguageData = {
  autonym: string;
  code: string;
  regionNames: Set<string>;
  regionCodes: Set<string>;
  names: Set<string>;
  scripts: Set<string>;
};

export type LanguageData = {
  autonym: string;
  code: string;
  regionNames: string; // comma-joined
  regionCodes: string[];
  names: string; // comma-joined
  scripts: string[];
};

function getAllPossibleNames(entry: any) {
  // TODO clean all this up to use spreads instead
  const names = new Set(entry.names);
  if (entry.localname) {
    names.add(entry.localname);
  }
  if (entry.name) {
    names.add(entry.name);
  }
  if (entry.localnames) {
    for (const name of entry.localnames) {
      names.add(name);
    }
  }
  if (entry.iana) {
    for (const name of entry.iana) {
      names.add(name);
    }
  }
  if (entry.latnnames) {
    for (const name of entry.latnnames) {
      names.add(name);
    }
  }
  if (entry.macrolang) {
    names.add(entry.macrolang);
  }
  return names;
}

function bestAutonym(entry: any, fallback: string) {
  return entry.localnames ? entry.localnames[0] : undefined ?? fallback;
}

export function parseLangtagsJson(): LanguageData[] {
  const langs = {};
  const langTags2 = langTags as any[]; // TODO clean up
  for (const entry of langTags2) {
    if (!entry.iso639_3) {
      // console.log("skipping", entry);
      // langTags.json has metadata items in the same list mixed in with the data entries
      continue;
    }

    // TODO see if names and regions differ

    if (langs[entry.iso639_3]) {
      // console.log(langs[entry.iso639_3]);
      langs[entry.iso639_3].autonym = bestAutonym(
        entry,
        langs[entry.iso639_3].autonym
      );
      langs[entry.iso639_3].regionNames.add(entry.regionname);
      langs[entry.iso639_3].regionCodes.add(entry.region);
      langs[entry.iso639_3].regionCodes = new Set([
        ...langs[entry.iso639_3].regionCodes,
        ...(entry.regions ?? []),
      ]);
      langs[entry.iso639_3].scripts.add(entry.script);
      langs[entry.iso639_3].names = new Set([
        ...langs[entry.iso639_3].names,
        ...getAllPossibleNames(entry),
      ]);
    } else {
      // regionCodes is all the codes in entry.regions plus the code in entry.region
      const regionCodes = new Set(entry.regions ?? []);
      if (entry.region) {
        regionCodes.add(entry.region);
      }

      langs[entry.iso639_3] = {
        autonym: bestAutonym(entry, entry.name),
        code: entry.iso639_3 as string,
        regionNames: new Set([entry.regionname]),
        regionCodes,
        names: getAllPossibleNames(entry),
        scripts: new Set([entry.script]),
      } as InternalLanguageData;
    }
  }
  const reformattedLangs = Object.values(langs).map(
    (langData: InternalLanguageData) => {
      return {
        autonym: uncomma(langData.autonym),
        code: langData.code,
        regionNames: [...langData.regionNames]
          .map(uncomma)
          .join(COMMA_SEPARATOR),
        regionCodes: [...langData.regionCodes],
        names: [...langData.names].map(uncomma).join(COMMA_SEPARATOR),
        scripts: [...langData.scripts],
      } as LanguageData;
    }
  );

  //  add unknown language
  reformattedLangs.push({
    autonym: "Unknown",
    code: "qaa",
    regionNames: "",
    regionCodes: [],
    scripts: ["Latn"],
    names: "",
  } as LanguageData);

  // write langs to a json file
  // const data = JSON.stringify(langs);
  // const fs = require("fs");
  // fs.writeFileSync("langs.json", reformattedLangs);

  return reformattedLangs;
}

const languages: LanguageData[] = parseLangtagsJson();

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
  const fuse = new Fuse(languages, fuseOptions);

  const results = fuse.search(queryString);
  console.log(results);
  return results.map((r) => r.item) as LanguageData[];
}
