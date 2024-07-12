/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import langTags from "./langtags.json";
import { writeFile } from "node:fs/promises";

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

export function parseLangtagsJson() {
  const langs = {};
  const langTags2 = langTags as any[]; // TODO clean up
  for (const entry of langTags2) {
    if (!entry.iso639_3) {
      console.log("skipping", entry);
      continue;
    }

    // TODO see if names and regions differ

    if (langs[entry.iso639_3]) {
      console.log(langs[entry.iso639_3]);
      langs[entry.iso639_3].autonym =
        bestAutonym(entry) ?? langs[entry.iso639_3].autonym;
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
        regionNames: new Set([entry.regionname]), // TODO what if undefined?
        regionCodes,
        names: getAllPossibleNames(entry),
        scripts: new Set([entry.script]),
      };
    }
  }

  // write langs to a json file
  const data = JSON.stringify(langs);
  //   const fs = require("fs");
  writeFile("langs.json", data);
}
