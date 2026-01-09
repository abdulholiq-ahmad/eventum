import React from 'react';

export interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
}

export interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}