
import './App.less';
import About from './pages/about'
import Home from './pages/home'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import CallHeader from './components/call-header'


function App() {
  return (
    <div className="App">
      <CallHeader/>
      <Router>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
