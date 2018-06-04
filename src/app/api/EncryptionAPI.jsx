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
    // getKeys
}