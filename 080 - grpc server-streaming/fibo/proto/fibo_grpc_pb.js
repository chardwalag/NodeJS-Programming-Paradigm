// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var fibo_pb = require('./fibo_pb.js');

function serialize_fibo_FiboRequest(arg) {
  if (!(arg instanceof fibo_pb.FiboRequest)) {
    throw new Error('Expected argument of type fibo.FiboRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fibo_FiboRequest(buffer_arg) {
  return fibo_pb.FiboRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fibo_FiboResponse(arg) {
  if (!(arg instanceof fibo_pb.FiboResponse)) {
    throw new Error('Expected argument of type fibo.FiboResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fibo_FiboResponse(buffer_arg) {
  return fibo_pb.FiboResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var FiboService = exports.FiboService = {
  fibo: {
    path: '/fibo.Fibo/Fibo',
    requestStream: false,
    responseStream: true,
    requestType: fibo_pb.FiboRequest,
    responseType: fibo_pb.FiboResponse,
    requestSerialize: serialize_fibo_FiboRequest,
    requestDeserialize: deserialize_fibo_FiboRequest,
    responseSerialize: serialize_fibo_FiboResponse,
    responseDeserialize: deserialize_fibo_FiboResponse,
  },
};

exports.FiboClient = grpc.makeGenericClientConstructor(FiboService);
