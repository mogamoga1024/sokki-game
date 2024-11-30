
let gameConfig = {
    course: "", order: "", type: ""
};

let hiraList = [];
let mondaiList = [];

let startTime = 0;

const app = {
    data() {
        return {
            scene: "result", // top, game, result
            sokkiTable: [],

            mondaiListIndex: 0,
            mondai: [],
            kaitou: [],
            message: "選んでね🤔",
            sentakusiList: [],
            selectedSentakusi: null,
            nextMondaiInterval: 400,

            clearTime: 0,
            correctCount: 0,
            missCount: 0,
        }
    },
    created() {
        this.initSokkiTable();
    },
    computed: {
        sintyoku() {
            return `${this.mondaiListIndex}/${mondaiList.length}`;
        },
        score() {
            const bunbo1 = this.clearTime / 1000 / 60;
            const bunbo2 = this.correctCount + this.missCount;
            if (bunbo1 === 0 || bunbo2 === 0) {
                return 0;
            }
            const s = this.correctCount / bunbo1 * Math.pow(this.correctCount / bunbo2, 3);
            return Math.floor(s * 100);
        },
        rank() {
            // todo
            return "S";
        },
        displayClearTime() {
            const tmp = Math.round(this.clearTime / 1000 * 10);
            return tmp / 10;
        },
        hitomoji() {
            if (this.correctCount === 0) {
                return 0;
            }
            const tmp = Math.round(this.clearTime / 1000 / this.correctCount * 10);
            return tmp / 10;
        },
        seikakuritu() {
            const bunbo = this.correctCount + this.missCount;
            if (bunbo === 0) {
                return 0;
            }
            const tmp = Math.round(this.correctCount / bunbo * 100 * 10);
            return tmp / 10;
        }
    },
    methods: {
        onClickPlay(course, order, type) {
            console.log(course, order, type);
            gameConfig = {course, order, type};
            this.startGame(gameConfig);
        },

        onClickRetire() {
            this.scene = "top";
        },

        onClickSentakusi(sentakusi) {
            if (this.mondai[this.kaitou.length] === sentakusi.hira) {
                console.log("正解", sentakusi.hira);
                this.correctCount++;
                this.selectedSentakusi = null;
                this.message = "正解！😆";
                this.kaitou.push(sentakusi.sokki);
                
                if (this.kaitou.length === this.mondai.length) {
                    this.mondaiListIndex++;
                    const isClear = this.mondaiListIndex >= mondaiList.length;
                    if (isClear) {
                        this.clearTime = performance.now() - startTime - this.nextMondaiInterval * (mondaiList.length - 1);
                    }
                    setTimeout(() => {
                        if (isClear) {
                            this.scene = "result";
                        }
                        else {
                            this.initMondai();
                        }
                    }, this.nextMondaiInterval);
                }
                else {
                    this.initSentakusiList();
                }
            }
            else {
                console.log("違う", sentakusi.hira);
                this.missCount++;
                this.selectedSentakusi = sentakusi;
                this.message = `それは「${sentakusi.hira}」…😢`;
            }
        },

        onClickResultEnd() {
            this.scene = "top";
        },

        onClickResultTudukeru() {
            this.startGame(gameConfig);
        },

        onClickTweet() {
            let game = `${gameConfig.type}${gameConfig.course}`;
            if (gameConfig.order !== "") {
                game += `（${gameConfig.order}）`;
            }
            const text = `遊んで学べる早稲田式速記ゲームの${game}でランクは「${this.rank}」、スコアは「${this.score}」でした。`;

            const link = document.createElement("a");
            link.href = `https://twitter.com/intent/tweet?url=https://mogamoga1024.github.io/sokki-game/&text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent("早稲田式速記")}`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.click();
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

        startGame({course, order, type}) {
            this.scene = "game";

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

            this.correctCount = 0;
            this.missCount = 0;
            this.clearTime = 0;
            startTime = performance.now();
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
