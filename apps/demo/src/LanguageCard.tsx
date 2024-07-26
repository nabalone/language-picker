/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { EthnolibCard, EthnolibCardProps } from "./EthnolibCard";
import { LanguageData } from "@languagepicker/ethnolib";
import { memo } from "react";
import { PartiallyBoldedTypography } from "./PartiallyBoldedTypography";

// inherits from EthnolibCardProps
interface LanguageCardProps extends EthnolibCardProps {
  languageCardData: LanguageData;
}

// TODO fix memo
export const LanguageCard: React.FunctionComponent<LanguageCardProps> = memo(
  (props) => {
    return (
      <>
        <EthnolibCard {...props}>
          <PartiallyBoldedTypography
            variant="h5"
            dangerouslySetDemarcatedText={
              props.languageCardData.autonym || props.languageCardData.exonym
            }
          />
          {props.languageCardData.autonym && (
            <PartiallyBoldedTypography
              variant="body2"
              dangerouslySetDemarcatedText={props.languageCardData.exonym}
            />
          )}
          <PartiallyBoldedTypography
            css={css`
              right: 0;
              top: 0;
              position: absolute;
              margin: 16px; // what should this be? To match the padding of the card
              font-family: "Roboto Mono", monospace;
            `}
            variant="body2"
            dangerouslySetDemarcatedText={props.languageCardData.code}
          />
          {props.languageCardData.regionNames && (
            <PartiallyBoldedTypography
              variant="h5"
              gutterBottom
              css={css`
                margin-top: 8px; // above elements don't have bottom-gutters because one is optional
                // TODO Copilot did this and I don't understand it but it works
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              `}
              dangerouslySetDemarcatedText={`A language of ${props.languageCardData.regionNames}`}
            />
          )}
          {props.languageCardData.names && (
            <PartiallyBoldedTypography
              variant="body2"
              // Always show all the names
              css={css`
                text-wrap: balance;
              `}
              dangerouslySetDemarcatedText={props.languageCardData.names}
            />
          )}
        </EthnolibCard>
      </>
    );
  }
);

// chm/mhr/mrj is a good clean example
// lav/ltg/lvs is same but without the macrolang field
// kpe - do I include Guinea as a region?
// aka - macrolang in macrolang list but not in ethnologue...

// TODO langtags.json is not case consistent

// Duplicate macrolangs with "hidden" specific langs into both
// Try to write up macrolanguage situation.
// Eventually we should figure out which macrolangs are valid options. We will come back to this.
// I want to flag the duplicate entries
// Make a unit test that records e.g. that AKA is avialable as a choice, XPE, etc.

// TODO AAAH "man" (a macrolang) has alternate tags of both "mnk" and "emk" (valid individual languages)
// als san/cls/vsn but that's ok because it is historical sanskrit
// Also zap/zcd/zai
