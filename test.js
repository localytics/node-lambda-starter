'use strict';

var chai = require('chai');
var myLambda = require('./MyLambda');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire').noCallThru();

var kinesisHandler;
var s3Handler;

global.expect = chai.expect;
chai.use(sinonChai);

describe('MyLambda', function() {
  describe('exports.handler()', function() {
    beforeEach(function() {
      kinesisHandler = sinon.stub(myLambda, 'kinesisHandler');
      s3Handler = sinon.stub(myLambda, 's3Handler');
    });
    afterEach(function() {
      kinesisHandler.restore();
      s3Handler.restore();
    });
    describe('with kinesis input', function() {
      it('calls kinesis handler', function() {
        var event = { Records: [
          { kinesis: { data: 'TG9jYWx5dGljcyBFbmdpbmVlcmluZyBpcyBoaXJpbmchIGh0dHA6Ly9iaXQubHkvMURqN2N1bA==' }}
        ]};
        myLambda.handler(event);
        expect(s3Handler).to.not.have.been.called;
        expect(kinesisHandler).to.be.calledWith(event.Records);
      });
    });
    describe('with s3 input', function() {
      it('calls s3 handler', function() {
        var event = { Records: [
          { s3: { bucket: { name: '' }, object: { key: 'path/to/file.gz' } }}
        ]};
        myLambda.handler(event);
        expect(kinesisHandler).to.not.have.been.called;
        expect(s3Handler).to.be.calledWith(event.Records[0]);
      });
    });
  });
});
