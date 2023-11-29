import { H } from 'highlight.run';

H.init('ng2o070d', {
  environment: 'production',
  version: 'commit:abcdefg12345',
  tracingOrigins: true,
  networkRecording: {
    enabled: true,
    recordHeadersAndBody: true,
  },
});