import React, {Component} from 'react';
import './css/App.css';
import Home from './home/Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import GroupList from './groupList/GroupList';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact={true} component={Home}/>
                    <Route path='/groups' exact={true} component={GroupList}/>
                </Switch>
            </Router>
        )
    }
}

export default App;