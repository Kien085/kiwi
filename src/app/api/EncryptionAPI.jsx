import firebase, { firebaseRef } from 'app/firebase/';

import forge from 'node-forge';

/**
 * Encrypt message with AES given a key and iv
 * @param {string} plaintext 
 * @param {string} key 
 * @param {string} iv
 * @returns encrypted message
 */
const encrypt = (plaintext, key, iv) => {
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(plaintext));
    let pass = cipher.finish();
    return pass ? cipher.output.toHex() : plaintext;
    // return pass ? forge.util.encode64(cipher.output.getBytes()) : plaintext;
    // if (pass) {
    //     return forge.util.encode64(cipher.output.getBytes());
    // } 
    // console.error('Encryption failed');
    // return plaintext;
}

/**
 * Decrypt message with AES given a key and iv
 * @param {string} ciphertext
 * @param {string} key 
 * @param {string} iv
 * @returns decrypted message as a String
 */
const decrypt = (ciphertext, key, iv) => {
    let data = forge.util.hexToBytes(ciphertext); // hex
    // let data = forge.util.decode64(ciphertext); 
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(data));
    let pass = decipher.finish();
    return pass ? decipher.output.toString() : ciphertext;
    // if (pass) {
    //     return decipher.output.toString();
    // }
    // console.error('Decryption failed');
    // return ciphertext;
}

/**
 * Generate public/private key pair and data key for hybrid encryption
 * @param {string} userId
 */
const generateKeys = (userId) => {
    let rsa = forge.pki.rsa;
    // generate an RSA key pair asynchronously (uses web workers if available)
    // use workers: -1 to run a fast core estimator to optimize # of workers
    rsa.generateKeyPair({bits: 2048, workers: -1}, function(err, keypair) {
        if(err) {
            console.error(err)
        } else {
            let localStorage = window.localStorage;
            let privateKey = keypair.privateKey;
            let publicKey = keypair.publicKey;
    
            // Save privateKey locally
            localStorage.setItem('privPair', privateKey);
            localStorage.setItem('pubPair', publicKey);
            // Generate a public key for symmetric encryption
            // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
            let key = forge.random.getBytesSync(32);
            let iv = forge.random.getBytesSync(32);
            localStorage.setItem('dataKey', key);
            localStorage.setItem('dataIV', iv);
    
            
            firebaseRef.child(`keys/${userId}/`).set({
                key: key,
                iv: iv
            }).then((result) => {
                dispatch(globalActions.showNotificationSuccess())
            }, (error) => dispatch(globalActions.showErrorMessage(error.code)));
            
            
        }
    });
}

/**
 * Returns key and iv of user stored in firebase
 * @param {string} userId
 * @returns decrypted message as a String
 */
// const getKeys =  (userId) => {
//     console.log("OUTPUT: in function getKeys() of EncryptionAPI")
//     let key, iv;
//     let keysRef = firebaseRef.child(`keys/${userId}`);
//     keysRef.once('value', (snap) => {
//         if(snap.val()) {
//             key = snap.val().key || {};
//             iv = snap.val().iv || {};
//         }
//     });
// }

export default {
    encrypt,
    decrypt,
    generateKeys,
    // getKeys
}