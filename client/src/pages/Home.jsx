import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";

export default function Home({ onNavigate }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <Features />
    </>
  );
}
