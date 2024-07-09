import { EthnolibCard } from "./EthnolibCard";
import { Typography } from "@mui/material";
import { css } from "@emotion/react";

export type ScriptData = {
  code: string;
  // TODO display name?
  // TODO should the sample text be in here?
};

export const ScriptCard: React.FunctionComponent<{
  scriptData: ScriptData;
  isSelected: boolean;
  colorWhenNotSelected: string;
  colorWhenSelected: string;
}> = (props) => {
  return (
    <EthnolibCard {...props}>
      <Typography variant="h5">{props.scriptData.code}</Typography>
    </EthnolibCard>
  );
};
