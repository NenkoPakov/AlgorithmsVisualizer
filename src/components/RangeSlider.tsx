import React, { useState } from 'react';
import styled from 'styled-components'
import { NodeBase } from '../global';
import { IFreeNode } from '../interfaces/Cell.interface';

const Slider = styled.input`
		outline: 0;
		border: 0;
		border-radius: 500px;
		width: 400px;
		max-width: 100%;
		margin: 24px 0 16px;
		transition: box-shadow 0.2s ease-in-out;

		// Chrome
		@media screen and (-webkit-min-device-pixel-ratio:0) {
			& {
				overflow: hidden;
				height: 40px;
				-webkit-appearance: none;
				background-color: #ddd;
			}
			&::-webkit-slider-runnable-track {
				height: 40px;
				-webkit-appearance: none;
				color: #444;
				// margin-top: -1px;
				transition: box-shadow 0.2s ease-in-out;
			}
			&::-webkit-slider-thumb {
				width: 40px;
				-webkit-appearance: none;
				height: 40px;
				cursor: ew-resize;
				background: #fff;
				border:solid 3px black; 
				box-shadow: -340px 0 0 320px #1597ff, inset 0 0 0 40px #1597ff;
				border-radius: 50%;
				transition: box-shadow 0.2s ease-in-out;
				position: relative;
				// top: 1px;
			}
			&:active::-webkit-slider-thumb {
				background: #fff;
				box-shadow: -340px 0 0 320px #1597ff, inset 0 0 0 3px #1597ff;
			}
		}
        
		// Firefox
		&::-moz-range-progress {
			background-color: #43e5f7; 
		}
		&::-moz-range-track {  
			background-color: #9a905d;
		}
		// IE
		&::-ms-fill-lower {
			background-color: #43e5f7; 
		}
		&::-ms-fill-upper {  
			background-color: #9a905d;
		}

        &input:not(:active) + #h4-container h4 {
            opacity: 0;
            margin-top: -50px;
            pointer-events: none;
        }
`;

const SizeIndicator = styled.h4`
		color: #999;
		font-weight: 500;
		&:after {
			content: "%";
			padding-left: 1px;
		}
`;

// const SizeIndicatorContainer = styled.div`
// 	width: 400px;
// 	max-width: 100%;
// 	padding: 0 20px;
// 	box-sizing: border-box;
// 	position: relative;
// `;

// const SizeIndicatorSubContainer = styled.div`
//     width: 100%;
//     position: relative;
//     h4 {
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         position: absolute;
//         top: 0;
//         width: 40px;
//         height: 40px;
//         color: #fff !important;
//         font-size: 12px;
//         transform-origin: center -10px;
//         transform: translateX(-50%);
//         transition: margin-top 0.15s ease-in-out,
//             opacity 0.15s ease-in-out;
//         span {
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             top: 0;
//             left: 0;
//             background-color: #1597ff;
//             border-radius: 0 50% 50% 50%;
//             transform: rotate(45deg);
//             z-index: -1;
//         }
//     }
// `;

function RangeSlider({boardSize,type, updateBoardSize}:any) {
    return <React.Fragment>
        <Slider type="range" onChange={(e: any) => updateBoardSize((parseInt(e.target.value)),type)} defaultValue={boardSize} />
        {/* <SizeIndicatorContainer >
            <SizeIndicatorSubContainer>
                <SizeIndicator>
                    {size}
                    <span></span>
                </SizeIndicator>
            </SizeIndicatorSubContainer>
        </SizeIndicatorContainer> */}
    </React.Fragment>


}

export default RangeSlider;