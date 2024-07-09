import Fuse from "fuse.js";

import langTags from "./langtags.json";

export type LanguageData = {
  autonym: string;
  code: string;
  regions: string[];
  names: string[];
  scripts: string[];
};

export function searchForLanguage(queryString: string) {
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
