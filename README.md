# 冬日暖屋 · English Cottage

以照片中的 224 個單字與片語製作的繁體中文英文學習遊戲。完整詞表見 [vocabulary.md](vocabulary.md)。

## 開始遊戲

無需安裝應用依賴。使用 Python 3：

```sh
cd /workspace/EnglishGame
python3 -m http.server 8000 --bind 0.0.0.0
```

用瀏覽器開啟伺服器。答對題目可得 20 金幣，商店中可修屋頂、窗戶，購買熱湯和家具。每次作答消耗少量飽足和溫暖，離線不消耗；狀態過低時有緊急救援，不會永久失敗。全部十項永久物品購齊即完成暖屋目標，可繼續練習單字。

進度使用瀏覽器 localStorage，無帳號或後端。不同裝置不會同步。發音使用瀏覽器語音引擎，聲音支援依裝置而異。Google 字型載入失敗會使用系統字型。

## 驗證

```sh
node --check app.js
# 另需 Playwright 與 Chromium，且先啟動上述伺服器
node tests/smoke.cjs
```

照片原編號 1–224 全數收錄，包含人名及英美拼字差異；中文譯義已校正，未沿用照片裡不正確的手寫例句。
