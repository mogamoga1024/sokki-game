
let canClickSentakusi = true;

let hiraList = [];
let mondaiList = [];

const app = {
    data() {
        return {
            scene: "top", // top, kaku
            sokkiTable: [],

            mondaiListIndex: 0,
            mondai: [],
            kaitou: [],
            message: "選んでね🤔",
            sentakusiList: [],
            selectedSentakusi: null,
        }
    },
    created() {
        this.initSokkiTable();
    },
    computed: {
        sintyoku() {
            return `${this.mondaiListIndex}/${mondaiList.length}`;
        }
    },
    methods: {
        onClickPlay(course, order, type) {
            console.log(course, order, type);

            this.scene = "kaku";

            hiraList = 平仮名一覧(type);
            this.mondaiListIndex = 0;
            if (course === "基礎") {
                mondaiList = hiraList.map(hira => [hira]);
                if (order === "ランダム") {
                    shuffle(mondaiList);
                }
            }
            else if (course === "実践") {
                mondaiList = 実践問題リスト生成(type === "全部");
            }
            
            this.initMondai();
            this.initSentakusiList();
        },

        onClickRetire() {
            this.scene = "top";
        },

        onClickSentakusi(sentakusi) {
            if (!canClickSentakusi) {
                return;
            }
            if (this.mondai[this.kaitou.length] === sentakusi.hira) {
                console.log("正解", sentakusi.hira);
                this.selectedSentakusi = null;
                this.message = "正解！😆";
                this.kaitou.push(sentakusi.sokki);
                
                canClickSentakusi = false;
                if (this.kaitou.length === this.mondai.length) {
                    this.mondaiListIndex++;
                    if (this.mondaiListIndex >= mondaiList.length) {
                        // todo clear
                    }
                    setTimeout(() => {
                        this.initMondai();
                        canClickSentakusi = true;
                    }, 400);
                }
                else {
                    this.initSentakusiList();
                    // 連打防止
                    setTimeout(() => {
                        canClickSentakusi = true;
                    }, 200);
                }
            }
            else {
                console.log("違う", sentakusi.hira);
                this.selectedSentakusi = sentakusi;
                this.message = `それは「${sentakusi.hira}」…😢`;
            }
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
                ["わ", "", "", "", ""],
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
                        sokki = 速記文字一覧[hira];
                    }
                    sokkiRow.push({hira, sokki, pad});
                }
                this.sokkiTable.push(sokkiRow);
            }
        },
        initMondai() {
            this.message = "選んでね🤔";
            this.kaitou = [];
            this.mondai = mondaiList[this.mondaiListIndex];
            this.initSentakusiList();
        },
        initSentakusiList() {
            this.selectedSentakusi = null;
            const sentakusiList = [];

            const hira = this.mondai[this.kaitou.length];
            const sokki = 速記文字一覧[hira] ?? "";
            sentakusiList.push({hira, sokki});

            while (sentakusiList.length < 4) {
                const hira = hiraList[randomInt(hiraList.length)];
                const sokki = 速記文字一覧[hira];
                if (sentakusiList.every(s => s.sokki !== sokki)) {
                    sentakusiList.push({hira, sokki});
                }
            }
            this.sentakusiList = shuffle(sentakusiList);
        },
    }
};

Vue.createApp(app).mount("#app");
