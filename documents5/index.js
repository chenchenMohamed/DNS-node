module.exports = (commande, client) => {
    const today = new Date();

    const ht = getPrixHT(commande.factureAutomatique, commande.facture);
    const ttc = getPrixTTC(commande.factureAutomatique, commande.facture);
    const tva = (ttc - ht);
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
             line-height: 15px;
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
             padding-bottom: 15px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 15px;
             line-height: 15px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 10px;
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

             td{
                font-size:15px;
             }
             th{
               font-size:15px;
             }

             .style-blod{
               font-weight:900 !important;
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
                               <img  src="./logo.png" style=" max-width:100px;">
                            </td>
                            <td style="font-size:7px; line-height:9px;">
                            N° livraison : ${commande.codeLivraison} <br>
                            En Date du : (${`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`})
                            </td>
                         </tr>

                         <tr>
                            <td style="font-size:7px; line-height:9px;">
                               <span class="style-blod"> DNA Transport </span> <br>
                               1 square condillac appt 92 77100 Meaux
                            </td>
                            <td style="font-size:7px; line-height:9px;">
                              <span class="style-blod"> ${client.nom}  </span> <br>
                              ${client.adresse}
                            </td>
                         </tr>

                         <tr>
                           <td style="font-size:7px; line-height:9px;">
                              <span class="style-blod; font-size:7px;"> Tél </span> (+33) 6 51 50 61 46 <br>
                              <span style="color:blue; font-size:7px;"> Mail : contact@dna-transport.fr </span> <br>
                           </td>
                           <td></td>
                          </tr>

                          <tr>
                           <td class="style-blod" style="font-size:7px; line-height:9px;" >
                             N° Siret 849 307 210 00013 <br>
                             N° TVA. FR 41 849 307 210 
                           </td>
                           <td style="font-size:7px;"> Etat : ${commande.etat}</td>
                          </tr>

                      </table>
                   </td>
                </tr>
               
             </table>
             <br />

             <table class="table-colis" cellpadding="0" cellspacing="0" style="border-collapse: collapse;>
                <tr class="heading">
                   <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;">Description </td>
                   <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> Quantité </td>
                </tr>
                <tr>
                   <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">Prestations de transport entre  ${getTime(commande.heure, commande.modeTime, commande.heureFin, commande.modeTimeFin)} le ${commande.date}</td>
                   <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">${commande.factureAutomatique.length + commande.facture.length}</td>
                </tr>

             </table>

            <table class="table-colis" cellpadding="0" cellspacing="0">
              
               <tr>
                   <td style="color:transparent; width:50%; font-size:7px; line-height:9px;"></td>
                   <td>
                        <table class="table-colis" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100%">
                           
                           <tr >
                              <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">Total HT </td>
                              <td style="border: 1px solid black;  text-align:center; font-size:7px; line-height:9px;"> ${getNumberFixed2(ht)} €</td>
                           </tr>
                           <tr>
                              <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;"> TVA 20,00% </td>
                              <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">${getNumberFixed2(tva)} €</td>
                           </tr>
                           <tr class="heading">
                             <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;">Total TTC </td>
                             <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> ${getNumberFixed2(ttc)} €</td>
                           </tr>
   
                        </table>
                     </td>
                </tr>
 
            </table>

            <table class="table-colis" cellpadding="0" cellspacing="0">
              
                <tr>
                    <td style="width:50%; font-size:7px; line-height:9px;">
                    Conditions de paiement : paiement à réception de facture<br>
                    Mode de paiement : par virement ou chèque<br>
                    Nous vous remercions de votre confiance<br>
                    Cordialement
                    </td>
                    <td style="color:transparent; width:50%; font-size:7px; line-height:9px;"></td>
                </tr>

            </table>

            
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
            <td style="font-size:7px; line-height:9px;">${colis[i].nbr}</td>
            <td class="table-colis-2" style="font-size:7px; line-height:9px;">${prixTotale} kg</td>
            <td style="font-size:7px; line-height:9px;">${dimensions}</td>
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
            <td style="font-size:7px; line-height:9px;">${facture[i].titre}</td>
            <td style="font-size:7px; line-height:9px;" class="table-colis-2">${facture[i].valeur} €</td>
            <td style="font-size:7px; line-height:9px;">${facture[i].valeurTtc} €</td>
          </tr>
        `

    }

    for(let i = 0; i < facture2.length; i++){
        prixTotale += facture2[i].valeur;
        prixTotaleTtc += facture2[i].valeurTtc;
              
        somme += `
          <tr class="item">
            <td style="font-size:7px; line-height:9px;">${facture2[i].titre}</td>
            <td style="font-size:7px; line-height:9px;" class="table-colis-2">${facture2[i].valeur} €</td>
            <td style="font-size:7px; line-height:9px;">${facture2[i].valeurTtc} €</td>
          </tr>
        `

    }

    return somme
}


function getPrixHT(facture, facture2){
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
   return prixTotale;
}

function getPrixTTC(facture, facture2){
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

   return prixTotaleTtc;

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
        <td style="font-size:7px; line-height:9px;">Prix net:</td>
        <td style="font-size:7px; line-height:9px;" class="table-colis-2"></td>
        <td style="font-size:7px; line-height:9px;">${prixTotale} €</td>
      </tr>
    `

    somme += `
      <tr class="item">
        <td style="font-size:7px; line-height:9px;">TTC:</td>
        <td style="font-size:7px; line-height:9px;" class="table-colis-2"></td>
        <td style="font-size:7px; line-height:9px;">${prixTotaleTtc - prixTotale} €</td>
      </tr>
    `
    
    somme += `
      <tr class="item">
        <td style="font-size:7px; line-height:9px;">Prix avec TTC:</td>
        <td style="font-size:7px; line-height:9px;" class="table-colis-2"></td>
        <td style="font-size:7px; line-height:9px; line-height:9px;">${prixTotaleTtc} € </td>
      </tr>
    `


    return somme
}


function getTime(heure1,mode1,heure2,mode2){
   
   let somme=""
   if(heure1 < 10){
      somme += heure1
    }else{
       if(mode1 == "PM"){
         somme += (heure1+12)
       }else{
         somme += heure1
       }
      
    }

    somme += "h et "
    
    if(heure2 < 10){
      somme += heure2
    }else{
      if(mode2 == "PM"){
         somme += (heure2+12)
       }else{
         somme += heure2
       }
    
    }

    somme += "h"

    return somme 

}

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
