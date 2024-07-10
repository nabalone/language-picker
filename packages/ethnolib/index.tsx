import Fuse from "fuse.js";

import langTags from "./langtags.json";

export type LanguageData = {
  autonym: string;
  code: string;
  regions: string[];
  names: string[];
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

function bestAutonym(entry: any) {
  return entry.localnames ? entry.localnames[0] : entry.localname ?? undefined;
}

function parseLangtagsJson() {
  let langs = {};
  const langTags2 = langTags as any[]; // TODO clean up
  for (const entry of langTags2) {
    if (!entry.iso639_3) {
      console.log("skipping", entry);
      continue;
    }

    // TODO see if names and regions differ

    if (langs[entry.iso639_3]) {
      langs[entry.iso639_3] = bestAutonym(entry) ?? langs[entry.iso639_3];
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
        autonym: bestAutonym(entry),
        code: entry.iso639_3,
        regionNames: new Set(entry.regionname), // TODO what if undefined?
        regionCodes,
        names: getAllPossibleNames(entry),
        scripts: new Set(entry.script),
      };
    }
  }
  // write langs to a json file
  const data = JSON.stringify(langs);
  const fs = require("fs");
  fs.writeFileSync("langs.json", data);
}

export function searchForLanguage(queryString: string) {
  // parseLangtagsJson();
  // TODO make sure it is case insensitive
  const langTags2 = langTags as any[]; // TODO clean up
  //   langTags2.push({
  //   full: 'qaa',
  //   iso639_3: 'qaa',
  //   localname: 'Unknown',
  //   name: 'Unknown',
  //   regionname: 'anywhere',
  //   script: 'Latn',
  //   sldr: false,
  //   tag: 'qaa',
  // });

  const fuseOptions = {
    isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    minMatchCharLength: 2,
    // location: 0,
    threshold: 0.3,
    // distance: 100,
    // useExtendedSearch: false,
    ignoreLocation: true,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ["tag", "name", "localname", "regionname", "names", "full"],
  };
  const fuse = new Fuse(langTags2, fuseOptions);

  const results = fuse.search(queryString);

  return results.map((r) =>
    languageEntryToLanguageCardData(r.item)
  ) as LanguageData[];
}

function languageEntryToLanguageCardData(entry: any): LanguageData {
  const regionsList = [entry.region] as string[];
  if (entry.regions) {
    regionsList.push(...entry.regions);
  }
  return {
    autonym: entry.name,
    code: entry.tag,
    regions: regionsList,
    names: entry.names ?? [entry.name],
    scripts: [entry.script],
  };
}
