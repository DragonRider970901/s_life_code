import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import "../../style/dektop/home.css";
import HeroSlider from '../components/HeroSlider';
import RecentArticles from './RecentArticles';
import RecentSurveys from './RecentSurveys';

export default function Home() {
  

  return (
    <div className="home-container">
      <HeroSlider />

      <RecentArticles />
      <RecentSurveys />
    </div>
  );
}
