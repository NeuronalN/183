import React, {Component} from 'react';
import '../css/App.css';
import Navbar from '../navbar/Navbar';
import {Link} from 'react-router-dom';
import {Button, Container} from 'reactstrap';

class Home extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <Container fluid>
                    <Button color="link"><Link to="/groups">Manage My Tour</Link></Button>
                </Container>
            </div>
        );
    }
}

export default Home;