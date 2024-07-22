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

export const CustomizeLanguageDialog: React.FunctionComponent<{
  open: boolean;
  selectedLanguageNode: LanguageTreeNode | undefined;
  selectedScriptNode: LanguageTreeNode | undefined;
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
      <DialogTitle>Custom Language Tag</DialogTitle>
      <DialogContent>
        <EthnolibTextInput id="customize-script-field" label="Script" />
        <EthnolibTextInput id="customize-region-field" label="Region" />
        <EthnolibTextInput id="customize-variant-field" label="Variant" />
        {/* // TODO abstract out these buttons which are copied from app.tsx */}
        <Typography>
          Tag:{" "}
          {stripDemarcation(
            `${props.selectedLanguageNode?.nodeData?.code || "qaa"}-${
              props.selectedScriptNode?.nodeData?.code || "_ _ _ _"
            }`
          )}
        </Typography>
      </DialogContent>
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
            onClick={handleClose}
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
