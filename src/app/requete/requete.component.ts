import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { DatePipe, formatDate } from '@angular/common';
import { FormGroup,FormControl, FormBuilder, Validators} from '@angular/forms';
import { Chart } from 'chart.js';
import { DataServiceService } from '../data-service.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-requete',
  templateUrl: './requete.component.html',
  styleUrls: ['./requete.component.css'],
  providers: [DatePipe]
})
export class RequeteComponent implements OnInit {
     
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  h2= this.headers;

  url = environment.elasticsearchUrl;
  page: any;
  chart1: any;

  // Pagination
  currentPage = 1;
  pageSize    = 9;
  get pagedHits(): any[] {
    const hits: any[] = this.page?.hits?.hits ?? [];
    return hits.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }
  get totalHits(): number  { return this.page?.hits?.hits?.length ?? 0; }
  get totalPages(): number { return Math.ceil(this.totalHits / this.pageSize); }
  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(this.totalPages, this.currentPage + 2); i++) pages.push(i);
    return pages;
  }
  goToPage(p: number) { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }
  // controle sur daterangz
  range=new FormGroup({
    start:new FormControl(),
    end: new FormControl()
  })
  langue:any
  aggs1:any
  aggs2:any
  aggs3:any
  doc:any 
  form!:FormGroup
  data3: Array<any> = []
  x1: Array<string> = []
  y1: Array<number> = []
  x2: Array<string> = []
  y2: Array<number> = []
  x3: Array<string> = []
  y3: Array<number> = []
  
  
  
 
  constructor(private http:HttpClient,private datePipe: DatePipe, private dataservice : DataServiceService, private formbuilder:FormBuilder) { 
   
  }

  ngOnInit(): void {
    //validation du formulaire
    this.form=this.formbuilder.group({
      
      langue_controler:['',Validators.required],
     
     
      size_controler:['',Validators.required],
     
    })
    this.range=this.formbuilder.group({
      start:['',Validators.required],
      end:['',Validators.required]
    })

    //initialisation d'une visualisation
    this.chart1= new Chart('canvas1', {})
}

 //recuperer les données en fonction des dates et langues
  onSearchByLangue_date(langue:any,dateStart:any,dateEnd:any,siz:any){

    //formater la date
    this.range.value.start=this.datePipe.transform(this.range.value.start,'yyyy-MM-dd')
    this.range.value.end=this.datePipe.transform(this.range.value.end,'yyyy-MM-dd')
    
    dateStart=this.range.value.start
    dateEnd=this.range.value.end
    
    //si l'utilisateur choisi toute les langues

    if(langue=="all"){
    this.http.post(this.url,
    {size:siz.size_controler,
    query: 
    {bool:{
      filter: {range: {"formattedDateOfPost":
                { from: dateStart,to:dateEnd}}}
    }
    },
  
    aggs : {
      nb_par_date : {
          terms : {field : "formattedDateOfPost",size: 1000}
      },
      nb_par_langue:{
        terms : {field : "langPost",size: 1000}
      }

   }},{headers:this.h2})
    .subscribe((data: any)=>{  
     
      this.doc=data
    
    //recuperation des aggregation pour faire les visualisations
    
    this.aggs1=this.doc.aggregations.nb_par_date.buckets

    this.aggs3=this.doc.aggregations.nb_par_langue.buckets
  //  console.log(this.aggs1)
    
      this.x1=[]
      this.y1=[]
      this.x3=[]
      this.y3=[]


          for(let i of this.aggs1)
          
          {
            this.x1.push(i.key_as_string)
            this.y1.push(i.doc_count)
          }
          for(let i of this.aggs3)
          
          {
            this.x3.push(i.key)
            this.y3.push(i.doc_count)
          }
   
    })
  }
  //si l'utilisateur choisi une langue specifique
    else
  {
      this.http.post(this.url,
        { size:siz.size_controler,
        query: 
    {bool:{
      must: {match: {"langPost":langue}},
      filter: {range: {"formattedDateOfPost":
                { from: dateStart,to:dateEnd}}}
    }
    },
        aggs : {
          nb_par_date: {
              terms : {field : "formattedDateOfPost",size: 1000}
          },
         
    }},{headers:this.h2})
    .subscribe((data: any)=>{  
      this.doc=data
    //recuperation des aggregation pour faire les visualisations
    this.aggs2=this.doc.aggregations.nb_par_date.buckets
    
      this.x2=[]
      this.y2=[]

          for(let i of this.aggs2)
          
          {
            this.x2.push(i.key_as_string)
            this.y2.push(i.doc_count)
          }
         
    })
      }
    

  }
  

