/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { EthnolibCard } from "./EthnolibCard";
import { Typography } from "@mui/material";
import { LanguageData } from "@languagepicker/ethnolib";

export const LanguageCard: React.FunctionComponent<{
  languageCardData: LanguageData;
  // childrenData: ScriptData[];
  isSelected: boolean;
  colorWhenNotSelected: string;
  colorWhenSelected: string;
}> = (props) => {
  return (
    <>
      <EthnolibCard {...props}>
        <Typography variant="h5" gutterBottom>
          {props.languageCardData.autonym}
        </Typography>
        <Typography
          css={css`
            right: 0;
            top: 0;
            position: absolute;
            margin: 16px; // what should this be? To match the padding of the card
            font-family: "Roboto Mono", monospace;
          `}
          variant="body2"
        >
          {props.languageCardData.code}
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          css={css`
            // TODO Copilot did this and I don't understand it but it works
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          `}
        >
          {props.languageCardData.regions?.join(", ")}
        </Typography>
        <Typography
          variant="body2"
          // Always show all the names
          css={css`
            text-wrap: balance;
          `}
        >
          {props.languageCardData.names?.join(", ")}
        </Typography>
      </EthnolibCard>
    </>
  );
};
