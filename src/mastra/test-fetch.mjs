// test-fetch.mjs ファイルの中身

const url = 'https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&current=precipitation';

async function doFetch() {
  try {
    console.log(`このURLに接続を試みます: ${url}`);
    const response = await fetch(url);
    console.log(`ステータスコード: ${response.status}`);
    const data = await response.json();
    console.log("通信成功！ データ受信:", data);
  } catch (error) {
    console.error("通信に失敗しました:", error);
  }
}

doFetch();
