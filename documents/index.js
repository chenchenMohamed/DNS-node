module.exports = (commande, client) => {
    const today = new Date();

    const ht = parseFloat(getPrixHT(commande.factureAutomatique, commande.facture));
    const ttc = parseFloat(getPrixTTC(commande.factureAutomatique, commande.facture));
    const tva = parseFloat(ttc - ht);
return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .invoice-box {
               max-width: 800px;
               min-height: 770px;
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
                               <h1 class="style-blod" style="font-size:15px; color:blue;"> DNA Transport </h1>
                            </td>
                            <td style="font-size:7px; line-height:9px;">
                              Facture n° : ${commande.num} <br>
                              En Date du : (${`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`})
                            </td>
                         </tr>

                         <tr>
                            <td style="font-size:7px; line-height:9px;">
                               1 square condillac appt 92 77100 Meaux <br> <br>

                               <span class="style-blod; font-size:7px;"> Tél </span> (+33) 6 51 50 61 46 <br> <br>
                               <span style="color:blue; font-size:7px;"> Mail1: contact@dna-transport.fr </span> <br>
                               <span style="color:blue; font-size:7px;"> Mail2: info@dna-transport.fr </span> <br>
                               <span style="color:blue; font-size:7px;"> Mail3: naseh5@msn.com </span>
                      
                            </td>
                            <td style="font-size:7px; line-height:9px;">
                              <span class="style-blod"> ${client.entreprise}  </span> <br>
                              ${client.adresse}
                            </td>
                         </tr>

                        

                          <tr>
                           <td class="style-blod" style="font-size:7px; line-height:9px;" >
                             N° Siret 849 307 210 00013 <br>
                             N° TVA. FR 41 849 307 210 
                           </td>
                           <td style="font-size:7px;"> Etat : ${getEtat(commande)}</td>
                          </tr>

                      </table>
                   </td>
                </tr>
               
             </table>
             <br />

             <table class="table-colis" cellpadding="0" cellspacing="0" style="border-collapse: collapse;" >
                <tr class="heading">
                   <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;">Description </td>
                   <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> Quantité </td>
                </tr>
                <tr>
                   <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">Prestations de transport entre  ${getTime(commande.heure, commande.minute, commande.heureFin, commande.minuteFin)} le ${getDateFormaFrancaise(commande.date)}</td>
                   <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">${commande.factureAutomatique.length + commande.facture.length}</td>
                </tr>

             </table>

            <table class="table-colis" cellpadding="0" cellspacing="0" style="padding-right:0px; padding-right:0px;">
              
               <tr style="padding-right:0px; padding-right:0px;">
                   <td style="color:transparent; width:50%; font-size:7px; line-height:9px;"></td>
                   <td style="padding-right:0px; padding-right:0px;">
                        <table class="table-colis" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width:100% padding-right:0px; padding-right:0px;">
                           
                        ${getFactureGlobal(ht, tva, ttc, commande)}
   
                        </table>
                     </td>
                </tr>
 
            </table>

            <table class="table-colis" cellpadding="0" cellspacing="0" style="margin-top:130px;">
              
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
              
              
               ${getFacture(commande, client, commande.factureAutomatique, commande.facture)}
         

            </table>
           
          </div>

       </body>
    </html>
    `;
};


function getEtat(commande){
   if(commande.etat == 'Complete'){
      return "Complété"
   }else{
      return commande.etat
   }
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

function getFactureGlobal(ht, tva, ttc, commande){
      
   let somme = `  
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
   ` 

   if(commande.etat == "Annuler avec refacturation"){
      somme += `
         <tr class="heading">
            <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;">Raison l'annulation </td>
            <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> ${commande.raisonAnnulation + " : "+ commande.detailsAnnulation} </td>
         </tr>   
         <tr class="heading">
           <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;">  60% de total TTC </td>
           <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> ${getNumberFixed2(ttc * 0.5)} €</td>
         </tr> 
      ` 
   }

   return somme

}

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


function getTime(heure1,minute1,heure2,minute2){
   
   let somme= heure1+":"
   if(minute1 < 10){
      somme += "0"+minute1
    }else{
      somme += minute1
    }

    somme += " et "
    
    somme += heure2+":"

   if(minute2 < 10){
      somme += "0"+minute2
    }else{
      somme += minute2
    }

    somme += " "
    
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

 
function getNumberFixed2(number){
   let numberString = number + "";
   let posPoint = numberString.indexOf(".");
   if(posPoint > -1){
     let int = numberString.substr(0,posPoint);
     let desimale = numberString.substr(posPoint+1,2);
     return(int + ","+desimale);
   }else{
      return numberString;
   }
 }
 
 function getFacture(commande, client, facture, facture2){
     let prixTotale = 0;
     let prixTotaleTtc = 0;
 
     let somme = ``;
     for(let i = 0; i < facture.length; i++){
         prixTotale += facture[i].valeur;
         prixTotaleTtc += facture[i].valeurTtc;
               
         somme += `
           <tr class="item">
             <td style="border: 1px solid black; text-align:center; font-size:7px;">${getDateFormaFrancaise(commande.date)} </td>
             <td style="border: 1px solid black; text-align:center; font-size:7px;">${commande.codeLivraison} </td>
             <td style="border: 1px solid black; text-align:center; font-size:7px;">${commande.nomDestination} </td>
             <td style="border: 1px solid black; text-align:center; font-size:7px;">${commande.adresseArrive} </td>
        
             <td style="border: 1px solid black; text-align:center; font-size:7px;" >${facture[i].titre}</td>
             <td style="border: 1px solid black; text-align:center; font-size:7px;">${getNumberFixed2(facture[i].valeur)} €</td>
             <td style="border: 1px solid black; text-align:center; font-size:7px;">${getNumberFixed2(facture[i].valeurTtc)} €</td>
           </tr>
         `
     }
 
     for(let i = 0; i < facture2.length; i++){
         prixTotale += facture2[i].valeur;
         prixTotaleTtc += facture2[i].valeurTtc;
         let date = getDateFormaFrancaise(commande.date)
               
         somme += `
         <tr class="item">
           <td style="border: 1px solid black; text-align:center; font-size:7px;">${date} </td>
           <td style="border: 1px solid black; text-align:center; font-size:7px;">${commande.codeLivraison} </td>
           <td style="border: 1px solid black; text-align:center; font-size:7px;">${client.nom} </td>
           <td style="border: 1px solid black; text-align:center; font-size:7px;">${client.adresse} </td>
    
           <td style="border: 1px solid black; text-align:center; font-size:7px;" >${facture2[i].titre}</td>
           <td style="border: 1px solid black; text-align:center; font-size:7px;">${getNumberFixed2(facture2[i].valeur)} €</td>
           <td style="border: 1px solid black; text-align:center; font-size:7px;">${getNumberFixed2(facture2[i].valeurTtc)} €</td>
     
         </tr>
         `
 
     }
 
     let raison = ""
     if(commande.etat == "Annuler avec refacturation"){
       if( commande.raisonAnnulation != 'Autre')
       raison = "("+commande.raisonAnnulation+")"
       else
       raison = "("+commande.detailsAnnulation+")"
     }
 
     if(commande.etat == "Annuler avec refacturation"){
       somme += `
       <tr class="item">
         <td style=" text-align:center; font-size:7px;"></td>
         <td style=" text-align:center; font-size:7px;"></td>
         <td style=" text-align:center; font-size:7px;"></td>
         <td style=" text-align:center; font-size:7px;"></td>
  
         <td style=" text-align:center; font-size:7px;" ></td>
         <td style="border: 1px solid black; text-align:center; font-size:10px;">Raison d'annulation:</td>
         <td style="border: 1px solid black; text-align:center; font-size:10px;">${raison}</td>
   
       </tr>
       `
 
       somme += `
       <tr class="item">
         <td style=" text-align:center; font-size:7px;"></td>
         <td style=" text-align:center; font-size:7px;"></td>
         <td style=" text-align:center; font-size:7px;"></td>
         <td style=" text-align:center; font-size:7px;"></td>
  
         <td style=" text-align:center; font-size:7px;" ></td>
         <td style="border: 1px solid black; text-align:center; font-size:10px;">Prix total TTC:</td>
         <td style="border: 1px solid black; text-align:center; font-size:10px;"><span style="text-decoration: line-through;" >${getNumberFixed2 (prixTotaleTtc)}€ </span> <br> <span>${getNumberFixed2(prixTotaleTtc * 0.5)}€ </span></td>
   
       </tr>
       `
 
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
         <td>${prixTotale.tofixed(2).replace(".",",")} €</td>
       </tr>
     `
 
     somme += `
       <tr class="item">
         <td>TTC:</td>
         <td class="table-colis-2"></td>
         <td>${(prixTotaleTtc - prixTotale).tofixed(2).replace(".",",")} €</td>
       </tr>
     `
     
     somme += `
       <tr class="item">
         <td>Prix avec TTC:</td>
         <td class="table-colis-2"></td>
         <td>${prixTotaleTtc.tofixed(2).replace(".",",")} € </td>
       </tr>
     `
 
 
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
