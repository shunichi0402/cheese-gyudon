const database = firebase.database();

csv = '';

function paseDate(date, format) {

    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/, ('0' + date.getDate()).slice(-2));

    return format;
}

async function getAttend(classID, date){
    if(!classID){
        return;
    }

    const classData = await database.ref(`class/${classID}`).get();
    const parsedClassData = await classData.val();

    if (!parsedClassData){
        console.log('err : clasIDが不正な値です。');
        return;
    }

    if (Number.isNaN(date.getTime()) && date){
        date = new Date();
    }

    if(!date){
        date = paseDate(new Date(), 'YYYY-MM-DD');
    } else {
        date = paseDate(date, 'YYYY-MM-DD');
    }


    const classStudentData = await database.ref(`class/${classID}/student`).get();
    const parsedClassStudentData = await classStudentData.val();

    const tableData = [];
    csv = '出席番号:名前, HL, 1, 2, 3, 4, 5, 6, 7, 8\n';
    if (parsedClassStudentData) {
        for (const [key, value] of Object.entries(parsedClassStudentData)) {
            const tmpData = []
            
            const attendData = await database.ref(`attend/${key}/${date}`).get();
            const parsedAttendData = await attendData.val();

            const studnetData = await database.ref(`student/${key}`).get();
            const parsedStudentData = await studnetData.val();

            console.log(parsedAttendData);

            if (parsedAttendData){
                for(let i = 0; i < 9; i++){
                    if (parsedAttendData[i]){
                        tmpData.push(parsedAttendData[i]);
                    }else{
                        tmpData.push({
                            remarks:'',
                            status : -1
                        });
                    }
                }
            } else {
                for (let i = 0; i < 9; i++) {
                    tmpData.push({
                        remarks: '',
                        status: -1
                    });
                }
            }

            if (parsedStudentData){
                tableData.push({ student: `${parsedStudentData.number} : ${parsedStudentData.name}`, data: tmpData});
                console.log(tmpData);
                const tmpStr = tmpData.map(item => {
                    if (item.status == -1) {
                        return '-'
                    }
                    if (item.status == 0) {
                        return `出席`;
                    }
                    if (item.status == 1) {
                        return `欠席`;
                    }
                    if (item.status == 2) {
                        return `忌引き`;
                    }
                    if (item.status == 3) {
                        return `早退`;
                    }
                    if (item.status == 4) {
                        return `遅刻`;
                    }
                    if (item.status == 5) {
                        return `公欠`;
                    }
                }).join(', ');
                csv += `${parsedStudentData.number}:${parsedStudentData.name},` + tmpStr + '\n';
            }
        }
    }

    console.log(tableData);

    dislpayTable(tableData);
    // const attendData = await database.ref(`attend/${studentID}/${date}`).get();

    // console.log(attendData);
}


function dislpayTable(tableData){

    const newTable = document.getElementById('new-table');
    newTable.innerHTML = `
    <div class="main-table">
        <div>
        出席番号 : 名前
        </div>
        <div>ホームルーム</div>
        <div>1限目</div>
        <div>2限目</div>
        <div>3限目</div>
        <div>4限目</div>
        <div>5限目</div>
        <div>6限目</div>
        <div>7限目</div>
        <div>8限目</div>
    </div>
    `;

    tableData.forEach(item => {
        let tmpStr = '';
        item.data.forEach(iitem => {
            if (iitem.status == -1){
                tmpStr += `<div>-</div>`;
            }
            if (iitem.status == 0){
                tmpStr += `<div>出席</div>`;
            }
            if (iitem.status == 1){
                tmpStr += `<div>欠席</div>`;
            }
            if (iitem.status == 2){
                tmpStr += `<div>忌引き</div>`;
            }
            if (iitem.status == 3){
                tmpStr += `<div>早退</div>`;
            }
            if (iitem.status == 4){
                tmpStr += `<div>遅刻</div>`;
            }
            if (iitem.status == 5){
                tmpStr += `<div>公欠</div>`;
            }
        })
        let tmpHTML = `
            <div class="main-table">
                <div>${item.student}</div>
                ${tmpStr}
            </div>
        `;
        newTable.innerHTML += tmpHTML
    });
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

document.getElementById('input-class').addEventListener('change', () => {
    getAttend(document.getElementById('input-class').value, new Date((document.getElementById('input-date').value)));
});
document.getElementById('input-date').addEventListener('change', () => {
    getAttend(document.getElementById('input-class').value, new Date((document.getElementById('input-date').value)));
});


relocadClass();
setTimeout(() => {
    getAttend(document.getElementById('input-class').value, new Date((document.getElementById('input-date').value)));
}, 1000);

console.log(document.getElementById('input-date').value);

// getAttend('-Mr3bvsam37BxPMSSLCR');



function download(){
    document.getElementById('')
    const downloadElement = document.createElement('a');
    downloadElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv);
    downloadElement.setAttribute('download', 'data.csv');
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
}