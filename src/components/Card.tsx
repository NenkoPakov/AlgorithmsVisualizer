import React from 'react'
import styled from 'styled-components';
import { BackgroundColorType } from '../global';


const CardContainer = styled.section`
    position:relative;
    display: flex;
    flex-direction:column;
    justify-content:center;
    background-color:${BackgroundColorType.White};
    padding:5px 20px 5px 20px;
    border-radius:20px;
`;


function Card({ children }: any) {
    return (
        <CardContainer>
            {children}
        </CardContainer>
    );
};

export default Card;
