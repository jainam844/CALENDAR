import styled from "styled-components";

export const Wrapper = styled.div`
width: 99%;
height: 100vh;
border: 1px solid black;
margin: 10px;
`;

export const CalenderHead = styled.div`
width: 100%;
height: 40px;
display: flex;
justify-content: space-around;
align-items: center;
font-size: 20px;
`;

export const SevenColGrid = styled.div`
width: 100%;
display: grid;
height: 27px;
grid-template-columns: repeat(7, 1fr);
`;

export const HeadDay = styled.span`
text-align: center;
background: #ffdada;
font-size: 1.2rem;
font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif
`;

export const CalenderBody = styled.div`
width: 100%;
height: calc(100% - 40px - 27px);
display: grid;
grid-template-columns: repeat(7, 1fr);
grid-template-rows: repeat(${({fourCol}) => fourCol ? 4 : 5}, 1fr);
`;

export const StyledDay = styled.span`
border: 1px solid #cdd5dd;
text-align: right;
padding: 10px;
${({active}) => active && `background: rgb(221 235 237 / 59%);`}
`;

export const StyledEvent = styled.span`
display: flex;
align-items: center;
width: 100%;
background: #fbbbbb;
padding: 2px 10px;
margin-bottom: 5px;
border: 1px solid #e3e3e3;
border-radius: 7px;
`;
