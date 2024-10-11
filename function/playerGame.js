const fsFunc = require("./readWriteFile.js");

fsFunc.readFile("../database/masoi.json", (err, data) => {
    if (err) return console.error(err);
    const maSoiDB = JSON.parse(data);
    if (maSoiDB) {
        const curGameCount = maSoiDB.gameCount + 1;
        maSoiDB.gameCount = curGameCount;
        maSoiDB.game[curGameCount] = {
            "playerCount": 0,
            "players": {},
            "status": 1,
            "time": new Date().getTime(),
            "winner": "",
        };
        fsFunc.writeFile("../database/masoi.json", JSON.stringify(maSoiDB), (err) => {
            if (err) return console.error(err);
        });
    }
});