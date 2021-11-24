const database = firebase.database();

function addClass(name){
    if(name){
        database.ref('class').get().then(data => {
            parsedData = data.val();
    
            let flag = true
            if (parsedData){
                for (const [key, value] of Object.entries(parsedData)) {
                    if (value.name == name) flag = false;
                }
            }
    
            if(flag){
                database.ref('class').push(
                    {
                        name,
                    }
                ).then(id => {
                    console.log(`success : ${id}に追加されました。`);
                });
            } else {
                console.log('err : この名前は既に使用されています。');
            }

        });
    }
}

function relocadClass(){
    database.ref('class').get().then(data => {
        parsedData = data.val();
    
        let innerHTML = '';
        for (const [key, value] of Object.entries(parsedData)) {
            innerHTML += `<option value="${key}">${value.name}</option>`;
        }
        document.getElementById('input-student-class').innerHTML = innerHTML;
    });
}

document.getElementById('add-class-button').addEventListener('click', () => {
    addClass(document.getElementById('class-name').value);
})

