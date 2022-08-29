import React from 'react'
import styled from 'styled-components';
import Card from './Card';

const CardManager = styled.section`
display:flex;
flex-direction:row;
gap:10px;
`;

function CardContainer({children}:any) {
    return (
        <CardManager>
            {children}
        </CardManager>
    )
}

export default CardContainer