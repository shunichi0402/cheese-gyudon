const database = firebase.database();

function paseDate(date, format){

    format = format.replace(/YYYY/, date.getFullYear());
    format = '0' + format.replace(/MM/, date.getMonth() + 1);
    format = '0' + format.replace(/DD/, date.getDate());

    return format;
}

async function addAttend(studentID, date, time, status, remarks = ''){
    if (!studentID || !date || !time || !status) {
        return
    }

    const studentData = await database.ref(`studnet/${studentID}`).get();
    const parseStudnetData = await studentData.val();

    if (parseStudnetData == null){
        console.log('err : studentIDが不正な値です。');
        return
    }

    const attendData = await database.ref(`attend/${studentID}/${date}/${time}`).get();
    parseAttendData = await attendData.val();

    if (parseAttendData != null){
        console.log('err : 既にデータが存在しています');
        return
    }

    database.ref(`attend/${studentID}/${date}/${time}`).set({
        status,
        remarks
    });

}

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
        if (parsedData){
            for (const [key, value] of Object.entries(parsedData)) {
                innerHTML += `<option value="${key}">${value.name}</option>`;
            }
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

