// must include this file as a script in header within index.html in
// order to use the following anywhere
var KeyHelper = libsignal.KeyHelper;

/**
 * Converts an Array Buffer into a String
 * @param  {ArrayBuffer} buf Array Buffer holding a message
 * @return {String} The plaintext message, assumed to be decrypted already, prior to function call
 */
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

/**
 * Converts a String into an ArrayBuffer, to be used to encrypt message's bytes
 * @param  {String} str Message string in plaintext
 * @return {ArrayBuffer} Message represented in an ArrayBuffer
 */
function str2ab(str) {
    // ensure that the string is 16 byte aligned
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char

    // we will use a Uint16Array to convert the message into bytes
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/**
 * Generate an Identity Key Pair for a User
 * @param  {object} store The interface to this user's Signal storage
 * @return {Promise} Returns a Promise, which when completed, will have stored
 * a this user's Identity Key Pair in their local storage
 */
function generateIdentity(store) {

    // wait for the key pair and registration id to generate before
    // storing
    return Promise.all([
        KeyHelper.generateIdentityKeyPair(),
        KeyHelper.generateRegistrationId(),
    ]).then(function(result) {

        // store the Identity Key Pair
        // and Registration ID in this user's local storage
        store.saveLocalIdentityKey('identityKey',result[0]);
        store.saveLocalRegId('registrationId', result[1]);
        
    });
}

/**
 * Generate a PreKey Bundle for this user
 * @param  {object} store The interface to this user's Signal storage
 * @param  {int} preKeyId a generated random integer to be used to generate a PreKey
 * @param  {int} signedPreKeyId a generated random integer to be used to generate a Signed PreKey
 * @return {Promise} Returns a Promise, which when completed, will have stored
 *  this user's PreKeyBundle in their local storage and on a remote database
 */
function generatePreKeyBundle(store, preKeyId, signedPreKeyId) {

    // generate a PreKey Bundle
    // first retrieve this User's Identity Key Pair and Registration ID
    // from local storage
    return Promise.all([
        store.getIdentityKeyPair(),
        store.getLocalRegistrationId()
    ]).then(function(result) {
        
        let identity = result[0];
        let registrationId = result[1];
   
        // now generate the PreKey and Signed PreKey
        return Promise.all([
            KeyHelper.generatePreKey(preKeyId),
            KeyHelper.generateSignedPreKey(identity, signedPreKeyId),
        ]).then(function(keys) {

            let preKey = keys[0]
            let signedPreKey = keys[1];

            // store the PreKey in this user's local storage
            store.storePreKey(preKeyId, preKey.keyPair);
         
            // stored the signed PreKey in this user's local storage
            store.storeSignedPreKey(signedPreKeyId, signedPreKey);

            // Unused for now, dead code
            // store.loadSignedPreKey(signedPreKeyId);

            // send this object to the server Key Distribution Center
            // TODO: determine how to generate new PreKeys for each new session
            // with another user
            // all other information in this bundle can remain the same (even the
            // signed PreKey)
            let preKeyBundle = {
                identityKey: new Uint8Array(identity.pubKey),
                registrationId : registrationId,
                preKey:  {
                    keyId     : preKeyId,
                    publicKey : new Uint8Array(preKey.keyPair.pubKey)
                },
                signedPreKey: {
                    keyId     : signedPreKeyId,
                    publicKey : new Uint8Array(signedPreKey.keyPair.pubKey),
                    signature : new Uint8Array(signedPreKey.signature)
                }
            };

            // store in the database
            return Promise.all([firebase.database()
                .ref('keyDistroStore/'+store.getUser()+'/preKeyBundle')
                    .set(preKeyBundle)]);
            
        });
    });
}


// the following is a scenario on how messaging would work between two users

// generate an Address for Bob and Alice
let ALICE_ADDRESS = new libsignal.SignalProtocolAddress("alice", 1);
let BOB_ADDRESS   = new libsignal.SignalProtocolAddress("bob", 1);

// mimic having Alice's store for now
let aliceStore = new SignalProtocolStore("alice");
// these numbers must be generated randomly in the actual
// implementation on the client side
let alicePreKeyId = 5678;
let aliceSignedKeyId = 1;

// mimic having Bob's store for now
let bobStore = new SignalProtocolStore("bob");
// these numbers must be generated randomly in the actual
// implementation on the client side
let bobPreKeyId = 1234;
let bobSignedKeyId = 1;




// var Curve = libsignal.Curve;

    // generate the identity's of both people
    Promise.all([
        generateIdentity(aliceStore),
        generateIdentity(bobStore)])
    .then( () =>
        Promise.all([
            generatePreKeyBundle(bobStore, bobPreKeyId, bobSignedKeyId),
            generatePreKeyBundle(aliceStore, alicePreKeyId, aliceSignedKeyId)
    ])).then(
        // store each user's public keys (aka their PreKeyBundle) into a remote database
        () => Promise.all([firebase.database()
        .ref('keyDistroStore/'+bobStore.getUser()+'/preKeyBundle').once('value'),
        firebase.database()
        .ref('keyDistroStore/'+aliceStore.getUser()+'/preKeyBundle').once('value')])) 
        
    .then(function(preKeyBundle) {

        // process the PreKeyBundle so that the keys are ArrayBuffers in this step
        
        // start of converting Bob's PreKey Bundle to ArrayBuffers since when retrieved
        // from the database they are strings
        preKeyBundleBob = preKeyBundle[0].val();
        preKeyBundleBob.identityKey = 
            bobStore.toArrayBuffer(preKeyBundleBob.identityKey, preKeyBundleBob.identityKey.length); 

        preKeyBundleBob.preKey.publicKey = 
            bobStore.toArrayBuffer(preKeyBundleBob.preKey.publicKey, preKeyBundleBob.preKey.publicKey.length); 
        
        preKeyBundleBob.signedPreKey.publicKey = 
            bobStore.toArrayBuffer(preKeyBundleBob.signedPreKey.publicKey, preKeyBundleBob.signedPreKey.publicKey.length);
            
        preKeyBundleBob.signedPreKey.signature = 
            bobStore.toArrayBuffer(preKeyBundleBob.signedPreKey.signature, preKeyBundleBob.signedPreKey.signature.length);

        // start of converting Alice's PreKey Bundle to ArrayBuffers since when retrieved
        // from the database they are strings
        preKeyBundleAlice = preKeyBundle[1].val();

        preKeyBundleAlice.identityKey = 
            bobStore.toArrayBuffer(preKeyBundleAlice.identityKey, preKeyBundleAlice.identityKey.length); 

        preKeyBundleAlice.preKey.publicKey = 
            bobStore.toArrayBuffer(preKeyBundleAlice.preKey.publicKey, preKeyBundleAlice.preKey.publicKey.length); 
        
        preKeyBundleAlice.signedPreKey.publicKey = 
            bobStore.toArrayBuffer(preKeyBundleAlice.signedPreKey.publicKey, preKeyBundleAlice.signedPreKey.publicKey.length);
            
        preKeyBundleAlice.signedPreKey.signature = 
            bobStore.toArrayBuffer(preKeyBundleAlice.signedPreKey.signature, preKeyBundleAlice.signedPreKey.signature.length);
        
        // Only one of the session builders are required to start a session between
        // them since the first message sent from Alice or Bob will be a WhipserMessage (which is just
        // a sort of request to the receiving user to build a session with the sender)

        // build a session from Alice to Bob
        let aliceBuilder = new libsignal.SessionBuilder(aliceStore, BOB_ADDRESS);

        // build a session from Bob to Alice
        let bobBuilder = new libsignal.SessionBuilder(bobStore, ALICE_ADDRESS);
        
        // process the PreKey in order for each user to verify the 
        // validity of preKey (using Signed Keys) of the other user
        return Promise.all([aliceBuilder.processPreKey(preKeyBundleBob),
            bobBuilder.processPreKey(preKeyBundleAlice)
        ]).then(function() {

            // now we are ready to start sending messages
            // this section is Alice sending a message to Bob
            var originalMessage = str2ab("my message ......");

            var aliceSessionCipher = new libsignal.SessionCipher(aliceStore, BOB_ADDRESS);
            var bobSessionCipher = new libsignal.SessionCipher(bobStore, ALICE_ADDRESS);
        
            // alice encrypts the message and needs to then give the ciphertext to Bob
            // somehow
            // TODO: must have a way for Bob to receive the ciphertext
            // if Alice is the one who starts the session, then Bob needs to confirm
            // Alice's idenity using decrypt PreKey Whisper Message
            aliceSessionCipher.encrypt(originalMessage).then(function(ciphertext) {

                // check for ciphertext.type to be 3 which includes the PREKEY_BUNDLE
                return bobSessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');

            }).then(function(plaintext) {
                
                // this section is Bob successfully decrypting Alice's message
                // and reading the plaintext
                plaintext = ab2str(plaintext);
                alert(plaintext);

            }).then(() => {
                
                // now assuming that Bob and Alice have a session built and ongoing,
                // now Bob can reply to Alice with a message
                bobSessionCipher.encrypt("Hi Alice!").then(function (cipher) {
                
                    // since a session is built, no need for Alice to use the decryptPreKeyWhisperMessage
                    // function
                    return aliceSessionCipher.decryptWhisperMessage(cipher.body, 'binary');

                }).then(function (bobResponse) {
                
                // this is another way to decode messages once they are decrypted
                // since messages will come in the form of ArrayBuffers
                // this is a safer way because it does not require the messages to be
                // 16 byte aligned, this method is used by Signal when it decodes ArrayBuffers
                console.log(new dcodeIO.ByteBuffer.wrap(bobResponse).toString('binary'));
                    alert(new dcodeIO.ByteBuffer.wrap(bobResponse).toString('binary'));
                } );
            });
        });
    });