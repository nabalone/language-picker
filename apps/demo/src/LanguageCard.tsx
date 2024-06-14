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
  // const childrenWhenSelected =  props.childrenData.map((scriptData) => (
  //   <ScriptCard scriptData={scriptData} />
  // ));
  return (
    <>
      <EthnolibCard
        css={css`
          position: relative;
        `}
        // isSelected={props.isSelected}
        // childrenWhenSelected={childrenWhenSelected}
        {...props}
      >
        <Typography variant="h5" gutterBottom>
          {props.languageCardData.autonym}
        </Typography>
        <Typography
          css={css`
            width: fit-content;
            right: 0;
            top: 0;
            position: absolute;
            margin: 16px; // what should this be? To match the padding of the card
          `}
          variant="body2"
        >
          {props.languageCardData.code}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {props.languageCardData.regions?.join(", ")}
        </Typography>
        <Typography variant="body2">
          {props.languageCardData.names?.join(", ")}
        </Typography>
      </EthnolibCard>
    </>
  );
};
