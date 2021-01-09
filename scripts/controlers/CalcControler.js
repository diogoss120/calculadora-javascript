class calcController {
    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOffOn = true;
        this._locale = 'pt-BR';
        this._displayCalcEl = document.getElementById('display');
        this._dataEl = document.getElementById('data');
        this._horaEl = document.getElementById('hora');
        this._currentDate;
        this._operations = [];
        this.initialize();
        this.initButtonsEvents();
        this.initKeyEvents();
    }

    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000)

        this.setLastNumberToDisplay();

        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', event => {
                this.toggleAudio();
            })
        });
    }

    toggleAudio() {
        this._audioOffOn = !this._audioOffOn;
    }

    playAudio() {
        if (this._audioOffOn) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyEvents() {
        document.addEventListener('keyup', event => {

            this.playAudio();
            switch (event.key) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseFloat(event.key));
                    break;

                case '+':
                case '-':
                case '/':
                case '*':
                    this.addOperation(event.key);
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;
                case 'Escape':
                    this.clearAll();
                    break;
                case '=':
                case 'Enter':
                case '%':
                    this.pushOperation(event.key);
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case 'c':
                    if (event.ctrlKey) this.copyToClipBoard();
                    break
            }
        })
    }

    pasteFromClipBoard() {
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');

            let number = this.getLastItemOfArray();

            let lastItem = this.getLastIndexOfArray()

            if (number == undefined || this.isOperator(lastItem)) {
                this.pushOperation(text);
            } else {
                let newValue = number.toString() + text.toString();
                this.alterLastNumber(newValue);
                console.log('caiu no else', newValue.toString());
            }
        });
        this.setLastNumberToDisplay();
    }
    isOperator(operation) {
        var listOfOperators = ['-', '+', '*', '/'];
        for (let i = 0; i < 4; i++) {
            if (listOfOperators[i] == operation) {
                return true;
            };
        }
        return false;
    }

    copyToClipBoard() {
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();
    }

    action(value) {

        this.playAudio();
        switch (value) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(value));
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'ac':
                this.clearAll();
                break;
            case 'igual':
                this.calc();
                break
            case 'porcento':
                this.pushOperation('%');
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
        }
    }

    clearEntry() {
        this._operations.pop();
        this.setLastNumberToDisplay();
    }

    clearAll() {
        this._operations = [];
        this.setLastNumberToDisplay();
    }

    getResult() {
        try {
            return eval(this._operations.join(''));
        } catch {
            setTimeout(1,()=>{
                this.setError();
            })
        }
    }

    setError(){
        this.clearAll();
        this.displayCalc = 'ERROR';
    }

    calc() {

        if (this._operations.length > 3) {
            let lastOperation = this._operations.pop();
            let result = this.getResult();
            if (lastOperation == '%') {
                result /= 100
                this._operations = [result];
            } else {
                this._operations = [result, lastOperation];
            }
        } else if (this._operations.length == 3) {
            let result = this.getResult();
            this._operations = [result];
        }

        this.setLastNumberToDisplay();
        console.log(this._operations);
    }

    pushOperation(value) {
        this._operations.push(value);
        if (this._operations.length > 3) {
            this.calc();
        }
        this.setLastNumberToDisplay();
    }

    getLastItemOfArray(getNumber = true) {
        for (let i = this._operations.length - 1; i >= 0; i--) {
            let isNumber = !isNaN(this._operations[i]);
            if (isNumber == getNumber) {
                return this._operations[i];
            }
        }
    }

    getLastIndexOfArray() {
        return this._operations[this._operations.length - 1];
    }


    setLastNumberToDisplay() {
        let lastNumber = this.getLastItemOfArray();
        this.displayCalc = !lastNumber ? 0 : lastNumber;
    }

    addDot() {
        let lastNumber = this.getLastItemOfArray();
        let lastValue = this.getLastIndexOfArray();

        if (typeof lastValue == 'string' && lastValue.split('').indexOf('.') > -1) return;

        if (lastNumber == undefined || typeof lastValue == 'string') {
            this.addOperation('0.');
        } else if (!isNaN(this.getLastItemOfArray())) {
            lastNumber = lastNumber.toString() + '.';
            this.alterLastNumber(lastNumber);
        }

        this.setLastNumberToDisplay();
    }

    alterLastNumber(value) {
        let lastIndice = this._operations.length - 1;
        this._operations[lastIndice] = value;
        this.setLastNumberToDisplay();
    }

    addOperation(value) {

        let ultimoIndice = this._operations.length - 1;
        let ultimoValor = this._operations[ultimoIndice];

        if (isNaN(value)) {
            //é uma operacao, é uma string!
            if (isNaN(ultimoValor)) {
                this._operations[ultimoIndice] = value;
            } else {
                //nova operação
                this.pushOperation(value);
            }
        } else {
            //é um número
            if (isNaN(ultimoValor)) {
                this._operations.push(value);
            } else {
                let lastValue = this.getLastItemOfArray().toString() + value.toString()
                this.alterLastNumber(lastValue);
            }
        }
        this.setLastNumberToDisplay();
        console.log(this._operations);
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                let value = btn.className.baseVal.replace('btn-', '');
                this.action(value);
            })
            btn.style.cursor = 'pointer';
        })
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime() {
        return this._horaEl.innerHTML;
    }

    set displayTime(value) {
        return this._horaEl.innerHTML = value;
    }

    get displayDate() {
        return this._dataEl.innerHTML;
    }

    set displayDate(value) {
        return this._dataEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return;
        }
        
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }
}