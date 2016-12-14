'use strict';
import sinon from 'sinon';
import {expect} from 'chai';
const style = require('./style.mock.js');

const webpackContextFactory = (done, query) => ({
  query: `?${query}`,
  context: '!sass-loader',
  async: () => done
});

const loaderFactory = webpackContext => require('../src/index').bind(webpackContext);


describe('Wix TPA style loader', () => {
  describe('handle error', () => {
    let spy;
    beforeEach((done) => {
      spy = sinon.spy(() => done());
      const webpackContext = webpackContextFactory(spy);
      loaderFactory(webpackContext)(style.bad);
    });

    it('should call to error on malformed css', () => {
      sinon.assert.calledOnce(spy);
      expect(spy.getCall(0).args[0]).to.contain('CssSyntaxError');
    });
  });

  describe('handle remian', () => {
    let spy;

    beforeEach((done) => {
      spy = sinon.spy(() => done());
      const webpackContext = webpackContextFactory(spy);
      loaderFactory(webpackContext)(style.good);
    });

    it('should pass css without TPA params to next loader', () => {
      sinon.assert.calledOnce(spy);
      expect(spy.getCall(0).args[0]).to.eql(null);
      expect(spy.getCall(0).args[1]).to.not.contain('color');
    });
  });

  describe('handle inline', () => {
    let spy;

    beforeEach((done) => {
      spy = sinon.spy(() => done());
      const webpackContext = webpackContextFactory(spy, 'mode=inline');
      loaderFactory(webpackContext)(style.good);
    });

    it('should pass css with TPA params to next loader', () => {
      sinon.assert.calledOnce(spy);
      expect(spy.getCall(0).args[0]).to.eql(null);
      expect(spy.getCall(0).args[1]).to.contain('{{color-1}}');
      expect(spy.getCall(0).args[1]).to.contain('font:;{{Body-M}};');
      expect(spy.getCall(0).args[1]).to.contain('addStyles.js');
    });
  });
});
