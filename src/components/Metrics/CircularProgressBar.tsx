import React from 'react'
import styled, { css } from 'styled-components';
import { BackgroundColorType } from '../../global';

const SvgCommonParams = css`
    cx: 40px;
    cy: 40px;
    r: 35px;
    fill: transparent;
    stroke-width: 5px;

    @media (max-width: 600px){
        cx: 20px;
        cy: 20px;
        r: 17.5px;
        fill: transparent;
        stroke-width: 2.5px;
    }
`;

const SvgProgressBar = styled.svg`
    display:block;
    margin:auto;
    width:80px;
    height:80px;
    min-width:80px;
    min-height:80px;
    transform:rotateZ(-90deg);
    
    @media (max-width: 600px){
        width:40px;
        height:40px;
        min-width:40px;
        min-height:40px;
    }
`;

const SvgTrack = styled.circle`
    ${SvgCommonParams};
    stroke: ${BackgroundColorType.Gray};
`;

const SvgIndication = styled.circle<any>`
    ${SvgCommonParams};
    stroke: ${BackgroundColorType.White};
    stroke-dasharray: ${(props: { arcLength: number }) => `${props.arcLength}px`};
    stroke-dashoffset: ${(props: { arcOffset: number }) => `${props.arcOffset}px`};
    transition:transform 50ms ease-in-out;
`;

const PercentageIndicator = styled.text`
    font-weight: 500;
    fill: ${BackgroundColorType.White};
    font-size: 1.5em;
    transform: translateX(40%) translateY(25%) rotate(90deg);

    
    @media (max-width: 600px){
    font-weight: 400;
    font-size: 0.75em;
    transform: translateX(40%) translateY(20%) rotate(90deg);
    }
`;


const RADIUS = 35;
const ARC_LENGTH = 2 * Math.PI * RADIUS;

const calcArcOffset = (progress: number): number => {
    return ARC_LENGTH * ((100 - progress) / 100);
};

function CircularProgressBar({ progressInPercentages }: { progressInPercentages: number }) {
    return (
        <SvgProgressBar>
            <g>
                <SvgTrack />
                <SvgIndication arcLength={ARC_LENGTH} arcOffset={calcArcOffset(progressInPercentages)} />
                <PercentageIndicator>{progressInPercentages ? progressInPercentages : 0}%</PercentageIndicator>
            </g>
        </SvgProgressBar>
    );
};

export default CircularProgressBar;