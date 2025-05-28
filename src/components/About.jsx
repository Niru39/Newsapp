import React from 'react';
import '../App.css';
// import aboutBanner from './assets/about-banner.jpg';
// import teamMember1 from './assets/team1.jpg';
// import teamMember2 from './assets/team2.jpg';
// import teamMember3 from './src/assets/team3.jpg';

const teamMembers = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Editor-in-Chief',
    
    bio: 'Alice leads our editorial team ensuring top-notch quality and reliability.',
  },
  {
    id: 2,
    name: 'Mark Stevens',
    role: 'Senior Journalist',
    
    bio: 'Mark covers global politics and investigative stories with passion.',
  },
  {
    id: 3,
    name: 'Linda Martinez',
    role: 'Tech Reporter',

    bio: 'Linda keeps us updated on the latest in technology and innovation.',
  },
];

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="about-banner" >
        <h1>About Us</h1>
      </div>

      <div className="about-container">
        {/* Our Story */}
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2023, our news platform was born out of a desire to create a
            trustworthy source of information in an era of rapid change and information overload.
            We started as a small team of passionate journalists and tech experts dedicated to
            transparency and integrity.
          </p>
          <p>
            Over time, we've grown into a vibrant community and a platform that delivers balanced,
            timely, and well-researched news to thousands of readers worldwide.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="about-section mission">
          <div>
            <h2>Our Mission</h2>
            <p>
              To empower individuals by delivering accurate, reliable, and accessible news
              that fosters informed decision-making and meaningful conversations.
            </p>
          </div>
          </section>
          <section className='about-section vission'>
          <div>
            <h2>Our Vision</h2>
            <p>
              To be the most trusted news source, building a world where truth and knowledge
              inspire progress and understanding.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="about-section values">
          <h2>Our Core Values</h2>
          <ul>
            <li><strong>Integrity:</strong> We adhere to the highest standards of journalistic ethics.</li>
            <li><strong>Transparency:</strong> We are open about our processes and sources.</li>
            <li><strong>Accuracy:</strong> We fact-check rigorously to maintain credibility.</li>
            <li><strong>Inclusivity:</strong> We represent diverse voices and perspectives.</li>
            <li><strong>Innovation:</strong> We embrace new technologies to improve storytelling.</li>
          </ul>
        </section>

        {/* Our Team */}
        <section className="about-section team">
          <h2>Meet Our Team</h2>
          <div className="team-cards">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <img src={member.photo} alt={member.name} className="team-photo" />
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
