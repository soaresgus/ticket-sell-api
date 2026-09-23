import http from 'k6/http';
import { check } from 'k6';
import exec from 'k6/execution';

const MAX = 100;

export const options = {
  scenarios: {
    burst: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 110,
      maxDuration: '30s',
    },
  },
};

export default function () {
  const base = __ENV.BASE_URL || 'http://127.0.0.1:3000';
  const res = http.get(`${base}/api/v1/health`);
  const n = exec.scenario.iterationInTest;

  check(res, {
    'respects the limit': (r) => (n < MAX ? r.status === 200 : r.status === 429),
  });
}
