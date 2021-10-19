const app = Vue.createApp({
    data() {
        const rightAnswerArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        // const rightAnswerArray = ['a', 'b', 'c'];
        let wrongAnswer = [];
        let letters = {
            nextLetter: '',
            typingLetter: 'Enter a letter',
            rightLetter: '',
        }
        const settings = {
            correctSound: false,
            wrongSound: true,
            reviewStep: '30',
            totalStep: '50',
        }
        return {
            rightAnswerArray,
            wrongAnswer,
            settings,
            letters,
        }
    },
    methods: {
        /* todo 10/17
	 * 難度 1 = [a-z] by order
	 * 難度 2 = random letter [a-z]
	 * 難度 3 = random letter [a-z][A-Z]
	 * 錯誤字收集，輸入50字結算
	 * 只練習易錯誤題庫
	 */
        speechWord() {
            const rightAnswerArray = this.rightAnswerArray;
            let steps = 0;
            speechSynthesis(rightAnswerArray[steps]);
            
            const speechWordsHandler = e => {
                const typingDisplayElement = this.$refs.typingDisplay;
                const typingLetter = e.key;
                
                window.speechSynthesis.cancel();  // 一開始先停止所有朗讀
                
                this.settings.totalStep--;
                
                // 遊戲結束
                if (this.settings.totalStep === 0) {
                    console.log('game over');
                    return;
                }
                
                // 如果已經到了答案最後一個就重新來過
                if (steps === rightAnswerArray.length - 1) {
                    steps = randomNumber();
                    this.letters.typingLetter = typingLetter;  // 顯示輸入的字母
                    this.letters.rightLetter = rightAnswerArray[steps];  // 顯示答案
                    this.letters.nextLetter = rightAnswerArray[steps];  // 顯示下一個字母
                    speechSynthesis(rightAnswerArray[steps]);
                    return;
                }
                
                this.letters.rightLetter = rightAnswerArray[steps];  // 顯示答案
                this.letters.typingLetter = typingLetter;  // 顯示輸入的字母
                
                // 如果輸入字母與答案不同
                if (typingLetter !== rightAnswerArray[steps]) {
                    this.wrongAnswer.push(rightAnswerArray[steps]);
                    playSound('wrong');
                    speechSynthesis(rightAnswerArray[steps]);
                    typingDisplayElement.style.color = 'red';
                    return;
                }
                
                typingDisplayElement.style.color = 'green';
                playSound('correct');
                steps = randomNumber();
                // steps++;
                speechSynthesis(rightAnswerArray[steps]);  // 朗讀下一個字母
                this.letters.nextLetter = rightAnswerArray[steps];  // 顯示下一個字母
            }
            
            // random
            function randomNumber() {
                return parseInt(Math.random() * rightAnswerArray.length);
            }
            
            function playSound(state) {
                if (state === 'correct') new Audio('correct.mp3').play();
                if (state === 'wrong') new Audio('wrong.mp3').play();
            }
            
            
            function speechSynthesis(speechText) {
                const speechWords = new window.SpeechSynthesisUtterance();
                speechWords.text = speechText;
                window.speechSynthesis.speak(speechWords);
            }
            
            // 註：自Chrome 71以後，限定一定要使用者與頁面互動之後，才可以用這個SpeechAPI
            document.addEventListener('keyup', speechWordsHandler);
        },
    },
    mounted() {
        this.speechWord();
    },
})

app.mount('#app');