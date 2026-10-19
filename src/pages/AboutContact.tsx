import React from 'react';
import { useApp } from '../components/AppContext';
import { LocationSection } from '../components/LocationSection';
import { AboutExperience } from '../components/about/AboutExperience';
import { OpticalCta } from '../components/OpticalCta';

export const AboutContact: React.FC = () => {
  const { activePage } = useApp();

  // The contact route keeps its existing, dedicated maps, support, and booking UI.
  return activePage === 'contact' ? (
    <>
      <LocationSection />
      <OpticalCta placement="contact" />
    </>
  ) : (
    <>
      <AboutExperience />
      <OpticalCta placement="about" />
    </>
  );
};
