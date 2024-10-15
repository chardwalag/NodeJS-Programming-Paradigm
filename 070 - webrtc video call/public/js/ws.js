
import { updateOnlineUsers, handleCall, cancelCallByCaller, 
  rejectCallByCallee, acceptCallByCallee, handleSendOffer,
  handleSendAnswer, handleSendCandidate, completeCall, handleBusy } from './index.js'


let socketIO = null;

export const registerSocketEvents = socket => {
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

export const call = id => socketIO.emit( 'call', id );

export const notifyBusy = id => socketIO.emit( 'notify-busy', id );

export const cancelCall = id => socketIO.emit( 'cancel-call', id );

export const acceptCall = id => socketIO.emit( 'accept-call', id );

export const rejectCall = id => socketIO.emit( 'reject-call', id );

export const sendOffer = d => socketIO.emit( 'send-offer', d );

export const sendAnswer = d => socketIO.emit( 'send-answer', d );

export const sendIceCandidate = d => socketIO.emit( 'send-candidate', d );

export const endCall = id => socketIO.emit( 'end-call', id );

