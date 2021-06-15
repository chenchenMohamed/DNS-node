module.exports = (request, client) => {
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
             line-height: 12px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 20px;
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
             padding-bottom: 10px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 20px;
             line-height: 20px;
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

             th{
                font-size:11px;
             }

             td{
               font-size:11px;
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
            

            <table class="table-colis" cellpadding="0" cellspacing="0" style="border-collapse: collapse;>
               
               <tr class="heading" style="background-color:gray;">
                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;">Date livraison </td>
                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> N° de commande </td>
                  
                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;">Nom du client </td>
                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> Adresse de livraison </td>

                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;">Détails </td>
                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> Prix(HT) </td>
                  <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> Prix TTC(20%) </td>

               </tr>
              
              
               ${getFacture(request)}
         

            </table>
           
          </div>
       </body>
    </html>
    `;
};




function getFacture(request){
    let prixTotale = 0;
    let prixTotaleTtc = 0;

    let details = ""
    let somme = ``;
    for(let i = 0; i < request.commandes.length; i++){
        prixTotale = getPrixHt(request.commandes[i].facture, request.commandes[i].factureAutomatique);
        prixTotaleTtc = getPrixTtc(request.commandes[i].facture, request.commandes[i].factureAutomatique);
        details = getDetails(request.commandes[i].facture, request.commandes[i].factureAutomatique);
        somme += `
          <tr class="item">
            <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].date} </td>
            <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].codeLivraison} </td>
            <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].nomDestination} </td>
            <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].adresseDepart} - ${request.commandes[i].adresseArrive} </td>
       
            <td style="border: 1px solid black; text-align:center; font-size:7px;" >${details}</td>
            <td style="border: 1px solid black; text-align:center; font-size:7px;">${(prixTotale).toFixed(2)} €</td>
            <td style="border: 1px solid black; text-align:center; font-size:7px;">${(prixTotaleTtc).toFixed(2)} €</td>
          </tr>
        `

    }

    
    return somme
}



function getPrixHt(facture, facture2){
    let prixTotale = 0;
    let prixTotaleTtc = 0;

    for(let i = 0; i < facture.length; i++){
        prixTotale += facture[i].valeur;
        prixTotaleTtc += facture[i].valeurTtc;
              
    }

    for(let i = 0; i < facture2.length; i++){
        prixTotale += facture2[i].valeur;
        prixTotaleTtc += facture2[i].valeurTtc;
              
    }

   

    return prixTotale
}

function getPrixTtc(facture, facture2){
  let prixTotale = 0;
  let prixTotaleTtc = 0;

  for(let i = 0; i < facture.length; i++){
      prixTotale += facture[i].valeur;
      prixTotaleTtc += facture[i].valeurTtc;
  }

  for(let i = 0; i < facture2.length; i++){
      prixTotale += facture2[i].valeur;
      prixTotaleTtc += facture2[i].valeurTtc;
  }

  return prixTotaleTtc
}


function getDetails(facture, facture2){
  
  let somme = ""

  for(let i = 0; i < facture.length; i++){
    somme += facture[i].titre +" ," 
  }

  for(let i = 0; i < facture2.length; i++){
    somme += facture2[i].titre+" ," 
  }

  return somme
}