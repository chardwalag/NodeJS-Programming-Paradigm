
let users, self, party, peerConection, remoteStream, localStream, dialogEl, sId, localVideoEl, userEl, userCountEl, onlineUsersEl, callBtns, busy = false; 

const socket = io( '/' ), dialogExitTime = 3000;

window.onload = () => {
  dialogEl = document.getElementById( 'dialog' );
  registerSocketEvents( socket );
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then( stream => {
      localVideoEl = document.getElementById( 'local-video' );
      localStream = localVideoEl.srcObject = stream; localVideoEl.addEventListener( 'loadedmetadata', () => localVideoEl.play());
      // hasCamera = true; clearDialog(); enableCallButtons();
    })
    .catch( err => console.log( 'Cannot access camera', err ));
}

const updateOnlineUsers = ({ users: u, user: { name, uid } }) => {
  userEl = document.getElementById( 'user' );
  self = name ? name : 'User-' + uid;
  userEl.innerHTML = 'You are: ' + self;
  userCountEl = document.getElementById( 'online-user-count' ); userCountEl.innerHTML = `Online Users (${ u.length })`;
  onlineUsersEl = document.getElementById( 'online-users' ); onlineUsersEl.innerHTML = '';
  callBtns = [];
  users = u;
  users.forEach(({ sid, uid, name }) => {
    if ( !name ) name = 'User-' + uid;
    const btnEl = document.createElement( 'button' );
    btnEl.innerHTML = 'Call ' + name; btnEl.addEventListener( 'click', () => call( sid, name ));
    onlineUsersEl.append( btnEl )
    callBtns.push( btnEl );
  });
  // if ( hasCamera ) { clearDialog(); enableCallButtons();}
  // else { disableCallButtons(); createMessage( 'No camera device found', 'Please connect a camera and refresh this page' );}
}

const disableCallButtons = () => callBtns.forEach( el => el.disabled = true );

const enableCallButtons = () => callBtns.forEach( el => el.disabled = false );

const call = ( id, name ) => {
  busy = true; party = name; sId = id;
  disableCallButtons(); createDialog( id, `Calling ${ name }...`, [{ title: 'Cancel Call', cb: cancelCall }]);
  makeCall( id );
}

const getUserName = id => { const usr = users.find(({ sid }) => id === sid ); return usr.name ? usr.name : 'User-' + usr.uid;}

const handleBusy = id => {
  clearDialog(); createMessage( `${ getUserName( id )} is busy`, `Please try again later` );
  setTimeout(() => { clearDialog(); enableCallButtons(); busy = false;}, [ dialogExitTime ]);
}

const cancelCall = id  => {
  cancelTheCall( id );
  clearDialog(); enableCallButtons();
  busy = false;
}

const clearDialog = () => dialogEl.querySelectorAll( '*' ).forEach( d => d.remove());

const handleCall = id => {
  if ( busy ) notifyBusy( id );
  else {
    busy = true;
    party = getUserName( id );
    disableCallButtons(); createDialog( id, `${ party } is calling...`, [{ title: 'Accept Call', cb: acceptCall }, { title: 'Reject Call', cb: rejectCall }]);
  }
}

const acceptCall = id  => {
  sId = id; party = getUserName( id );
  createPeerConnection( id );
  acceptTheCall( id );
  clearDialog(); createDialog( id, `Ongoing Call with ${ party }...`, [{ title: 'End Call', cb: endCall }], false );
}

const rejectCall = id  => {
  rejectTheCall( id );
  clearDialog(); enableCallButtons();
  busy = false;
}

const cancelCallByCaller = id => {
  clearDialog(); createMessage( 'Call is cancelled', `Caller ID: ${ getUserName( id )}` );
  setTimeout(() => { clearDialog(); enableCallButtons(); busy = false;}, [ dialogExitTime ]);
}

const createDialog = ( id, title, buttons, blurBackground = true ) => {
  const wrapperEl = document.createElement( 'div' ), dlgEl = document.createElement( 'div' ), pEl = document.createElement( 'p' ), btnsEl = document.createElement( 'div' );
  if ( blurBackground ) wrapperEl.classList.add( 'dialog_wrapper' );
  pEl.innerHTML = title; pEl.classList.add( 'dlg-text' );
  dlgEl.classList.add( 'dlg' ); dlgEl.appendChild( pEl );
  btnsEl.classList.add( 'btns' );
  for ( let i = 0, e, btnEl; e = buttons[ i ]; ++i ) {
    const { title, cb } = e, sepEl = document.createElement( 'div' );
    btnEl = document.createElement( 'button' ); btnEl.innerText = title; btnEl.addEventListener( 'click', () => cb( id ));
    sepEl.classList.add( 'sep' );
    btnsEl.appendChild( btnEl ); btnsEl.appendChild( sepEl );
  }
  dlgEl.appendChild( btnsEl );
  wrapperEl.appendChild( dlgEl );
  dialogEl.appendChild( wrapperEl );  
}

