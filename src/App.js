import './App.css';
import Parse from 'parse/dist/parse.min.js';
import { IntimacaoComponent } from './components/IntimacaoComponent';
import logoPCSC from './logo-policial-civil.png';

const PARSE_APPLICATION_ID = 'urPT0p0RFHPI8wC0fUrL1VH0P1nB5k3bl4S8hfL3';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'h1a8coVT1TodF5jyA1xxhdUx8NaYZDeabmeXvz2r';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logoPCSC}/>
        <h1>INTIMAÇÃO VIRTUAL</h1>
        <IntimacaoComponent/>
      </header>
    </div>
  );
}

export default App;
