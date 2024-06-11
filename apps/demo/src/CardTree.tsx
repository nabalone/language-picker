import { LanguageCard } from "./LanguageCard";
import { css } from '@emotion/react';
import { LanguageData } from '@languagepicker/ethnolib';

export const CardTree: React.FunctionComponent<{
    data: LanguageData[];
}> = props => {
    console.log('cardtree data is ', props.data);
    return (
        <div>
            { props.data.map((node: LanguageTreeNode) => 
                <LanguageCard 
                    css={css`
                    margin: 10px;
                    `}
                    languageCardData={languageCardData.nodeData}>
                        // childrenScripts = node.children 
                        // who makes the children? Decides what they are? Should the tree be agnostic? Am I over generalizing?
                    isSelected = {selectedNodeGeneology.includes(node.id)}
                </LanguageCard>
            )}
        </div>
    )
}
