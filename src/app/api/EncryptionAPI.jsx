import firebase, { firebaseRef } from '../firebase/';

import forge from 'node-forge';
import keypair from 'keypair';

/**
 * Encrypt message with AES given a key and iv
 * @param {string} plaintext 
 * @param {string} key 
 * @param {string} iv
 * @returns encrypted message
 */
const encrypt = (plaintext, key, iv) => {
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv: iv });
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
    decipher.start({ iv: iv });
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
    let localStorage = window.localStorage;
    let keyPair = keypair();
    let publicKey = forge.pki.publicKeyFromPem(keyPair.public);
    let privateKey = forge.pki.privateKeyFromPem(keyPair.private)

    // Save private/public key pair locally
    localStorage.setItem('keyPair', JSON.stringify(keyPair));

    localStorage.setItem('privateKey', privateKey);
    localStorage.setItem('publicKey', publicKey);

    // Generate a public key for symmetric encryption
    // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
    let key = forge.random.getBytesSync(32);
    let iv = forge.random.getBytesSync(32);
    localStorage.setItem('dataKey', key);
    localStorage.setItem('dataIV', iv);

    // encrypt data with a public key (defaults to RSAES PKCS#1 v1.5)
    let encryptedKey = publicKey.encrypt(key);
    let encryptedIV = publicKey.encrypt(iv);

    // send 'encrypted', 'iv', 'tag', and result.encapsulation to recipient 
    let updates = {};
    updates[`keys/${userId}/${userId}`] = {
        publicKey: keyPair.public,
        key: encryptedKey,
        iv: encryptedIV,
    };
    return firebaseRef.update(updates);
}

/**
 * Send encrypted data key to user added to friend list
 * @param {string} userId is own identifier
 * @param {string} friendId is the identifier of user to send key to
 */
const sendEncryptedKey = (userId, friendId) => {
    return firebaseRef.child(`keys/${friendId}/${friendId}`).once('value', (snapshot) => {
        let publicPEM = snapshot.val().publicKey || '';
        let publicKey = forge.pki.publicKeyFromPem(publicPEM);

        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');

        // Encrypt your data key with friend's public key
        let encryptedKey = publicKey.encrypt(key);
        let encryptedIV = publicKey.encrypt(iv);

        // Send your encrypted data key to friend
        return firebaseRef.child(`keys/${friendId}/${userId}/`).set({
            key: encryptedKey,
            iv: encryptedIV,
        });
    });
}

export default {
    encrypt,
    decrypt,
    generateKeys,
    sendEncryptedKey,
}