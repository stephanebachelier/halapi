'use strict';
import Resource from '../source/resource';
import test from 'tape';
import has from 'lodash/object/has';
import { server, apiServer } from './helpers';
import got from 'got';

test('Resource fetch', (t) => {
  t.plan(2);

  server().then((api) => {
    const result = Resource.fetch('/api', api.options);

    t.equal(typeof result.then, 'function', 'should be a promise');

    result.then((resource) => {
      t.ok(resource instanceof Resource, 'should return a Resource instance');
    });
  });
});

test('Resource data', (t) => {
  t.plan(2);

  server().then((api) => {
    Resource
      .fetch('/api', api.options)
      .then((resource) => {
        t.ok(resource instanceof Resource, 'should return a Resource instance');
        t.equal(resource._data, 'ok', 'resource data should hold the response body');
      });
  });
});

test('Resource links with default `links` attributes', (t) => {
  t.plan(2);

  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        const links = resource.links();

        t.ok(has(links, 'self'), 'should have the `self` link');
        t.ok(has(links, 'house'), 'should have the `house` link');
      });
  });
});

test('Resource links with `_links` attributes', (t) => {
  t.plan(2);

  apiServer('resource-_links.json').then((api) => {
    api.options.linkAttr = '_links';

    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        const links = resource.links();

        t.ok(has(links, 'self'), 'should have the `self` link');
        t.ok(has(links, 'house'), 'should have the `house` link');
      });
  });
});
