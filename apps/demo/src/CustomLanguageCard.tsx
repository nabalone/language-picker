/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo } from "react";
import { Button, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button as BaseButton, buttonClasses } from "@mui/base/Button";
import { COLORS } from "./Colors";
import { END_OF_MATCH, START_OF_MATCH } from "./modifySearchResults";

function stripDemarcation(str: string): string {
  if (!str) return str;
  return str.replaceAll(START_OF_MATCH, "").replaceAll(END_OF_MATCH, "");
}

// TODO fix memo
export const CustomLanguageCard: React.FunctionComponent<{
  selectedNodeGeneology: string[];
}> = memo((props) => {
  let tagPreview = "";
  const languageSelected = props.selectedNodeGeneology.length > 0;
  if (languageSelected) {
    tagPreview = `${stripDemarcation(props.selectedNodeGeneology[0])}-${
      stripDemarcation(props.selectedNodeGeneology[1]) || "__"
    }-____`;
  } else {
    tagPreview = "qaa-X-____"; // TODO actually this should be the start of the search string
  }
  return (
    <Button
      variant="outlined"
      // startIcon={cardSelected ? <EditIcon /> : null}
      {...props}
      color="primary"
      css={css`
        // background-color: whifte;
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
          0px 4px 5px 0px rgba(0, 0, 0, 0.14),
          0px 1px 10px 0px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-transform: none;
        padding: 5px 10px;
      `}
    >
      <Typography
        variant="body1"
        css={css`
          text-transform: uppercase;
          font-weight: bold;
          // text-align: left;
          // justify-content: flex-start;
        `}
      >
        {languageSelected && <EditIcon />}
        {/* TODO align button */}
        {languageSelected ? "Customize" : "Create Unlisted Language"}
        {/* {props.languageCardData?.name} */}
      </Typography>
      <div
        id="custom-language-card-bottom"
        css={css`
          display: flex;
          width: 100%;
          justify-content: space-between;
        `}
      >
        <Typography
          variant="body2"
          css={css`
            text-align: left;
            // justify-content: flex-start;
          `}
        >
          {tagPreview}
        </Typography>
        <Tooltip title="TODO info text...">
          <InfoOutlinedIcon
            css={css`
              color: ${COLORS.greys[2]};
            `}
          />
        </Tooltip>
      </div>
    </Button>
  );
});
