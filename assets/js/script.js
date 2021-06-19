$(document).ready(function () {

    $('#contenido').hide();
    
    $('#btn_buscar').click(function (e) { 
        e.preventDefault();

        let id = $("#txt_idsp").val();
        
        if (validar(id)) {
            //$('#contenido').hide(300);
            consulta_api(id);
            $('#contenido').show(); 
        }
    });


    function mostrar_grafico(objeto) {
        let stats = []; // se crea arreglo para enviar al canvas
        
        //se recorre el objeto para darle el formato que recibe el canvas
        Object.keys(objeto.powerstats).forEach(function (elem) {  
            //se añade el objeto          
            stats.push({y: objeto.powerstats[elem], label: elem});
        });
        
        
        var chart = new CanvasJS.Chart("chartContainer", {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Estadisticas de poder para: "+objeto.name
            },
            data: [{ 
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - ({y})",
                dataPoints: stats //se asigna el arreglo
            }]
        });
        chart.render();
    }
    
    function validar(input){            
        if(input == '' ){            
            $("#errorid").text("primero ingrese un numero");
            return false;
        } else if(!isNaN(parseInt(input))){            
            $("#errorid").text("");
            return true;
        }else{
            $("#errorid").text("solo debe ingresar numeros");
            return false;
        }
    }

    function consulta_api(id) {
        
        $.ajax({
            type: "GET",
            url:        "https://www.superheroapi.com/api.php/10160906972594027/"+id ,
            success:    function(data) {

                let nombre      = data.name;
                let conexiones  = data.connections['group-affiliation'];

                let parrafo1    = `
                    <h5>Nombre: ${nombre}</h5>
                    <p>conexiones: ${conexiones}</p>
                `;
                
                $("#div_hero1").html(parrafo1);

                let publicado           = data.biography.publisher;
                let ocupacion           = data.work.occupation;
                let primera_aparicion   = data.biography["first-appearance"];
                let altura              = data.appearance.height['0']+ " - "+data.appearance.height['1'];
                let peso                = data.appearance.weight['0']+ " - "+data.appearance.weight['1'];
                let alianzas            = "";
                
                for (const property in data.biography.aliases) {
                    alianzas = alianzas+` ${data.biography.aliases[property]}`;
                }
                

                let parrafo2    = `
                <small>
                    <p>publicado por: ${publicado}</p>
                    <p>ocupacion: ${ocupacion}</p>
                    <p>primera_aparicion: ${primera_aparicion}</p>
                    <p>altura: ${altura}</p>
                    <p>peso: ${peso}</p>
                    <p>alianzas: ${alianzas}</p>
                </small>
                `;

                $("#div_hero2").html(parrafo2);
                
                $("#imagen").attr("src",data.image.url);


                mostrar_grafico(data);
            }

        });
    }



    
});