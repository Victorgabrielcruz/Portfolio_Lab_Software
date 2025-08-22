import React from "react";
import "../assets/styles/about.css";
import AboutImage from "../assets/images/about.png";

export default function About() {
  return (
    <section className="container-about">
      <div className="about">
        <article className="img-about">
          <img src={AboutImage} alt="About Me" />
        </article>
        <article className="about-description">
          <h2 className="about-h2">Your Name</h2>
          <p className="paragraph-blocks-about">
            Intro text: Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="paragraph-blocks-about">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
            lectus sit amet elit consequat tempus. Integer id nulla vel lacus
            commodo finibus.
          </p>
          <p className="paragraph-blocks-about">
            Suspendisse potenti. Proin et lorem eros. Integer sed magna ac felis
            fermentum bibendum.
          </p>
        </article>
      </div>
    </section>
  );
}
