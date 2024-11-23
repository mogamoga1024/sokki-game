
const app = {
    data() {
        return {
            mode: "kaku", // top, kaku, yomu
            needぱ行: true, // todo
            needきゃ系: true, // todo
            sokkiTable: [],
            hiraList: [],

            mondai: ["な", "ま", "こ"],
            sintyoku: [],
            
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

        onClickSentakusi(hira, e) {
            debugger
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

            const hira = this.mondai[this.sintyoku.length];
            const sokki = 速記記号一覧[hira];
            sentakusiList.push({hira, sokki});

            while (sentakusiList.length < 4) {
                const hira = this.hiraList[randomInt(this.hiraList.length)];
                const sokki = 速記記号一覧[hira];
                if (!sentakusiList.includes(sokki)) {
                    sentakusiList.push({hira, sokki});
                }
            }
            this.sentakusiList = shuffle(sentakusiList);
        },
    }
};

Vue.createApp(app).mount("#app");
