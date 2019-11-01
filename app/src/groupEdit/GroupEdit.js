import React, {Component} from 'react';
import {/*Link,*/ withRouter} from 'react-router-dom';
//import {Button, Container,  FormGroup, Input, Label} from 'reactstrap';
import {Container} from 'reactstrap';
import {Form, FormGroup, Button} from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';

class GroupEdit extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    emptyItem = {
        city: '',
        stateOrProvince: '',
        country: '',
        postalCode: '',
        alreadyVisited: '',
        anotherPerson: ''
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            item: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN')
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* formDefaults = {
         city: { value: '', isValid: true, message: '' },
         stateOrProvince: { value: '', isValid: true, message: '' },
         country: { value: '', isValid: true, message: '' },
         postalCode: { value: '', isValid: true, message: '' },
         alreadyVisited: { value: '', isValid: true, message: '' },
         anotherPerson: { value: '', isValid: true, message: '' }
     }*/

    /* state = {
         ...this.formDefaults
     };*/


    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            try {
                const group = await (await fetch(`/api/group/${this.props.match.params.id}`, {credentials: 'include'})).json();
                this.setState({item: group});
            } catch (error) {
                this.props.history.push('/');
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }


    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;

        await fetch('/api/group', {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include'
        });
        this.props.history.push('/groups');
    }


    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Group' : 'Add Group'}</h2>;

        return <div>
            <Navbar/>
            <Container>
                {title}
                <Form noValidate onSubmit={e => this.handleSubmit(e)}>
                    <FormGroup>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            required
                            name='city'
                            type="text"
                            placeholder="City"
                            value={item.city || ''}
                            onChange={this.handleChange}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>State / Province</Form.Label>
                        <Form.Control
                            required
                            name='stateOrProvince'
                            type="text"
                            placeholder="State"
                            value={item.stateOrProvince || ''}
                            onChange={this.handleChange}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            required
                            name='country'
                            type="text"
                            placeholder="Country"
                            value={item.country || ''}
                            onChange={this.handleChange}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>PostalCode</Form.Label>
                        <Form.Control
                            type="number"
                            name='postalCode'
                            placeholder="PostalCode"
                            value={item.postalCode || ''}
                            onChange={this.handleChange}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Travel Buddy</Form.Label>
                        <Form.Control
                            type="email"
                            name='anotherPerson'
                            placeholder="TravelBuddy"
                            value={item.anotherPerson || ''}
                            onChange={this.handleChange}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Travel Date</Form.Label>
                        <Form.Control
                            required
                            name='date'
                            type="date"
                            placeholder="TravelDate"
                            value={item.date || ''}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Form.Group>
                        <Form.Check
                            required
                            name='alreadyVisited'
                            label="Already visited"
                            value={item.alreadyVisited || ''}
                            onChange={this.handleChange}

                        />
                    </Form.Group>
                    <Button type="submit">Submit form</Button>
                </Form>
            </Container>
        </div>
    }
}

export default withCookies(withRouter(GroupEdit));