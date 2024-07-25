export type ScriptData = {
  code: string;
  name: string;
  // TODO should the sample text be in here?
};

export type LanguageData = {
  autonym: string | undefined;
  exonym: string;
  code: string; // ISO 639-3
  regionNames: string; // comma-joined
  regionCodes: string[];
  names: string; // comma-joined
  scripts: ScriptData[];
  variants?: string; // comma-joined
  alternativeTags: string[];
  isForMacrolanguageDisambiguation?: boolean;
  isMacrolanguage?: boolean;
};
