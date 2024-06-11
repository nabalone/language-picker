/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { EthnolibCard } from "./EthnolibCard";
import { Typography, useTheme } from "@mui/material";
import { LanguageData } from "@languagepicker/ethnolib";

export const LanguageCard: React.FunctionComponent<{
  languageCardData: LanguageData;
}> = (props) => {
  const theme = useTheme();
  return (
    <EthnolibCard
    sx={{ bgcolor: (theme) => theme.palette.primary.light }} 
      css={css`
        width: 500px;
        position: relative;
      `}
      {...props}
    >
      <div css={css``}></div>
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
  );
};
