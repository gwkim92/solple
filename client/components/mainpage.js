import React from "react";
import SimpleSlider from "./SimpleSlider";
import styled from "styled-components";

const FirstDiv = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const mainpage = () => {
  return (
    <FirstDiv>
      <SimpleSlider />
    </FirstDiv>
  );
};

export default mainpage;
