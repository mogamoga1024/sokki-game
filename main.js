
let canClickSentakusi = true;

let mondaiCourse = "";
let mondaiType = "";

let hiraList = [];

const app = {
    data() {
        return {
            mode: "top", // top, kaku
            sokkiTable: [],

            hiraListIndex: 0,
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
            if (mondaiCourse === "基礎") {
                return `${this.hiraListIndex}/${hiraList.length}`;
            }
            else if (mondaiCourse === "実践") {
                // todo
                return "10/20";
            }
        }
    },
    methods: {
        onClickPlay(course, order, type) {
            console.log(course, order, type);

            mondaiCourse = course;
            mondaiType = type;

            this.mode = "kaku";

            hiraList = 平仮名一覧(mondaiType);
            this.hiraListIndex = 0;
            if (order === "ランダム") {
                shuffle(hiraList);
            }
            
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
            if (this.mondai[this.kaitou.length] === sentakusi.hira) {
                console.log("正解", sentakusi.hira);
                this.selectedSentakusi = null;
                this.message = "正解！😆";
                this.kaitou.push(sentakusi.sokki);
                
                canClickSentakusi = false;
                if (this.kaitou.length === this.mondai.length) {
                    if (mondaiCourse === "基礎") {
                        this.hiraListIndex++;
                        if (this.hiraListIndex >= hiraList.length) {
                            // todo clear
                        }
                    }
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
            this.kaitou = [];
            
            if (mondaiCourse === "基礎") {
                this.mondai = [hiraList[this.hiraListIndex]];
            }
            else if (mondaiCourse === "実践") {
                this.mondai = 実践問題生成(mondaiType === "全部");
            }
            
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
