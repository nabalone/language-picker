import Fuse from 'fuse.js';

import langTags from './langtags.json';

export function searchForLanguage(queryString: string) {
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
    keys: [
      "tag", "name", "localname", "regionname", "names", "full"
    ]
  };
  console.log(langTags2.length);
  
  const fuse = new Fuse(langTags2, fuseOptions);

  const results = fuse.search(queryString);
  console.log(results);

  return (results.map((r) => r.item.full).join(", "));
}