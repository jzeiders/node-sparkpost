var chai = require('chai')
  , expect = chai.expect
  , proxyquire = require('proxyquire')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , MockRequest = require('../mocks/request.js');

chai.use(sinonChai);

describe('Transmissions Library', function() {
  var transmission = require('../../lib/transmission');

  describe('Instantiation', function() {
    it('should allow for setting values on construction', function() {
      var sdk = new transmission({ campaign: 'camp'});
      expect(sdk.model.campaign_id).to.equal('camp');
    });

    it('should instantiate model props to undefined', function() {
      var sdk = new transmission();
      expect(sdk.model.campaign_id).to.be.undefined;
      expect(sdk.model.metadata).to.be.undefined;
      expect(sdk.model.substitution_data).to.be.undefined;
      expect(sdk.model.description).to.be.undefined;
      expect(sdk.model.return_path).to.be.undefined;
      expect(sdk.model.content.reply_to).to.be.undefined;
      expect(sdk.model.content.subject).to.be.undefined;
      expect(sdk.model.content.from).to.be.undefined;
      expect(sdk.model.content.html).to.be.undefined;
      expect(sdk.model.content.text).to.be.undefined;
      expect(sdk.model.content.email_rfc822).to.be.undefined;
      expect(sdk.model.content.headers).to.be.undefined;
      expect(sdk.model.recipients).to.be.an('array');
      expect(sdk.model.content.template_id).to.be.undefined;
    });

    it('should set defaults for global transmission options', function() {
      var sdk = new transmission();
      expect(sdk.model.options.open_tracking).to.be.true;
      expect(sdk.model.options.click_tracking).to.be.true;
      expect(sdk.model.content.use_draft_template).to.be.false;
    });

    it('should allow overriding defaults', function() {
      var sdk = new transmission({
        openTracking: false,
        clickTracking: false,
        useDraftTemplate: true,
        recipients: [
          {test: 'test'}
        ]
      });

      expect(sdk.model.options.open_tracking).to.be.false;
      expect(sdk.model.options.click_tracking).to.be.false;
      expect(sdk.model.content.use_draft_template).to.be.true;
      expect(sdk.model.recipients).to.deep.equal([{test: 'test'}]);
    });

    it('should set recipients to object if you pass in recipientList', function() {
      var sdk = new transmission({ recipientList: 'foo'});
      expect(sdk.model.recipients).to.deep.equal({list_name: 'foo'});
    });

  });

  describe('Convenience Methods', function() {
    it('should allow to set campaign by convenience method', function() {
      var sdk = new transmission();
      sdk.setCampaign('camp');
      expect(sdk.model.campaign_id).to.equal('camp');
    });

    it('should allow to set metadata by convenience method', function() {
      var sdk = new transmission();
      sdk.setMetadata('meta');
      expect(sdk.model.metadata).to.equal('meta');
    });

    it('should allow to set substitution data by convenience method', function() {
      var sdk = new transmission();
      sdk.setSubstitutionData('meta');
      expect(sdk.model.substitution_data).to.equal('meta');
    });

    it('should allow to set description by convenience method', function() {
      var sdk = new transmission();
      sdk.setDescription('desc');
      expect(sdk.model.description).to.equal('desc');
    });

    it('should allow to set return path by convenience method', function() {
      var sdk = new transmission();
      sdk.setReturnPath('return_path');
      expect(sdk.model.return_path).to.equal('return_path');
    });

    it('should allow to set reply to by convenience method', function() {
      var sdk = new transmission();
      sdk.setReplyTo('reply_to');
      expect(sdk.model.content.reply_to).to.equal('reply_to');
    });

    it('should allow to set subject by convenience method', function() {
      var sdk = new transmission();
      sdk.setSubject('subj');
      expect(sdk.model.content.subject).to.equal('subj');
    });

    it('should allow to set from by convenience method', function() {
      var sdk = new transmission();
      sdk.setFrom('from');
      expect(sdk.model.content.from).to.equal('from');
    });

    it('should allow to set html part by convenience method', function() {
      var sdk = new transmission();
      sdk.setHTMLContent('<p>html</p>');
      expect(sdk.model.content.html).to.equal('<p>html</p>');
    });

    it('should allow to set text part by convenience method', function() {
      var sdk = new transmission();
      sdk.setTextContent('text part');
      expect(sdk.model.content.text).to.equal('text part');
    });

    it('should allow to set recipient by convenience method', function() {
      var sdk = new transmission();
      sdk.setRecipient('recipients').setRecipient('test');
      expect(sdk.model.recipients).to.deep.equal(['recipients', 'test']);
    });

    it('should allow you to set recipients after a list was passed in', function() {
      var sdk = new transmission({ recipientList: 'foo'});
      sdk.setRecipient('test');
      expect(sdk.model.recipients).to.deep.equal(['test']);
    });

    it('should allow you to set recipients after a list was set', function() {
      var sdk = new transmission();
      sdk.useRecipientList('listname').setRecipient('test');
      expect(sdk.model.recipients).to.deep.equal(['test']);
    });

    it('should allow to set recipient list by convenience method', function() {
      var sdk = new transmission();
      sdk.useRecipientList('recipient list');
      expect(sdk.model.recipients.list_name).to.equal('recipient list');
    });

    it('should allow to set stored template by convenience method', function() {
      var sdk = new transmission();
      sdk.useStoredTemplate('template ID');
      expect(sdk.model.content.template_id).to.equal('template ID');
    });

    it('should allow for chaining of convenience methods', function() {
      var sdk = new transmission();
      sdk.setCampaign('camp').setContentHeaders('foo').setRfc822Content('bar');
      expect(sdk.model.campaign_id).to.equal('camp');
      expect(sdk.model.content.email_rfc822).to.equal('bar');
      expect(sdk.model.content.headers).to.equal('foo');
    });

    it('should allow enabling open tracking by convenience method', function() {
      var sdk = new transmission();
      sdk.enableOpenTracking();
      expect(sdk.model.options.open_tracking).to.be.true;
    });

    it('should allow disabling open tracking by convenience method', function() {
      var sdk = new transmission();
      sdk.disableOpenTracking();
      expect(sdk.model.options.open_tracking).to.be.false;
    });

    it('should allow enabling click tracking by convenience method', function() {
      var sdk = new transmission();
      sdk.enableClickTracking();
      expect(sdk.model.options.click_tracking).to.be.true;
    });

    it('should allow disabling click tracking by convenience method', function() {
      var sdk = new transmission();
      sdk.disableClickTracking();
      expect(sdk.model.options.click_tracking).to.be.false;
    });

    it('should allow using a draft version of a stored template by convenience method', function() {
      var sdk = new transmission();
      sdk.useDraftTemplate();
      expect(sdk.model.content.use_draft_template).to.be.true;
    });

    it('should allow using a published version of a stored template by convenience method', function() {
      var sdk = new transmission();
      sdk.usePublishedTemplate();
      expect(sdk.model.content.use_draft_template).to.be.false;
    });
  });

  describe('API Interaction', function() {
    var transmission
    , sdk;

    beforeEach(function() {
      transmission = proxyquire('../../lib/transmission', {
        'request': MockRequest
      });
      sdk = new transmission();
    });

    describe('Fetch', function() {
      it('should handle being wrapped by find appropriately', function() {
        sdk.all(function(err, res) {
          expect(err).to.be.null;
          expect(res.results).to.match(/success/);
        });
        MockRequest.restore();
      });

      it('should handle being wrapped by all appropriately', function() {
        sdk.find(10, function(err, res) {
          expect(err).to.be.null;
          expect(res.results).to.match(/success/);
        });
        MockRequest.restore();
      });

      it('should return an error', function(done) {
        MockRequest.error = 'test';
        sdk.find(10, function(err, res) {
          expect(err).to.match(/Unable to contact Transmissions API: test/);
          expect(res).to.be.undefined;
          done();
        });
        MockRequest.restore();
      });

      it('should return an error if the status code is 404', function(done) {
        MockRequest.response.statusCode = 404;
        sdk.find(10, function(err, res) {
          expect(err).to.match(/The specified Transmission ID does not exist/);
          expect(res).to.be.undefined;
          done();
        });
        MockRequest.restore();
      });

      it('should return an error if the status code is anything other than 200', function(done) {
        MockRequest.response.statusCode = 500;
        sdk.find(10, function(err, res) {
          expect(err).to.match(/Received bad response from Transmission API: 500/);
          expect(res).to.be.undefined;
          done();
        });
        MockRequest.restore();
      });

      it('should return a body on success', function(done) {
        sdk.find(10, function(err, res) {
          expect(err).to.be.null;
          expect(res.results).to.match(/success/);
          done();
        });
      });

      it('should construct a URL appropriately based on global configuration', function(done) {
        var fetchSpy = sinon.spy(MockRequest, 'get');
        sdk.options = {key: '123', host: 'example.com', schema: 'http', baseUrl: '/api/v1/transmission'};
        sdk.all(function(err, res) {
          expect(fetchSpy.args[0][0].url).to.equal('http://example.com/api/v1/transmission');
          done();
        });
      });
    });

    describe('Send', function() {

      it('should construct a URL appropriately based on global configuration', function(done) {
        var sendSpy = sinon.spy(MockRequest, 'post');
        sdk.options = {key: '123', host: 'example.com', schema: 'http', baseUrl: '/api/v1/transmission'};
        sdk.send(function(err, res) {
          expect(sendSpy.args[0][0].url).to.equal('http://example.com/api/v1/transmission');
          done();
        });
      });

      it('should return an error', function(done) {
        MockRequest.error = 'test';
        sdk.send(function(err, res) {
          expect(err).to.match(/test/);
          expect(res).to.be.undefined;
          done();
        });
        MockRequest.restore();
      });

      it('should return an error if the status code is anything other than 200', function(done) {
        MockRequest.response.statusCode = 500;
        MockRequest.response.body.errors[0] = 'first error';
        sdk.send(function(err, res) {
          expect(err[0]).to.equal('first error');
          expect(res).to.be.undefined;
          done();
        });
        MockRequest.restore();
      });

      it('should return a body on success', function(done) {
        sdk.send(function(err, res) {
          expect(err).to.be.null;
          expect(res.results).to.match(/success/);
          done();
        });
      });
    });
  });
});