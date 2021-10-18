const app = Vue.createApp({
    data() {
        const rightAnswerArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        // const rightAnswerArray = ['a', 'b', 'c'];
        let wrongAnswer = [];
        let nextLetter = '';
        const settings = {
            correctSound: false,
            wrongSound: true,
            reviewStep: '30',
        }
        return {
            rightAnswerArray,
            wrongAnswer,
            nextLetter,
            settings,
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
                const typingDisplayElement = document.getElementById('typingDisplay');
                const rightLetterElement = document.getElementById('rightLetter');
                const typingLetter = e.key;
                
                window.speechSynthesis.cancel();  // 一開始先停止所有朗讀
                
                // 如果已經到了答案最後一個就重新來過
                if (steps === rightAnswerArray.length - 1) {
                    steps = randomNumber();
                    typingDisplayElement.innerText = typingLetter;  // 顯示輸入的字母
                    rightLetterElement.innerText = rightAnswerArray[steps];  // 顯示答案
                    this.nextLetter = rightAnswerArray[steps];  // 顯示下一個字母
                    speechSynthesis(rightAnswerArray[steps]);
                    return;
                }
                
                rightLetterElement.innerText = rightAnswerArray[steps];  // 顯示答案
                typingDisplayElement.innerText = typingLetter;  // 顯示輸入的字母
                
                // 如果輸入字母與答案不同
                if (typingLetter !== rightAnswerArray[steps]) {
                    console.log(this.wrongAnswer)
                    this.wrongAnswer.push(rightAnswerArray[steps]);
                    const wrongSound = new Audio('wrong.mp3');
                    wrongSound.play();
                    speechSynthesis(rightAnswerArray[steps]);
                    typingDisplayElement.style.color = 'red';
                    return;
                }
                
                typingDisplayElement.style.color = 'green';
                
                // 如果正確
                const correctSound = new Audio('correct.mp3');
                // correctSound.play();
                steps = randomNumber();
                console.log(steps)
                // steps++;
                speechSynthesis(rightAnswerArray[steps]);  // 朗讀下一個字母
                this.nextLetter = rightAnswerArray[steps];  // 顯示下一個字母
            }
            
            function randomNumber() {
                return parseInt(Math.random() * rightAnswerArray.length);
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