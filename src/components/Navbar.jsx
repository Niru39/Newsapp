import React, { Component, useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';



// // export class Navbar extends Component {
// //   // Track the menu state
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       isMenuOpen: false, // Initialize the menu state as closed
// //     };
// //   }

// //   toggleMenu = () => {
// //     this.setState(prevState => ({
// //       isMenuOpen: !prevState.isMenuOpen, // Toggle the menu state
// //     }));
// //   };

// //   // Close the menu when a link is clicked
// //   closeMenu = () => {
// //     this.setState({ isMenuOpen: false });
// //   };

// //   render() {




//     return (
//       <nav className="navbar">
//         <div className="navbar-container">
//           <Link className="navbar-brand" to="/">NewsToday</Link>

//           {/* Links */}
//           <div className={`navbar-links ${this.state.isMenuOpen ? 'active' : ''}`}>
//             <Link className="nav-link" to="/home" onClick={this.closeMenu}>Home</Link>
//             <Link className="nav-link" to="/about" onClick={this.closeMenu}>About</Link>
//             <Link className="nav-link" to="/business" onClick={this.closeMenu}>Business</Link>
//             <Link className="nav-link" to="/general" onClick={this.closeMenu}>General</Link>
//             <Link className="nav-link" to="/entertainment" onClick={this.closeMenu}>Entertainment</Link>
//             <Link className="nav-link" to="/health" onClick={this.closeMenu}>Health</Link>
//             <Link className="nav-link" to="/sports" onClick={this.closeMenu}>Sports</Link>
//             <Link className="nav-link" to="/science" onClick={this.closeMenu}>Science</Link>
//             <Link className="nav-link" to="/technology" onClick={this.closeMenu}>Technology</Link>
//           </div>

//           {/* Toggle Button for Mobile */}
//           <button
//             className="navbar-toggle"
//             onClick={this.toggleMenu}
//             aria-label="Toggle Navigation Menu"
//           >
//             ☰
//           </button>

//           {/* Dark Mode Toggle */}
//           <button className="dark-mode-toggle" onClick={this.props.toggleMode}>
//             {this.props.mode === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
//           </button>
//         </div>
//       </nav>
//     );
//   // }
// }

// export default Navbar;


const Navbar = ({ toggleMode, mode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">NewsToday</Link>

        {/* Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link className="nav-link" to="/home" onClick={closeMenu}>Home</Link>
          <Link className="nav-link" to="/about" onClick={closeMenu}>About</Link>
          <Link className="nav-link" to="/business" onClick={closeMenu}>Business</Link>
          <Link className="nav-link" to="/general" onClick={closeMenu}>General</Link>
          <Link className="nav-link" to="/entertainment" onClick={closeMenu}>Entertainment</Link>
          <Link className="nav-link" to="/health" onClick={closeMenu}>Health</Link>
          <Link className="nav-link" to="/sports" onClick={closeMenu}>Sports</Link>
          <Link className="nav-link" to="/science" onClick={closeMenu}>Science</Link>
          <Link className="nav-link" to="/technology" onClick={closeMenu}>Technology</Link>
        </div>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          ☰
        </button>

        {/* Dark Mode Toggle */}
        <button className="dark-mode-toggle" onClick={toggleMode}>
          {mode === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
