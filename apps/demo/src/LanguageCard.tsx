/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { EthnolibCard } from "./EthnolibCard";
import { LanguageData } from "@languagepicker/ethnolib";
import { memo } from "react";
import { PartiallyBoldedTypography } from "./PartiallyBoldedTypography";

export const LanguageCard: React.FunctionComponent<{
  languageCardData: LanguageData;
  // childrenData: ScriptData[];
  isSelected: boolean;
  colorWhenNotSelected: string;
  colorWhenSelected: string;
  className?: string;
}> = memo((props) => {
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
        <PartiallyBoldedTypography
          variant="body2"
          // Always show all the names
          css={css`
            text-wrap: balance;
          `}
          dangerouslySetDemarcatedText={props.languageCardData.names}
        />
      </EthnolibCard>
    </>
  );
});
