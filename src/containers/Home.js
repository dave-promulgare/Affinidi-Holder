import React, {Component, Fragment} from 'react'
import './Home.css'
import queryString from 'query-string'
import CredentialTable from '../vendors/CredentialTable';
import QrReader from 'react-qr-reader2'

class ValidatableCredential {
  constructor(credential, status = undefined, errorMessage = '') {
    this.credential = credential
    this.status = status
    this.errorMessage = errorMessage
  }
}

class Home extends Component {
  constructor(props) {
    super(props)

    const { processToken } = queryString.parse(this.props.location.search)

    this.state = {
      isLoading: false,
      isDeleteModalShown: false,
      areCredentialDetailsShown: false,
      credentials: [],
      did: null,
      verifiableCredentials: [],
      verifiablePresentationModalCredential: undefined,
      credentialShareRequestToken: processToken || undefined,
      credentialShareRequestModalToken: processToken || undefined,
      result: 'No result'
    }

  }

  handleScan = data => {
    console.log("Data is=", data);
    if (data) {
      fetch(data)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Result url=", result.url);
          let index = result.url.indexOf('/share');
          console.log("index=", index);
          let url = result.url.slice(index);
          console.log("url=",url);
          this.props.history.push(url);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )    
    }
  }

  handleError = err => {
    console.error(err)
  }

  makeVerifiableCredentials(credentials) {
    return credentials.map(credential => new ValidatableCredential(credential))
  }

  async componentDidMount() {
    try {
      const { did, credentials } = await window.sdk.getDidAndCredentials();
      this.props.userHasAuthenticated(true)
      const verifiableCredentials = this.makeVerifiableCredentials(credentials)

      this.setState({ did, credentials, verifiableCredentials })
    } catch (error) {
      this.props.userHasAuthenticated(false)
      this.props.history.push('/login')
    }
  }

  render() {
    const { verifiableCredentials } = this.state

    const haveCredentials = verifiableCredentials && verifiableCredentials.length > 0
    const { isAuthenticated } = this.props
    //const previewStyle = {
    //  height: 240,
    //  width: 320,
    //}

    return (
      <Fragment>
        <div className='Home'>
          <div>
            <QrReader
              delay={300}
              facingMode={'user'}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: '100%' }}
            />
            <p>{this.state.result}</p>
          </div>
          <form className='Form container'>
            <h1 className='Title'>Wallet</h1>
              { isAuthenticated && haveCredentials ? 
                <div className='Credentials'>
                  <CredentialTable credentials={verifiableCredentials}/>
                </div>
              : <p>You have no credentials.</p>}
          </form>
        </div>
      </Fragment>
    )
  }
}

export default Home
