import { iso15924 } from "iso-15924";
import langTags from "./langtags.json" assert { type: "json" };
import * as fs from "fs";
import { LanguageData, ScriptData } from "./dataHolderTypes";

const COMMA_SEPARATOR = ", ";

const scriptNames = iso15924.reduce(
  (acc, entry) => ({ ...acc, [entry.code]: entry.name }),
  {}
);

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
type InternalLanguageData = {
  autonym: string;
  exonym: string;
  code: string;
  regionNames: Set<string>;
  regionCodes: Set<string>;
  names: Set<string>;
  scripts: Set<string>;
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

function parseLangtagsJson() {
  // const fs = require("fs");
  // const langTags = require("./langtags.json");

  const langs = {};
  const langTags2 = langTags as any[]; // TODO clean up
  for (const entry of langTags2) {
    if (!entry.iso639_3) {
      // console.log("skipping", entry);
      // langTags.json has metadata items in the same list mixed in with the data entries
      continue;
    }

    // We already have an entry with this code, combine with it
    if (langs[entry.iso639_3]) {
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
        autonym: bestAutonym(entry, undefined),
        exonym: entry.name,
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
      // Don't repeat the autonym and exonym in the names list
      langData.names.delete(langData.autonym);
      langData.names.delete(langData.exonym);
      langData.names.forEach(uncomma);
      langData.regionNames.forEach(uncomma);
      return {
        autonym: uncomma(langData.autonym),
        exonym: uncomma(langData.exonym),
        code: langData.code,
        regionNames: [
          // TODO do this better
          ...new Set([...langData.regionNames].map(uncomma)),
        ].join(COMMA_SEPARATOR),
        scripts: [...new Set([...langData.scripts])].map((scriptCode) => {
          return {
            code: scriptCode,
            name: uncomma(scriptNames[scriptCode]),
          } as ScriptData;
        }),
        regionCodes: [...langData.regionCodes],
        names: [
          // TODO do this better
          ...new Set([...langData.names].map(uncomma)),
        ].join(COMMA_SEPARATOR),
      };
    }
  );

  const latinScriptData: ScriptData = {
    code: "Latn",
    name: "Latin",
  };

  //  add unknown language
  //   TODO move this to the filter instead/
  reformattedLangs.push({
    autonym: undefined,
    exonym: "Unknown",
    code: "qaa",
    regionNames: "",
    regionCodes: [],
    scripts: [latinScriptData],
    names: "",
  } as LanguageData);

  // counting scripts
  // let scriptOptions = new Set();
  // let allScripts = new Set();
  // for (const lang of reformattedLangs) {
  //   allScripts = new Set([...allScripts, ...lang.scripts]);
  //   const langScripts = new Set(lang.scripts);
  //   // TODO do this more cleanly
  //   langScripts.delete("Brai");
  //   langScripts.delete("Zxxx");
  //   langScripts.delete("Zyyy");
  //   langScripts.delete("Zzzz");
  //   langScripts.delete("Zmth");
  //   langScripts.delete("Zsym");
  //   if (langScripts.size > 1) {
  //     scriptOptions = new Set([...scriptOptions, ...langScripts]);
  //   }
  // }
  // console.log([...scriptOptions].length);
  // console.log([...allScripts].length);
  // fs.writeFileSync("scripts.json", [...scriptOptions].sort().join("\n"));

  //   write langs to a json file
  const data = JSON.stringify(reformattedLangs);
  fs.writeFileSync("langs.json", data);
}

parseLangtagsJson();
