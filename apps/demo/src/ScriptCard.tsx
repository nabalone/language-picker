import { css } from "@emotion/css";
import { EthnolibCard } from "./EthnolibCard";
import { Typography } from "@mui/material";


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
        <EthnolibCard
        css={css`
        width: 500px;
        position: relative;
      `}
      {...props}
        >
            <Typography variant="h5">{props.scriptData.code}</Typography>
        </EthnolibCard>
    )
  }