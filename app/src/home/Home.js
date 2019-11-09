import React, {Component} from 'react';
import '../css/App.css';
import Navbar from '../navbar/Navbar';
import {Link} from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import {withCookies} from 'react-cookie';

/**
 * Shows the Home
 *
 * Author Brian Bernhauser
 */
class Home extends Component {
    state = {
        isLoading: true,
        isAuthenticated: false,
        user: undefined
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.csrfToken = cookies.get('XSRF-TOKEN');
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Will be called on Component call
    async componentDidMount() {
        const response = await fetch('/api/user', {credentials: 'include'});
        const body = await response.text();
        if (body === '') {
            this.setState(({isAuthenticated: false}))
        } else {
            this.setState({isAuthenticated: true, user: JSON.parse(body)})
        }
    }

    // Handles the Login
    login() {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
            port = ':8080';
        }
        window.location.href = '//' + window.location.hostname + port + '/private';
    }

    // Handels the Logout
    logout() {
        fetch('/api/logout', {
            method: 'POST', credentials: 'include',
            headers: {'X-XSRF-TOKEN': this.state.csrfToken}
        }).then(res => res.json())
            .then(response => {
                window.location.href = response.logoutUrl + "?id_token_hint=" +
                    response.idToken + "&post_logout_redirect_uri=" + window.location.origin;
            });
    }

    // Renders the Home
    render() {
        const message = this.state.user ?
            <h2>Welcome, {this.state.user.name}!</h2> :
            <p>Please log in to manage your Tour.</p>;

        const button = this.state.isAuthenticated ?
            <div>
                <Button color="link"><Link to="/groups">Manage your Tour</Link></Button>
                <br/>
                <Button color="link" onClick={this.logout}>Logout</Button>
            </div> :
            <Button color="primary" onClick={this.login}>Login</Button>;

        return (
            <div>
                <Navbar/>
                <Container fluid>
                    {message}
                    {button}
                </Container>
            </div>
        );
    }
}

export default withCookies(Home);