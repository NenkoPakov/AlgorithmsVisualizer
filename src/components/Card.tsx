import React from 'react'
import styled from 'styled-components';


const CardContainer = styled.section`
position:relative;
display: flex;
flex-direction:column;
/* width:200px; */
/* height:100%; */
background-color:white;
padding:5px 20px 20px 20px;
border-radius:20px;
`;


export default function Card({ children }: any) {
    return (
        <CardContainer>
            {children}
        </CardContainer>
    )
}
