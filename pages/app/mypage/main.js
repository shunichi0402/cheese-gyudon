const inputButton = document.getElementById('input-button');
const aggregateButton = document.getElementById('aggregate-button');

inputButton.addEventListener('click', () => {
    window.location.href = '/app/mypage/input/';
});
aggregateButton.addEventListener('click', () => {
    window.location.href = '/app/mypage/aggregate/';
});