// TODO rename this file

export type Region = {
  name: string;
  code: string;
};

export type ScriptData = {
  code: string;
  name: string;
};

export type LanguageData = {
  autonym: string | undefined;
  exonym: string;
  code: string; // ISO 639-3
  regionNames: "";
  names: string; // comma-joined
  scripts: ScriptData[];
  variants?: string; // comma-joined
  alternativeTags: string[];
  isForMacrolanguageDisambiguation?: boolean;
  isMacrolanguage?: boolean;
};
