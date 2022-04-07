$('document').ready(()=>{
    tablita()
        $('#potencia').on('change',()=>{
            let dataS = "status=" + $('#potencia').val();
            $.ajax({
                type: "GET",
                url: "/ExamenIHC2/backend/setStatusRange.php",
                data: dataS,
                success: (rr)=>{
                    console.log(rr);
                    grafi();
                    $('#table_id').DataTable().destroy();
                    tablita();                    
                }
            });            
        });

});

function grafi(){
    $.ajax({
        type: "GET",
        url: "/ExamenIHC2/backend/tabla.php",
        success: (rg)=>{
            console.log(rg); 
            let f = JSON.parse(rg);                   
            graficacion(f.graf);
        }
    });
}

function tablita(){
    $('#table_id').DataTable({
        "ajax": {
            "method":"POST",
            "url": "/ExamenIHC2/backend/tabla.php",
        },
        "columns":[
            {"data":"id"},
            {"data":"status"},
            {"data":"date"}
        ]
    });
}


const texts = document.querySelector(".texts");

let compatible = document.getElementById('compatible');

let potencia = document.getElementById('potencia');

let mensaje = document.getElementById('mensaje');

//let range = document.getElementById('range');



window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let gramatica = ['POTENCIA', 0, 100];



recognition.interimResults = true;

recognition.lang = "es-MX";



window.onload = (e) => {
    if (validateSpeechRecognition()) {
        compatible.innerHTML = '¡El navegador es compatible con Speech Recocgnition API!';
        recognition.start();
    }
    else
        compatible.innerHTML = "El navegador NO es compatible con Speech Recocgnition API";
}



recognition.onresult = (e) => {
    let text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

    text = text.toUpperCase();

    console.log(text);

    let arrayText = text.split(" ");

    let segundoValor = parseInt(arrayText[1], 10);

    //console.log(segundoValor);

    //console.log(arrayText);

    if (e.results[0].isFinal) {
        //text.includes("potencia")
        if (validaGramatica(arrayText[0], segundoValor, gramatica[0], gramatica[1], gramatica[2])) {
        // INSERCION EN LA BD CON AJAX
        let dataString = "status=" + (segundoValor);
        $('#potencia').val(segundoValor);
        $.ajax
            ({
                type: "GET",
                url: "./backend/setStatusRange.php",
                data: dataString,
                
                success: function (res) {
                    console.log(res);
                    
                    mensaje.innerHTML = "[Se guardó en el servidor " + res + "]";
                    grafi();
                    $('#table_id').DataTable().destroy();
                    tablita();
            }
        });
            texts.innerText = "Potencia: " + segundoValor;
            //range.value = segundoValor;
            mensaje.innerHTML = "Se envía la petición al servidor...";
        }
        /* else
            texts.innerText = ""; */
    }
};
/* recognition.addEventListener("end", () => {

    recognition.start();

}); */

// run when the speech recognition service has disconnected

// (automatically or forced with recognition.stop())

recognition.onend = () => {
    //console.log('Speech recognition service disconnected');
    recognition.start();
};

// will run when the speech recognition 

// service has began listening to incoming audio 

recognition.onstart = () => {
    console.log('Speech recognition service has started ');
};

/* recognition.start(); */

function validateSpeechRecognition() {

    if (!('webkitSpeechRecognition' in window) ||
        !window.hasOwnProperty("webkitSpeechRecognition") ||
        typeof (webkitSpeechRecognition) != "function"
    ) {
        return false;
    }
    else {
        return true;
    }

}

function validaGramatica(palabra1, palabra2, gramatica1, gramatica2, gramatica3) {

    if (palabra1 == gramatica1 &&
        Number.isInteger(palabra2) &&
        palabra2 >= gramatica2 && palabra2 <= gramatica3) {
        return true;
    }
    else
        return false;
}

$.ajax
            ({
                type: "GET",
                url: "/ExamenIHC2/backend/tabla.php",
                success: function (res) {
                    let arreglo = JSON.parse(res);
                    graficacion(arreglo.graf);
            }
        });

function graficacion(valor){
    
    google.charts.load('current', {'packages':['scatter']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart () {
        
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Hours Studied');
        data.addColumn('number', 'Potencia');

        data.addRows(valor);
        var options = {
          width: 800,
          height: 500,
          chart: {
            title: 'Gráfica de potencia',
            subtitle: 'Gráfica donde se mustran los datos del control range'
          },
          hAxis: {title: 'Valor'},
          vAxis: {title: 'ID del registro'}
        };

        var chart = new google.charts.Scatter(document.getElementById('grafica'));

        chart.draw(data, google.charts.Scatter.convertOptions(options));
      }
}