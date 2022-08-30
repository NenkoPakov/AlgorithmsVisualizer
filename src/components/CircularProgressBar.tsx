import React from 'react'
import styled, { css } from 'styled-components';

const SvgCommonParams = css`
    cx: 40px;
    cy: 40px;
    r: 35px;
    fill: transparent;
    stroke-width: 5px;
`;

const SvgProgressBar = styled.svg`
display:block;
margin:auto;
width:80px;
height:80px;
min-width:80px;
min-height:80px;
transform:rotateZ(-90deg);
`;

const SvgTrack = styled.circle`
    ${SvgCommonParams};
    stroke: #c5c5c5;
`;

const SvgIndication = styled.circle<any>`
    ${SvgCommonParams};
    stroke: #fff;
    stroke-dasharray: ${(props: any) => `${props.arcLength}px`};
    stroke-dashoffset: ${(props: any) => `${props.arcOffset}px`};
    transition:transform 50ms ease-in-out;
`;

const PercentageIndicator = styled.text`
font-weight: 500;
fill: #fff;
font-size: 1.5em;
transform:rotateZ(90deg);
text-align: center;
text-anchor:middle;
`;


let radius = 35;
let arcLength = 2 * Math.PI * radius;

const calcArcOffset = (progress: number) => {
    return arcLength * ((100 - progress) / 100);
}

function CircularProgressBar({ progressInPercentages }: any) {
    return (
        <SvgProgressBar>
            <g>
                <SvgTrack />
                <SvgIndication arcLength={arcLength} arcOffset={calcArcOffset(progressInPercentages)} />
                <PercentageIndicator x="40" y="-32">{progressInPercentages ? progressInPercentages : 0}%</PercentageIndicator>
            </g>
        </SvgProgressBar>
    )
}

export default CircularProgressBar