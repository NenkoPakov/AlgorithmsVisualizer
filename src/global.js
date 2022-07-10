
import { css } from 'styled-components'

export const NodeBase = css`

flex-basis:100%;
position:relative;
cursor:pointer;
`;

export const NodeText = css`
display: flex;
justify-content: center;
align-items:center;
color:black;
font-size:2vmin;

@media screen and (max-width: 650px) {
 font-size:3vmin;
}

`;