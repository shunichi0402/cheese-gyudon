const database = firebase.database();

async function addStudent(name, number, studentClass){
    if(!name || !number || !studentClass){
        return
    }

    const classData = await database.ref(`class/${studentClass}`).get();
    const parseClassData = await classData.val();

    console.log(parseClassData);

    if (parseClassData == null){
        console.log('err : classIDが不正な値です。');
        return
    }

    const result = await database.ref('student').push(
        {
            name,
            number
        }
    );

    console.log(`success : ${result}に追加されました。`);
}

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
                    relocadClass();
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
        document.getElementById('student-class').innerHTML = innerHTML;
    });
}

document.getElementById('add-class-button').addEventListener('click', () => {
    addClass(document.getElementById('class-name').value);
    document.getElementById('class-name').value = '';
});

document.getElementById('add-student-button').addEventListener('click', () => {
    const name = document.getElementById('student-name');
    const number = document.getElementById('student-number');
    const studentClass = document.getElementById('student-class');
    console.log(name);
    console.log(number);
    console.log(studentClass);
    addStudent(name.value, number.value, studentClass.value);
    name.value = ''; number.value = '';
});


relocadClass();

