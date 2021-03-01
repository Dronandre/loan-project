export default class Form {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Загрузга...',
            success: 'Спасибо!Скоро мы с вами свяжемся!',
            failure: 'Что-то пошло не так!'            
        };    
        this.path = 'assets/question.php';        
    }
    clearInputs() {
        this.inputs.forEach(item => {
            item.value = '';
        })
    }

    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');    
        mailInputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    e.preventDefault();
                }
            });
        });
    }

    async postData(url, data) {
        document.querySelector('.status').textContent = message.loading;
        let res = await fetch(url, {
            method: "POST",
            body: data
        });
        return await res.text()
    };

    initMask() {
        let setCursorPosition = (pos, elem) => {
            elem.focus();
            
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
    
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
    
        function createMask(event) {
            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');
    
            if(def.length >= val.length) {
                val = def;            
            }
    
            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length == 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }
    
        let inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    init() {
        this.checkMailInputs();
        this.initMask();
        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();
                let statusMessge = document.createElement('div');
                statusMessge.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color: grey;
                `;
                item.parentNode.appendChild(statusMessge);

                statusMessge.textContent = this.message.loading;

                const formData = new FormData(item);

                this.postData(this.path, formData)
                    .then(res => {
                        console.log(res);
                        statusMessge.textContent = this.message.success;
                    })
                    .catch(() => {
                        statusMessge.textContent = this.message.console.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessge.remove();
                        }, 6000)
                    })
            })
        })
    }
}