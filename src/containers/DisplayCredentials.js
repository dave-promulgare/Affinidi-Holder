import React from 'react';

const DisplayCredentials = ({cred}) => {
    console.log(cred)
    const { name } = cred.credentialSubject.data;
    const { email } = cred.credentialSubject.data;
    
    return (
        <>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
        </>
    )   
}

export default DisplayCredentials;