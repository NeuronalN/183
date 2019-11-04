import React, {Component} from 'react';
import {/*Link,*/ withRouter} from 'react-router-dom';
//import {Button, Container,  FormGroup, Input, Label} from 'reactstrap';
import {Container} from 'reactstrap';
import {Form, FormGroup, Button} from 'react-bootstrap';
import Navbar from '../navbar/Navbar';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import className from 'classnames';

import * as Regex from '../regex/Regex';

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
    formDefaults = {
        city: {isValid: true, message: ''},
        stateOrProvince: {isValid: true, message: ''},
        country: {isValid: true, message: ''},
        postalCode: {isValid: true, message: ''},
        anotherPerson: {isValid: true, message: ''}
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            item: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN'),
            formDefaults: this.formDefaults
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }





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

    /*  onChange = (e) => {
          const state = {
              ...this.state,
              [e.target.name]: {
                  ...this.state[e.target.name],
                  value: e.target.value,
              }
          };
          this.setState(state);
      }*/

    async handleSubmit(event) {
        event.preventDefault();
        if (this.formValidation()) {
        const {item} = this.state;//.item

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
    }

    htmlEscape = text => {
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }


        formValidation = () =>{
            let item = {...this.state.item};
            let formDefaults = {...this.state.formDefaults};
            let isValid = true;

            item.city = this.htmlEscape(item.city.trim());
            item.stateOrProvince = this.htmlEscape(item.stateOrProvince .trim());
            item.country = this.htmlEscape(item.country.trim());
            item.postalCode = this.htmlEscape(item.postalCode.trim());
            item.anotherPerson = this.htmlEscape(item.anotherPerson.trim());

            if (item.city.length > 3 && item.city.length <= 25 && item.city.match(Regex.CITY_REGEX)){
                formDefaults.city.isValid = true;
            } else{
                formDefaults.city.isValid = false;
                isValid = false;
                formDefaults.city.message = 'The City name must be at least 3 characters long and cant be longer than 25 characters';
            }

            if (item.stateOrProvince.length > 3 && item.stateOrProvince.length <= 25 && item.stateOrProvince.match(Regex.STATE_OR_PROVINCE_REGGEX)) {
                formDefaults.stateOrProvince.isValid = true;
            } else{
                formDefaults.stateOrProvince.isValid = false;
                isValid = false;
                formDefaults.stateOrProvince.message = 'The State or Province name must be at least 3 characters long and cant be longer than 25 characters';
            }

            if (item.country.length >= 3 && item.country.length <= 25 && item.country.match(Regex.COUNTRY_REGEX)) {
                formDefaults.country.isValid = true;
            } else{
                formDefaults.country.isValid = false;
                isValid = false;
                formDefaults.country.message = 'The City name must be at least 3 characters long and cant be longer than 25 characters';
            }
            if (item.postalCode.length > 4 && item.postalCode.length <= 12 && item.postalCode.match(Regex.POSTALCODE_REGEX) ){
                formDefaults.postalCode.isValid = true;
            }else {
                formDefaults.postalCode.isValid = false;
                isValid = false;
                formDefaults.postalCode.message = 'The Post Code must be at least 4 numbers long an cant be longer than 12 numbers';
            }
            if (item.anotherPerson.match(Regex.ANOTHER_PERSON_REGEX)){
                formDefaults.anotherPerson.isValid = true;
            }else{
                formDefaults.anotherPerson.isValid = false;
                isValid = false;
                formDefaults.anotherPerson.message = 'Must be a valid email adress';
            }

            if (!isValid){
                console.log(formDefaults);
                this.setState({
                    formDefaults
                });
            }
            return isValid;

        }

    render() {
        const {item, formDefaults} = this.state;
        const title = <h2>{item.id ? 'Edit Group' : 'Add Group'}</h2>;
        const cityClass = className({'Not valid': !formDefaults.city.isValid});
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
                            className={cityClass}
                            type="text"
                            placeholder="City"
                            value={item.city || ''}
                            onChange={this.handleChange}

                        />
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formDefaults.city.message}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formDefaults.stateOrProvince.message}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formDefaults.country.message}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formDefaults.postalCode.message}
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type='invalid'>
                            {this.state.formDefaults.anotherPerson.message}
                        </Form.Control.Feedback>
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