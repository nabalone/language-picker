import * as React from "react";
import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import { createTag } from "./useLanguagePicker";
import {
  Autocomplete,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { EthnolibTextInput } from "./EthnolibTextInput";
import iso3166 from "iso-3166-1";
import { iso15924 } from "iso-15924";
import { COLORS } from "./Colors";
import { LanguageData, ScriptData } from "@languagepicker/ethnolib";

// export type Region = {
//   name: string;
//   code: string;
// };

// TODO just download these and use...
function getAllRegionOptions() {
  return iso3166.all().map((region) => {
    return {
      label: region.country,
      id: region.alpha2,
    };
  });
}

function getAllScriptOptions() {
  return iso15924.map((script) => {
    return {
      label: script.name,
      id: script.code,
    };
  });
}

const CustomLanguageTagDialogContent: React.FunctionComponent<{
  selectedLanguageNodeData: LanguageData;
  selectedScriptNodeData: ScriptData | undefined;
  // TODO region and variant need to be prepopulatable
}> = (props) => {
  // TODO React.useState or useSTate?
  const [dialogSelectedScriptCode, setDialogSelectedScriptCode] =
    React.useState<{
      label: string;
      id: string;
    } | null>(
      // { label: "foo", id: "bar" }
      props.selectedScriptNodeData?.code
        ? {
            label: "TODO script name",
            id: props.selectedScriptNodeData?.code,
          }
        : null
    );

  const [dialogSelectedRegionCode, setDialogSelectedRegionCode] =
    React.useState<{
      label: string;
      id: string;
    } | null>(null);
  const [dialogSelectedVariantCode, setDialogSelectedVariantCode] =
    React.useState<string>("");
  return (
    <>
      <DialogTitle>Custom Language Tag</DialogTitle>
      <DialogContent>
        {/* TODO make these fuzzy search */}
        <label htmlFor="customize-script-field">
          <Typography
            css={css`
              color: ${COLORS.greys[3]};
              font-weight: bold;
              margin-bottom: 5px;
            `}
          >
            Script
          </Typography>
        </label>
        <Autocomplete
          value={dialogSelectedScriptCode}
          onChange={(event, newValue: { label: string; id: string } | null) => {
            setDialogSelectedScriptCode(newValue);
          }}
          disablePortal
          id="combo-box-demo"
          options={getAllScriptOptions()}
          // sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} id="customize-script-field" />
          )}
        />
        <label htmlFor="customize-region-field">
          <Typography
            css={css`
              color: ${COLORS.greys[3]};
              font-weight: bold;
              margin-bottom: 5px;
            `}
          >
            Region
          </Typography>
        </label>
        <Autocomplete
          value={dialogSelectedRegionCode}
          onChange={(event, newValue: { label: string; id: string } | null) => {
            setDialogSelectedRegionCode(newValue);
          }}
          disablePortal
          id="combo-box-demo"
          options={getAllRegionOptions()}
          renderInput={(params) => (
            <TextField {...params} id="customize-region-field" />
          )}
        />
        {/* TODO make this also a autocomplete with registered variants */}
        <EthnolibTextInput
          id="customize-variant-field"
          label="Variant"
          value={dialogSelectedVariantCode}
          onChange={(event) => {
            console.log("event", event);
            setDialogSelectedVariantCode(event.target.value);
          }}
        />
        <Typography>
          Tag:
          <span
            css={css`
              font-weight: bold;
            `}
          >
            {createTag(
              props.selectedLanguageNodeData.code,
              dialogSelectedScriptCode?.id,
              dialogSelectedRegionCode?.id,
              dialogSelectedVariantCode
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
  selectedLanguageNodeData?: LanguageData | undefined;
  selectedScriptNodeData?: ScriptData | undefined;
  searchString: string;
  saveCustomLangTagDetails: (details: CustomLangTagDetails) => void;
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
      {props.selectedLanguageNodeData && (
        <CustomLanguageTagDialogContent
          selectedLanguageNodeData={props.selectedLanguageNodeData}
          selectedScriptNodeData={props.selectedScriptNodeData}
        />
      )}
      {!props.selectedLanguageNodeData && (
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
              props.setCustomLangTagDetails({
                scriptOverride: dialogSelectedScriptCode?.id,
                region: dialogSelectedRegionCode?.id,
                dialect: dialogSelectedVariantCode,
              });
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
