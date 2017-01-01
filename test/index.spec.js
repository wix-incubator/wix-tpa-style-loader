'use strict';
import sinon from 'sinon';
import {expect} from 'chai';
const style = require('./style.mock.js');

const webpackContextFactory = (params) => ({
  query: `?${params.query}`,
  context: '!sass-loader',
  async: () => params.done
});

const loaderFactory = webpackContext => require('../src/index').bind(webpackContext);


describe('Wix TPA style loader', () => {
  describe('handle error', () => {
    let doneSpy;
    beforeEach((done) => {
      doneSpy = sinon.spy(() => done());
      const webpackContext = webpackContextFactory({done: doneSpy});
      loaderFactory(webpackContext)(style.bad);
    });

    it('should call to error on malformed css', () => {
      sinon.assert.calledOnce(doneSpy);
      expect(doneSpy.getCall(0).args[0]).to.contain('CssSyntaxError');
    });
  });

  describe('handle remian', () => {
    let doneSpy;

    beforeEach((done) => {
      doneSpy = sinon.spy(() => done());
      const webpackContext = webpackContextFactory({done: doneSpy});
      loaderFactory(webpackContext)(style.good);
    });

    it('should pass css without TPA params to next loader', () => {
      sinon.assert.calledOnce(doneSpy);
      expect(doneSpy.getCall(0).args[0]).to.eql(null);
      expect(doneSpy.getCall(0).args[1]).to.not.contain('color');
    });
  });

  describe('handle inline', () => {
    let doneSpy;

    beforeEach((done) => {
      doneSpy = sinon.spy(() => done());
      const webpackContext = webpackContextFactory({done: doneSpy, query: 'mode=inline'});
      loaderFactory(webpackContext)(style.good);
    });

    it('should pass css with TPA params to next loader', () => {
      sinon.assert.calledOnce(doneSpy);
      expect(doneSpy.getCall(0).args[0]).to.eql(null);
      expect(doneSpy.getCall(0).args[1]).to.contain('{{color-1}}');
      expect(doneSpy.getCall(0).args[1]).to.contain('font:;{{Body-M}};');
      expect(doneSpy.getCall(0).args[1]).to.contain('addStyles.js');
    });

    it('should support hmr', () => {
      expect(doneSpy.getCall(0).args[1]).to.contain('if(module.hot)');
    });

    it('should accept hmr', () => {
      expect(doneSpy.getCall(0).args[1]).to.contain('module.hot.accept()');
    });

    it('should trigger style change event', () => {
      expect(doneSpy.getCall(0).args[1]).to.contain('window.postMessage');
      expect(doneSpy.getCall(0).args[1]).to.contain('window.Wix.Events.STYLE_PARAMS_CHANGE');
    });
  });
});
