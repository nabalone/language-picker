/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo } from "react";
import { Button, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button as BaseButton, buttonClasses } from "@mui/base/Button";
import { COLORS } from "./Colors";
import { stripDemarcation } from "./modifySearchResults";
import { LanguageTreeNode } from "./useLanguagePicker";

// TODO fix memo
export const CustomLanguageCard: React.FunctionComponent<{
  selectedLanguageNode: LanguageTreeNode | undefined;
  selectedScriptNode: LanguageTreeNode | undefined;
}> = memo((props) => {
  let tagPreview = "";
  if (props.selectedLanguageNode) {
    tagPreview = stripDemarcation(
      `${props.selectedLanguageNode.id}-${
        props.selectedScriptNode?.id || "__"
      }-____`
    );
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
        // background-color: white;
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
        {props.selectedLanguageNode && <EditIcon />}
        {/* TODO align button */}
        {props.selectedLanguageNode ? "Customize" : "Create Unlisted Language"}
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
