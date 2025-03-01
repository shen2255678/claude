const { createApp, ref } = Vue;

const app = createApp({
    setup() {
        const message = ref('你好，世界！');
        const messages = [
            '你好，世界！',
            '歡迎使用 Vue.js！',
            '這是一個簡單的 Hello World 應用',
            '由 Claude 幫助創建',
            '點擊按鈕切換訊息'
        ];
        
        function changeMessage() {
            const currentIndex = messages.indexOf(message.value);
            const nextIndex = (currentIndex + 1) % messages.length;
            message.value = messages[nextIndex];
        }
        
        return {
            message,
            changeMessage
        };
    }
});

app.mount('#app');
