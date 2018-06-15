function SignalProtocolStore(user) {

  this.store = {};
  this.user = user;
  if (this.getLocalStorage('store')) {
    this.store = this.getLocalStorage('store');
  }
}

SignalProtocolStore.prototype = {
  Direction: {
    SENDING: 1,
    RECEIVING: 2,
  },
  getUser: function () {
    return this.user;
  }, 
  toArrayBuffer: function(dataArray, buffSize) {
    let tmpArrayBuffer = new ArrayBuffer(buffSize);
    let tmpDataView = new Uint8Array(tmpArrayBuffer);
   
    for (index = 0; index < dataArray.length; index++) {
      tmpDataView[index] = dataArray[index];
    }

    return tmpArrayBuffer;
  },

  putLocalStorage: function (key, value) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(key, value);

      
    } else {
      throw new Error('Local Storage Not Supported by Browser');
    }
  },
  getLocalStorage: function (key) {
    if (typeof(Storage) !== "undefined") {
      return localStorage.getItem(key);
    } else {
      throw new Error('Local Storage Not Supported by Browser');
    }
  },
  saveLocalIdentityKey: function (key, identitykeyPair) {
    // we need to transform the key pair into a data view
    // since the keys come as ArrayBuffer
    // we chose to use Uint8Array as the view since both keys 
    // could be read as such
    let obj = {
      pubKey: JSON.stringify(new Uint8Array(identitykeyPair.pubKey)),
      privKey: JSON.stringify(new Uint8Array(identitykeyPair.privKey))
    }

    this.putLocalStorage(key+this.user, JSON.stringify(obj));
  },
  saveLocalRegId: function (key, regId) {
    this.putLocalStorage(key+this.user, regId);
  },
  getIdentityKeyPair: function() {
    debugger;
    // retrieve identityKeyPair of this user
    // should have been saved to local storage already
    // if user does not have one, this user has not gone through
    // the process of account creation
    const identityKey = JSON.parse(localStorage.getItem('identityKey'+this.user));

    if (identityKey === undefined || identityKey === null) {
      return Promise.reject("No Identity Found for User");
    }

    // parse the object from local storage
    identityKey.pubKey = JSON.parse(identityKey.pubKey);
    identityKey.privKey = JSON.parse(identityKey.privKey);

    // turn the parsed object's public and private keys into
    // arrays to better iterate over
    let identityPubKeyArray = Object.keys(identityKey.pubKey).map(function(key) {
        return identityKey.pubKey[key];
      });
    let identityPrivKeyArray = Object.keys(identityKey.privKey).map(function(key) {
      return identityKey.privKey[key];
    });

    // set the object's fields to the newly made ArrayBuffer
    // the typed ArrayBuffer is needed for libsignal
    identityKey.pubKey = this.toArrayBuffer(identityPubKeyArray, identityPubKeyArray.length);
    identityKey.privKey = this.toArrayBuffer(identityPrivKeyArray, identityPrivKeyArray.length);

    return Promise.resolve(identityKey);
  },
  getLocalRegistrationId: function() {
    
    const regId = localStorage.getItem('registrationId'+this.user);

    if (regId === undefined || regId === null) {
      return Promise.reject("No regId found for User");
    }

    return Promise.resolve(parseInt(regId));
  },
  put: function(key, value) {
    debugger;
    if (key === undefined || value === undefined || key === null || value === null)
      throw new Error("Tried to store undefined/null");
    this.store[key] = value;
    
    this.putLocalStorage(key, JSON.stringify(value));
  },
  get: function(key, defaultValue) {
    debugger;
    if (key === null || key === undefined)
      throw new Error("Tried to get value for undefined/null key");
    if (key in this.store) {
      return this.store[key];
    } else {
      return defaultValue;
    }
  },
  remove: function(key) {
    if (key === null || key === undefined)
      throw new Error("Tried to remove value for undefined/null key");
    delete this.store[key];
  },

  isTrustedIdentity: function(identifier, identityKey, direction) {
    debugger;
    if (identifier === null || identifier === undefined) {
      throw new Error("tried to check identity key for undefined/null key");
    }
    if (!(identityKey instanceof ArrayBuffer)) {
      throw new Error("Expected identityKey to be an ArrayBuffer");
    }
    // must somehow retrieve from the key distro to get the identity key
    return Promise.all([
      firebase.database().ref('keyDistroStore/'+identifier+'/preKeyBundle/identityKey').once('value')
    ]).then(function (snapshot) {
     
      if (snapshot === undefined || snapshot === null) {
        return Promise.reject();
      }

      let trusted = snapshot[0].val();
      let tmpArrayBuffer = new ArrayBuffer(trusted.length);
      let tmpDataView = new Uint8Array(tmpArrayBuffer);
       
      for (index = 0; index < trusted.length; index++) {
        tmpDataView[index] = trusted[index];
      }
      trusted = new Uint8Array(tmpArrayBuffer);
      let transFormedIdentityKey = new Uint8Array(identityKey);
      return Promise.resolve(JSON.stringify(trusted) === JSON.stringify(transFormedIdentityKey));
      
    }, function() { throw Error("Failed to Retrieve Identity Key")});
   
  },
  loadIdentityKey: function(identifier) {
    debugger;
    if (identifier === null || identifier === undefined)
      throw new Error("Tried to get identity key for undefined/null key");
    return Promise.resolve(this.get('identityKey' + identifier));
  },
  saveIdentity: function(identifier, identityKey) {
    debugger;
    if (identifier === null || identifier === undefined)
      throw new Error("Tried to put identity key for undefined/null key");

    let address = new libsignal.SignalProtocolAddress.fromString(identifier);

    let existing = this.getLocalStorage('identityKey' + address.toString());

    let transformedidentityKey;
    if ( identityKey instanceof ArrayBuffer ) {
      // store into local storage as typed array
      transformedidentityKey = new dcodeIO.ByteBuffer.wrap(identityKey).toString('binary');
      this.putLocalStorage('identityKey' + address.toString(), transformedidentityKey);

    } else {
      
      //transformedidentityKey = new dcodeIO.ByteBuffer.wrap(identityKey, 'binary').toArrayBuffer();
      transformedidentityKey = identityKey;
    }
    
    if (existing && transformedidentityKey !== existing) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }

  },

  /* Returns a prekeypair object or undefined */
  loadPreKey: function(keyId) {
    let res = JSON.parse(this.getLocalStorage('25519KeypreKey' + keyId + this.user));
  
    if (res === undefined) {
      return Promise.reject("PreKey for "+this.user+ " not found");
    }

    let pubKey = JSON.parse(res.pubKey);
    let privKey = JSON.parse(res.privKey);

    let pubKeyArray = Object.keys(pubKey).map(function(key) {
      return pubKey[key];
    });
    let privKeyArray = Object.keys(privKey).map(function(key) {
      return privKey[key];
    });

    pubKey = this.toArrayBuffer(pubKeyArray, pubKeyArray.length);
    privKey = this.toArrayBuffer(privKeyArray, privKeyArray.length);

    res = { pubKey: pubKey, privKey: privKey };

    return Promise.resolve(res);
  },
  storePreKey: function(keyId, keyPair) {

    // we need to transform the key pair into a data view
    // since the keys come as ArrayBuffer
    // we chose to use Uint8Array as the view since both keys 
    // could be read as such
    let obj = {
      pubKey: JSON.stringify(new Uint8Array(keyPair.pubKey)),
      privKey: JSON.stringify(new Uint8Array(keyPair.privKey))
    }

    return Promise.resolve(this.putLocalStorage('25519KeypreKey' + keyId + this.user, JSON.stringify(obj)));


    // return Promise.resolve(this.put('25519KeypreKey' + keyId, keyPair));
  },
  removePreKey: function(keyId) {
    debugger;
    return Promise.resolve(this.putLocalStorage('25519KeypreKey' + keyId), );
  },

  /* Returns a signed keypair object or undefined */
  loadSignedPreKey: function(keyId) {
    debugger;
    let res = JSON.parse(this.getLocalStorage('25519KeysignedKey' + keyId + this.user));
    
    if (res === undefined) {
      return Promise.reject("SignedPreKey for "+this.user+ " not found");
    }

    let pubKey = JSON.parse(res.pubKey);
    let privKey = JSON.parse(res.privKey);
    let signature = JSON.parse(res.signature);

    let pubKeyArray = Object.keys(pubKey).map(function(key) {
      return pubKey[key];
    });
    let privKeyArray = Object.keys(privKey).map(function(key) {
      return privKey[key];
    });
    let signatureArray = Object.keys(signature).map(function(key) {
      return signature[key];
    });

    pubKey = this.toArrayBuffer(pubKeyArray, pubKeyArray.length);
    privKey = this.toArrayBuffer(privKeyArray, privKeyArray.length);
    signature = this.toArrayBuffer(signatureArray, signatureArray.length);

    res = { pubKey: pubKey, privKey: privKey, signature: signature };

    return Promise.resolve(res);

    // var res = this.get('25519KeysignedKey' + keyId);
    // if (res !== undefined) {
    //   res = { pubKey: res.pubKey, privKey: res.privKey };
    // }
    // return Promise.resolve(res);

  },
  storeSignedPreKey: function(keyId, signedPreKey) {

    // we need to transform the key pair into a data view
    // since the keys come as ArrayBuffer
    // we chose to use Uint8Array as the view since both keys 
    // could be read as such
    let obj = {
      pubKey: JSON.stringify(new Uint8Array(signedPreKey.keyPair.pubKey)),
      privKey: JSON.stringify(new Uint8Array(signedPreKey.keyPair.privKey)),
      signature: JSON.stringify(new Uint8Array(signedPreKey.signature))
    }

    return Promise.resolve(this.putLocalStorage('25519KeysignedKey' + keyId + this.user, JSON.stringify(obj)));

    // return Promise.resolve(this.put('25519KeysignedKey' + keyId, keyPair));
  },
  removeSignedPreKey: function(keyId) {
    debugger;
    return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
  },

  loadSession: function(identifier) {
    debugger;
    let session = this.getLocalStorage('session' + identifier);
    session = session === null ? undefined : session;
    return Promise.resolve(session);
  },
  storeSession: function(identifier, record) {
    debugger;
    return Promise.resolve(this.putLocalStorage('session'+identifier, record));
  },
  removeSession: function(identifier) {
    debugger;
    return Promise.resolve(this.remove('session' + identifier));
  },
  removeAllSessions: function(identifier) {
    debugger;
    for (var id in this.store) {
      if (id.startsWith('session' + identifier)) {
        delete this.store[id];
      }
    }
    return Promise.resolve();
  }
};
