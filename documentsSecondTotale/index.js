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
               <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> Adresses de Livraison </td>

               <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;">Détails </td>
               <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> Prix HT </td>
               <td style="border: 1px solid black; font-weight:900; text-align:center; background-color:gainsboro; font-size:7px;"> Prix TTC </td>


               </tr>
              
              
               ${getFacture(request)}
         

            </table>
           
          </div>
       </body>
    </html>
    `;
};


function  getNumberFixed2(number){
  let numberString = number + "";
  let posPoint = numberString.indexOf(".");
  if(posPoint > -1){
    let int = numberString.substr(0,posPoint);
    let desimale = numberString.substr(posPoint+1,2);
    if(desimale.length == 1){
      desimale += "0"
    }
    return(int + ","+desimale);
  }else{
    return numberString;
  }
}


function getFacture(request){
    let prixTotale = 0;
    let prixTotaleTtc = 0;

    let details = ""
    let somme = ``;
    for(let i = 0; i < request.commandes.length; i++){
        let date = getDateFormaFrancaise(request.commandes[i].date)

        prixTotale = getPrixHt(request.commandes[i].facture, request.commandes[i].factureAutomatique);
        prixTotaleTtc = getPrixTtc(request.commandes[i].facture, request.commandes[i].factureAutomatique);
        

        details = getDetails(request.commandes[i].facture, request.commandes[i].factureAutomatique);
       
        let raison = ""
        if(request.commandes[i].etat == "Annuler avec refacturation"){
          if( request.commandes[i].raisonAnnulation != 'Autre')
          raison = "("+request.commandes[i].raisonAnnulation+")"
          else
          raison = "("+request.commandes[i].detailsAnnulation+")"
        }

        if(request.commandes[i].etat != "Annuler avec refacturation"){
            somme += `
              <tr class="item">
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${date} </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].codeLivraison} </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].nomDestination} </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].adresseDepart} /// ${request.commandes[i].adresseArrive} </td>
           
                <td style="border: 1px solid black; text-align:center; font-size:7px;" >${details}</td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${getNumberFixed2(prixTotale)}€</td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${getNumberFixed2 (prixTotaleTtc)}€</td>
              </tr>
            `
        }else{
            somme += `
              <tr class="item">
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${date} </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].codeLivraison} </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].nomDestination} </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;">${request.commandes[i].adresseDepart} /// ${request.commandes[i].adresseArrive} </td>
           
                <td style="border: 1px solid black; text-align:center; font-size:7px;" >${details} <br> <span style="font-weight: 800;"> ${raison} </span> </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;"> <span style="text-decoration: line-through;" >${getNumberFixed2(prixTotale)}€ </span> <br> <span>${getNumberFixed2(prixTotale * 0.5)}€ </span> </td>
                <td style="border: 1px solid black; text-align:center; font-size:7px;"> <span style="text-decoration: line-through;" >${getNumberFixed2 (prixTotaleTtc)}€ </span> <br> <span>${getNumberFixed2(prixTotaleTtc * 0.5)}€ </span></td>
              </tr>
            `
        }

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

function getTime(heure1,minute1,heure2,minute2){
   
  let somme=""
  
  somme += heure1
  
  if(minute1 < 10){
     somme += ":0"+minute1
  }else{
     somme += ":"+minute1
  }
     
  somme += " - "
   
  somme += heure2
  
  if(minute2 < 10){
     somme += ":0"+minute2
  }else{
     somme += ":"+minute2
  }

  return somme 

}

function getDateFormaFrancaise(dateEnglaise){
  let somme = ""  
  let pos1 = dateEnglaise.indexOf("-")
  somme += "/"+dateEnglaise.substr(0, pos1)
  dateEnglaise = dateEnglaise.substr(pos1+1, dateEnglaise.length)

  pos1 = dateEnglaise.indexOf("-")
  somme = "/"+dateEnglaise.substr(0, pos1) + somme
  dateEnglaise = dateEnglaise.substr(pos1+1, dateEnglaise.length)
  
  somme = dateEnglaise + somme
  return somme 
}