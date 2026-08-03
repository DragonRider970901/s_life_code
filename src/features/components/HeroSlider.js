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
                        <h1>{t("hero.slide1.title")}</h1>
                        <p>{t("hero.slide1.subtitle")}</p>
                    </div>

                    <div className="image-replacer"></div>

                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>{t("hero.slide2.title")}</h1>
                        <p>{t("hero.slide2.subtitle")}</p>
                        <NavLink to="test">{t("hero.slide2.buttonText")}</NavLink>
                    </div>
                    <div className="image-replacer"></div>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>{t("hero.slide3.title")}</h1>
                        <p>{t("hero.slide3.subtitle")}</p>
                    </div>
                    
                    <div className="image-replacer"></div>

                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className="slide-content">
                    <div className="slide-content-text">
                        <h1>{t("hero.slide4.title")}</h1>
                        <p>{t("hero.slide4.subtitle")}</p>
                    </div>

                    <div className="image-replacer"> </div>
                </div>
            </SwiperSlide>

        </Swiper>

    );
}