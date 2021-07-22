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
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 15px;
             font-family: 'Helvetica Neue', 'Helvetica', #555;
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
                            <td style="font-size:7px; line-height:9px;">
                            
                               <span class="style-blod"> Numéro de commande :</span>  ${commande.codeLivraison} <br>
                               <span class="style-blod"> Date : </span> ${getDateFormaFrancaise(commande.date)} <br>
                            
                            </td>
                            <td style="font-size:7px; line-height:9px;">
                            
                            </td>
                         </tr>

                         <tr>
                           <td style="font-size:7px; line-height:9px;">
                             <span class="style-blod"> Client de départ:  </span> <br>
                             <br>
                             <span class="style-blod">Nom:  </span>  ${client.nom} <br>
                             <span class="style-blod">Adresse:  </span>${commande.adresseDepart} <br>
                             <!--<span class="style-blod">Tél: </span> ${client.telephone} <br>-->
                           </td>
                           <td style="font-size:7px; line-height:9px;">
                           </td>
                        </tr>

                         <tr>
                           <td style="font-size:7px; line-height:9px;">
                                  <span class="style-blod"> Client d'arrivée:  </span> <br>
                                  <br>
                                  <span class="style-blod">Nom:  </span> ${commande.nomDestination} <br>
                                  <span class="style-blod"> Adresse: </span> ${commande.adresseArrive} <br>
                           </td>
                           
                           <td style="font-size:7px; line-height:9px;">
                           </td>
                          
                          </tr>

                          <tr>
                           <td class="style-blod" style="font-size:7px; line-height:9px;" >
                              
                              <span class="style-blod"> Livraison : </span><br>
                              
                              <br>
                              
                             <!-- <span class="style-blod"> Etat : </span> ${commande.etat} <br> -->
                              <span class="style-blod"> Camion : </span> ${commande.typeCamion} <br>
                              <span class="style-blod"> Créneaux : </span> ${getTime(commande.heure, commande.minute, commande.heureFin, commande.minuteFin)} <br>
                              <span class="style-blod"> Etage : </span> ${commande.etageArrive} <br>
                              <span class="style-blod"> Poids :  </span>  ${commande.colis[0].poidsTotale} <br>
                              <span class="style-blod"> Colis :  </span>${commande.colis[0].nbr} <br>
                              <span class="style-blod">Tél:  </span>${commande.telephoneDestination} <br>
                                                     
                           </td>
                           <td style="font-size:7px;"> 
                             
                           
                           </td>
                          </tr>

                          <tr>
                          <!--<td class="style-blod" style="font-size:7px; line-height:9px;" >
                             
                             <span class="style-blod"> Adresses : </span><br>
                      
                             <br>
                             <span class="style-blod"> Adresse Départ : </span> ${commande.adresseDepart} <br>
                             <span class="style-blod"> Adresse Arrivée : </span> ${commande.adresseArrive} <br>
                             <span class="style-blod"> Distance : </span> ${commande.distance} km <br>
                        
                          </td>-->
                          <td style="font-size:7px;"> 
                            
                           
                          </td>
                         </tr>

                         <tr>
                        <!-- <td class="style-blod" style="font-size:7px; line-height:9px;" >
                            
                            <span class="style-blod"> Détails : </span><br>
                     
                            <br>
                            
                            ${getDetails(commande.factureAutomatique, commande.facture, commande)}

                         </td>-->

                         <td class="style-blod" style="font-size:7px; line-height:9px;" >
                            
                            <span class="style-blod"> Message client : </span><br>
                  
                            <br>
                            
                            ${commande.detailsCourse}

                         </td>

                         <td style="font-size:7px;"> 
                           
                          
                         </td>
                        </tr>

                      </table>
                   </td>
                </tr>
               
             </table>
             <br />

           

            <table class="table-colis" cellpadding="0" cellspacing="0">
              
               <tr>
                   
                   <td style="color:transparent; width:50%; font-size:7px; line-height:9px;"></td>
                   
                   <td>
                   
                   </td>
                </tr>
 
            </table>

          

            
          </div>
       </body>
    </html>
    `;
};



function getFactureGlobal(ht, tva, ttc, commande){
      
   let somme = `  
   <tr >
      <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">Total HT </td>
      <td style="border: 1px solid black;  text-align:center; font-size:7px; line-height:9px;"> ${ht.tofixed(2).replace(".",",")} €</td>
   </tr>
   <tr>
      <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;"> TVA 20,00% </td>
      <td style="border: 1px solid black; text-align:center; font-size:7px; line-height:9px;">${tva} €</td>
   </tr>
   <tr class="heading">
     <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;">Total TTC </td>
     <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> ${ttc.tofixed(2).replace(".",",")} €</td>
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
           <td style="border: 1px solid black; font-weight:900; text-align:center; font-size:7px; line-height:9px;"> ${(ttc * 0.6).tofixed(2).replace(".",",")} €</td>
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


function getHeures(commande){
     
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

function getDetails(facture, facture2, commande){
   
   let somme = ``;
   for(let i = 0; i < facture.length; i++){
      somme += facture[i].titre+`<br>`      
   }

   for(let i = 0; i < facture2.length; i++){
      somme += facture2[i].titre+`<br>`
   }

   if(commande.detailsCourse != ""){

      somme += `<br> <br> Message client : <br> <br>`+commande.detailsCourse+`<br>`
   }

   return somme;

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
