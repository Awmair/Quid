const endpoint = 'https://api.indexnow.org/indexnow';
const host = 'get-quid.site';
const origin = `https://${host}`;
const key = '1fec5dc5cd739ab1a89a3915fca326df';
const keyLocation = `${origin}/${key}.txt`;

const requestedUrls = process.argv.slice(2);

if (!requestedUrls.length) {
  console.error('Usage: npm run indexnow -- /changed-page/ https://get-quid.site/another-page/');
  process.exit(1);
}

const urlList = [...new Set(requestedUrls.map((value) => {
  const url = new URL(value, origin);
  if (url.protocol !== 'https:' || url.hostname !== host) {
    throw new Error(`IndexNow URL must belong to ${origin}: ${value}`);
  }
  url.hash = '';
  return url.href;
}))];

if (urlList.length > 10000) {
  throw new Error('IndexNow accepts at most 10,000 URLs per request.');
}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

const detail = (await response.text()).trim();
console.log(JSON.stringify({
  submittedAt: new Date().toISOString(),
  status: response.status,
  accepted: response.status === 200 || response.status === 202,
  urls: urlList,
  detail,
}, null, 2));

if (response.status !== 200 && response.status !== 202) process.exit(1);
