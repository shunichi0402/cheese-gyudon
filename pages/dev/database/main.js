const database = firebase.database();

function paseDate(date, format){

    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/, ('0' + date.getDate()).slice(-2) );

    return format;
}

async function addAttend(studentID, date, time, status, remarks = ''){

    console.log(date);
    if (!studentID || !date || !time || !status) {
        return
    }

    const studentData = await database.ref(`student/${studentID}`).get();
    const parseStudnetData = await studentData.val();

    console.log(studentID);
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

    const resultClass = await database.ref(`class/${studentClass}/student/${result.key}`).set(true);

    console.log(`success : ${result}に追加されました。`);

    return;
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
        document.getElementById('attend-class').innerHTML = innerHTML;
    });
}

async function relocadStudent(studnetClass){
    let innerHTML = '';

    const classData = await database.ref(`class/${studnetClass}/student`).get();
    const parseClassData = await classData.val();

    console.log(parseClassData);
    if(parseClassData){
        for (const [key, value] of Object.entries(parseClassData)) {

            console.log(key);
            const studentData = await database.ref(`student/${key}`).get();
            const parseStudentData = await studentData.val();

            if(parseStudentData){
                innerHTML += `<option value="${key}">${parseStudentData.number}:${parseStudentData.name}</option>`;
            }
        }
    } else {

    }

    document.getElementById('attend-student').innerHTML = innerHTML;

}

document.getElementById('add-class-button').addEventListener('click', () => {
    addClass(document.getElementById('class-name').value);
    document.getElementById('class-name').value = '';
});

const attendClassElenet = document.getElementById('attend-class');

document.getElementById('add-student-button').addEventListener('click', async () => {
    const name = document.getElementById('student-name');
    const number = document.getElementById('student-number');
    const studentClass = document.getElementById('student-class');
    console.log(name);
    console.log(number);
    console.log(studentClass);
    await addStudent(name.value, number.value, studentClass.value);
    relocadStudent(attendClassElenet.value);
    name.value = ''; number.value = '';
});

document.getElementById('add-attend-button').addEventListener('click', () => {
    const studentClass = document.getElementById('attend-class');
    const student = document.getElementById('attend-student');
    const date = document.getElementById('attend-date');
    const time = document.getElementById('attend-time');
    const status = document.getElementById('attend-status');
    const remarks = document.getElementById('attend-remarks');
    addAttend(student.value, date.value, time.value, status.value, remarks.value);
});


attendClassElenet.addEventListener('change', () => {
    relocadStudent(attendClassElenet.value);
})


relocadClass();

setTimeout(() => {
    relocadStudent(attendClassElenet.value);
}, 1500);

