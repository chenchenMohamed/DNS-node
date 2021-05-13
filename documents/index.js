module.exports = (commande, client) => {
    const today = new Date();
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
             }

             .invoice-box table tr td:nth-child(3) {
                text-align: right;
             }


             .table-colis-2{
                text-align: center !important;
             }
             
       
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class="title">
                               <img  src="http://localhost:3000/logo.png" style="width:100%; max-width:156px;">
                            </td>
                            <td>
                               Datum: ${`${today.getDate()}/ ${today.getMonth() + 1}/ ${today.getFullYear()} (${today.getHours()}:${today.getMinutes()})`}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td>
                               Numéro de Commande: ${commande.codeLivraison}
                               <br>
                               Numéro de client: ${client.num}
                               <br>
                               Nom de client: ${client.nom}
                               <br>
                               Téléphone: ${client.nom}
                               <br>
                               Entreprise: ${client.nom}
                               <br>
                               Adresse: ${client.adresse}
                               
                            </td>
                            <td>
                               
                               Numéro de livraison: ${commande.num}
                               <br>
                               Date de livraison: ${commande.date}
                               <br>
                               Heure de debut:${commande.heure}:${commande.minute}:${commande.modeTime}
                               <br>
                               Heure de fin:${commande.heureFin}:${commande.minuteFin}:${commande.modeTimeFin}
                               <br>
                               Etage:${commande.etageArrive}
                               <br>
                               Adresse de livraison: ${commande.adresseArrive}
                            
                            </td>
                         </tr>
                         <tr>
                            <td>
                              Distance: ${commande.distance} km
                              <br>
                              Creneaux: ${commande.creneaux} Minute
                               
                            </td>
                            <td>
                               
                             Type de camion:${commande.typeCamion}
                              
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
              
             </table>
             <br />

             <table class="table-colis" cellpadding="0" cellspacing="0">
                <tr class="heading">
                
                   <td colspan="3">Colis</td>
               
                </tr>
                <tr class="heading">
                   <td>Nombre:</td>
                   <td class="table-colis-2">Poids Totale</td>
                   <td>Dimensions</td>
                </tr>

                ${getColis(commande.colis)}
                
             </table>

            <table class="table-colis" cellpadding="0" cellspacing="0">
                <tr class="heading">
                
                   <td colspan="3">Facture</td>
               
                </tr>
                <tr class="heading">
                   <td>Service</td>
                   <td class="table-colis-2">Prix</td>
                   <td>Prix avec TTC</td>
                </tr>

                ${getFacture(commande.factureAutomatique, commande.facture)}
             
            </table>

            <table class="table-colis" cellpadding="0" cellspacing="0">
                <tr class="heading">
                
                   <td colspan="3">Prix totale</td>
               
                </tr>
                
                ${getFacture2(commande.factureAutomatique, commande.facture)}
             
            </table>

             <h1 class="justify-center">DNA TRANSPORT</h1>
          </div>
       </body>
    </html>
    `;
};


function getColis(colis){
    let somme = ``
    
    for(let i = 0; i < colis.length; i++){
        let prixTotale = 0;
        if(colis[i].poidsTotale == 0){
            prixTotale = colis[i].nbr * colis[i].poids
        }else{
            prixTotale = colis[i].poidsTotale
        }

        let dimensions = ""
        if(colis[i].hauteur == 0){
            dimensions = "inférieure a 2.3m"
        }else if(colis[i].hauteur == 3){
            dimensions = "entre 2.3m et 3.4m"
        }else{
            dimensions = "supérieure a 3.4m"
        }

        somme += `
          <tr class="item">
            <td>${colis[i].nbr}</td>
            <td class="table-colis-2">${prixTotale} kg</td>
            <td>${dimensions}</td>
          </tr>
        `

    }

    return somme
}


function getFacture(facture, facture2){
    let prixTotale = 0;
    let prixTotaleTtc = 0;

    let somme = ``;
    for(let i = 0; i < facture.length; i++){
        prixTotale += facture[i].valeur;
        prixTotaleTtc += facture[i].valeurTtc;
              
        somme += `
          <tr class="item">
            <td>${facture[i].titre}</td>
            <td class="table-colis-2">${facture[i].valeur} €</td>
            <td>${facture[i].valeurTtc} €</td>
          </tr>
        `

    }

    for(let i = 0; i < facture2.length; i++){
        prixTotale += facture2[i].valeur;
        prixTotaleTtc += facture2[i].valeurTtc;
              
        somme += `
          <tr class="item">
            <td>${facture2[i].titre}</td>
            <td class="table-colis-2">${facture2[i].valeur} €</td>
            <td>${facture2[i].valeurTtc} €</td>
          </tr>
        `

    }

    return somme
}



function getFacture2(facture, facture2){
    let prixTotale = 0;
    let prixTotaleTtc = 0;

    let somme = ``;
    for(let i = 0; i < facture.length; i++){
        prixTotale += facture[i].valeur;
        prixTotaleTtc += facture[i].valeurTtc;
              
    }

    for(let i = 0; i < facture2.length; i++){
        prixTotale += facture2[i].valeur;
        prixTotaleTtc += facture2[i].valeurTtc;
              
    }

   
    somme += `
      <tr class="item">
        <td>Prix net:</td>
        <td class="table-colis-2"></td>
        <td>${prixTotale} €</td>
      </tr>
    `

    somme += `
      <tr class="item">
        <td>TTC:</td>
        <td class="table-colis-2"></td>
        <td>${prixTotaleTtc - prixTotale} €</td>
      </tr>
    `
    
    somme += `
      <tr class="item">
        <td>Prix avec TTC:</td>
        <td class="table-colis-2"></td>
        <td>${prixTotaleTtc} € </td>
      </tr>
    `


    return somme
}