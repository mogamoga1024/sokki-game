
const app = {
    data() {
        return {
            mode: "kaku", // top, kaku, yomu
            needぱ行: true, // todo
            needきゃ系: true, // todo
            sokkiTable: [],
            hiraList: [],
            sentakusiList: [],
        }
    },
    created() {
        this.initSokkiTable();
        this.hiraList = 平仮名一覧(this.needぱ行, this.needきゃ系);

        // debug stato
        this.initSentakusiList();
        // debug end
    },
    methods: {
        onClickKaku() {
            this.mode = "kaku";
            this.initSentakusiList();
        },
        onClickYomu() {
            this.mode = "yomu";
            // todo
        },

        initSokkiTable() {
            const hiraTable = [
                ["あ", "い", "う", "え", "お"],
                ["か", "き", "く", "け", "こ"],
                ["さ", "し", "す", "せ", "そ"],
                ["た", "ち", "つ", "て", "と"],
                ["な", "に", "ぬ", "ね", "の"],
                ["は", "ひ", "ふ", "へ", "ほ"],
                ["ま", "み", "む", "め", "も"],
                ["や", "", "ゆ", "", "よ"],
                ["ら", "り", "る", "れ", "ろ"],
                ["わ", "", "を", "", ""],
                ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
                ["きゃ", "", "きゅ", "", "きょ"],
                ["しゃ", "", "しゅ", "", "しょ"],
                ["ちゃ", "", "ちゅ", "", "ちょ"],
                ["にゃ", "", "にゅ", "", "にょ"],
                ["ひゃ", "", "ひゅ", "", "ひょ"],
                ["みゃ", "", "みゅ", "", "みょ"],
                ["りゃ", "", "りゅ", "", "りょ"],
                ["ぴゃ", "", "ぴゅ", "", "ぴょ"],
            ];
    
            for (const hiraRow of hiraTable) {
                const sokkiRow = [];
                let pad = "";
                if (["さ", "た", "や", "しゃ"].includes(hiraRow[0])) {
                    pad = "top";
                }
                else if (["は", "ら", "ぱ", "ぴゃ"].includes(hiraRow[0])) {
                    pad = "bottom";
                }
                for (const hira of hiraRow) {
                    let sokki = "";
                    if (hira !== "") {
                        sokki = 速記記号一覧[hira];
                    }
                    sokkiRow.push({hira, sokki, pad});
                }
                this.sokkiTable.push(sokkiRow);
            }
        },
        initSentakusiList() {
            const sentakusiList = [];
            while (sentakusiList.length < 5) {
                const sentakusi = 速記記号一覧[this.hiraList[randomInt(this.hiraList.length)]];
                if (!sentakusiList.includes(sentakusi)) {
                    sentakusiList.push(sentakusi);
                }
            }
            this.sentakusiList = sentakusiList;
        },
    }
};

Vue.createApp(app).mount("#app");
