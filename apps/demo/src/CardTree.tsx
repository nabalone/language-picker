import { LanguageCard } from "./LanguageCard";
import { css } from '@emotion/react';
import { LanguageCardData } from '@languagepicker/ethnolib';

export const CardTree: React.FunctionComponent<{
    data: LanguageCardData[];
}> = props => {
    console.log('cardtree data is ', props.data);
    return (
        <div>
            { props.data.map((languageCardData) => 
            <LanguageCard 
                css={css`
                margin: 10px;
                `}
                languageCardData={languageCardData}>
                
            </LanguageCard>) }
        </div>
    )
}
