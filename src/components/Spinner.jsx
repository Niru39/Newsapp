
import loading from './loading.gif'
import '../css/Spinner.css';

const Spinner=()=> {
    
      return (
        <div className="spinner-container">
          <img src={loading} alt="loading" />
        </div>
      );
    }
  
  
  export default Spinner