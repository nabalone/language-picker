import { EthnolibCard } from "./EthnolibCard";
import { Typography, useTheme } from "@mui/material";


export type ScriptData = {
    code: string;
    // TODO display name?
    // TODO should the sample text be in here? 
};

export const ScriptCard: React.FunctionComponent<{
    scriptData: ScriptData;
  }> = (props) => {
    return (
        <EthnolibCard>
            <Typography variant="h5">{props.scriptData.code}</Typography>
        </EthnolibCard>
    )
  }