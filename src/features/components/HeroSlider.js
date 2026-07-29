import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
//import Research from "../../style/res/research.png";
import { NavLink } from "react-router-dom";
import "../../style/dektop/hero-slider.css";
import { useTranslation } from "react-i18next";

export default function HeroSlider() {

    const { t } = useTranslation("home");

    return (
        <Swiper modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            className="hero-swiper">
            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>{t("hero_slide_1_title")}</h1>
                        <p>A complete platform for psychological exploration, from testing to data analysis.</p>
                    </div>

                    <div className="image-replacer"></div>

                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>Take the Szondi test for free</h1>
                        <p>Discover what makes you tick and your psychological patterns using the historic Szondi test.</p>
                        <NavLink to="test">Try Now</NavLink>
                    </div>
                    <div className="image-replacer"></div>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>Stay Connected</h1>
                        <p>Message users, manage requests, and never miss a moment with smart notifications.</p>
                    </div>
                    
                    <div className="image-replacer"></div>

                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>Turn Data Into Discovery</h1>
                        <p>Use built-in tools and machine learning modules to gain deep insights.</p>
                    </div>

                    <div className="image-replacer"> </div>
                </div>
            </SwiperSlide>

        </Swiper>

    );
}