import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import Navbar from '../navbar/Navbar';
import {Link, withRouter} from 'react-router-dom';
import {instanceOf} from 'prop-types';
import {withCookies, Cookies} from 'react-cookie';

/**
 * Shows the List of Trips
 *
 * Author Brian Bernhauser
 */
class GroupList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {groups: [], csrfToken: cookies.get('XSRF-TOKEN'), isLoading: true};
        this.remove = this.remove.bind(this);
    }

    // Will be called on Component call
    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/groups', {credentials: 'include'})
            .then(response => response.json())
            .then(data => this.setState({groups: data, isLoading: false}))
            .catch(() => this.props.history.push('/'));
    }

    // Will be called when a Trip is getting removed
    async remove(id) {
        await fetch(`/api/group/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(() => {
            let updatedGroups = [...this.state.groups].filter(i => i.id !== id);
            this.setState({groups: updatedGroups});
        });
    }

    // Renders the Trip list
    render() {
        const {groups, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const groupList = groups.map(group => {
            const address = `${group.city || ''} ${group.stateOrProvince || ''}`;
            const time = `${group.date}`;
            const travelBuddy = `${group.anotherPerson}`;
            return <tr key={group.id}>
                <td>{time}</td>
                <td>{address}</td>
                <td>{travelBuddy}</td>
                <td>{group.events.map(event => {
                    return <div key={event.id}> {event.dateOfCreation}</div>
                })}</td>

                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(group.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <Navbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/groups/new">Add Group</Button>
                    </div>
                    <h3>My Tour</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Travel Date</th>
                            <th width="20%">Location</th>
                            <th>Travel Buddy</th>
                            <th>Date of Creation</th>
                            <th width="10%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groupList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(GroupList));
