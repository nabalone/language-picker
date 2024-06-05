/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CardContent, Card } from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface MyComponentProps {
    myColor: string;
  }

export const EthnolibCard: React.FunctionComponent<PropsWithChildren<MyComponentProps>> = props => {
    return (
        <Card variant="outlined" {...props}>
            <CardContent >
                {props.children}
            </CardContent>
        </Card>
    )
}