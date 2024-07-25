import * as React from "react";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { LanguageTreeNode } from "./useLanguagePicker";
import { DialogActions, DialogContent } from "@mui/material";
import { EthnolibTextInput } from "./EthnolibTextInput";
import { stripDemarcation } from "./modifySearchResults";

const CustomLanguageTagDialogContent: React.FunctionComponent<{
  selectedLanguageNode: LanguageTreeNode;
  selectedScriptNode: LanguageTreeNode | undefined;
}> = (props) => {
  return (
    <>
      <DialogTitle>Custom Language Tag</DialogTitle>
      <DialogContent>
        <EthnolibTextInput id="customize-script-field" label="Script" />
        <EthnolibTextInput id="customize-region-field" label="Region" />
        <EthnolibTextInput id="customize-variant-field" label="Variant" />
        <Typography>
          Tag:
          <span
            css={css`
              font-weight: bold;
            `}
          >
            {stripDemarcation(
              `${props.selectedLanguageNode.nodeData?.code}${
                props.selectedScriptNode
                  ? `-${props.selectedScriptNode.nodeData?.code}`
                  : ""
              }`
            )}
          </span>
        </Typography>
      </DialogContent>
    </>
  );
};

const UnlistedLanguageTagDialogContent: React.FunctionComponent<{
  searchString: string;
}> = (props) => {
  return (
    <>
      <DialogTitle>Unlisted Language Tag</DialogTitle>
      <DialogContent>
        <EthnolibTextInput id="unlisted-lang-name-field" label="Name" />
        <Typography>
          Tag:
          <span
            css={css`
              font-weight: bold;
            `}
          >{`qaa-x-${props.searchString}`}</span>
        </Typography>
      </DialogContent>
    </>
  );
};

export const CustomizeLanguageDialog: React.FunctionComponent<{
  open: boolean;
  selectedLanguageNode: LanguageTreeNode | undefined;
  selectedScriptNode: LanguageTreeNode | undefined;
  searchString: string;
  onClose: () => void;
}> = (props) => {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={props.open}
      css={css`
        padding: 25px;
      `}
    >
      {props.selectedLanguageNode && (
        <CustomLanguageTagDialogContent
          selectedLanguageNode={props.selectedLanguageNode}
          selectedScriptNode={props.selectedScriptNode}
        />
      )}
      {!props.selectedLanguageNode && (
        <UnlistedLanguageTagDialogContent searchString={props.searchString} />
      )}
      {/* // TODO abstract out these buttons which are copied from app.tsx */}

      <DialogActions>
        <div
          id="buttons-container"
          css={css`
            // position: absolute;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            padding-top: 15px;
          `}
        >
          <Button
            css={css`
              margin-left: auto;
              margin-right: 10px;
              min-width: 100px;
            `}
            variant="contained"
            color="primary"
            onClick={() => {
              props.setOptionalLangTagData();
              handleClose();
            }}
          >
            OK
          </Button>
          <Button
            css={css`
              min-width: 100px;
            `}
            variant="outlined"
            color="primary"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
