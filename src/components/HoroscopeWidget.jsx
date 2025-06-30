import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import '../css/Horoscope.css';

const signs = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

// Unicode zodiac symbols for each sign
const zodiacSymbols = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

const HoroscopeWidget = ({ horoscopeapiKey }) => {
  const [selectedSign, setSelectedSign] = useState("aries");
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!horoscopeapiKey) {
      setError("API key is required");
      return;
    }

    const fetchHoroscope = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.api-ninjas.com/v1/horoscope?zodiac=${selectedSign}`,
          {
            headers: { "X-Api-Key": horoscopeapiKey },
          }
        );

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        setHoroscope(data);
      } catch (err) {
        setError("Failed to fetch horoscope.");
        setHoroscope(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [selectedSign, horoscopeapiKey]);

  return (
    <section className="sidebar-section horoscope">
      <h3>Today's Horoscope</h3>
      <select
        value={selectedSign}
        onChange={(e) => setSelectedSign(e.target.value)}
        aria-label="Select Zodiac Sign"
      >
        {signs.map((sign) => (
          <option key={sign} value={sign}>
            {zodiacSymbols[sign]} {sign.charAt(0).toUpperCase() + sign.slice(1)}
          </option>
        ))}
      </select>

      {loading && <p>Loading horoscope...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {horoscope && (
        <div>
          <p>{horoscope.horoscope}</p>
          <p>
            <strong>Date:</strong> {horoscope.date}
          </p>
        </div>
      )}
    </section>
  );
};

HoroscopeWidget.propTypes = {
  horoscopeapiKey: PropTypes.string.isRequired,
};

export default HoroscopeWidget;
