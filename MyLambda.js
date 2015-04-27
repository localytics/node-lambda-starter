'use strict';

var async = require('async');
var AWS = require('aws-sdk');
var zlib = require('zlib');

var s3 = new AWS.S3();

exports.kinesisHandler = function(records, context) {
  var data = records
    .map(function(record) {
      return new Buffer(record.kinesis.data, 'base64').toString('utf8');
    })
    .join();
  console.log(data);
  context.done();
};
exports.s3Handler = function(record, context) {
  async.waterfall([
    function download(next) {
      s3.getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key
      }, function(err, data) {
        next(err, data);
      });
    },
    function gunzip(response, next) {
      var buffer = new Buffer(response.Body);
      zlib.gunzip(buffer, function(err, decoded) {
        next(err, decoded && decoded.toString());
      });
    },
    function doSomething(data, next) {
      console.log(data);
      context.done();
    }
  ], function(err) {
    if (err) throw err;
  });
};

exports.handler = function(event, context) {
  var record = event.Records[0];
  if (record.kinesis) {
    exports.kinesisHandler(event.Records, context);
  } else if (record.s3) {
    exports.s3Handler(record, context);
  }
};
