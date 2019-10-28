import React, {Component} from 'react';
import './css/App.css';
import Home from './home/Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import GroupList from './groupList/GroupList';
import GroupEdit from './groupEdit/GroupEdit';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact={true} component={Home}/>
                    <Route path='/groups' exact={true} component={GroupList}/>
                    <Route path='/groups/:id' component={GroupEdit}/>

                </Switch>
            </Router>
        )
    }
}

export default App;