// recuperer les données pour les afficher
data(){
  this.page = this.doc;
  this.currentPage = 1;
 // console.log(this.page)

}
// Premiere visualisation
Visualisation1(langue:any){
  this.chart1.destroy()
  
  //si l'utilisateur choisi toutes les langues
  if(langue=='all')
  {
    
    this.chart1= new Chart('canvas1', {
      type:'line',
      data:{
          labels:this.x1,
        datasets:[
          {
           label:'data',
            data:this.y1,
            borderColor:'rgba(31, 114, 225 )',
            backgroundColor:'rgba(135,206,250)',
            borderWidth:4,
            pointBorderWidth:5,
            pointBorderColor:'rgba(31, 114, 225 )',
            pointHoverBackgroundColor:'rgba(255,255,255)',
          
            
          },
        ]
  
      },
      options:{
        responsive:true,
        legend:{
          position:'top',
          display:true
        },
        title:{
          display:true,
          text:'Visualisation des données en fonctions des dates',
          fontSize:20
        },
        scales:{
          xAxes:[{
            display:false
          }],
          yAxes: [{
            display:true,
            ticks: {
              beginAtZero: true,
              fontColor:'rgba(172, 190, 215)',
              
            }
          }]
  
        }
        
      }
  
    })
    this.x1=[]
    this.x1=[]
  }
  //si l'utilisateur choisi une langue specifique
  else{
    
  this.chart1 = new Chart('canvas1', {
    type:'line',
    data:{
      //absices
     labels:this.x2,
      datasets:[
        {
          label:"data",
          //ordonnées
          data:this.y2,
         

          
          borderColor:'rgba(255,20,147)',
          backgroundColor:'rgba(255,228,225)',
          borderWidth:4,
          pointBorderWidth:5,
          pointBorderColor:'rgba(255,20,147)',
          pointHoverBackgroundColor:'rgba(255,255,255)',
         
           
        }
      ]

    },
    // option de la vu des visualisations
    options:{
      responsive:true,
      legend:{
        position:'top',
        display:true
      },
      title:{
        display:true,
        text:'Visualisation des données en '+this.langue+' en fonctions des dates',
        fontSize:20
      },
      scales:{
        xAxes:[{
          display:false,
        }],
        yAxes: [{
          display:true,
          ticks: {
            beginAtZero: true,
            fontColor:'rgba(205, 182, 240)',
            
          }
        }]

      }
      
    }

  })
  
  }
  
  
}
// deuxieme visualisation
Visualisation2(langue:any){
  this.chart1.destroy()


  //si l'utilisateur choisi toutes les langues

  if(langue=='all')
  {
    
    this.chart1= new Chart('canvas1', {
      type:'doughnut',
      data:{
        //absices
       labels:this.x3,
        datasets:[
          {
            //ordonnes
            data:this.y3,
          
            borderColor:'rgba(236, 247, 245)',
            backgroundColor:
              [
              'rgba(52, 152, 219)' ,  
              'rgba(255,20,147)',        
              'rgba(255,255,0 )',
              'rgba(218,112,214)',
               
                ],
                hoverBackgroundColor:'rgba(236, 247, 245)',
                hoverBorderWidth:10,  
            
          
            
          },
        ]
  
      },
      // option de la vu des visualisations
      options:{
        responsive:true,
        legend:{
          position:'top',

        },
        title:{
          display:true,
          text:'repartion des données en fonctions des langues et de la periode',
          fontSize:20,
   
        },

        
      
      }
      
    })
    

  }
   //si l'utilisateur choisi une langue specifique
  else{
    
  this.chart1= new Chart('canvas1', {
    type:'bar',
    data:{
      //absises
        labels:this.x2,
      datasets:[
        {
          //ordonneés
          label:'data',
          data:this.y2,
          borderColor:'rgba(205,133,63 )',
          backgroundColor:'rgba(244,164,96)' ,
          borderWidth:4,
          hoverBackgroundColor:'rgba(255,255,255)'
        },
    
      ]

    },
    // option de la vu des visualisations
    options:{
      title:{
        display:true,
        text:'Visualisation des données en '+this.langue+' en fonctions des dates',
        fontSize:20
      },
    scales: {
      xAxes:[{
        display:false
      }],

        yAxes: [{
          display:true,
          ticks: {
            beginAtZero: true,
            fontColor:'rgba(2, 56, 5)' ,
            
          }
        }]
      
      
    }
  }
  })
 
}

  // telechargement des données en fichier csv
}
fileDowload(){
   // si le tableau contient des données
   //console.log(this.doc?.hits?.hits.length)
  
  
  this.data3=[]
  // recuperation des données et les mettre dans un tableau
    for(let i of this.doc?.hits?.hits)
   
    {
      this.data3.push({
      IdOwner:i._source.idOwner,
      IdPost:i._source.idPost,
      DateOfInsertion:i._source.dateOfInsertion,
      DateOfPost:i._source.dateOfPost,
      FormattedDateOfPost:i._source.formattedDateOfPost,
      LangPost:i._source.langPost,
      Content:i._source.content,
      TreatedPost:i._source.treatedPost,
      UrlPost:i._source.urlPost,
      WebsiteUrl:i._source.websiteUrl,
      });
    }
   
    // option de la mise en forme du fichier csv
    
    var options = { 
      fieldSeparator : ',' , 
      quoteString:'"',
      decimalseparator : '.' ,
      useBom:true,
      headers: ["IdOwner","IdPost","DateOfInsertion","DateOfPost", "FormattedDateOfPost"," LangPost",,"Content","TreatedPost","UrlPost","WebsiteUrl"],
      useHeaders:true,
      nullToEmptyString: true,
    };
   
  
    new AngularCsv(this.data3, "Data-"+this.getDate1()+"-"+this.getCurrentTime(),options);

 
}
    
getDownloadStatus()
{  let t= this.dataservice.getTel()
    if(t=='1')
    {
      return true
    }
    return false;

}
getDate1()
{ let d =formatDate(new Date(), 'yyyy/MM/dd', 'en')
  return d;
}

getCurrentTime() {
  let today = new Date();
  let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
  let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
  let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
  return hours + '-' + minutes + '-' + seconds;
 }

  
}
