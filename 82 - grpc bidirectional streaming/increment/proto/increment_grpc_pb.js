// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var increment_pb = require('./increment_pb.js');

function serialize_increment_IncrementRequest(arg) {
  if (!(arg instanceof increment_pb.IncrementRequest)) {
    throw new Error('Expected argument of type increment.IncrementRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_increment_IncrementRequest(buffer_arg) {
  return increment_pb.IncrementRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_increment_IncrementResponse(arg) {
  if (!(arg instanceof increment_pb.IncrementResponse)) {
    throw new Error('Expected argument of type increment.IncrementResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_increment_IncrementResponse(buffer_arg) {
  return increment_pb.IncrementResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var IncrementService = exports.IncrementService = {
  increment: {
    path: '/increment.Increment/Increment',
    requestStream: true,
    responseStream: true,
    requestType: increment_pb.IncrementRequest,
    responseType: increment_pb.IncrementResponse,
    requestSerialize: serialize_increment_IncrementRequest,
    requestDeserialize: deserialize_increment_IncrementRequest,
    responseSerialize: serialize_increment_IncrementResponse,
    responseDeserialize: deserialize_increment_IncrementResponse,
  },
};

exports.IncrementClient = grpc.makeGenericClientConstructor(IncrementService);
