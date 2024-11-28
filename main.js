
let canClickSentakusi = true;

let mondaiCourse = "";
let mondaiOrder = "";
let mondaiType = "";

const app = {
    data() {
        return {
            mode: "top", // top, kaku
            sokkiTable: [],

            hiraList: [],
            mondai: [],
            sintyoku: [],
            message: "選んでね🤔",
            sentakusiList: [],
            selectedSentakusi: null,
        }
    },
    created() {
        this.initSokkiTable();
    },
    methods: {
        onClickPlay(course, order, type) {
            console.log(course, order, type);

            mondaiCourse = course;
            mondaiOrder = order;
            mondaiType = type;

            this.mode = "kaku";
            this.hiraList = 平仮名一覧(mondaiType === "全部");
            this.initMondai();
            this.initSentakusiList();
        },

        onClickRetire() {
            this.mode = "top";
        },

        onClickSentakusi(sentakusi) {
            if (!canClickSentakusi) {
                return;
            }
            if (this.mondai[this.sintyoku.length] === sentakusi.hira) {
                console.log("正解", sentakusi.hira);
                this.selectedSentakusi = null;
                this.message = "正解！😆";
                this.sintyoku.push(sentakusi.sokki);
                
                canClickSentakusi = false;
                if (this.sintyoku.length === this.mondai.length) {
                    setTimeout(() => {
                        this.initMondai();
                        canClickSentakusi = true;
                    }, 800);
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
            this.sintyoku = [];
            
            if (mondaiCourse === "基礎") {
                // todo
                this.mondai = 実践問題生成();
            }
            else if (mondaiCourse === "実践") {
                this.mondai = 実践問題生成(mondaiType === "全部");
            }
            
            this.initSentakusiList();
        },
        initSentakusiList() {
            this.selectedSentakusi = null;
            const sentakusiList = [];

            const hira = this.mondai[this.sintyoku.length];
            const sokki = 速記文字一覧[hira] ?? "";
            sentakusiList.push({hira, sokki});

            while (sentakusiList.length < 4) {
                const hira = this.hiraList[randomInt(this.hiraList.length)];
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