const createMessage = ( header, footer ) => {
  const wrapperEl = document.createElement( 'div' ), dlgEl = document.createElement( 'div' ), headerEl = document.createElement( 'p' ), footerEl = document.createElement( 'p' );
  wrapperEl.classList.add( 'dialog_wrapper' );
  headerEl.innerHTML = header; headerEl.classList.add( 'dlg-text' );
  footerEl.innerHTML = footer; footerEl.classList.add( 'dlg-text' );
  dlgEl.classList.add( 'dlg' ); dlgEl.appendChild( headerEl ); dlgEl.appendChild( footerEl );
  wrapperEl.appendChild( dlgEl );
  dialogEl.appendChild( wrapperEl );
}

const rejectCallByCallee = () => {
  clearDialog(); createMessage( "Call is rejected", `Callee ID: ${ party }` );
  setTimeout(() => { clearDialog(); enableCallButtons(); busy = false;}, [ dialogExitTime ]);
}

const createPeerConnection = sid => {
  peerConection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:13902" }]});
  peerConection.onicecandidate = ({ candidate }) => { if ( candidate ) sendIceCandidate({ sid, candidate });};
  peerConection.onconnectionstatechange = () => { if ( peerConection.connectionState === 'connected' ) console.log( 'succesfully connected with other peer' );};
  const remoteVideo = document.getElementById( 'remote-video' ); remoteVideo.srcObject = remoteStream = new MediaStream();
  peerConection.ontrack = ({ track }) => remoteStream.addTrack( track );
  for ( const track of localStream.getTracks()) peerConection.addTrack( track, localStream );
};

const acceptCallByCallee = async () => {
  createPeerConnection();
  const offer = await peerConection.createOffer(); await peerConection.setLocalDescription( offer );
  sendOffer({ sid: sId, offer });
  clearDialog(); createDialog( sId, `Ongoing Call with ${ party }...`, [{ title: 'End Call', cb: endCall }], false ); disableCallButtons();
}

const endCall = id => {
  endTheCall( id );
  closePeerConnectionAndResetState();
  enableCallButtons();
}

const handleSendOffer = async ( offer ) => {
  await peerConection.setRemoteDescription( offer );
  const answer = await peerConection.createAnswer(); await peerConection.setLocalDescription( answer );
  sendAnswer({ sid: sId, answer });
}

const handleSendAnswer = async ( answer ) => await peerConection.setRemoteDescription( answer );

const handleSendCandidate = async ( c ) => { try { await peerConection.addIceCandidate( c );} catch ( err ) { console.log( 'Ice candidate receive error', err );}}

const completeCall = () => {
  closePeerConnectionAndResetState();
  createMessage( 'Call is ended', `Caller/Callee ID: ${ party }` );
  setTimeout(() => { clearDialog(); enableCallButtons(); busy = false;}, [ dialogExitTime ]);
}

const closePeerConnectionAndResetState = () => {
  if ( peerConection ) { peerConection.close(); peerConection = null;}
  clearDialog();
}


let socketIO = null;

const registerSocketEvents = socket => {
  socketIO = socket;

  socket.on( 'connect', () => {
    // console.log("succesfully connected to socket.io server");
  });

  socket.on( 'online-users', d => updateOnlineUsers( d ));
  socket.on( 'call', id => handleCall( id ));
  socket.on( 'notify-busy', id => handleBusy( id ));
  socket.on( 'cancel-call', id => cancelCallByCaller( id ));
  socket.on( 'accept-call', acceptCallByCallee );
  socket.on( 'reject-call', rejectCallByCallee );
  socket.on( 'send-offer', offer => handleSendOffer( offer ));
  socket.on( 'send-answer', answer => handleSendAnswer( answer ));
  socket.on( 'send-candidate', candidate => handleSendCandidate( candidate ));
  socket.on( 'end-call', completeCall );
};

const makeCall = id => socketIO.emit( 'call', id );

const notifyBusy = id => socketIO.emit( 'notify-busy', id );

const cancelTheCall = id => socketIO.emit( 'cancel-call', id );

const acceptTheCall = id => socketIO.emit( 'accept-call', id );

const rejectTheCall = id => socketIO.emit( 'reject-call', id );

const sendOffer = d => socketIO.emit( 'send-offer', d );

const sendAnswer = d => socketIO.emit( 'send-answer', d );

const sendIceCandidate = d => socketIO.emit( 'send-candidate', d );

const endTheCall = id => socketIO.emit( 'end-call', id );

