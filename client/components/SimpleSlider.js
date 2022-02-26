import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
// import { img } from "./meta.png"


const StyledSlider = styled(Slider)`
  .slick-list div {
    //슬라이드 스크린
    width: 1000px;
    height: 1000px;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    order: 0;
    .slick-arrow .slick-prev div {
    }
    .slick-arrow .slick-next div {
    }
  }
  .slick-slider div {
    outline: none;
    order: 0;
  }
`;
const Image = styled.img`
	/* max-width: 100%;
	max-height: 100%; */
	width: 200px;
	height: 200px;
	display: flex;
	justify-content: center;
`;

const SimpleSlider = () => {
  const settings = {
    slide: "div",
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    centerMode: true,   // 중앙정렬
    centerPadding: "0px", // 0px 하면 슬라이드 끝쪽 이미지가 안잘림
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          // background: 'black',
          right: "25px",
        }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          left: "25px",
          zIndex: 1,
        }}
        onClick={onClick}
      />
    );
  }
  return (
    <div>
      <StyledSlider {...settings}>
        <div>
          <Image src="https://mobiinsidecontent.s3.ap-northeast-2.amazonaws.com/kr/wp-content/uploads/2021/01/25101208/n-Visualise.jpg"/>
        </div>
        <div>
          <Image src="https://mobiinsidecontent.s3.ap-northeast-2.amazonaws.com/kr/wp-content/uploads/2021/01/25101208/n-Visualise.jpg" />
        </div>
        <div>
          <Image src="https://mobiinsidecontent.s3.ap-northeast-2.amazonaws.com/kr/wp-content/uploads/2021/01/25101208/n-Visualise.jpg" />
        </div>
      </StyledSlider>
    </div>
  );
};

export default SimpleSlider;
