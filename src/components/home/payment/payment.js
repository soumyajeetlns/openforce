import React from 'react'
import StripeCheckout from 'react-stripe-checkout';

export default class Payment extends React.Component {
  onToken = (token) => {
    alert(token);
  }

  render() {
    return (
      <StripeCheckout
        token={this.onToken}
        name="OpenForce"
        email="info@vidhub.co"
        locale="uk"
        amount={100}
        stripeKey="pk_test_QLf1rrRSybWAIJPhuvJqVgDG00bR4hELho"
      >
      <button className="btn btn-primary">
      Use your own child component, which gets wrapped in whatever
      component you pass into as "ComponentClass" (defaults to span)
    </button>
      </StripeCheckout>
    )
  }
}