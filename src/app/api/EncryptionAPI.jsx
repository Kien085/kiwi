import firebase, { firebaseRef } from '../firebase/';

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
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(plaintext));
    let pass = cipher.finish();
    return pass ? cipher.output.toHex() : plaintext;
}

/**
 * Decrypt message with AES given a key and iv
 * @param {string} ciphertext
 * @param {string} key 
 * @param {string} iv
 * @returns decrypted message as a String
 */
const decrypt = (ciphertext, key, iv) => {
    let data = forge.util.hexToBytes(ciphertext);
    const decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(data));
    let pass = decipher.finish();
    return pass ? decipher.output.toString() : ciphertext;
}

/**
 * Generate public/private key pair and data key for hybrid encryption
 * @param {string} userId
 */
const generateKeys = (userId) => {
    // let localStorage = window.localStorage;
    // let keyPair = keypair();
    // let publicKey = forge.pki.publicKeyFromPem(keyPair.public);
    // let privateKey = forge.pki.privateKeyFromPem(keyPair.private)

    // // Save private/public key pair locally
    // localStorage.setItem('keyPair', JSON.stringify(keyPair));

    // localStorage.setItem('privateKey', privateKey);
    // localStorage.setItem('publicKey', publicKey);

    // // Generate a public key for symmetric encryption
    // // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
    // let key = forge.random.getBytesSync(32);
    // let iv = forge.random.getBytesSync(32);
    // localStorage.setItem('dataKey', key);
    // localStorage.setItem('dataIV', iv);

    // // encrypt data with a public key (defaults to RSAES PKCS#1 v1.5)
    // let encryptedKey = publicKey.encrypt(key);
    // let encryptedIV = publicKey.encrypt(iv);

    // // store public key and encrypted data key 
    // let updates = {};
    // updates[`keys/${userId}`] = {
    //     publicKey: keyPair.public,
    //     key: encryptedKey,
    //     iv: encryptedIV,
    // };
    // return firebaseRef.update(updates);
    forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, (err, keypair) => {
        if (err) {
            console.error(err)
        } else {
            let localStorage = window.localStorage;
            let privateKey = keypair.privateKey;
            let publicKey = keypair.publicKey;

            let keyPair = {
                public: forge.pki.publicKeyToPem(publicKey),
                private: forge.pki.privateKeyToPem(privateKey),
            }
            debugger;
            localStorage.setItem('keyPair', JSON.stringify(keyPair));

            // Save privateKey locally
            // localStorage.setItem('privateKey', privateKey);
            // localStorage.setItem('publicKey', publicKey);
            // Generate a public key for symmetric encryption
            // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
            let key = forge.random.getBytesSync(32);
            let iv = forge.random.getBytesSync(32);
            localStorage.setItem('dataKey', key);
            localStorage.setItem('dataIV', iv);


            // encrypt data with a public key (defaults to RSAES PKCS#1 v1.5)
            let encryptedKey = publicKey.encrypt(key);
            let encryptedIV = publicKey.encrypt(iv);

            // store public key and encrypted data key 
            let updates = {};
            updates[`keys/${userId}/${userId}`] = {
                publicKey: keyPair.public,
                key: encryptedKey,
                iv: encryptedIV,
            };
            return firebaseRef.update(updates);
        }
    });
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