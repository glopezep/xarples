/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var common_pb = require('./common_pb.js');
goog.object.extend(proto, common_pb);
goog.exportSymbol('proto.authorization_code.AuthorizationCodeListRequest', null, global);
goog.exportSymbol('proto.authorization_code.AuthorizationCodeRequest', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.authorization_code.AuthorizationCodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.authorization_code.AuthorizationCodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.authorization_code.AuthorizationCodeRequest.displayName = 'proto.authorization_code.AuthorizationCodeRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.authorization_code.AuthorizationCodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.authorization_code.AuthorizationCodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.authorization_code.AuthorizationCodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    clientId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    userId: jspb.Message.getFieldWithDefault(msg, 3, ""),
    code: jspb.Message.getFieldWithDefault(msg, 4, ""),
    scope: jspb.Message.getFieldWithDefault(msg, 5, ""),
    createdAt: jspb.Message.getFieldWithDefault(msg, 6, ""),
    updatedAt: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.authorization_code.AuthorizationCodeRequest}
 */
proto.authorization_code.AuthorizationCodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.authorization_code.AuthorizationCodeRequest;
  return proto.authorization_code.AuthorizationCodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.authorization_code.AuthorizationCodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.authorization_code.AuthorizationCodeRequest}
 */
proto.authorization_code.AuthorizationCodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setClientId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setCode(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setScope(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setCreatedAt(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setUpdatedAt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.authorization_code.AuthorizationCodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.authorization_code.AuthorizationCodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.authorization_code.AuthorizationCodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getClientId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCode();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getScope();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCreatedAt();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getUpdatedAt();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string client_id = 2;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getClientId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setClientId = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string user_id = 3;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setUserId = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string code = 4;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getCode = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setCode = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string scope = 5;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getScope = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setScope = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string created_at = 6;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getCreatedAt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setCreatedAt = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string updated_at = 7;
 * @return {string}
 */
proto.authorization_code.AuthorizationCodeRequest.prototype.getUpdatedAt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.authorization_code.AuthorizationCodeRequest.prototype.setUpdatedAt = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.authorization_code.AuthorizationCodeListRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.authorization_code.AuthorizationCodeListRequest.repeatedFields_, null);
};
goog.inherits(proto.authorization_code.AuthorizationCodeListRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.authorization_code.AuthorizationCodeListRequest.displayName = 'proto.authorization_code.AuthorizationCodeListRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.authorization_code.AuthorizationCodeListRequest.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.authorization_code.AuthorizationCodeListRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.authorization_code.AuthorizationCodeListRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.authorization_code.AuthorizationCodeListRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.authorization_code.AuthorizationCodeListRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    authorizationCodesList: jspb.Message.toObjectList(msg.getAuthorizationCodesList(),
    proto.authorization_code.AuthorizationCodeRequest.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.authorization_code.AuthorizationCodeListRequest}
 */
proto.authorization_code.AuthorizationCodeListRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.authorization_code.AuthorizationCodeListRequest;
  return proto.authorization_code.AuthorizationCodeListRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.authorization_code.AuthorizationCodeListRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.authorization_code.AuthorizationCodeListRequest}
 */
proto.authorization_code.AuthorizationCodeListRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.authorization_code.AuthorizationCodeRequest;
      reader.readMessage(value,proto.authorization_code.AuthorizationCodeRequest.deserializeBinaryFromReader);
      msg.addAuthorizationCodes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.authorization_code.AuthorizationCodeListRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.authorization_code.AuthorizationCodeListRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.authorization_code.AuthorizationCodeListRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.authorization_code.AuthorizationCodeListRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthorizationCodesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.authorization_code.AuthorizationCodeRequest.serializeBinaryToWriter
    );
  }
};


/**
 * repeated AuthorizationCodeRequest authorization_codes = 1;
 * @return {!Array<!proto.authorization_code.AuthorizationCodeRequest>}
 */
proto.authorization_code.AuthorizationCodeListRequest.prototype.getAuthorizationCodesList = function() {
  return /** @type{!Array<!proto.authorization_code.AuthorizationCodeRequest>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.authorization_code.AuthorizationCodeRequest, 1));
};


/** @param {!Array<!proto.authorization_code.AuthorizationCodeRequest>} value */
proto.authorization_code.AuthorizationCodeListRequest.prototype.setAuthorizationCodesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.authorization_code.AuthorizationCodeRequest=} opt_value
 * @param {number=} opt_index
 * @return {!proto.authorization_code.AuthorizationCodeRequest}
 */
proto.authorization_code.AuthorizationCodeListRequest.prototype.addAuthorizationCodes = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.authorization_code.AuthorizationCodeRequest, opt_index);
};


proto.authorization_code.AuthorizationCodeListRequest.prototype.clearAuthorizationCodesList = function() {
  this.setAuthorizationCodesList([]);
};


goog.object.extend(exports, proto.authorization_code);
