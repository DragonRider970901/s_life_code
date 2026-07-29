import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import "../../style/dektop/home.css";
import HeroSlider from '../components/HeroSlider';
import RecentArticles from './RecentArticles';
import RecentSurveys from './RecentSurveys';
import { useTranslation } from "react-i18next";

export default function Home() {
  

  const { t } = useTranslation("home");

  return (
    <div className="home-container">
      <HeroSlider />

      <RecentArticles />
      <RecentSurveys />
    </div>
  );
}
