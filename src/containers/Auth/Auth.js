import React from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';

class Auth extends React.Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your email'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignup: true
  }

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    })
  };

  submitHandler = (event) => {
    event.preventDefault();
    const { auth } = this.props;
    const email = this.state.controls.email.value;
    const password = this.state.controls.password.value;

    auth(email, password, this.state.isSignup);
  };

  inputChangedHandler = (id) => (event) => {
    const updatedControls = { ...this.state.controls };
    const updatedFormElement = { ...updatedControls[id] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedControls[id] = updatedFormElement;

    this.setState({ controls: updatedControls });
  };

  form = () => {
    const { request, error } = this.props;

    if (request === 'requested') {
      return <Spinner />
    }

    const formElements = Object.keys(this.state.controls).map((key) => {
      const formElement = this.state.controls[key];
      return (
        <Input
          key={key}
          changed={this.inputChangedHandler(key)}
          elementType={formElement.elementType}
          elementConfig={formElement.elementConfig}
          value={formElement.value}
          touched={formElement.touched}
          shouldValidate={formElement.validation}
          invalid={!formElement.valid} />
      );
    });

    return (
      <>
        { error && <p>{ error.message }</p> }
        <form onSubmit={this.submitHandler}>
          {formElements}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button
          clicked={this.switchAuthModeHandler}
          btnType="Danger">
          SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP' }
        </Button>
      </>
    );
  }

  render() {
    return (
      <div className={classes.Auth}>
        {this.form()}
      </div>
    );
  }
}

const mapActionsToProps = {
  auth: actions.auth
};

const mapStateToProps = (state) => {
  return {
    request: state.auth.request,
    error: state.auth.error
  };
}

export default connect(mapStateToProps, mapActionsToProps)(Auth);
