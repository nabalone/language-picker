/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { COLORS } from "./Colors";

// TODO fix memo
export const CustomizeLanguageButton: React.FunctionComponent<{
  currentTagPreview: string;
  languageHasBeenSelected: boolean;
}> = (props) => {
  return (
    <Button
      variant="outlined"
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
          display: flex; // for the icon
        `}
      >
        {props.languageHasBeenSelected && (
          <EditIcon
            css={css`
              margin-right: 5px;
            `}
          />
        )}
        {/* TODO align button */}
        {props.languageHasBeenSelected
          ? "Customize"
          : "Create Unlisted Language"}
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
          {props.currentTagPreview}
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
};
