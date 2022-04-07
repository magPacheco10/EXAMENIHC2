let estatus = document.getElementById('estatus');


setInterval(() => {

    $.ajax
        ({
            type: "GET",
            url: "/ExamenIHC2/backend/getStatusRange.php",
            success: function (status) {
                // estatus.value = status + " ";
            }
        });
}, 1000);