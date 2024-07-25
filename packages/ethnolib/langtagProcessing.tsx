import { iso15924 } from "iso-15924";
import langTags from "./langtags.json" assert { type: "json" };
import * as fs from "fs";
import { LanguageData, ScriptData } from "./dataHolderTypes";

const COMMA_SEPARATOR = ", ";

const scriptNames = iso15924.reduce(
  (acc, entry) => ({ ...acc, [entry.code]: entry.name }),
  {}
);

function getMacrolangs() {
  const macrolangs = new Set();
  // read iso-639-3-macrolanguages.tab
  // downloaded from https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3-macrolanguages.tab
  const macrolangsFile = fs.readFileSync(
    "iso-639-3-macrolanguages.tab",
    "utf8"
  );
  for (const line of macrolangsFile.split("\n")) {
    if (line.length === 0) {
      continue;
    }
    const parts = line.split("\t");
    if (parts.length !== 3) {
      console.log("skipping macrolangs line", line);
      continue;
    }
    macrolangs.add(parts[0]);
  }
  return macrolangs;
}

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
  alternativeTags: Set<string>;
};

function findPotentialIso639_3Code(languageTag: string): string | undefined {
  const parts = languageTag.split("-");
  if (parts[0].length === 3) {
    return parts[0];
  }
  return undefined;
}

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

function addLangtagsEntry(entry, langs) {
  if (!entry.iso639_3) {
    // console.log("skipping", entry);
    // langTags.json has metadata items in the same list mixed in with the data entries
    return;
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
    langs[entry.iso639_3].alternativeTags = new Set([
      ...langs[entry.iso639_3].alternativeTags,
      ...(entry.tags ?? []),
    ]);
    langs[entry.iso639_3].isForMacrolanguageDisambiguation =
      langs[entry.iso639_3].isForMacrolanguageDisambiguation &&
      entry.isForMacrolanguageDisambiguation;
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
      alternativeTags: new Set(entry.tags || []),
      isForMacrolanguageDisambiguation:
        entry.isForMacrolanguageDisambiguation || false,
    } as InternalLanguageData;
  }
}

function parseLangtagsJson() {
  // const fs = require("fs");
  // const langTags = require("./langtags.json");

  const langs = {};
  const langTags2 = langTags as any[]; // TODO clean up
  const macrolangs = getMacrolangs();
  for (const entry of langTags2) {
    addLangtagsEntry(entry, langs);

    // Macrolanguage/specific language handling. See README
    if (macrolangs.has(entry.iso639_3)) {
      const iso639_3Codes = new Set([entry.iso639_3]);
      for (const tag of entry.tags || []) {
        const iso639_3Code = findPotentialIso639_3Code(tag);
        if (iso639_3Code && !iso639_3Codes.has(iso639_3Code)) {
          // TODO check if a language is deprecated
          iso639_3Codes.add(iso639_3Code);
          addLangtagsEntry(
            {
              ...entry,
              code: iso639_3Code,
              isForMacrolanguageDisambiguation: true, // TODO
            },
            langs
          );
        }
      }
      if (iso639_3Codes.size > 2) {
        console.log("multiple iso639_3 codes", entry.iso639_3, iso639_3Codes);
      }
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
        alternativeTags: [...langData.alternativeTags],
      } as LanguageData;
    }
  );

  // // Macrolanguage/specific language handling. See README
  // for (const lang of reformattedLangs) {
  //   if (!macrolangs.has(lang.code)) {
  //     continue;
  //   }
  //   lang.isMacrolanguage = true;
  //   const iso639_3Codes = new Set([lang.code]);
  //   for (const tag of lang.alternativeTags || []) {
  //     const iso639_3Code = findPotentialIso639_3Code(tag);
  //     if (iso639_3Code && !iso639_3Codes.has(iso639_3Code)) {
  //       iso639_3Codes.add(iso639_3Code);
  //       reformattedLangs.push({
  //         ...lang,
  //         code: iso639_3Code,
  //         isForMacrolanguageDisambiguation: true,
  //       });
  //     }
  //   }
  //   if (iso639_3Codes.size > 2) {
  //     console.log("multiple iso639_3 codes", lang.code, iso639_3Codes);
  //   }
  // }

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

  //   write langs to a json file
  const data = JSON.stringify(reformattedLangs);
  fs.writeFileSync("langs.json", data);
}

parseLangtagsJson();

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

// macrolang checking...

// const macrolangs = new Set();
// for (const entry of langTags2) {
//   if (!entry.iso639_3) {
//     // console.log("skipping", entry);
//     // langTags.json has metadata items in the same list mixed in with the data entries
//     continue;
//   }
//   if (entry.macrolang) {
//     macrolangs.add(entry.macrolang);
//   }
// }
// console.log([...macrolangs].sort().join("\n"));

// for (const entry of langTags2) {
//   if (!entry.iso639_3) {
//     // console.log("skipping", entry);
//     // langTags.json has metadata items in the same list mixed in with the data entries
//     continue;
//   }
//   if (macrolangs.has(entry.iso639_3)) {
//     if (
//       !entry.tags?.some((tag) => {
//         tag.length === 3 && tag !== entry.iso639_3)
//       }
//     ) {
//       console.log("trouble", entry.iso639_3, entry.tags);
//     }
//   }
// }

// check if whenever there are multiple 3-letter codes in tags, we can unambiguously map them
// const langCodeSetsObj = {};
// for (const entry of langTags2) {
//   if (!entry.iso639_3) {
//     // console.log("skipping", entry);
//     // langTags.json has metadata items in the same list mixed in with the data entries
//     continue;
//   }
//   const codes = new Set();
//   for (const tag of entry.tags || []) {
//     const tag1 = tag.split("-")[0];
//     if (tag1.length === 3 && tag1 !== "sgn") {
//       codes.add(tag1);
//     }
//   }
//   if (codes.size > 1) {
//     // console.log(entry.iso639_3, codes);?
//     const codesList = [...codes].sort();
//     langCodeSets.push(codesList);
//     if (
//       langCodeSetsObj[codesList[0] as string] &&
//       langCodeSetsObj[codesList[0] as string] !== codesList[1]
//     )
//       console.log(
//         "Nonmatch ",
//         codesList[0],
//         codesList[1],
//         langCodeSetsObj[codesList[0] as string]
//       );
//     langCodeSetsObj[codesList[0] as string] = codesList[1];
//   }
// }
// console.log(
//   langCodeSets.sort()
// );
