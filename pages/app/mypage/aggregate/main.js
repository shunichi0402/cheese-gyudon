const database = firebase.database();

function paseDate(date, format) {

    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/, ('0' + date.getDate()).slice(-2));

    return format;
}

async function getAttend(startDate, endDate, classID){

    // console.log(classID);
    if (!classID) {
        return;
    }

    const classData = await database.ref(`class/${classID}`).get();
    const parsedClassData = await classData.val();

    if (!parsedClassData) {
        console.log('err : clasIDが不正な値です。');
        return;
    }

    const students = parsedClassData.student;

    console.log('start');
    console.log(startDate);
    console.log('end');
    console.log(endDate);
    if(!startDate){
        startDate = new Date('1971-01-01');
    }
    if (!endDate) {
        endDate = new Date('2030-01-01');
    }

    const attendData = await database.ref(`attend`).get();
    const parsedAttendData = await attendData.val();

    // console.log(parsedAttendData);

    data = [];

    for (const [key, value] of Object.entries(parsedAttendData)) {

        const counter = (new Array(6)).fill(0);

        for (const [dkey, dvalue] of Object.entries(value)){
            const date = new Date(dkey);
            if (startDate.getTime() < date.getTime() && endDate.getTime() > date.getTime()){
                // console.log(dvalue);
                if(dvalue){
                    dvalue.forEach(item => {
                        counter[parseInt(item.status)]++;
                    })
                }

            }
        }

        if (students[key]){
            const namedata = await database.ref(`student/${key}`).get();
            const parsedNamedata = await namedata.val();

            data.push({
                student: parsedNamedata,
                data: counter
            });
            console.log(parsedNamedata)
            console.log(key);
            console.log(counter);
        }

    }

    dislpayTable(data);
}


function dislpayTable(data){

    const newTable = document.getElementById('new-table');
    newTable.innerHTML = `
    <div class="main-table">
        <div>
        出席番号 : 名前
        </div>
        <div>出席</div>
        <div>欠席</div>
        <div>忌引き</div>
        <div>早退</div>
        <div>遅刻</div>
        <div>公欠</div>
    </div>
    `;

    
    data.forEach(item => {
        let tmpHTML = `
            <div class="main-table">
                <div>${item.student.number} : ${item.student.name}</div>
                <div>${item.data[0]}</div>
                <div>${item.data[1]}</div>
                <div>${item.data[2]}</div>
                <div>${item.data[3]}</div>
                <div>${item.data[4]}</div>
                <div>${item.data[5]}</div>
            </div>
        `;
        newTable.innerHTML += tmpHTML
    })

    document.body.appendChild(newTable);
}

function relocadClass() {
    database.ref('class').get().then(data => {
        parsedData = data.val();

        let innerHTML = '';
        if (parsedData) {
            for (const [key, value] of Object.entries(parsedData)) {
                innerHTML += `<option value="${key}">${value.name}</option>`;
            }
        }
        document.getElementById('input-class').innerHTML = innerHTML;
    });
}

// document.getElementById('end-date').addEventListener('change', () => {
//     getAttend(new Date((document.getElementById('start-date').value)), new Date((document.getElementById('end-date').value)), document.getElementById('input-class').value);
// });
document.getElementById('submit').addEventListener('click', () => {
    getAttend(new Date((document.getElementById('start-date').value)), new Date((document.getElementById('end-date').value)), document.getElementById('input-class').value);
});


relocadClass();
// setTimeout(() => {
//     getAttend(document.getElementById('input-class').value, new Date((document.getElementById('input-date').value)));
// }, 1000);

// console.log(document.getElementById('input-date').value);

getAttend();




