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

h2{
margin:0;
}

h4{
margin:0;
font-weight:400;
text-transform:capitalize;
color:#7e7e7e;
}
`;


export default function Card({ title, data }: any) {
    return (
        <CardContainer>
            <h4>
                {title}
            </h4>
            <h2>
                {data}
            </h2>
    </CardContainer>
    )
}
